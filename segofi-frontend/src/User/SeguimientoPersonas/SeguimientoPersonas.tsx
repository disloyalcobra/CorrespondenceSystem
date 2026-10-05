import { useMemo, useState } from "react";
import { ChevronDown, UsersRound } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Avatar from "../../components/Avatar";
import { useOficios } from "../../Data/oficiosStore";
import { useAuth } from "../../Guards/useAuth";
import { oficiosVisibles } from "../../Guards/alcance";

interface AccionPersona {
  oficio: string;
  accion: string;
  fecha: string;
}

interface Persona {
  nombre: string;
  acciones: AccionPersona[];
}

export default function SeguimientoPersonas() {
  const [expandido, setExpandido] = useState<string | null>(null);
  const { usuario } = useAuth();
  const oficios = useOficios();
  const visibles = oficiosVisibles(usuario, oficios);

  const personas = useMemo<Persona[]>(() => {
    const mapa = new Map<string, AccionPersona[]>();
    for (const oficio of visibles) {
      for (const ev of oficio.seguimiento) {
        const lista = mapa.get(ev.autor) ?? [];
        lista.push({
          oficio: oficio.numero,
          accion: ev.accion,
          fecha: ev.fecha,
        });
        mapa.set(ev.autor, lista);
      }
    }
    return Array.from(mapa.entries())
      .map(([nombre, acciones]) => ({ nombre, acciones }))
      .sort((a, b) => b.acciones.length - a.acciones.length);
  }, [visibles]);

  const maximo = Math.max(...personas.map((p) => p.acciones.length), 1);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={UsersRound}
        title="Seguimiento por persona"
        description="Acciones registradas por cada persona sobre los oficios"
      />

      <Card>
        <div className="flex flex-col gap-3">
          {personas.map((p, i) => {
            const abierto = expandido === p.nombre;
            const porcentaje = (p.acciones.length / maximo) * 100;
            return (
              <div
                key={p.nombre}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`rounded-xl border overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both ${
                  abierto
                    ? "border-guinda/40 shadow-md"
                    : "border-borde hover:shadow-md hover:border-guinda/30"
                }`}
              >
                <button
                  onClick={() => setExpandido(abierto ? null : p.nombre)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-left"
                >
                  <span className="h-7 w-7 shrink-0 rounded-full bg-fondo text-texto-secundario text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <Avatar nombre={p.nombre} size={42} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-texto truncate">
                      {p.nombre}
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
                  <ul className="divide-y divide-borde border-t border-borde bg-fondo/20 animate-in fade-in slide-in-from-top-1 duration-150">
                    {p.acciones.map((a, j) => (
                      <li key={j} className="flex items-start gap-3 px-6 py-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-guinda" />
                        <div>
                          <p className="text-sm text-texto">
                            <span className="font-semibold">{a.oficio}</span> —{" "}
                            {a.accion}
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
        </div>
      </Card>
    </div>
  );
}
