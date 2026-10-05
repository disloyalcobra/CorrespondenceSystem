import { useState } from "react";
import { Building2, ClipboardList, Users } from "lucide-react";
import Departamentos from "../Departamentos/Departamentos";
import Cuentas from "../Cuentas/Cuentas";
import Bitacora from "../Bitacora/Bitacora";

const PESTANAS = [
  { id: "departamentos", nombre: "Departamentos", icono: Building2 },
  { id: "usuarios", nombre: "Usuarios", icono: Users },
  { id: "bitacora", nombre: "Bitácora", icono: ClipboardList },
] as const;

export default function Administracion() {
  const [activa, setActiva] = useState<(typeof PESTANAS)[number]["id"]>("departamentos");

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-bold text-guinda">Administración</h1>
        <p className="mt-1 text-sm text-texto-secundario">Gestiona departamentos, usuarios y consulta la bitácora.</p>
      </header>
      <nav className="flex flex-wrap gap-2" aria-label="Secciones de administración">
        {PESTANAS.map(({ id, nombre, icono: Icono }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activa === id}
            onClick={() => setActiva(id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
              activa === id ? "border-guinda bg-guinda text-white" : "border-borde bg-white text-texto hover:border-guinda hover:text-guinda"
            }`}
          >
            <Icono size={17} />
            {nombre}
          </button>
        ))}
      </nav>
      <div role="tabpanel" aria-label={PESTANAS.find((tab) => tab.id === activa)?.nombre}>
        {activa === "departamentos" && <Departamentos />}
        {activa === "usuarios" && <Cuentas />}
        {activa === "bitacora" && <Bitacora />}
      </div>
    </div>
  );
}
