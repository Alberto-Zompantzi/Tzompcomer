import {
  ShoppingBag,
  Droplets,
  Utensils,
  Coffee,
  Truck,
  Box,
  Flower2,
  Sparkles,
  Home,
  Shirt,
  Zap,
  BookOpen,
  Gamepad2,
  MoreHorizontal,
} from "lucide-react";

const DynamicProductImage = ({ product, isHovered }) => {
  const hasValidImage =
    product.imagenUrl &&
    product.imagenUrl.trim() !== "" &&
    product.imagenUrl.trim().toLowerCase() !== "categoria";

  // Mapeo de departamentos a iconos - MUY FLEXIBLE
  const getDepartmentIcon = (deptoName) => {
    if (!deptoName) return <MoreHorizontal size={48} />;

    const name = deptoName.toLowerCase();

    // Abarrotes / Alimentos
    if (
      name.includes("abarrote") ||
      name.includes("alimento") ||
      name.includes("comida") ||
      name.includes("snack") ||
      name.includes("galleta") ||
      name.includes("dulce") ||
      name.includes("pan") ||
      name.includes("pastel")
    ) {
      return <Utensils size={56} />;
    }
    // Bebidas
    if (
      name.includes("bebida") ||
      name.includes("agua") ||
      name.includes("refresco") ||
      name.includes("jugo") ||
      name.includes("leche") ||
      name.includes("cerveza")
    ) {
      return <Droplets size={56} />;
    }
    // Desechables / Plásticos
    if (
      name.includes("desechable") ||
      name.includes("plástico") ||
      name.includes("vaso") ||
      name.includes("plato") ||
      name.includes("cubierto") ||
      name.includes("bolsa")
    ) {
      return <ShoppingBag size={56} />;
    }
    // Café
    if (
      name.includes("café") ||
      name.includes("cafe") ||
      name.includes("té") ||
      name.includes("te")
    ) {
      return <Coffee size={56} />;
    }
    // Ropa / Calzado
    if (
      name.includes("ropa") ||
      name.includes("zapato") ||
      name.includes("calzado") ||
      name.includes("playera") ||
      name.includes("camisa") ||
      name.includes("pantalón")
    ) {
      return <Shirt size={56} />;
    }
    // Hogar / Limpieza
    if (
      name.includes("hogar") ||
      name.includes("limpieza") ||
      name.includes("mueble") ||
      name.includes("silla") ||
      name.includes("mesa")
    ) {
      return <Home size={56} />;
    }
    // Electrónica / Tecnología
    if (
      name.includes("electrónica") ||
      name.includes("tecnología") ||
      name.includes("celular") ||
      name.includes("telefono") ||
      name.includes("computadora")
    ) {
      return <Zap size={56} />;
    }
    // Juguetes
    if (
      name.includes("juguete") ||
      name.includes("juego") ||
      name.includes("pelota")
    ) {
      return <Gamepad2 size={56} />;
    }
    // Papelería
    if (
      name.includes("libro") ||
      name.includes("papelería") ||
      name.includes("libreta") ||
      name.includes("lapiz")
    ) {
      return <BookOpen size={56} />;
    }
    // Flores / Decoración
    if (
      name.includes("flor") ||
      name.includes("decoración") ||
      name.includes("planta")
    ) {
      return <Flower2 size={56} />;
    }
    // Materias Primas / Granos
    if (
      name.includes("materia") ||
      name.includes("harina") ||
      name.includes("grano") ||
      name.includes("arroz") ||
      name.includes("frijol") ||
      name.includes("azúcar")
    ) {
      return <Box size={56} />;
    }
    // Envíos / Paquetería
    if (
      name.includes("envío") ||
      name.includes("paquete") ||
      name.includes("entrega")
    ) {
      return <Truck size={56} />;
    }

    // Icono por defecto para TODO lo demás
    return <Sparkles size={56} />;
  };

  if (hasValidImage) {
    return (
      <img
        src={product.imagenUrl}
        alt={product.nombre}
        className={`h-full w-full object-cover transition-all duration-500 ${
          isHovered ? "scale-105" : "scale-100"
        }`}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-between bg-shopify-gray p-4">
      {/* Tzompcomer superior */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-black tracking-tight text-[#0033A0]">
          TZOMP
        </span>
        <span className="text-xs font-black tracking-tight text-[#D4AF37]">
          COMER
        </span>
      </div>

      {/* Icono central */}
      <div
        className={`flex items-center justify-center transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
          <div className="text-[#0033A0]">
            {getDepartmentIcon(
              product.departamento?.nombre || product.categoria,
            )}
          </div>
        </div>
      </div>

      {/* Nombre de categoría inferior */}
      <div className="max-w-full text-center">
        <p className="line-clamp-2 text-xs font-bold uppercase tracking-wide text-gray-500">
          {product.departamento?.nombre || product.categoria || "Producto"}
        </p>
      </div>
    </div>
  );
};

export default DynamicProductImage;
