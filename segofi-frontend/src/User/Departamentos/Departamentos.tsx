import { useState, useEffect } from "react";
import { Building2, Plus, Search, Loader2 } from "lucide-react";
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
import { adminService, type DepartamentoDTO } from "../../services";

const DEPARTAMENTO_VACIO = { nombre: "", tipo: "", clave: "" };

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>(DEPARTAMENTOS_DEMO);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Departamento | null>(null);
  const [form, setForm] = useState(DEPARTAMENTO_VACIO);
  const [porEliminar, setPorEliminar] = useState<Departamento | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = () => {
    adminService.departamentos
      .listar()
      .then((datos) => {
        setDepartamentos(
          datos.map((d: DepartamentoDTO) => ({
            id: d.id,
            nombre: d.nombre,
            tipo: d.tipo,
            clave: `DEP-${d.id}`,
            descripcion: "",
          }))
        );
      })
      .catch((err) => {
        console.warn("API no disponible, usando demo:", err);
      })
      .finally(() => {
        setCargando(false);
      });
  };

  useEffect(() => {
    cargar();
  }, []);

  const filas = departamentos.filter((d) =>
    `${d.nombre} ${d.tipo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirNuevo = () => {
    setEditando(null);
    setForm(DEPARTAMENTO_VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (d: Departamento) => {
    setEditando(d);
    setForm({ nombre: d.nombre, tipo: d.tipo, clave: d.clave });
    setModalAbierto(true);
  };

  const guardar = async () => {
    try {
      if (editando) {
        await adminService.departamentos.actualizar(editando.id, {
          nombre: form.nombre,
          tipo: form.tipo,
        });
        setAviso(`Departamento "${form.nombre}" actualizado.`);
      } else {
        await adminService.departamentos.crear({
          nombre: form.nombre,
          tipo: form.tipo || "Dirección",
        });
        setAviso(`Departamento "${form.nombre}" creado.`);
      }
      cargar();
      setModalAbierto(false);
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al guardar");
    }
  };

  const eliminar = async () => {
    if (!porEliminar) return;
    try {
      await adminService.departamentos.eliminar(porEliminar.id);
      setAviso(`Departamento "${porEliminar.nombre}" eliminado.`);
      cargar();
      setPorEliminar(null);
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const columns: Column<Departamento>[] = [
    { header: "Clave", render: (d) => d.clave },
    { header: "Nombre", render: (d) => d.nombre },
    { header: "Tipo", render: (d) => d.tipo },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={Building2}
        title="Departamentos"
        description="Gestiona las áreas y direcciones de la dependencia."
        action={
          <Button icon={<Plus size={18} />} onClick={abrirNuevo}>
            Nuevo departamento
          </Button>
        }
      />

      <Card>
        <div className="mb-4 max-w-sm">
          <Input
            label="Buscar departamento"
            icon={<Search size={18} />}
            placeholder="Buscar por nombre o tipo…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-12 text-texto-secundario">
            <Loader2 className="w-8 h-8 animate-spin text-guinda mb-2" />
            <span className="text-sm">Cargando departamentos...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={filas}
            onEdit={abrirEditar}
            onDelete={(d) => setPorEliminar(d)}
            emptyMessage="No se encontraron departamentos."
          />
        )}
      </Card>

      <FormModal
        open={modalAbierto}
        title={editando ? "Editar departamento" : "Nuevo departamento"}
        onClose={() => setModalAbierto(false)}
        onSubmit={guardar}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nombre del departamento"
            placeholder="Ej.: Dirección de Promoción Turística"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <Input
            label="Tipo de área"
            placeholder="Ej.: Dirección, Subdirección, Jefatura"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            required
          />
        </div>
      </FormModal>

      <ConfirmDialog
        open={Boolean(porEliminar)}
        title="¿Eliminar departamento?"
        description={`Esta acción desactivará "${porEliminar?.nombre}".`}
        confirmLabel="Eliminar"
        variant="danger"
        onCancel={() => setPorEliminar(null)}
        onConfirm={eliminar}
      />

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
