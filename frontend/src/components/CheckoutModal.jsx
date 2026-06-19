import { useState } from 'react';
import useCartStore from '../store/useCartStore';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart } = useCartStore();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    metodoEntrega: 'Recoger en sucursal'
  });
  const [errors, setErrors] = useState({});

  const cartTotal = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const productosTexto = cart.map(item => 
      `• ${item.quantity}x ${item.nombre} ($${item.precio.toFixed(2)} c/u) - $${(item.precio * item.quantity).toFixed(2)}`
    ).join('\n');

    const mensaje = `🛒 *¡Nuevo Pedido de la Web!*
👤 *Cliente:* ${formData.nombre}
📞 *Teléfono:* ${formData.telefono}
📦 *Método:* ${formData.metodoEntrega}

--- *Productos* ---
${productosTexto}

💰 *Total a Pagar:* $${cartTotal.toFixed(2)}
_Quedo a la espera de los datos de transferencia._`;

    const numeroWhatsApp = 'TUNUMERO_AQUI';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <h2 className="text-xl font-bold text-shopify-text">
              Finalizar Pedido
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

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-shopify-text mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.nombre 
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 bg-shopify-gray focus:border-tzomp-azul focus:bg-white focus:ring-2 focus:ring-tzomp-azul/20'
                } outline-none`}
              />
              {errors.nombre && (
                <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-shopify-text mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="+52 55 1234 5678"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.telefono 
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 bg-shopify-gray focus:border-tzomp-azul focus:bg-white focus:ring-2 focus:ring-tzomp-azul/20'
                } outline-none`}
              />
              {errors.telefono && (
                <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-shopify-text mb-2">
                Método de Entrega
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 bg-shopify-gray cursor-pointer hover:border-tzomp-azul transition-all">
                  <input
                    type="radio"
                    name="metodoEntrega"
                    value="Recoger en sucursal"
                    checked={formData.metodoEntrega === 'Recoger en sucursal'}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-tzomp-azul"
                  />
                  <span className="text-sm font-medium text-shopify-text">
                    Recoger en sucursal
                  </span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 bg-shopify-gray cursor-pointer hover:border-tzomp-azul transition-all">
                  <input
                    type="radio"
                    name="metodoEntrega"
                    value="Envío a domicilio"
                    checked={formData.metodoEntrega === 'Envío a domicilio'}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-tzomp-azul"
                  />
                  <span className="text-sm font-medium text-shopify-text">
                    Envío a domicilio
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-shopify-text">Total</span>
                <span className="text-2xl font-black text-tzomp-azul">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Confirmar Orden por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
