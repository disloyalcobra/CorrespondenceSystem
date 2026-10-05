import { useState } from "react";
import { AlertCircle, Plus, Search, Users } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import Toast from "../../components/Toast";
import DataTable, { type Column } from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { DEPARTAMENTOS_DEMO } from "../../Data/departamentos";
import { PERSONAS_DEMO, type Persona } from "../../Data/personas";

const ROLES: { value: string; label: string }[] = [
  { value: "1", label: "Usuario" },
  { value: "4", label: "Jefe de departamento" },
  { value: "3", label: "Directora" },
  { value: "2", label: "Administrador" },
];

const ESTILO_ROL: Record<number, string> = {
  1: "bg-blue-50 text-blue-700 border-blue-200",
  4: "bg-amber-50 text-amber-700 border-amber-200",
  3: "bg-guinda/10 text-guinda border-guinda/30",
  2: "bg-dorado/15 text-dorado border-dorado/30",
};

const DEPARTAMENTOS_OPTS = DEPARTAMENTOS_DEMO.map((d) => ({
  value: String(d.id),
  label: d.nombre,
}));

const CUENTA_VACIA = {
  nombre: "",
  correo: "",
  cargo: "",
  rol_id: 1,
  departamento_id: DEPARTAMENTOS_DEMO[0].id,
};

export default function Cuentas() {
  const [cuentas, setCuentas] = useState<Persona[]>(PERSONAS_DEMO);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Persona | null>(null);
  const [form, setForm] = useState(CUENTA_VACIA);
  const [porEliminar, setPorEliminar] = useState<Persona | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const pendientes = cuentas.filter((c) => !c.rol_id).length;

  const filas = cuentas.filter((c) => {
    const deptoName = DEPARTAMENTOS_DEMO.find(d => d.id === c.departamento_id)?.nombre || "";
    return `${c.nombre} ${c.correo} ${deptoName}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
  });

  const abrirNueva = () => {
    setEditando(null);
    setForm(CUENTA_VACIA);
    setModalAbierto(true);
  };

  const abrirEditar = (c: Persona) => {
    setEditando(c);
    setForm({
      nombre: c.nombre,
      correo: c.correo,
      cargo: c.cargo ?? "",
      rol_id: c.rol_id ?? 1,
      departamento_id: c.departamento_id ?? DEPARTAMENTOS_DEMO[0].id,
    });
    setModalAbierto(true);
  };

  const guardar = () => {
    if (editando) {
      setCuentas((prev) =>
        prev.map((c) => (c.id === editando.id ? { ...c, ...form } : c)),
      );
      setAviso(
        editando.rol_id
          ? "Cuenta actualizada"
          : "Cuenta activada con su rol y departamento",
      );
    } else {
      setCuentas((prev) => [...prev, { id: Date.now(), ...form }]);
      setAviso("Cuenta creada");
    }
    setModalAbierto(false);
  };

  const eliminar = () => {
    if (!porEliminar) return;
    setCuentas((prev) => prev.filter((c) => c.id !== porEliminar.id));
    setPorEliminar(null);
    setAviso("Cuenta eliminada");
  };

  const columns: Column<Persona>[] = [
    {
      header: "Nombre",
      render: (c) => (
        <span className="inline-flex items-center gap-3 font-medium">
          <Avatar nombre={c.nombre} size={34} />
          {c.nombre}
        </span>
      ),
    },
    { header: "Correo", render: (c) => c.correo },
    {
      header: "Rol",
      render: (c) =>
        c.rol_id ? (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${ESTILO_ROL[c.rol_id]}`}
          >
            {ROLES.find((r) => String(r.value) === String(c.rol_id))?.label}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <AlertCircle size={12} />
            Pendiente
          </span>
        ),
    },
    {
      header: "Departamento",
      render: (c) =>
        c.departamento_id ? DEPARTAMENTOS_DEMO.find(d => d.id === c.departamento_id)?.nombre : (
          <span className="text-texto-secundario italic">Sin asignar</span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={Users}
        title="Cuentas"
        description={
          pendientes > 0
            ? `${cuentas.length} cuentas registradas · ${pendientes} pendiente${pendientes > 1 ? "s" : ""} por asignar`
            : `${cuentas.length} cuentas registradas`
        }
        action={
          <Button
            variant="light"
            icon={<Plus size={18} />}
            onClick={abrirNueva}
          >
            Agregar
          </Button>
        }
      />

      {pendientes > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Hay {pendientes} cuenta{pendientes > 1 ? "s" : ""} creada
            {pendientes > 1 ? "s" : ""} desde el registro público que aún no
            tiene{pendientes > 1 ? "n" : ""} cargo, rol ni departamento. Edítala
            {pendientes > 1 ? "s" : ""} para activarla
            {pendientes > 1 ? "s" : ""}.
          </p>
        </div>
      )}

      <Card>
        <div className="max-w-sm mb-4">
          <Input
            label="Buscar"
            icon={<Search size={18} />}
            placeholder="Nombre o correo..."
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
        title={editando ? "Editar cuenta" : "Agregar cuenta"}
        onClose={() => setModalAbierto(false)}
        onSubmit={guardar}
      >
        <Input
          label="Nombre completo"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <Input
          label="Correo institucional"
          type="email"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          required
        />
        <Input
          label="Cargo"
          value={form.cargo}
          onChange={(e) => setForm({ ...form, cargo: e.target.value })}
          placeholder="Ej. Jefe de Departamento"
          required
        />
        <Select
          label="Rol"
          options={ROLES}
          value={String(form.rol_id)}
          onChange={(e) => setForm({ ...form, rol_id: Number(e.target.value) })}
        />
        <Select
          label="Departamento"
          options={DEPARTAMENTOS_OPTS}
          value={String(form.departamento_id)}
          onChange={(e) => setForm({ ...form, departamento_id: Number(e.target.value) })}
        />
      </FormModal>

      <ConfirmDialog
        open={porEliminar !== null}
        title="¿Eliminar cuenta?"
        description={
          porEliminar
            ? `Se eliminará la cuenta de “${porEliminar.nombre}”.`
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
