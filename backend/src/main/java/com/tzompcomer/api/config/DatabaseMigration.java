package com.tzompcomer.api.config;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.repository.CategoriaRepository;
import com.tzompcomer.api.repository.DepartamentoRepository;
import com.tzompcomer.api.repository.ProductoRepository;
import com.tzompcomer.api.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DatabaseMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final ProductoRepository productoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ExcelImportService excelImportService;

    // Definimos las 4 macrocategorías correctas y su mapeo a categorías
    private static final List<String> MACROCATEGORIAS = List.of(
        "Desechables y Envases",
        "Bolsas (Plástico, kraft, papel)",
        "Materias Primas",
        "Ferretería y Herramientas"
    );

    // Mapeo de categorías antiguas a macrocategorías correctas
    private static final Map<String, String> CATEGORIA_A_MACROCATEGORIA = new HashMap<>();
    static {
        // Desechables y Envases
        CATEGORIA_A_MACROCATEGORIA.put("Desechable", "Desechables y Envases");
        CATEGORIA_A_MACROCATEGORIA.put("Plástico", "Bolsas (Plástico, kraft, papel)");
        CATEGORIA_A_MACROCATEGORIA.put("Vasos", "Desechables y Envases");
        CATEGORIA_A_MACROCATEGORIA.put("Platos", "Desechables y Envases");
        CATEGORIA_A_MACROCATEGORIA.put("Contenedores", "Desechables y Envases");
        // Materias Primas
        CATEGORIA_A_MACROCATEGORIA.put("Materia prima", "Materias Primas");
        CATEGORIA_A_MACROCATEGORIA.put("Materias Primas", "Materias Primas");
        CATEGORIA_A_MACROCATEGORIA.put("Harinas", "Materias Primas");
        CATEGORIA_A_MACROCATEGORIA.put("Azúcares", "Materias Primas");
        // Ferretería y Herramientas
        CATEGORIA_A_MACROCATEGORIA.put("Ferretería", "Ferretería y Herramientas");
        CATEGORIA_A_MACROCATEGORIA.put("Herramientas", "Ferretería y Herramientas");
        CATEGORIA_A_MACROCATEGORIA.put("Gaviota", "Ferretería y Herramientas");
        CATEGORIA_A_MACROCATEGORIA.put("Inix", "Ferretería y Herramientas");
        // Otras categorías que podrían existir
        CATEGORIA_A_MACROCATEGORIA.put("Dulces", "Desechables y Envases");
        CATEGORIA_A_MACROCATEGORIA.put("Abarrotes", "Desechables y Envases");
        CATEGORIA_A_MACROCATEGORIA.put("Papelería", "Desechables y Envases");
    }

    @Override
    public void run(String... args) {
        // 1. Asegurar que las tablas tienen las columnas necesarias
        addMissingColumns();

        // 2. Crear las 4 macrocategorías correctas
        createMacrocategorias();

        // 3. Migrar departamentos antiguos a categorías
        migrateOldDepartmentsToCategories();

        // 4. Auto-importar Excel si la DB está vacía
        autoImportExcel();
    }

    private void addMissingColumns() {
        // Añadir columna 'activo' a departamentos
        try {
            Integer columnExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'DEPARTAMENTOS' AND COLUMN_NAME = 'ACTIVO'",
                Integer.class
            );
            if (columnExists != null && columnExists == 0) {
                jdbcTemplate.execute("ALTER TABLE departamentos ADD COLUMN activo BOOLEAN DEFAULT TRUE");
                System.out.println("✅ Columna 'activo' añadida correctamente a departamentos");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error al añadir columna 'activo' a departamentos: " + e.getMessage());
        }

        // Añadir columna 'activo' a categorias
        try {
            Integer columnExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'CATEGORIAS' AND COLUMN_NAME = 'ACTIVO'",
                Integer.class
            );
            if (columnExists != null && columnExists == 0) {
                jdbcTemplate.execute("ALTER TABLE categorias ADD COLUMN activo BOOLEAN DEFAULT TRUE");
                System.out.println("✅ Columna 'activo' añadida correctamente a categorias");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error al añadir columna 'activo' a categorias: " + e.getMessage());
        }

        // Añadir columna 'departamento_id' a categorias
        try {
            Integer columnExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'CATEGORIAS' AND COLUMN_NAME = 'DEPARTAMENTO_ID'",
                Integer.class
            );
            if (columnExists != null && columnExists == 0) {
                jdbcTemplate.execute("ALTER TABLE categorias ADD COLUMN departamento_id BIGINT REFERENCES departamentos(id)");
                System.out.println("✅ Columna 'departamento_id' añadida correctamente a categorias");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error al añadir columna 'departamento_id' a categorias: " + e.getMessage());
        }

        // Añadir columna 'categoria_entity_id' a productos
        try {
            Integer columnExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'PRODUCTOS' AND COLUMN_NAME = 'CATEGORIA_ENTITY_ID'",
                Integer.class
            );
            if (columnExists != null && columnExists == 0) {
                jdbcTemplate.execute("ALTER TABLE productos ADD COLUMN categoria_entity_id BIGINT REFERENCES categorias(id)");
                System.out.println("✅ Columna 'categoria_entity_id' añadida correctamente a productos");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error al añadir columna 'categoria_entity_id' a productos: " + e.getMessage());
        }
    }

    private void createMacrocategorias() {
        for (String nombre : MACROCATEGORIAS) {
            if (departamentoRepository.findByNombre(nombre).isEmpty()) {
                Departamento departamento = Departamento.builder()
                    .nombre(nombre)
                    .activo(true)
                    .build();
                departamentoRepository.save(departamento);
                System.out.println("✅ Macrocategoría creada: " + nombre);
            }
        }
    }

    private void migrateOldDepartmentsToCategories() {
        // Obtener todas las macrocategorías
        Map<String, Departamento> macroMap = new HashMap<>();
        for (Departamento macro : departamentoRepository.findAll()) {
            macroMap.put(macro.getNombre(), macro);
        }

        // Obtener departamentos antiguos (que no son las 4 macrocategorías) y migrarlos a categorías
        List<Departamento> oldDepartments = departamentoRepository.findAll().stream()
            .filter(d -> !MACROCATEGORIAS.contains(d.getNombre()))
            .toList();

        for (Departamento oldDept : oldDepartments) {
            // Verificar si ya existe la categoría
            if (categoriaRepository.findByNombre(oldDept.getNombre()).isEmpty()) {
                // Encontrar la macrocategoría correspondiente
                String macroNombre = CATEGORIA_A_MACROCATEGORIA.getOrDefault(
                    oldDept.getNombre(),
                    "Desechables y Envases" // Default si no se encuentra
                );
                Departamento macro = macroMap.get(macroNombre);

                // Crear la categoría
                Categoria categoria = Categoria.builder()
                    .nombre(oldDept.getNombre())
                    .departamento(macro)
                    .activo(true)
                    .build();
                categoriaRepository.save(categoria);
                System.out.println("✅ Departamento '" + oldDept.getNombre() + "' migrado a categoría en '" + macroNombre + "'");

                // Actualizar productos que tenían este departamento
                // Primero, obtener el ID de la categoría recién creada
                Categoria savedCategoria = categoriaRepository.findByNombre(oldDept.getNombre()).orElse(null);
                if (savedCategoria != null) {
                    jdbcTemplate.update(
                        "UPDATE productos SET categoria_entity_id = ? WHERE departamento_id = ?",
                        savedCategoria.getId(),
                        oldDept.getId()
                    );
                    System.out.println("✅ Productos actualizados para la categoría '" + oldDept.getNombre() + "'");
                }
            }
        }
    }

    private void autoImportExcel() {
        // Auto-importar Excel si la DB está vacía
        try {
            if (productoRepository.count() == 0 && departamentoRepository.count() == MACROCATEGORIAS.size()) {
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
