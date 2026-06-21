# 📋 HOJA DE REFERENCIA RÁPIDA - TZOMPCOMER

## 🎯 LO QUE CAMBIAS PARA TU NEGOCIO

| Lo que quieres cambiar | Archivo a editar | Ubicación |
|------------------------|-----------------|-----------|
| 📦 Productos y Departamentos | DataInitializer.java | backend/src/main/java/com/tzompcomer/api/config/ |
| 🎨 Colores de la marca | index.css | frontend/src/ |
| 🏷️ Logo / Nombre | Header.jsx | frontend/src/components/ |
| 📱 Número de WhatsApp | CheckoutModal.jsx | frontend/src/components/ |
| 🖼️ Imágenes | Carpeta public/ | frontend/public/ |
| 🗄️ Base de Datos | application.properties | backend/src/main/resources/ |

---

## 🔍 UBICACIONES DE LOS ARCHIVOS CLAVE

```
Comercializadora-Tzompantzi/
├── backend/
│   └── src/main/java/com/tzompcomer/api/config/
│       └── DataInitializer.java  ⭐ AQUI LOS PRODUCTOS
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartDrawer.jsx
│   │   │   └── CheckoutModal.jsx  ⭐ AQUI EL WHATSAPP
│   │   └── index.css  ⭐ AQUI LOS COLORES
│   └── public/  ⭐ AQUI LAS IMÁGENES
└── database/
```

---

## ✅ CHEQUEO RÁPIDO

1. [ ] Datos de productos y departamentos (DataInitializer.java)
2. [ ] Colores de la marca (index.css)
3. [ ] Logo / Nombre (Header.jsx)
4. [ ] Número de WhatsApp (CheckoutModal.jsx)
5. [ ] Imágenes de productos (carpeta public/)
6. [ ] Prueba de carrito y checkout

---

## 🎮 EJEMPLOS DE CÓDIGO

### 1. Producto con imagen
```java
Producto p = new Producto();
p.setImagenUrl("/productos/cafe.jpg");
// Coloca cafe.jpg en frontend/public/productos/
```

### 2. Cambiar color principal
```css
/* frontend/src/index.css */
@theme {
  --color-tzomp-azul: #8B4513; /* Café */
}
```

### 3. Cambiar número de WhatsApp
```jsx
const numeroWhatsApp = '5215512345678';
```

---

## 🚀 CÓMO PROBAR

1. **Backend**: Ejecuta `ApiApplication.java`
2. **Frontend**: Ejecuta `npm run dev`
3. **Verifica**: Abre http://localhost:5173
