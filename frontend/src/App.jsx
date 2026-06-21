import { useState, useEffect } from "react";
import Header from "./components/Header";
import DepartmentNav from "./components/DepartmentNav";
import ProductGrid from "./components/ProductGrid";
import CheckoutModal from "./components/CheckoutModal";
import AdminPanel from "./components/AdminPanel";

const API_BASE_URL = "http://localhost:8080/api";

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [departmentsRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/departamentos`),
        fetch(`${API_BASE_URL}/productos/all`),
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.categoria &&
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDepartment =
      selectedDepartment === null ||
      (product.departamento && product.departamento.id === selectedDepartment);

    return matchesSearch && matchesDepartment;
  });

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-shopify-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-tzomp-azul border-t-transparent mx-auto mb-4"></div>
          <p className="text-shopify-text font-medium">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-shopify-gray flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <div className="text-red-500 mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-shopify-text mb-2">
            Error de Conexión
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => setDataRefreshKey((prev) => prev + 1)}
            className="px-6 py-2 bg-[#0033A0] text-white rounded-full font-semibold hover:bg-[#001A54] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    return (
      <div className="min-h-screen">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-xl font-black text-shopify-text">
              <span className="text-[#0033A0]">TZOMP</span>
              <span className="text-[#D4AF37]">COMER</span>
              <span className="text-sm font-medium text-gray-400 ml-2">
                | ADMIN
              </span>
            </h1>
            <button
              onClick={() => setShowAdmin(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a la tienda
            </button>
          </div>
        </div>
        <AdminPanel onImportComplete={handleImportComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shopify-gray">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-end">
          <button
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Admin
          </button>
        </div>
      </div>
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isCartOpen={isCartOpen}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onProceedToCheckout={handleProceedToCheckout}
      />
      <div className="pt-0">
        <DepartmentNav
          departments={departments}
          selectedDepartment={selectedDepartment}
          onSelectDepartment={setSelectedDepartment}
        />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-shopify-text">
                {selectedDepartment
                  ? departments.find((d) => d.id === selectedDepartment)?.nombre
                  : "Todos los productos"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "producto" : "productos"}{" "}
                disponibles
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleImportComplete}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0033A0] hover:bg-[#001A54] text-white text-sm font-semibold transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refrescar
              </button>
              <button
                onClick={() => {
                  console.log("--- DATOS DE DEPARTAMENTOS ---");
                  console.log(departments);
                  console.log("--- DATOS DE PRODUCTOS ---");
                  console.log(products);
                  alert(
                    "Datos copiados a la consola del navegador! Abre F12 para verlos.",
                  );
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Ver datos en consola
              </button>
            </div>
          </div>
          <ProductGrid products={filteredProducts} />
        </main>
      </div>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}

export default App;
