package com.tzompcomer.api.controller;

import com.tzompcomer.api.entity.Macrocategoria;
import com.tzompcomer.api.service.MacrocategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/macrocategorias")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MacrocategoriaController {

    private final MacrocategoriaService macrocategoriaService;

    @GetMapping
    public ResponseEntity<List<Macrocategoria>> getAll() {
        return ResponseEntity.ok(macrocategoriaService.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Macrocategoria>> getActive() {
        return ResponseEntity.ok(macrocategoriaService.findActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Macrocategoria> getById(@PathVariable Long id) {
        return macrocategoriaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Macrocategoria> create(@RequestBody Macrocategoria macrocategoria) {
        return ResponseEntity.ok(macrocategoriaService.save(macrocategoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Macrocategoria> update(@PathVariable Long id, @RequestBody Macrocategoria macrocategoriaDetails) {
        Macrocategoria updated = macrocategoriaService.update(id, macrocategoriaDetails);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (macrocategoriaService.findById(id).isPresent()) {
            macrocategoriaService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
