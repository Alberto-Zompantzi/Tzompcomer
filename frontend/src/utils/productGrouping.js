// DEFINICIÓN UNIFICADA DE IMÁGENES DEL CATÁLOGO
export const CATALOG_IMAGES = {
  // Nivel 1: Súper Categorías (Portada "Todos")
  categorias: {
    'desechables-envases': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    'plasticos-contenedores': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    'materias-primas': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    'ferreteria-herramientas': 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=600&q=80'
  },
  // Nivel 2: Familias Maestras (Sub-Portadas)
  familias: {
    // Desechables
    'vasos-termicos-unicel': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
    'vasos-plasticos-transparentes': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80',
    'contenedores-bisagra': 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=500&q=80',
    'domos-moldes-reposteros': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80',
    'platos-charolas-desechables': 'https://images.unsplash.com/photo-1594911774802-8822a707c9f3?auto=format&fit=crop&w=500&q=80',
    'tapas-desechables': 'https://images.unsplash.com/photo-1518081461904-9d8f136351c2?auto=format&fit=crop&w=500&q=80',
    // Plásticos
    'bolsas-plastico-rollo': 'https://images.unsplash.com/photo-1591156191879-af14d5412922?auto=format&fit=crop&w=500&q=80',
    'bolsas-papel-kraft': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80',
    'contenedores-rigidos-cubetas': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
    // Materias Primas
    'harinas-polvos-base': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    'azucares-endulzantes': 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=500&q=80',
    // Ferretería
    'herramientas-fijacion-industrial': 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=500&q=80'
  }
};

// Fallback image for any image errors
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=500&q=80';

// Definición exacta de la estructura de categorías y familias maestras
export const CATEGORIA_MAPPING = {
  "desechables-envases": {
    departamentos: ["desechable", "inix"],
    familias: [
      {
        id: "vasos-termicos-unicel",
        name: "Vasos Térmicos y Unicel",
        image: CATALOG_IMAGES.familias["vasos-termicos-unicel"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("vaso") && (t.includes("termico") || t.includes("unicel") || t.includes("conico"));
        }
      },
      {
        id: "vasos-plasticos-transparentes",
        name: "Vasos Plásticos Transparentes",
        image: CATALOG_IMAGES.familias["vasos-plasticos-transparentes"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("vaso") && (t.includes("transparente") || t.includes("cristal") || t.includes("pet") || t.includes("pp"));
        }
      },
      {
        id: "contenedores-bisagra",
        name: "Contenedores con Bisagra",
        image: CATALOG_IMAGES.familias["contenedores-bisagra"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          if (t.includes("bisagra")) return true;
          if (t.includes("contenedor")) {
            const hasCode = /\d+/.test(t) || /[a-z]+[0-9]+/.test(t) || /[0-9]+[a-z]+/.test(t);
            return hasCode;
          }
          return false;
        }
      },
      {
        id: "domos-moldes-reposteros",
        name: "Domos y Moldes Reposteros",
        image: CATALOG_IMAGES.familias["domos-moldes-reposteros"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("domo") || t.includes("molde");
        }
      },
      {
        id: "platos-charolas-desechables",
        name: "Platos y Charolas Desechables",
        image: CATALOG_IMAGES.familias["platos-charolas-desechables"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("plato") || t.includes("charola");
        }
      },
      {
        id: "tapas-desechables",
        name: "Tapas Desechables",
        image: CATALOG_IMAGES.familias["tapas-desechables"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("tapa");
        }
      }
    ]
  },
  "plasticos-contenedores": {
    departamentos: ["plastico", "gaviota"],
    familias: [
      {
        id: "bolsas-plastico-rollo",
        name: "Bolsas de Plástico y Rollo",
        image: CATALOG_IMAGES.familias["bolsas-plastico-rollo"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("bolsa") && (t.includes("camiseta") || t.includes("blanca") || t.includes("negra") || t.includes("rollo"));
        }
      },
      {
        id: "bolsas-papel-kraft",
        name: "Bolsas de Papel y Kraft",
        image: CATALOG_IMAGES.familias["bolsas-papel-kraft"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("bolsa") && (t.includes("papel") || t.includes("kraft") || t.includes("estraza"));
        }
      },
      {
        id: "contenedores-rigidos-cubetas",
        name: "Contenedores Rígidos y Cubetas",
        image: CATALOG_IMAGES.familias["contenedores-rigidos-cubetas"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("gaviota") || t.includes("cubeta") || t.includes("bote") || t.includes("organizador");
        }
      }
    ]
  },
  "materias-primas": {
    departamentos: ["materia prima"],
    familias: [
      {
        id: "harinas-polvos-base",
        name: "Harinas y Polvos Base",
        image: CATALOG_IMAGES.familias["harinas-polvos-base"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("harina") || t.includes("polvo") || t.includes("fecula");
        }
      },
      {
        id: "azucares-endulzantes",
        name: "Azúcares y Endulzantes",
        image: CATALOG_IMAGES.familias["azucares-endulzantes"],
        matcher: (text) => {
          const t = text.toLowerCase().trim();
          return t.includes("azucar") || t.includes("jarabe") || t.includes("piloncillo") || t.includes("miel");
        }
      }
    ]
  },
  "ferreteria-herramientas": {
    departamentos: ["ferreteria"],
    familias: [
      {
        id: "herramientas-fijacion-industrial",
        name: "Herramientas y Fijación Industrial",
        image: CATALOG_IMAGES.familias["herramientas-fijacion-industrial"],
        matcher: () => true // Toma todo lo de ferretería
      }
    ]
  }
};

// Determina si debemos agrupar los productos (solo cuando es una de las pestañas específicas)
export const shouldGroupProducts = (products, selectedCategoryId) => {
  if (!products.length || !selectedCategoryId) return false;
  return selectedCategoryId !== "todos" && CATEGORIA_MAPPING[selectedCategoryId];
};

// Obtiene la familia para un producto en una categoría específica
export const getMasterFamilyForProduct = (product, selectedCategoryId) => {
  const categoria = CATEGORIA_MAPPING[selectedCategoryId];
  if (!categoria) return null;

  const productText = product.nombre;
  for (const familia of categoria.familias) {
    if (familia.matcher(productText)) {
      return familia;
    }
  }
  return null;
};

// Agrupa productos en familias para una categoría específica
export const groupProductsIntoFamilies = (products, selectedCategoryId) => {
  const categoria = CATEGORIA_MAPPING[selectedCategoryId];
  if (!categoria) return [];

  const grouped = {};
  
  categoria.familias.forEach(familia => {
    grouped[familia.id] = {
      ...familia,
      products: []
    };
  });
  
  products.forEach(product => {
    const familia = getMasterFamilyForProduct(product, selectedCategoryId);
    if (familia) {
      grouped[familia.id].products.push(product);
    }
  });
  
  // Convertir a array, filtrar familias vacías, y ordenar productos alfabéticamente
  return Object.values(grouped)
    .filter(group => group.products.length > 0)
    .map(group => ({
      ...group,
      products: [...group.products].sort((a, b) => 
        a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
      )
    }));
};

// Obtiene solo los productos de una familia específica
export const getProductsByFamilyId = (products, selectedCategoryId, familyId) => {
  const categoria = CATEGORIA_MAPPING[selectedCategoryId];
  if (!categoria) return [];
  
  const familia = categoria.familias.find(f => f.id === familyId);
  if (!familia) return [];

  return products.filter(product => familia.matcher(product.nombre)).sort((a, b) => 
    a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
  );
};

// Obtiene solo las familias de una categoría (para nivel 2)
export const getFamiliesByCategoryId = (selectedCategoryId) => {
  const categoria = CATEGORIA_MAPPING[selectedCategoryId];
  if (!categoria) return [];
  return categoria.familias;
};
