package com.tzompcomer.api.controller;

import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.service.ExcelImportService;
import com.tzompcomer.api.service.ProductoService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/productos/all")
    public ResponseEntity<List<Producto>> getAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/productos")
    public ResponseEntity<Page<Producto>> search(
            @RequestParam(required = false) Long departamentoId,
            @RequestParam(required = false) String searchTerm,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(productoService.search(departamentoId, searchTerm, pageable));
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
        return productoService.findById(id)
                .map(existing -> {
                    producto.setId(id);
                    return ResponseEntity.ok(productoService.save(producto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
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
