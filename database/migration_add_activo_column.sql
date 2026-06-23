-- Script de migración segura para añadir la columna 'activo' sin perder datos
-- Ejecuta esto en tu consola de base de datos (H2 Console o PostgreSQL)

-- 1. Añade la columna 'activo' con valor DEFAULT TRUE
ALTER TABLE productos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;

-- 2. Actualiza cualquier registro existente para asegurarse de que tenga activo = TRUE
UPDATE productos SET activo = TRUE WHERE activo IS NULL;

-- Verifica que todo se haya hecho correctamente
SELECT id, sku, nombre, activo FROM productos LIMIT 10;
