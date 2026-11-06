import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const usuarioSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  email: z.string().email(),
  rol_id: z.number(),
  departamento_id: z.number().nullable(),
  activo: z.boolean(),
  creado_en: z.string(),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>;

