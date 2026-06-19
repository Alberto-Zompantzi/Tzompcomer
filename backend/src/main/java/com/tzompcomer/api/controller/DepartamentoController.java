package com.tzompcomer.api.controller;

import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.service.DepartamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamentos")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    @GetMapping
    public ResponseEntity<List<Departamento>> getAll() {
        return ResponseEntity.ok(departamentoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departamento> getById(@PathVariable Long id) {
        return departamentoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Departamento> create(@RequestBody Departamento departamento) {
        return ResponseEntity.ok(departamentoService.save(departamento));
    }
}
