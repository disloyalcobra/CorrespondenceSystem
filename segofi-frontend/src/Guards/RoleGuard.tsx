import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

interface RoleGuardProps {
  allowedRoles: number[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { usuario } = useAuth();
  
  if (!usuario) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(usuario.rol_id)) return <Navigate to="/" replace />;
  
  return <Outlet />;
}
