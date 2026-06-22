import { useState, useEffect } from 'react';

const AdminPanel = ({ onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [topPalabras, setTopPalabras] = useState([]);
  const [topNegocio, setTopNegocio] = useState([]);
  const [cargandoAnalisis, setCargandoAnalisis] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const fetchAnalisis = async () => {
    setCargandoAnalisis(true);
    try {
      const [palabrasRes, negocioRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/top-palabras'),
        fetch('http://localhost:8080/api/admin/top-negocio')
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

      const response = await fetch('http://localhost:8080/api/admin/upload-excel', {
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

  useEffect(() => {
    fetchAnalisis();
  }, []);

  return (
    <div className="min-h-screen bg-shopify-gray p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Sección de Importación */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-gradient-to-br from-[#0033A0] to-[#D4AF37] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">TC</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-shopify-text">Panel de Administración</h1>
              <p className="text-sm text-gray-500">Importa tus productos y analiza tu catálogo</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-shopify-text mb-2">
                Archivo Excel (.xlsx)
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0033A0] transition-colors cursor-pointer bg-shopify-gray"
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
                      <span className="text-sm font-semibold text-shopify-text">{file.name}</span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-shopify-text block">Haz clic para seleccionar</span>
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
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0033A0] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#001A54] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Importando...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Subir y procesar Excel
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          {result && result.status === 'success' && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-black text-green-700">¡Importación exitosa!</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-black text-shopify-text">{result.totalProcessed}</p>
                  <p className="text-xs text-gray-500 font-medium">Total procesados</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-black text-[#0033A0]">{result.created}</p>
                  <p className="text-xs text-gray-500 font-medium">Creados</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-black text-shopify-text mb-3">Estructura del Excel:</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <table className="text-xs w-full">
                <thead>
                  <tr className="text-[#D4AF37]">
                    <th className="py-2 px-3 text-left">Columna</th>
                    <th className="py-2 px-3 text-left">Nombre</th>
                    <th className="py-2 px-3 text-left">Mapeo</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-gray-800">
                    <td className="py-2 px-3 font-mono">0</td>
                    <td className="py-2 px-3 font-mono">Codigo</td>
                    <td className="py-2 px-3">SKU</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="py-2 px-3 font-mono">1</td>
                    <td className="py-2 px-3 font-mono">Descripcion</td>
                    <td className="py-2 px-3">Nombre + Descripción</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="py-2 px-3 font-mono">2</td>
                    <td className="py-2 px-3 font-mono">Precio Costo</td>
                    <td className="py-2 px-3">Ignorar</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="py-2 px-3 font-mono">3</td>
                    <td className="py-2 px-3 font-mono">Precio Venta</td>
                    <td className="py-2 px-3">Precio</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="py-2 px-3 font-mono">4</td>
                    <td className="py-2 px-3 font-mono">Precio Mayoreo</td>
                    <td className="py-2 px-3">Ignorar</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="py-2 px-3 font-mono">5</td>
                    <td className="py-2 px-3 font-mono">Inventario</td>
                    <td className="py-2 px-3">Disponible</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="py-2 px-3 font-mono">6</td>
                    <td className="py-2 px-3 font-mono">Inv. Minimo</td>
                    <td className="py-2 px-3">Ignorar</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="py-2 px-3 font-mono">7</td>
                    <td className="py-2 px-3 font-mono">Departamento</td>
                    <td className="py-2 px-3">Departamento</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sección de Análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Palabras Generales */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-shopify-text">📊 Top 20 Palabras (Todas)</h2>
                <p className="text-sm text-gray-500">Palabras más repetidas en nombres y descripciones</p>
              </div>
              <button
                onClick={fetchAnalisis}
                disabled={cargandoAnalisis}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors"
              >
                {cargandoAnalisis ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Actualizar
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {topPalabras.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#0033A0] text-white flex items-center justify-center rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-bold text-shopify-text">{item.palabra.toUpperCase()}</span>
                  </div>
                  <span className="text-lg font-black text-[#D4AF37]">{item.cantidad} productos</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Palabras del Negocio */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black text-shopify-text">🏷️ Top 20 del Negocio</h2>
              <p className="text-sm text-gray-500">Palabras clave de tu negocio (plásticos, desechables, etc.)</p>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {topNegocio.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#D4AF37] text-white flex items-center justify-center rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-bold text-shopify-text">{item.palabra.toUpperCase()}</span>
                  </div>
                  <span className="text-lg font-black text-[#0033A0]">{item.cantidad} productos</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
