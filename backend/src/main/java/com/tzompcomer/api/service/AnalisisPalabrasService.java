package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.repository.ProductoRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AnalisisPalabrasService {

    private final ProductoRepository productoRepository;

    // Stopwords en español
    private static final Set<String> STOPWORDS = Set.of(
            "de", "la", "el", "en", "y", "para", "con", "por", "un", "una",
            "los", "las", "del", "al", "se", "es", "son", "su", "sus", "o",
            "a", "como", "mas", "más", "no", "si", "que", "lo", "tu", "te",
            "me", "mi", "yo", "ella", "nos", "vos", "esta", "este",
            "esto", "esos", "esas", "pero", "sin"
    );

    // Palabras clave del negocio
    private static final Set<String> KEYWORDS_NEGOCIO = Set.of(
            "vaso", "vasos", "bolsa", "bolsas", "plato", "platos", "tapa", "tapitas",
            "domo", "domos", "harina", "harinas", "caja", "cajas", "servilleta",
            "servilletas", "contenedor", "contenedores", "dulce", "dulces", "plastico",
            "desechable", "desechables", "taza", "tazas", "cuchara",
            "cucharas", "tenedor", "tenedores", "charola", "charolas", "cubierto",
            "cubiertos", "recipiente", "recipientes", "papel", "papeles", "carton",
            "film", "foil", "aluminio"
    );

    @Data
    @AllArgsConstructor
    public static class ResultadoAnalisis {
        private String palabra;
        private Long cantidad;
    }

    public List<ResultadoAnalisis> obtenerTop20Palabras() {
        List<Producto> productos = productoRepository.findAll();
        Map<String, Long> contador = new HashMap<>();

        for (Producto producto : productos) {
            String texto = (producto.getNombre() != null ? producto.getNombre() : "") 
                    + " " + (producto.getDescripcion() != null ? producto.getDescripcion() : "");
            List<String> palabras = limpiarTexto(texto);
            for (String palabra : palabras) {
                contador.put(palabra, contador.getOrDefault(palabra, 0L) + 1);
            }
        }

        return contador.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(20)
                .map(entry -> new ResultadoAnalisis(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public List<ResultadoAnalisis> obtenerTop20Negocio() {
        List<Producto> productos = productoRepository.findAll();
        Map<String, Long> contador = new HashMap<>();

        for (Producto producto : productos) {
            String texto = (producto.getNombre() != null ? producto.getNombre() : "") 
                    + " " + (producto.getDescripcion() != null ? producto.getDescripcion() : "");
            List<String> palabras = limpiarTexto(texto);
            for (String palabra : palabras) {
                if (KEYWORDS_NEGOCIO.contains(palabra)) {
                    contador.put(palabra, contador.getOrDefault(palabra, 0L) + 1);
                }
            }
        }

        return contador.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(20)
                .map(entry -> new ResultadoAnalisis(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    private List<String> limpiarTexto(String texto) {
        if (texto == null || texto.trim().isEmpty()) return Collections.emptyList();
        
        // Convertir a minúsculas
        texto = texto.toLowerCase();
        
        // Quitar acentos
        texto = Normalizer.normalize(texto, Normalizer.Form.NFD);
        texto = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(texto).replaceAll("");
        
        // Quitar puntuación y números
        texto = texto.replaceAll("[^a-zñ\\s]", " ");
        
        // Dividir en palabras
        List<String> palabras = Arrays.asList(texto.split("\\s+"));
        
        // Filtrar
        return palabras.stream()
                .filter(p -> p.length() >= 3)
                .filter(p -> !STOPWORDS.contains(p))
                .collect(Collectors.toList());
    }
}
