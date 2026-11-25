# Proyecto Spa - PostgreSQL + Backend Express/TypeScript

Base de datos PostgreSQL 16 en Docker y backend base en Node.js + Express + TypeScript (`pg`) listo para empezar a construir los módulos CRUD.

## Estructura del proyecto

- `docker-compose.yml`: Contenedor de PostgreSQL 16 con persistencia (`postgres_data`) y ejecución automática de `db/init.sql`.
- `db/init.sql`: Esquema corregido a partir de `spa.sql` + datos semilla (`roles`, `users`, `clients`).
- `backend/`: API REST en Express + TypeScript con conexión `pg`, manejo centralizado de errores y 2 CRUDs de ejemplo (`roles` y `clients`).


## 1. Levantar la base de datos PostgreSQL

Desde una terminal en la raíz del proyecto:

```bash
docker compose up -d
```

Verificar que el contenedor esté saludable y las tablas creadas:

```bash
docker compose ps
docker exec -it spa_postgres psql -U spa_user -d spa_db -c "\dt"
```

> Nota: Si en el futuro modificas `db/init.sql` y quieres reinicializar la BD desde cero, ejecuta `docker compose down -v && docker compose up -d`.

## 2. Instalar y ejecutar el backend

```bash
cd backend
npm install
npm run typecheck
npm run dev
```

El servidor quedará escuchando en `http://localhost:3000`.

## 3. Endpoints disponibles

### Healthcheck
- `GET /health` — Verifica que el servidor y la conexión a PostgreSQL estén activos.

### Roles (`/api/roles`)
- `GET /api/roles`
- `GET /api/roles/:id`
- `POST /api/roles` — Body JSON: `{ "name": "Gerente", "description": "Opcional" }`
- `PATCH /api/roles/:id` — Body JSON parcial
- `DELETE /api/roles/:id`

### Clientes (`/api/clients`)
- `GET /api/clients`
- `GET /api/clients/:id`
- `POST /api/clients` — Body JSON: `{ "first_name": "Laura", "last_name": "Rojas", "client_type": "new" }`
- `PATCH /api/clients/:id` — Body JSON parcial
- `DELETE /api/clients/:id`

## Cómo agregar nuevos CRUDs

1. Crea una carpeta en `backend/src/modules/<entidad>/` siguiendo la estructura de `roles/` o `clients/`:
   - `<entidad>.service.ts` (consultas parametrizadas usando `query()` y `buildPartialUpdate()`)
   - `<entidad>.controller.ts` (lectura de `req.params` / `req.body` y respuestas HTTP)
   - `<entidad>.routes.ts` (rutas envueltas con `asyncHandler()`)
2. Registra el router en `backend/src/app.ts`.
