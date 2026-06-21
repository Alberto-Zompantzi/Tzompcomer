package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.repository.DepartamentoRepository;
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
    private final DepartamentoRepository departamentoRepository;

    private static final int BATCH_SIZE = 100;

    @Transactional
    public Map<String, Object> importExcel(MultipartFile file) throws IOException {
        int totalProcessed = 0;
        int created = 0;
        int updated = 0;

        // BORRAR TODOS LOS DATOS ANTERIORES
        log.info("Borrando productos y departamentos antiguos...");
        productoRepository.deleteAll();
        departamentoRepository.deleteAll();
        log.info("Base de datos limpiada correctamente!");

        try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            if (rows.hasNext()) {
                rows.next(); // Saltar encabezados
            }

            // 1. Cargar todos los departamentos a un Map para evitar consultas repetitivas
            Map<String, Departamento> departamentoMap = new HashMap<>();
            List<Departamento> allDepartamentos = departamentoRepository.findAll();
            for (Departamento d : allDepartamentos) {
                departamentoMap.put(d.getNombre().toLowerCase().trim(), d);
            }

            // 2. Cargar todos los productos existentes por SKU para upsert eficiente
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
                    // Columna 7: Departamento → relación
                    String departamentoNombre = getCellValueAsString(currentRow.getCell(7));
                    if (departamentoNombre == null || departamentoNombre.trim().isEmpty()) {
                        departamentoNombre = "General";
                    }
                    departamentoNombre = departamentoNombre.toLowerCase().trim();

                    // Obtener o crear departamento
                    Departamento departamento = departamentoMap.get(departamentoNombre);
                    if (departamento == null) {
                        departamento = new Departamento();
                        departamento.setNombre(departamentoNombre.substring(0, 1).toUpperCase() + departamentoNombre.substring(1));
                        departamento.setIdentificadorIcono(departamentoNombre);
                        departamento = departamentoRepository.save(departamento);
                        departamentoMap.put(departamentoNombre, departamento);
                    }

                    // Lógica: crear nuevos productos (todo es nuevo porque borramos todo antes!
                    Producto producto = Producto.builder()
                            .sku(sku)
                            .nombre(nombre)
                            .descripcion(descripcion)
                            .precio(precio)
                            .departamento(departamento)
                            .disponible(disponible)
                            .categoria(departamentoNombre)
                            .imagenUrl(departamentoNombre)
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
