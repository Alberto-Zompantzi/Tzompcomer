import { useState, useEffect } from 'react';
import useCartStore from '../store/useCartStore';
import { FALLBACK_IMAGE } from '../utils/productGrouping';

const ProductCard = ({ 
  product, 
  familyImage, 
  isAdminMode, 
  onDeleteProduct, 
  onUpdateProduct, 
  macrocategorias, 
  categories, 
  onSaveProduct,
  currentMacrocategoria
}) => {
  const { addToCart } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: product.nombre,
    precio: product.precio,
    imagenUrl: product.imagenUrl || ''
  });
  const [originalData, setOriginalData] = useState({
    nombre: product.nombre,
    precio: product.precio,
    imagenUrl: product.imagenUrl || ''
  });

  // Filtrar categorías solo para la macrocategoría actual
  const relevantCategories = currentMacrocategoria 
    ? categories.filter(cat => cat.macrocategoria?.id === currentMacrocategoria)
    : categories;

  // Reset form when product changes
  useEffect(() => {
    const newFormData = {
      nombre: product.nombre,
      precio: product.precio,
      imagenUrl: product.imagenUrl || ''
    };
    setFormData(newFormData);
    setOriginalData(newFormData);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleDelete = () => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      onDeleteProduct(product.id);
    }
  };

  const handleCategoryChange = async (e) => {
    const newCategoriaId = e.target.value ? parseInt(e.target.value) : null;
    const newCategoria = newCategoriaId ? categories.find(c => c.id === newCategoriaId) : null;
    
    try {
      await onUpdateProduct(product.id, {
        ...product,
        categoriaEntity: newCategoria ? { id: newCategoria.id } : null
      });
    } catch (error) {
      console.error('Error al mover el producto:', error);
    }
  };

  const handleSave = async () => {
    try {
      await onSaveProduct(product.id, {
        ...product, // Incluye TODOS los datos existentes del producto
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        imagenUrl: formData.imagenUrl.trim()
      });
      setEditando(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Hubo un error al guardar el producto');
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setEditando(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resolveImage = (...candidates) => {
    for (const url of candidates) {
      if (url && (String(url).startsWith("http") || String(url).startsWith("/"))) {
        return url;
      }
    }
    return FALLBACK_IMAGE;
  };

  const displayImage = resolveImage(formData.imagenUrl, product.imagenUrl, familyImage);

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isAdminMode ? 'ring-2 ring-red-300' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-shopify-gray">
        {/* Imagen */}
        <img
          src={displayImage}
          alt={product.nombre}
          className={`h-full w-full object-cover transition-all duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          onError={(e) => { e.target.src = familyImage || FALLBACK_IMAGE; }}
        />
        
        {/* Badge de disponible (solo indicativo, no bloqueante) */}
        {product.disponible && (
          <span className="absolute left-3 top-3 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            Disponible
          </span>
        )}
        {!product.disponible && (
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
              Eliminar
            </button>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.172 9.172 15.414l.242-2.656 5.772-5.772z"
                  />
                </svg>
                Editar
              </button>
            )}
          </div>
          {!editando && (
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Mover a:</label>
              <select
                value={product.categoriaEntity?.id || ''}
                onChange={handleCategoryChange}
                className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Sin categoría</option>
                {relevantCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-400 mb-1">{product.sku}</p>
          {editando ? (
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del producto"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ) : (
            <h3 className="line-clamp-2 text-sm font-semibold text-shopify-text leading-snug">
              {formData.nombre}
            </h3>
          )}
        </div>

        {editando && (
          <>
            <div className="mb-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Precio:</label>
              <input
                type="number"
                name="precio"
                step="0.01"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="mb-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">URL de la Imagen:</label>
              <input
                type="text"
                name="imagenUrl"
                value={formData.imagenUrl}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="mb-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Subir Imagen (Opcional):</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setFormData(prev => ({ ...prev, imagenUrl }));
                  }
                }}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </>
        )}
        
        <div className="mt-auto">
          {!editando && (
            <div className="mb-3">
              <span className="text-2xl font-black text-[#0033A0]">
                ${parseFloat(formData.precio).toFixed(2)}
              </span>
            </div>
          )}
          
          {editando ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white transition-all"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Guardar
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
