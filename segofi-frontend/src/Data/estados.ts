/**
 * Catálogo de estados del oficio.
 * Fuente de verdad: `api/_app/db/seed.ts` (ESTADOS_SEED) y `docs/logica-sistema.md`:
 * Pendiente (1), Turnado (2), En proceso (3), Respondido (4), Concluido (5),
 * Vencido (6) y Enviado (7).
 */
export type EstadoOficio =
  | "Pendiente"
  | "Turnado"
  | "En proceso"
  | "Respondido"
  | "Concluido"
  | "Vencido"
  | "Enviado";

export const ESTADOS: Record<number, EstadoOficio> = {
  1: "Pendiente",
  2: "Turnado",
  3: "En proceso",
  4: "Respondido",
  5: "Concluido",
  6: "Vencido",
  7: "Enviado",
};

export const ESTADOS_INVERSOS: Record<string, number> = {
  Pendiente: 1,
  Turnado: 2,
  "En proceso": 3,
  Respondido: 4,
  Concluido: 5,
  Vencido: 6,
  Enviado: 7,
};

/** Estados en los que el oficio ya no admite cambios. */
export const ESTADOS_TERMINALES = [5, 6, 7];

export function etiquetaEstado(estadoId: number): EstadoOficio {
  return ESTADOS[estadoId] ?? "Pendiente";
}
