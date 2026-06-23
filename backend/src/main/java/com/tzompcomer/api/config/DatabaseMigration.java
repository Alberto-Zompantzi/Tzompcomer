package com.tzompcomer.api.config;

import com.tzompcomer.api.repository.DepartamentoRepository;
import com.tzompcomer.api.repository.ProductoRepository;
import com.tzompcomer.api.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
@RequiredArgsConstructor
public class DatabaseMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final ProductoRepository productoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final ExcelImportService excelImportService;

    @Override
    public void run(String... args) {
        try {
            // Verificar si la columna 'activo' existe
            Integer columnExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PRODUCTOS' AND COLUMN_NAME = 'ACTIVO'",
                Integer.class
            );

            if (columnExists != null && columnExists == 0) {
                // Añadir la columna 'activo' con valor DEFAULT TRUE
                jdbcTemplate.execute("ALTER TABLE productos ADD COLUMN activo BOOLEAN DEFAULT TRUE");
                System.out.println("✅ Columna 'activo' añadida correctamente a la tabla productos");

                // Actualizar cualquier registro existente
                jdbcTemplate.update("UPDATE productos SET activo = TRUE WHERE activo IS NULL");
                System.out.println("✅ Todos los productos existentes marcados como activos");
            } else {
                System.out.println("ℹ️ Columna 'activo' ya existe, no es necesario migrar");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error durante la migración (probablemente la columna ya existe): " + e.getMessage());
        }

        // Auto-importar Excel si la DB está vacía
        try {
            if (productoRepository.count() == 0 && departamentoRepository.count() == 0) {
                System.out.println("📦 Base de datos vacía, intentando importar datos desde productos.xlsx...");
                ClassPathResource resource = new ClassPathResource("productos.xlsx");
                if (resource.exists()) {
                    try (InputStream is = resource.getInputStream()) {
                        var result = excelImportService.importExcel(is);
                        System.out.println("✅ Importación automática completada! Procesados: " + result.get("totalProcessed") + ", creados: " + result.get("created"));
                    }
                } else {
                    System.out.println("ℹ️ No se encontró productos.xlsx en resources, omitiendo importación automática");
                }
            } else {
                System.out.println("ℹ️ Base de datos ya tiene datos, omitiendo importación automática");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error durante la importación automática: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
