package com.tzompcomer.api.service;

import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ProductImageService {

    private static final String FALLBACK =
            "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=500&q=80";

    private static final Map<String, String> KEYWORD_IMAGES = new LinkedHashMap<>();

    static {
        put("vaso termico", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80");
        put("unicel", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80");
        put("vaso", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80");
        put("popote", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80");
        put("agitador", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80");
        put("plato", "https://images.unsplash.com/photo-1594911774802-8822a707c9f3?auto=format&fit=crop&w=500&q=80");
        put("charola", "https://images.unsplash.com/photo-1594911774802-8822a707c9f3?auto=format&fit=crop&w=500&q=80");
        put("bandeja", "https://images.unsplash.com/photo-1594911774802-8822a707c9f3?auto=format&fit=crop&w=500&q=80");
        put("tapa", "https://images.unsplash.com/photo-1518081461904-9d8f136351c2?auto=format&fit=crop&w=500&q=80");
        put("domo", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80");
        put("molde", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80");
        put("contenedor", "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=500&q=80");
        put("bisagra", "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=500&q=80");
        put("bolsa", "https://images.unsplash.com/photo-1591156191879-af14d5412922?auto=format&fit=crop&w=500&q=80");
        put("celofan", "https://images.unsplash.com/photo-1591156191879-af14d5412922?auto=format&fit=crop&w=500&q=80");
        put("kraft", "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80");
        put("papel", "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80");
        put("cubeta", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80");
        put("gaviota", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80");
        put("harina", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80");
        put("polvo", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80");
        put("azucar", "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=500&q=80");
        put("chocolate", "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=500&q=80");
        put("colorante", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80");
        put("esencia", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80");
        put("levadura", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80");
        put("mantequilla", "https://images.unsplash.com/photo-1589985270554-4d979f437d60?auto=format&fit=crop&w=500&q=80");
        put("aceite", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80");
        put("salsa", "https://images.unsplash.com/photo-1472476440877-efabd5a2b5a9?auto=format&fit=crop&w=500&q=80");
        put("arroz", "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80");
        put("brocha", "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=500&q=80");
        put("herramienta", "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=500&q=80");
        put("aflojatodo", "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80");
        put("adaptador", "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80");
        put("servilleta", "https://images.unsplash.com/photo-1594911774802-8822a707c9f3?auto=format&fit=crop&w=500&q=80");
        put("cuchara", "https://images.unsplash.com/photo-1594911774802-8822a707c9f3?auto=format&fit=crop&w=500&q=80");
        put("tenedor", "https://images.unsplash.com/photo-1594911774802-8822a707c9f3?auto=format&fit=crop&w=500&q=80");
        put("aluminio", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80");
        put("emplaye", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80");
        put("pelicula", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80");
    }

    private static void put(String keyword, String url) {
        KEYWORD_IMAGES.put(keyword, url);
    }

    public String resolveProductImage(String nombre, String descripcion, String categoriaNombre, String macroNombre) {
        String text = normalize((nombre == null ? "" : nombre) + " " + (descripcion == null ? "" : descripcion));

        for (Map.Entry<String, String> entry : KEYWORD_IMAGES.entrySet()) {
            if (text.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        if (categoriaNombre != null && !categoriaNombre.isBlank()) {
            String cat = normalize(categoriaNombre);
            for (Map.Entry<String, String> entry : KEYWORD_IMAGES.entrySet()) {
                if (cat.contains(entry.getKey())) {
                    return entry.getValue();
                }
            }
        }

        if (macroNombre != null) {
            return switch (macroNombre) {
                case "Desechables y Envases" ->
                        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80";
                case "Plásticos y Contenedores" ->
                        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80";
                case "Materias Primas e Insumos" ->
                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80";
                case "Ferretería y Herramientas" ->
                        "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=500&q=80";
                default -> FALLBACK;
            };
        }

        return FALLBACK;
    }

    public String resolveCategoryImage(String categoriaNombre, String macroNombre) {
        return resolveProductImage(categoriaNombre, "", categoriaNombre, macroNombre);
    }

    private String normalize(String input) {
        if (input == null) return "";
        String n = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .trim();
        return n.replace('ñ', 'n');
    }
}
