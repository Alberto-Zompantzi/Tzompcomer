import { useState } from 'react';
import useCartStore from '../store/useCartStore';

const GroupedProductCard = ({ familyGroup }) => {
  const { addToCart } = useCartStore();
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const selectedProduct = familyGroup.products[selectedProductIndex];

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-shopify-gray">
        <img
          src={familyGroup.image}
          alt={familyGroup.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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
            {familyGroup.products.map((product, index) => (
              <option key={product.id} value={index}>
                {product.nombre}
              </option>
            ))}
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
