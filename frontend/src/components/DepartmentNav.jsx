// Definimos la estructura de categorías comerciales
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

const DepartmentNav = ({ selectedCategoryId, onSelectCategory }) => {
  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-hide relative flex items-center gap-2 overflow-x-auto py-4">
          {CATEGORIAS_COMERCIALES.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => onSelectCategory(categoria.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                selectedCategoryId === categoria.id
                  ? 'bg-[#0033A0] text-white shadow-md shadow-[#0033A0]/20'
                  : 'bg-white text-gray-600 hover:bg-[#F6F6F6] hover:text-[#121212]'
              }`}
            >
              {categoria.nombre}
              {selectedCategoryId === categoria.id && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DepartmentNav;
