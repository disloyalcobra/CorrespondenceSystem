import { z } from "zod";

/**
 * Schema para crear un seguimiento (nota, avance o respuesta) en un oficio.
 *
 * Tipos:
 * - NOTA / AVANCE : cualquier usuario con acceso al oficio; si el oficio está en
 *   estado Turnado (2) o En proceso (3) → pasa a En proceso (3).
 * - RESPUESTA     : solo el departamento destino o roles 2/3; con `decidirConclusion=false`
 *   → estado 4 (Respondido); con `decidirConclusion=true` → estado 5 (Concluido).
 */
export const seguimientoCreateSchema = z.object({
  tipo: z.enum(["NOTA", "AVANCE", "RESPUESTA"]),
  contenido: z.string().min(1, "El contenido no puede estar vacío"),
  decidirConclusion: z.boolean().optional(), // solo aplica cuando tipo = RESPUESTA
});

export type SeguimientoCreate = z.infer<typeof seguimientoCreateSchema>;
