package com.tzompcomer.api.controller;

import com.tzompcomer.api.entity.Subcategoria;
import com.tzompcomer.api.service.SubcategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategorias")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SubcategoriaController {

    private final SubcategoriaService subcategoriaService;

    @GetMapping
    public ResponseEntity<List<Subcategoria>> getAll() {
        return ResponseEntity.ok(subcategoriaService.findAll());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Subcategoria>> getByCategoriaId(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(subcategoriaService.findByCategoriaId(categoriaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subcategoria> getById(@PathVariable Long id) {
        return subcategoriaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Subcategoria> create(@RequestBody Subcategoria subcategoria) {
        return ResponseEntity.ok(subcategoriaService.save(subcategoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subcategoria> update(@PathVariable Long id, @RequestBody Subcategoria subcategoriaDetails) {
        return subcategoriaService.findById(id)
                .map(subcategoria -> {
                    subcategoria.setNombre(subcategoriaDetails.getNombre());
                    subcategoria.setImagenUrl(subcategoriaDetails.getImagenUrl());
                    if (subcategoriaDetails.getCategoria() != null) {
                        subcategoria.setCategoria(subcategoriaDetails.getCategoria());
                    }
                    return ResponseEntity.ok(subcategoriaService.save(subcategoria));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (subcategoriaService.findById(id).isPresent()) {
            subcategoriaService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
