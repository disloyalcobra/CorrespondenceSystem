import type { EstadoOficio } from "../components/StatusBadge";
import type { TipoDocumento } from "./tiposDocumento";

export interface EventoSeguimiento {
  autor: string;
  accion: string;
  fecha: string;
}

export interface AdjuntoOficio {
  nombre: string;
  url?: string;
  fecha: string;
}

export interface Oficio {
  numero: string;
  asunto: string;
  departamento: string;
  fecha: string;
  estado: EstadoOficio;
  archivo: string;
  seguimiento: EventoSeguimiento[];
  destinatariosPersonas?: string[];
  folioSalida?: string;
  fechaEnvio?: string;
  adjuntos?: AdjuntoOficio[];
  /** Tipo de documento (catálogo `TIPOS_DOCUMENTO`). Si falta se infiere del prefijo del número. */
  tipo?: TipoDocumento["value"];
  /** Fecha límite de atención en formato ISO `AAAA-MM-DD`. */
  termino?: string;
}

export const OFICIOS_DEMO: Oficio[] = [
  {
    numero: "OF-0142/2026",
    asunto: "Solicitud de información turística",
    departamento: "Promoción Turística",
    fecha: "12/09/2026",
    estado: "En seguimiento",
    tipo: "oficio",
    termino: "2026-10-08",
    archivo: "documento_of_0142.pdf",
    seguimiento: [
      { autor: "Lic. Carlos Martínez", accion: "Turnó el oficio a Promoción Turística", fecha: "12/09/2026 09:14" },
      { autor: "Directora — Desarrollo Turístico", accion: "Agregó una observación: “Favor de atender antes del viernes”", fecha: "12/09/2026 11:02" },
      { autor: "Depto. Promoción Turística", accion: "Confirmó la lectura del documento", fecha: "13/09/2026 08:30" },
    ],
  },
  {
    numero: "MEMO-0088/2026",
    asunto: "Actualización de indicadores",
    departamento: "Protocolos",
    fecha: "10/09/2026",
    estado: "Turnado",
    tipo: "memo",
    termino: "2026-09-30",
    archivo: "memo_0088.pdf",
    seguimiento: [
      { autor: "Lic. Ana Rojas", accion: "Generó el memo y lo turnó a Protocolos", fecha: "10/09/2026 10:00" },
    ],
  },
  {
    numero: "CIR-0021/2026",
    asunto: "Circular de vacaciones",
    departamento: "18 Ote",
    fecha: "05/09/2026",
    estado: "Recibido",
    tipo: "circular",
    archivo: "circular_0021.pdf",
    seguimiento: [
      { autor: "18 Ote", accion: "Generó la circular", fecha: "05/09/2026 09:00" },
    ],
  },
  {
    numero: "OF-0139/2026",
    asunto: "Respuesta a solicitud de apoyo",
    departamento: "Desarrollo Turístico",
    fecha: "01/09/2026",
    estado: "Respondido",
    tipo: "oficio",
    termino: "2026-09-10",
    archivo: "of_0139.pdf",
    destinatariosPersonas: ["Lic. Carlos Eduardo Martínez López"],
    seguimiento: [
      { autor: "Depto. Desarrollo Turístico", accion: "Respondió el oficio", fecha: "02/09/2026 12:40" },
    ],
  },
  {
    numero: "OF-0130/2026",
    asunto: "Convenio interinstitucional",
    departamento: "Protocolos",
    fecha: "20/08/2026",
    estado: "Cerrado",
    tipo: "oficio",
    termino: "2026-08-22",
    archivo: "of_0130.pdf",
    seguimiento: [
      { autor: "Directora — Desarrollo Turístico", accion: "Cerró el expediente", fecha: "25/08/2026 17:00" },
    ],
  },
  {
    numero: "OF-0128/2026",
    asunto: "Confirmación de participación en feria turística",
    departamento: "Promoción Turística",
    fecha: "18/08/2026",
    estado: "Enviado",
    tipo: "oficio",
    archivo: "of_0128.pdf",
    folioSalida: "SAL-2026-0001",
    fechaEnvio: "19/08/2026 12:30",
    seguimiento: [
      { autor: "Mtra. Fernanda Ibarra Solís", accion: "Se envió el oficio. Folio de salida SAL-2026-0001", fecha: "19/08/2026 12:30" },
    ],
  },
];
