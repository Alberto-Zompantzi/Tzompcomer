import { useState, useEffect } from 'react';
import { FALLBACK_IMAGE } from '../utils/productGrouping';

const FamilyCard = ({ 
  categoria,
  onSelectFamily, 
  isAdminMode,
  onEditCategoria,
  onDeleteCategoria,
  onMoverCategoria,
  macrocategorias
}) => {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: categoria.nombre,
    imagenUrl: categoria.imagenUrl || '',
    activo: categoria.activo,
    departamentoId: categoria.departamento?.id
  });
  const [originalData, setOriginalData] = useState({
    nombre: categoria.nombre,
    imagenUrl: categoria.imagenUrl || '',
    activo: categoria.activo,
    departamentoId: categoria.departamento?.id
  });
  const [moverCategoria, setMoverCategoria] = useState(categoria.departamento?.id);

  // Reset form when categoria changes
  useEffect(() => {
    const newData = {
      nombre: categoria.nombre,
      imagenUrl: categoria.imagenUrl || '',
      activo: categoria.activo,
      departamentoId: categoria.departamento?.id
    };
    setFormData(newData);
    setOriginalData(newData);
    setMoverCategoria(categoria.departamento?.id);
  }, [categoria]);

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
      await onEditCategoria(categoria.id, formData);
      setOriginalData(formData);
      setEditando(false);
    } catch (err) {
      console.error('Error al guardar cambios:', err);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
      onDeleteCategoria(categoria.id);
    }
  };

  const handleMoverChange = async (e) => {
    const newDepartamentoId = parseInt(e.target.value);
    if (newDepartamentoId) {
      try {
        await onMoverCategoria(categoria.id, newDepartamentoId);
        setMoverCategoria(newDepartamentoId);
      } catch (err) {
        console.error('Error al mover categoría:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCardClick = () => {
    if (!editando) {
      onSelectFamily(categoria.id);
    }
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={categoria.imagenUrl || FALLBACK_IMAGE} 
          alt={categoria.nombre} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        {!editando ? (
          <>
            <h3 className="text-lg md:text-xl font-black text-white mb-3 drop-shadow-lg">
              {categoria.nombre}
            </h3>
            <button 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 hover:bg-white text-[#0033A0] font-bold rounded-full transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onSelectFamily(categoria.id);
              }}
            >
              Ver productos
            </button>
          </>
        ) : (
          <form onSubmit={handleSaveEdit} onClick={(e) => e.stopPropagation()} className="bg-white p-4 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-3">Editar Categoría</h3>
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
              name="imagenUrl"
              value={formData.imagenUrl}
              onChange={handleInputChange}
              placeholder="URL de la imagen"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <div className="flex gap-2">
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
          {macrocategorias.length > 0 && (
            <select
              value={moverCategoria}
              onChange={handleMoverChange}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">Mover a...</option>
              {macrocategorias.map(macro => (
                <option key={macro.id} value={macro.id}>
                  {macro.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyCard;
