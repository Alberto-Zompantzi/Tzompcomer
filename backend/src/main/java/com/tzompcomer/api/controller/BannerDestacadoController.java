package com.tzompcomer.api.controller;

import com.tzompcomer.api.entity.BannerDestacado;
import com.tzompcomer.api.service.BannerDestacadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banner-destacados")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BannerDestacadoController {

    private final BannerDestacadoService bannerDestacadoService;

    @GetMapping
    public ResponseEntity<List<BannerDestacado>> getAll() {
        return ResponseEntity.ok(bannerDestacadoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BannerDestacado> getById(@PathVariable Long id) {
        return bannerDestacadoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BannerDestacado> create(@RequestBody BannerDestacado banner) {
        return ResponseEntity.ok(bannerDestacadoService.save(banner));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (bannerDestacadoService.findById(id).isPresent()) {
            bannerDestacadoService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
