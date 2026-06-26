-- =============================================================================
-- SCRIPT DE MIGRACIÓN: ARQUITECTURA DE 3 NIVELES (MACROCATEGORÍA -> CATEGORÍA -> PRODUCTO)
-- =============================================================================
-- 
-- IMPORTANTE: Este script debe ejecutarse en Neon DB.
-- 
-- CANDADO DE SEGURIDAD: NO SE BORRAN REGISTROS DE PRODUCTOS NI CATEGORÍAS
-- =============================================================================

-- Paso 1: Crear la tabla macrocategorias (Nivel 1 - Superior)
CREATE TABLE IF NOT EXISTS macrocategorias (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Paso 2: Añadir la columna macrocategoria_id a la tabla categorias
-- (Primero como nullable para evitar errores con datos existentes)
ALTER TABLE categorias 
ADD COLUMN IF NOT EXISTS macrocategoria_id BIGINT;

-- Paso 3: Migrar los datos de departamentos a macrocategorias (preservando IDs)
-- Esto mantendrá las relaciones existentes intactas
INSERT INTO macrocategorias (id, nombre, imagen_url, activo)
SELECT id, nombre, imagen_url, activo 
FROM departamentos
ON CONFLICT (id) DO NOTHING;

-- Paso 4: Actualizar la columna macrocategoria_id en categorias con los valores de departamento_id
UPDATE categorias 
SET macrocategoria_id = departamento_id
WHERE macrocategoria_id IS NULL;

-- Paso 5: Añadir la llave foránea de macrocategorias a categorias
ALTER TABLE categorias 
ADD CONSTRAINT fk_categorias_macrocategoria 
FOREIGN KEY (macrocategoria_id) REFERENCES macrocategorias(id);

-- Paso 6: Eliminar la columna departamento_id de categorias (ya no es necesaria)
ALTER TABLE categorias 
DROP CONSTRAINT IF EXISTS fk_categorias_departamento;

ALTER TABLE categorias 
DROP COLUMN IF EXISTS departamento_id;

-- Paso 7: Eliminar la referencia a subcategoria en productos (seguridad)
ALTER TABLE productos 
DROP CONSTRAINT IF EXISTS fk_productos_subcategoria;

ALTER TABLE productos 
DROP COLUMN IF EXISTS subcategoria_id;

-- Paso 8: Eliminar las tablas obsoletas (departamentos y subcategorias)
-- CASCADE elimina cualquier restricción que dependa de estas tablas
DROP TABLE IF EXISTS subcategorias CASCADE;
DROP TABLE IF EXISTS departamentos CASCADE;

-- =============================================================================
-- FIN DEL SCRIPT DE MIGRACIÓN
-- =============================================================================
