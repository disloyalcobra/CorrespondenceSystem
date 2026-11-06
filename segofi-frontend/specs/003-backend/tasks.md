# Tasks 003 — Backend monolítico SegOfi

> Ejecutar en orden. Cada tarea termina con pruebas en verde y commit. Leer `specs/003-backend/plan.md` (decisiones, interfaces) y `specs/003-backend/spec.md` (requisitos) antes de iniciar.

### Task 1: Scaffolding del backend y /api/health
**Files:** crear `api/index.ts`, `api/app/env.ts`, `api/app/lib/http.ts`, `api/__tests__/health.test.ts`, `vitest.config.ts`, `.env.example`, `vercel.json`; modificar `package.json` (scripts `dev:api`, `test`, deps Hono/@hono/vercel/@libsql/client/drizzle-orm/vitest + devDeps tsx/drizzle-kit/jose/bcryptjs/zod/@vercel/blob/vitest).
**Interfaces (produce):** `createApp(): Hono` en `api/index.ts` (toda suite de pruebas la usa); `ApiError` y middleware de errores en `lib/http.ts`.
- [x] Paso 1: test que monta `createApp()` y espera `GET /api/health` → 200 `{ok:true}`.
- [x] Paso 2: correr `npm run test -- health` y verificar fallo.
- [x] Paso 3: implementar app mínima, `vercel.json` (build Vite `dist/`, rewrite `/api/(.*)` a `api/index`) y `.env.example` con las variables del plan.
- [x] Paso 4: `npm run test` PASS.
- [x] Paso 5: commit `feat(api): scaffold hono serverless + health + config vercel`.

### Task 2: Esquema DB, cliente Drizzle, migraciones y seed
**Files:** crear `api/app/db/schema.ts`, `client.ts`, `migrate.ts`, `seed.ts`, `drizzle.config.ts`, `drizzle/`; test `api/__tests__/db.test.ts`.
**Interfaces (produce):** `drizzle(client)` en `client.ts`; tablas `usuarios, roles, departamentos, tipos_documento, estados, oficios, adjuntos, oficio_turnos, oficio_seguimiento, oficio_lecturas, oficios_salidas, auditoria, consecutivos`.
- [x] Paso 1: test que aplica migraciones en `:memory:`, corre `seedAuditoria` y verifica: unique folio duplicado en `oficios` falla, FK inexistente falla, catálogos contienen estados 1..7 con nombres exactos de `logica-sistema.md`.
- [x] Paso 2: verificar fallo.
- [x] Paso 3: implementar schema espejo del DBML (FKs, `unique` folios, `oficio_lecturas` con unicidad oficio/usuario/nombre acción `nombre`), migración drizzle-kit, seed de roles/estados/tipos y usuario admin con hash desde variables de entorno.
- [x] Paso 4: `npm run test -- db` PASS.
- [x] Paso 5: commit `feat(db): schema drizzle espejo del dbml + migraciones y seed`.

### Task 3: Autenticación (login/logout/me, cookie httpOnly, revalidación de activo)
**Files:** crear `api/app/lib/auth.ts`, `api/app/routes/auth.ts`, `api/app/schemas/auth.ts`, test `api/__tests__/auth.test.ts`; registrar rutas en `api/index.ts`.
**Interfaces (produce):** `hashPassword(pw): Promise<string>`, `verifyPassword(pw, hash): Promise<boolean>`, `crearSesionUsuario(c, usuario)` (firma cookie `sesion=httpOnly;SameSite=Lax` con JWT `{sub,rol_id,departamento_id}`), `requireUser(c): Promise<UsuarioSchema>` middleware + `requireRol(...ids)`; rutas `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- [x] Paso 1: tests: login válido con hash bcryptjs → 200 + cookie httpOnly; password incorrecta → 401; `activo=false` → 401; `GET /api/auth/me` con cookie de usuario desactivado tras login → 401; login a rutas protegidas sin cookie → 401 (usar un endpoint protegido de prueba).
- [x] Paso 2: verificar fallo.
- [x] Paso 3: implementar lib + rutas con DTOs zod; `me` y `requireUser` recargan el usuario desde DB y exigen `activo`.
- [x] Paso 4: `npm run test -- auth` PASS.
- [x] Paso 5: commit `feat(api): autenticación con JWT en cookie httpOnly y revalidación de estado activo`.

### Task 4: Catálogos y administración de departamentos/tipos de documento
**Files:** crear `api/app/routes/{departamentos,tiposDocumento}.ts`, `api/app/lib/auditoria.ts` (helper `registrar(db, {usuarioId,accion,entidad,entidadId,detalle})`), tests `api/__tests__/catalogos.test.ts`.
**Interfaces (produce):** helper `registrar(...)` (usado por todas las mutaciones siguientes); `GET /api/catalogos` (estados, tipos, departamentos visibles para autenticados); CRUD `departamentos`/`tipos-documento` con `requireRol(2,3)` y desactivación lógica (`activo`).
- [x] Paso 1: tests: `GET /api/catalogos` sin sesión → 401; con rol 1 → 200 lista; `POST /api/departamentos` con rol 1 → 403; con rol 2 → 201 y existe fila en `auditoria`; `DELETE` desactiva (fila sigue existiendo, `activo=false`).
- [x] Paso 2: verificar fallo.
- [x] Paso 3: implementar rutas + helper auditoría (escribe en transacción cuando la llamadora ya la abrió; acepta `db` normal).
- [x] Paso 4: `npm run test -- catalogos` PASS.
- [x] Paso 5: commit `feat(api): catálogos y administración de departamentos/tipos con auditoría y desactivación lógica`.

### Task 5: Alcance server-side y listado/detalle de oficios
**Files:** crear `api/app/lib/alcance.ts`, `api/app/lib/query.ts` (helpers paginación/filtros), `api/app/routes/oficios.ts` (solo GET list y GET :id), `api/app/schemas/oficio.ts` (DTO listado/detalle), test `api/__tests__/alcance.test.ts`.
**Interfaces (produce):** `tieneAccesoTotal(u): boolean` (roles 2/3), `condicionAlcanceSQL(u): SQL` (oficios con `departamento_destino_inicial_id = u.departamento_id` O participación en `oficio_seguimiento` u `oficio_turnos` del departamento), `listarOficios(u, filtros): Promise<Paginado<OficioResumen>>`, `obtenerOficio(u, id): Promise<OficioDetalle | null>` — el detalle incluye datos del oficio, línea de tiempo (turnos, seguimientos), lecturas, adjuntos y salida si existe.
- [x] Paso 1: seed de prueba con oficios en 2 departamentos; tests: rol 1 lista solo su depto y participaciones; rol 3 lista todo; filtro por `estado_id`/folio/asunto/rango de fechas funciona; paginación (`page`, `pageSize` con default 20) server-side; detalle fuera de alcance → 404 (no 403, para no revelar existencia).
- [x] Paso 2: verificar fallo.
- [x] Paso 3: implementar con WHERE en SQL (nunca filtrar en memoria).
- [x] Paso 4: `npm run test -- alcance` PASS.
- [x] Paso 5: commit `feat(api): listado y detalle de oficios con alcance, filtros y paginación en servidor`.

### Task 6: `lib/folio.ts`
**Files:** crear `api/app/lib/folio.ts`, test `api/__tests__/folio.test.ts`.
**Interfaces (produce):** `reservarFolioOficio(tx, anio): Promise<string>` → `OFI-YYYY-NNNN`; `reservarFolioSalida(tx, anio): Promise<string>` → `SAL-YYYY-NNNN`; ambos hacen `UPSERT` en `consecutivos(nombre, anio)` + `UPDATE ... RETURNING ultimo` dentro de la transacción dada.
- [ ] Paso 1: tests con 3 transacciones secuenciales → `OFI-2026-0001..0003`; 5 reservas `SAL` migradas secuencialmente → consecutivo `SAL` del año = 5, el callback fuerza el test a esperar cada transacción. Es la concurrencia real la que se pindea en Task 10 con transacciones `BEGIN IMMEDIATE` explícitas.
- [ ] Paso 2: verificar fallo.
- [ ] Paso 3: implementar según firma (formatos fijos en `plan.md` decisión 3).
- [ ] Paso 4: `npm run test -- folio` PASS.
- [ ] Paso 5: commit `feat(api): reservas transaccionales de folio OFI- y SAL- por año`.

### Task 7: Radicación de oficios (con adjuntos de metadatos y auditoría)
**Files:** modificar `api/app/routes/oficios.ts` (POST), crear `api/app/schemas/radicar.ts`, test `api/__tests__/radicar.test.ts`.
**Interfaces (consume:** `folio.ts`, `auditoria.ts`**):** `POST /api/oficios` crea oficio estado Pendiente (estado_id 1), `remitente_usuario_id = usuario actual`, `origen_usuario_id = usuario actual`, asigna `departamento_destino_inicial_id` en el body.
- [ ] Paso 1: tests: con datos válidos devuelve 201 con folio y estado Pendiente; falta `objeto`/`asunto` → 422 por validación zod; `departamento_destino` inexistente → 422; `fecha_documento` inválida → 422; radicar en secuencia reserva folios consecutivos; existe fila de `auditoria` con accion `radicar`.
- [ ] Paso 2: verificar fallo.
- [ ] Paso 3: implementar con `db.transaction` (folio + insert + auditoría).
- [ ] Paso 4: `npm run test -- radicar` PASS.
- [ ] Paso 5: commit `feat(api): radicar oficio transaccional con folio de entrada y auditoría`.

### Task 8: Turnado de oficios (transaccional)
**Files:** crear `api/app/routes/turnos.ts`, test `api/__tests__/turnos.test.ts`.
**Interfaces (consume:** `auditoria`**):** `POST /api/oficios/:id/turnos` con `requireRol(2,3)`; dentro de una transacción: inserta `oficio_turnos` (`turnado_por_usuario_id`, `turnado_en=now`), d Cambia `estado_id` a 2 (Turnado) solo si el estado actual lo permite (1 Pendiente; estados terminales → 409), registra auditoría `turnar`.
- [ ] Paso 1: tests: rol 2 turna oficio Pendiente → 201, estado=Turnado, fila turno con `recibido_en=null`; rol 1 → 403; turnar oficio Enviado → 409; turnar oficio inexistente o fuera de alcance de rol 1 → 404; auditoría presente.
- [ ] Paso 2: verificar fallo.
- [ ] Paso 3: implementar con `db.transaction`.
- [ ] Paso 4: `npm run test -- turnos` PASS.
- [ ] Paso 5: commit `feat(api): turnado transaccional con cambio de estado y auditoría`.

### Task 9: Seguimiento, respuestas y lecturas
**Files:** crear `api/app/routes/seguimiento.ts`, `lecturas.ts`, test `api/__tests__/seguimiento.test.ts`.
**Interfaces (consume:** `auditoria`**):** `POST /api/oficios/:id/seguimientos` con tipos zod `{tipo: 'NOTA' | 'AVANCE' | 'RESPUESTA', contenido, decidirConclusion?: boolean}`; NOTA/AVANCE si el estado es 2 o 3 → estado pasa a 3 (En proceso); RESPUESTA del usuario autorizado (departamento destino o roles 2/3) con `decidirConclusion` → estado 4 (Respondido) o 5 (Concluido); oficio Enviado → 409; `POST /api/oficios/:id/lecturas` inserta lectura o devuelve la existente (unicidad lógica); auditoría `responder`/`lectura`.
- [ ] Paso 1: tests: nota en oficio Turnado → estado 3; respuesta → estado 4 con `decidirConclusion=false` y 5 con true; segunda lectura del mismo usuario devuelve la misma fila (no duplica); nota en oficio Enviado → 409; rol 1 nota en oficio fuera de alcance → 404; auditoría registra actor y accion.
- [ ] Paso 2: verificar fallo.
- [ ] Paso 3: implementar transaccional seguimiento+estado+auditoría.
- [ ] Paso 4: `npm run test -- seguimiento` PASS.
- [ ] Paso 5: commit `feat(api): seguimientos, respuestas con decisión de conclusión y lecturas únicas`.

### Task 10: Salidas — envío atómico `SAL-AAAA-XXXX`
**Files:** crear `api/app/routes/salidas.ts`, test `api/__tests__/salidas.test.ts`.
**Interfaces (consume:** `folio.ts` (SAL), `auditoria`**):** `POST /api/oficios/:id/salida` con `requireRol(2,3)`; en transacción `BEGIN IMMEDIATE`: verifica que oficio existe, no tiene salida (`oficios_salidas.oficio_id` unique), cambia estado a 7 (Enviado), reserva folio SAL del año, inserta salida y auditoría.
- [ ] Paso 1: tests: envío válido → 201 `{folio:'SAL-2026-0001'}`, estado 7; segundo envío del mismo oficio → 409; envíos concurrentes (`Promise.all` de 3 sobre oficios distintos) → folios únicos consecutivos; doble envío concurrente del mismo oficio → exactamente una 201; intentar turnar/nota sobre oficio Enviado → 409 (solo lectura).
- [ ] Paso 2: verificar fallo.
- [ ] Paso 3: implementar con `db.transaction` en modo exclusivo; tras Enviado el oficio queda en solo lectura (turnos y seguimientos rechazados con 409).
- [ ] Paso 4: `npm run test -- salidas` PASS.
- [ ] Paso 5: commit `feat(api): envío transaccional con folio SAL único y oficio en solo lectura`.

### Task 11: Administración de usuarios (CRUD, desactivación, cambio de contraseña)
**Files:** crear `api/app/routes/usuarios.ts`, test `api/__tests__/usuarios.test.ts`; nueva migración en `drizzle/` solo si se requiere.
**Interfaces (consume:** `auth.ts`, `auditoria`**):** `GET/POST/PUT /api/usuarios` con `requireRol(2,3)`; `PUT /api/usuarios/:id/password` (auto-servicio, exige password actual); desactivación solo lógica (`activo=false`), `password` siempre hasheado con bcryptjs y nunca devuelto (DTO sin hash).
- [ ] Paso 1: tests: listado con DTOs sin `password_hash` en la respuesta; desactivar usuario con sesiones activas → siguiente request con su cookie → 401; cambiar contraseña exige la actual; rol 1 en listado → 403; auditoría `usuario_*`.
- [ ] Paso 2: verificar fallo.
- [ ] Paso 3: implementar las rutas con DTOs zod.
- [ ] Paso 4: `npm run test -- usuarios` PASS.
- [ ] Paso 5: commit `feat(api): administración de usuarios con hash bcryptjs, desactivación lógica y auditoría`.

### Task 12: Adjuntos en Vercel Blob con descarga controlada
**Files:** crear `api/app/lib/blob.ts`, `api/app/routes/adjuntos.ts`, test `api/__tests__/adjuntos.test.ts` (mock de blob con doble de estratégia inyectable).
**Interfaces (produce:** `subirAdjunto(c, archivo): Promise<{id, url}`; `obtenerUrlDescarga(u, id): Promise<string|401|404>`) ****consume:** `alcance`.
- [ ] Paso 1: tests: subir archivo a oficio en alcance → fila metadatos (nombre, url) y 201; `GET /api/adjuntos/:id/url` con sesión en alcance → 200 con URL; sin sesión → 401; sin alcance o inexistente → 404 (sin URL de Blob).
- [ ] Paso 2: verificar fallo.
- [ ] Paso 3: implementar con `@vercel/blob` (`put` en subida; URL firmada en descarga), inyectando el cliente blob para pruebas y despliegue real.
- [ ] Paso 4: `npm run test -- adjuntos` PASS.
- [ ] Paso 5: commit `feat(api): adjuntos con Vercel Blob, metadatos en DB y descarga con control de alcance`.

### Task 13: Auditoría, reportes, exportación y notificaciones
**Files:** crear `api/app/routes/{auditoria,reportes,notificaciones}.ts`, test `api/__tests__/auditoria-reportes.test.ts`.
**Interfaces (consume:** `alcance`**):** `GET /api/auditoria?entidad=&usuario_id=&page=` con `requireRol(2,3)` (orden cronológico desc); `GET /api/reportes/resumen` (contadores por estado 1..7 y vencidos calculados desde `termino < hoy` sin estado terminal, respetando alcance) y `GET /api/reportes/export?formato=csv` en stream; `GET /api/notificaciones` devuelve derivados de turnos/lecturas del alcance del usuario.
- [ ] Paso 1: tests: auditoría con filtros, rol 1 → 403; reporte cuenta vencidos sin pisar estados terminales; export CSV respeta alcance; notificaciones de rol 1 excluyen oficios de otro departamento.
- [ ] Paso 2: verificar fallo.
- [ ] Paso 3: implementar.
- [ ] Paso 4: `npm run test -- auditoria` PASS.
- [ ] Paso 5: commit `feat(api): bitácora, reportes/exportación y notificaciones con alcance en servidor`.

### Task 14: Frontend — `apiClient` + authService integrado a `AuthContext`
**Files:** crear `src/services/apiClient.ts`, `src/services/authService.ts`; modificar `src/Guards/AuthContext.tsx` (login/logout reales, `cargando` inicial), `src/Guards/testUsers.ts` se retira del flujo de login (sin borrar archivo); `vite.config.ts` proxy `/api` en dev).
**Interfaces (consume:** endpoints de Task 3/11**):** `apiClient.get/post/put/del` tipados con `ApiError` (mensaje del backend); `authService.login(email, pw): Promise<UsuarioSesion>`, `logout()`, `me()`; `UsuarioSesion` sin `password_hash`.
- [ ] Paso 1: implementar servicios + AuthContext con `me()` al montar (sustituye sesión de demostración).
- [ ] Paso 2: `npm run lint` y `npm run build` PASS (sin errores de TS).
- [ ] Paso 3: verificación manual dev: `npm run dev:api` + `npm run dev` → login con usuario seed → redirige a inicio; logout limpia cookie.
- [ ] Paso 4: commit `feat(front): servicios tipados + AuthContext conectado a la API real`.

### Task 15: Frontend — servicios de oficios y flujos (radicar/turnar/seguir/responder/enviar)
**Files:** crear `src/services/oficiosService.ts`; modificar vistas de `src/User/` (Documentos, seguimiento, salidas) para consumir servicios y dejar de depender de `src/Data/oficiosStore.ts` para datos reales (se mantiene el store como fallback solo si la API no responde, `feature flag` en `src/services/index.ts`).
**Interfaces (consume:** Tasks 5-10, 12; DTOs de `api/app/schemas/**` tipados compartidos vía `src/services/types.ts` o import de tipos backend `).
- [ ] Paso 1: implementar mapeo DTO↔`Oficio`/datos de vista (nombres según convención actual en `src/Data/oficio.ts`); radicar/turnar/nota/respuesta/salida/lecturas/adjuntos.
- [ ] Paso 2: `npm run lint` + `npm run build` PASS.
- [ ] Paso 3: verificación manual dev del flujo completo con 2 usuarios (rol 1 y rol 3) respetando visibilidad.
- [ ] Paso 4: commit `feat(front): flujos de oficios conectados a la API (radicar→turnar→seguir→responder→enviar)`.

### Task 16: Cierre — catálogos/admin front, seed en despliegue y verificación integral
**Files:** modificar vistas admin (`src/User/` departamentos/usuarios según existentes) para consumir `adminService.ts`; crear `src/services/adminService.ts`; actualizar `.env.example`; verificar `api/README.md` con instrucciones de despliegue Vercel + Turso (`turso db create`, URLs de env) sin credenciales reales.
**Interfaces (consume:** Tasks 4, 11, 13**).**
- [ ] Paso 1: conectar administración de usuarios/departamentos con la API.
- [ ] Paso 2: `npm run lint`, `npm run build`, `npm run test` en verde.
- [ ] Paso 3: guía de despliegue en `api/README.md` (Turso, variables, `drizzle-kit push/migrate`, seed admin).
- [ ] Paso 4: commit `chore(segofi): administración conectada a API y guía de despliegue Vercel+Turso`.

## Notas de ejecución
- Correr migraciones antes de cada suite: `runMigrationsEnMemoria()` helper de Task 2 reutilizado por todos los tests.
- Nunca trasladas contraseñas ni tokens a `localStorage`; la sesión viaja solo por cookie.
- Si un test de concurrencia es inestable en Windows/libSQL local, replicarlo con transacciones `BEGIN IMMEDIATE` explícitas antes de debilitarlo.
- Formato de folio `OFI-AAAA-NNNN` es propuesta; confirmar antes de Task 6 si el catálogo institucional usa otro.
