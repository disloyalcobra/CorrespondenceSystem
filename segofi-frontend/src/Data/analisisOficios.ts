import type { Oficio } from "./oficio";
import { TIPOS_DOCUMENTO, type TipoDocumento } from "./tiposDocumento";
import type { EstadoOficio } from "../components/StatusBadge";

/**
 * Lógica pura de consulta y reportes de oficios.
 * Adapta a SegOfi los cálculos de SistemaCorrespondencia (tiempos de respuesta,
 * cumplimiento de término y exportación CSV) sin depender de React.
 */

const DIA_MS = 1000 * 60 * 60 * 24;

/**
 * Convierte las fechas que maneja SegOfi a `Date`:
 * - `dd/mm/aaaa` y `dd/mm/aaaa hh:mm` (datos de demostración)
 * - `d/m/aa, hh:mm` (formato es-MX corto que generan las acciones del store)
 * - `AAAA-MM-DD` (término)
 */
export function parseFecha(texto?: string | null): Date | null {
  if (!texto) return null;
  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  if (iso) {
    return new Date(+iso[1], +iso[2] - 1, +iso[3], +(iso[4] ?? 0), +(iso[5] ?? 0));
  }
  const mx = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:,?\s+(\d{1,2}):(\d{2}))?/);
  if (!mx) return null;
  let anio = +mx[3];
  if (anio < 100) anio += 2000;
  return new Date(anio, +mx[2] - 1, +mx[1], +(mx[4] ?? 0), +(mx[5] ?? 0));
}

function inicioDelDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

/** Días naturales de `desde` a `hasta` (negativo si `hasta` ya pasó). */
export function diasEntre(desde: Date, hasta: Date): number {
  return Math.round((inicioDelDia(hasta).getTime() - inicioDelDia(desde).getTime()) / DIA_MS);
}

export function formatoFecha(fecha: Date | null): string {
  if (!fecha) return "—";
  return fecha.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Clave `AAAA-MM` para agrupar por mes. */
export function claveMes(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
}

export function etiquetaMes(clave: string): string {
  const [anio, mes] = clave.split("-").map(Number);
  const texto = new Date(anio, mes - 1, 1).toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Tipo de documento: usa el campo explícito o lo deduce del prefijo del número. */
export function tipoDeOficio(oficio: Oficio): TipoDocumento["value"] {
  if (oficio.tipo) return oficio.tipo;
  const prefijo = oficio.numero.split("-")[0]?.toUpperCase();
  if (prefijo === "OF") return "oficio";
  if (prefijo === "MEMO") return "memo";
  if (prefijo === "CIR") return "circular";
  return "otro";
}

export function etiquetaTipo(valor: TipoDocumento["value"]): string {
  return TIPOS_DOCUMENTO.find((t) => t.value === valor)?.label ?? "Otro";
}

/** Estados que significan que el oficio ya fue atendido (respondido, cerrado o enviado). */
export const ESTADOS_ATENDIDOS: EstadoOficio[] = ["Respondido", "Cerrado", "Enviado"];

export type Cumplimiento = "EN_TIEMPO" | "EXTEMPORANEO" | "ATENDIDO" | "VENCIDO_PENDIENTE" | "EN_PLAZO";

export const ETIQUETA_CUMPLIMIENTO: Record<Cumplimiento, string> = {
  EN_TIEMPO: "En tiempo",
  EXTEMPORANEO: "Extemporáneo",
  ATENDIDO: "Atendido",
  VENCIDO_PENDIENTE: "Vencido",
  EN_PLAZO: "En plazo",
};

export interface EvaluacionOficio {
  oficio: Oficio;
  tipo: TipoDocumento["value"];
  recepcion: Date | null;
  termino: Date | null;
  fechaRespuesta: Date | null;
  tiempoRespuestaDias: number | null;
  /** Días que faltan para el término; solo para oficios no atendidos con término. */
  diasRestantes: number | null;
  cumplimiento: Cumplimiento;
}

const RESPUESTA = /^(emitió respuesta|respondió)/i;

/** Fecha en que se atendió el oficio, según su historial real de seguimiento. */
function fechaDeAtencion(oficio: Oficio): Date | null {
  const respuesta = oficio.seguimiento.find((evento) => RESPUESTA.test(evento.accion));
  if (respuesta) return parseFecha(respuesta.fecha);
  if (oficio.estado === "Enviado" && oficio.fechaEnvio) return parseFecha(oficio.fechaEnvio);
  if (ESTADOS_ATENDIDOS.includes(oficio.estado)) {
    const ultimo = oficio.seguimiento[oficio.seguimiento.length - 1];
    return parseFecha(ultimo?.fecha) ?? parseFecha(oficio.fecha);
  }
  return null;
}

/** Misma regla de SistemaCorrespondencia: tiempo de respuesta y cumplimiento del término. */
export function evaluarOficio(oficio: Oficio, hoy: Date = new Date()): EvaluacionOficio {
  const recepcion = parseFecha(oficio.fecha);
  const termino = parseFecha(oficio.termino);
  const fechaRespuesta = fechaDeAtencion(oficio);

  let tiempoRespuestaDias: number | null = null;
  let diasRestantes: number | null = null;
  let cumplimiento: Cumplimiento;

  if (fechaRespuesta) {
    if (recepcion) tiempoRespuestaDias = Math.max(1, diasEntre(recepcion, fechaRespuesta));
    if (termino) {
      cumplimiento = inicioDelDia(fechaRespuesta) <= termino ? "EN_TIEMPO" : "EXTEMPORANEO";
    } else {
      cumplimiento = "ATENDIDO";
    }
  } else {
    if (termino) diasRestantes = diasEntre(hoy, termino);
    cumplimiento = diasRestantes !== null && diasRestantes < 0 ? "VENCIDO_PENDIENTE" : "EN_PLAZO";
  }

  return {
    oficio,
    tipo: tipoDeOficio(oficio),
    recepcion,
    termino,
    fechaRespuesta,
    tiempoRespuestaDias,
    diasRestantes,
    cumplimiento,
  };
}

/** Descarga un CSV con BOM para que Excel respete acentos (igual que SistemaCorrespondencia). */
export function descargarCSV(nombreArchivo: string, encabezados: string[], filas: (string | number)[][]) {
  const escapar = (valor: string | number) => `"${String(valor ?? "").replace(/"/g, '""')}"`;
  const contenido =
    "\uFEFF" + [encabezados.map(escapar).join(","), ...filas.map((fila) => fila.map(escapar).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob([contenido], { type: "text/csv;charset=utf-8;" }));
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
