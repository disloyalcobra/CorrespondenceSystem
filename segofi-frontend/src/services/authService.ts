import { apiClient } from "./apiClient";
//Tipo que representa al usuario logueado en la aplicacion
//Dto sin contraseñas ni hashes
export interface UsuarioSesion {
    id: number;
    nombre: string;
    email: string;
    rol_id: number;
    departamento_id: number | null;
    activo: boolean;
    creado_en?: string;
}
// Estructura de la respuesta del servidor al hacer login o consultar sesion
export interface LoginResponse {
    usuario: UsuarioSesion;
}

export interface CambiarPasswordPayload {
    passwordActual: string;
    nuevaPassword: string;
}

// Objeto con las operaciones esenciales de autenticación y cuenta
export const authService = {
    // Inicia sesión: envía email y password al backend, el cual responde con el usuario y setea la cookie
    async login(email: string, password: string): Promise<UsuarioSesion> {
        const res = await apiClient.post<LoginResponse>("/auth/login", { email, password });
        return res.usuario;
    },
    // Cierra sesión: le pide al backend que limpie la cookie de sesión HTTP-only
    async logout(): Promise<void> {
        await apiClient.post("/auth/logout");
    },
    // Consulta la sesión del usuario actual
    async me(): Promise<UsuarioSesion> {
        const res = await apiClient.get<LoginResponse>("/auth/me");
        return res.usuario;
    },
    // Cambia la contraseña del usuario en el backend validando la actual
    async cambiarPassword(usuarioId: number, payload: CambiarPasswordPayload): Promise<{ ok: boolean; mensaje: string }> {
        return apiClient.put(`/usuarios/${usuarioId}/password`, payload);
    },
};
