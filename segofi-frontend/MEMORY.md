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

## 2026-11-09 — Task 13: Auditoría, reportes, exportación y notificaciones

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `api/app/routes/auditoria.ts` | Endpoint `GET /api/auditoria` con protección `requireRol(2, 3)`, paginación y filtros por entidad y usuario |
| `api/app/routes/reportes.ts` | Endpoints `GET /api/reportes/resumen` (contadores de estado y vencidos excluyendo estados terminales) y `GET /api/reportes/export?formato=csv` |
| `api/app/routes/notificaciones.ts` | Endpoint `GET /api/notificaciones` derivando oficios no leídos por el usuario dentro de su alcance |
| `api/__tests__/auditoria-reportes.test.ts` | Suite con 4 tests para RBAC en auditoría (403), cálculo de vencidos, export CSV y aislamiento por departamento |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `api/index.ts` | Monta routers en `/auditoria`, `/reportes` y `/notificaciones` |
| `specs/003-backend/tasks.md` | Marcada Task 13 como completada |

### Resultado
- **Build:** ✅ `npm run build` sin errores TypeScript ni de bundling
- **Tests:** ✅ 64 tests pasando (13 suites)
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
  - `adjuntos.test.ts` — 4 ✅
  - `auditoria-reportes.test.ts` — 4 ✅ (nuevo)

### Notas técnicas
- En `auditoria.ts` se utilizó el middleware `requireRol(2, 3)` para rechazar solicitudes de usuarios operativos con `403`.
- En `reportes.ts` se excluyen estados terminales (5: Concluido, 6: Cancelado, 7: Enviado) al computar la métrica de oficios vencidos.
- En `notificaciones.ts` se evalúa mediante `notExists` sobre `oficio_lecturas` correlacionado al usuario actual.

---

## 2026-11-09 — Task 14: Frontend — apiClient + authService integrado a AuthContext

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `src/services/apiClient.ts` | Cliente HTTP centralizado (`fetch`) con `credentials: "include"`, manejo de query params, tipado de respuestas, soporte Blob/CSV y clase `ApiError` compatible con `erasableSyntaxOnly` |
| `src/services/authService.ts` | Servicio de autenticación con `login`, `logout` y `me()` utilizando el DTO seguro `UsuarioSesion` sin contraseñas |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `vite.config.ts` | Configurado proxy para desarrollo reenviando `/api` a `http://localhost:3000` |
| `src/Guards/authTypes.ts` | Actualizado tipo `Usuario` a `UsuarioSesion` y agregada bandera `cargando: boolean` |
| `src/Guards/AuthContext.tsx` | Verificación de sesión al montar vía `authService.me()` y `login`/`logout` conectados a la API real |
| `src/Guards/RoleGuard.tsx` | Muestra spinner de carga mientras `cargando === true` para evitar redirecciones prematuras a `/login` |
| `src/Login/Login.tsx` | Formulario conectado al `login()` asíncrono real con manejo de `ApiError` |
| `specs/003-backend/tasks.md` | Marcada Task 14 como completada |

### Resultado
- **Lint:** ✅ `npm run lint` pasa con 0 errores y 0 advertencias
- **Build:** ✅ `npm run build` (`tsc -b && vite build`) exitoso
- **Tests:** ✅ 64 tests pasando (13 suites)

---

## 2026-11-10 — Task 15: Frontend — servicios de oficios y flujos (radicar/turnar/seguir/responder/enviar)

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `src/services/oficiosService.ts` | Servicio central de oficios: `listar`, `obtenerPorId`, `radicar`, `turnar`, `agregarSeguimiento`, `marcarLeido`, `registrarSalida` y `subirAdjunto` con mapeo DTO (camelCase ↔ snake_case) y fallback resiliente |
| `src/services/index.ts` | Reexportación de todos los servicios (`apiClient`, `authService`, `oficiosService`) |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `src/User/VerOficios/VerOficios.tsx` | Conectado a `oficiosService.listar()` con spinner de carga `Loader2` y filtros interactivos |
| `src/User/VerOficios/DetalleOficio.tsx` | Conectado a la API para turnar, registrar notas/respuestas, salida con folio SAL y registro automático de lectura |
| `src/User/Documents/Documents.tsx` | Formulario de radicación conectado a `oficiosService.radicar()` con subida atómica de archivos |
| `specs/003-backend/tasks.md` | Marcada Task 15 como completada |

### Resultado
- **Lint:** ✅ `npm run lint` 0 errores, 0 advertencias
- **Build:** ✅ `npm run build` (`tsc -b && vite build`) exitoso
- **Tests:** ✅ 64 tests pasando (13 suites)

---

## 2026-11-10 — Task 16: Cierre — catálogos/admin front, seed en despliegue y verificación integral

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `src/services/adminService.ts` | Servicio para CRUD de Departamentos (`/api/departamentos`), Usuarios (`/api/usuarios`) y consulta de Bitácora (`/api/auditoria`) |
| `api/README.md` | Guía de despliegue a producción con Vercel Serverless Functions + Turso (libSQL), variables de entorno, migraciones y seed |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `src/services/index.ts` | Exportación unificada incluyendo `adminService` |
| `src/User/Departamentos/Departamentos.tsx` | Conectado a `adminService.departamentos` con feedback visual, modal y confirmación |
| `src/User/Cuentas/Cuentas.tsx` | Conectado a `adminService.usuarios` para altas, edición y desactivación de usuarios |
| `specs/003-backend/tasks.md` | Marcada Task 16 como completada (Cierre de la Spec 003) |

### Resultado
- **Lint:** ✅ `npm run lint` 0 errores, 0 advertencias
- **Build:** ✅ `npm run build` (`tsc -b && vite build`) exitoso
- **Tests:** ✅ 64 tests pasando (13 suites)

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


---

## 2026-11-10 — Task 17: Corrección de los 3 errores reportados (usuarios, oficios y departamentos)

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `api/__tests__/env.test.ts` | Tests de regresión de la carga de `.env` (parseo, precedencia de variables y uso en `getEnv()`) |
| `api/__tests__/blob-local.test.ts` | Tests de los adjuntos con almacenamiento en disco (subida, descarga y control de alcance) |
| `docs/plan-fix-errores-2026-11-10.md` | Diagnóstico con evidencia y plan de la corrección |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `api/app/env.ts` | Carga explícita del `.env` (tsx y vitest no lo leen solos), con precedencia de las variables reales del entorno y aviso cuando cae en `file:local.db` |
| `api/app/lib/blob.ts` | `LocalFileUploader` (disco) cuando no hay token de Blob, selección automática de uploader y helpers de URL local |
| `api/app/routes/adjuntos.ts` | Adjuntos: error 503 claro si el almacenamiento falla, `GET /api/adjuntos/:id/archivo` (stream local / redirect remoto) y `/url` canónica |
| `api/app/routes/departamentos.ts` | Alta, edición y baja de departamentos dentro de una transacción (antes dejaban filas huérfanas si fallaba la auditoría) |
| `api/app/routes/usuarios.ts` | Corregidos los detalles de auditoría que se guardaban como texto literal (`'${creado.email}'`) |
| `api/__tests__/setup.ts` | Los tests usan una base en memoria propia; ya no escriben ni en la base local ni en Turso |
| `api/__tests__/catalogos.test.ts` | Test del contrato de `departamentos.tipo` (solo `INTERNO` / `EXTERNO`) |
| `vitest.config.ts` | Aísla la base de datos de los tests (`:memory:`) y desactiva el token de Blob durante las pruebas |
| `src/User/Departamentos/Departamentos.tsx` | El tipo de departamento pasa a ser un `Select` con `INTERNO`/`EXTERNO` (el backend solo admite esos valores) |
| `src/User/Documents/Documents.tsx` | Si el adjunto falla, el oficio ya radicado no se pierde: se avisa con un mensaje específico |
| `src/User/VerOficios/DetalleOficio.tsx` | Ver/descargar adjuntos por `/api/adjuntos/{id}/archivo` (respeta el control de alcance) |
| `src/services/apiClient.ts` | Corregido `'Error HTTP ${response.status}'`, que se mostraba literal al usuario |
| `.gitignore` | Ignora `uploads/` (adjuntos guardados en disco) |
| `api/README.md` | Documenta el desarrollo local: carga de `.env`, aviso de base local y adjuntos en disco |

### Resultado
- **Lint:** ✅ 0 errores, 0 advertencias
- **Build:** ✅ `npm run build` (tsc -b + vite build) sin errores
- **Tests:** ✅ 74 tests pasando (15 suites)
  - `env.test.ts` — 4 (nuevo)
  - `blob-local.test.ts` — 5 (nuevo)
  - resto de suites — 65

### Notas técnicas
- **Causa raíz 1 (los datos no llegaban a la base de datos):** ni `tsx watch` ni `vitest` cargan el archivo `.env`; `api/app/env.ts` caía en silencio al valor por defecto `file:local.db`, de modo que usuarios, oficios, departamentos y bitácora se escribían en un SQLite local mientras la base configurada (Turso) quedaba vacía. Ahora `getEnv()` carga el `.env` de forma explícita (sin sobrescribir variables reales) y avisa por consola cuando se usa la base local.
- **Causa raíz 2 ("error interno" al crear un oficio):** la carga del archivo adjunto usaba siempre Vercel Blob; sin `BLOB_READ_WRITE_TOKEN`, `put()` lanzaba "No blob credentials found" y `handleApiError` lo degradaba a un 500 genérico (el oficio sí se creaba, pero la UI mostraba el error y no navegaba al detalle). Sin token, los adjuntos se guardan en `uploads/adjuntos/` y se sirven por la API.
- **Causa raíz 3 (no se podía crear un departamento):** la UI enviaba texto libre en `tipo` ("Dirección") y el backend solo admite el catálogo `INTERNO` / `EXTERNO` (esquema, seed y `schemas/catalogos.ts`), por lo que respondía 400 "Datos de departamento inválidos".
- **Causa raíz 4 (aparecida al verificar contra la base configurada):** la tabla `auditoria` de Turso tenía la columna `entidadId` en lugar de `entidad_id`, así que toda escritura de bitácora fallaba con 500 ("table auditoria has no column named entidad_id"). Se corrigió con `ALTER TABLE auditoria RENAME COLUMN` y se documentó la verificación de esquema en `api/README.md`.
- El usuario `admin@sectur.gob.mx` de Turso tenía un hash de contraseña que no era un bcrypt válido (era imposible iniciar sesión); se regeneró con el `SEED_ADMIN_PASSWORD` declarado en `.env`.
- La carpeta `api/` no está cubierta por `npm run build` (los `tsconfig` solo incluyen `src` y `vite.config.ts`); el tipado de la API se verificó aparte con `tsc --module esnext --moduleResolution bundler`.
---

## 2026-11-10 — Task 18: Pantallas con datos de demostración, detalle del oficio y baja de departamentos

### Cambios realizados

#### Nuevos archivos
| Archivo | Descripción |
|---------|-------------|
| `src/Data/estados.ts` | Catálogo canónico de estados del oficio (el del backend) y utilidades `ESTADOS`, `ESTADOS_INVERSOS`, `ESTADOS_TERMINALES`, `etiquetaEstado` |
| `src/services/useOficios.ts` | Hook que carga los oficios del usuario desde la API (sin respaldo de demostración) |
| `src/services/useCatalogos.ts` | Hook que carga estados, tipos de documento, departamentos y roles desde `/api/catalogos` |
| `api/__tests__/seguimiento-personas.test.ts` | Tests de `GET /api/seguimientos/personas` (401, agrupación por persona y alcance) |

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `api/app/lib/query.ts` | La línea de tiempo del detalle incluye `usuarioNombre` |
| `api/app/routes/seguimientos.ts` | Nuevo router con `GET /api/seguimientos/personas`: acciones (notas, respuestas, turnos) agrupadas por persona sobre los oficios del alcance |
| `api/index.ts` | Montaje del router de resumen en `/seguimientos` |
| `src/services/oficiosService.ts` | DTO y mapper del detalle (`lineaTimeline` → `seguimiento`, `usuarioNombre`), método `seguimientoPorPersonas()` y se elimina el respaldo silencioso con `OFICIOS_DEMO` |
| `src/components/StatusBadge.tsx` | Etiquetas alineadas con el catálogo del backend (Pendiente, Turnado, En proceso, Respondido, Concluido, Vencido, Enviado) |
| `src/User/VerOficios/DetalleOficio.tsx` | Carga el **detalle** del oficio (`obtenerPorId`) para mostrar adjuntos, notas y línea de tiempo; recarga tras turnar/nota/respuesta/envío; muestra el nombre del usuario en la línea de tiempo; usa los departamentos del servidor |
| `src/User/VerOficios/VerOficios.tsx` | Mapa y filtros de estados corregidos según el catálogo del backend |
| `src/User/Departamentos/Departamentos.tsx` | Refleja la desactivación lógica: los dados de baja no se listan, se avisa cuántos hay y el aviso de baja explica que el registro se conserva |
| `src/User/Reportes/Reportes.tsx` | Datos desde la API (antes `OFICIOS_DEMO`), departamentos del servidor, estados de carga y error |
| `src/User/Enviados/Enviados.tsx` | Datos desde la API y filtro por estado real `Enviado` (7) en vez de 6 (`Vencido`) |
| `src/User/SeguimientoPersonas/SeguimientoPersonas.tsx` | Consume `GET /api/seguimientos/personas`: personas reales con sus acciones sobre los oficios reales |
| `src/User/Dashboard/Dashboard.tsx` | Conteos de oficios, departamentos y cuentas activas desde la API |
| `src/Data/departamentos.ts` | El tipo `Departamento` incluye `activo` |

### Resultado
- **Lint:** ✅ 0 errores, 0 advertencias
- **Build:** ✅ `npm run build` sin errores
- **Tests:** ✅ 77 tests pasando (16 suites)
  - `seguimiento-personas.test.ts` — 3 (nuevo)

### Notas técnicas
- **Causa raíz 5 (usuarios/folios de demostración):** `SeguimientoPersonas`, `Reportes` y `Enviados` leían `useOficios()` de `src/Data/oficiosStore.ts`, que devuelve `OFICIOS_DEMO`. Se conectaron al servicio de la API y `oficiosService.listar` ya no cae en silencio a los datos de demostración: si el servidor falla, la pantalla lo muestra.
- **Causa raíz 6 (adjuntos, notas y línea de tiempo vacíos):** `DetalleOficio` cargaba el oficio con `listar()` (endpoint de lista, que solo devuelve las columnas de `oficios`) en lugar de `obtenerPorId()` (endpoint de detalle, que devuelve `adjuntos`, `lineaTiempo`, `lecturas` y `salida`). La página ahora usa el detalle y recarga el detalle tras cada acción.
- **Causa raíz 7 (departamentos que "no se borran"):** `DELETE /api/departamentos/:id` sí funcionaba (desactivación lógica, `activo=false`), pero la UI pintaba también los inactivos y sin el campo `activo`, así que la fila seguía ahí. Ahora los dados de baja no se listan y se informa cuántos hay.
- **Causa raíz 8 (mapa de estados):** el frontend usaba 1 Recibido, 2 En seguimiento, 3 Turnado, 4 Respondido, 5 Cerrado, 6 Enviado, mientras el backend y `docs/logica-sistema.md` usan Pendiente(1), Turnado(2), En proceso(3), Respondido(4), Concluido(5), Vencido(6), Enviado(7). Por eso "Enviados" filtraba `estado_id === 6` (Vencido). Se unificó el catálogo en `src/Data/estados.ts`.
- El servidor de desarrollo (`npm run dev:api`) se había detenido durante la sesión; se reinició y quedó escuchando en el puerto 3000 con la base de datos configurada.
---

## 2026-11-11 — Extensiones `.js` en imports del API para Vercel

### Cambios realizados

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `api/**/*.ts` (44 archivos: `index.ts`, `app/routes/*`, `app/lib/*`, `app/db/*`, `app/schemas/*`, `scripts/*`, `__tests__/*`) | Todos los imports relativos llevan extensión `.js` explícita |
| `server.ts` | Import de `./api/index.js` con extensión |

### Resultado
- **Typecheck API con `--module nodenext`:** ✅ 0 errores TS2835
- **Build:** ✅ `npm run build` sin errores
- **Tests:** ✅ 77 tests pasando (16 suites)

### Notas técnicas
- Vercel compila las funciones de `api/` como ESM (`"type": "module"`) con resolución `node16/nodenext`, que exige extensión en imports relativos (TS2835). Además de los errores de tipos, sin extensión Node falla en runtime con `ERR_MODULE_NOT_FOUND`.
- Se usa `.js` (no `.ts`): TypeScript lo resuelve al `.ts` fuente y funciona igual con `tsx`, Vitest y la resolución `bundler` local.

---

## 2026-11-11 — Una sola Serverless Function para el plan Hobby de Vercel

### Cambios realizados

#### Archivos movidos / modificados
| Archivo | Cambio |
|---------|--------|
| `api/app/` → `api/_app/` | Renombrado: el prefijo `_` evita que Vercel convierta cada archivo en una función |
| `api/scripts/` → `api/_scripts/` | Mismo motivo |
| `api/index.ts`, `api/__tests__/*`, `api/_scripts/seed.ts` | Imports apuntan a `_app/` |
| `package.json` | `db:seed` usa `api/_scripts/seed.ts` |
| `drizzle.config.ts` | Esquema en `./api/_app/db/schema.ts` |
| `api/README.md`, `src/Data/estados.ts`, `api/_app/env.ts`, `api/_app/lib/blob.ts` | Rutas en comentarios/documentación |

### Resultado
- **Lint:** ✅ sin errores
- **Build:** ✅ `npm run build` sin errores
- **Tests:** ✅ 77 tests pasando (16 suites)

### Notas técnicas
- Vercel crea una Serverless Function por cada `.ts` dentro de `api/` (34 archivos), y el plan Hobby permite máximo 12 por deployment. Los archivos/carpetas con prefijo `_` se excluyen, así que ahora solo `api/index.ts` es función; todas las rutas siguen llegando ahí por el rewrite `/api/(.*)` de `vercel.json`.
- Los specs/planes históricos en `specs/` y `docs/` conservan la ruta antigua `api/app/` como registro.

---

## 2026-11-11 — Pantalla en blanco en Vercel (base de Vite)

### Cambios realizados

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `vite.config.ts` | `base` es `/` cuando se compila en Vercel (`process.env.VERCEL`) y `/CorrespondenceSystem/` en otro caso (GitHub Pages) |

### Resultado
- **Lint:** ✅ sin errores
- **Build:** ✅ con `VERCEL=1` los assets se sirven desde `/assets/...`; sin ella, desde `/CorrespondenceSystem/assets/...`
- **Tests:** sin cambios en el API (77 pasando en la tarea anterior)

### Notas técnicas
- Con `base: '/CorrespondenceSystem/'` fijo, en Vercel el HTML pedía `/CorrespondenceSystem/assets/*.js`. Esa ruta no existe, el rewrite `/(.*)` devolvía `index.html` en lugar del JS y la app quedaba en blanco. `BrowserRouter` y los logos usan `import.meta.env.BASE_URL`, así que se ajustan solos.

---

## 2026-11-11 — 504 en el API desplegado en Vercel

### Cambios realizados

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `api/index.ts` | Se elimina `export default handle(app)`; se dejan solo los exports por método (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) y se agregan `OPTIONS` y `HEAD` |

### Resultado
- **Lint:** ✅ sin errores
- **Typecheck API (`nodenext`):** ✅ sin errores
- **Tests:** ✅ 77 tests pasando (16 suites)
- Prueba manual: `GET(new Request(".../api/health"))` → 200 `{"ok":true}`

### Notas técnicas
- `handle` de `@hono/vercel` es un handler web `(req: Request) => Response`. El runtime Node de Vercel trata un export `default` como handler clásico `(req, res)`: le pasaba un `IncomingMessage`, nunca se llamaba a `res.end()` y toda petición terminaba en 504 por timeout. Con solo los exports por método, Vercel usa la firma web `Request`/`Response`.
