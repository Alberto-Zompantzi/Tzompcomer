package com.tzompcomer.api.controller;

import com.tzompcomer.api.service.AnalisisPalabrasService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AnalisisController {

    private final AnalisisPalabrasService analisisService;

    public AnalisisController(AnalisisPalabrasService analisisService) {
        this.analisisService = analisisService;
    }

    @GetMapping("/top-palabras")
    public List<AnalisisPalabrasService.ResultadoAnalisis> getTopPalabras() {
        return analisisService.obtenerTop20Palabras();
    }

    @GetMapping("/top-negocio")
    public List<AnalisisPalabrasService.ResultadoAnalisis> getTopNegocio() {
        return analisisService.obtenerTop20Negocio();
    }
}
