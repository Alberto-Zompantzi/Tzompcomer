export const MASTER_FAMILIES = [
  {
    id: "vasos-termicos-unicel",
    name: "Vasos Térmicos / Unicel",
    keywords: ["vaso", "termico", "unicel"],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center&q=80&bg=ffffff"
  },
  {
    id: "vasos-plasticos-transparentes",
    name: "Vasos Plásticos Transparentes",
    keywords: ["vaso", "transparente", "cristal"],
    image: "https://images.unsplash.com/photo-1540337505736-3a8ffc216926?w=400&h=400&fit=crop&crop=center&q=80&bg=ffffff"
  },
  {
    id: "platos-desechables",
    name: "Platos Desechables",
    keywords: ["plato"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&crop=center&q=80&bg=ffffff"
  },
  {
    id: "contenedores-domos-pasteleros",
    name: "Contenedores y Domos Pasteleros",
    keywords: ["contenedor", "domo", "bisagra"],
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop&crop=center&q=80&bg=ffffff"
  },
  {
    id: "tapas-desechables",
    name: "Tapas Desechables",
    keywords: ["tapa"],
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=400&fit=crop&crop=center&q=80&bg=ffffff"
  },
  {
    id: "cubiertos-plastico",
    name: "Cubiertos de Plástico",
    keywords: ["cuchara", "tenedor", "cuchillo"],
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=400&fit=crop&crop=center&q=80&bg=ffffff"
  },
  {
    id: "charolas-alimentos",
    name: "Charolas para Alimentos",
    keywords: ["charola"],
    image: "https://images.unsplash.com/photo-1584349606423-2b927f23a84e?w=400&h=400&fit=crop&crop=center&q=80&bg=ffffff"
  },
  {
    id: "desechables-generales",
    name: "Desechables Generales",
    keywords: [],
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center&q=80&bg=ffffff"
  }
];

export const shouldGroupProducts = (products) => {
  if (!products.length) return false;
  const firstProductDept = products[0]?.departamento?.nombre?.toLowerCase();
  return firstProductDept === "desechable" || firstProductDept === "inix";
};

export const getMasterFamilyForProduct = (product) => {
  const productName = product.nombre.toLowerCase();
  
  for (const family of MASTER_FAMILIES.slice(0, -1)) {
    let matches = true;
    for (const keyword of family.keywords) {
      if (!productName.includes(keyword)) {
        matches = false;
        break;
      }
    }
    if (family.keywords.length === 0) continue;
    if (matches) {
      return family;
    }
  }
  
  for (const family of MASTER_FAMILIES.slice(0, -1)) {
    for (const keyword of family.keywords) {
      if (productName.includes(keyword)) {
        return family;
      }
    }
  }
  
  return MASTER_FAMILIES[MASTER_FAMILIES.length - 1];
};

export const groupProductsIntoFamilies = (products) => {
  const grouped = {};
  
  MASTER_FAMILIES.forEach(family => {
    grouped[family.id] = {
      ...family,
      products: []
    };
  });
  
  products.forEach(product => {
    const family = getMasterFamilyForProduct(product);
    grouped[family.id].products.push(product);
  });
  
  return Object.values(grouped).filter(group => group.products.length > 0);
};
