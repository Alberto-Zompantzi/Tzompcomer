# Etapa 1: Build con Maven y Eclipse Temurin 17
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar pom.xml primero para aprovechar la caché de Docker
COPY pom.xml .

# Descargar dependencias
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar el .jar
RUN mvn clean package -DskipTests

# Etapa 2: Imagen de producción con Alpine
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar el .jar de la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
