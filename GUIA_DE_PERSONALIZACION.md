# 📖 GUÍA COMPLETA DE PERSONALIZACIÓN - TZOMPCOMER

# ================================================

# Este manual te enseñará a modificar TODO el proyecto para adaptarlo a tu negocio real

# ================================================

# 1. CAMBIAR LOS DATOS DE LOS PRODUCTOS Y DEPARTAMENTOS

# ================================================

## 🎯 Opción 1: Modificar el DataInitializer (Backend)

## Ubicación: backend/src/main/java/com/tzompcomer/api/config/DataInitializer.java

### Ejemplo: Cambiar productos y departamentos

```java
// Edita estas líneas en el método run()
Departamento alimentos = new Departamento();
alimentos.setNombre("Alimentos y Bebidas");
alimentos.setIdentificadorIcono("food");
alimentos = departamentoRepository.save(alimentos);

Producto p1 = new Producto();
p1.setSku("ALM-001");
p1.setNombre("Café Orgánico Premium 500g");
p1.setDescripcion("Café 100% orgánico de Chiapas");
p1.setPrecio(new BigDecimal("149.00"));
p1.setDepartamento(alimentos);
p1.setCategoria("Bebidas");
p1.setImagenUrl("https://ejemplo.com/cafe.jpg");
p1.setDisponible(true);
productoRepository.save(p1);
```

## 🎯 Opción 2: Usar el Endpoint de Excel

1. Crea un archivo Excel (.xlsx) con tus productos
2. Columnas: Nombre, Departamento, Categoría, Precio, SKU
3. Usa el endpoint: POST http://localhost:8080/api/admin/upload-excel

## 🎯 Opción 3: Usar la H2 Console

1. Ve a http://localhost:8080/h2-console
2. URL: jdbc:h2:mem:tzompcomerdb
3. Usuario: sa
4. Ejecuta SQL para insertar datos:

```sql
INSERT INTO departamento (nombre, identificador_icono) VALUES
('Tu Departamento', 'icono');

INSERT INTO producto (sku, nombre, descripcion, precio, departamento_id, categoria, imagen_url, disponible) VALUES
('TU-SKU', 'Tu Producto', 'Descripción', 99.99, 1, 'Categoría', 'url.jpg', TRUE);
```

# ================================================

# 2. CAMBIAR LOS COLORES Y ESTILOS DE LA MARCA

# ================================================

## Archivo a editar: frontend/src/index.css

### Ubicación: frontend/src/index.css

### Ejemplo: Cambiar colores

```css
@import "tailwindcss";

@theme {
  /* TUS COLORES PERSONALIZADOS */
  --color-tuRojo: #ff0000;
  --color-tuAzul: #0066ff;
  --color-tuVerde: #00cc00;
  --color-tuDorado: #ffd700;
  /* Mantén o cambia los colores existentes */
  --color-shopify-gray: #f0f0f0;
  --color-shopify-text: #222222;
  --color-tzomp-azul: #1a56db;
  --color-tzomp-dorado: #fbbf24;
  --color-tzomp-azul-oscuro: #1e40af;
}
```

## Archivo a editar: frontend/tailwind.config.js

### Ubicación: frontend/tailwind.config.js

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // TUS COLORES AQUI
        miColor: "#FF00FF",
        colorEmpresa: "#008080",
      },
    },
  },
};
```

# ================================================

# 3. MODIFICAR EL HEADER Y LOGO

# ================================================

## Archivo: frontend/src/components/Header.jsx

### Cambiar el logo:

```jsx
// Lineas 15-20
<div className="flex items-center gap-2">
  {/* Opción 1: Texto */}
  <h1 className="text-2xl font-black tracking-tight text-shopify-text">
    TU MARCA <span className="text-tzomp-azul">COMERCIAL</span>
  </h1>
  {/* Opción 2: Imagen */}
  <img src="/tu-logo.png" alt="Tu Logo" className="h-12" />
</div>
```

### Cambiar el placeholder del buscador:

```jsx
// Linea 38
placeholder = "Buscar productos de tu negocio...";
```

# ================================================

# 4. MODIFICAR LAS TARJETAS DE PRODUCTOS

# ================================================

## Archivo: frontend/src/components/ProductCard.jsx

### Mostrar siempre la categoría:

```jsx
// Añade esto después de la línea 63
<p className="text-xs text-gray-400">{product.categoria}</p>
```

### Cambiar el botón:

```jsx
// Lineas 75-119
<button>{isAdded ? "✅ Añadido" : "🛒 Añadir al Carrito"}</button>
```

### Cambiar el badge de disponible:

```jsx
// Lineas 52-56
{
  product.disponible && (
    <span className="absolute left-3 top-3 rounded-full bg-green-500 text-white px-3 py-1 text-xs font-bold">
      ✨ Disponible Ahora
    </span>
  );
}
```

# ================================================

# 5. MODIFICAR EL CARRITO DE COMPRAS

# ================================================

## Archivo: frontend/src/components/CartDrawer.jsx

### Cambiar el texto del total:

```jsx
<div className="flex items-center justify-between mb-4">
  <span className="text-lg font-semibold text-shopify-text">Total a Pagar</span>
  <span className="text-2xl font-black text-tzomp-azul">
    ${cartTotal.toFixed(2)} MXN
  </span>
</div>
```

### Cambiar el botón de proceder:

```jsx
<button className="mb-3 w-full rounded-full bg-tzomp-azul px-6 py-3.5 text-sm font-bold text-white">
  🚀 Continuar con el Pedido
</button>
```

# ================================================

# 6. MODIFICAR EL CHECKOUT (WhatsApp)

# ================================================

## Archivo: frontend/src/components/CheckoutModal.jsx

### Paso 1: Cambiar el número de WhatsApp

```jsx
// Línea ~45
const numeroWhatsApp = "5215512345678"; // TU NÚMERO AQUI (con código de país)
```

### Paso 2: Cambiar el mensaje de WhatsApp

```jsx
// Líneas ~30-44
const mensaje = `🛒 ¡PEDIDO NUEVO!

👤 Cliente: ${formData.nombre}
📞 Teléfono: ${formData.telefono}
📦 Entrega: ${formData.metodoEntrega}

--- PRODUCTOS ---
${productosTexto}

💰 TOTAL: $${cartTotal.toFixed(2)}

¡Gracias por tu compra! 🙏`;
```

# ================================================

# 7. AGREGAR IMÁGENES A LOS PRODUCTOS

# ================================================

## Opción 1: Usar URLs de Internet

### En DataInitializer.java:

```java
p1.setImagenUrl("https://tu-sitio.com/imagen.jpg");
```

## Opción 2: Usar imágenes locales

### Coloca tus imágenes en: frontend/public/

### Ejemplo:

```java
p1.setImagenUrl("/productos/cafe.jpg");
```

## Opción 3: Usar Imgur o servicios de imágenes

1. Sube tus imágenes a Imgur
2. Copia la URL directa
3. Pégala en el campo imagenUrl

# ================================================

# 8. MODIFICAR LA PÁGINA PRINCIPAL

# ================================================

## Archivo: frontend/src/App.jsx

### Cambiar el título principal:

```jsx
// Linea 133
<h2 className="text-3xl font-black text-shopify-text">
  {selectedDepartment
    ? departments.find((d) => d.id === selectedDepartment)?.nombre
    : "¡Bienvenidos a Mi Negocio!"}
</h2>
```

### Agregar un banner:

```jsx
// Añade esto después de la línea 129
<div className="bg-gradient-to-r from-tzomp-azul to-blue-900 text-white py-8 px-6 mb-8 rounded-2xl">
  <h2 className="text-3xl font-bold mb-2">🎉 Ofertas Especiales</h2>
  <p className="text-lg opacity-90">¡Los mejores productos al mejor precio!</p>
</div>
```

# ================================================

# 9. MODIFICAR EL MENÚ DE DEPARTAMENTOS

# ================================================

## Archivo: frontend/src/components/DepartmentNav.jsx

### Cambiar "Todos" a otro texto:

```jsx
// Linea ~18
<button className="...">Todos los Productos</button>
```

# ================================================

# 10. CAMBIAR LA CONFIGURACIÓN DEL BACKEND

# ================================================

## Archivo: backend/src/main/resources/application.properties

### Cambiar puerto:

```properties
server.port=8081
```

### Cambiar base de datos:

```properties
# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/tu_base
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

# ================================================

# 11. EJEMPLOS DE PERSONALIZACIÓN COMÚN

# ================================================

## 🎨 Ejemplo 1: Tienda de Ropa

### En DataInitializer.java:

```java
Departamento ropa = new Departamento();
ropa.setNombre("Ropa y Accesorios");
ropa.setIdentificadorIcono("clothes");

Producto camisa = new Producto();
camisa.setSku("ROP-001");
camisa.setNombre("Camisa de Algodón Premium");
camisa.setPrecio(new BigDecimal("399.00"));
camisa.setCategoria("Camisas");
```

## 🍔 Ejemplo 2: Restaurante

### En DataInitializer.java:

```java
Departamento comida = new Departamento();
comida.setNombre("Comida Rápida");

Producto hamburguesa = new Producto();
hamburguesa.setSku("COM-001");
hamburguesa.setNombre("Hamburguesa Doble con Papas");
hamburguesa.setPrecio(new BigDecimal("89.00"));
hamburguesa.setCategoria("Hamburguesas");
```

## 🏪 Ejemplo 3: Tienda de Abarrotes

### En DataInitializer.java:

```java
Departamento despensa = new Departamento();
despensa.setNombre("Despensa Básica");

Producto leche = new Producto();
leche.setSku("ABR-001");
leche.setNombre("Leche Lala Light 1L");
leche.setPrecio(new BigDecimal("22.50"));
leche.setCategoria("Lácteos");
```

# ================================================

# 12. VERIFICAR Y PROBAR LOS CAMBIOS

# ================================================

## 1. Backend:

- Detén el servidor
- Vuelve a ejecutar ApiApplication.java
- Ve a http://localhost:8080/api/departamentos para verificar

## 2. Frontend:

- Detén el frontend (Ctrl+C)
- Vuelve a ejecutar npm run dev
- Abre http://localhost:5173

## 3. Prueba:

- Navega por los departamentos
- Añade productos al carrito
- Prueba el checkout
- Verifica que todo funcione

# ================================================

# 13. TIPS Y BUENAS PRÁCTICAS

# ================================================

✅ **Haz copias de seguridad**: Antes de modificar archivos importantes
✅ **Prueba poco a poco**: Modifica una cosa y prueba antes de continuar
✅ **Usa nombres claros**: Nombres de productos y categorías que los clientes entiendan
✅ **Imágenes de calidad**: Usa imágenes de al menos 600x600px
✅ **Actualiza constantemente**: Mantén tu inventario al día

# ================================================

# 14. GUÍA RÁPIDA - LO MÁS IMPORTANTE

# ================================================

1. **Datos de productos**: Edita DataInitializer.java
2. **Colores**: Edita index.css
3. **Número WhatsApp**: Edita CheckoutModal.jsx
4. **Imágenes**: Ponlas en frontend/public/
5. **Logo**: Edita Header.jsx

¡Listo! Ahora ya sabes cómo personalizar TODO el proyecto para tu negocio.
