import { useState, useEffect } from "react";
import { Building2, Plus, Search, Loader2 } from "lucide-react";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Input from "../../components/Input";
import Select from "../../components/Select";
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

const DEPARTAMENTO_VACIO = { nombre: "", tipo: "INTERNO", clave: "" };

// El backend (esquema y seed) solo admite los tipos INTERNO | EXTERNO
const TIPOS_DEPARTAMENTO = [
  { value: "INTERNO", label: "Interno" },
  { value: "EXTERNO", label: "Externo" },
];

const ETIQUETA_TIPO: Record<string, string> = {
  INTERNO: "Interno",
  EXTERNO: "Externo",
};

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
            activo: d.activo ?? true,
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

  // Los departamentos dados de baja (desactivación lógica) no se listan
  const dadosDeBaja = departamentos.filter((d) => d.activo === false);
  const filas = departamentos.filter(
    (d) =>
      d.activo !== false &&
      `${d.nombre} ${d.tipo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirNuevo = () => {
    setEditando(null);
    setForm(DEPARTAMENTO_VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (d: Departamento) => {
    setEditando(d);
    setForm({
      nombre: d.nombre,
      // La base solo admite INTERNO | EXTERNO; si el registro trajera otro valor se usa INTERNO
      tipo: TIPOS_DEPARTAMENTO.some((t) => t.value === d.tipo) ? d.tipo : "INTERNO",
      clave: d.clave,
    });
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
          tipo: form.tipo || "INTERNO",
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
      setAviso(
        `Departamento "${porEliminar.nombre}" dado de baja. Se conserva en la base de datos sin afectar su historial.`
      );
      cargar();
      setPorEliminar(null);
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const columns: Column<Departamento>[] = [
    { header: "Clave", render: (d) => d.clave },
    { header: "Nombre", render: (d) => d.nombre },
    { header: "Tipo", render: (d) => ETIQUETA_TIPO[d.tipo] ?? d.tipo },
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
        {dadosDeBaja.length > 0 && (
          <p className="mt-3 text-xs text-texto-secundario">
            {dadosDeBaja.length} departamento(s) dado(s) de baja, no se muestran en la tabla.
          </p>
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
          <Select
            label="Tipo de departamento"
            options={TIPOS_DEPARTAMENTO}
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            required
          />
        </div>
      </FormModal>

      <ConfirmDialog
        open={Boolean(porEliminar)}
        title="¿Dar de baja el departamento?"
        description={`"${porEliminar?.nombre}" dejará de estar disponible y no se mostrará en la tabla. Su historial se conserva.`}
        confirmLabel="Dar de baja"
        variant="danger"
        onCancel={() => setPorEliminar(null)}
        onConfirm={eliminar}
      />

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
