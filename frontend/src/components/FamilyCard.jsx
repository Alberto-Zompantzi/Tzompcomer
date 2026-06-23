import { FALLBACK_IMAGE } from '../utils/productGrouping';

const FamilyCard = ({ family, onSelectFamily }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      onClick={() => onSelectFamily(family.id)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={family.image} 
          alt={family.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <h3 className="text-lg md:text-xl font-black text-white mb-3 drop-shadow-lg">
          {family.name}
        </h3>
        <button 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 hover:bg-white text-[#0033A0] font-bold rounded-full transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onSelectFamily(family.id);
          }}
        >
          Ver productos
        </button>
      </div>
    </div>
  );
};

export default FamilyCard;