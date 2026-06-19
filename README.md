# Proyecto Tzompcomer - E-commerce Completo

## Descripción
Sistema de e-commerce completo con backend en Spring Boot y frontend en React + Vite + Tailwind CSS.

## Estructura del Proyecto
```
Comercializadora-Tzompantzi/
├── backend/          # Spring Boot + PostgreSQL
├── frontend/         # React + Vite + Tailwind
├── database/         # Scripts SQL
└── EJECUTAR_BACKEND.bat
```

## Requisitos Previos

### Para el Backend
- Java 17+
- PostgreSQL
- IDE compatible con Spring Boot (IntelliJ, Eclipse, VS Code)

### Para el Frontend
- Node.js 18+
- npm o yarn

## Instalación Rápida

### 1. Configurar la Base de Datos
1. Instala PostgreSQL
2. Crea la base de datos: `CREATE DATABASE tzompcomer;`
3. Ejecuta el script en `database/schema.sql`

### 2. Ejecutar el Backend
1. Abre la carpeta `backend` en tu IDE
2. Ejecuta la clase `ApiApplication.java`
3. Verifica: http://localhost:8080/api/departamentos

### 3. Ejecutar el Frontend
```bash
cd frontend
npm install
npm run dev
```

## Funcionalidades

### Backend
- CRUD de productos y departamentos
- Búsqueda y filtrado
- Importación de productos desde Excel
- API REST completa

### Frontend
- Navegación por departamentos
- Búsqueda de productos
- Carrito de compras persistente
- Checkout con integración WhatsApp
- Diseño moderno estilo Shopify

## Colores de la Marca
- Azul Tzompcomer: #0033A0
- Dorado Tzompcomer: #D4AF37
- Azul Oscuro: #001A54

## Archivos Importantes
- `database/schema.sql` - Estructura y datos de ejemplo
- `backend/src/main/resources/application.properties` - Configuración BD
- `frontend/src/App.jsx` - Punto de entrada del frontend

## Contacto
Para consultas: soporte@tzompcomer.com
