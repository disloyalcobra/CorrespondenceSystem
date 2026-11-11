import type { EstadoOficio } from "../Data/estados";

export type { EstadoOficio };

const estiloPorEstado: Record<EstadoOficio, string> = {
  Pendiente: "bg-blue-50 text-blue-700 border-blue-200",
  Turnado: "bg-dorado/10 text-dorado border-dorado/30",
  "En proceso": "bg-amber-50 text-amber-700 border-amber-200",
  Respondido: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Concluido: "bg-gray-100 text-gray-600 border-gray-300",
  Vencido: "bg-red-50 text-red-700 border-red-200",
  Enviado: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function StatusBadge({ estado }: { estado: EstadoOficio }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${estiloPorEstado[estado]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {estado}
    </span>
  );
}
