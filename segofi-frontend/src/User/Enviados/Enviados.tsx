import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Send } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import DataTable, { type Column } from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import { type Oficio } from "../../Data/oficio";
import { useOficios } from "../../Data/oficiosStore";
import { useAuth } from "../../Guards/useAuth";
import { oficiosVisibles } from "../../Guards/alcance";
import { TIPOS_DOCUMENTO } from "../../Data/tiposDocumento";
import { Building2 } from "lucide-react";

export default function Enviados() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const oficios = useOficios();
  const [busqueda, setBusqueda] = useState("");
  const enviados = useMemo(
    () => oficiosVisibles(usuario, oficios).filter((oficio) => oficio.estado === "Enviado"),
    [usuario, oficios],
  );
  const consulta = busqueda.trim().toLocaleLowerCase("es-MX");
  const filas = enviados.filter((oficio) =>
    `${oficio.numero} ${oficio.folioSalida ?? ""} ${oficio.asunto} ${oficio.departamento}`.toLocaleLowerCase("es-MX").includes(consulta),
  );
  const columnas: Column<Oficio>[] = [
    { 
      header: "Folio de salida", 
      render: (o) => (
        <span className="font-bold text-guinda-dark text-[13.5px]">
          {o.folioSalida ?? "—"}
        </span>
      )
    },
    { 
      header: "Folio Origen", 
      render: (o) => {
        const isUrgente = o.asunto.toLowerCase().includes("urgente") || o.seguimiento.some(s => s.accion.toLowerCase().includes("urgente"));
        return (
          <div className="flex flex-col gap-1.5 items-start">
            <span className="font-bold text-guinda-dark text-[13.5px]">
              {o.numero}
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
            Dest: {o.destinatariosPersonas?.join(", ") || o.departamento}
          </span>
        </div>
      ) 
    },
    {
      header: "Tipo",
      render: (o) => {
        const tipoData = TIPOS_DOCUMENTO.find((t) => t.value === o.tipo);
        return (
          <span className="text-[12px] text-[#4B5563] bg-[#F1F5F9] px-2 py-1 rounded-md font-medium">
            {tipoData?.label || "Oficio"}
          </span>
        );
      },
    },
    { 
      header: "Área Destino", 
      render: (o) => (
        <div className="flex items-center gap-1.5 font-semibold text-texto-dark text-[12.5px]">
          <Building2 size={13} className="text-dorado shrink-0" />
          <span className="line-clamp-2">{o.departamento}</span>
        </div>
      ) 
    },
    { 
      header: "Enviado", 
      render: (o) => (
        <span className="text-[13px] text-slate-600 whitespace-nowrap">
          {(o.fechaEnvio ?? o.fecha).split(" ")[0]}
        </span>
      ) 
    },
    { header: "Estado", render: (o) => <StatusBadge estado={o.estado} /> },
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
        <DataTable
          columns={columnas}
          rows={filas}
          onView={(oficio) => navigate(`/ver-oficios/detalle?oficio=${encodeURIComponent(oficio.numero)}`)}
          emptyMessage="No hay oficios enviados disponibles para tu alcance."
        />
      </Card>
    </div>
  );
}
