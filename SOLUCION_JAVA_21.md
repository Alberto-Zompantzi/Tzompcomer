# Solución para Java 21

¡Perfecto! Ahora el proyecto está configurado para Java 21. Aquí tienes los pasos para que funcione:

## 1. Recargar el Proyecto en tu IDE

### IntelliJ IDEA:
1. Ve a `File > Invalidate Caches...`
2. Marca todas las opciones
3. Haz clic en `Invalidate and Restart`
4. Después de reiniciar, ve a `View > Tool Windows > Maven`
5. Haz clic en el botón de recargar (🔄)

### Eclipse:
1. Ve a `Project > Clean...`
2. Selecciona el proyecto y haz clic en `Clean`
3. Haz clic derecho en el proyecto > `Maven > Update Project`

### VS Code:
1. Presiona `Ctrl+Shift+P`
2. Escribe `Java: Clean Java Language Server Workspace`
3. Ejecútalo y reinicia VS Code

## 2. Verificar la Configuración de Java en tu IDE

### IntelliJ IDEA:
- Ve a `File > Project Structure > Project`
- Asegúrate que:
  - **SDK**: Java 21
  - **Language level**: 21 - Pattern matching for switch
- Ve a `File > Project Structure > Modules`
- Asegúrate que el Language level también sea 21

### Eclipse:
- Ve a `Window > Preferences > Java > Installed JREs`
- Asegúrate de que Java 21 esté seleccionado
- Ve a `Project > Properties > Java Compiler`
- Establece **Compiler compliance level**: 21

## 3. Ejecutar el Backend

### Opción 1: Usando tu IDE
1. Abre el archivo `ApiApplication.java`
2. Haz clic derecho y selecciona `Run 'ApiApplication'`

### Opción 2: Si tienes Maven
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

## 4. Verificar que Funcione

Abre tu navegador y visita:
```
http://localhost:8080/api/departamentos
```

¡Si tienes datos, todo está bien! 🎉

## Lo que Actualicé

✅ Spring Boot: 3.2.5 → 3.3.1 (compatible con Java 21)  
✅ Java Version: 17 → 21  
✅ Maven Compiler Plugin: 3.11.0 → 3.13.0  
✅ Lombok: 1.18.30 → 1.18.34 (compatible con Java 21)
