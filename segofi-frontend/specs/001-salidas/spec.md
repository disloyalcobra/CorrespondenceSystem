# Especificación 001 — Registro de oficios enviados

## Objetivo
Al finalizar la atención de un oficio, SegOfi debe permitir oficializar su envío y conservar un registro histórico consultable e inmutable.

## Requisitos funcionales
- **RF-1:** Al solicitar el envío, pedir confirmación al usuario.
- **RF-2:** Confirmado el envío, asignar un folio único `SAL-AAAA-XXXX`, registrar actor/fecha, cambiar estado a Enviado y presentar el folio.
- **RF-3:** Rechazar un segundo envío del mismo oficio con mensaje claro.
- **RF-4:** Un oficio Enviado se consulta en modo solo lectura.
- **RF-5:** Permitir consultar salidas por folio, asunto o destinatario y filtrar por fecha y tipo documental, respetando permisos.

## Requisitos no funcionales
- Operación atómica en backend para evitar duplicados concurrentes.
- Registro de auditoría no editable desde la interfaz.
- Interfaz accesible, en español y consistente con SegOfi.
- Los adjuntos y datos sensibles se sirven con controles de acceso.

## Fuera de alcance
Acuse de recibo externo e integración con servicios de mensajería. La implementación visual debe ajustarse a rutas/componentes existentes de SegOfi.

## Criterios de aceptación
Un usuario autorizado puede confirmar un único envío; se conserva el folio y el actor en el historial; búsquedas y filtros no revelan registros fuera de su alcance; reintentos no crean otra salida.
