import { useState } from 'react';
import useCartStore from '../store/useCartStore';
import CartDrawer from './CartDrawer';

const Header = ({ searchTerm, onSearchChange, isCartOpen, onToggleCart, onProceedToCheckout }) => {
  const { cart } = useCartStore();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-shopify-text">
              Tzomp<span className="text-tzomp-azul">comer</span>
            </h1>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 -mt-2 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar productos, categorías, marcas..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-11 w-full rounded-full border border-gray-200 bg-shopify-gray px-4 pl-12 text-sm font-medium text-shopify-text placeholder:text-gray-400 focus:border-tzomp-azul focus:bg-white focus:outline-none focus:ring-2 focus:ring-tzomp-azul/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-shopify-text hover:border-tzomp-azul hover:bg-tzomp-azul/5 hover:text-tzomp-azul transition-all"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 18.75c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zm9 0c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zm-9.25-1.5h9.376c.43 0 .808-.277.959-.684l2.497-6.704A1.125 1.125 0 0019.125 9H6.786" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-tzomp-dorado text-xs font-black text-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={onToggleCart}
        onProceedToCheckout={onProceedToCheckout}
      />
    </>
  );
};

export default Header;
