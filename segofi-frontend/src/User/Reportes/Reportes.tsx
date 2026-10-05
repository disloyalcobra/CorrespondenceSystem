import { useMemo, useState } from "react";
import {
  FileDown,
  FileSpreadsheet,
  FileStack,
  Clock3,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  CalendarRange,
  Building2,
} from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import DataTable, { type Column } from "../../components/DataTable";
import { useOficios } from "../../Data/oficiosStore";
import {
  evaluarOficio,
  formatoFecha,
  etiquetaTipo,
  ETIQUETA_CUMPLIMIENTO,
  type EvaluacionOficio,
} from "../../Data/analisisOficios";
import { exportarReporteExcel, exportarReportePdf } from "../../Data/exportUtils";

type Periodo = "Semanal" | "Mensual" | "Anual";

function aISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const columns: Column<EvaluacionOficio>[] = [
  {
    header: "Número",
    render: (r) => {
      const isUrgente = r.oficio.asunto.toLowerCase().includes("urgente") || r.oficio.seguimiento.some(s => s.accion.toLowerCase().includes("urgente"));
      return (
        <div className="flex flex-col gap-1.5 items-start">
          <span className="font-bold text-guinda-dark text-[13.5px]">
            {r.oficio.numero}
          </span>
          {isUrgente && (
            <span className="inline-block text-[9.5px] font-extrabold bg-red-100 text-red-800 px-1.5 py-0.5 rounded uppercase tracking-wide">
              Urgente
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "Asunto",
    render: (r) => (
      <div className="flex flex-col gap-1 max-w-[240px]">
        <span className="font-semibold text-texto-dark text-[13.5px] leading-snug line-clamp-2">
          {r.oficio.asunto}
        </span>
        <span className="text-[11.5px] text-slate-500 line-clamp-1">
          {r.oficio.departamento}
        </span>
      </div>
    ),
  },
  { 
    header: "Tipo", 
    render: (r) => (
      <span className="text-[12px] text-[#4B5563] bg-[#F1F5F9] px-2 py-1 rounded-md font-medium">
        {etiquetaTipo(r.tipo)}
      </span>
    ) 
  },
  {
    header: "Área Destino",
    render: (r) => (
      <div className="flex items-center gap-1.5 font-semibold text-texto-dark text-[12.5px] max-w-[180px]">
        <Building2 size={13} className="text-dorado shrink-0" />
        <span className="line-clamp-2">{r.oficio.departamento}</span>
      </div>
    ),
  },
  { 
    header: "Recepción", 
    render: (r) => (
      <span className="text-[13px] text-slate-600 whitespace-nowrap">
        {formatoFecha(r.recepcion)}
      </span>
    ) 
  },
  { 
    header: "Término", 
    render: (r) => {
      if (!r.termino) return <span className="text-[13px] text-slate-600">—</span>;
      
      const isVencido = r.cumplimiento === "VENCIDO_PENDIENTE" || r.cumplimiento === "EXTEMPORANEO";
      const diasStr = r.tiempoRespuestaDias ? ` (${r.tiempoRespuestaDias}d)` : "";
      
      return (
        <div className="flex flex-col gap-1 text-[13px]">
          <span className={isVencido ? "text-red-600 font-bold" : "text-slate-600"}>
            {formatoFecha(r.termino)}
          </span>
          {isVencido ? (
            <span className="text-[11px] font-bold text-red-600">
              Vencido{diasStr}
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-500">
              A tiempo{diasStr}
            </span>
          )}
        </div>
      );
    } 
  },
  {
    header: "Cumplimiento",
    render: (r) => {
      let colorClass = "bg-slate-100 text-slate-700";
      if (r.cumplimiento === "EN_TIEMPO") colorClass = "bg-green-100 text-green-800";
      if (r.cumplimiento === "EXTEMPORANEO") colorClass = "bg-amber-100 text-amber-800";
      if (r.cumplimiento === "VENCIDO_PENDIENTE") colorClass = "bg-red-100 text-red-800";
      
      return (
        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
          {ETIQUETA_CUMPLIMIENTO[r.cumplimiento]}
        </span>
      );
    },
  },
];

export default function Reportes() {
  const [periodo, setPeriodo] = useState<Periodo | null>(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);

  const oficios = useOficios();

  const seleccionarPeriodo = (p: Periodo) => {
    const hoy = new Date();
    let inicio = new Date(hoy);
    if (p === "Semanal") {
      inicio.setDate(hoy.getDate() - hoy.getDay());
    } else if (p === "Mensual") {
      inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    } else {
      inicio = new Date(hoy.getFullYear(), 0, 1);
    }
    setPeriodo(p);
    setDesde(aISO(inicio));
    setHasta(aISO(hoy));
  };

  const filas = useMemo(() => {
    return oficios
      .map((o) => evaluarOficio(o))
      .filter((r) => {
        if (!desde && !hasta) return true;
        const f = r.recepcion;
        if (!f) return false;
        if (desde && f < new Date(desde + "T00:00:00")) return false;
        if (hasta && f > new Date(hasta + "T23:59:59")) return false;
        return true;
      });
  }, [oficios, desde, hasta]);

  const enTiempo = filas.filter((r) => r.cumplimiento === "EN_TIEMPO").length;
  const extemporaneos = filas.filter((r) => r.cumplimiento === "EXTEMPORANEO").length;
  const vencidos = filas.filter((r) => r.cumplimiento === "VENCIDO_PENDIENTE").length;

  const exportarExcel = async () => {
    if (filas.length === 0) {
      setAviso("No hay datos para exportar.");
      return;
    }
    await exportarReporteExcel(filas, desde, hasta);
    setAviso("Reporte Excel generado y descargado.");
  };

  const exportarPdf = () => {
    if (filas.length === 0) {
      setAviso("No hay datos para exportar.");
      return;
    }
    exportarReportePdf(filas, desde, hasta);
    setAviso("Reporte PDF generado y descargado.");
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={BarChart3}
        title="Generar reporte"
        description="Análisis de oficios, cumplimiento de términos y exportación."
        action={
          <>
            <Button
              variant="secondary"
              icon={<FileSpreadsheet size={18} />}
              onClick={exportarExcel}
            >
              Excel
            </Button>
            <Button
              variant="outlineLight"
              icon={<FileDown size={18} />}
              onClick={exportarPdf}
            >
              PDF
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total analizados"
          value={filas.length}
          icon={FileStack}
          tone="guinda"
        />
        <StatCard
          label="En tiempo"
          value={enTiempo}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Extemporáneos"
          value={extemporaneos}
          icon={Clock3}
          tone="amber"
        />
        <StatCard
          label="Vencidos"
          value={vencidos}
          icon={AlertCircle}
          tone="guinda"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <CalendarRange size={18} className="text-guinda mr-1" />
          {(["Semanal", "Mensual", "Anual"] as Periodo[]).map((p) => (
            <button
              key={p}
              onClick={() => seleccionarPeriodo(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                periodo === p
                  ? "bg-guinda text-white border-guinda shadow-sm"
                  : "bg-white text-texto-secundario border-borde hover:border-guinda hover:text-guinda"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-4 mb-5">
          <div className="w-44">
            <Input
              label="Desde"
              type="date"
              value={desde}
              onChange={(e) => {
                setPeriodo(null);
                setDesde(e.target.value);
              }}
            />
          </div>
          <div className="w-44">
            <Input
              label="Hasta"
              type="date"
              value={hasta}
              onChange={(e) => {
                setPeriodo(null);
                setHasta(e.target.value);
              }}
            />
          </div>
          {(desde || hasta) && (
            <Button
              variant="outline"
              onClick={() => {
                setPeriodo(null);
                setDesde("");
                setHasta("");
              }}
            >
              Limpiar
            </Button>
          )}
          <span className="ml-auto text-sm text-texto-secundario pb-3">
            {filas.length} registros
          </span>
        </div>

        <DataTable
          columns={columns}
          rows={filas}
          emptyMessage="No hay registros en el rango seleccionado."
        />
      </Card>

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
