-- Migración para el Master Catalog Manager
-- Paso 1: Añadir columna activo a departamentos
ALTER TABLE departamentos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;

-- Paso 2: Añadir columna activo a categorias y departamento_id
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS departamento_id INT REFERENCES departamentos(id);

-- Paso 3: Añadir columna categoria_id a productos
ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria_id INT REFERENCES categorias(id);

-- Paso 4: Actualizar registros existentes (opcional, según datos actuales)
-- UPDATE departamentos SET activo = TRUE WHERE activo IS NULL;
-- UPDATE categorias SET activo = TRUE WHERE activo IS NULL;
