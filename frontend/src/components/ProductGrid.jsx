import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  subcategoriaSeleccionada, 
  searchTerm = '',
  onSelectFamily,
  isAdminMode, 
  onDeleteProduct, 
  onUpdateProduct, 
  onSaveProduct,
  macrocategorias,
  categories,
  currentMacrocategoria
}) => {
  const hasSearch = searchTerm.trim().length > 0;

  // Solo mostrar productos al entrar a una categoría (nivel 3) o al buscar
  const shouldShowProducts = subcategoriaSeleccionada || hasSearch;

  if (!shouldShowProducts) {
    return null;
  }

  // Vista de productos de una categoría seleccionada
  if (subcategoriaSeleccionada) {
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
              macrocategorias={macrocategorias}
              categories={categories}
              currentMacrocategoria={currentMacrocategoria}
            />
          ))}
        </div>
      </div>
    );
  }

  // Resultados de búsqueda (sin categoría específica seleccionada)
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
          macrocategorias={macrocategorias}
          categories={categories}
          currentMacrocategoria={currentMacrocategoria}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
