---
name: SDD SegOfi
description: Especificar, planear, implementar y revisar cambios de SegOfi con aprobaciones entre fases.
---

# Desarrollo guiado por especificaciones (SDD) en SegOfi

Usa este flujo para cambios de alcance amplio, reglas de negocio o varios módulos. Para cambios pequeños y claros, trabaja directamente y verifica el resultado.

## Fases
1. **Spec:** redacta `specs/NNN-nombre/spec.md` con objetivo, actores, requisitos verificables, casos límite y fuera de alcance. Si hay ambigüedad, pregunta antes de asumir.
2. **Aprobación de spec:** presenta el resumen y espera aprobación del usuario.
3. **Plan:** documenta estructura actual, responsabilidades, decisiones y estrategia de validación en `plan.md`; divide la implementación en `tasks.md` ordenado y verificable. Espera aprobación antes de editar código.
4. **Implementación:** ejecuta una tarea aprobada a la vez, reutiliza el stack actual de SegOfi y no inventes un backend no presente.
5. **Verificación:** ejecuta `npm run lint` y `npm run build`; agrega o ejecuta pruebas pertinentes si existen.
6. **Revisión:** contrasta cada requisito con cambios y evidencia; corrige únicamente los incumplimientos confirmados.
7. **Cierre:** resume alcance, verificaciones, limitaciones del frontend/backend y trabajo pendiente.

## Reglas
- Las specs describen qué y por qué; el plan define cómo.
- Conserva permisos, alcance por rol, auditoría y trazabilidad del dominio.
- Los datos de `src/Data/` son demostrativos; no los describas como persistencia productiva.
- No guardes secretos ni datos personales reales.
- Mantén coherencia con `AGENTS.md`, `docs/constitution.md` y `docs/logica-sistema.md`.
