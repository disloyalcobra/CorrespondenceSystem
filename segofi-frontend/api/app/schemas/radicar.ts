import { z } from "zod";

export const adjuntoRadicarSchema = z.object({
  nombre_archivo: z.string().min(1, "Nombre de archivo requerido"),
  archivo_url: z.string().min(1, "URL de archivo requerida"),
});

export const radicarOficioSchema = z.object({
  tipo_documento_id: z.number().int().positive("Tipo de documento inválido"),
  objeto: z.string().min(1, "El objeto es requerido"),
  asunto: z.string().min(1, "El asunto es requerido"),
  destinatario: z.string().min(1, "El destinatario es requerido"),
  fecha_documento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha de documento inválida (formato YYYY-MM-DD)"),
  termino: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha de término inválida (formato YYYY-MM-DD)")
    .optional()
    .nullable(),
  departamento_destino_inicial_id: z
    .number()
    .int()
    .positive("Departamento destino requerido"),
  adjuntos: z.array(adjuntoRadicarSchema).optional(),
});

export type RadicarOficioInput = z.infer<typeof radicarOficioSchema>;
