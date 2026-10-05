import type { ReactNode } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Sin registros por mostrar.",
}: DataTableProps<T>) {
  const showActions = Boolean(onView || onEdit || onDelete);

  return (
    <div className="overflow-x-auto rounded-xl border border-borde">
      <table className="w-full text-left text-sm">
        <thead className="bg-fondo/60 text-texto-secundario uppercase text-xs tracking-wide">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-semibold">
                {col.header}
              </th>
            ))}
            {showActions && <th className="px-4 py-3 font-semibold text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-borde">
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (showActions ? 1 : 0)} className="px-4 py-10 text-center text-texto-secundario">
                {emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-fondo/40 transition-colors duration-150">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 text-texto ${col.className ?? ""}`}>
                  {col.render(row)}
                </td>
              ))}
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-sm"
                        aria-label="Ver Ficha"
                      >
                        <Eye size={14} className="text-guinda" />
                        Ficha
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-2 rounded-lg text-dorado hover:bg-dorado/10 hover:scale-110 transition-all"
                        aria-label="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-2 rounded-lg text-guinda hover:bg-guinda/10 hover:scale-110 transition-all"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
