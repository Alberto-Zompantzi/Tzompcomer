package com.tzompcomer.api.config;

import com.tzompcomer.api.repository.ProductoRepository;
import com.tzompcomer.api.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * DatabaseMigration - DESACTIVADO
 * La migración de la base de datos se realizó manualmente en Neon.
 * Este componente ya no ejecuta ninguna alteración de tablas.
 */
@Component
@RequiredArgsConstructor
public class DatabaseMigration implements CommandLineRunner {

    private final ProductoRepository productoRepository;
    private final ExcelImportService excelImportService;

    @Override
    public void run(String... args) {
        System.out.println("ℹ️ DatabaseMigration DESACTIVADO: Migración realizada manualmente en Neon.");

        // Solo mantenemos la importación automática inicial si la DB está completamente vacía
        autoImportExcelOnlyIfEmpty();
    }

    private void autoImportExcelOnlyIfEmpty() {
        try {
            if (productoRepository.count() == 0) {
                System.out.println("📦 Base de datos completamente vacía, intentando importar datos desde productos.xlsx...");
                ClassPathResource resource = new ClassPathResource("productos.xlsx");
                if (resource.exists()) {
                    try (InputStream is = resource.getInputStream()) {
                        var result = excelImportService.importExcel(is);
                        System.out.println("✅ Importación automática completada! Procesados: " + result.get("totalProcessed") + ", creados: " + result.get("created"));
                    }
                } else {
                    System.out.println("ℹ️ No se encontró productos.xlsx en resources, omitiendo importación automática");
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error durante la importación automática: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
