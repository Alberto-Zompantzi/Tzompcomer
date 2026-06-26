package com.tzompcomer.api.service;

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

    private static final int BATCH_SIZE = 100;

    @Transactional
    public Map<String, Object> importExcel(MultipartFile file) throws IOException {
        return importExcel(file.getInputStream());
    }

    @Transactional
    public Map<String, Object> importExcel(InputStream is) throws IOException {
        int totalProcessed = 0;
        int created = 0;
        int updated = 0;

        // BORRAR TODOS LOS DATOS ANTERIORES (solo productos, macrocategorías y categorías se mantienen)
        log.info("Borrando productos antiguos...");
        productoRepository.deleteAll();
        log.info("Productos eliminados correctamente!");

        try (Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            if (rows.hasNext()) {
                rows.next(); // Saltar encabezados
            }

            // 1. Cargar todos los productos existentes por SKU para upsert eficiente
            Map<String, Producto> existingProductosMap = new HashMap<>();
            List<Producto> allProductos = productoRepository.findAll();
            for (Producto p : allProductos) {
                existingProductosMap.put(p.getSku(), p);
            }

            List<Producto> batch = new ArrayList<>();

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                totalProcessed++;

                try {
                    // Columnas del Excel real
                    // Columna 0: Codigo → sku
                    String sku = getCellValueAsString(currentRow.getCell(0));
                    if (sku == null || sku.trim().isEmpty()) {
                        continue;
                    }

                    // Columna 1: Descripcion → nombre y descripcion
                    String descripcion = getCellValueAsString(currentRow.getCell(1));
                    String nombre = descripcion.length() > 100 ? descripcion.substring(0, 100) : descripcion;

                    // Columna 2: Precio Costo → ignorar
                    // Columna 3: Precio Venta → precio
                    BigDecimal precio = getCellValueAsBigDecimal(currentRow.getCell(3));
                    if (precio == null) {
                        precio = BigDecimal.ZERO;
                    }

                    // Columna 4: Precio Mayoreo → ignorar
                    // Columna 5: Inventario → stock (si > 0 → disponible true)
                    BigDecimal inventario = getCellValueAsBigDecimal(currentRow.getCell(5));
                    boolean disponible = inventario != null && inventario.compareTo(BigDecimal.ZERO) > 0;

                    // Columna 6: Inv. Minimo → ignorar
                    // Columna 7: Departamento → guardar como etiqueta (categoria)
                    String categoriaNombre = getCellValueAsString(currentRow.getCell(7));
                    if (categoriaNombre == null || categoriaNombre.trim().isEmpty()) {
                        categoriaNombre = "General";
                    }
                    categoriaNombre = categoriaNombre.toLowerCase().trim();

                    // Columna 8: Imagen URL (opcional)
                    String imagenUrl = getCellValueAsString(currentRow.getCell(8));
                    if (imagenUrl == null || imagenUrl.trim().isEmpty()) {
                        imagenUrl = categoriaNombre;
                    }

                    // Lógica: crear nuevos productos (todo es nuevo porque borramos todo antes!
                    Producto producto = Producto.builder()
                            .sku(sku)
                            .nombre(nombre)
                            .descripcion(descripcion)
                            .precio(precio)
                            .disponible(disponible)
                            .categoria(categoriaNombre)
                            .imagenUrl(imagenUrl)
                            .build();
                    created++;

                    batch.add(producto);

                    if (batch.size() >= BATCH_SIZE) {
                        saveBatch(batch);
                        batch.clear();
                    }
                } catch (Exception e) {
                    log.error("Error procesando fila " + (totalProcessed + 1), e);
                }
            }

            if (!batch.isEmpty()) {
                saveBatch(batch);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalProcessed", totalProcessed);
        result.put("created", created);
        return result;
    }

    private void saveBatch(List<Producto> batch) {
        productoRepository.saveAll(batch);
        log.info("Guardado lote de {} productos", batch.size());
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
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
                    yield new BigDecimal(cell.getStringCellValue());
                } catch (NumberFormatException e) {
                    yield BigDecimal.ZERO;
                }
            }
            default -> BigDecimal.ZERO;
        };
    }
}
