# Especificación 003 — Backend monolítico para SegOfi (Vercel + Turso)

## Objetivo
Proveer a SegOfi un backend real que sustituya los datos de demostración de `src/Data/` por persistencia institucional: una API monolítica desplegada junto al frontend en Vercel, con base de datos Turso (libSQL) y almacenamiento de archivos en Vercel Blob. La API debe aplicar en servidor la autenticación, autorización por rol/departamento/alcance, integridad transaccional y auditoría descritas en `docs/logica-sistema.md` y `docs/modelo-datos.dbml`.

## Actores
- **Usuario operativo** (rol 1, con departamento): radica, consulta y atiende oficios dentro de su alcance.
- **Administrador / Directora** (roles 2 y 3, alcance total): acceso a todos los oficios, administración de usuarios, departamentos y catálogos, envío de salidas.
- **Sistema (API):** valida credenciales, aplica permisos, genera folios, mantiene transacciones y registra auditoría.

## Decisiones técnicas acordadas
- Arquitectura monolítica de despliegue único: frontend Vite servido estático por Vercel + API backend en funciones serverless de Vercel con Hono; un solo repositorio.
- Base de datos: Turso (libSQL) con Drizzle ORM y migraciones versionadas.
- Adjuntos: Vercel Blob; la base de datos solo guarda metadatos y referencia protegida.
- Alcance: modelo completo (auth, oficios, turnos, seguimiento, lecturas, salidas, catálogos, auditoría, administración).

## Requisitos funcionales

### Autenticación y usuarios
- **RF-1:** Iniciar sesión con email y contraseña; la API valida hash (nunca texto plano) y emite una sesión segura (cookie httpOnly) con rol y departamento.
- **RF-2:** Cerrar sesión invalidando la sesión del cliente.
- **RF-3:** Administración de usuarios (alta, edición, desactivación lógica) solo para roles 2/3; desactivar no borra historial ni rompe referencias.
- **RF-4:** Cambio de contraseña con verificación de la actual.

### Oficios y flujo
- **RF-5:** Radicar oficio: validar datos requeridos, generar folio institucional único, crear el oficio en estado Pendiente, asociar adjuntos y registrar auditoría.
- **RF-6:** Turnar: crear el turno (departamento, actor, fecha) y actualizar el estado a Turnado en una sola transacción, con auditoría.
- **RF-7:** Registrar seguimiento (nota/avance) atribuido al usuario autenticado; un oficio Turnado puede pasar a En proceso, con auditoría.
- **RF-8:** Responder: guardar respuesta formal con adjuntos y actualizar a Respondido o Concluido según decisión autorizada, con auditoría.
- **RF-9:** Enviar salida: validar que el oficio exista y no tenga salida previa; reservar folio `SAL-AAAA-XXXX` secuencial por año mediante consecutivo bloqueado, guardar salida, cambiar estado a Enviado y auditar de forma atómica. Un oficio Enviado queda en solo lectura.
- **RF-10:** Registrar a lo sumo una lectura por usuario/oficio (unicidad lógica).
- **RF-11:** Consultar oficio con ficha completa: datos, línea de tiempo (turnos, seguimientos, estados), lecturas, adjuntos y salida si existe.

### Catálogos y administración
- **RF-12:** CRUD de departamentos y tipos de documento solo para roles 2/3, con validación de referencias y auditoría; desactivación lógica en lugar de borrado físico.
- **RF-13:** Gestión de catálogo de estados ajustada a `docs/logica-sistema.md` (Pendiente, Turnado, En proceso, Respondido, Concluido, Vencido, Enviado); el vencimiento es derivado y no reemplaza estados terminales.

### Consultas y alcance
- **RF-14:** Listado de oficios con paginación y filtrado en servidor (folio, asunto, estado, tipo, fechas), respetando alcance: roles 2/3 ven todo; un usuario ve los oficios de su departamento destino o en los que participó.
- **RF-15:** Reportes y exportaciones calculados en servidor dentro del alcance del usuario.
- **RF-16:** Bitácora de auditoría consultable solo por roles 2/3.
- **RF-17:** Notificaciones/notificaciones visibles filtradas por departamento o alcance en servidor.

## Requisitos no funcionales
- Autorización siempre en servidor; los guards del frontend no se consideran control de acceso.
- Transacciones en turno+estado+auditoría, respuesta+estado+auditoría y envío+folio+estado+auditoría.
- Unicidad de folios garantizada por restricciones; concurrencia protegida con consecutivos por año, nunca cálculo en cliente.
- Contraseñas hasheadas; sin secretos ni datos personales reales en código, mocks, docs o logs.
- Fechas con zona horaria definida; folios y metadatos según `docs/modelo-datos.dbml`.
- Validación de todas las entradas en servidor (esquemas tipados).
- Adjuntos servidos con control de acceso; la API nunca expone URLs de Blob sin verificar sesión y alcance.
- El frontend consume la API mediante servicios tipados; se conservan `AuthContext`, guards y React Router.

## Casos límite
- Doble envío o envío concurrente del mismo oficio: solo una salida es posible (folio reservado transaccionalmente); el segundo intento falla con mensaje claro.
- Oficio turnado a departamento sin usuarios activos: el turno se registra; la visibilidad no se rompe.
- Usuario desactivado con sesión activa: la sesión queda invalidada en la siguiente verificación.
- Adjunto huérfano (Blob sin fila en DB o viceversa): la API tolera y reporta, sin exponer contenido.
- Vencimiento (Vencido) calculado por término: no sustituye Respondido/Concluido/Enviado.
- Primer envío del año: el consecutivo inicia en 0001 (formato `SAL-AAAA-0001`).

## Fuera de alcance
- Acuse de recibo externo, mensajería, firma electrónica.
- Migración del frontend a Next.js u otra reescritura de vistas.
- Multi-tenencia u otros sistemas institucionales.
- Aplicación móvil.

## Criterios de aceptación
Un usuario solo accede a la API con sesión válida y solo a los recursos de su alcance; cada operación de flujo es atómica y deja auditoría; los folios (oficio y salida) son únicos incluso bajo concurrencia; las consultas listan con paginación server-side; `npm run lint` y `npm run build` pasan; las vistas existentes funcionan contra la API sin perder funcionalidad demostrada en `src/Data/`.
