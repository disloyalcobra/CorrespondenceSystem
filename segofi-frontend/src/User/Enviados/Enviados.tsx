import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Send, Building2, Loader2 } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import DataTable, { type Column } from "../../components/DataTable";
import StatusBadge, { type EstadoOficio } from "../../components/StatusBadge";
import { type Oficio } from "../../Data/oficio";
import { TIPOS_DOCUMENTO } from "../../Data/tiposDocumento";
import { useCatalogos } from "../../services/useCatalogos";
import { useOficios } from "../../services/useOficios";

const ESTADO_MAP: Record<number, EstadoOficio> = {
  1: "Pendiente",
  2: "Turnado",
  3: "En proceso",
  4: "Respondido",
  5: "Concluido",
  6: "Vencido",
  7: "Enviado",
};

/** Estado "Enviado" del catálogo del backend (7). */
const ESTADO_ENVIADO = 7;

export default function Enviados() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const { catalogos } = useCatalogos();
  const { oficios, cargando } = useOficios({ pageSize: 100 });

  const nombreDepartamento = (id: number) =>
    catalogos.departamentos.find((d) => d.id === id)?.nombre || "Desconocido";

  const enviados = useMemo(
    () => oficios.filter((oficio) => oficio.estado_id === ESTADO_ENVIADO),
    [oficios]
  );
  const consulta = busqueda.trim().toLocaleLowerCase("es-MX");
  const filas = enviados.filter((oficio) => {
    const depto = nombreDepartamento(oficio.departamento_destino_inicial_id);
    return `${oficio.folio} ${oficio.asunto} ${depto}`
      .toLocaleLowerCase("es-MX")
      .includes(consulta);
  });
  const columnas: Column<Oficio>[] = [
    { 
      header: "Folio de salida", 
      render: (o) => (
        <span className="font-bold text-guinda-dark text-[13.5px]">
          {o.folio ?? "—"}
        </span>
      )
    },
    { 
      header: "Folio Origen", 
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
      }
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
        const depto = nombreDepartamento(o.departamento_destino_inicial_id);
        return (
          <div className="flex items-center gap-1.5 font-semibold text-texto-dark text-[12.5px]">
            <Building2 size={13} className="text-dorado shrink-0" />
            <span className="line-clamp-2">{depto}</span>
          </div>
        )
      } 
    },
    {
      header: "Registrado",
      render: (o) => (
        <span className="text-[13px] text-slate-600 whitespace-nowrap">
          {o.creado_en.split("T")[0]}
        </span>
      )
    },
    { header: "Estado", render: (o) => <StatusBadge estado={ESTADO_MAP[o.estado_id] || "Enviado"} /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={Send}
        title="Enviados"
        description="Registro de documentos oficializados y en modo de consulta."
      />
      <Card>
        <div className="max-w-md mb-4">
          <Input
            label="Buscar en enviados"
            icon={<Search size={18} />}
            placeholder="Folio, asunto o departamento…"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-12 text-texto-secundario">
            <Loader2 className="w-8 h-8 animate-spin text-guinda mb-2" />
            <span className="text-sm">Cargando oficios enviados...</span>
          </div>
        ) : (
          <DataTable
            columns={columnas}
            rows={filas}
            onView={(oficio) => navigate(`/ver-oficios/detalle?oficio=${encodeURIComponent(oficio.folio)}`)}
            emptyMessage="No hay oficios enviados disponibles para tu alcance."
          />
        )}
      </Card>
    </div>
  );
}
