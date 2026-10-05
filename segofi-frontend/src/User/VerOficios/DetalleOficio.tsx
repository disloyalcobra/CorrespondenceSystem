import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Eye, FileCheck2, FileText, History, MessageSquarePlus, Paperclip, Send, ShieldCheck } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import StatusBadge from "../../components/StatusBadge";
import DocumentPreviewModal from "../../components/DocumentPreviewModal";
import { DEPARTAMENTOS_DEMO } from "../../Data/departamentos";
import { emitirRespuesta, enviarOficio, turnarOficio, agregarNota, useOficios } from "../../Data/oficiosStore";
import { puedeVerOficio } from "../../Guards/alcance";
import { useAuth } from "../../Guards/useAuth";
import { exportarFichaOficioPdf, exportarSeguimientoPdf, exportarSeguimientoExcel } from "../../Data/exportUtils";
import { FileSpreadsheet, FileDown } from "lucide-react";

type Pestaña = "ficha" | "timeline" | "adjuntos";
type Accion = "turnar" | "nota" | "respuesta" | null;
const ROLES_DIRECCION: number[] = [2, 3]; // Administrador, Directora
const ROLES_DEPARTAMENTO: number[] = [2, 4]; // Administrador, JefeDepartamento

const ESTADO_MAP: Record<number, any> = {
  1: "Recibido",
  2: "En seguimiento",
  3: "Turnado",
  4: "Respondido",
  5: "Cerrado",
  6: "Enviado",
};

export default function DetalleOficio() {
  const [parametros] = useSearchParams();
  const folio = parametros.get("oficio") ?? "";
  const oficios = useOficios();
  const oficio = useMemo(() => oficios.find((item) => item.folio === folio), [oficios, folio]);
  const { usuario } = useAuth();
  const [pestana, setPestana] = useState<Pestaña>("ficha");
  const [accion, setAccion] = useState<Accion>(null);
  const [departamentoId, setDepartamentoId] = useState(String(DEPARTAMENTOS_DEMO[0]?.id ?? ""));
  const [texto, setTexto] = useState("");
  const [archivoRespuesta, setArchivoRespuesta] = useState<File | null>(null);
  const [aviso, setAviso] = useState("");
  const [adjuntoAbierto, setAdjuntoAbierto] = useState(false);

  if (!oficio || !puedeVerOficio(usuario, oficio)) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader icon={FileText} title="Oficio no disponible" description="No existe o no tienes permiso para consultar este documento." />
        <Link to="/ver-oficios" className="text-guinda underline">Volver a Ver oficios</Link>
      </div>
    );
  }

  const esEnviado = oficio.estado_id === 6;
  const puedeTurnar = Boolean(usuario && ROLES_DIRECCION.includes(usuario.rol_id) && !esEnviado);
  const puedeGestionarDepartamento = Boolean(usuario && ROLES_DEPARTAMENTO.includes(usuario.rol_id) && !esEnviado);
  const puedeEnviar = Boolean(usuario && ROLES_DIRECCION.includes(usuario.rol_id) && !esEnviado);

  const departamentoNombre = DEPARTAMENTOS_DEMO.find(d => d.id === oficio.departamento_destino_inicial_id)?.nombre ?? "Desconocido";
  const estadoNombre = ESTADO_MAP[oficio.estado_id] || "Recibido";

  const descargarFicha = () => {
    exportarFichaOficioPdf(oficio);
  };

  const ejecutarAccion = () => {
    if (!usuario || !texto.trim()) return;
    try {
      if (accion === "turnar") turnarOficio(oficio.folio, departamentoId, texto.trim(), usuario.nombre);
      if (accion === "nota") agregarNota(oficio.folio, texto.trim(), usuario.nombre);
      if (accion === "respuesta") emitirRespuesta(oficio.folio, texto.trim(), usuario.nombre, archivoRespuesta);
      setAviso(accion === "turnar" ? `Oficio turnado.` : accion === "nota" ? "Nota agregada al historial." : "Respuesta formal emitida.");
      setTexto("");
      setArchivoRespuesta(null);
      setAccion(null);
    } catch (error) {
      setAviso(error instanceof Error ? error.message : "No fue posible completar la acción.");
    }
  };

  const confirmarEnvio = () => {
    if (!usuario || !window.confirm(`¿Enviar ${oficio.folio}? Se generará un folio de salida y quedará en solo lectura.`)) return;
    try {
      const folioSalida = enviarOficio(oficio.folio, usuario.nombre);
      setAviso(`Oficio enviado con folio ${folioSalida}.`);
    } catch (error) {
      setAviso(error instanceof Error ? error.message : "No fue posible enviar el oficio.");
    }
  };

  const pestañas: { id: Pestaña; etiqueta: string; icono: typeof FileText }[] = [
    { id: "ficha", etiqueta: "Ficha del oficio", icono: FileText },
    { id: "timeline", etiqueta: "Línea de tiempo", icono: History },
    { id: "adjuntos", etiqueta: "Adjuntos", icono: Paperclip },
  ];

  const archivoPrincipal = oficio.adjuntos?.[0]?.nombre_archivo ?? "Sin archivo adjunto";

  return (
    <div className="flex flex-col gap-5">
      <Link to="/ver-oficios" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-guinda hover:underline"><ArrowLeft size={17} /> Volver a Ver oficios</Link>
      <PageHeader
        icon={FileText}
        title={oficio.folio}
        description={oficio.asunto}
        action={<StatusBadge estado={estadoNombre} />}
      />
      <nav className="flex flex-wrap gap-2 border-b border-borde pb-3" aria-label="Secciones del oficio">
        {pestañas.map(({ id, etiqueta, icono: Icono }) => (
          <button key={id} type="button" onClick={() => setPestana(id)} aria-current={pestana === id ? "page" : undefined}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${pestana === id ? "bg-guinda text-white" : "bg-white text-texto hover:bg-guinda/5"}`}>
            <Icono size={17} />{etiqueta}{id === "timeline" ? ` (${oficio.seguimiento?.length || 0})` : id === "adjuntos" ? ` (${oficio.adjuntos?.length ?? 0})` : ""}
          </button>
        ))}
      </nav>

      {pestana === "ficha" && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borde pb-4">
            <div><p className="text-xs font-bold uppercase tracking-wider text-dorado">Secretaría de Desarrollo Turístico</p><h2 className="mt-1 text-xl font-bold text-guinda">Ficha del oficio</h2></div>
            <Button variant="light" icon={<Download size={17} />} onClick={descargarFicha}>Descargar ficha</Button>
          </div>
          <dl className="grid gap-5 py-5 sm:grid-cols-2">
            <div><dt className="text-xs font-semibold uppercase text-texto-secundario">Número de oficio</dt><dd className="mt-1 font-semibold">{oficio.folio}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-texto-secundario">Estado</dt><dd className="mt-1"><StatusBadge estado={estadoNombre} /></dd></div>
            <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase text-texto-secundario">Asunto</dt><dd className="mt-1">{oficio.asunto}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-texto-secundario">Departamento</dt><dd className="mt-1">{departamentoNombre}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-texto-secundario">Fecha de registro</dt><dd className="mt-1">{oficio.fecha_recepcion}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-texto-secundario">Documento</dt><dd className="mt-1">{archivoPrincipal}</dd></div>
          </dl>
          {esEnviado && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><ShieldCheck className="mr-2 inline" size={17} />Oficio enviado: ficha histórica de solo lectura.</p>}
        </Card>
      )}

      {pestana === "timeline" && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borde pb-4 mb-4">
            <h2 className="text-xl font-bold text-guinda">Línea de tiempo del oficio</h2>
            <div className="flex gap-2">
              <Button variant="outline" icon={<FileDown size={17} />} onClick={() => exportarSeguimientoPdf(oficio)}>Exportar PDF</Button>
              <Button variant="outline" icon={<FileSpreadsheet size={17} />} onClick={() => exportarSeguimientoExcel(oficio)}>Exportar Excel</Button>
            </div>
          </div>
          {oficio.seguimiento && oficio.seguimiento.length > 0 ? <ol className="relative ml-3 border-s-2 border-guinda/20">
            {oficio.seguimiento.map((evento, index) => <li key={`${evento.creado_en}-${index}`} className="relative mb-6 ms-7 last:mb-0">
              <span className="absolute -start-[17px] flex h-8 w-8 items-center justify-center rounded-full bg-guinda text-white ring-4 ring-white"><History size={14} /></span>
              <div className="rounded-xl border border-borde bg-white p-4"><p className="font-semibold">{evento.contenido}</p><p className="mt-1 text-sm text-texto-secundario">Usuario ID: {evento.usuario_id} · {evento.creado_en}</p></div>
            </li>)}
          </ol> : <p className="text-sm text-texto-secundario">No hay eventos de seguimiento.</p>}
        </Card>
      )}

      {pestana === "adjuntos" && (
        <Card title="Archivos adjuntos">
          {(oficio.adjuntos ?? []).map((adjunto, index) => (
            <div key={`${adjunto.nombre_archivo}-${index}`} className="mb-3 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-borde bg-white p-4 last:mb-0">
              <div className="flex items-center gap-3"><span className="rounded-lg bg-guinda/10 p-3 text-guinda"><FileText size={20} /></span><div><p className="font-semibold">{adjunto.nombre_archivo}</p><p className="text-xs text-texto-secundario">Agregado {adjunto.creado_en}</p></div></div>
              <div className="flex gap-2">
                <Button variant="outline" icon={<Eye size={17} />} onClick={() => { if (adjunto.archivo_url) window.open(adjunto.archivo_url, "_blank", "noopener,noreferrer"); else setAdjuntoAbierto(true); }}>Ver referencia</Button>
                {adjunto.archivo_url && <a className="inline-flex h-12 items-center gap-2 rounded-lg border border-guinda px-4 font-medium text-guinda" href={adjunto.archivo_url} download={adjunto.nombre_archivo}><Download size={17} />Descargar</a>}
              </div>
            </div>
          ))}
          {(!oficio.adjuntos || oficio.adjuntos.length === 0) && <p className="mt-3 text-xs text-texto-secundario">No hay archivos adjuntos.</p>}
        </Card>
      )}

      {!esEnviado && (puedeTurnar || puedeGestionarDepartamento || puedeEnviar) && (
        <Card title="Acciones del oficio">
          <div className="flex flex-wrap gap-2">
            {puedeTurnar && <Button variant="outline" icon={<Send size={17} />} onClick={() => { setAccion(accion === "turnar" ? null : "turnar"); setTexto(""); }}>Turnar oficio</Button>}
            {puedeGestionarDepartamento && <Button variant="outline" icon={<MessageSquarePlus size={17} />} onClick={() => { setAccion(accion === "nota" ? null : "nota"); setTexto(""); }}>Agregar nota</Button>}
            {puedeGestionarDepartamento && <Button variant="outline" icon={<FileCheck2 size={17} />} onClick={() => { setAccion(accion === "respuesta" ? null : "respuesta"); setTexto(""); }}>Emitir respuesta</Button>}
            {puedeEnviar && <Button icon={<Send size={17} />} onClick={confirmarEnvio}>Enviar oficio</Button>}
          </div>
          {accion && <form className="mt-5 flex flex-col gap-3 border-t border-borde pt-5" onSubmit={(event) => { event.preventDefault(); ejecutarAccion(); }}>
            <h3 className="font-semibold text-guinda">{accion === "turnar" ? "Turnar oficio" : accion === "nota" ? "Agregar nota al seguimiento" : "Emitir respuesta formal"}</h3>
            {accion === "turnar" && <Select label="Departamento destino" value={departamentoId} onChange={(event) => setDepartamentoId(event.target.value)} options={DEPARTAMENTOS_DEMO.map((item) => ({ value: String(item.id), label: item.nombre }))} />}
            <Input label={accion === "turnar" ? "Instrucciones" : accion === "nota" ? "Nota" : "Respuesta"} value={texto} onChange={(event) => setTexto(event.target.value)} required />
            {accion === "respuesta" && <label className="flex flex-col gap-1.5 text-sm font-medium text-texto">Adjuntar archivo de respuesta (opcional)<input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setArchivoRespuesta(event.target.files?.[0] ?? null)} className="rounded-lg border border-borde bg-white p-3" /></label>}
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setAccion(null)}>Cancelar</Button><Button type="submit" disabled={!texto.trim()}>{accion === "turnar" ? "Confirmar turno" : accion === "nota" ? "Guardar nota" : "Guardar respuesta"}</Button></div>
          </form>}
        </Card>
      )}
      {aviso && <p role="status" className="rounded-lg bg-guinda/5 p-3 text-sm text-guinda">{aviso}</p>}
      <DocumentPreviewModal open={adjuntoAbierto} numero={oficio.folio} asunto={oficio.asunto} archivo={archivoPrincipal} onClose={() => setAdjuntoAbierto(false)} />
    </div>
  );
}
