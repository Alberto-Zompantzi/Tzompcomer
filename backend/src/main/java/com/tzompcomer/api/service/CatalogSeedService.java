package com.tzompcomer.api.service;

import com.tzompcomer.api.catalog.CatalogConstants;
import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Macrocategoria;
import com.tzompcomer.api.repository.CategoriaRepository;
import com.tzompcomer.api.repository.MacrocategoriaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogSeedService {

    private final MacrocategoriaRepository macrocategoriaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductImageService productImageService;

    private final Map<String, Map<String, Categoria>> categoryCache = new HashMap<>();

    @Transactional
    public void seedCatalogIfEmpty() {
        if (macrocategoriaRepository.count() > 0) {
            loadCache();
            return;
        }
        log.info("Sembrando catálogo B2B (macrocategorías y categorías)...");
        for (CatalogConstants.MacroDefinition macroDef : CatalogConstants.MACROS) {
            Macrocategoria macro = macrocategoriaRepository.save(Macrocategoria.builder()
                    .nombre(macroDef.nombre())
                    .imagenUrl(macroDef.imagenUrl())
                    .orden(macroDef.orden())
                    .activo(true)
                    .build());

            List<String> categories = categoriesForMacro(macroDef.nombre());
            int orden = 1;
            for (String catName : categories) {
                String image = productImageService.resolveCategoryImage(catName, macroDef.nombre());
                categoriaRepository.save(Categoria.builder()
                        .nombre(catName)
                        .macrocategoria(macro)
                        .imagenUrl(image)
                        .orden(orden++)
                        .activo(true)
                        .build());
            }
        }
        loadCache();
        log.info("Catálogo sembrado: {} macrocategorías", macrocategoriaRepository.count());
    }

    public void loadCache() {
        categoryCache.clear();
        for (Macrocategoria macro : macrocategoriaRepository.findAll()) {
            Map<String, Categoria> cats = new HashMap<>();
            for (Categoria cat : categoriaRepository.findByMacrocategoria_IdOrderByOrdenAsc(macro.getId())) {
                cats.put(cat.getNombre(), cat);
            }
            categoryCache.put(macro.getNombre(), cats);
        }
    }

    public Categoria resolveCategory(String macroNombre, String categoryName) {
        if (categoryCache.isEmpty()) {
            loadCache();
        }
        Map<String, Categoria> cats = categoryCache.get(macroNombre);
        if (cats == null) {
            return null;
        }
        Categoria found = cats.get(categoryName);
        if (found != null) {
            return found;
        }
        Categoria otros = cats.get(fallbackCategory(macroNombre));
        if (otros != null) {
            return otros;
        }
        return cats.values().stream().findFirst().orElse(null);
    }

    public Macrocategoria findMacroByNombre(String nombre) {
        return macrocategoriaRepository.findByNombre(nombre).orElse(null);
    }

    private String fallbackCategory(String macroNombre) {
        return switch (macroNombre) {
            case "Desechables y Envases" -> "Otros Desechables";
            case "Plásticos y Contenedores" -> "Otros Plásticos";
            case "Materias Primas e Insumos" -> "Otros Insumos";
            case "Ferretería y Herramientas" -> "Otros Ferretería";
            default -> "Otros";
        };
    }

    private List<String> categoriesForMacro(String macroNombre) {
        return switch (macroNombre) {
            case "Desechables y Envases" -> List.of(
                    "Vasos Térmicos y Unicel",
                    "Vasos Plásticos Transparentes",
                    "Vasos Desechables",
                    "Contenedores con Bisagra",
                    "Domos y Moldes Reposteros",
                    "Platos y Charolas Desechables",
                    "Tapas Desechables",
                    "Agitadores y Popotes",
                    "Cubiertos y Servilletas",
                    "Film y Empaque",
                    "Aluminio Desechable",
                    "Otros Desechables"
            );
            case "Plásticos y Contenedores" -> List.of(
                    "Bolsas Celofán y Boutique",
                    "Bolsas Camiseta y Rollo",
                    "Bolsas Papel y Kraft",
                    "Contenedores Rígidos y Cubetas",
                    "Bisagras y Accesorios",
                    "Adornos y Empaque",
                    "Otros Plásticos"
            );
            case "Materias Primas e Insumos" -> List.of(
                    "Harinas y Polvos",
                    "Azúcares y Endulzantes",
                    "Chocolates y Coberturas",
                    "Colorantes y Decoración",
                    "Saborizantes y Esencias",
                    "Grasas, Aceites y Mantequillas",
                    "Levaduras y Fermentos",
                    "Salsas y Condimentos",
                    "Granos y Cereales",
                    "Lácteos e Insumos Repostería",
                    "Bebidas e Insumos",
                    "Utensilios de Repostería",
                    "Otros Insumos"
            );
            case "Ferretería y Herramientas" -> List.of(
                    "Brochas y Pintura",
                    "Herramientas Manuales",
                    "Fijación e Industrial",
                    "Químicos y Lubricantes",
                    "Eléctrico y Adaptadores",
                    "Otros Ferretería"
            );
            default -> List.of("Otros");
        };
    }
}
