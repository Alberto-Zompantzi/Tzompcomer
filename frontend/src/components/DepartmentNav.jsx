const DepartmentNav = ({ departments, selectedDepartment, onSelectDepartment }) => {
  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-hide relative flex items-center gap-2 overflow-x-auto py-4">
          <button
            onClick={() => onSelectDepartment(null)}
            className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              selectedDepartment === null
                ? 'bg-tzomp-azul text-white shadow-md shadow-tzomp-azul/20'
                : 'bg-white text-gray-600 hover:bg-shopify-gray hover:text-shopify-text'
            }`}
          >
            Todos
            {selectedDepartment === null && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-tzomp-dorado" />
            )}
          </button>
          
          {departments.map((department) => (
            <button
              key={department.id}
              onClick={() => onSelectDepartment(department.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                selectedDepartment === department.id
                  ? 'bg-tzomp-azul text-white shadow-md shadow-tzomp-azul/20'
                  : 'bg-white text-gray-600 hover:bg-shopify-gray hover:text-shopify-text'
              }`}
            >
              {department.nombre}
              {selectedDepartment === department.id && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-tzomp-dorado" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DepartmentNav;
