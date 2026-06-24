
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const StarProductsBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Cargar banners desde el backend
    fetch(`${API_BASE_URL}/banner-destacados`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setBanners(data);
        } else {
          // Banners de respaldo si no hay datos
          setBanners([
            { id: 1, imagenUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80' },
            { id: 2, imagenUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80' },
            { id: 3, imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80' }
          ]);
        }
      })
      .catch(err => {
        console.error('Error cargando banners:', err);
        setBanners([
          { id: 1, imagenUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80' },
          { id: 2, imagenUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80' },
          { id: 3, imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80' }
        ]);
      });
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) return null;

  return (
    <section className="w-full my-10 md:my-16 overflow-hidden rounded-2xl shadow-lg">
      <div className="relative">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full">
              <img
                src={banner.imagenUrl}
                alt="Producto destacado"
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#D4AF37] scale-125 shadow-lg'
                  : 'bg-white/60 hover:bg-white/90'
              }`}
              aria-label={`Ver banner ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StarProductsBanner;
