# Lógica de negocio de SegOfi

Este documento adapta a SegOfi los flujos y reglas ya definidos para la gestión institucional de oficios. Es una especificación de dominio, no afirma que exista persistencia o API de backend: la aplicación actual es React 19 + TypeScript + Vite y presenta datos de demostración en `src/Data/` y autenticación en `src/Guards/`.

## Entidades

- **Usuario** pertenece a un rol y, opcionalmente, a un departamento; debe poder desactivarse sin borrar su historial.
- **Oficio** conserva folio, tipo, asunto/objeto, remitente, destino inicial, fechas y estado.
- **Turno** registra cada asignación a departamento, quién la realizó y cuándo se recibió.
- **Seguimiento** es una observación, avance o respuesta formal ligada al oficio y al usuario autor.
- **Adjunto** referencia documentos de un oficio o de un seguimiento.
- **Lectura** registra la primera visualización por usuario (unicidad lógica oficio/usuario).
- **Salida** es el registro inmutable de envío, con folio `SAL-AAAA-XXXX` único.
- **Auditoría** registra actor, acción, entidad, identificador, detalle y fecha en cada mutación.

## Flujo y reglas

1. **Radicar:** validar datos requeridos, generar/asignar folio institucional, crear oficio pendiente y asociar adjuntos; registrar auditoría.
2. **Turnar:** crear un evento de turno y actualizar el estado del oficio a Turnado en una sola transacción.
3. **Registrar avance:** añadir seguimiento atribuido al usuario; un oficio turnado puede pasar a En proceso.
4. **Responder:** guardar respuesta formal y adjuntos; actualizar a Respondido o Concluido según la decisión autorizada.
5. **Enviar:** rechazar oficio inexistente o ya enviado; reservar un folio de salida secuencial por año, guardar salida, cambiar estado a Enviado y auditar atómicamente. Enviado es de solo lectura.
6. **Marcar lectura:** registrar como máximo una lectura inicial por usuario/oficio.
7. **Administración:** altas/cambios/desactivaciones de cuentas y departamentos deben validar referencias y generar auditoría. Nunca almacenar contraseñas en texto plano.

## Estados

Catálogo sugerido: Pendiente (1), Turnado (2), En proceso (3), Respondido (4), Concluido (5), Vencido (6) y Enviado (7). El vencimiento es una condición derivada del término y no debe reemplazar estados terminales. Confirmar los nombres contra el catálogo vigente de SegOfi antes de persistirlos.

## Requisitos de integridad para backend

- Restricciones FK para referencias y unicidad para folios.
- Transacción para turno + estado + auditoría, respuesta + estado + auditoría, y envío + folio + estado + auditoría.
- Proteger concurrencia al generar folios mediante secuencia/tabla de consecutivos bloqueada por año; no depender de un cálculo en cliente.
- Autorización en servidor por rol, departamento y alcance; los guards del frontend no sustituyen controles backend.
- Adjuntos en almacenamiento de archivos seguro; base de datos guarda metadatos y una referencia protegida, no contenido confiado del cliente.
- Paginación/filtrado en servidor para consultas y exportaciones; fechas almacenadas con zona horaria definida.

## Adaptación tecnológica

El detalle funcional de un oficio vive en una página propia (`/ver-oficios/detalle`) con ficha descargable, línea de tiempo y adjuntos. La demostración aplica las acciones desde `src/Data/oficiosStore.ts` durante la sesión; turnos, notas, respuestas, adjuntos y envíos se reflejan en el historial y la bitácora. Este estado en memoria no es persistencia productiva y se reinicia al recargar.

En SegOfi se deben consumir estas operaciones desde servicios tipados conectados al backend, conservando el `AuthContext`, los guards y la navegación React Router existentes. No trasladar contraseñas, mocks ni estado de negocio persistente a `localStorage`. Las formas actuales de `src/Data/oficio.ts` pueden mapearse desde/hacia DTOs, evitando acoplar el modelo de dominio a la presentación.
