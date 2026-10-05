export interface EventoSeguimiento {
  id: number;
  oficio_id: number;
  usuario_id: number;
  tipo: string;
  contenido: string;
  creado_en: string;
}

export interface AdjuntoOficio {
  id: number;
  entidad_tipo: string;
  entidad_id: number;
  nombre_archivo: string;
  archivo_url: string;
  creado_en: string;
}

export interface Oficio {
  id: number;
  folio: string;
  tipo_documento_id: number;
  objeto: string;
  asunto: string;
  destinatario: string;
  fecha_documento: string;
  fecha_recepcion: string;
  termino?: string;
  remitente_usuario_id: number;
  origen_usuario_id: number;
  departamento_destino_inicial_id: number;
  estado_id: number;
  creado_en: string;

  // Opcionales para el frontend
  adjuntos?: AdjuntoOficio[];
  seguimiento?: EventoSeguimiento[];
}

export const OFICIOS_DEMO: Oficio[] = [
  {
    id: 1,
    folio: "OF-0142/2026",
    tipo_documento_id: 1,
    objeto: "Solicitar información",
    asunto: "Solicitud de información turística",
    destinatario: "Lic. Carlos Martínez",
    fecha_documento: "2026-09-12",
    fecha_recepcion: "2026-09-12T09:00:00Z",
    termino: "2026-10-08",
    remitente_usuario_id: 1,
    origen_usuario_id: 1,
    departamento_destino_inicial_id: 1,
    estado_id: 1,
    creado_en: "2026-09-12T09:00:00Z",
    seguimiento: [],
    adjuntos: []
  },
  {
    id: 2,
    folio: "OF-0143/2026",
    tipo_documento_id: 1,
    objeto: "Reporte Mensual",
    asunto: "Reporte de actividades de promoción Septiembre",
    destinatario: "Mtra. Fernanda Ibarra",
    fecha_documento: "2026-09-15",
    fecha_recepcion: "2026-09-15T10:30:00Z",
    termino: "2026-09-30",
    remitente_usuario_id: 3,
    origen_usuario_id: 3,
    departamento_destino_inicial_id: 1,
    estado_id: 2,
    creado_en: "2026-09-15T10:30:00Z",
    seguimiento: [
      { id: 101, oficio_id: 2, usuario_id: 2, tipo: "Nota", contenido: "Revisando cifras de asistencia", creado_en: "2026-09-16T11:00:00Z" }
    ],
    adjuntos: []
  },
  {
    id: 3,
    folio: "OF-0144/2026",
    tipo_documento_id: 2,
    objeto: "Circular Interna",
    asunto: "Nuevas políticas de viáticos 2026",
    destinatario: "Todo el personal",
    fecha_documento: "2026-09-20",
    fecha_recepcion: "2026-09-20T08:00:00Z",
    termino: "2026-10-20",
    remitente_usuario_id: 2,
    origen_usuario_id: 2,
    departamento_destino_inicial_id: 2,
    estado_id: 1,
    creado_en: "2026-09-20T08:00:00Z",
    seguimiento: [],
    adjuntos: []
  },
  {
    id: 4,
    folio: "OF-0145/2026",
    tipo_documento_id: 1,
    objeto: "Convenio de Colaboración",
    asunto: "Alianza con Hoteles de Puebla",
    destinatario: "Cámara Nacional de Hoteles",
    fecha_documento: "2026-09-22",
    fecha_recepcion: "2026-09-22T14:00:00Z",
    termino: "2026-10-22",
    remitente_usuario_id: 3,
    origen_usuario_id: 3,
    departamento_destino_inicial_id: 4,
    estado_id: 3,
    creado_en: "2026-09-22T14:00:00Z",
    seguimiento: [
      { id: 102, oficio_id: 4, usuario_id: 4, tipo: "Turno", contenido: "Turnado a Desarrollo Turístico para validación técnica", creado_en: "2026-09-23T09:00:00Z" }
    ],
    adjuntos: []
  },
  {
    id: 5,
    folio: "OF-0146/2026",
    tipo_documento_id: 3,
    objeto: "Invitación",
    asunto: "Evento Feria Internacional del Libro",
    destinatario: "Lic. Ana Rojas",
    fecha_documento: "2026-09-25",
    fecha_recepcion: "2026-09-25T11:00:00Z",
    termino: "2026-10-05",
    remitente_usuario_id: 1,
    origen_usuario_id: 1,
    departamento_destino_inicial_id: 2,
    estado_id: 4,
    creado_en: "2026-09-25T11:00:00Z",
    seguimiento: [
      { id: 103, oficio_id: 5, usuario_id: 1, tipo: "Respuesta", contenido: "Se confirma asistencia al evento", creado_en: "2026-09-27T15:00:00Z" }
    ],
    adjuntos: []
  },
  {
    id: 6,
    folio: "OF-0147/2026",
    tipo_documento_id: 1,
    objeto: "Queja Ciudadana",
    asunto: "Mantenimiento de señalética en Centro Histórico",
    destinatario: "Dirección de Obra Pública",
    fecha_documento: "2026-09-28",
    fecha_recepcion: "2026-09-28T16:00:00Z",
    termino: "2026-10-15",
    remitente_usuario_id: 4,
    origen_usuario_id: 4,
    departamento_destino_inicial_id: 1,
    estado_id: 2,
    creado_en: "2026-09-28T16:00:00Z",
    seguimiento: [],
    adjuntos: []
  },
  {
    id: 7,
    folio: "OF-0148/2026",
    tipo_documento_id: 1,
    objeto: "Presupuesto",
    asunto: "Asignación de fondos para campaña Invierno",
    destinatario: "Tesorería General",
    fecha_documento: "2026-09-30",
    fecha_recepcion: "2026-09-30T10:00:00Z",
    termino: "2026-10-10",
    remitente_usuario_id: 3,
    origen_usuario_id: 3,
    departamento_destino_inicial_id: 1,
    estado_id: 1,
    creado_en: "2026-09-30T10:00:00Z",
    seguimiento: [],
    adjuntos: []
  },
  {
    id: 8,
    folio: "OF-0149/2026",
    tipo_documento_id: 2,
    objeto: "Memorándum",
    asunto: "Ajuste de horarios horario de verano",
    destinatario: "Personal Administrativo",
    fecha_documento: "2026-10-01",
    fecha_recepcion: "2026-10-01T09:00:00Z",
    termino: "2026-10-05",
    remitente_usuario_id: 2,
    origen_usuario_id: 2,
    departamento_destino_inicial_id: 2,
    estado_id: 3,
    creado_en: "2026-10-01T09:00:00Z",
    seguimiento: [
      { id: 104, oficio_id: 8, usuario_id: 1, tipo: "Turno", contenido: "Turnado para difusión en Protocolos", creado_en: "2026-10-02T10:00:00Z" }
    ],
    adjuntos: []
  },
  {
    id: 9,
    folio: "OF-0150/2026",
    tipo_documento_id: 1,
    objeto: "Solicitud de Apoyo",
    asunto: "Patrocinio para evento cultural local",
    destinatario: "Secretaría de Cultura",
    fecha_documento: "2026-10-02",
    fecha_recepcion: "2026-10-02T12:00:00Z",
    termino: "2026-10-20",
    remitente_usuario_id: 1,
    origen_usuario_id: 1,
    departamento_destino_inicial_id: 1,
    estado_id: 2,
    creado_en: "2026-10-02T12:00:00Z",
    seguimiento: [],
    adjuntos: []
  },
  {
    id: 10,
    folio: "OF-0151/2026",
    tipo_documento_id: 1,
    objeto: "Acuerdo",
    asunto: "Sincronización de calendarios festivos",
    destinatario: "Gobierno del Estado",
    fecha_documento: "2026-10-03",
    fecha_recepcion: "2026-10-03T15:00:00Z",
    termino: "2026-10-15",
    remitente_usuario_id: 3,
    origen_usuario_id: 3,
    departamento_destino_inicial_id: 4,
    estado_id: 6,
    creado_en: "2026-10-03T15:00:00Z",
    seguimiento: [
      { id: 105, oficio_id: 10, usuario_id: 2, tipo: "Envio", contenido: "Oficio enviado con folio SAL-2026-0001", creado_en: "2026-10-04T11:00:00Z" }
    ],
    adjuntos: []
  }
];
