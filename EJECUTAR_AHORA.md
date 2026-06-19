# 🚀 ¡Listo para Ejecutar!

¡Perfecto! He configurado todo para que funcione sin PostgreSQL.

## 📋 Pasos para Ejecutar:

### 1. Detén el Backend Actual (si está corriendo)

### 2. Vuelve a Ejecutar `ApiApplication.java`

En IntelliJ, haz clic derecho en `ApiApplication.java` y selecciona **Run 'ApiApplication'**

### 3. ¡Disfruta! 🎉

El backend ahora está corriendo con:
- Base de datos en memoria (H2) - no necesita PostgreSQL
- Datos de ejemplo precargados (10 productos y 6 departamentos)
- H2 Console para ver los datos en: http://localhost:8080/h2-console

## 🌐 URLs Importantes:

### Backend API:
- **Departamentos**: http://localhost:8080/api/departamentos
- **Productos**: http://localhost:8080/api/productos/all
- **H2 Console**: http://localhost:8080/h2-console (para ver la base de datos)

### Para conectar al H2 Console:
- JDBC URL: `jdbc:h2:mem:tzompcomerdb`
- Username: `sa`
- Password: (dejar vacío)

### Frontend:
En otra terminal:
```bash
cd frontend
npm run dev
```

## 📊 Datos de Ejemplo:
- 6 Departamentos: Electrónica, Ropa, Hogar, Deportes, Juguetes, Belleza
- 10 Productos: Todos con precios y categorías

## 💾 Posteriormente, si quieres usar PostgreSQL:
Solo tienes que:
1. Instalar PostgreSQL
2. Crear la base de datos `tzompcomer`
3. Comentar las líneas de H2 y descomentar las de PostgreSQL en `application.properties`

¡Ahora prueba y diviértete! 🛒✨
