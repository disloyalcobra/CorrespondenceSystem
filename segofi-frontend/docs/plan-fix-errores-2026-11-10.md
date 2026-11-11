# Plan — Segunda tanda: datos demo en la UI, detalle del oficio y borrado de departamentos

Fecha: 2026-11-10 (continuación)
Alcance: backend (api/) + frontend (src/) + tests + MEMORY.md

## Diagnóstico (causas raíz confirmadas con evidencia)

### RC5 — "me siguen apareciendo usuarios en seguimiento-personas / folios en reportes y enviados"
- Evidencia: `SeguimientoPersonas.tsx`, `Reportes.tsx` y `Enviados.tsx` usan `useOficios()`
  (`src/Data/oficiosStore.ts`), que devuelve `OFICIOS_DEMO`. Siguen mostrando los datos de
  demostración, no los de la base de datos.
- Causa: esas tres pantallas nunca se conectaron al servicio `oficiosService` (solo lo hizo `VerOficios`).

### RC6 — "los documentos subidos no aparecen en el oficio / las notas no aparecen / la línea de tiempo vacía"
- Evidencia: `GET /api/oficios` (lista) devuelve solo las columnas de `oficios` — sin `adjuntos`,
  sin `seguimiento`. `GET /api/oficios/:id` (detalle) sí devuelve `adjuntos` (2), `lineaTiempo` (3
  eventos: RESPUESTA, NOTA, TURNO) y `lecturas`.
- Causa: `DetalleOficio.tsx` carga el oficio con `oficiosService.listar({ folio })` (endpoint de lista)
  en lugar de `obtenerPorId` (endpoint de detalle), y su `recargar()` hace lo mismo.

### RC7 — "no se pueden borrar los departamentos"
- Evidencia: `DELETE /api/departamentos/:id` responde 200 y deja `activo=false` (desactivación lógica,
  lo que exige el proyecto). Pero `GET /api/departamentos` devuelve también los inactivos y la UI los
  pinta igual, sin el campo `activo` → el usuario ve la fila y cree que no se borró.
- Causa: el frontend no refleja el estado activo/inactivo.

### RC8 — mapa de estados del frontend ≠ catálogo del backend (encontrado al verificar)
- Evidencia: backend `ESTADOS_SEED` y `docs/logica-sistema.md`: Pendiente(1), Turnado(2), En proceso(3),
  Respondido(4), Concluido(5), Vencido(6), Enviado(7). Frontend: 1 Recibido, 2 En seguimiento,
  3 Turnado, 4 Respondido, 5 Cerrado, 6 Enviado.
- Impacto: "Enviados" filtra `estado_id === 6` (Vencido) en vez de 7 (Enviado); los filtros de
  Ver Oficios y las etiquetas del detalle apuntan al estado equivocado.

## Cambios

### Backend
1. `api/app/lib/query.ts` — `usuarioNombre` en los eventos de la línea de tiempo.
2. `api/app/routes/seguimientos.ts` — nuevo `GET /api/seguimientos/personas`: acciones por persona
   sobre los oficios del alcance del usuario (seguimientos + turnos).
3. `api/app/index.ts` — montaje del nuevo router.
4. `api/__tests__/seguimiento-personas.test.ts` — tests del endpoint.

### Frontend
5. `src/Data/estados.ts` — mapa canónico estado_id → etiqueta (el catálogo del backend).
6. `src/components/StatusBadge.tsx` — etiquetas alineadas con el catálogo.
7. `src/services/oficiosService.ts` — DTO/mapper del detalle (`lineaTiempo` → `seguimiento`) y
   `seguimientoPorPersonas()`.
8. `src/services/useCatalogos.ts` — hook de catálogos (estados, departamentos, tipos).
9. `src/services/useOficios.ts` — hook de oficios desde la API.
10. `src/User/VerOficios/DetalleOficio.tsx` — carga el detalle real y recarga tras cada acción.
11. `src/User/Departamentos/Departamentos.tsx` — refleja la desactivación lógica.
12. `src/User/Reportes/Reportes.tsx`, `Enviados.tsx`, `SeguimientoPersonas.tsx` — datos de la API.
13. `src/User/VerOficios/VerOficios.tsx` — mapa de estados corregido.

## Verificación
- `npm run lint`, `npm run build`, `npm test`.
- Re-prueba en vivo contra la API (:3000) y contra Turso.
- `MEMORY.md`.
