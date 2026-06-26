// Definimos la estructura de categorías comerciales
export const COMMERCIAL_TO_MACRO = {
  "desechables-envases": "Desechables y Envases",
  "plasticos-contenedores": "Plásticos y Contenedores",
  "materias-primas": "Materias Primas e Insumos",
  "ferreteria-herramientas": "Ferretería y Herramientas",
};

export const MACRO_TO_COMMERCIAL = Object.fromEntries(
  Object.entries(COMMERCIAL_TO_MACRO).map(([k, v]) => [v, k]),
);

export const CATEGORIAS_COMERCIALES = [
  {
    id: "todos",
    nombre: "Todos",
    departamentos: ["desechable", "ferreteria", "gaviota", "inix", "materia prima", "plastico"],
  },
  {
    id: "desechables-envases",
    nombre: "Desechables y Envases",
    departamentos: ["desechable", "inix"],
  },
  {
    id: "plasticos-contenedores",
    nombre: "Plásticos y Contenedores",
    departamentos: ["plastico", "gaviota"],
  },
  {
    id: "materias-primas",
    nombre: "Materias Primas",
    departamentos: ["materia prima"],
  },
  {
    id: "ferreteria-herramientas",
    nombre: "Ferretería y Herramientas",
    departamentos: ["ferreteria"],
  },
];

const DepartmentNav = ({ selectedCategoryId, onCategoryChange }) => {
  const handleClick = (id) => {
    console.log("DepartmentNav: Navegando a", id);
    onCategoryChange(id);
  };

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-16 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-hide relative flex items-center gap-2 overflow-x-auto py-4">
          {CATEGORIAS_COMERCIALES.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => handleClick(categoria.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                selectedCategoryId === categoria.id
                  ? 'bg-[#0033A0] text-white shadow-lg shadow-[#0033A0]/30 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-[#121212] hover:shadow-md border border-gray-100'
              }`}
            >
              {categoria.nombre}
              {selectedCategoryId === categoria.id && (
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-2/3 -translate-x-1/2 rounded-full bg-[#D4AF37] shadow-sm" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DepartmentNav;
