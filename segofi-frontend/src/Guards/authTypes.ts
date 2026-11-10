import { createContext } from "react";
import type { UsuarioSesion } from "../services/authService";

export type Usuario = UsuarioSesion;

export interface AuthContextValue {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
