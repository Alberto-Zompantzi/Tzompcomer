# Tzompcomer — Catálogo B2B

E-commerce B2B con backend Spring Boot + Neon PostgreSQL y frontend React/Vite.

## Arranque local (IntelliJ / terminal)

### Backend — perfil H2 (sin variables, recomendado para probar)

Perfil por defecto: **h2**. No necesitas configurar nada.

1. Abre `backend` en IntelliJ
2. Ejecuta `ApiApplication.java`
3. Verifica: http://localhost:8080/ → debe mostrar `"productos": 3938` tras la importación
4. API: http://localhost:8080/api/macrocategorias

### Backend — Neon PostgreSQL (BD vacía en producción)

En **Run Configuration → Environment variables**:

```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://TU-HOST.neon.tech/neondb?sslmode=require
```

Pega la URL completa que te da Neon. Al arrancar con BD vacía:
- Crea tablas automáticamente (`ddl-auto=update`)
- Siembra 4 macrocategorías + 38 categorías
- Importa ~3,938 productos B2B desde `productos.xlsx` en background

### Frontend

```bash
cd frontend
npm install
npm run dev
```

`.env` local: `VITE_API_URL=http://localhost:8080/api`

## Despliegue producción (Render)

### Backend (Docker)

Archivo `render.yaml` incluido. Variables en Render:

| Variable | Valor |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `SPRING_DATASOURCE_URL` | URL JDBC de Neon |
| `catalog.auto-import` | `true` |

Health check: `/health`

### Frontend

Build con `VITE_API_URL=https://tzompcomer-backend.onrender.com/api` (ya en `.env.production`).

## Panel admin

- Footer → clic en `·` → contraseña: `TzompAdmin2026!`
- Importar Excel, CRUD, reclasificar productos, editar imágenes por URL

## Catálogo B2B

Solo importa departamentos: desechable, INIX, plástico, GAVIOTA, materia prima, ferretería.

4 macrocategorías → 38 categorías → productos con imagen automática por descripción.

## Colores

- Azul: `#0033A0`
- Dorado: `#D4AF37`
