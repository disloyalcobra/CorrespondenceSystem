import { ClipboardList } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import DataTable, { type Column } from "../../components/DataTable";
import { useBitacora, type EventoBitacora } from "../../Data/oficiosStore";

export default function Bitacora() {
  const eventos = useBitacora();
  const columnas: Column<EventoBitacora>[] = [
    { header: "Fecha", render: (evento) => evento.fecha },
    { header: "Usuario", render: (evento) => evento.actor },
    { header: "Acción", render: (evento) => evento.accion },
    { header: "Oficio", render: (evento) => evento.oficio },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader icon={ClipboardList} title="Bitácora" description="Historial de acciones registradas en los oficios." />
      <Card>
        <DataTable columns={columnas} rows={eventos} emptyMessage="No hay actividad registrada." />
      </Card>
    </div>
  );
}
