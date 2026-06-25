import { useState, useEffect, useMemo } from "react";
import {
  getFamiliesByCategoryId,
  CATEGORIA_MAPPING,
} from "./utils/productGrouping";
import Header from "./components/Header";
import DepartmentNav, {
  CATEGORIAS_COMERCIALES,
} from "./components/DepartmentNav";
import ProductGrid from "./components/ProductGrid";
import CheckoutModal from "./components/CheckoutModal";
import Hero from "./components/Hero";
import Locations from "./components/Locations";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import StarProductsBanner from "./components/StarProductsBanner";
import useCartStore from "./store/useCartStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const PASSWORD_ADMIN_SECRETA = "TzompAdmin2026!";

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("todos");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const { clearCart } = useCartStore();

  // Función para manejar el cambio de categoría con reset completo
  const handleCategoryChange = (id) => {
    console.log("Cambiando a categoría:", id);
    setSelectedCategoryId(id);
    setSubcategoriaSeleccionada(null);
    setSearchTerm("");
  };

  // Resetear subcategoría cuando cambie la categoría principal
  useEffect(() => {
    setSubcategoriaSeleccionada(null);
  }, [selectedCategoryId]);

  const handleAdminClick = () => {
    const input = prompt("Ingrese la contraseña de administrador:");
    if (input === PASSWORD_ADMIN_SECRETA) {
      setIsAdminMode(!isAdminMode);
      if (!isAdminMode) {
        alert("Modo administrador activado correctamente!");
      }
    } else if (input !== null) {
      alert("Contraseña incorrecta!");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`${API_BASE_URL}/productos/${productId}`, {
        method: "DELETE",
      });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleUpdateProduct = async (productId, updatedProduct) => {
    try {
      const res = await fetch(`${API_BASE_URL}/productos/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      const savedProduct = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? savedProduct : p)),
      );
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleSaveProduct = async (productId, productData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/productos/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const savedProduct = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? savedProduct : p)),
      );
    } catch (err) {
      console.error("Error saving product:", err);
      throw err; // Propagate error to show user feedback
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [departmentsRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/departamentos/active`),
        fetch(`${API_BASE_URL}/productos/visible`),
      ]);

      if (!departmentsRes.ok || !productsRes.ok) {
        throw new Error("Error al cargar los datos");
      }

      const departmentsData = await departmentsRes.json();
      const productsData = await productsRes.json();

      setDepartments(departmentsData);
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        "No se pudieron cargar los datos. Por favor, verifica que el backend esté corriendo.",
      );
      setDepartments([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataRefreshKey]);

  const handleImportComplete = () => {
    setDataRefreshKey((prev) => prev + 1);
  };

  // Obtener la categoría comercial seleccionada y familia
  const categoriaSeleccionada = CATEGORIAS_COMERCIALES.find(
    (c) => c.id === selectedCategoryId,
  );

  const familiasCategorias = useMemo(
    () => getFamiliesByCategoryId(selectedCategoryId),
    [selectedCategoryId],
  );

  const familiaSeleccionada = useMemo(
    () => familiasCategorias.find((f) => f.id === subcategoriaSeleccionada),
    [familiasCategorias, subcategoriaSeleccionada],
  );

  // Filtrar productos por término de búsqueda
  const productosFiltrados = useMemo(() => {
    let filtered = [...products];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.nombre?.toLowerCase().includes(searchLower) ||
          product.sku?.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isCartOpen={isCartOpen}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero solo cuando está en la página principal */}
        {selectedCategoryId === "todos" && !subcategoriaSeleccionada && (
          <Hero onExplore={() => handleCategoryChange("desechables-envases")} />
        )}

        {/* Banner de Productos Estrella (solo en página principal) */}
        {selectedCategoryId === "todos" && !subcategoriaSeleccionada && (
          <StarProductsBanner />
        )}

        <div className="mb-8">
          <DepartmentNav
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Título principal */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-[#121212]">
              {familiaSeleccionada
                ? familiaSeleccionada.name
                : categoriaSeleccionada?.nombre || "Todos los productos"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {familiaSeleccionada
                ? `${productosFiltrados.length} productos disponibles en esta familia`
                : `${productosFiltrados.length} productos disponibles`}
            </p>
          </div>
          {isAdminMode && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                Modo Administrador
              </span>
              <button
                onClick={() => setIsAdminMode(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Salir
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <ProductGrid
            products={productosFiltrados}
            selectedCategoryId={selectedCategoryId}
            subcategoriaSeleccionada={subcategoriaSeleccionada}
            onSelectFamily={setSubcategoriaSeleccionada}
            isAdminMode={isAdminMode}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
            onSaveProduct={handleSaveProduct}
            departments={departments}
            onSelectCategory={handleCategoryChange}
          />
        )}
      </main>

      <div className="mt-16">
        <Locations />
      </div>

      <Footer onAdminClick={handleAdminClick} />

      {/* Botón flotante de Admin (solo visible en modo admin) */}
      {isAdminMode && (
        <button
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-[#0033A0] to-[#D4AF37] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all z-50 group"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1.724 1.724 0 002.572-1.066z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-semibold py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Panel de Control
          </span>
        </button>
      )}

      {/* Modal de AdminPanel */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-auto bg-gray-50 rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-xl font-black text-[#121212]">
                Panel de Administración
              </h2>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <AdminPanel onImportComplete={handleImportComplete} />
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onCheckoutComplete={() => {
          clearCart();
          setIsCheckoutOpen(false);
        }}
      />
    </div>
  );
}

export default App;
