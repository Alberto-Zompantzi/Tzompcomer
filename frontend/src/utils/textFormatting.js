// Convertir a Title Case limpio y legible
export const toTitleCase = (text) => {
  const specialCodes = new Set(['cp', 'pet', 'pp', 'bio']);
  return text.toLowerCase().split(' ').map(word => {
    // Mantenemos códigos especiales en mayúsculas
    if (specialCodes.has(word.toLowerCase())) {
      return word.toUpperCase();
    }
    // Capitalizamos la primera letra de cada palabra
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

// Formatear el texto para mostrar en el dropdown
export const formatProductOption = (productName) => {
  let text = productName.trim();
  
  // Aplicar Title Case limpio sin eliminar ninguna palabra
  text = toTitleCase(text);
  
  return text;
};

// Calcular la diferencia de precio
export const formatProductPrice = (price) => {
  return `($${price.toFixed(2)})`;
};
