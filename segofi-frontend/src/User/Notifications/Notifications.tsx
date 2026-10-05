import { useState } from "react";
import { Bell, CheckCheck, BellOff } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import {
  NOTIFICACIONES,
  type TipoNotificacion,
} from "../../Data/notificaciones";
import { useAuth } from "../../Guards/useAuth";
import { notificacionesVisibles, tieneAccesoTotal } from "../../Guards/alcance";
import { DEPARTAMENTOS_DEMO } from "../../Data/departamentos";

type Tab = "Todos" | TipoNotificacion;

const TABS: Tab[] = ["Todos", "Recibidos", "Seguimiento", "Urgentes"];

const TONO: Record<string, string> = {
  Recibidos: "bg-blue-100 text-blue-600",
  Seguimiento: "bg-amber-100 text-amber-600",
  Urgentes: "bg-red-100 text-red-600",
};

export default function Notifications() {
  const { usuario } = useAuth();
  const [tab, setTab] = useState<Tab>("Todos");
  const [leidas, setLeidas] = useState<number[]>([]);

  const propias = notificacionesVisibles(usuario, NOTIFICACIONES);
  const conIndice = propias.map((n, i) => ({ n, i }));
  const items = conIndice.filter(({ n }) => tab === "Todos" || n.tipo === tab);
  const noLeidas = conIndice.filter(({ i }) => !leidas.includes(i)).length;

  const contar = (t: Tab) =>
    conIndice.filter(
      ({ n, i }) => (t === "Todos" || n.tipo === t) && !leidas.includes(i),
    ).length;

  const alternar = (i: number) =>
    setLeidas((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={Bell}
        title="Notificaciones"
        description={
          noLeidas > 0
            ? `Tienes ${noLeidas} sin leer${tieneAccesoTotal(usuario) ? "" : ` de ${DEPARTAMENTOS_DEMO.find(d => d.id === usuario?.departamento_id)?.nombre}`}`
            : "Estás al día"
        }
        action={
          <Button
            variant="light"
            icon={<CheckCheck size={18} />}
            disabled={noLeidas === 0}
            onClick={() => setLeidas(propias.map((_, i) => i))}
          >
            Marcar todas como leídas
          </Button>
        }
      />

      <Card>
        <div className="flex flex-wrap gap-2 mb-5">
          {TABS.map((t) => {
            const cantidad = contar(t);
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  tab === t
                    ? "bg-guinda text-white border-guinda shadow-sm"
                    : "bg-white text-texto-secundario border-borde hover:border-guinda hover:text-guinda"
                }`}
              >
                {t}
                {cantidad > 0 && (
                  <span
                    className={`min-w-5 rounded-full px-1.5 text-[11px] font-bold ${
                      tab === t
                        ? "bg-white/25 text-white"
                        : "bg-guinda/10 text-guinda"
                    }`}
                  >
                    {cantidad}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-texto-secundario">
            <BellOff size={32} />
            <p className="text-sm">No hay notificaciones en esta categoría.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map(({ n, i }, pos) => {
              const Icono = n.icono;
              const leida = leidas.includes(i);
              return (
                <li
                  key={i}
                  style={{ animationDelay: `${pos * 50}ms` }}
                  className="animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both"
                >
                  <button
                    onClick={() => alternar(i)}
                    className={`w-full flex items-start gap-4 rounded-xl border px-4 py-3 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      leida
                        ? "bg-white border-borde opacity-70"
                        : "bg-guinda/5 border-guinda/20"
                    }`}
                  >
                    <span
                      className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${TONO[n.tipo as string] || "bg-gray-100 text-gray-600"}`}
                    >
                      <Icono size={18} />
                    </span>
                    <div className="flex-1">
                      <p
                        className={`text-sm text-texto ${leida ? "" : "font-semibold"}`}
                      >
                        {n.texto}
                      </p>
                      <p className="text-xs text-texto-secundario mt-0.5">
                        {n.fecha} · {n.tipo}
                      </p>
                    </div>
                    {!leida && (
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-guinda animate-pulse" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
