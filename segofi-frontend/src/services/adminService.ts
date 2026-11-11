import { apiClient } from "./apiClient";
import type { UsuarioSesion } from "./authService";

// Tipos para Departamentos
export interface DepartamentoDTO {
  id: number;
  nombre: string;
  tipo: string;
  activo?: boolean;
}

export interface CrearDepartamentoPayload {
  nombre: string;
  tipo: string;
}

// Tipos para Usuarios
export interface CrearUsuarioPayload {
  nombre: string;
  email: string;
  password: string;
  rol_id: number;
  departamento_id?: number | null;
}

export interface ActualizarUsuarioPayload {
  nombre?: string;
  email?: string;
  rol_id?: number;
  departamento_id?: number | null;
  activo?: boolean;
}

// Tipos para Auditoría
export interface RegistroAuditoria {
  id: number;
  usuarioId: number | null;
  usuarioNombre: string | null;
  usuarioEmail: string | null;
  accion: string;
  entidad: string;
  entidadId: number | null;
  detalle: string | null;
  creadoEn: string;
}

export const adminService = {
  // Departamentos
  departamentos: {
    async listar(): Promise<DepartamentoDTO[]> {
      const res = await apiClient.get<{ departamentos: DepartamentoDTO[] }>("/departamentos");
      return res.departamentos;
    },

    async crear(payload: CrearDepartamentoPayload): Promise<DepartamentoDTO> {
      const res = await apiClient.post<{ departamento: DepartamentoDTO }>("/departamentos", payload);
      return res.departamento;
    },

    async actualizar(id: number, payload: Partial<CrearDepartamentoPayload>): Promise<DepartamentoDTO> {
      const res = await apiClient.put<{ departamento: DepartamentoDTO }>(`/departamentos/${id}`, payload);
      return res.departamento;
    },

    async eliminar(id: number): Promise<void> {
      await apiClient.delete(`/departamentos/${id}`);
    },
  },

  // Usuarios
  usuarios: {
    async listar(): Promise<UsuarioSesion[]> {
      const res = await apiClient.get<{ usuarios: UsuarioSesion[] }>("/usuarios");
      return res.usuarios;
    },

    async crear(payload: CrearUsuarioPayload): Promise<UsuarioSesion> {
      const res = await apiClient.post<{ usuario: UsuarioSesion }>("/usuarios", payload);
      return res.usuario;
    },

    async actualizar(id: number, payload: ActualizarUsuarioPayload): Promise<UsuarioSesion> {
      const res = await apiClient.put<{ usuario: UsuarioSesion }>(`/usuarios/${id}`, payload);
      return res.usuario;
    },
  },

  // Auditoría
  auditoria: {
    async listar(params?: { entidad?: string; usuario_id?: number; page?: number; limit?: number }) {
      return apiClient.get<{ data: RegistroAuditoria[]; page: number; limit: number }>("/auditoria", {
        params,
      });
    },
  },
};
