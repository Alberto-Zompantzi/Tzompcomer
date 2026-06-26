package com.tzompcomer.api.service;

import com.tzompcomer.api.catalog.CatalogConstants;
import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelImportService {

    private final ProductoRepository productoRepository;
    private final ProductClassifierService classifierService;
    private final ProductImageService productImageService;
    private final CatalogSeedService catalogSeedService;

    private static final int BATCH_SIZE = 100;

    @Transactional
    public Map<String, Object> importExcel(MultipartFile file) throws IOException {
        return importExcel(file.getInputStream(), null, null);
    }

    @Transactional
    public Map<String, Object> importExcel(InputStream is) throws IOException {
        return importExcel(is, null, null);
    }

    @Transactional
    public Map<String, Object> importExcel(InputStream is, Set<String> departamentosFilter, String macroNombreFilter)
            throws IOException {
        catalogSeedService.seedCatalogIfEmpty();
        catalogSeedService.loadCache();

        int totalProcessed = 0;
        int created = 0;
        int updated = 0;
        int skipped = 0;
        int classified = 0;

        Map<String, Producto> existingBySku = new HashMap<>();
        for (Producto p : productoRepository.findAll()) {
            existingBySku.put(p.getSku(), p);
        }

        Set<String> allowedDepartments = resolveAllowedDepartments(departamentosFilter, macroNombreFilter);

        try (Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            if (rows.hasNext()) {
                rows.next();
            }

            List<Producto> batch = new ArrayList<>();

            while (rows.hasNext()) {
                Row row = rows.next();
                totalProcessed++;

                try {
                    String sku = getCellValueAsString(row.getCell(0)).trim();
                    if (sku.isEmpty()) {
                        continue;
                    }

                    String descripcion = getCellValueAsString(row.getCell(1)).trim();
                    if (descripcion.isEmpty()) {
                        continue;
                    }

                    String excelDept = normalizeDept(getCellValueAsString(row.getCell(7)));
                    if (!classifierService.isB2BDepartment(excelDept)) {
                        skipped++;
                        continue;
                    }
                    if (allowedDepartments != null && !allowedDepartments.contains(excelDept)) {
                        skipped++;
                        continue;
                    }

                    String nombre = descripcion.length() > 120 ? descripcion.substring(0, 120) : descripcion;
                    BigDecimal precio = getCellValueAsBigDecimal(row.getCell(3));
                    BigDecimal inventario = getCellValueAsBigDecimal(row.getCell(5));
                    boolean disponible = inventario.compareTo(BigDecimal.ZERO) > 0;

                    String macroNombre = classifierService.resolveMacroNombre(excelDept);
                    String categoryName = classifierService.classifyCategoryName(excelDept, nombre, descripcion);
                    Categoria categoria = catalogSeedService.resolveCategory(macroNombre, categoryName);
                    classified++;

                    String imagenUrl = productImageService.resolveProductImage(nombre, descripcion, categoryName, macroNombre);

                    Producto existing = existingBySku.get(sku);
                    if (existing != null) {
                        existing.setNombre(nombre);
                        existing.setDescripcion(descripcion);
                        existing.setPrecio(precio);
                        existing.setDisponible(disponible);
                        existing.setCategoria(excelDept);
                        existing.setCategoriaEntity(categoria);
                        existing.setImagenUrl(imagenUrl);
                        existing.setActivo(true);
                        batch.add(existing);
                        updated++;
                    } else {
                        Producto producto = Producto.builder()
                                .sku(sku)
                                .nombre(nombre)
                                .descripcion(descripcion)
                                .precio(precio)
                                .disponible(disponible)
                                .activo(true)
                                .categoria(excelDept)
                                .categoriaEntity(categoria)
                                .imagenUrl(imagenUrl)
                                .build();
                        batch.add(producto);
                        existingBySku.put(sku, producto);
                        created++;
                    }

                    if (batch.size() >= BATCH_SIZE) {
                        productoRepository.saveAll(batch);
                        batch.clear();
                    }
                } catch (Exception e) {
                    log.error("Error procesando fila {}", totalProcessed + 1, e);
                }
            }

            if (!batch.isEmpty()) {
                productoRepository.saveAll(batch);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalProcessed", totalProcessed);
        result.put("created", created);
        result.put("updated", updated);
        result.put("skipped", skipped);
        result.put("classified", classified);
        return result;
    }

    @Transactional
    public Map<String, Object> reclassifyAllProducts() {
        catalogSeedService.loadCache();
        int reclassified = 0;
        List<Producto> productos = productoRepository.findByActivoTrue();
        for (Producto producto : productos) {
            if (producto.getCategoria() == null || !classifierService.isB2BDepartment(producto.getCategoria())) {
                continue;
            }
            String macro = classifierService.resolveMacroNombre(producto.getCategoria());
            String catName = classifierService.classifyCategoryName(
                    producto.getCategoria(), producto.getNombre(), producto.getDescripcion());
            Categoria categoria = catalogSeedService.resolveCategory(macro, catName);
            producto.setCategoriaEntity(categoria);
            producto.setImagenUrl(productImageService.resolveProductImage(
                    producto.getNombre(), producto.getDescripcion(), catName, macro));
            reclassified++;
        }
        productoRepository.saveAll(productos);
        Map<String, Object> result = new HashMap<>();
        result.put("reclassified", reclassified);
        return result;
    }

    private Set<String> resolveAllowedDepartments(Set<String> departamentosFilter, String macroNombreFilter) {
        if (departamentosFilter != null && !departamentosFilter.isEmpty()) {
            Set<String> normalized = new HashSet<>();
            for (String d : departamentosFilter) {
                normalized.add(normalizeDept(d));
            }
            return normalized;
        }
        if (macroNombreFilter != null && !macroNombreFilter.isBlank()) {
            for (CatalogConstants.MacroDefinition macro : CatalogConstants.MACROS) {
                if (macro.nombre().equalsIgnoreCase(macroNombreFilter.trim())) {
                    Set<String> deps = new HashSet<>();
                    for (String d : macro.departamentosExcel()) {
                        deps.add(normalizeDept(d));
                    }
                    return deps;
                }
            }
        }
        return null;
    }

    private String normalizeDept(String dept) {
        if (dept == null || dept.isBlank()) {
            return "";
        }
        return dept.toLowerCase().trim();
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                double val = cell.getNumericCellValue();
                if (val == Math.floor(val)) {
                    yield String.valueOf((long) val);
                }
                yield String.valueOf(val);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private BigDecimal getCellValueAsBigDecimal(Cell cell) {
        if (cell == null) return BigDecimal.ZERO;
        return switch (cell.getCellType()) {
            case NUMERIC -> BigDecimal.valueOf(cell.getNumericCellValue());
            case STRING -> {
                try {
                    yield new BigDecimal(cell.getStringCellValue().trim());
                } catch (NumberFormatException e) {
                    yield BigDecimal.ZERO;
                }
            }
            default -> BigDecimal.ZERO;
        };
    }
}
