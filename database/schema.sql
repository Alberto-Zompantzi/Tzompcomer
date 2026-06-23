-- Tabla 'departamentos'
CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    identificador_icono VARCHAR(100)
);

-- Tabla 'productos'
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    departamento_id INT REFERENCES departamentos(id),
    categoria VARCHAR(100),
    imagen_url VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE
);

-- Índices
CREATE INDEX idx_productos_sku ON productos(sku);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_departamento_id ON productos(departamento_id);

-- Datos de ejemplo
INSERT INTO departamentos (nombre, identificador_icono) VALUES 
('Electrónica', 'electronics'),
('Ropa y Calzado', 'clothing'),
('Hogar y Decoración', 'home'),
('Deportes y Fitness', 'sports'),
('Juguetes y Juegos', 'toys'),
('Belleza y Cuidado', 'beauty');

INSERT INTO productos (sku, nombre, descripcion, precio, departamento_id, categoria, imagen_url, disponible, activo) VALUES 
('PROD-001', 'Smartphone Premium 15 Pro Max 256GB Azul', 'Teléfono inteligente de última generación', 21999.00, 1, 'Celulares', NULL, TRUE, TRUE),
('PROD-002', 'Camiseta Premium de Algodón 100% - Negro', 'Camiseta de algodón 100% premium', 499.00, 2, 'Camisetas', NULL, TRUE, TRUE),
('PROD-003', 'Silla Ergonómica de Oficina Pro', 'Silla ergonómica ajustable premium', 8499.00, 3, 'Muebles', NULL, TRUE, TRUE),
('PROD-004', 'Balón de Fútbol Oficial Match', 'Balón oficial de la liga profesional', 1299.00, 4, 'Fútbol', NULL, TRUE, TRUE),
('PROD-005', 'Laptop Pro 16" M3 Max 64GB RAM', 'Laptop para profesionales de alto rendimiento', 68999.00, 1, 'Computadoras', NULL, TRUE, TRUE),
('PROD-006', 'Jeans Slim Fit Premium - Azul Oscuro', 'Jeans clásico de alta calidad', 999.00, 2, 'Pantalones', NULL, TRUE, TRUE),
('PROD-007', 'Mesa de Centro de Madera Maciza', 'Mesa de madera para sala de estar', 12999.00, 3, 'Muebles', NULL, TRUE, TRUE),
('PROD-008', 'Raqueta de Tenis Profesional Tour', 'Raqueta profesional de competición', 4999.00, 4, 'Tenis', NULL, TRUE, TRUE),
('PROD-009', 'Audífonos Inalámbricos Pro Max ANC', 'Audífonos con cancelación de ruido activa', 6499.00, 1, 'Audio', NULL, TRUE, TRUE),
('PROD-010', 'Set de Cuidado Facial Premium', 'Kit completo de cuidado de la piel', 2499.00, 6, 'Cuidado Facial', NULL, TRUE, TRUE);
