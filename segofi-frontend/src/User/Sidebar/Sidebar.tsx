import { useRef, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  House,
  Inbox,
  FilePlus,
  Send,
  Bell,
  Settings,
  LogOut,
  User,
  UsersRound,
  FileSpreadsheet,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../Guards/useAuth";
import type { Rol } from "../../Guards/authTypes";
import ConfirmDialog from "../../components/ConfirmDialog";
import Avatar from "../../components/Avatar";
import { NOTIFICACIONES } from "../../Data/notificaciones";
import { notificacionesVisibles } from "../../Guards/alcance";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  rolesPermitidos?: Rol[];
}

const ADMIN_ROLES: Rol[] = ["Administrador", "Directora"];

const MENU_PRINCIPAL: NavItem[] = [
  { to: "/dashboard", label: "Inicio", icon: <House size={24} /> },
];

const ACCIONES: NavItem[] = [
  { to: "/ver-oficios", label: "Ver documentos", icon: <Inbox size={24} /> },
  { to: "/enviados", label: "Enviados", icon: <Send size={24} /> },
  {
    to: "/crear-oficio",
    label: "Nuevo documento",
    icon: <FilePlus size={24} />,
    rolesPermitidos: ADMIN_ROLES,
  },
  {
    to: "/seguimiento-personas",
    label: "Seguimiento por persona",
    icon: <UsersRound size={24} />,
    rolesPermitidos: ADMIN_ROLES,
  },
];

const ADMINISTRAR: NavItem[] = [
  {
    to: "/administracion",
    label: "Administración",
    icon: <Settings size={24} />,
    rolesPermitidos: ADMIN_ROLES,
  },
  {
    to: "/reportes",
    label: "Reportes",
    icon: <FileSpreadsheet size={24} />,
    rolesPermitidos: ADMIN_ROLES,
  },
];

const ETIQUETA_ROL: Record<Rol, string> = {
  Usuario: "Usuario",
  Administrador: "Administrador",
  Directora: "Directora",
  JefeDepartamento: "Jefe de departamento",
};

function visiblesPara(items: NavItem[], rol?: Rol) {
  return items.filter(
    (item) =>
      !item.rolesPermitidos || (rol && item.rolesPermitidos.includes(rol)),
  );
}

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cerrarConRetraso = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuPrincipal = visiblesPara(MENU_PRINCIPAL, usuario?.rol);
  const acciones = visiblesPara(ACCIONES, usuario?.rol);
  const administrar = visiblesPara(ADMINISTRAR, usuario?.rol);
  const urgentOficios = notificacionesVisibles(usuario, NOTIFICACIONES);
  const notisPreview = urgentOficios.slice(0, 3);

  const confirmarLogout = () => {
    logout();
    navigate("/login");
  };

  const abrirAlEntrar = () => {
    if (cerrarConRetraso.current) clearTimeout(cerrarConRetraso.current);
    setMenuAbierto(true);
  };
  const cerrarAlSalir = () => {
    cerrarConRetraso.current = setTimeout(() => setMenuAbierto(false), 200);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-normal transition-all duration-200 text-left w-full segofi-nav-link ${isActive
      ? "activo text-white font-bold"
      : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen w-full flex bg-fondo relative">
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Navigation Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] transform bg-gradient-to-b from-guinda to-guinda-dark shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-4 py-5 pb-3 flex items-center justify-between md:justify-center">
          <button
            onClick={() => {
              navigate("/dashboard");
              setSidebarOpen(false);
            }}
            title="Ir a Inicio"
            className="w-full max-w-[200px] transition-opacity hover:opacity-85"
          >
            <img
              src={`${import.meta.env.BASE_URL}logo-puebla-blanco.svg`}
              alt="Secretaría de Turismo"
              className="block w-full h-auto min-h-[48px]"
            />
          </button>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden text-white/70 hover:text-white p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="segofi-divider mx-4 mb-3" />

        <nav className="flex-1 min-h-0 px-3 pb-4 overflow-y-auto">
          <div className="flex flex-col gap-1 mb-4">
            {menuPrincipal.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                <span className="text-white/75 group-hover:text-white transition-colors group-[.activo]:text-dorado">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {acciones.length > 0 && (
            <div className="flex flex-col gap-1 mb-4">
              {acciones.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                  <span className="text-white/75 group-hover:text-white transition-colors group-[.activo]:text-dorado">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}

          {administrar.length > 0 && (
            <div className="flex flex-col gap-1">
              {administrar.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                  <span className="text-white/75 group-hover:text-white transition-colors group-[.activo]:text-dorado">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {usuario && (
          <div className="m-3 mt-0 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 backdrop-blur-sm">
            <Avatar nombre={usuario.nombre} size={38} />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight truncate">
                {usuario.nombre}
              </p>
              <p className="text-xs text-white/70 truncate">
                {ETIQUETA_ROL[usuario.rol]}
              </p>
            </div>
          </div>
        )}

        <div className="px-3 pb-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all"
          >
            <LogOut size={24} />
            <span className="text-base font-normal">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col bg-fondo-app min-w-0">
        {/* Topbar: Diseño SistemaCorrespondencia */}
        <header className="h-[60px] bg-guinda-dark text-white border-b-2 border-dorado shadow-md sticky top-0 z-40 px-4 md:px-7 flex items-center justify-between md:justify-end">
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Botón Campana */}
            <div
              className="relative"
              onMouseEnter={abrirAlEntrar}
              onMouseLeave={cerrarAlSalir}
            >
              <button
                onClick={() => setMenuAbierto((v) => !v)}
                className="w-[44px] h-[44px] rounded-lg bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 hover:border-dorado transition-all"
                title="Notificaciones"
              >
                <Bell size={22} />
                {urgentOficios.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold px-[6px] py-[3px] rounded-full border border-guinda-dark min-w-[20px] text-center">
                    {urgentOficios.length}
                  </span>
                )}
              </button>

              {menuAbierto && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl border border-borde bg-white shadow-xl z-20 text-texto-dark
                    animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-3 bg-slate-50 border-b border-borde rounded-t-xl flex items-center justify-between">
                    <span className="font-bold text-[13.5px] text-guinda-dark">
                      Notificaciones
                    </span>
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {urgentOficios.length} alertas
                    </span>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {notisPreview.length === 0 ? (
                      <div className="p-6 text-center text-[13px] text-slate-400">
                        No hay notificaciones recientes.
                      </div>
                    ) : (
                      notisPreview.map((n, i) => {
                        const Icono = n.icono;
                        return (
                          <li
                            key={i}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-red-50 transition-colors border-b border-borde cursor-pointer"
                            onClick={() => navigate("/ver-oficios")}
                          >
                            <span className="h-8 w-8 shrink-0 rounded-full bg-guinda/10 text-guinda flex items-center justify-center">
                              <Icono size={15} />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[12.5px] text-texto-dark truncate">
                                {n.texto}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {n.fecha}
                              </p>
                            </div>
                          </li>
                        );
                      })
                    )}
                  </ul>
                  <div className="border-t border-borde">
                    <div className="px-4 py-3">
                      <p className="text-sm font-semibold text-texto truncate">
                        {usuario?.nombre}
                      </p>
                      <p className="text-xs text-texto-secundario truncate">
                        {usuario?.cargo}
                      </p>
                    </div>
                    <NavLink
                      to="/perfil"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-texto hover:bg-fondo/50 transition-colors"
                    >
                      <User size={16} />
                      Ver perfil
                    </NavLink>
                    <button
                      onClick={() => {
                        setMenuAbierto(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-guinda hover:bg-guinda/5 transition-colors rounded-b-xl"
                    >
                      <LogOut size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Simulador / Avatar box */}
            <div className="flex items-center gap-4 bg-black/25 border border-dorado/40 py-1 pr-6 pl-3 rounded-full cursor-pointer hover:bg-black/40 transition-colors" onClick={() => setMenuAbierto((v) => !v)}>
              <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-dorado to-[#8c682d] flex items-center justify-center text-white font-bold text-[16px] border-[1.5px] border-white shadow-sm">
                {usuario?.nombre.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] font-bold leading-[1.2]">
                  {usuario?.nombre.split(" ")[0]} {usuario?.nombre.split(" ")[1] ?? ""}
                </span>
                <span className="text-[12px] text-dorado flex items-center gap-1.5 font-semibold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-dorado shadow-[0_0_4px_rgba(202,165,115,0.8)]"></span>
                  {ETIQUETA_ROL[usuario?.rol as Rol]}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="¿Deseas cerrar tu sesión?"
        confirmLabel="Sí"
        cancelLabel="No"
        variant="danger"
        onConfirm={confirmarLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
