# Guía de Solución de Problemas del Backend

## Error: java.lang.ExceptionInInitializerError com.sun.tools.javac.code.TypeTag :: UNKNOWN

Este error se debe a un problema con Lombok o la versión de Java. Aquí está la solución paso a paso:

## Paso 1: Limpiar el Proyecto

Si estás usando IntelliJ IDEA:
1. Ve a `File > Invalidate Caches...`
2. Selecciona todas las opciones y haz clic en `Invalidate and Restart`

Si estás usando Eclipse:
1. Ve a `Project > Clean...`
2. Selecciona el proyecto y haz clic en `Clean`

## Paso 2: Verificar la Versión de Java

Asegúrate de tener Java 17 instalado:
```bash
java -version
```

Deberías ver algo como:
```
java version "17.x.x"
```

## Paso 3: Reconstruir el Proyecto

Si tienes Maven instalado, ejecuta en la carpeta `backend`:
```bash
mvn clean install
```

## Paso 4: Ejecutar el Backend

### Opción 1: Usando Maven
```bash
mvn spring-boot:run
```

### Opción 2: Usando el IDE
1. Abre el proyecto en tu IDE (IntelliJ, Eclipse, VS Code)
2. Busca la clase `ApiApplication.java`
3. Haz clic derecho y selecciona `Run 'ApiApplication'`

## Paso 5: Verificar que el Backend esté Corriendo

Abre tu navegador y visita:
```
http://localhost:8080/api/departamentos
```

Deberías ver una lista de departamentos en formato JSON.

## Si el Problema Persiste

Si el error continúa, puedes:

1. **Eliminar la carpeta `.idea` (si usas IntelliJ)** y volver a abrir el proyecto
2. **Eliminar la carpeta `target`** y volver a compilar
3. **Verificar que Lombok está habilitado** en tu IDE:
   - En IntelliJ: `File > Settings > Build, Execution, Deployment > Compiler > Annotation Processors` y marca `Enable annotation processing`
   - En Eclipse: Instala el plugin de Lombok desde https://projectlombok.org/setup/eclipse

## Configuración de la Base de Datos

Recuerda configurar PostgreSQL primero:

1. Crea la base de datos `tzompcomer`
2. Ejecuta el script en `database/schema.sql`
3. Verifica las credenciales en `backend/src/main/resources/application.properties`
