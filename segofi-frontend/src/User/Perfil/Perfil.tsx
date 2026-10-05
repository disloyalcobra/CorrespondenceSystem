import { useState } from "react";
import {
  Briefcase,
  Building2,
  Check,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../Guards/useAuth";
import { DEPARTAMENTOS_DEMO } from "../../Data/departamentos";

const ETIQUETA_ROL: Record<number, string> = {
  1: "Usuario",
  2: "Administrador",
  3: "Directora",
  4: "Jefe de departamento",
};

export default function Perfil() {
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  
  const rolName = usuario?.rol_id ? ETIQUETA_ROL[usuario.rol_id] : "";
  const deptoName = DEPARTAMENTOS_DEMO.find(d => d.id === usuario?.departamento_id)?.nombre || "Desconocido";

  const [guardado, setGuardado] = useState(false);

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2200);
  };

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      {/* Portada + avatar */}
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
            <p className="text-sm text-texto-secundario">{rolName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-guinda/10 px-3 py-1 text-xs font-semibold text-guinda">
              <ShieldCheck size={13} />
              {rolName}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-dorado/15 px-3 py-1 text-xs font-semibold text-dorado">
              <Building2 size={13} />
              {deptoName}
            </span>
          </div>
        </div>
      </div>

      <Card title="Datos personales">
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={guardar}
        >
          <div className="md:col-span-2">
            <Input
              label="Nombre completo"
              icon={<User size={18} />}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <Input
            label="Correo Electrónico"
            icon={<Briefcase size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="md:col-span-2">
            <PasswordInput
              label="Nueva contraseña"
              placeholder="Dejar en blanco para no cambiarla"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <span className="flex items-center gap-2 text-xs text-texto-secundario">
              <Lock size={14} />
              Deja la contraseña en blanco para conservar la actual.
            </span>
            <Button
              type="submit"
              variant={guardado ? "secondary" : "primary"}
              icon={guardado ? <Check size={18} /> : undefined}
            >
              {guardado ? "Guardado" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
