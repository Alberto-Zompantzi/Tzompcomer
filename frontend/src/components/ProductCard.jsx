import { useState } from 'react';
import useCartStore from '../store/useCartStore';
import DynamicProductImage from './DynamicProductImage';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-shopify-gray">
        <DynamicProductImage product={product} isHovered={isHovered} />
        
        {/* Badge de disponible */}
        {product.disponible && (
          <span className="absolute left-3 top-3 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            Disponible
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-400 mb-1">{product.sku}</p>
          <h3 className="line-clamp-2 text-sm font-semibold text-shopify-text leading-snug">
            {product.nombre}
          </h3>
        </div>
        
        <div className="mt-auto">
          <div className="mb-3">
            <span className="text-2xl font-black text-tzomp-azul">
              ${product.precio.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.disponible}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
              !product.disponible
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : isAdded
                ? 'bg-green-500 text-white'
                : 'bg-shopify-text text-white hover:bg-tzomp-azul'
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

export default ProductCard;
