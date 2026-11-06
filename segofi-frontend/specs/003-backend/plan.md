# Plan 003 — Backend monolítico SegOfi (Vercel + Turso)

# Plan 003: Backend Monolítico para SegOfi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Proveer persistencia y API real a SegOfi: funciones serverless Vercel con Hono, Turso (libSQL) con Drizzle ORM, adjuntos en Vercel Blob, aplicando en servidor auth, alcance por rol/departamento, transacciones y auditoría.

**Architecture:** Monolito de despliegue único: Vercel sirve el `dist/` de Vite y enruta `/api/*` a `api/index.ts` (handler Hono de `@hono/vercel`). Toda la lógica de dominio vive en módulos del backend; el frontend consume por servicios tipados y conserva `AuthContext`/guards/React Router.

**Tech Stack:** TypeScript, Hono, Drizzle ORM + @libsql/client (Turso), drizzle-kit (migraciones), jose (JWT), bcryptjs (hash), zod (validación), @vercel/blob (adjuntos), Vitest (pruebas).

**Spec:** `specs/003-backend/spec.md` (leer junto a `docs/logica-sistema.md`, `docs/modelo-datos.dbml`, `docs/constitution.md`).

## Estructura actual relevante

- Frontend: React 19 + Vite en la raíz (`src/`). `src/Data/*` son mocks de sesión; `src/Guards/` tiene `AuthContext`, `useAuth`, `RoleGuard`, `alcance.ts` (ROLES_ADMIN = [2,3]).
- No existe backend ni infraestructura de pruebas. Scripts actuales: `dev`, `build`, `lint`, `preview`.

## Mapa de archivos

**Backend (nuevo):**
- `api/index.ts` — entrada serverless: crea app Hono, monta rutas, exporta handler Vercel.
- `api/app/env.ts` — lectura tipada de variables (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `JWT_SECRET`, `BLOB_READ_WRITE_TOKEN`, `VITE_`_* para seed admin).
- `api/app/db/schema.ts` — tablas Drizzle espejo exacto de `docs/modelo-datos.dbml` (FK, únicos por folio, unicidad lógica de lecturas).
- `api/app/db/client.ts` — cliente Drizzle/libSQL por `env`.
- `api/app/db/migrate.ts` + `drizzle.config.ts` + `drizzle/` — migraciones versionadas.
- `api/app/db/seed.ts` — catálogos iniciales: roles (1 Operativo, 2 Admin, 3 Directora), estados (1-7 según `logica-sistema.md`), tipos documento, usuario admin semilla desde variables de entorno.
- `api/app/lib/auth.ts` — `hashPassword`, `verifyPassword`, `crearSesion(usuario)` (JWT en cookie httpOnly), `requireUser()` middleware (revalida `activo` en DB por request).
- `api/app/lib/alcance.ts` — versión servidor de `src/Guards/alcance.ts`: `tieneAccesoTotal`, `puedeVerOficio`, filtros SQL por alcance.
- `api/app/lib/folio.ts` — `reservarFolioOficio(tx)` y `reservarFolioSalida(tx, anio)` con tabla `consecutivos` y `UPDATE ... RETURNING` transaccional (serialización por año).
- `api/app/lib/blob.ts` — `subirAdjunto(file)`, `urlDescarga(id)`.
- `api/app/lib/http.ts` — errores tipados (`ApiError`, helper `json`).
- `api/app/routes/{auth,usuarios,departamentos,tiposDocumento,oficios,turnos,seguimiento,lecturas,salidas,auditoria,adjuntos,reportes}.ts` — endpoints por entidad.
- `api/app/schemas/*.ts` — DTOs zod (entrada) y tipos de salida.
- `api/__tests__/` — pruebas Vitest con `app.request()` y libSQL local (`:memory:`).

**Frontend (modificado/mínimo):**
- `vite.config.ts` — proxy `/api` en dev.
- `src/services/apiClient.ts` — fetch tipado con manejo de errores.
- `src/services/{authService,oficiosService,adminService,reportesService}.ts` — consumen la API.
- Integración de vistas vigente: se sustituye el consumo de `src/Data/*` por servicios, conservando componentes.

## Decisiones del plan

1. **Entorno:** backend TypeScript compila con el `tsconfig` del proyecto; el handler corre en runtime Node de Vercel. `vite` no empaqueta el backend.
2. **Sesión:** JWT firmado (`jose`, HS256) en cookie `httpOnly; SameSite=Lax`; payload `{sub, rol_id, departamento_id}`; `requireUser` recarga el usuario y rechaza si `activo=false`.
3. **Folios:** oficio `OFI-AAAA-NNNN` y salida `SAL-AAAA-NNNN` (formato salida fijo por spec; formato de oficio propuesto, ajustable antes de implementar). Consecutivos en tabla `consecutivos(nombre, anio, ultimo)` reservados con `UPDATE` transaccional, nunca en cliente.
4. **Fechas:** ISO-8601 UTC en `datetime`; `termino`/`fecha_documento` como `date`.
5. **Transacciones:** requieren múltiples statements: turno+estado+auditoría, seguimiento/respuesta+estado+auditoría, envío+folio+estado+auditoría via `db.transaction`.
6. **Autorización de acciones:** radicar cualquier usuario activo; turnar roles 2/3 (ajustable); seguimiento/lectura usuarios con el oficio en alcance; responder usuarios del departamento destino o roles 2/3; enviar roles 2/3; auditoría/admin solo 2/3.
7. **Adjuntos:** `POST /api/adjuntos` sube a Vercel Blob y crea fila de metadatos; la descarga pasa por `GET /api/adjuntos/:id` que verifica sesión y alcance antes de entregar la URL firmada.
8. **Vencido:** estado derivado recalculable por vista/reportes; ningún flujo escribe estado 6 salvo el job/reportes.
9. **Variables de entorno:** definidas en `.env.example`; nunca valores reales en el repositorio.

## Global Constraints

- Auth, alcance e integridad siempre en servidor; los guards del frontend no autorizan nada.
- Sin secretos, datos personales reales o credenciales en código, mocks, docs o logs.
- Textos de dominio en español; nombres técnicos en inglés estándar.
- Conservar React Router, `AuthContext`, guards y convenciones TypeScript existentes.
- Desactivación lógica sobre borrado físico para entidades referenciadas.
- `npm run lint`, `npm run build` y `npm run test` deben pasar al final de cada tarea que toque código frontend o backend.

## Review Focus

1. **Doble envío concurrente:** dos `POST /salidas` simultáneos del mismo oficio deben producir un solo folio `SAL-*` y un 409 claro en el segundo. → test en Task 10.
2. **Usuario desactivado con sesión activa:** request subsiguiente con cookie válida devuelve 401 y no expondrá datos. → test en Task 3.
3. **Fuga de alcance:** listado/detalle/adjuntos para rol 1 nunca devuelven oficios fuera de su departamento o participación. → tests en Tasks 6 y 12.
4. **Adjuntos huérfanos:** descarga de adjunto inexistente o sin sesión → 404/401 sin URL de Blob. → test en Task 12.
5. **Estado vencido:** un oficio vencido puede seguir respondiéndose y no pierde Respondido/Concluido; ninguna mutación escribe estado 6 en flujos normales. → test en Task 8/9.

## Estrategia de validación

- **Backend:** Vitest con `app.request()` (HTTP en memoria) y libSQL `:memory:`; cada suite corre migraciones/seed inline. Concurrencia simulada con `Promise.all`.
- **Frontend:** `npm run lint` + `npm run build` en cada tarea que lo toque; verificación manual con `npm run dev:api` + `npm run dev` (proxy `/api`).
- **Despliegue:** `vercel.json` con build Vite a `dist/` y `api/index.ts` como serverless; variables definidas pero sin valores dummy.

## Dependencias de interfaces

- Todas las rutas usan `auth.requireUser` (Task 3) y tipos de `db/schema.ts` (Task 2).
- `folio.ts` (Task 7) exige `db/transaction` del cliente (Task 2) y es consumido por radicación (Task 7) y salidas (Task 10).
- `alcance.ts` (Task 6) es requisito de listado, detalle, adjuntos, reportes y auditoría.
- `blob.ts` (Task 12) es consumido por adjuntos de oficio/seguimiento (Tasks 7/10).
