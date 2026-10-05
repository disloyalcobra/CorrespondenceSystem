import { useState, type ReactNode } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Building2, X } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Avatar from "../../components/Avatar";
import Toast from "../../components/Toast";
import FileUploadField from "../../components/FileUploadField";
import Button from "../../components/Button";
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
  value: d.nombre,
  label: d.nombre,
}));

type ModoDestinatario = "departamento" | "persona";

function Seccion({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-borde bg-fondo/20 p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-7 w-7 rounded-full bg-guinda text-white text-sm font-bold flex items-center justify-center shadow-sm">
          {numero}
        </span>
        <h3 className="text-sm font-semibold text-guinda uppercase tracking-wide">
          {titulo}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </section>
  );
}

export default function Documents() {
  const { tipo } = useParams<{ tipo: string }>();
  const tipoDoc = TIPOS_DOCUMENTO.find((t) => t.value === tipo);
  const { usuario } = useAuth();

  const [modoDestinatario, setModoDestinatario] =
    useState<ModoDestinatario>("departamento");
  const [departamentoDestino, setDepartamentoDestino] = useState("");
  const [personasDestinoIds, setPersonasDestinoIds] = useState<string[]>([]);
  const [tieneTermino, setTieneTermino] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const PERSONAS_ACTIVAS = PERSONAS_DEMO.filter((p) => p.departamento_id);
  const personasSeleccionadas = PERSONAS_ACTIVAS.filter((p) =>
    personasDestinoIds.includes(String(p.id)),
  );
  const todasMarcadas = personasDestinoIds.length === PERSONAS_ACTIVAS.length;

  const togglePersona = (id: string) => {
    setPersonasDestinoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  if (!tipoDoc) return <Navigate to="/crear-oficio" replace />;

  const botonModo = (
    modo: ModoDestinatario,
    etiqueta: string,
    icono: ReactNode,
  ) => (
    <button
      type="button"
      onClick={() => setModoDestinatario(modo)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        modoDestinatario === modo
          ? "bg-guinda text-white border-guinda shadow-sm"
          : "bg-white text-texto-secundario border-borde hover:border-guinda hover:text-guinda"
      }`}
    >
      {icono}
      {etiqueta}
    </button>
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={tipoDoc.icon}
        title={`Nuevo ${tipoDoc.label.toLowerCase()}`}
        description="Completa los datos y adjunta el documento en PDF"
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

      <Card>
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setAviso("Documento guardado correctamente");
          }}
        >
          <Seccion numero={1} titulo="Datos generales">
            <Select
              label="Tipo de documento"
              options={TIPOS_DOCUMENTO}
              value={tipoDoc.value}
              disabled
            />
            <Input
              label="Número de documento"
              placeholder="Ej. OF-0143/2026"
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Asunto"
                placeholder="Asunto del documento"
                required
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-texto">
                Objeto (captura completa)
              </label>
              <textarea
                rows={4}
                placeholder="Describe el contenido del documento…"
                className="w-full rounded-lg border border-borde bg-white px-4 py-3 text-base shadow-sm transition-all
                  hover:border-guinda/40 focus:outline-none focus:ring-2 focus:ring-guinda/40 focus:border-guinda focus:shadow-md"
              />
            </div>
          </Seccion>

          <Seccion numero={2} titulo="Remitente y destinatario">
            {/* Remitente: se reconoce automáticamente de la cuenta con la que se inició sesión */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <span className="text-sm font-medium text-texto">Remitente</span>
              <div className="flex items-center gap-3 rounded-lg border border-borde bg-white px-4 py-3 shadow-sm">
                {usuario && <Avatar nombre={usuario.nombre} size={40} />}
                <div>
                  <p className="text-sm font-medium text-texto">
                    {usuario?.nombre}
                  </p>
                  <p className="text-xs text-texto-secundario">
                    {usuario?.rol_id ? ETIQUETA_ROL[usuario.rol_id] : ""} · {DEPARTAMENTOS_DEMO.find(d => d.id === usuario?.departamento_id)?.nombre}
                  </p>
                </div>
              </div>
            </div>

            {/* Dirigido a: por departamento o por una o varias personas */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <span className="text-sm font-medium text-texto">Dirigido a</span>
              <div className="flex gap-2">
                {botonModo(
                  "departamento",
                  "Departamento",
                  <Building2 size={15} />,
                )}
                {botonModo("persona", "Personas", <User size={15} />)}
              </div>

              {modoDestinatario === "departamento" ? (
                <Select
                  label="Departamento"
                  options={DEPARTAMENTOS_OPTS}
                  placeholder="Selecciona un departamento"
                  value={departamentoDestino}
                  onChange={(e) => setDepartamentoDestino(e.target.value)}
                  required
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-texto-secundario">
                      Puedes turnar el documento a varias personas a la vez (
                      {personasDestinoIds.length} seleccionadas).
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPersonasDestinoIds(
                          todasMarcadas
                            ? []
                            : PERSONAS_ACTIVAS.map((p) => String(p.id)),
                        )
                      }
                      className="text-xs font-semibold text-guinda hover:underline"
                    >
                      {todasMarcadas ? "Quitar todas" : "Seleccionar todas"}
                    </button>
                  </div>

                  {personasSeleccionadas.length > 0 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in duration-150">
                      {personasSeleccionadas.map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-2 rounded-full bg-guinda/10 text-guinda text-xs font-medium pl-1.5 pr-2 py-1 animate-in zoom-in-90 duration-150"
                        >
                          <Avatar nombre={p.nombre} size={22} />
                          {p.nombre}
                          <button
                            type="button"
                            onClick={() => togglePersona(String(p.id))}
                            className="rounded-full hover:bg-guinda/20 p-0.5 transition-colors"
                            aria-label={`Quitar a ${p.nombre}`}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="rounded-lg border border-borde bg-white max-h-56 overflow-y-auto divide-y divide-borde shadow-sm">
                    {PERSONAS_ACTIVAS.map((p) => {
                      const marcado = personasDestinoIds.includes(String(p.id));
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                            marcado ? "bg-guinda/5" : "hover:bg-fondo/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={marcado}
                            onChange={() => togglePersona(String(p.id))}
                            className="h-4 w-4 accent-guinda"
                          />
                          <Avatar nombre={p.nombre} size={32} />
                          <div>
                            <p className="text-sm text-texto">{p.nombre}</p>
                            <p className="text-xs text-texto-secundario">
                              {p.departamento_id ? DEPARTAMENTOS_DEMO.find(d => d.id === p.departamento_id)?.nombre : ""}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Seccion>

          <Seccion numero={3} titulo="Fechas y término">
            <Input label="Fecha del documento" type="date" required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Fecha de recepción" type="date" required />
              <Input label="Hora de recepción" type="time" required />
            </div>
            <Input label="Fecha de turno" type="date" />
            <Input label="Hora de turno" type="time" />

            <label className="md:col-span-2 flex items-center gap-2 text-sm text-texto cursor-pointer">
              <input
                type="checkbox"
                checked={tieneTermino}
                onChange={(e) => setTieneTermino(e.target.checked)}
                className="h-4 w-4 accent-guinda"
              />
              Este documento tiene término / plazo de atención
            </label>
            {tieneTermino && (
              <div className="md:col-span-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Input label="Fecha límite de término" type="date" required />
              </div>
            )}
          </Seccion>

          <Seccion numero={4} titulo="Documento">
            <div className="md:col-span-2">
              <FileUploadField label="Documento en PDF" />
            </div>
          </Seccion>

          <div className="flex justify-end gap-3">
            <Link
              to="/crear-oficio"
              className="inline-flex h-12 items-center rounded-lg border border-guinda px-5 font-medium text-guinda hover:bg-guinda/5 transition-colors"
            >
              Cancelar
            </Link>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Card>

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
