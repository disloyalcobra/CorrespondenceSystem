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
// Objeto con las 3 operaciones esecenciales de autenticacion
export const authService = {
    //inicia sesión: envía email y password al backend, el cual responde con el usuario y setea la cookie
    async login(email: string, password: string): Promise<UsuarioSesion> {
        const res = await apiClient.post<LoginResponse>("/auth/login", { email, password });
        return res.usuario;
    },
    //Cierra sesión le pide al backend que limpie la cookie de sesión HTTP-only
    async logout(): Promise<void> {
        await apiClient.post("/auth/logout");
    },
    async me(): Promise<UsuarioSesion> {
        const res = await apiClient.get<LoginResponse>("/auth/me");
        return res.usuario;
    },
};
