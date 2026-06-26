package com.tzompcomer.api.controller;

import com.tzompcomer.api.config.DatabaseMigration;
import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.service.ExcelImportService;
import com.tzompcomer.api.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductoController {

    private final ProductoService productoService;
    private final ExcelImportService excelImportService;
    private final DatabaseMigration databaseMigration;

    @GetMapping("/productos/all")
    public ResponseEntity<List<Producto>> getAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/productos/visible")
    public ResponseEntity<List<Producto>> getVisible() {
        return ResponseEntity.ok(productoService.findVisible());
    }

    @GetMapping("/productos/search-all")
    public ResponseEntity<List<Producto>> searchAll(@RequestParam(required = false) String searchTerm) {
        return ResponseEntity.ok(productoService.searchAll(searchTerm));
    }

    // NUEVOS ENDPOINTS PARA ASIGNACIÓN MASIVA
    @GetMapping("/productos/excel-categorias")
    public ResponseEntity<List<String>> getExcelCategorias() {
        return ResponseEntity.ok(productoService.findDistinctExcelCategorias());
    }

    @PostMapping("/productos/assign-excel-to-categoria")
    public ResponseEntity<Map<String, String>> assignExcelToCategoria(@RequestBody Map<String, Object> request) {
        String excelCategoria = request.get("excelCategoria").toString();
        Long categoriaId = Long.valueOf(request.get("categoriaId").toString());
        productoService.assignExcelCategoriaToCategoria(excelCategoria, categoriaId);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Productos de la etiqueta '" + excelCategoria + "' asignados exitosamente a la categoría");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/productos/assign-excel-to-macrocategoria")
    public ResponseEntity<Map<String, String>> assignExcelToMacrocategoria(@RequestBody Map<String, Object> request) {
        String excelCategoria = request.get("excelCategoria").toString();
        Long macrocategoriaId = Long.valueOf(request.get("macrocategoriaId").toString());
        String categoriaNombre = request.get("categoriaNombre").toString();
        productoService.assignExcelCategoriaToMacrocategoria(excelCategoria, macrocategoriaId, categoriaNombre);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Productos de la etiqueta '" + excelCategoria + "' asignados exitosamente a la categoría '" + categoriaNombre + "'");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/productos")
    public ResponseEntity<Page<Producto>> search(
            @RequestParam(required = false) Long macrocategoriaId,
            @RequestParam(required = false) String searchTerm,
            @PageableDefault(size = 30) Pageable pageable) {
        return ResponseEntity.ok(productoService.search(macrocategoriaId, searchTerm, pageable));
    }

    @DeleteMapping("/admin/cache")
    public ResponseEntity<Map<String, String>> clearCache() {
        productoService.clearCache();
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Caché limpiada exitosamente");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> getById(@PathVariable Long id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/productos")
    public ResponseEntity<Producto> create(@RequestBody Producto producto) {
        return ResponseEntity.ok(productoService.save(producto));
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @RequestBody Producto producto) {
        Producto productoActualizado = productoService.update(id, producto);
        if (productoActualizado != null) {
            return ResponseEntity.ok(productoActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/productos/assign-categoria")
    public ResponseEntity<Map<String, String>> assignToCategoria(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<Long> productoIds = (List<Long>) request.get("productoIds");
        Long categoriaId = Long.valueOf(request.get("categoriaId").toString());
        productoService.assignToCategoria(productoIds, categoriaId);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Productos asignados exitosamente");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return productoService.findById(id)
                .map(existing -> {
                    productoService.softDeleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().<Void>build());
    }

    @PostMapping("/admin/upload-excel")
    public ResponseEntity<Map<String, Object>> uploadExcel(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> result = excelImportService.importExcel(file);
            result.put("status", "success");
            result.put("message", "Importación completada exitosamente");
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("status", "error");
            errorResult.put("message", "Error al importar el archivo: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResult);
        }
    }
}
