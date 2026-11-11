import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import Toast from "../../components/Toast";
import { useAuth } from "../../Guards/useAuth";
import { useCatalogos } from "../../services/useCatalogos";
import { authService } from "../../services";

const ETIQUETA_ROL: Record<number, string> = {
  1: "Usuario Operativo",
  2: "Administrador del Sistema",
  3: "Directora General",
  4: "Jefe de Departamento",
};

export default function Perfil() {
  const { usuario } = useAuth();
  const { catalogos } = useCatalogos();

  // Estados del formulario de cambio de contraseña
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [exitoPassword, setExitoPassword] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  // Obtener nombres reales de rol y departamento
  const rolName = usuario?.rol_id ? ETIQUETA_ROL[usuario.rol_id] ?? `Rol ${usuario.rol_id}` : "Usuario";
  const deptoName =
    catalogos.departamentos.find((d) => d.id === usuario?.departamento_id)?.nombre ||
    "Departamento General";

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPassword(null);
    setExitoPassword(false);

    if (!usuario?.id) {
      setErrorPassword("No se encontró la sesión del usuario actual.");
      return;
    }

    if (!passwordActual.trim()) {
      setErrorPassword("Debes ingresar tu contraseña actual.");
      return;
    }

    if (nuevaPassword.length < 8) {
      setErrorPassword("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setErrorPassword("Las contraseñas no coinciden. Por favor verifícalas.");
      return;
    }

    if (nuevaPassword === passwordActual) {
      setErrorPassword("La nueva contraseña debe ser diferente a la contraseña actual.");
      return;
    }

    setCargando(true);
    try {
      await authService.cambiarPassword(usuario.id, {
        passwordActual,
        nuevaPassword,
      });

      // Éxito: limpiar campos y notificar al usuario
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
      setExitoPassword(true);
      setAviso("¡Tu contraseña ha sido actualizada con éxito!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cambiar la contraseña";
      setErrorPassword(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      {/* Portada + Avatar del usuario */}
      <div className="overflow-hidden rounded-2xl bg-white border border-borde shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="relative h-28 bg-gradient-to-r from-guinda-dark via-guinda to-guinda-light">
          <span className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute right-32 -bottom-14 h-32 w-32 rounded-full bg-dorado/25" />
        </div>
        <div className="flex flex-wrap items-end gap-4 px-6 pb-5">
          <div className="-mt-10 rounded-full ring-4 ring-white shadow-md">
            {usuario && <Avatar nombre={usuario.nombre} size={84} />}
          </div>
          <div className="flex-1 min-w-48 pt-2">
            <h1 className="text-xl font-bold text-guinda">{usuario?.nombre}</h1>
            <p className="text-sm text-texto-secundario">{usuario?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-guinda/10 px-3 py-1 text-xs font-semibold text-guinda border border-guinda/20">
              <ShieldCheck size={14} />
              {rolName}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-dorado/15 px-3 py-1 text-xs font-semibold text-dorado border border-dorado/20">
              <Building2 size={14} />
              {deptoName}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta 1: Información Institucional */}
        <Card title="Datos de la cuenta">
          <div className="flex flex-col gap-4">
            <Input
              label="Nombre del funcionario"
              icon={<UserIcon size={18} className="text-slate-400" />}
              value={usuario?.nombre ?? ""}
              disabled
              className="bg-slate-50 cursor-not-allowed"
            />

            <Input
              label="Correo institucional"
              icon={<Mail size={18} className="text-slate-400" />}
              value={usuario?.email ?? ""}
              disabled
              className="bg-slate-50 cursor-not-allowed"
            />

            <Input
              label="Área / Departamento adscrito"
              icon={<Building2 size={18} className="text-slate-400" />}
              value={deptoName}
              disabled
              className="bg-slate-50 cursor-not-allowed"
            />

            <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-3 mt-1 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Los datos de adscripción institucional son administrados por el área directiva. Si requieres actualizar tu cargo o departamento, solicita el cambio a un administrador del sistema.
              </p>
            </div>
          </div>
        </Card>

        {/* Tarjeta 2: Cambiar Contraseña */}
        <Card title="Seguridad y contraseña">
          <form onSubmit={handleCambiarPassword} className="flex flex-col gap-4">
            <p className="text-xs text-texto-secundario leading-relaxed -mt-1">
              Actualiza tu clave de acceso periódicamente para proteger la información institucional.
            </p>

            <PasswordInput
              label="Contraseña actual"
              placeholder="Ingresa tu contraseña actual"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              required
            />

            <PasswordInput
              label="Nueva contraseña"
              placeholder="Mínimo 8 caracteres"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              required
            />

            <PasswordInput
              label="Confirmar nueva contraseña"
              placeholder="Vuelve a escribir la nueva contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />

            {/* Mensajes de validación o error */}
            {errorPassword && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorPassword}</span>
              </div>
            )}

            {exitoPassword && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-in fade-in duration-200">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>Contraseña cambiada exitosamente.</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="flex items-center gap-1.5 text-xs text-texto-secundario">
                <Lock size={13} />
                Mínimo 8 caracteres
              </span>

              <Button
                type="submit"
                variant="primary"
                icon={
                  cargando ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <KeyRound size={16} />
                  )
                }
                disabled={cargando}
              >
                {cargando ? "Actualizando…" : "Actualizar contraseña"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Toast mensaje={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
