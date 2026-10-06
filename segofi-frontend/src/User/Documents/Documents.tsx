import { useState, type ReactNode } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, MapPin, Save, UploadCloud } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Toast from "../../components/Toast";
import FileUploadField from "../../components/FileUploadField";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import { TIPOS_DOCUMENTO } from "../../Data/tiposDocumento";
import { DEPARTAMENTOS_DEMO } from "../../Data/departamentos";
import { PERSONAS_DEMO } from "../../Data/personas";
import { useAuth } from "../../Guards/useAuth";

const ETIQUETA_ROL: Record<number, string> = {
  1: "Usuario",
  2: "Administrador",
  3: "Directora",
  4: "Jefe de departamento",
};

const DEPARTAMENTOS_OPTS = DEPARTAMENTOS_DEMO.map((d) => ({
  value: String(d.id),
  label: d.nombre,
}));

const PRIORIDAD_OPTS = [
  { value: "Normal", label: "Normal" },
  { value: "Urgente", label: "Urgente" },
  { value: "Extraurgente", label: "Extraurgente" },
];

function SectionTitle({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 border-b border-borde pb-3">
      <Icon size={18} className="text-guinda" />
      <h3 className="font-bold text-guinda text-sm uppercase tracking-wide">{title}</h3>
    </div>
  );
}

export default function Documents() {
  const { tipo } = useParams<{ tipo: string }>();
  const tipoDoc = TIPOS_DOCUMENTO.find((t) => t.value === tipo);
  const { usuario } = useAuth();

  const [departamentoDestino, setDepartamentoDestino] = useState("");
  const [personasDestinoIds, setPersonasDestinoIds] = useState<string[]>([]);
  const [prioridad, setPrioridad] = useState("Normal");
  const [aviso, setAviso] = useState<string | null>(null);

  const PERSONAS_ACTIVAS = PERSONAS_DEMO.filter((p) => p.departamento_id);

  // Generar folio aleatorio simulado al cargar
  const [folioGenerado] = useState(() => {
    const year = new Date().getFullYear();
    const consecutivo = String(Math.floor(Math.random() * 1000)).padStart(4, "0");
    return `SECTUR/DGT/${year}/${consecutivo}`;
  });

  if (!tipoDoc) return <Navigate to="/crear-oficio" replace />;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={tipoDoc.icon}
        title={`Nuevo ${tipoDoc.label.toLowerCase()}`}
        description="Completa los datos para registrar un nuevo documento"
        action={
          <Link
            to="/crear-oficio"
            className="flex items-center gap-2 rounded-lg border border-white/60 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            Cambiar tipo
          </Link>
        }
      />

      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start"
        onSubmit={(e) => {
          e.preventDefault();
          setAviso("Documento guardado correctamente");
        }}
      >
        {/* Columna Izquierda: Datos Generales */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card bodyClassName="p-6">
            <SectionTitle icon={FileText} title="Datos Generales del Oficio" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col gap-1">
                <Input
                  label="Folio institucional (automático)"
                  value={folioGenerado}
                  disabled
                  readOnly
                />
                <span className="text-[11px] text-texto-secundario mt-1">Folio oficial consecutivo generado automáticamente.</span>
              </div>
              <Select
                label="Tipo de documento (obligatorio)"
                options={TIPOS_DOCUMENTO}
                value={tipoDoc.value}
                disabled
              />
            </div>

            <div className="mb-5">
              <Input
                label="Asunto (obligatorio)"
                placeholder="Ej.: solicitud de apoyo para el Tianguis Turístico 2026..."
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-sm font-bold text-texto">
                Descripción del oficio
              </label>
              <textarea
                rows={4}
                placeholder="Describe los antecedentes o la solicitud del oficio..."
                className="w-full rounded-lg border border-borde bg-white px-4 py-3 text-sm shadow-sm transition-all
                  hover:border-guinda/40 focus:outline-none focus:ring-2 focus:ring-guinda/40 focus:border-guinda focus:shadow-md"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-texto mb-2 block">
                Documento escaneado y anexos (PDF)
              </label>
              <div className="border-2 border-dashed border-borde rounded-xl p-8 bg-fondo/30 flex flex-col items-center justify-center text-center transition-colors hover:bg-fondo/50 hover:border-guinda/30">
                <div className="h-12 w-12 rounded-full bg-guinda/10 text-guinda flex items-center justify-center mb-3">
                  <UploadCloud size={24} />
                </div>
                <h4 className="text-sm font-bold text-texto mb-1">Arrastra y suelta tus archivos aquí</h4>
                <p className="text-xs text-texto-secundario mb-4">Soporta documentos PDF, DOCX o imágenes escaneadas de hasta 25 MB</p>
                <Button type="button" variant="outline" className="text-guinda border-guinda/20 bg-white hover:bg-guinda/5">
                  Seleccionar desde el equipo
                </Button>
              </div>
              <p className="text-xs font-bold text-guinda mt-3">Archivos listos para adjuntar (0):</p>
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Enrutamiento y Fechas */}
        <div className="flex flex-col gap-5">
          <Card bodyClassName="p-5">
            <SectionTitle icon={MapPin} title="Remitente y Destinatario" />
            <div className="flex flex-col gap-5">
              
              <div>
                <span className="text-sm font-medium text-texto mb-2 block">Remitente</span>
                <div className="flex items-center gap-3 rounded-lg border border-borde bg-white px-4 py-3 shadow-sm">
                  {usuario && <Avatar nombre={usuario.nombre} size={40} />}
                  <div>
                    <p className="text-sm font-medium text-texto">{usuario?.nombre}</p>
                    <p className="text-xs text-texto-secundario">
                      {usuario?.rol_id ? ETIQUETA_ROL[usuario.rol_id] : ""} · {DEPARTAMENTOS_DEMO.find(d => d.id === usuario?.departamento_id)?.nombre}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Select
                  label="Departamento destino (obligatorio)"
                  options={DEPARTAMENTOS_OPTS}
                  placeholder="Selecciona el departamento"
                  value={departamentoDestino}
                  onChange={(e) => {
                    setDepartamentoDestino(e.target.value);
                    setPersonasDestinoIds([]); // Limpiar personas si cambia el dep
                  }}
                  required
                />
                <span className="text-[11px] text-texto-secundario mt-1">Define qué área recibirá y dará curso al documento.</span>
              </div>

              {departamentoDestino && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-texto">Personas a turnar (Opcional)</span>
                  <div className="rounded-lg border border-borde bg-white max-h-48 overflow-y-auto divide-y divide-borde shadow-sm">
                    {PERSONAS_ACTIVAS.filter(p => String(p.departamento_id) === departamentoDestino).map((p) => {
                      const marcado = personasDestinoIds.includes(String(p.id));
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
                            marcado ? "bg-guinda/5" : "hover:bg-fondo/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={marcado}
                            onChange={() => {
                              setPersonasDestinoIds((prev) =>
                                prev.includes(String(p.id))
                                  ? prev.filter((x) => x !== String(p.id))
                                  : [...prev, String(p.id)]
                              );
                            }}
                            className="h-4 w-4 accent-guinda"
                          />
                          <Avatar nombre={p.nombre} size={28} />
                          <p className="text-sm text-texto">{p.nombre}</p>
                        </label>
                      );
                    })}
                    {PERSONAS_ACTIVAS.filter(p => String(p.departamento_id) === departamentoDestino).length === 0 && (
                      <div className="px-4 py-3 text-xs text-texto-secundario text-center">
                        No hay personas registradas en este departamento.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Select
                label="Prioridad del trámite"
                options={PRIORIDAD_OPTS}
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
                required
              />
            </div>
          </Card>

          <Card bodyClassName="p-5">
            <SectionTitle icon={Calendar} title="Fechas y Término" />
            <div className="flex flex-col gap-5">
              <Input label="Fecha del documento" type="date" required />
              
              <div className="flex flex-col gap-1">
                <Input label="Fecha de término (obligatorio)" type="date" required />
                <span className="text-[11px] text-texto-secundario mt-1">Fecha perentoria para respuesta o resolución.</span>
              </div>
            </div>
          </Card>

          <Card bodyClassName="p-5 bg-guinda/5 border-guinda/20">
            <p className="text-sm text-guinda-dark font-medium mb-4">
              Al guardar, el oficio quedará disponible para revisión y seguimiento.
            </p>
            <Button type="submit" className="w-full justify-center" icon={<Save size={18} />}>
              Guardar oficio
            </Button>
          </Card>
        </div>
      </form>

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
