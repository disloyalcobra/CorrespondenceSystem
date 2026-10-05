# AGENTS.md — SegOfi

## Proyecto
SegOfi es una aplicación de gestión de documentos/oficios de SECTUR. El frontend está en `segofi-frontend/` y usa React 19, TypeScript, Vite, React Router, Tailwind CSS y lucide-react.

## Estructura conocida
- `src/User/`: pantallas por módulo (Documentos, Seguimiento, Departamentos, Reportes, etc.).
- `src/Guards/`: autenticación, tipos de usuario, alcance y protección de roles.
- `src/Data/`: modelos y datos de demostración; no representan persistencia real.
- `src/components/`: componentes reutilizables.
- `docs/`: modelo relacional y reglas de negocio de correspondencia adaptadas a SegOfi.

## Reglas de trabajo
- Lee `docs/constitution.md`, `docs/logica-sistema.md` y el modelo DBML antes de cambiar flujos de datos.
- Mantén TypeScript y los patrones visuales ya presentes; no reintroduzcas JavaScript/Context de otro proyecto ni cambies AuthContext sin necesidad.
- No supongas que frontend guards son autorización suficiente. La autorización e integridad deben verificarse en backend.
- No guardar datos institucionales reales ni credenciales en mocks o `localStorage`.
- Preservar auditoría e historial; preferir desactivación lógica en vez de borrar entidades referenciadas.
- Actualiza documentación de dominio si cambian estados, permisos, entidades o flujos.

## Comandos
Desde `segofi-frontend/`: `npm run dev`, `npm run lint`, `npm run build`.

## Nota de estado
La lógica migrada desde SistemaCorrespondencia es una especificación y modelo de referencia. No se afirma que el backend ni la base de datos productiva estén implementados en este repositorio frontend.
