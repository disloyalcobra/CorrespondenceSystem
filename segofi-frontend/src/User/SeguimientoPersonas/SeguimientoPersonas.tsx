import { useEffect, useMemo, useState } from "react";
import { ChevronDown, UsersRound, Loader2 } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Avatar from "../../components/Avatar";
import { oficiosService, type PersonaSeguimiento } from "../../services/oficiosService";

export default function SeguimientoPersonas() {
  const [expandido, setExpandido] = useState<string | null>(null);
  const [personas, setPersonas] = useState<PersonaSeguimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let montado = true;
    oficiosService
      .seguimientoPorPersonas()
      .then((res) => {
        if (!montado) return;
        setPersonas(res);
        setError(null);
      })
      .catch((err) => {
        if (!montado) return;
        setError(err instanceof Error ? err.message : "Error al cargar el seguimiento");
      })
      .finally(() => {
        if (montado) setCargando(false);
      });

    return () => {
      montado = false;
    };
  }, []);

  const maximo = useMemo(
    () => Math.max(...personas.map((p) => p.acciones.length), 1),
    [personas]
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={UsersRound}
        title="Seguimiento por persona"
        description="Acciones registradas por cada persona sobre los oficios"
      />

      <Card>
        <div className="flex flex-col gap-3">
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-12 text-texto-secundario">
              <Loader2 className="w-8 h-8 animate-spin text-guinda mb-2" />
              <span className="text-sm">Cargando seguimiento...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <>
              {personas.map((p, i) => {
                const abierto = expandido === String(p.usuarioId);
                const porcentaje = (p.acciones.length / maximo) * 100;
                return (
                  <div
                    key={p.usuarioId}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className={`rounded-xl border overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both ${
                      abierto
                        ? "border-guinda/40 shadow-md"
                        : "border-borde hover:shadow-md hover:border-guinda/30"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandido(abierto ? null : String(p.usuarioId))
                      }
                      className="w-full flex items-center gap-4 px-4 py-3 text-left"
                    >
                      <span className="h-7 w-7 shrink-0 rounded-full bg-fondo text-texto-secundario text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <Avatar nombre={p.usuarioNombre} size={42} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-texto truncate">
                          {p.usuarioNombre}
                        </p>
                        <div className="mt-1.5 h-2 w-full rounded-full bg-fondo/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-guinda to-dorado transition-all duration-700"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                      <span className="rounded-full bg-guinda/10 px-3 py-1 text-xs font-bold text-guinda">
                        {p.acciones.length}{" "}
                        {p.acciones.length === 1 ? "acción" : "acciones"}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-texto-secundario transition-transform ${abierto ? "rotate-180" : ""}`}
                      />
                    </button>

                    {abierto && (
                      <ul className="divide-y-borde border-t border-borde bg-fondo/20 animate-in fade-in slide-in-from-top-1 duration-150">
                        {p.acciones.map((a, j) => (
                          <li
                            key={`${a.oficioId}-${j}`}
                            className="flex items-start gap-3 px-6 py-3"
                          >
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-guinda" />
                            <div>
                              <p className="text-sm text-texto">
                                <span className="font-semibold">{a.folio}</span> —{" "}
                                {a.contenido}
                              </p>
                              <p className="text-xs text-texto-secundario mt-0.5">
                                {a.fecha}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
              {personas.length === 0 && (
                <p className="text-sm text-texto-secundario">
                  No hay acciones registradas.
                </p>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
