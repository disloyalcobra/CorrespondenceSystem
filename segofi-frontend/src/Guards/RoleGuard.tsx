import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

interface RoleGuardProps {
  allowedRoles: number[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-guinda border-t-transparent" />
      </div>
    );
  }

  if (!usuario) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(usuario.rol_id)) return <Navigate to="/" replace />;

  return <Outlet />;
}
