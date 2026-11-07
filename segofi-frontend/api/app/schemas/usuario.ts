import { z } from "zod";
//DTO para crear usuario
export const crearUsuarioSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("Correo electronico inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    rol_id: z.number().int().positive().nullable().optional(),
    departamento_id: z.number().int().positive().nullable().optional(),
});

//DTO para actualizar usuario (desactivavion lógica, edicion de perfil)
export const actualizarUsuarioSchema = z.object({
    nombre: z.string().min(1).optional(),
    email: z.string().email().optional(),
    rol_id: z.number().int().positive().optional(),
    departamento_id: z.number().int().positive().nullable().optional(),
    activo: z.boolean().optional(),
});
//DTO para cambio de contraseña 
export const cambiarPasswordSchema = z.object({
    passwordActual: z.string().min(1, "La contraseña es requerida"),
    nuevaPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
});

export type CrearUsuarioInput = z.infer<typeof crearUsuarioSchema>;
export type ActualizarUsuarioInput = z.infer<typeof actualizarUsuarioSchema>;
export type CambiarPasswordInput = z.infer<typeof cambiarPasswordSchema>;
