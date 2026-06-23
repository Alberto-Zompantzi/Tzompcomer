import ProductCard from './ProductCard';
import HomeCategoryCard from './HomeCategoryCard';
import FamilyCard from './FamilyCard';
import { getFamiliesByCategoryId, getProductsByFamilyId, CATALOG_IMAGES } from '../utils/productGrouping';

// Arreglo fijo de categorías principales para la portada (usando el mapeo unificado)
const MAIN_CATEGORIES = [
  {
    id: "desechables-envases",
    name: "Desechables y Envases",
    image: CATALOG_IMAGES.categorias["desechables-envases"]
  },
  {
    id: "plasticos-contenedores",
    name: "Plásticos y Contenedores",
    image: CATALOG_IMAGES.categorias["plasticos-contenedores"]
  },
  {
    id: "materias-primas",
    name: "Materias Primas",
    image: CATALOG_IMAGES.categorias["materias-primas"]
  },
  {
    id: "ferreteria-herramientas",
    name: "Ferretería y Herramientas",
    image: CATALOG_IMAGES.categorias["ferreteria-herramientas"]
  }
];

const ProductGrid = ({ 
  products, 
  selectedCategoryId, 
  subcategoriaSeleccionada, 
  onSelectCategory, 
  onSelectFamily,
  isAdminMode, 
  onDeleteProduct, 
  onUpdateProduct, 
  onSaveProduct,
  departments 
}) => {
  console.log("ProductGrid: selectedCategoryId=", selectedCategoryId, "subcategoriaSeleccionada=", subcategoriaSeleccionada);

  // NIVEL 1: Portada Principal ("Todos")
  if (selectedCategoryId === "todos") {
    console.log("ProductGrid: Renderizando NIVEL 1 - Portada Principal");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MAIN_CATEGORIES.map((category) => (
          <HomeCategoryCard 
            key={category.id}
            id={category.id}
            name={category.name}
            image={category.image}
            onSelectCategory={onSelectCategory}
          />
        ))}
      </div>
    );
  }

  // NIVEL 3: Vista de productos de una Familia Maestra
  if (subcategoriaSeleccionada) {
    console.log("ProductGrid: Renderizando NIVEL 3 - Familia Maestra:", subcategoriaSeleccionada);
    const productosFamilia = getProductsByFamilyId(products, selectedCategoryId, subcategoriaSeleccionada);
    const familias = getFamiliesByCategoryId(selectedCategoryId);
    const familia = familias.find(f => f.id === subcategoriaSeleccionada);
    
    return (
      <div className="space-y-4">
        <button
          onClick={() => onSelectFamily(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Regresar
        </button>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {productosFamilia.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              familyImage={familia?.image}
              isAdminMode={isAdminMode}
              onDeleteProduct={onDeleteProduct}
              onUpdateProduct={onUpdateProduct}
              onSaveProduct={onSaveProduct}
              departments={departments}
            />
          ))}
        </div>
      </div>
    );
  }

  // NIVEL 2: Sub-portada de Familias Maestras
  console.log("ProductGrid: Renderizando NIVEL 2 - Familias de:", selectedCategoryId);
  const familias = getFamiliesByCategoryId(selectedCategoryId);
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {familias.map((family) => (
        <FamilyCard 
          key={family.id}
          family={family}
          onSelectFamily={onSelectFamily}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
