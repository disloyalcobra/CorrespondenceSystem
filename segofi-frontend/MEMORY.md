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

