import ProductCard from './ProductCard';
import { getFamiliesByCategoryId, getProductsByFamilyId } from '../utils/productGrouping';

const ProductGrid = ({ 
  products, 
  selectedCategoryId, 
  subcategoriaSeleccionada, 
  onSelectFamily,
  isAdminMode, 
  onDeleteProduct, 
  onUpdateProduct, 
  onSaveProduct,
  departments,
  categories,
  currentMacrocategoria
}) => {
  console.log("ProductGrid: selectedCategoryId=", selectedCategoryId, "subcategoriaSeleccionada=", subcategoriaSeleccionada);

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
                        categories={categories}
                        currentMacrocategoria={currentMacrocategoria}
                      />
          ))}
        </div>
      </div>
    );
  }

  // Si no hay subcategoría seleccionada, no renderizar nada (App.jsx ya renderiza las categorías)
  return null;
};

export default ProductGrid;
