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

// Helper: Obtener imagen genérica por palabra clave en la descripción
const getAutomatedImage = (product) => {
  // Combinamos nombre y descripción para mayor cobertura
  const texto = (product.nombre + " " + (product.descripcion || "")).toLowerCase();

  // --- ETIQUETAS PRINCIPALES DE TU NEGOCIO ---
  // AGREGA AQUI NUEVAS PALABRAS CLAVE E IMAGENES FACILMENTE:
  if (texto.includes("vaso")) return "/assets/productos/genericos/vaso.png";
  if (texto.includes("bolsa")) return "/assets/productos/genericos/bolsa.png";
  if (texto.includes("plato")) return "/assets/productos/genericos/plato.png";
  if (texto.includes("tapa")) return "/assets/productos/genericos/tapa.png";
  if (texto.includes("domo")) return "/assets/productos/genericos/domo.png";
  if (texto.includes("harina")) return "/assets/productos/genericos/harina.png";
  if (texto.includes("charola") || texto.includes("bandeja")) return "/assets/productos/genericos/plato.png";
  if (texto.includes("contenedor") || texto.includes("bisagra")) return "/assets/productos/genericos/domo.png";
  if (texto.includes("molde") || texto.includes("aluminio")) return "/assets/productos/genericos/domo.png";
  if (texto.includes("agitador") || texto.includes("popote")) return "/assets/productos/genericos/vaso.png";
  if (texto.includes("brocha") || texto.includes("herramienta")) return "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=500&q=80";
  if (texto.includes("chocolate")) return "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=500&q=80";
  if (texto.includes("aceite")) return "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80";
  if (texto.includes("salsa") || texto.includes("condimento")) return "https://images.unsplash.com/photo-1472476440877-efabd5a2b5a9?auto=format&fit=crop&w=500&q=80";

  // Ejemplos de como expandir:
  // if (texto.includes("servilleta")) return "/assets/productos/genericos/servilleta.png";
  // if (texto.includes("caja")) return "/assets/productos/genericos/caja.png";
  // if (texto.includes("charola")) return "/assets/productos/genericos/charola.png";

  // Si no hay coincidencia, retorna null para usar el icono vectorial
  return null;
};

// Helper para extraer un identificador corto del producto (SKU o parte de desc)
const getProductIdentifier = (product) => {
  // Prioridad 1: SKU
  if (product.sku && product.sku.trim()) {
    return product.sku.trim().toUpperCase();
  }

  // Prioridad 2: Extraer número/medida de nombre/descripción (ej: "1 KG", "No. 8", "500 ML")
  const fullText = (product.nombre + " " + (product.descripcion || "")).toUpperCase();
  const patterns = [
    /\d+\s*(?:KG|G|L|ML|OZ|CM|M|MM|IN)/g, // Medidas: 1 KG, 500 ML
    /NO\.\s*\d+/g, // Números: No. 8, No. 12
    /\d+X\d+/g, // Dimensiones: 10X10
    /\d+PZ|\d+PZS|\d+PACK/g, // Paquetes: 100 PZ
  ];

  for (const pattern of patterns) {
    const match = fullText.match(pattern);
    if (match) return match[0];
  }

  // Por defecto: primeros 12 caracteres del nombre
  return product.nombre?.substring(0, 12).toUpperCase() || "PRODUCTO";
};

const DynamicProductImage = ({ product, isHovered }) => {
  const hasValidImage =
    product.imagenUrl &&
    product.imagenUrl.trim() !== "" &&
    product.imagenUrl.trim().toLowerCase() !== "categoria" &&
    !product.imagenUrl.trim().toLowerCase().startsWith("desechable") &&
    !product.imagenUrl.trim().toLowerCase().startsWith("materia") &&
    (product.imagenUrl.startsWith("http") || product.imagenUrl.startsWith("/"));

  // Obtener imagen genérica por palabra clave
  const automatedImage = getAutomatedImage(product);
  const productLabel = getProductIdentifier(product);

  // Mapeo de departamentos a iconos - MUY FLEXIBLE
  const getDepartmentIcon = (deptoName) => {
    if (!deptoName) return <MoreHorizontal size={48} />;

    let name = deptoName.toLowerCase();

    // MAPEO ESPECIAL: Inix → Desechable, Gaviota → Plástico
    if (name.includes("inix")) name = "desechable";
    if (name.includes("gaviota")) name = "plastico";

    // Desechables / Plásticos
    if (
      name.includes("desechable") ||
      name.includes("plastico") ||
      name.includes("plástico") ||
      name.includes("vaso") ||
      name.includes("plato") ||
      name.includes("cubierto") ||
      name.includes("bolsa")
    ) {
      return <ShoppingBag size={56} />;
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
    // Ferretería y Herramientas
    if (
      name.includes("ferreteria") ||
      name.includes("ferretería") ||
      name.includes("herramienta")
    ) {
      return <Zap size={56} />;
    }

    // Icono por defecto para TODO lo demás
    return <ShoppingBag size={56} />;
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Imagen o placeholder */}
      <div className="h-full w-full">
        {/* Prioridad 1: Imagen original del producto */}
        {hasValidImage && (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className={`h-full w-full object-cover transition-all duration-500 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />
        )}

        {/* Prioridad 2: Imagen genérica por palabra clave */}
        {!hasValidImage && automatedImage && (
          <img
            src={automatedImage}
            alt={product.nombre}
            className={`h-full w-full object-cover transition-all duration-500 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}

        {/* Prioridad 3: Icono vectorial por departamento */}
        {!hasValidImage && !automatedImage && (
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
        )}
      </div>

      {/* Etiqueta flotante PREMIUM - Esquina inferior izquierda */}
      <div className="absolute bottom-3 left-3 z-10">
        <div className="backdrop-blur-sm bg-white/90 border border-gray-200/70 px-2.5 py-1.5 rounded-full shadow-sm">
          <p className="text-[10px] font-semibold tracking-wider text-gray-700 uppercase leading-tight">
            {productLabel}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DynamicProductImage;
