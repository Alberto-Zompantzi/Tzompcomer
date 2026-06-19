import { useState, useEffect } from 'react';
import Header from './components/Header';
import DepartmentNav from './components/DepartmentNav';
import ProductGrid from './components/ProductGrid';
import CheckoutModal from './components/CheckoutModal';

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [departmentsRes, productsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/departamentos`),
          fetch(`${API_BASE_URL}/productos/all`)
        ]);

        if (!departmentsRes.ok || !productsRes.ok) {
          throw new Error('Error al cargar los datos');
        }

        const departmentsData = await departmentsRes.json();
        const productsData = await productsRes.json();

        setDepartments(departmentsData);
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No se pudieron cargar los datos. Por favor, inténtalo más tarde.');
        const sampleDepartments = [
          { id: 1, nombre: 'Electrónica', identificadorIcono: 'electronics' },
          { id: 2, nombre: 'Ropa y Calzado', identificadorIcono: 'clothing' },
          { id: 3, nombre: 'Hogar y Decoración', identificadorIcono: 'home' },
          { id: 4, nombre: 'Deportes y Fitness', identificadorIcono: 'sports' },
          { id: 5, nombre: 'Juguetes y Juegos', identificadorIcono: 'toys' },
          { id: 6, nombre: 'Belleza y Cuidado', identificadorIcono: 'beauty' },
        ];
        const sampleProducts = [
          { id: 1, sku: 'PROD-001', nombre: 'Smartphone Premium 15 Pro Max 256GB Azul', descripcion: 'Teléfono inteligente de última generación', precio: 21999.00, departamento: { id: 1, nombre: 'Electrónica' }, categoria: 'Celulares', imagenUrl: null, disponible: true },
          { id: 2, sku: 'PROD-002', nombre: 'Camiseta Premium de Algodón 100% - Negro', descripcion: 'Camiseta de algodón 100% premium', precio: 499.00, departamento: { id: 2, nombre: 'Ropa y Calzado' }, categoria: 'Camisetas', imagenUrl: null, disponible: true },
          { id: 3, sku: 'PROD-003', nombre: 'Silla Ergonómica de Oficina Pro', descripcion: 'Silla ergonómica ajustable premium', precio: 8499.00, departamento: { id: 3, nombre: 'Hogar y Decoración' }, categoria: 'Muebles', imagenUrl: null, disponible: true },
          { id: 4, sku: 'PROD-004', nombre: 'Balón de Fútbol Oficial Match', descripcion: 'Balón oficial de la liga profesional', precio: 1299.00, departamento: { id: 4, nombre: 'Deportes y Fitness' }, categoria: 'Fútbol', imagenUrl: null, disponible: true },
          { id: 5, sku: 'PROD-005', nombre: 'Laptop Pro 16" M3 Max 64GB RAM', descripcion: 'Laptop para profesionales de alto rendimiento', precio: 68999.00, departamento: { id: 1, nombre: 'Electrónica' }, categoria: 'Computadoras', imagenUrl: null, disponible: true },
          { id: 6, sku: 'PROD-006', nombre: 'Jeans Slim Fit Premium - Azul Oscuro', descripcion: 'Jeans clásico de alta calidad', precio: 999.00, departamento: { id: 2, nombre: 'Ropa y Calzado' }, categoria: 'Pantalones', imagenUrl: null, disponible: true },
          { id: 7, sku: 'PROD-007', nombre: 'Mesa de Centro de Madera Maciza', descripcion: 'Mesa de madera para sala de estar', precio: 12999.00, departamento: { id: 3, nombre: 'Hogar y Decoración' }, categoria: 'Muebles', imagenUrl: null, disponible: true },
          { id: 8, sku: 'PROD-008', nombre: 'Raqueta de Tenis Profesional Tour', descripcion: 'Raqueta profesional de competición', precio: 4999.00, departamento: { id: 4, nombre: 'Deportes y Fitness' }, categoria: 'Tenis', imagenUrl: null, disponible: true },
          { id: 9, sku: 'PROD-009', nombre: 'Audífonos Inalámbricos Pro Max ANC', descripcion: 'Audífonos con cancelación de ruido activa', precio: 6499.00, departamento: { id: 1, nombre: 'Electrónica' }, categoria: 'Audio', imagenUrl: null, disponible: true },
          { id: 10, sku: 'PROD-010', nombre: 'Set de Cuidado Facial Premium', descripcion: 'Kit completo de cuidado de la piel', precio: 2499.00, departamento: { id: 6, nombre: 'Belleza y Cuidado' }, categoria: 'Cuidado Facial', imagenUrl: null, disponible: true },
        ];
        setDepartments(sampleDepartments);
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.categoria && product.categoria.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === null || 
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
            <svg className="h-16 w-16 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-shopify-text mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Mostrando datos de ejemplo mientras se resuelve el problema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shopify-gray">
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
                  ? departments.find(d => d.id === selectedDepartment)?.nombre
                  : 'Todos los productos'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} disponibles
              </p>
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
