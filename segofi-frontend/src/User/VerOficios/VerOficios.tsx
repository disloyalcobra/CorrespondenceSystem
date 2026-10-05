import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus2, FolderOpen, Search } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import DataTable, { type Column } from "../../components/DataTable";
import StatusBadge, { type EstadoOficio } from "../../components/StatusBadge";
import Button from "../../components/Button";
import { type Oficio } from "../../Data/oficio";
import { useOficios } from "../../Data/oficiosStore";
import { useAuth } from "../../Guards/useAuth";
import { oficiosVisibles, tieneAccesoTotal } from "../../Guards/alcance";
import { DEPARTAMENTOS_DEMO } from "../../Data/departamentos";
import { TIPOS_DOCUMENTO } from "../../Data/tiposDocumento";

import { Building2 } from "lucide-react";

const FILTROS: ("Todos" | EstadoOficio)[] = [
  "Todos",
  "Recibido",
  "Turnado",
  "En seguimiento",
  "Respondido",
  "Cerrado",
  "Enviado",
];

const ESTADO_MAP: Record<number, any> = {
  1: "Recibido",
  2: "En seguimiento",
  3: "Turnado",
  4: "Respondido",
  5: "Cerrado",
  6: "Enviado",
};

const ESTADO_INV_MAP: Record<string, number> = {
  "Recibido": 1,
  "En seguimiento": 2,
  "Turnado": 3,
  "Respondido": 4,
  "Cerrado": 5,
  "Enviado": 6,
};

const columns: Column<Oficio>[] = [
  {
    header: "Folio",
    render: (o) => {
      const isUrgente = o.asunto.toLowerCase().includes("urgente") || o.seguimiento?.some(s => s.contenido.toLowerCase().includes("urgente"));
      return (
        <div className="flex flex-col gap-1.5 items-start">
          <span className="font-bold text-guinda-dark text-[13.5px]">
            {o.folio}
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
    header: "Asunto & Objeto", 
    render: (o) => (
      <div className="flex flex-col gap-1 max-w-[280px]">
        <span className="font-semibold text-texto-dark text-[13.5px] leading-snug line-clamp-2">
          {o.asunto}
        </span>
        <span className="text-[11.5px] text-slate-500 line-clamp-1">
          Dest: {o.destinatario}
        </span>
      </div>
    ) 
  },
  {
    header: "Tipo",
    render: (o) => {
      const tipoData = TIPOS_DOCUMENTO.find((t) => t.value === String(o.tipo_documento_id));
      return (
        <span className="text-[12px] text-[#4B5563] bg-[#F1F5F9] px-2 py-1 rounded-md font-medium">
          {tipoData?.label || `Tipo ${o.tipo_documento_id}`}
        </span>
      );
    },
  },
  {
    header: "Área Destino",
    render: (o) => {
      const depto = DEPARTAMENTOS_DEMO.find(d => d.id === o.departamento_destino_inicial_id)?.nombre || "Desconocido";
      return (
        <div className="flex items-center gap-1.5 font-semibold text-texto-dark text-[12.5px]">
          <Building2 size={13} className="text-dorado shrink-0" />
          <span className="line-clamp-2">{depto}</span>
        </div>
      );
    },
  },
  { 
    header: "Recepción", 
    render: (o) => (
      <span className="text-[13px] text-slate-600 whitespace-nowrap">
        {o.fecha_recepcion.split("T")[0]}
      </span>
    ) 
  },
  { 
    header: "Término", 
    render: (o) => {
      if (!o.termino) return <span className="text-[13px] text-slate-600">—</span>;
      
      const parts = o.termino.split("-");
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const diff = Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const isVencido = diff < 0 && o.estado_id !== 5 && o.estado_id !== 4;
      
      return (
        <div className="flex flex-col gap-1 text-[13px]">
          <span className={isVencido ? "text-red-600 font-bold" : "text-slate-600"}>
            {o.termino}
          </span>
          {isVencido ? (
            <span className="text-[11px] font-bold text-red-600">
              Vencido ({Math.abs(diff)}d)
            </span>
          ) : diff <= 10 && diff >= 0 ? (
             <span className="text-[11px] font-medium text-slate-500">
              {diff}d
            </span>
          ) : null}
        </div>
      );
    } 
  },
  { header: "Estado", render: (o) => <StatusBadge estado={ESTADO_MAP[o.estado_id] || "Recibido"} /> },
];

export default function VerOficios() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("Todos");
  const [deptoFilter, setDeptoFilter] = useState("Todos");
  const [tipoFilter, setTipoFilter] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const oficios = useOficios();
  const alcance = oficiosVisibles(usuario, oficios);
  const esGlobal = tieneAccesoTotal(usuario);

  const cuenta = (f: (typeof FILTROS)[number]) =>
    f === "Todos"
      ? alcance.length
      : alcance.filter((o) => o.estado_id === ESTADO_INV_MAP[f as string]).length;

  const q = busqueda.trim().toLowerCase();
  const filas = alcance.filter((o) => {
    const depto = DEPARTAMENTOS_DEMO.find(d => d.id === o.departamento_destino_inicial_id)?.nombre || "";
    return (filtro === "Todos" || o.estado_id === ESTADO_INV_MAP[filtro as string]) &&
      (deptoFilter === "Todos" || String(o.departamento_destino_inicial_id) === deptoFilter) &&
      (tipoFilter === "Todos" || String(o.tipo_documento_id) === tipoFilter) &&
      (!q ||
        `${o.folio} ${o.asunto} ${depto}`.toLowerCase().includes(q));
  });

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={FolderOpen}
        title="Ver oficios"
        description={
          esGlobal
            ? "Consulta, filtra y revisa todos los documentos"
            : `Documentos de tu departamento o turnados a ti`
        }
        action={
          esGlobal && (
            <Button
              variant="light"
              icon={<FilePlus2 size={18} />}
              onClick={() => navigate("/crear-oficio")}
            >
              Nuevo oficio
            </Button>
          )
        }
      />

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
          <div className="flex-1 w-full">
            <Input
              label="Buscar"
              icon={<Search size={18} />}
              placeholder="Número, asunto o departamento…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-texto-secundario mb-1">
              Departamento
            </label>
            <select
              className="w-full border border-borde rounded-md px-3 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-guinda/20 focus:border-guinda"
              value={deptoFilter}
              onChange={(e) => setDeptoFilter(e.target.value)}
            >
              <option value="Todos">Todos los departamentos</option>
              {DEPARTAMENTOS_DEMO.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-texto-secundario mb-1">
              Tipo de documento
            </label>
            <select
              className="w-full border border-borde rounded-md px-3 py-[9px] text-sm focus:outline-none focus:ring-2 focus:ring-guinda/20 focus:border-guinda"
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <option value="Todos">Todos los tipos</option>
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filtro === f
                  ? "bg-guinda text-white border-guinda shadow-sm"
                  : "bg-white text-texto-secundario border-borde hover:border-guinda hover:text-guinda"
              }`}
            >
              {f}
              <span
                className={`min-w-5 rounded-full px-1.5 text-[11px] font-bold ${
                  filtro === f
                    ? "bg-white/25 text-white"
                    : "bg-guinda/10 text-guinda"
                }`}
              >
                {cuenta(f)}
              </span>
            </button>
          ))}
        </div>

        <DataTable
          columns={columns}
          rows={filas}
          onView={(oficio) => navigate(`/ver-oficios/detalle?oficio=${encodeURIComponent(oficio.folio)}`)}
          emptyMessage="Ningún oficio coincide con tu búsqueda."
        />
      </Card>

    </div>
  );
}
