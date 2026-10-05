import { useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import DataTable, { type Column } from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  DEPARTAMENTOS_DEMO,
  type Departamento,
} from "../../Data/departamentos";

const DEPARTAMENTO_VACIO = { nombre: "", tipo: "" };

export default function Departamentos() {
  const [departamentos, setDepartamentos] =
    useState<Departamento[]>(DEPARTAMENTOS_DEMO);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Departamento | null>(null);
  const [form, setForm] = useState(DEPARTAMENTO_VACIO);
  const [porEliminar, setPorEliminar] = useState<Departamento | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const filas = departamentos.filter((d) =>
    `${d.nombre} ${d.tipo}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  const abrirNuevo = () => {
    setEditando(null);
    setForm(DEPARTAMENTO_VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (d: Departamento) => {
    setEditando(d);
    setForm({ nombre: d.nombre, tipo: d.tipo });
    setModalAbierto(true);
  };

  const guardar = () => {
    if (editando) {
      setDepartamentos((prev) =>
        prev.map((d) => (d.id === editando.id ? { ...d, ...form } : d)),
      );
      setAviso("Departamento actualizado");
    } else {
      setDepartamentos((prev) => [...prev, { id: Date.now(), ...form }]);
      setAviso("Departamento agregado");
    }
    setModalAbierto(false);
  };

  const eliminar = () => {
    if (!porEliminar) return;
    setDepartamentos((prev) => prev.filter((d) => d.id !== porEliminar.id));
    setPorEliminar(null);
    setAviso("Departamento eliminado");
  };

  const columns: Column<Departamento>[] = [
    {
      header: "Departamento",
      render: (d) => (
        <span className="inline-flex items-center gap-3 font-medium">
          <span className="h-9 w-9 rounded-lg bg-guinda/10 text-guinda flex items-center justify-center">
            <Building2 size={16} />
          </span>
          {d.nombre}
        </span>
      ),
    },
    {
      header: "Tipo",
      render: (d) => (
        <span className="rounded-md bg-dorado/15 px-2.5 py-1 text-xs font-bold text-dorado">
          {d.tipo}
        </span>
      ),
    }
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={Building2}
        title="Departamentos"
        description={`${departamentos.length} departamentos registrados`}
        action={
          <Button
            variant="light"
            icon={<Plus size={18} />}
            onClick={abrirNuevo}
          >
            Agregar
          </Button>
        }
      />

      <Card>
        <div className="max-w-sm mb-4">
          <Input
            label="Buscar"
            icon={<Search size={18} />}
            placeholder="Nombre o tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          rows={filas}
          onEdit={abrirEditar}
          onDelete={setPorEliminar}
        />
      </Card>

      <FormModal
        open={modalAbierto}
        title={editando ? "Editar departamento" : "Agregar departamento"}
        onClose={() => setModalAbierto(false)}
        onSubmit={guardar}
      >
        <Input
          label="Nombre del departamento"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <Input
          label="Tipo"
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          required
        />
      </FormModal>

      <ConfirmDialog
        open={porEliminar !== null}
        title="¿Eliminar departamento?"
        description={
          porEliminar
            ? `Se eliminará “${porEliminar.nombre}” permanentemente.`
            : undefined
        }
        variant="danger"
        confirmLabel="Sí"
        cancelLabel="No"
        onConfirm={eliminar}
        onCancel={() => setPorEliminar(null)}
      />

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
