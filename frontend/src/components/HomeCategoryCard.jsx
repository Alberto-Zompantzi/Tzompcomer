import { FALLBACK_IMAGE } from '../utils/productGrouping';

const HomeCategoryCard = ({ id, name, image, onSelectCategory }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
      onClick={() => onSelectCategory(id)}
    >
      {/* Imagen de la categoría */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        {/* Overlay semi-transparente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-4 drop-shadow-lg">
          {name}
        </h2>
        <button 
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/95 hover:bg-white text-[#0033A0] font-bold rounded-full transition-all duration-300 group-hover:gap-4 group-hover:shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCategory(id);
          }}
        >
          Explorar productos
          <svg 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HomeCategoryCard;