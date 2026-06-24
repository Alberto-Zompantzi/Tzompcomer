
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const AdminPanel = ({ onImportComplete }) => {
  const [activeTab, setActiveTab] = useState('productos');
  
  // Estados para Importación
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [topPalabras, setTopPalabras] = useState([]);
  const [topNegocio, setTopNegocio] = useState([]);
  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);

  // Estados para Categorías
  const [categorias, setCategorias] = useState([]);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [categoriaForm, setCategoriaForm] = useState({ nombre: '', imagenUrl: '' });

  // Estados para Subcategorías
  const [subcategorias, setSubcategorias] = useState([]);
  const [editingSubcategoria, setEditingSubcategoria] = useState(null);
  const [subcategoriaForm, setSubcategoriaForm] = useState({ nombre: '', imagenUrl: '', categoriaId: '' });

  // Estados para Banners
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({ imagenUrl: '' });

  // --- Funciones para Importación ---
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const fetchAnalisis = async () => {
    setCargandoAnalisis(true);
    try {
      const [palabrasRes, negocioRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/top-palabras`),
        fetch(`${API_BASE_URL}/admin/top-negocio`)
      ]);
      const palabras = await palabrasRes.json();
      const negocio = await negocioRes.json();
      setTopPalabras(palabras);
      setTopNegocio(negocio);
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoAnalisis(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/admin/upload-excel`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setResult(data);
      if (onImportComplete) {
        setTimeout(() => {
          onImportComplete();
        }, 1000);
      }
    } catch (err) {
      setError('Error al subir el archivo: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // --- Funciones para Categorías ---
  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categorias`);
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCategoria = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoria) {
        await fetch(`${API_BASE_URL}/categorias/${editingCategoria.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoriaForm)
        });
      } else {
        await fetch(`${API_BASE_URL}/categorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoriaForm)
        });
      }
      fetchCategorias();
      setEditingCategoria(null);
      setCategoriaForm({ nombre: '', imagenUrl: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategoria = async (id) => {
    if (confirm('¿Seguro que quieres eliminar esta categoría?')) {
      try {
        await fetch(`${API_BASE_URL}/categorias/${id}`, { method: 'DELETE' });
        fetchCategorias();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- Funciones para Subcategorías ---
  const fetchSubcategorias = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/subcategorias`);
      const data = await res.json();
      setSubcategorias(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSubcategoria = async (e) => {
    e.preventDefault();
    try {
      if (editingSubcategoria) {
        await fetch(`${API_BASE_URL}/subcategorias/${editingSubcategoria.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subcategoriaForm)
        });
      } else {
        await fetch(`${API_BASE_URL}/subcategorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subcategoriaForm)
        });
      }
      fetchSubcategorias();
      setEditingSubcategoria(null);
      setSubcategoriaForm({ nombre: '', imagenUrl: '', categoriaId: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubcategoria = async (id) => {
    if (confirm('¿Seguro que quieres eliminar esta subcategoría?')) {
      try {
        await fetch(`${API_BASE_URL}/subcategorias/${id}`, { method: 'DELETE' });
        fetchSubcategorias();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- Funciones para Banners ---
  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/banner-destacados`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.imagenUrl) return;
    try {
      await fetch(`${API_BASE_URL}/banner-destacados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerForm)
      });
      fetchBanners();
      setBannerForm({ imagenUrl: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (confirm('¿Seguro que quieres eliminar este banner?')) {
      try {
        await fetch(`${API_BASE_URL}/banner-destacados/${id}`, { method: 'DELETE' });
        fetchBanners();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- Efectos ---
  useEffect(() => {
    fetchAnalisis();
  }, []);

  useEffect(() => {
    if (activeTab === 'categorias') fetchCategorias();
    if (activeTab === 'subcategorias') {
      fetchSubcategorias();
      fetchCategorias();
    }
    if (activeTab === 'banners') fetchBanners();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-gradient-to-br from-[#0033A0] to-[#D4AF37] rounded-2xl flex items-center justify-center">
                <span className="text-white font-black text-xl">TC</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Gestiona tu tienda desde aquí</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'productos', label: '📦 Productos' },
              { id: 'categorias', label: '📁 Categorías' },
              { id: 'subcategorias', label: '📂 Subcategorías' },
              { id: 'banners', label: '⭐ Banners' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0033A0] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* --- Tab: Productos --- */}
            {activeTab === 'productos' && (
              <div className="space-y-8">
                {/* Importación */}
                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Archivo Excel (.xlsx)
                    </label>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0033A0] transition-colors cursor-pointer bg-gray-50"
                      onClick={() => document.getElementById('file-input').click()}
                    >
                      <input
                        id="file-input"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div>
                          {file ? (
                            <span className="text-sm font-semibold text-gray-900">{file.name}</span>
                          ) : (
                            <>
                              <span className="text-sm font-semibold text-gray-900 block">Haz clic para seleccionar</span>
                              <span className="text-xs text-gray-500">o arrastra y suelta un archivo .xlsx</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0033A0] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#001A54] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Importando...' : 'Subir y procesar Excel'}
                  </button>
                </form>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-600">{error}</p>
                  </div>
                )}

                {result && result.status === 'success' && (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-lg font-black text-green-700 mb-4">¡Importación exitosa!</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-3xl font-black text-gray-900">{result.totalProcessed}</p>
                        <p className="text-xs text-gray-500 font-medium">Total procesados</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-3xl font-black text-[#0033A0]">{result.created}</p>
                        <p className="text-xs text-gray-500 font-medium">Creados</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Análisis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-black text-gray-900">📊 Top 20 Palabras</h2>
                      <button onClick={fetchAnalisis} disabled={cargandoAnalisis} className="px-4 py-2 bg-gray-200 rounded-full text-sm font-semibold">Actualizar</button>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {topPalabras.map((item, index) => (
                        <div key={index} className="flex justify-between p-3 bg-white rounded-lg">
                          <span className="font-bold text-gray-900">{item.palabra.toUpperCase()}</span>
                          <span className="font-black text-[#D4AF37]">{item.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h2 className="text-xl font-black text-gray-900 mb-6">🏷️ Top 20 del Negocio</h2>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {topNegocio.map((item, index) => (
                        <div key={index} className="flex justify-between p-3 bg-white rounded-lg">
                          <span className="font-bold text-gray-900">{item.palabra.toUpperCase()}</span>
                          <span className="font-black text-[#0033A0]">{item.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- Tab: Categorías --- */}
            {activeTab === 'categorias' && (
              <div className="space-y-6">
                <form onSubmit={handleSaveCategoria} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <h3 className="font-black text-gray-900 text-lg">{editingCategoria ? 'Editar Categoría' : 'Agregar Categoría'}</h3>
                  <input
                    type="text"
                    placeholder="Nombre de la categoría"
                    value={categoriaForm.nombre}
                    onChange={(e) => setCategoriaForm({ ...categoriaForm, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="URL de la imagen"
                    value={categoriaForm.imagenUrl}
                    onChange={(e) => setCategoriaForm({ ...categoriaForm, imagenUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-[#0033A0] text-white py-3 rounded-xl font-bold">Guardar</button>
                    {editingCategoria && (
                      <button type="button" onClick={() => { setEditingCategoria(null); setCategoriaForm({ nombre: '', imagenUrl: '' }); }} className="px-6 py-3 border border-gray-300 rounded-xl font-semibold">Cancelar</button>
                    )}
                  </div>
                </form>

                <div className="grid gap-4">
                  {categorias.map((categoria) => (
                    <div key={categoria.id} className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4">
                        {categoria.imagenUrl && (
                          <img src={categoria.imagenUrl} alt={categoria.nombre} className="w-16 h-16 object-cover rounded-xl" />
                        )}
                        <h4 className="font-black text-gray-900 text-lg">{categoria.nombre}</h4>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingCategoria(categoria); setCategoriaForm({ nombre: categoria.nombre, imagenUrl: categoria.imagenUrl }); }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">Editar</button>
                        <button onClick={() => handleDeleteCategoria(categoria.id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Tab: Subcategorías --- */}
            {activeTab === 'subcategorias' && (
              <div className="space-y-6">
                <form onSubmit={handleSaveSubcategoria} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <h3 className="font-black text-gray-900 text-lg">{editingSubcategoria ? 'Editar Subcategoría' : 'Agregar Subcategoría'}</h3>
                  <select
                    value={subcategoriaForm.categoriaId}
                    onChange={(e) => setSubcategoriaForm({ ...subcategoriaForm, categoriaId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Nombre de la subcategoría"
                    value={subcategoriaForm.nombre}
                    onChange={(e) => setSubcategoriaForm({ ...subcategoriaForm, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="URL de la imagen"
                    value={subcategoriaForm.imagenUrl}
                    onChange={(e) => setSubcategoriaForm({ ...subcategoriaForm, imagenUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-[#0033A0] text-white py-3 rounded-xl font-bold">Guardar</button>
                    {editingSubcategoria && (
                      <button type="button" onClick={() => { setEditingSubcategoria(null); setSubcategoriaForm({ nombre: '', imagenUrl: '', categoriaId: '' }); }} className="px-6 py-3 border border-gray-300 rounded-xl font-semibold">Cancelar</button>
                    )}
                  </div>
                </form>

                <div className="grid gap-4">
                  {subcategorias.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4">
                        {sub.imagenUrl && (
                          <img src={sub.imagenUrl} alt={sub.nombre} className="w-16 h-16 object-cover rounded-xl" />
                        )}
                        <div>
                          <h4 className="font-black text-gray-900 text-lg">{sub.nombre}</h4>
                          <p className="text-sm text-gray-500">Categoría: {sub.categoria?.nombre}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingSubcategoria(sub); setSubcategoriaForm({ nombre: sub.nombre, imagenUrl: sub.imagenUrl, categoriaId: sub.categoria?.id }); }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">Editar</button>
                        <button onClick={() => handleDeleteSubcategoria(sub.id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Tab: Banners --- */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <form onSubmit={handleAddBanner} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <h3 className="font-black text-gray-900 text-lg">Agregar Banner Destacado</h3>
                  <input
                    type="text"
                    placeholder="URL de la imagen del banner"
                    value={bannerForm.imagenUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, imagenUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    required
                  />
                  <button type="submit" className="w-full bg-[#0033A0] text-white py-3 rounded-xl font-bold">Agregar Banner</button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {banners.map((banner) => (
                    <div key={banner.id} className="relative group">
                      <img src={banner.imagenUrl} alt="Banner" className="w-full h-48 object-cover rounded-2xl shadow-sm" />
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
