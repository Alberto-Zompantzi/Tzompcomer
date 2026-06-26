package com.tzompcomer.api.controller;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<Categoria>> getAll() {
        return ResponseEntity.ok(categoriaService.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Categoria>> getActive() {
        return ResponseEntity.ok(categoriaService.findActive());
    }

    @GetMapping("/macrocategoria/{macrocategoriaId}")
    public ResponseEntity<List<Categoria>> getByMacrocategoria(@PathVariable Long macrocategoriaId) {
        return ResponseEntity.ok(categoriaService.findByMacrocategoria(macrocategoriaId));
    }

    @GetMapping("/macrocategoria/{macrocategoriaId}/active")
    public ResponseEntity<List<Categoria>> getActiveByMacrocategoria(@PathVariable Long macrocategoriaId) {
        return ResponseEntity.ok(categoriaService.findActiveByMacrocategoria(macrocategoriaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getById(@PathVariable Long id) {
        return categoriaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categoria> create(@RequestBody Categoria categoria) {
        return ResponseEntity.ok(categoriaService.save(categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> update(@PathVariable Long id, @RequestBody Categoria categoriaDetails) {
        Categoria updated = categoriaService.update(id, categoriaDetails);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (categoriaService.findById(id).isPresent()) {
            categoriaService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
