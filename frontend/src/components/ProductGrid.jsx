import ProductCard from './ProductCard';

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

  // NIVEL 3: Vista de productos de una Categoría de nivel medio
  if (subcategoriaSeleccionada) {
    console.log("ProductGrid: Renderizando NIVEL 3 - Categoría:", subcategoriaSeleccionada);
    const categoria = categories.find(c => c.id === subcategoriaSeleccionada);
    
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
          {products.map((product) => (
            <ProductCard 
                        key={product.id} 
                        product={product}
                        familyImage={categoria?.imagenUrl}
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

  // NIVEL 2: Vista de productos de una Macrocategoría (sin subcategoría seleccionada)
  if (selectedCategoryId !== "todos") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard 
                      key={product.id} 
                      product={product}
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
    );
  }

  return null;
};

export default ProductGrid;
