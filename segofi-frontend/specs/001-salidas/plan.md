# Plan 001 — Registro de salidas en SegOfi

## Alcance técnico
1. Acordar con backend los DTOs de Oficio, Salida y Auditoría, y mapearlos a los tipos de `src/Data/`.
2. Implementar endpoint transaccional de envío: comprobar estado, reservar consecutivo anual, insertar salida, cambiar estado y auditar.
3. Añadir servicio frontend tipado que consuma endpoint; no mutar mocks ni persistir el folio en el cliente como fuente de verdad.
4. Integrar la acción en la vista/ruta existente de detalle de documentos, usando componentes y patrón de confirmación SegOfi.
5. Añadir consulta paginada de salidas con filtros y verificación de alcance en servidor.
6. Cubrir con pruebas de backend concurrencia, duplicados, autorización y rollback; probar frontend para confirmación, estados y errores.

## Dependencias/decisiones pendientes
- Identificar tecnología y ubicación del backend/DB de SegOfi; este repositorio localizado contiene el frontend.
- Definir formato final de folio, zona horaria, roles autorizados y estados vigentes.
- Definir dónde se almacenan los archivos y cómo se autentican descargas.

## Invariante crítica
El cambio a Enviado, la fila de salida y la auditoría deben confirmarse o revertirse juntos. La generación de consecutivo debe serializarse por año en la base de datos.
