import { useState, useEffect } from 'react';
import { FALLBACK_IMAGE } from '../utils/productGrouping';

const HomeCategoryCard = ({ 
  id, 
  name, 
  image, 
  identificadorIcono,
  activo,
  onSelectCategory, 
  isAdminMode,
  onEditMacrocategoria,
  onDeleteMacrocategoria
}) => {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: name,
    identificadorIcono: identificadorIcono || '',
    imagenUrl: image || '',
    activo: activo !== false ? true : false
  });
  const [originalData, setOriginalData] = useState({
    nombre: name,
    identificadorIcono: identificadorIcono || '',
    imagenUrl: image || '',
    activo: activo !== false ? true : false
  });

  // Reset form when props change
  useEffect(() => {
    const newData = {
      nombre: name,
      identificadorIcono: identificadorIcono || '',
      imagenUrl: image || '',
      activo: activo !== false ? true : false
    };
    setFormData(newData);
    setOriginalData(newData);
  }, [name, image, identificadorIcono, activo]);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditando(true);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setFormData(originalData);
    setEditando(false);
  };

  const handleSaveEdit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await onEditMacrocategoria(id, formData);
      setOriginalData(formData);
      setEditando(false);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que quieres eliminar la macrocategoría "${name}"?`)) {
      onDeleteMacrocategoria(id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer min-h-[320px] sm:min-h-[380px] md:min-h-[420px]"
      onClick={() => !editando && onSelectCategory()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!editando && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelectCategory();
        }
      }}
    >
      {/* Imagen de la categoría */}
      <div className="relative aspect-[3/2] sm:aspect-[16/10] overflow-hidden min-h-[220px] sm:min-h-[260px]">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        {/* Overlay semi-transparente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
        {!editando ? (
          <>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 drop-shadow-lg">
              {name}
            </h2>
            <span 
              className="inline-flex items-center gap-2 self-start px-7 py-3.5 bg-white/95 group-hover:bg-white text-[#0033A0] font-bold text-base rounded-full transition-all duration-300 group-hover:gap-4 group-hover:shadow-lg pointer-events-none"
            >
              Explorar productos
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </>
        ) : (
          <form onSubmit={handleSaveEdit} onClick={(e) => e.stopPropagation()} className="bg-white p-4 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-3">Editar Macrocategoría</h3>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="identificadorIcono"
              value={formData.identificadorIcono}
              onChange={handleInputChange}
              placeholder="Identificador de icono"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="imagenUrl"
              value={formData.imagenUrl}
              onChange={handleInputChange}
              placeholder="URL de la imagen"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 mb-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                  className="rounded"
                />
                Activo
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#0033A0] text-white py-2 rounded-lg text-sm font-bold"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Botones de admin */}
      {isAdminMode && !editando && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleEditClick}
            className="px-3 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-3 py-2 bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeCategoryCard;