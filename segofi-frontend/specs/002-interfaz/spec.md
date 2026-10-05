# Especificación 002 — Alineación de Interfaz con SistemaCorrespondencia

## Objetivo
Replicar la experiencia visual y funcional clave del antiguo `SistemaCorrespondencia` en la nueva plataforma `SegOfi`, estandarizando Sidebar, Topbar, Panel de Inicio y los filtros de la vista "Ver oficios", sin perder las reglas de permisos y navegación actuales.

## Requisitos funcionales
- **RF-1 (Sidebar):** Replicar colores, tamaños, espaciado y estados (activo/hover). Mantener los permisos de rol existentes. Usar los iconos heredados para módulos coincidentes e iconos afines para nuevos módulos.
- **RF-2 (Topbar):** Replicar diseño del topbar, eliminar la barra de búsqueda general y redistribuir el espacio restante de manera uniforme.
- **RF-3 (Inicio):** Incorporar el panel de bienvenida adaptando sus datos al usuario autenticado y su contexto en SegOfi.
- **RF-4 (Ver Oficios):** Añadir filtros por "Departamento" y "Tipo de documento" junto a la búsqueda. Los filtros deben ser combinables con los actuales.
- **RF-5:** Mantener intacta la funcionalidad de abrir el detalle/seguimiento de oficios al hacer clic en las filas.

## Requisitos no funcionales
- Estilos en Tailwind coherentes con las variables globales (`@theme`) ya definidas.
- Responsive y sin barras de desplazamiento innecesarias.
- Uso exclusivo de `lucide-react` para iconos.

## Criterios de aceptación
Los componentes Sidebar, Topbar e Inicio deben lucir idénticos a los definidos en los lineamientos visuales del antiguo sistema, pero operando sobre la arquitectura de SegOfi. Los filtros en "Ver oficios" reducen correctamente los resultados sin afectar otras funciones de la tabla.
