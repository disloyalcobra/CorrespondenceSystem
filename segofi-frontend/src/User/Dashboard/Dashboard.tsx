import { Link } from "react-router-dom";
import {
  FileText,
  FolderOpen,
  Building2,
  Users,
  FileStack,
  Clock3,
  CheckCircle2,
  Archive,
  Bell,
  Percent,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../../Guards/useAuth";
import type { Rol } from "../../Guards/authTypes";
import Card from "../../components/Card";
import BarChart from "../../components/BarChart";
import StatCard from "../../components/StatCard";
import { OFICIOS_DEMO } from "../../Data/oficio";
import { DEPARTAMENTOS_DEMO } from "../../Data/departamentos";
import { PERSONAS_DEMO } from "../../Data/personas";
import { NOTIFICACIONES } from "../../Data/notificaciones";
import { oficiosVisibles, notificacionesVisibles, tieneAccesoTotal } from "../../Guards/alcance";

const ADMIN_ROLES: Rol[] = ["Administrador", "Directora"];

//  5 accesos rápidos
const ACCESOS = [
  {
    to: "/crear-oficio",
    label: "Nuevo oficio",
    icon: FileText,
    rolesPermitidos: ADMIN_ROLES,
  },
  { to: "/ver-oficios", label: "Ver oficios", icon: FolderOpen },
  { to: "/enviados", label: "Enviados", icon: Archive },
  {
    to: "/departamentos",
    label: "Departamentos",
    icon: Building2,
    rolesPermitidos: ADMIN_ROLES,
  },
  {
    to: "/administracion",
    label: "Administración",
    icon: Users,
    rolesPermitidos: ADMIN_ROLES,
  },
];

const ESTADOS_ORDEN = [
  "Recibido",
  "Turnado",
  "En seguimiento",
  "Respondido",
  "Cerrado",
] as const;
const COLORES_ESTADO = [
  "bg-blue-500",
  "bg-dorado",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-guinda",
];

export default function Dashboard() {
  const { usuario } = useAuth();

  const accesos = ACCESOS.filter(
    (a) =>
      !a.rolesPermitidos ||
      (usuario && a.rolesPermitidos.includes(usuario.rol)),
  );

  const esAdmin = tieneAccesoTotal(usuario);

  const misOficios = oficiosVisibles(usuario, OFICIOS_DEMO);
  const misNotificaciones = notificacionesVisibles(usuario, NOTIFICACIONES);

  const conteos = ESTADOS_ORDEN.map((estado, i) => ({
    label: estado,
    value: misOficios.filter((o) => o.estado === estado).length,
    color: COLORES_ESTADO[i],
  }));

  const pendientes = misOficios.filter((o) =>
    ["Recibido", "Turnado", "En seguimiento"].includes(o.estado),
  ).length;
  const respondidos = misOficios.filter(
    (o) => o.estado === "Respondido",
  ).length;
  const cerrados = misOficios.filter((o) => o.estado === "Cerrado").length;
  const porcentajeCerrados =
    misOficios.length > 0
      ? Math.round((cerrados / misOficios.length) * 100)
      : 0;

  const gridColsClase: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
  };

  const fechaActual = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Banner de bienvenida (SistemaCorrespondencia) */}
      <div className="segofi-banner rounded-xl p-7 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="max-w-[700px]">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-base font-extrabold text-guinda tracking-widest uppercase">
              Inicio
            </span>
            <span className="text-base text-slate-500 flex items-center gap-1.5 capitalize">
              • {fechaActual}
            </span>
          </div>
          <h1 className="text-[32px] font-extrabold text-guinda-dark mb-1.5 leading-tight">
            Bienvenido, {usuario?.nombre.split(" ")[0]}
          </h1>
          <p className="text-base text-slate-500">
            Sistema de Gestión de Correspondencia y Oficios • {usuario?.dependencia}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {accesos.find(a => a.to === "/crear-oficio") && (
            <Link
              to="/crear-oficio"
              className="flex items-center gap-2 bg-guinda hover:bg-guinda-dark text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <FileText size={18} />
              Nuevo oficio
            </Link>
          )}
          <Link
            to="/ver-oficios"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-guinda border border-dorado px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <FolderOpen size={18} />
            Ver bandeja
          </Link>
        </div>
      </div>

      <Card
        title={
          esAdmin ? "Resumen del sistema" : `Resumen de ${usuario?.dependencia}`
        }
        bodyClassName="p-5"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard
            label={esAdmin ? "Total de oficios" : "Mis oficios"}
            value={misOficios.length}
            icon={FileStack}
            tone="guinda"
          />
          <StatCard
            label="Pendientes"
            value={pendientes}
            icon={Clock3}
            tone="amber"
          />
          <StatCard
            label="Respondidos"
            value={respondidos}
            icon={CheckCircle2}
            tone="emerald"
          />
          <StatCard
            label="Cerrados"
            value={cerrados}
            icon={Archive}
            tone="gray"
          />

          {esAdmin ? (
            <>
              <StatCard
                label="Departamentos"
                value={DEPARTAMENTOS_DEMO.length}
                icon={Building2}
                tone="blue"
              />
              <StatCard
                label="Cuentas activas"
                value={PERSONAS_DEMO.length}
                icon={Users}
                tone="dorado"
              />
              <StatCard
                label="Notificaciones"
                value={misNotificaciones.length}
                icon={Bell}
                tone="amber"
              />
              <StatCard
                label="% cerrados"
                value={porcentajeCerrados}
                suffix="%"
                icon={Percent}
                tone="emerald"
              />
            </>
          ) : (
            <>
              <StatCard
                label="Notificaciones"
                value={misNotificaciones.length}
                icon={Bell}
                tone="amber"
              />
              <StatCard
                label="% cerrados"
                value={porcentajeCerrados}
                suffix="%"
                icon={Percent}
                tone="emerald"
              />
            </>
          )}
        </div>
        <p className="text-sm font-semibold text-texto mb-2">
          {esAdmin ? "Oficios por estado" : "Mis oficios por estado"}
        </p>
        <BarChart data={conteos} height={190} />
      </Card>

      <div
        className={`grid grid-cols-3 ${gridColsClase[accesos.length] ?? "sm:grid-cols-5"} gap-3`}
      >
        {accesos.map(({ to, label, icon: Icon }, i) => (
          <Link
            key={label}
            to={to}
            style={{ animationDelay: `${i * 40}ms` }}
            className="group relative overflow-hidden flex flex-col items-center justify-center gap-2 rounded-xl
              bg-gradient-to-br from-guinda to-guinda-dark px-3 py-5 text-center
              shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200
              animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
          >
            <span className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-150" />
            <ArrowUpRight
              size={16}
              className="absolute right-2.5 top-2.5 text-dorado-light opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
            />
            <span className="relative h-10 w-10 rounded-full bg-dorado text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6">
              <Icon size={18} />
            </span>
            <span className="relative text-xs font-semibold text-dorado-light leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
