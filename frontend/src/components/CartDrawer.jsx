import useCartStore from '../store/useCartStore';

const CartDrawer = ({ isOpen, onClose, onProceedToCheckout }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-bold text-shopify-text">
            Carrito ({cartCount} {cartCount === 1 ? 'artículo' : 'artículos'})
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-shopify-gray hover:text-shopify-text transition-all"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-shopify-gray">
                <svg
                  className="h-10 w-10 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 18.75c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zm9 0c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zm-9.25-1.5h9.376c.43 0 .808-.277.959-.684l2.497-6.704A1.125 1.125 0 0019.125 9H6.786" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-shopify-text">Tu carrito está vacío</h3>
              <p className="text-sm text-gray-500">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-shopify-gray">
                    {item.imagenUrl ? (
                      <img
                        src={item.imagenUrl}
                        alt={item.nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-8 w-8 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18.75h19.5"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-shopify-text line-clamp-2">
                        {item.nombre}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-tzomp-azul">
                        ${item.precio.toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-shopify-gray hover:text-shopify-text transition-all"
                        >
                          <svg
                            className="h-3 w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm font-semibold text-shopify-text min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-shopify-gray hover:text-shopify-text transition-all"
                        >
                          <svg
                            className="h-3 w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-shopify-text">Subtotal</span>
              <span className="text-2xl font-black text-tzomp-azul">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={onProceedToCheckout}
              className="mb-3 w-full rounded-full bg-tzomp-azul px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-tzomp-azul/20 hover:bg-tzomp-azul-oscuro hover:shadow-xl hover:shadow-tzomp-azul/25 transition-all active:scale-[0.98]"
            >
              Proceder al Pedido
            </button>
            <button
              onClick={clearCart}
              className="w-full rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-white transition-all"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
