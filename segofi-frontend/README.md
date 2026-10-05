# SegOfi — Frontend

Aplicación web de gestión de documentos y oficios de SECTUR.

## Tecnologías

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS
- lucide-react

## Desarrollo

Desde esta carpeta (`segofi-frontend/`):

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Organización

- `src/User/`: pantallas y módulos de usuario.
- `src/Guards/`: autenticación, alcance y control de roles del frontend.
- `src/Data/`: modelos y datos de demostración, no persistencia productiva.
- `src/components/`: componentes reutilizables.
- `docs/`: modelo relacional DBML y reglas de negocio adaptadas a SegOfi.
- `specs/`: especificaciones de funcionalidades pendientes/de referencia.

## Dominio de correspondencia

El modelo y las reglas de oficios, turnos, seguimientos, adjuntos, lecturas, salidas y auditoría están documentados en `docs/modelo-datos.dbml` y `docs/logica-sistema.md`. La especificación de registro de salidas está en `specs/001-salidas/`.

Estos documentos migran el conocimiento funcional de SistemaCorrespondencia; no implican que exista aquí un backend o una base de datos conectada. El frontend debe consumir servicios del backend SegOfi cuando estén disponibles. No usar los mocks ni `localStorage` como fuente de verdad para datos institucionales.
