import { useState, useEffect } from "react";
import { Plus, Search, Users, Loader2 } from "lucide-react";
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
import { adminService, type UsuarioSesion } from "../../services";

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
  password: "",
  rol_id: 1,
  departamento_id: DEPARTAMENTOS_DEMO[0].id,
};

export default function Cuentas() {
  const [cuentas, setCuentas] = useState<Persona[]>(PERSONAS_DEMO);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Persona | null>(null);
  const [form, setForm] = useState(CUENTA_VACIA);
  const [porEliminar, setPorEliminar] = useState<Persona | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = () => {
    adminService.usuarios
      .listar()
      .then((usuarios: UsuarioSesion[]) => {
        setCuentas(
          usuarios.map((u) => ({
            id: u.id,
            nombre: u.nombre,
            correo: u.email,
            cargo: ROLES.find((r) => r.value === String(u.rol_id))?.label || "Usuario",
            rol_id: u.rol_id,
            departamento_id: u.departamento_id ?? 1,
            activo: u.activo,
          }))
        );
      })
      .catch((err) => {
        console.warn("API de usuarios no disponible, usando demo:", err);
      })
      .finally(() => {
        setCargando(false);
      });
  };

  useEffect(() => {
    cargar();
  }, []);

  const filas = cuentas.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirNuevo = () => {
    setEditando(null);
    setForm(CUENTA_VACIA);
    setModalAbierto(true);
  };

  const abrirEditar = (p: Persona) => {
    setEditando(p);
    setForm({
      nombre: p.nombre,
      correo: p.correo,
      cargo: p.cargo || "",
      password: "",
      rol_id: p.rol_id ?? 1,
      departamento_id: p.departamento_id ?? 1,
    });
    setModalAbierto(true);
  };

  const guardar = async () => {
    try {
      if (editando) {
        await adminService.usuarios.actualizar(editando.id, {
          nombre: form.nombre,
          email: form.correo,
          rol_id: form.rol_id,
          departamento_id: form.departamento_id,
        });
        setAviso(`Usuario "${form.nombre}" actualizado.`);
      } else {
        await adminService.usuarios.crear({
          nombre: form.nombre,
          email: form.correo,
          password: form.password || "Password123!",
          rol_id: form.rol_id,
          departamento_id: form.departamento_id,
        });
        setAviso(`Usuario "${form.nombre}" creado.`);
      }
      cargar();
      setModalAbierto(false);
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al guardar");
    }
  };

  const desactivar = async () => {
    if (!porEliminar) return;
    try {
      await adminService.usuarios.actualizar(porEliminar.id, { activo: false });
      setAviso(`Usuario "${porEliminar.nombre}" desactivado.`);
      cargar();
      setPorEliminar(null);
    } catch (err) {
      setAviso(err instanceof Error ? err.message : "Error al desactivar");
    }
  };

  const columns: Column<Persona>[] = [
    {
      header: "Usuario",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar nombre={p.nombre} size={36} />
          <div>
            <p className="font-semibold text-texto leading-tight">{p.nombre}</p>
            <p className="text-xs text-texto-secundario">{p.correo}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Departamento",
      render: (p) =>
        DEPARTAMENTOS_DEMO.find((d) => d.id === p.departamento_id)?.nombre ?? "—",
    },
    {
      header: "Rol",
      render: (p) => {
        const rolId = p.rol_id ?? 1;
        return (
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              ESTILO_ROL[rolId] ?? "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {ROLES.find((r) => r.value === String(rolId))?.label ?? "Desconocido"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={Users}
        title="Usuarios"
        description="Administra los usuarios del sistema y sus permisos de acceso."
        action={
          <Button icon={<Plus size={18} />} onClick={abrirNuevo}>
            Nuevo usuario
          </Button>
        }
      />

      <Card>
        <div className="mb-4 max-w-sm">
          <Input
            label="Buscar usuario"
            icon={<Search size={18} />}
            placeholder="Buscar por nombre o correo…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <div className="flex flex-col items-center justify-center py-12 text-texto-secundario">
            <Loader2 className="w-8 h-8 animate-spin text-guinda mb-2" />
            <span className="text-sm">Cargando usuarios...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={filas}
            onEdit={abrirEditar}
            onDelete={(p) => setPorEliminar(p)}
            emptyMessage="No se encontraron usuarios."
          />
        )}
      </Card>

      <FormModal
        open={modalAbierto}
        title={editando ? "Editar usuario" : "Nuevo usuario"}
        onClose={() => setModalAbierto(false)}
        onSubmit={guardar}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Nombre completo"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <Input
            label="Correo electrónico"
            type="email"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            required
          />
          {!editando && (
            <Input
              label="Contraseña inicial"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          )}
          <Select
            label="Rol de acceso"
            options={ROLES}
            value={String(form.rol_id)}
            onChange={(e) => setForm({ ...form, rol_id: Number(e.target.value) })}
            required
          />
          <Select
            label="Departamento"
            options={DEPARTAMENTOS_OPTS}
            value={String(form.departamento_id)}
            onChange={(e) =>
              setForm({ ...form, departamento_id: Number(e.target.value) })
            }
            required
          />
        </div>
      </FormModal>

      <ConfirmDialog
        open={Boolean(porEliminar)}
        title="¿Desactivar usuario?"
        description={`El usuario "${porEliminar?.nombre}" perderá acceso al sistema.`}
        confirmLabel="Desactivar"
        variant="danger"
        onCancel={() => setPorEliminar(null)}
        onConfirm={desactivar}
      />

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
