import { z } from "zod";

export const departamentoSchema = z.object({
  nombre: z.string().min(2, "El nombre del departamento es requerido"),
  tipo: z.enum(["INTERNO", "EXTERNO"]).default("INTERNO"),
  activo: z.boolean().optional(),
});

export const tipoDocumentoSchema = z.object({
  nombre: z.string().min(2, "El nombre del tipo de documento es requerido"),
  activo: z.boolean().optional(),
});

