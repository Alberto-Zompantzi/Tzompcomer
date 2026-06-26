package com.tzompcomer.api.catalog;

import java.util.List;
import java.util.Map;
import java.util.Set;

public final class CatalogConstants {

    private CatalogConstants() {}

    public static final Set<String> B2B_DEPARTAMENTOS = Set.of(
            "desechable", "inix", "plastico", "gaviota", "materia prima", "ferreteria"
    );

    public static final Map<String, String> DEPARTAMENTO_A_MACRO = Map.ofEntries(
            Map.entry("desechable", "Desechables y Envases"),
            Map.entry("inix", "Desechables y Envases"),
            Map.entry("plastico", "Plásticos y Contenedores"),
            Map.entry("gaviota", "Plásticos y Contenedores"),
            Map.entry("materia prima", "Materias Primas e Insumos"),
            Map.entry("ferreteria", "Ferretería y Herramientas")
    );

    public static final List<MacroDefinition> MACROS = List.of(
            new MacroDefinition("Desechables y Envases", 1,
                    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
                    List.of("desechable", "inix")),
            new MacroDefinition("Plásticos y Contenedores", 2,
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
                    List.of("plastico", "gaviota")),
            new MacroDefinition("Materias Primas e Insumos", 3,
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
                    List.of("materia prima")),
            new MacroDefinition("Ferretería y Herramientas", 4,
                    "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=600&q=80",
                    List.of("ferreteria"))
    );

    public record MacroDefinition(String nombre, int orden, String imagenUrl, List<String> departamentosExcel) {}

    public record CategoryDefinition(String nombre, int orden, String imagenUrl) {}
}
