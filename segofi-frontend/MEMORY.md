# MEMORY.md — Historial de cambios de SegOfi

Este archivo registra cada cambio significativo realizado al proyecto, con fecha, archivos afectados y descripción breve. Los agentes deben actualizarlo al finalizar cada tarea.

---

## 2026-11-05 — Task 9: Seguimiento, respuestas y lecturas

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `api/app/schemas/seguimiento.ts` | Zod schemas: `seguimientoCreateSchema` (tipo + contenido) y `lecturaCreateSchema` |
| `api/app/routes/seguimientos.ts` | Router con endpoints: `GET /`, `POST /` (seguimiento), `POST /lecturas` |
| `api/app/types.ts` | Tipo `AppEnv` con `db: Database` y `user?: UsuarioSchema` para tipado genérico de Hono |
| `api/__tests__/seguimientos.test.ts` | Tests de integración para seguimientos y lecturas (3 casos) |
| `api/__tests__/utils.ts` | Helpers de prueba: `createTestUser`, `createTestOficio` (generan JWT con `jose` directamente) |
| `api/__tests__/setup.ts` | Helper `initTestDb` que crea tablas y ejecuta seed para tests |
| `api/app/db/migrate.ts` | Función `migrar(db)` con DDL completo del esquema (ya existía; se descubrió que la usaban todos los otros tests) |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `api/app/routes/oficios.ts` | Importa y monta `seguimientosRouter` en `/:id/seguimientos` vía `oficiosRouter.route(...)` |
| `api/app/routes/auth.ts` | Aplica genérico `Hono<AppEnv>` y `Context<AppEnv>` |
| `api/app/routes/catalogos.ts` | Aplica genérico `Hono<AppEnv>` |
| `api/app/routes/departamentos.ts` | Aplica genérico `Hono<AppEnv>` |
| `api/app/routes/tiposDocumento.ts` | Aplica genérico `Hono<AppEnv>` |
| `api/app/routes/turnos.ts` | Aplica genérico `Hono<AppEnv>` |
| `api/app/lib/auth.ts` | Actualizado para usar `Context<AppEnv>`; funciones `requireUser` y `requireRol` correctamente tipadas |
| `api/index.ts` | `createApp` retorna `Hono<AppEnv>`; monta rutas de seguimientos |

### Resultado
- **Build:** ✅ sin errores TypeScript
- **Tests:** ✅ 39 tests pasando (9 suites)
  - `folio.test.ts` — 3 ✅
  - `health.test.ts` — 1 ✅
  - `db.test.ts` — 5 ✅
  - `auth.test.ts` — 6 ✅
  - `seguimientos.test.ts` — 3 ✅ (nuevo)
  - `radicar.test.ts` — 5 ✅
  - `turnos.test.ts` — 4 ✅
  - `catalogos.test.ts` — 6 ✅
  - `alcance.test.ts` — 6 ✅

### Notas técnicas
- El error `no such table: roles` en tests se resolvió usando el patrón existente: `createClient({ url: ":memory:" })` → `migrar(db)` → `seed(db)`.
- El error `c.header is not a function` al mockear el contexto de Hono se resolvió generando el JWT directamente con `jose` en los helpers de test, sin usar `crearSesionUsuario`.
- Los tests envían la sesión via **cookie** (no `Authorization` header), igual que el resto de la suite.
- `activo: 1` en inserts Drizzle debe ser `activo: true` (el schema usa `mode: "boolean"`).
- `import from "crypto"` debe ser `import from "node:crypto"` para evitar error TS2307.

---

## 2026-11-07 — Task 11: Administración de usuarios (CRUD, desactivación, cambio de contraseña)

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `api/app/schemas/usuario.ts` | Schemas Zod: `crearUsuarioSchema`, `actualizarUsuarioSchema` y `cambiarPasswordSchema` |
| `api/app/routes/usuarios.ts` | Router con endpoints `GET /`, `POST /`, `PUT /:id` y `PUT /:id/password` con auditoría |
| `api/__tests__/usuarios.test.ts` | Suite con 5 tests verificando DTOs seguros, RBAC (403), desactivación lógica (401 subsiguiente), cambio de contraseña y auditoría |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `api/index.ts` | Monta `usuariosRouter` en `/usuarios` |
| `specs/003-backend/tasks.md` | Marcadas Tasks 9, 10 y 11 como completadas |

### Resultado
- **Build:** ✅ `npm run build` sin errores TypeScript ni de bundling
- **Tests:** ✅ 56 tests pasando (11 suites)
  - `folio.test.ts` — 3 ✅
  - `health.test.ts` — 1 ✅
  - `db.test.ts` — 5 ✅
  - `auth.test.ts` — 6 ✅
  - `seguimientos.test.ts` — 8 ✅
  - `radicar.test.ts` — 5 ✅
  - `turnos.test.ts` — 4 ✅
  - `catalogos.test.ts` — 6 ✅
  - `alcance.test.ts` — 6 ✅
  - `salidas.test.ts` — 7 ✅
  - `usuarios.test.ts` — 5 ✅ (nuevo)

### Notas técnicas
- En Drizzle `values()` para campos opcionales en SQLite, el tipado no tolera `undefined`; se normalizó `departamento_id ?? null as number | null`.
- Se validó que las respuestas DTO nunca expongan `passwordHash` ni contraseñas en claro.
- La desactivación de usuario valida que las sesiones preexistentes sean invalidadas automáticamente en `requireUser` retornando HTTP 401.

---

## 2026-11-07 — Task 12: Adjuntos en Vercel Blob con descarga controlada

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `api/app/lib/blob.ts` | Abstracción de Vercel Blob con `StorageUploader` y `MockBlobUploader` para tests |
| `api/app/routes/adjuntos.ts` | Endpoints `POST /oficios/:id/adjuntos` y `GET /adjuntos/:id/url` con validación de alcance |
| `api/__tests__/adjuntos.test.ts` | Suite con 4 tests para subida, descarga controlada, error 401 sin sesión y 404 fuera de alcance |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `api/index.ts` | Monta `oficiosAdjuntosRouter` en `/oficios` y `adjuntosRouter` en `/adjuntos` |
| `specs/003-backend/tasks.md` | Marcada Task 12 como completada |

### Resultado
- **Build:** ✅ `npm run build` sin errores TypeScript ni de bundling
- **Tests:** ✅ 60 tests pasando (12 suites)
  - `folio.test.ts` — 3 ✅
  - `health.test.ts` — 1 ✅
  - `db.test.ts` — 5 ✅
  - `auth.test.ts` — 6 ✅
  - `seguimientos.test.ts` — 8 ✅
  - `radicar.test.ts` — 5 ✅
  - `turnos.test.ts` — 4 ✅
  - `catalogos.test.ts` — 6 ✅
  - `alcance.test.ts` — 6 ✅
  - `salidas.test.ts` — 7 ✅
  - `usuarios.test.ts` — 5 ✅
  - `adjuntos.test.ts` — 4 ✅ (nuevo)

### Notas técnicas
- Se utilizó la interfaz `StorageUploader` para desacoplar el almacenamiento de Vercel Blob en pruebas locales y tests con SQLite en memoria.
- Se implementó control de alcance en la descarga (`GET /api/adjuntos/:id/url`) ocultando la existencia del adjunto (`404`) si el usuario no tiene acceso al oficio padre.

---

## Plantilla para próximas entradas

```
## YYYY-MM-DD — Task N: Nombre de la tarea

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |

#### Archivos modificados
| Archivo | Cambio |

### Resultado
- Build: ✅/❌
- Tests: ✅/❌ N tests pasando

### Notas técnicas
- ...
```

