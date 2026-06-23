import { useState, useMemo } from 'react';
import useCartStore from '../store/useCartStore';
import { formatProductOption, formatProductPrice } from '../utils/textFormatting';

const GroupedProductCard = ({ familyGroup, isAdminMode, onDeleteProduct, onUpdateProduct, departments }) => {
  const { addToCart } = useCartStore();
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Ordenar productos por precio de menor a mayor
  const sortedProducts = useMemo(() => {
    return [...familyGroup.products].sort((a, b) => a.precio - b.precio);
  }, [familyGroup.products]);

  const selectedProduct = sortedProducts[selectedProductIndex];

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleDelete = () => {
    if (window.confirm('¿Seguro que quieres eliminar esta variante de producto?')) {
      onDeleteProduct(selectedProduct.id);
    }
  };

  const handleDepartmentChange = (e) => {
    const newDepartmentName = e.target.value;
    const newDepartment = departments.find(d => d.nombre === newDepartmentName);
    if (newDepartment) {
      onUpdateProduct(selectedProduct.id, {
        ...selectedProduct,
        departamento: newDepartment
      });
    }
  };

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isAdminMode ? 'ring-2 ring-red-300' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-shopify-gray">
        {!imgError ? (
          <img
            src={familyGroup.image}
            alt={familyGroup.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-8-8 8m8 14l-8-8m16 0l-8 8" />
            </svg>
          </div>
        )}
        {selectedProduct.disponible && (
          <span className="absolute left-3 top-3 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            Disponible
          </span>
        )}
        {!selectedProduct.disponible && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            Consultar disponibilidad
          </span>
        )}
      </div>

      {/* Controles de Admin */}
      {isAdminMode && (
        <div className="bg-gray-50 p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Eliminar Variante
            </button>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Mover a:</label>
            <select
              value={selectedProduct.departamento?.nombre || ''}
              onChange={handleDepartmentChange}
              className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.nombre}>
                  {dept.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-400 mb-1">{selectedProduct.sku}</p>
          <h3 className="text-sm font-semibold text-shopify-text leading-snug">
            {familyGroup.name}
          </h3>
        </div>

        <div className="mb-3">
          <select
            value={selectedProductIndex}
            onChange={(e) => setSelectedProductIndex(parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0033A0] focus:border-[#0033A0] outline-none transition-colors"
          >
            {sortedProducts.map((product, index) => {
              const formattedName = formatProductOption(product.nombre);
              const priceStr = formatProductPrice(product.precio);
              return (
                <option key={product.id} value={index}>
                  {formattedName} {priceStr}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mt-auto">
          <div className="mb-3">
            <span className="text-2xl font-black text-[#0033A0]">
              ${selectedProduct.precio.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
              isAdded
                ? 'bg-green-500 text-white'
                : 'bg-[#121212] text-white hover:bg-[#0033A0]'
            }`}
          >
            {isAdded ? (
              <>
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Agregado!
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 18.75c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zm9 0c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zm-9.25-1.5h9.376c.43 0 .808-.277.959-.684l2.497-6.704A1.125 1.125 0 0019.125 9H6.786"
                  />
                </svg>
                Agregar al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupedProductCard;
