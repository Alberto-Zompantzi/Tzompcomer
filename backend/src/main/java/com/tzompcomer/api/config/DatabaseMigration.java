package com.tzompcomer.api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

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
    }
}
