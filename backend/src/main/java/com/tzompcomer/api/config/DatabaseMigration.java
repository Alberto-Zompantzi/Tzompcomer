package com.tzompcomer.api.config;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.repository.CategoriaRepository;
import com.tzompcomer.api.repository.DepartamentoRepository;
import com.tzompcomer.api.repository.ProductoRepository;
import com.tzompcomer.api.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DatabaseMigration - DESACTIVADO
 * La migración de la base de datos se realizó manualmente en Neon.
 * Este componente ya no ejecuta ninguna alteración de tablas.
 */
@Component
@RequiredArgsConstructor
public class DatabaseMigration implements CommandLineRunner {

    private final ProductoRepository productoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ExcelImportService excelImportService;

    @Override
    public void run(String... args) {
        System.out.println("ℹ️ DatabaseMigration DESACTIVADO: Migración realizada manualmente en Neon.");

        // Solo mantenemos la importación automática inicial si la DB está completamente vacía
        autoImportExcelOnlyIfEmpty();
    }

    /**
     * Método público para migrar productos desde la relación antigua (departamento) a la nueva (categoriaEntity)
     */
    public void migrarProductosANuevaRelacion() {
        System.out.println("🔄 Iniciando migración de productos...");

        // Paso 1: Crear las 4 macrocategorías si no existen
        List<String> macroNames = List.of(
            "Desechables y Envases",
            "Bolsas (Plástico, kraft, papel)",
            "Materias Primas",
            "Ferretería y Herramientas"
        );
        Map<String, Departamento> macros = new HashMap<>();
        for (String name : macroNames) {
            Departamento macro = departamentoRepository.findByNombre(name).orElseGet(() -> {
                Departamento newMacro = Departamento.builder().nombre(name).activo(true).build();
                return departamentoRepository.save(newMacro);
            });
            macros.put(name, macro);
            System.out.println("✅ Macrocategoría: " + name);
        }

        // Paso 2: Migrar departamentos antiguos a categorías
        List<Departamento> oldDepartments = departamentoRepository.findAll();
        Map<String, Categoria> categoriasMap = new HashMap<>();
        
        for (Departamento oldDept : oldDepartments) {
            if (macroNames.contains(oldDept.getNombre())) continue; // Saltar las macrocategorías

            // Obtener o crear la categoría
            Categoria categoria = categoriaRepository.findByNombre(oldDept.getNombre()).orElseGet(() -> {
                // Asignar a la macrocategoría correcta
                String macroName = getMacrocategoriaForCategoria(oldDept.getNombre());
                Departamento macro = macros.get(macroName);
                
                Categoria newCat = Categoria.builder()
                    .nombre(oldDept.getNombre())
                    .departamento(macro)
                    .activo(true)
                    .build();
                return categoriaRepository.save(newCat);
            });
            categoriasMap.put(oldDept.getNombre(), categoria);
            System.out.println("✅ Categoría: " + oldDept.getNombre());
        }

        // Paso 3: Actualizar productos
        List<Producto> productos = productoRepository.findAll();
        int actualizados = 0;
        for (Producto producto : productos) {
            if (producto.getCategoriaEntity() == null && producto.getDepartamento() != null) {
                String deptName = producto.getDepartamento().getNombre();
                Categoria categoria = categoriasMap.get(deptName);
                if (categoria != null) {
                    producto.setCategoriaEntity(categoria);
                    productoRepository.save(producto);
                    actualizados++;
                }
            }
        }

        System.out.println("✅ Migración completada! Productos actualizados: " + actualizados);
    }

    private String getMacrocategoriaForCategoria(String categoriaNombre) {
        Map<String, String> mapping = new HashMap<>();
        // Desechables y Envases
        mapping.put("Desechable", "Desechables y Envases");
        mapping.put("Vasos", "Desechables y Envases");
        mapping.put("Platos", "Desechables y Envases");
        mapping.put("Contenedores", "Desechables y Envases");
        mapping.put("Dulces", "Desechables y Envases");
        mapping.put("Abarrotes", "Desechables y Envases");
        mapping.put("Papelería", "Desechables y Envases");
        // Bolsas
        mapping.put("Plástico", "Bolsas (Plástico, kraft, papel)");
        // Materias Primas
        mapping.put("Materia prima", "Materias Primas");
        mapping.put("Materias Primas", "Materias Primas");
        mapping.put("Harinas", "Materias Primas");
        mapping.put("Azúcares", "Materias Primas");
        // Ferretería y Herramientas
        mapping.put("Ferretería", "Ferretería y Herramientas");
        mapping.put("Herramientas", "Ferretería y Herramientas");
        mapping.put("Gaviota", "Ferretería y Herramientas");
        mapping.put("Inix", "Ferretería y Herramientas");

        return mapping.getOrDefault(categoriaNombre, "Desechables y Envases");
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
