import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Search,
  ListChecks,
  SearchX,
  Send,
  UserRound,
} from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import DocumentPreviewModal from "../../components/DocumentPreviewModal";
import {
  type Oficio,
  type EventoSeguimiento,
} from "../../Data/oficio";
import { useOficios } from "../../Data/oficiosStore";
import { useAuth } from "../../Guards/useAuth";
import { oficiosVisibles, tieneAccesoTotal } from "../../Guards/alcance";
import { DEPARTAMENTOS_DEMO } from "../../Data/departamentos";

const ESTADO_MAP: Record<number, any> = {
  1: "Recibido",
  2: "En seguimiento",
  3: "Turnado",
  4: "Respondido",
  5: "Cerrado",
  6: "Enviado",
};

function ahora(): string {
  return new Date().toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

interface SeguimientoProps {
  oficioSeleccionado?: Oficio | null;
  onCerrar?: () => void;
}

export default function Seguimiento({ oficioSeleccionado = null, onCerrar }: SeguimientoProps) {
  const { usuario } = useAuth();
  const oficiosStore = useOficios();
  const alcance = oficiosVisibles(usuario, oficiosStore);
  const [numeroBuscado, setNumeroBuscado] = useState(oficioSeleccionado?.folio ?? "");
  const [seleccionado, setSeleccionado] = useState<Oficio | null>(oficioSeleccionado);
  const [buscado, setBuscado] = useState(Boolean(oficioSeleccionado));
  const [nuevaObservacion, setNuevaObservacion] = useState("");
  const [lecturaConfirmada, setLecturaConfirmada] = useState(false);
  const [eventosExtra, setEventosExtra] = useState<EventoSeguimiento[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  const [vistaDocumento, setVistaDocumento] = useState(false);
  
  const deptoName = DEPARTAMENTOS_DEMO.find(d => d.id === usuario?.departamento_id)?.nombre || "tu departamento";

  const ejecutarBusqueda = (numero: string) => {
    const encontrado =
      alcance.find(
        (o) => o.folio.toLowerCase() === numero.trim().toLowerCase(),
      ) ?? null;
    setNumeroBuscado(numero);
    setSeleccionado(encontrado);
    setLecturaConfirmada(false);
    setEventosExtra([]);
    setBuscado(true);
  };

  const agregarEvento = (accion: string) => {
    setEventosExtra((prev) => [
      ...prev,
      { id: Date.now(), oficio_id: seleccionado?.id ?? 0, usuario_id: usuario?.id ?? 0, tipo: "Seguimiento", contenido: accion, creado_en: ahora() },
    ]);
  };

  const timeline = seleccionado
    ? [...(seleccionado.seguimiento ?? []), ...eventosExtra]
    : [];

  const archivo = seleccionado?.adjuntos?.[0]?.nombre_archivo ?? "Sin archivo";
  const estadoStr = seleccionado ? (ESTADO_MAP[seleccionado.estado_id] || "Desconocido") : "";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={ListChecks}
        title="Seguimiento"
        description={
          oficioSeleccionado
            ? `Historial y acciones del documento ${oficioSeleccionado.folio}`
            : tieneAccesoTotal(usuario)
              ? "Busca un oficio por su número y revisa todo lo que se ha hecho con él"
              : `Solo puedes buscar oficios de ${deptoName} o turnados a ti`
        }
      />

      {!oficioSeleccionado && <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ejecutarBusqueda(numeroBuscado);
          }}
          className="flex flex-col sm:flex-row sm:items-end gap-3"
        >
          <div className="flex-1">
            <Input
              label="Número de oficio"
              icon={<Search size={18} />}
              placeholder="Ej. OF-0142/2026"
              value={numeroBuscado}
              onChange={(e) => setNumeroBuscado(e.target.value)}
            />
          </div>
          <Button type="submit" icon={<Search size={18} />}>
            Buscar
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-texto-secundario">Prueba con:</span>
          {alcance.slice(0, 4).map((o) => (
            <button
              key={o.folio}
              type="button"
              onClick={() => ejecutarBusqueda(o.folio)}
              className="rounded-full border border-borde bg-white px-3 py-1 text-xs font-medium text-texto-secundario shadow-sm hover:border-guinda hover:text-guinda hover:-translate-y-px transition-all"
            >
              {o.folio}
            </button>
          ))}
        </div>
      </Card>}

      {!buscado && (
        <Card>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="h-20 w-20 rounded-full border-2 border-dashed border-guinda/30 bg-guinda/5 text-guinda flex items-center justify-center animate-pulse">
              <Search size={30} />
            </span>
            <p className="text-sm text-texto-secundario max-w-xs">
              Ingresa un número de oficio y presiona “Buscar” para ver su
              seguimiento completo.
            </p>
          </div>
        </Card>
      )}

      {buscado && !seleccionado && (
        <Card>
          <div className="flex flex-col items-center gap-3 py-8 text-center animate-in fade-in duration-200">
            <span className="h-20 w-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <SearchX size={30} />
            </span>
            <p className="text-sm text-texto-secundario">
              No se encontró ningún oficio con el número “{numeroBuscado}”.
            </p>
          </div>
        </Card>
      )}

      {seleccionado && (
        <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-xl bg-guinda/10 text-guinda flex items-center justify-center">
                  <FileText size={22} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-guinda">
                    {seleccionado.folio}
                  </h2>
                  <p className="text-sm text-texto-secundario">
                    {seleccionado.asunto} · {archivo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge estado={estadoStr} />
                <Button
                  variant="outline"
                  icon={<FileText size={17} />}
                  onClick={() => setVistaDocumento(true)}
                >
                  Ver documento
                </Button>
                <Button
                  icon={<CheckCircle2 size={18} />}
                  variant={lecturaConfirmada ? "outline" : "secondary"}
                  disabled={lecturaConfirmada}
                  onClick={() => {
                    setLecturaConfirmada(true);
                    agregarEvento("Confirmó la lectura del documento");
                    setAviso("Lectura confirmada");
                  }}
                >
                  {lecturaConfirmada
                    ? "Lectura confirmada"
                    : "Confirmar lectura"}
                </Button>
              </div>
            </div>
          </Card>

          {onCerrar && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={onCerrar}>Cerrar seguimiento</Button>
            </div>
          )}

          <Card title="Historial de seguimiento">
            <ol className="relative border-s-2 border-guinda/20 ms-3">
              {timeline.map((ev, i) => (
                <li
                  key={i}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="mb-7 ms-7 last:mb-0 animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both"
                >
                  <span className="absolute -start-[17px] h-8 w-8 rounded-full bg-guinda text-white ring-4 ring-white flex items-center justify-center shadow-sm">
                    <UserRound size={14} />
                  </span>
                  <div className="rounded-xl border border-borde bg-fondo/20 px-4 py-3 hover:shadow-md hover:bg-white transition-all">
                    <p className="text-sm font-semibold text-texto">
                      Usuario ID: {ev.usuario_id}
                    </p>
                    <p className="text-sm text-texto-secundario">{ev.contenido}</p>
                    <p className="text-xs text-texto-secundario mt-1">
                      {ev.creado_en}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-col gap-2 mt-6 pt-5 border-t border-borde">
              <label className="text-sm font-medium text-texto">
                Agregar observación
              </label>
              <textarea
                rows={3}
                value={nuevaObservacion}
                onChange={(e) => setNuevaObservacion(e.target.value)}
                placeholder="Escribe un comentario de seguimiento…"
                className="w-full rounded-lg border border-borde bg-white px-4 py-3 text-base shadow-sm transition-all
                  hover:border-guinda/40 focus:outline-none focus:ring-2 focus:ring-guinda/40 focus:border-guinda focus:shadow-md"
              />
              <div className="flex justify-end">
                <Button
                  icon={<Send size={16} />}
                  disabled={!nuevaObservacion.trim()}
                  onClick={() => {
                    agregarEvento(
                      `Agregó una observación: “${nuevaObservacion.trim()}”`,
                    );
                    setNuevaObservacion("");
                    setAviso("Observación agregada");
                  }}
                >
                  Agregar
                </Button>
              </div>
            </div>
          </Card>

          {vistaDocumento && (
            <DocumentPreviewModal
              open
              numero={seleccionado.folio}
              asunto={seleccionado.asunto}
              archivo={archivo}
              onClose={() => setVistaDocumento(false)}
            />
          )}
        </div>
      )}

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
