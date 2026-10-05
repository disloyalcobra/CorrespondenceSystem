import { createContext } from "react";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol_id: number;
  departamento_id: number;
  activo: boolean;
}

export interface AuthContextValue {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
