
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
  const [migrando, setMigrando] = useState(false);

  // Estados para Macrocategorías (anteriormente Departamentos)
  const [macrocategorias, setMacrocategorias] = useState([]);
  const [editingMacrocategoria, setEditingMacrocategoria] = useState(null);
  const [macrocategoriaForm, setMacrocategoriaForm] = useState({ nombre: '', identificadorIcono: '', activo: true });

  // Estados para Categorías
  const [categorias, setCategorias] = useState([]);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [categoriaForm, setCategoriaForm] = useState({ nombre: '', imagenUrl: '', activo: true, macrocategoriaId: '' });
  const [selectedCategoriaForAssignment, setSelectedCategoriaForAssignment] = useState(null);
  const [searchProductoIndividual, setSearchProductoIndividual] = useState('');

  // Estados para Subcategorías
  const [subcategorias, setSubcategorias] = useState([]);
  const [editingSubcategoria, setEditingSubcategoria] = useState(null);
  const [subcategoriaForm, setSubcategoriaForm] = useState({ nombre: '', imagenUrl: '', categoriaId: '' });

  // Estados para Banners
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({ imagenUrl: '' });

  // Estados para Almacén de Productos
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [categoriaSeleccionadaAsignar, setCategoriaSeleccionadaAsignar] = useState('');
  
  // Estados para Etiquetas Excel (Asignación Masiva)
  const [excelCategorias, setExcelCategorias] = useState([]);
  const [excelCategoriaSeleccionada, setExcelCategoriaSeleccionada] = useState('');
  const [asignando, setAsignando] = useState(false);
  const [importMacro, setImportMacro] = useState('');
  const [reclasificando, setReclasificando] = useState(false);

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
      const url = importMacro
        ? `${API_BASE_URL}/admin/upload-excel?macro=${encodeURIComponent(importMacro)}`
        : `${API_BASE_URL}/admin/upload-excel`;

      const response = await fetch(url, {
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

  const handleReclassify = async () => {
    setReclasificando(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reclassify`, { method: 'POST' });
      const data = await res.json();
      alert(`Reclasificados: ${data.reclassified || 0} productos`);
      if (onImportComplete) onImportComplete();
    } catch (err) {
      console.error(err);
      alert('Error al reclasificar productos');
    } finally {
      setReclasificando(false);
    }
  };

  // --- Funciones para Macrocategorías ---
  const fetchMacrocategorias = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/macrocategorias`);
      const data = await res.json();
      setMacrocategorias(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMacrocategoria = async (e) => {
    e.preventDefault();
    try {
      if (editingMacrocategoria) {
        await fetch(`${API_BASE_URL}/macrocategorias/${editingMacrocategoria.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(macrocategoriaForm)
        });
      } else {
        await fetch(`${API_BASE_URL}/macrocategorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(macrocategoriaForm)
        });
      }
      fetchMacrocategorias();
      setEditingMacrocategoria(null);
      setMacrocategoriaForm({ nombre: '', identificadorIcono: '', activo: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMacrocategoria = async (id) => {
    if (confirm('¿Seguro que quieres eliminar esta macrocategoría?')) {
      try {
        await fetch(`${API_BASE_URL}/macrocategorias/${id}`, { method: 'DELETE' });
        fetchMacrocategorias();
      } catch (err) {
        console.error(err);
      }
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
      const payload = {
        ...categoriaForm,
        macrocategoria: categoriaForm.macrocategoriaId ? { id: Number(categoriaForm.macrocategoriaId) } : null
      };
      if (editingCategoria) {
        await fetch(`${API_BASE_URL}/categorias/${editingCategoria.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API_BASE_URL}/categorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      fetchCategorias();
      fetchMacrocategorias();
      setEditingCategoria(null);
      setCategoriaForm({ nombre: '', imagenUrl: '', activo: true, macrocategoriaId: '' });
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

  // --- Funciones para Almacén de Productos ---
  const fetchProductos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/productos/all`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProductoSeleccionado = (id) => {
    setProductosSeleccionados(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSeleccionarTodos = () => {
    setProductosSeleccionados(productosFiltrados.map(p => p.id));
  };

  const handleDeseleccionarTodos = () => {
    setProductosSeleccionados([]);
  };

  const handleAsignarCategoria = async () => {
    if (!categoriaSeleccionadaAsignar || productosSeleccionados.length === 0) {
      alert('Por favor selecciona productos y una categoría');
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/productos/assign-categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoIds: productosSeleccionados,
          categoriaId: Number(categoriaSeleccionadaAsignar)
        })
      });
      alert('Productos asignados correctamente!');
      setProductosSeleccionados([]);
      fetchProductos();
    } catch (err) {
      console.error(err);
      alert('Error al asignar productos');
    }
  };

  const productosFiltrados = productos.filter(p => {
    if (!busquedaProducto) return true;
    const searchLower = busquedaProducto.toLowerCase();
    return p.nombre.toLowerCase().includes(searchLower) || p.sku.toLowerCase().includes(searchLower);
  });
  
  // --- Funciones para Asignación Masiva por Etiqueta Excel ---
  const fetchExcelCategorias = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/productos/excel-categorias`);
      const data = await res.json();
      setExcelCategorias(data);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleAsignarExcelAMacrocategoria = async (macrocategoriaId, categoriaNombre) => {
    if (!excelCategoriaSeleccionada) {
      alert('Por favor selecciona una etiqueta Excel');
      return;
    }
    setAsignando(true);
    try {
      await fetch(`${API_BASE_URL}/productos/assign-excel-to-macrocategoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          excelCategoria: excelCategoriaSeleccionada,
          macrocategoriaId: Number(macrocategoriaId),
          categoriaNombre: categoriaNombre
        })
      });
      alert(`Productos de la etiqueta "${excelCategoriaSeleccionada}" asignados a "${categoriaNombre}"!`);
      fetchCategorias();
      fetchMacrocategorias();
    } catch (err) {
      console.error(err);
      alert('Error al asignar');
    } finally {
      setAsignando(false);
    }
  };
  
  const handleAsignarExcelACategoria = async (categoriaId) => {
    if (!excelCategoriaSeleccionada) {
      alert('Por favor selecciona una etiqueta Excel');
      return;
    }
    setAsignando(true);
    try {
      await fetch(`${API_BASE_URL}/productos/assign-excel-to-categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          excelCategoria: excelCategoriaSeleccionada,
          categoriaId: Number(categoriaId)
        })
      });
      alert(`Productos de la etiqueta "${excelCategoriaSeleccionada}" asignados a la categoría!`);
      fetchCategorias();
      fetchProductos();
    } catch (err) {
      console.error(err);
      alert('Error al asignar');
    } finally {
      setAsignando(false);
    }
  };

  const handleAsignarProductoIndividual = async (productoId, categoriaId) => {
    try {
      await fetch(`${API_BASE_URL}/productos/assign-categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoIds: [productoId],
          categoriaId: Number(categoriaId)
        })
      });
      alert('Producto asignado correctamente!');
      fetchProductos();
    } catch (err) {
      console.error(err);
      alert('Error al asignar producto');
    }
  };

  // --- Efectos ---
  useEffect(() => {
    fetchAnalisis();
  }, []);

  useEffect(() => {
    if (activeTab === 'categorias' || activeTab === 'almacen' || activeTab === 'macrocategorias') {
      fetchExcelCategorias();
    }
    if (activeTab === 'categorias' || activeTab === 'almacen') {
      fetchCategorias();
      fetchMacrocategorias();
      fetchProductos();
    }
    if (activeTab === 'macrocategorias') fetchMacrocategorias();
    if (activeTab === 'subcategorias') {
      fetchSubcategorias();
      fetchCategorias();
    }
    if (activeTab === 'banners') fetchBanners();
    if (activeTab === 'almacen') {
      fetchProductos();
    }
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
                <p className="text-sm text-gray-500">Master Catalog Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { id: 'productos', label: '📦 Importar' },
              { id: 'macrocategorias', label: '🏢 Macrocategorías' },
              { id: 'categorias', label: '📁 Categorías' },
              { id: 'almacen', label: '🏪 Almacén' },
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
            {/* --- Tab: Productos (Importación) --- */}
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Importar por macrocategoría (opcional)
                    </label>
                    <select
                      value={importMacro}
                      onChange={(e) => setImportMacro(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
                    >
                      <option value="">Todo el núcleo B2B</option>
                      <option value="Desechables y Envases">Desechables y Envases</option>
                      <option value="Plásticos y Contenedores">Plásticos y Contenedores</option>
                      <option value="Materias Primas e Insumos">Materias Primas e Insumos</option>
                      <option value="Ferretería y Herramientas">Ferretería y Herramientas</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Solo productos B2B. Actualiza por SKU sin borrar el catálogo.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0033A0] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#001A54] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Importando...' : 'Subir y procesar Excel'}
                  </button>
                </form>

                {/* Botón de Migración */}
                <button
                  onClick={handleReclassify}
                  disabled={reclasificando}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8960C] px-8 py-4 text-base font-black text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {reclasificando ? 'Reclasificando...' : 'Reclasificar productos con reglas inteligentes'}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-600">{error}</p>
                  </div>
                )}

                {result && result.status === 'success' && (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-lg font-black text-green-700 mb-4">¡Importación exitosa!</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-3xl font-black text-gray-900">{result.totalProcessed}</p>
                        <p className="text-xs text-gray-500 font-medium">Filas leídas</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-3xl font-black text-[#0033A0]">{result.created}</p>
                        <p className="text-xs text-gray-500 font-medium">Creados</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-3xl font-black text-green-700">{result.updated || 0}</p>
                        <p className="text-xs text-gray-500 font-medium">Actualizados</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-3xl font-black text-gray-400">{result.skipped || 0}</p>
                        <p className="text-xs text-gray-500 font-medium">Omitidos (no B2B)</p>
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

            {/* --- Tab: Macrocategorías --- */}
            {activeTab === 'macrocategorias' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">Gestión de Macrocategorías (Nivel Superior)</h2>
                
                {/* Sección de Asignación Masiva por Etiqueta Excel */}
                <div className="bg-gradient-to-r from-[#0033A0]/5 to-[#D4AF37]/5 p-6 rounded-2xl border border-[#0033A0]/10">
                  <h3 className="font-black text-gray-900 text-lg mb-4">🏷️ Asignar Etiquetas Excel a Macrocategorías</h3>
                  <div className="flex flex-wrap gap-4 items-end">
                    <select
                      value={excelCategoriaSeleccionada}
                      onChange={(e) => setExcelCategoriaSeleccionada(e.target.value)}
                      className="flex-1 min-w-[250px] px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    >
                      <option value="">Selecciona una etiqueta de Excel</option>
                      {excelCategorias.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <form onSubmit={handleSaveMacrocategoria} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <h3 className="font-black text-gray-900 text-lg">{editingMacrocategoria ? 'Editar Macrocategoría' : 'Agregar Macrocategoría'}</h3>
                  <input
                    type="text"
                    placeholder="Nombre de la macrocategoría"
                    value={macrocategoriaForm.nombre}
                    onChange={(e) => setMacrocategoriaForm({ ...macrocategoriaForm, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Identificador de ícono"
                    value={macrocategoriaForm.identificadorIcono}
                    onChange={(e) => setMacrocategoriaForm({ ...macrocategoriaForm, identificadorIcono: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={macrocategoriaForm.activo}
                      onChange={(e) => setMacrocategoriaForm({ ...macrocategoriaForm, activo: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="font-semibold text-gray-700">Activo (visible en la tienda)</span>
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-[#0033A0] text-white py-3 rounded-xl font-bold">Guardar</button>
                    {editingMacrocategoria && (
                      <button type="button" onClick={() => { setEditingMacrocategoria(null); setMacrocategoriaForm({ nombre: '', identificadorIcono: '', activo: true }); }} className="px-6 py-3 border border-gray-300 rounded-xl font-semibold">Cancelar</button>
                    )}
                  </div>
                </form>

                <div className="grid gap-4">
                  {macrocategorias.map((macro) => (
                    <div key={macro.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0033A0]/10 to-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                          <span className="text-[#0033A0] font-black text-xl">{macro.identificadorIcono || '📂'}</span>
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-lg">{macro.nombre}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${macro.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {macro.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => { 
                            const nombreCategoria = prompt('¿Nombre de la categoría a crear/asignar?', excelCategoriaSeleccionada || '');
                            if (nombreCategoria) {
                              handleAsignarExcelAMacrocategoria(macro.id, nombreCategoria); 
                            }
                          }} 
                          disabled={!excelCategoriaSeleccionada || asignando}
                          className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-semibold disabled:opacity-50"
                        >
                          {asignando ? 'Asignando...' : 'Asignar Etiqueta Excel'}
                        </button>
                        <button onClick={() => { setEditingMacrocategoria(macro); setMacrocategoriaForm({ nombre: macro.nombre, identificadorIcono: macro.identificadorIcono || '', activo: macro.activo }); }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">Editar</button>
                        <button onClick={() => handleDeleteMacrocategoria(macro.id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Tab: Categorías --- */}
            {activeTab === 'categorias' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black text-gray-900">Gestión de Categorías (Nivel Medio)</h2>

                {/* Panel de Asignación de Productos */}
                {selectedCategoriaForAssignment && (
                  <div className="bg-gradient-to-r from-[#0033A0]/10 to-[#D4AF37]/10 p-6 rounded-2xl border border-[#0033A0]/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-gray-900 text-lg">📦 Asignar Productos a: {selectedCategoriaForAssignment.nombre}</h3>
                      <button onClick={() => setSelectedCategoriaForAssignment(null)} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold text-sm">Cerrar</button>
                    </div>

                    {/* Asignación Masiva por Etiqueta Excel */}
                    <div className="bg-white p-4 rounded-xl mb-4">
                      <h4 className="font-bold text-gray-900 mb-3">a. Asignación Masiva por Etiqueta Excel</h4>
                      <div className="flex flex-wrap gap-3 items-end">
                        <select
                          value={excelCategoriaSeleccionada}
                          onChange={(e) => setExcelCategoriaSeleccionada(e.target.value)}
                          className="flex-1 min-w-[250px] px-4 py-2 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                        >
                          <option value="">Selecciona una etiqueta de Excel</option>
                          {excelCategorias.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAsignarExcelACategoria(selectedCategoriaForAssignment.id)}
                          disabled={!excelCategoriaSeleccionada || asignando}
                          className="px-6 py-2 bg-[#D4AF37] text-white rounded-xl font-bold disabled:opacity-50"
                        >
                          {asignando ? 'Asignando...' : 'Asignar Todos'}
                        </button>
                      </div>
                    </div>

                    {/* Asignación Individual */}
                    <div className="bg-white p-4 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3">b. Asignación Individual (Buscar Producto)</h4>
                      <input
                        type="text"
                        placeholder="Buscar producto por nombre o SKU..."
                        value={searchProductoIndividual}
                        onChange={(e) => setSearchProductoIndividual(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none mb-3"
                      />
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {productos.filter(p => {
                          if (!searchProductoIndividual) return true;
                          const term = searchProductoIndividual.toLowerCase();
                          return p.nombre.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
                        }).slice(0, 10).map(producto => (
                          <div key={producto.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {producto.imagenUrl && (
                                <img src={producto.imagenUrl} alt="" className="w-8 h-8 object-cover rounded" />
                              )}
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{producto.nombre}</p>
                                <p className="text-xs text-gray-500">SKU: {producto.sku} | Actual: {producto.categoriaEntity?.nombre || 'Sin categoría'}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAsignarProductoIndividual(producto.id, selectedCategoriaForAssignment.id)}
                              className="px-3 py-1 bg-[#0033A0] text-white text-xs font-bold rounded-lg hover:bg-[#002270]"
                            >
                              Asignar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Formulario de Creación/Edición */}
                <form onSubmit={handleSaveCategoria} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <h3 className="font-black text-gray-900 text-lg">{editingCategoria ? 'Editar Categoría' : 'Agregar Categoría'}</h3>
                  <select
                    value={categoriaForm.macrocategoriaId}
                    onChange={(e) => setCategoriaForm({ ...categoriaForm, macrocategoriaId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    required
                  >
                    <option value="">Selecciona la Macrocategoría a la que pertenece</option>
                    {macrocategorias.map((macro) => (
                      <option key={macro.id} value={macro.id}>{macro.nombre}</option>
                    ))}
                  </select>
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
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categoriaForm.activo}
                      onChange={(e) => setCategoriaForm({ ...categoriaForm, activo: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="font-semibold text-gray-700">Activo (visible en la tienda)</span>
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-[#0033A0] text-white py-3 rounded-xl font-bold">Guardar</button>
                    {editingCategoria && (
                      <button type="button" onClick={() => { setEditingCategoria(null); setCategoriaForm({ nombre: '', imagenUrl: '', activo: true, macrocategoriaId: '' }); }} className="px-6 py-3 border border-gray-300 rounded-xl font-semibold">Cancelar</button>
                    )}
                  </div>
                </form>

                {/* Lista de Categorías */}
                <div className="grid gap-4">
                  {categorias.map((categoria) => (
                    <div key={categoria.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-4 mb-4 md:mb-0">
                        {categoria.imagenUrl && (
                          <img src={categoria.imagenUrl} alt={categoria.nombre} className="w-16 h-16 object-cover rounded-xl" />
                        )}
                        <div>
                          <h4 className="font-black text-gray-900 text-lg">{categoria.nombre}</h4>
                          <p className="text-sm text-gray-500">
                            {categoria.macrocategoria ? `Macrocategoría: ${categoria.macrocategoria.nombre}` : 'Sin macrocategoría'}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-1 inline-block ${categoria.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {categoria.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => handleAsignarExcelACategoria(categoria.id)} 
                          disabled={!excelCategoriaSeleccionada || asignando}
                          className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-semibold disabled:opacity-50"
                        >
                          {asignando ? 'Asignando...' : 'Asignar Etiqueta Excel'}
                        </button>
                        <button onClick={() => setSelectedCategoriaForAssignment(categoria)} className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold">
                          📦 Gestionar Productos
                        </button>
                        <button onClick={() => { 
                          setEditingCategoria(categoria); 
                          setCategoriaForm({ 
                            nombre: categoria.nombre, 
                            imagenUrl: categoria.imagenUrl || '', 
                            activo: categoria.activo,
                            macrocategoriaId: categoria.macrocategoria?.id || '' 
                          }); 
                        }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">Editar</button>
                        <button onClick={() => handleDeleteCategoria(categoria.id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Tab: Almacén --- */}
            {activeTab === 'almacen' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">Almacén de Productos</h2>
                
                {/* Barra de herramientas */}
                <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Buscar productos por nombre o SKU..."
                      value={busquedaProducto}
                      onChange={(e) => setBusquedaProducto(e.target.value)}
                      className="flex-1 min-w-[250px] px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    />
                    <select
                      value={categoriaSeleccionadaAsignar}
                      onChange={(e) => setCategoriaSeleccionadaAsignar(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-gray-300 focus:border-[#0033A0] outline-none"
                    >
                      <option value="">Selecciona categoría para asignar</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre} {cat.departamento ? `(${cat.departamento.nombre})` : ''}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAsignarCategoria}
                      disabled={productosSeleccionados.length === 0 || !categoriaSeleccionadaAsignar}
                      className="px-6 py-3 bg-[#0033A0] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Asignar ({productosSeleccionados.length})
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSeleccionarTodos}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                    >
                      Seleccionar todos ({productosFiltrados.length})
                    </button>
                    <button
                      onClick={handleDeseleccionarTodos}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold"
                    >
                      Deseleccionar todos
                    </button>
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="max-h-[600px] overflow-y-auto">
                    {productosFiltrados.map((producto) => (
                      <div key={producto.id} className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={productosSeleccionados.includes(producto.id)}
                          onChange={() => handleToggleProductoSeleccionado(producto.id)}
                          className="w-5 h-5 rounded"
                        />
                        {producto.imagenUrl && (
                          <img src={producto.imagenUrl} alt={producto.nombre} className="w-12 h-12 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{producto.nombre}</h4>
                          <p className="text-xs text-gray-500">SKU: {producto.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#0033A0]">${producto.precio.toFixed(2)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            producto.categoriaEntity ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {producto.categoriaEntity ? producto.categoriaEntity.nombre : 'Sin categoría'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- Tab: Subcategorías --- */}
            {activeTab === 'subcategorias' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900">Gestión de Subcategorías (Nivel Inferior)</h2>
                
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
                <h2 className="text-2xl font-black text-gray-900">Gestión de Banners Destacados</h2>
                
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
