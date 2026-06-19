@echo off
echo Configuración inicial del proyecto Tzompcomer Backend
echo.
echo ==========================================
echo PASO 1: Configurar PostgreSQL
echo ==========================================
echo 1. Instala PostgreSQL desde https://www.postgresql.org/download/
echo 2. Crea la base de datos "tzompcomer"
echo 3. Ejecuta el script database/schema.sql para crear las tablas y datos de ejemplo
echo 4. Actualiza las credenciales en backend/src/main/resources/application.properties
echo.
pause
echo.
echo ==========================================
echo PASO 2: Ejecutar el Backend
echo ==========================================
echo 1. Abre el proyecto backend en tu IDE favorito (IntelliJ, Eclipse o VS Code
echo 2. Encuentra la clase ApiApplication.java
echo 3. Haz clic derecho y selecciona "Run 'ApiApplication'"
echo.
echo O si tienes Maven instalado:
echo   cd backend
echo   mvn spring-boot:run
echo.
pause
