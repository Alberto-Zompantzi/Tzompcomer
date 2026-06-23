const Hero = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#0033A0] to-gray-800 text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
          <span className="text-white">Tzompcomer</span>
          <span className="block mt-2 text-[#D4AF37]">
            Soluciones Integrales en Desechables y Materias Primas
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Todo lo que necesitas para tu negocio en un solo lugar. Desechables de calidad, materias primas certificadas y herramientas profesionales.
        </p>
        
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-3 px-10 py-5 bg-[#D4AF37] hover:bg-[#C4A030] text-[#121212] font-black text-lg rounded-full shadow-2xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-105"
        >
          Explorar Catálogo
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;
