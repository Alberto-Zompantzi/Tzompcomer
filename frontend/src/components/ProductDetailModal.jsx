import useCartStore from "../store/useCartStore";
import { FALLBACK_IMAGE } from "../utils/productGrouping";

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCartStore();

  if (!isOpen || !product) return null;

  const imageUrl =
    product.imagenUrl &&
    (String(product.imagenUrl).startsWith("http") ||
      String(product.imagenUrl).startsWith("/"))
      ? product.imagenUrl
      : FALLBACK_IMAGE;

  const descripcion =
    product.descripcion?.trim() || product.nombre?.trim() || "";

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Detalle del producto"
    >
      <div
        className="relative w-full sm:max-w-lg md:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-square sm:aspect-[4/3] bg-gray-100">
          <img
            src={imageUrl}
            alt={product.nombre}
            className="h-full w-full object-contain sm:object-cover"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />
          {product.disponible ? (
            <span className="absolute left-4 top-4 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              Disponible
            </span>
          ) : (
            <span className="absolute left-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              Consultar disponibilidad
            </span>
          )}
        </div>

        <div className="p-5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            SKU: {product.sku}
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-[#121212] leading-snug mb-4">
            {product.nombre}
          </h2>

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              Descripción completa
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {descripcion}
            </p>
          </div>

          {product.categoriaEntity?.nombre && (
            <p className="text-sm text-gray-500 mb-4">
              Categoría:{" "}
              <span className="font-semibold text-gray-700">
                {product.categoriaEntity.nombre}
              </span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
            <span className="text-3xl font-black text-[#0033A0]">
              ${parseFloat(product.precio || 0).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0033A0] px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#001A54] transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
