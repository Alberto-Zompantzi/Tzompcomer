export const macroNavId = (macroId) => `macro-${macroId}`;

export const parseMacroNavId = (selectedId) => {
  if (!selectedId || selectedId === "todos") return null;
  if (String(selectedId).startsWith("macro-")) {
    const id = Number(String(selectedId).replace("macro-", ""));
    return Number.isNaN(id) ? null : id;
  }
  return null;
};

const DepartmentNav = ({ macrocategorias = [], selectedCategoryId, onCategoryChange }) => {
  const activeMacros = macrocategorias
    .filter((m) => m.activo !== false)
    .sort((a, b) => (a.orden || 0) - (b.orden || 0));

  const tabs = [
    { id: "todos", nombre: "Todos" },
    ...activeMacros.map((m) => ({ id: macroNavId(m.id), nombre: m.nombre })),
  ];

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-16 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-hide relative flex items-center gap-2 overflow-x-auto py-4">
          {tabs.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => onCategoryChange(categoria.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                selectedCategoryId === categoria.id
                  ? "bg-[#0033A0] text-white shadow-lg shadow-[#0033A0]/30 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-[#121212] hover:shadow-md border border-gray-100"
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
