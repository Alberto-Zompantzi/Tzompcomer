package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.entity.Producto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelImportService {

    private final ProductoService productoService;
    private final DepartamentoService departamentoService;

    private static final int BATCH_SIZE = 50;

    @Transactional
    public void importExcel(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            if (rows.hasNext()) {
                rows.next();
            }

            List<Producto> batch = new ArrayList<>();
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                
                String nombre = getCellValueAsString(currentRow.getCell(0));
                String departamentoNombre = getCellValueAsString(currentRow.getCell(1));
                String categoria = getCellValueAsString(currentRow.getCell(2));
                BigDecimal precio = getCellValueAsBigDecimal(currentRow.getCell(3));
                String sku = getCellValueAsString(currentRow.getCell(4));

                if (sku == null || sku.trim().isEmpty()) continue;

                Departamento departamento = departamentoService.getOrCreateByName(departamentoNombre);

                Producto producto = productoService.findBySku(sku)
                        .map(p -> {
                            p.setPrecio(precio);
                            p.setDisponible(true);
                            p.setNombre(nombre);
                            p.setCategoria(categoria);
                            p.setDepartamento(departamento);
                            return p;
                        })
                        .orElse(Producto.builder()
                                .sku(sku)
                                .nombre(nombre)
                                .categoria(categoria)
                                .precio(precio)
                                .departamento(departamento)
                                .disponible(true)
                                .build());

                batch.add(producto);

                if (batch.size() >= BATCH_SIZE) {
                    saveBatch(batch);
                    batch.clear();
                }
            }

            if (!batch.isEmpty()) {
                saveBatch(batch);
            }
        }
    }

    private void saveBatch(List<Producto> batch) {
        for (Producto p : batch) {
            productoService.save(p);
        }
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
