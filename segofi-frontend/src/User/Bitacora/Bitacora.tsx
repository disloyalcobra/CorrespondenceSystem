import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ClipboardList,
  Search,
  RotateCcw,
  Loader2,
  User,
  ShieldCheck,
} from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import DataTable, { type Column } from "../../components/DataTable";
import { adminService, type RegistroAuditoria } from "../../services";

/**
 * Formatea una fecha ISO a la representación regional de México.
 */
function formatoFechaHora(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const f = new Date(iso);
    if (isNaN(f.getTime())) return iso;
    return f.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

/**
 * Retorna estilos y etiquetas visuales acordes a la acción registrada.
 */
function estiloAccion(accion: string): { estilo: string; etiqueta: string } {
  const norm = accion.toLowerCase();
  if (norm.includes("crear") || norm.includes("radicar")) {
    return { estilo: "bg-emerald-50 text-emerald-700 border-emerald-200", etiqueta: accion.toUpperCase() };
  }
  if (norm.includes("actuali") || norm.includes("modifi") || norm.includes("password")) {
    return { estilo: "bg-blue-50 text-blue-700 border-blue-200", etiqueta: accion.toUpperCase() };
  }
  if (norm.includes("turnar") || norm.includes("seguimiento") || norm.includes("nota") || norm.includes("respuesta")) {
    return { estilo: "bg-amber-50 text-amber-700 border-amber-200", etiqueta: accion.toUpperCase() };
  }
  if (norm.includes("eliminar") || norm.includes("desactiv") || norm.includes("cancel")) {
    return { estilo: "bg-red-50 text-red-700 border-red-200", etiqueta: accion.toUpperCase() };
  }
  if (norm.includes("enviar") || norm.includes("salida")) {
    return { estilo: "bg-purple-50 text-purple-700 border-purple-200", etiqueta: accion.toUpperCase() };
  }
  return { estilo: "bg-slate-100 text-slate-700 border-slate-200", etiqueta: accion.toUpperCase() };
}

/**
 * Normaliza el nombre del módulo o entidad auditada.
 */
function formatoEntidad(entidad: string): string {
  const norm = entidad.toLowerCase();
  if (norm.startsWith("oficio")) return "Oficios";
  if (norm.startsWith("usuario")) return "Usuarios";
  if (norm.startsWith("departamento")) return "Departamentos";
  if (norm.startsWith("adjunto")) return "Adjuntos";
  if (norm === "sistema") return "Sistema";
  return entidad.charAt(0).toUpperCase() + entidad.slice(1);
}

export default function Bitacora() {
  const [registros, setRegistros] = useState<RegistroAuditoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEntidad, setFiltroEntidad] = useState("todas");
  const [aviso, setAviso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    adminService.auditoria
      .listar({ limit: 100 })
      .then((res) => {
        setRegistros(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Error al cargar la bitácora:", err);
        const msg = err instanceof Error ? err.message : "Error al cargar la bitácora";
        setError(msg);
        setAviso(msg);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const recargar = () => {
    setCargando(true);
    cargar();
  };

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Filtro reactivo por búsqueda de texto y entidad
  const registrosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return registros.filter((r) => {
      // Filtro de entidad
      if (filtroEntidad !== "todas") {
        const entNorm = (r.entidad || "").toLowerCase();
        if (!entNorm.includes(filtroEntidad.toLowerCase())) return false;
      }
      // Filtro de búsqueda general
      if (!q) return true;
      const coincideUsuario = (r.usuarioNombre || "").toLowerCase().includes(q) ||
                              (r.usuarioEmail || "").toLowerCase().includes(q);
      const coincideAccion = (r.accion || "").toLowerCase().includes(q);
      const coincideDetalle = (r.detalle || "").toLowerCase().includes(q);
      const coincideEntidad = (r.entidad || "").toLowerCase().includes(q);
      return coincideUsuario || coincideAccion || coincideDetalle || coincideEntidad;
    });
  }, [registros, busqueda, filtroEntidad]);

  const columnas: Column<RegistroAuditoria>[] = [
    {
      header: "Fecha y hora",
      render: (r) => (
        <span className="text-[13px] font-medium text-slate-600 whitespace-nowrap">
          {formatoFechaHora(r.creadoEn)}
        </span>
      ),
    },
    {
      header: "Usuario",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <User size={14} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-texto-dark text-[13px] leading-tight">
              {r.usuarioNombre || "Sistema"}
            </span>
            {r.usuarioEmail && (
              <span className="text-[11px] text-slate-500">{r.usuarioEmail}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Acción",
      render: (r) => {
        const { estilo, etiqueta } = estiloAccion(r.accion);
        return (
          <span className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${estilo}`}>
            {etiqueta}
          </span>
        );
      },
    },
    {
      header: "Módulo",
      render: (r) => (
        <span className="text-[12px] font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
          {formatoEntidad(r.entidad)}
        </span>
      ),
    },
    {
      header: "Detalle del movimiento",
      render: (r) => (
        <span className="text-[13px] text-slate-700 max-w-md block break-words">
          {r.detalle || "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={ClipboardList}
        title="Bitácora de Actividades"
        description="Historial oficial y auditoría de todos los movimientos registrados en la plataforma."
        action={
          <Button
            variant="outline"
            icon={<RotateCcw size={16} className={cargando ? "animate-spin" : ""} />}
            onClick={recargar}
            disabled={cargando}
          >
            Actualizar
          </Button>
        }
      />

      <Card>
        {/* Barra de filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-end justify-between mb-5">
          <div className="flex-1 w-full sm:w-auto max-w-md">
            <Input
              label="Buscar eventos"
              icon={<Search size={18} className="text-slate-400" />}
              placeholder="Buscar por usuario, acción, folio o detalle..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-sm font-medium text-texto">Módulo</label>
            <div className="flex items-center gap-2">
              <select
                value={filtroEntidad}
                onChange={(e) => setFiltroEntidad(e.target.value)}
                className="h-12 px-3 rounded-lg border border-borde bg-white text-base text-texto shadow-sm focus:outline-none focus:ring-2 focus:ring-guinda/40 focus:border-guinda transition-all"
              >
                <option value="todas">Todos los módulos</option>
                <option value="oficio">Oficios</option>
                <option value="usuario">Usuarios</option>
                <option value="departamento">Departamentos</option>
                <option value="sistema">Sistema</option>
              </select>

              <span className="text-xs text-texto-secundario whitespace-nowrap pl-2">
                {registrosFiltrados.length} evento{registrosFiltrados.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-16 text-texto-secundario">
            <Loader2 className="w-8 h-8 animate-spin text-guinda mb-3" />
            <span className="text-sm font-medium">Cargando bitácora de auditoría...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <ShieldCheck size={36} className="text-red-400" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={recargar}>
              Reintentar carga
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columnas}
            rows={registrosFiltrados}
            emptyMessage={
              busqueda || filtroEntidad !== "todas"
                ? "No se encontraron eventos con los filtros aplicados."
                : "No hay movimientos registrados en la bitácora todavía."
            }
          />
        )}
      </Card>

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
