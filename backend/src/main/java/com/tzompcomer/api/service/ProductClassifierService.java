package com.tzompcomer.api.service;

import com.tzompcomer.api.catalog.CatalogConstants;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.function.Predicate;

@Service
public class ProductClassifierService {

    public boolean isB2BDepartment(String excelDepartamento) {
        if (excelDepartamento == null || excelDepartamento.isBlank()) {
            return false;
        }
        return CatalogConstants.B2B_DEPARTAMENTOS.contains(normalizeDepartment(excelDepartamento));
    }

    public String resolveMacroNombre(String excelDepartamento) {
        return CatalogConstants.DEPARTAMENTO_A_MACRO.get(normalizeDepartment(excelDepartamento));
    }

    public String classifyCategoryName(String excelDepartamento, String nombre, String descripcion) {
        String dept = normalizeDepartment(excelDepartamento);
        String text = normalizeText((nombre == null ? "" : nombre) + " " + (descripcion == null ? "" : descripcion));
        String macro = resolveMacroNombre(dept);

        if (macro == null) {
            return "Sin clasificar";
        }

        List<CategoryRule> rules = switch (macro) {
            case "Desechables y Envases" -> desechablesRules(dept);
            case "Plásticos y Contenedores" -> plasticosRules(dept);
            case "Materias Primas e Insumos" -> materiasPrimasRules();
            case "Ferretería y Herramientas" -> ferreteriaRules();
            default -> List.of(new CategoryRule("Otros", t -> true));
        };

        for (CategoryRule rule : rules) {
            if (rule.matcher.test(text)) {
                return rule.categoryName;
            }
        }
        return rules.get(rules.size() - 1).categoryName;
    }

    private List<CategoryRule> desechablesRules(String dept) {
        return List.of(
                new CategoryRule("Tapas Desechables", t -> containsAny(t, "tapa", "tapas")),
                new CategoryRule("Agitadores y Popotes", t -> containsAny(t, "agitador", "popote", "popotes", "sorbete", "twist", "pitillo")),
                new CategoryRule("Film y Empaque", t -> containsAny(t, "emplaye", "pelicula", "stretch", "film")),
                new CategoryRule("Domos y Moldes Reposteros", t -> containsAny(t, "domo", "molde")),
                new CategoryRule("Aluminio Desechable", t -> "inix".equals(dept) && containsAny(t, "al-", "aluminio", " inix")),
                new CategoryRule("Vasos Térmicos y Unicel", t ->
                        containsAny(t, "vaso", "vasos") && containsAny(t, "termico", "unicel", "conico", "poliestireno", "eps", "cono")),
                new CategoryRule("Vasos Plásticos Transparentes", t ->
                        containsAny(t, "vaso", "vasos") && containsAny(t, "transparente", "cristal", " pet", " pp", "plastico")),
                new CategoryRule("Vasos Desechables", t -> containsAny(t, "vaso", "vasos")),
                new CategoryRule("Contenedores con Bisagra", t ->
                        containsAny(t, "bisagra") || (containsAny(t, "contenedor") && hasProductCode(t))),
                new CategoryRule("Platos y Charolas Desechables", t -> containsAny(t, "plato", "charola", "bandeja", "abatelengua", "mixiote")),
                new CategoryRule("Cubiertos y Servilletas", t -> containsAny(t, "cuchara", "tenedor", "cuchillo", "servilleta", "cubierto")),
                new CategoryRule("Otros Desechables", t -> true)
        );
    }

    private List<CategoryRule> plasticosRules(String dept) {
        return List.of(
                new CategoryRule("Bisagras y Accesorios", t -> containsAny(t, "bisagra")),
                new CategoryRule("Bolsas Papel y Kraft", t -> containsAny(t, "bolsa") && containsAny(t, "papel", "kraft", "estraza")),
                new CategoryRule("Bolsas Camiseta y Rollo", t -> containsAny(t, "bolsa") && containsAny(t, "camiseta", "negra", "blanca", "rollo", "sanitaria", "asas")),
                new CategoryRule("Bolsas Celofán y Boutique", t -> containsAny(t, "bolsa") && containsAny(t, "celofan", "boutique", "pegamento", "cenefa", "5x", "6x", "8x", "10x", "12x", "15x", "20x")),
                new CategoryRule("Bolsas Celofán y Boutique", t -> containsAny(t, "bolsa", "bolsas")),
                new CategoryRule("Contenedores Rígidos y Cubetas", t -> containsAny(t, "cubeta", "bote", "organizador", "gaviota") || "gaviota".equals(dept)),
                new CategoryRule("Contenedores Rígidos y Cubetas", t -> containsAny(t, "contenedor")),
                new CategoryRule("Adornos y Empaque", t -> containsAny(t, "adorno", "suaje", "cinta", "liston")),
                new CategoryRule("Otros Plásticos", t -> true)
        );
    }

    private List<CategoryRule> materiasPrimasRules() {
        return List.of(
                new CategoryRule("Harinas y Polvos", t -> containsAny(t, "harina", "fecula", "maicena", "polvo para hornear", "polvo hornear")),
                new CategoryRule("Azúcares y Endulzantes", t -> containsAny(t, "azucar", "piloncillo", "jarabe", "miel", "endulzante", "stevia", "splenda")),
                new CategoryRule("Chocolates y Coberturas", t -> containsAny(t, "chocolate", "cobertura", "cacao", "cocoa")),
                new CategoryRule("Colorantes y Decoración", t -> containsAny(t, "colorante", "color ", "sprinkle", "confetti", "perlas", "glitter", "decoracion")),
                new CategoryRule("Saborizantes y Esencias", t -> containsAny(t, "esencia", "extracto", "sabor", "aroma", "saborizante")),
                new CategoryRule("Levaduras y Fermentos", t -> containsAny(t, "levadura", "fermento")),
                new CategoryRule("Grasas, Aceites y Mantequillas", t -> containsAny(t, "mantequilla", "margarina", "aceite", "manteca", "shortening", "manteca vegetal")),
                new CategoryRule("Salsas y Condimentos", t -> containsAny(t, "salsa", "aderezo", "condimento", " especia", "sal ", "pimienta", "chile ", "mostaza", "mayonesa", "vinagre")),
                new CategoryRule("Granos y Cereales", t -> containsAny(t, "arroz", "frijol", "avena", " maiz", "alpi", "granel", "cereal")),
                new CategoryRule("Lácteos e Insumos Repostería", t -> containsAny(t, "leche en polvo", "crema ", "queso", "lacteo", "suero")),
                new CategoryRule("Bebidas e Insumos", t -> containsAny(t, "agua ", "refresco", "jarabe", "concentrado")),
                new CategoryRule("Utensilios de Repostería", t -> containsAny(t, "aguja", "espatula", "batidor", "manga", "duya", "rodillo", "termometro")),
                new CategoryRule("Otros Insumos", t -> true)
        );
    }

    private List<CategoryRule> ferreteriaRules() {
        return List.of(
                new CategoryRule("Brochas y Pintura", t -> containsAny(t, "brocha", "rodillo", "pintura")),
                new CategoryRule("Eléctrico y Adaptadores", t -> containsAny(t, "adaptador", "extension", "clavija", "contacto", "volteck", "multicontacto")),
                new CategoryRule("Químicos y Lubricantes", t -> containsAny(t, "aflojatodo", "aerosol", "lubricante", "thinner", "aceite penetrante")),
                new CategoryRule("Fijación e Industrial", t -> containsAny(t, "tornillo", "taquete", "clavo", "grapa", "perno", "tuerca", "ancla")),
                new CategoryRule("Herramientas Manuales", t -> containsAny(t, "broca", "desarmador", "martillo", "pinza", "llave", "cincel", "serrucho", "pretul", "truper")),
                new CategoryRule("Otros Ferretería", t -> true)
        );
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.trim())) {
                return true;
            }
        }
        return false;
    }

    private boolean hasProductCode(String text) {
        return text.matches(".*\\d+.*") || text.matches(".*[a-z]+\\d+.*") || text.matches(".*\\d+[a-z]+.*");
    }

    private String normalizeDepartment(String dept) {
        return normalizeText(dept);
    }

    private String normalizeText(String input) {
        if (input == null) return "";
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .trim()
                .replace('ñ', 'n');
    }

    private record CategoryRule(String categoryName, Predicate<String> matcher) {}
}
