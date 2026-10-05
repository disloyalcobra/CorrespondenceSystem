# Plan Técnico 002 — Alineación de Interfaz

## Contexto de Arquitectura
`SegOfi` usa React 19, Tailwind v4 y Vite. Los componentes principales (`Sidebar`, `Topbar`, `Inicio`, `VerOficios`) están centralizados.

## Análisis de Componentes a Modificar

1. **Sidebar (`src/components/Sidebar.tsx` o similar):**
   - Extraer clases actuales y reemplazarlas con tokens de Tailwind correspondientes a SistemaCorrespondencia.
   - Ajustar lógica de iconos.

2. **Topbar (`src/components/Topbar.tsx` o similar):**
   - Quitar `<Input type="search" />` y ajustar `flex-between` o `justify-end`.

3. **Inicio (`src/User/Inicio/Inicio.tsx` o similar):**
   - Obtener usuario del `AuthContext` y usar la estructura de tarjeta de bienvenida (saludo, fecha actual, rol).

4. **Ver Oficios (`src/User/VerOficios/VerOficios.tsx` o similar):**
   - Añadir selectores (`<select>` o custom dropdowns) para Departamento y Tipo.
   - Actualizar el hook `useMemo` o estado local que filtra `oficiosStore` para aplicar las nuevas restricciones.

## Riesgos y Mitigaciones
- **Colisión de CSS:** Tailwind v4 debe manejar todo. Mitigación: Solo usar utilidades de clase, evitar estilos en línea.
- **Romper navegación:** Probar enlaces de Sidebar después del ajuste.
