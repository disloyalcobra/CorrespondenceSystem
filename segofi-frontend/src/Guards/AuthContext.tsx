import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type Usuario } from "./authTypes";
import { authService } from "../services/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  //Iniciamos cargando en true porque no sabemos si aun hay sesión
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    let montado = true;

    authService
      .me()
      .then((user) => {
        if (montado) setUsuario(user);
      })
      .catch(() => {
        if (montado) setUsuario(null);
      })
      .finally(() => {
        if (montado) setCargando(false);
      });
    return () => {
      montado = false;
    };
  }, []);
  // Función login invocada desde la pantalla de Login
  const login = async (email: string, pass: string) => {
    const user = await authService.login(email, pass);
    setUsuario(user);
  };
  // Función logout invocada desde el botón "Cerrar sesión"
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      // Pase lo que pase con la red, borramos el usuario del estado local
      setUsuario(null);
    }
  };
  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}