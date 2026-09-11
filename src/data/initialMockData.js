/**
 * ============================================================================
 * SISTEMA DE GESTIÓN DE CORRESPONDENCIA Y OFICIOS - SECRETARÍA DE TURISMO (SECTUR)
 * Archivo: src/data/initialMockData.js
 * Propósito: Datos iniciales de prueba estructurados según las tablas y relaciones
 *            definidas en el archivo 'schema.db'.
 * ============================================================================
 */

/**
 * Catálogo de Roles de Usuario (Tabla 'roles' en schema.db)
 * Define las atribuciones y capacidades en la interfaz.
 */
export const INITIAL_ROLES = [
  { id: 1, nombre: 'Oficialía de Partes (Generador)' },
  { id: 2, nombre: 'Directora General' },
  { id: 3, nombre: 'Titular de Departamento' },
  { id: 4, nombre: 'Administrador del Sistema' },
];

/**
 * Catálogo de Departamentos y Áreas Orgánicas (Tabla 'departamentos' en schema.db)
 */
export const INITIAL_DEPARTAMENTOS = [
  { id: 1, nombre: 'Dirección General de Turismo', tipo: 'DIRECCION_GENERAL', clave: 'DGT' },
  { id: 2, nombre: 'Dirección de Protocolos y Eventos', tipo: 'OPERATIVO', clave: 'DPE' },
  { id: 3, nombre: 'Dirección Administrativa (18 Ote)', tipo: 'ADMINISTRATIVO', clave: 'DA18O' },
  { id: 4, nombre: 'Subdirección de Promoción y Mercadotecnia', tipo: 'PROMOCION', clave: 'SPM' },
  { id: 5, nombre: 'Unidad de Asuntos Jurídicos', tipo: 'JURIDICO', clave: 'UAJ' },
  { id: 6, nombre: 'Coordinación de Enlace y Pueblos Mágicos', tipo: 'PROGRAMAS', clave: 'CEPM' },
];

/**
 * Catálogo de Tipos de Documento Oficial (Tabla 'tipos_documento' en schema.db)
 */
export const INITIAL_TIPOS_DOCUMENTO = [
  { id: 1, nombre: 'Oficio Ordinario' },
  { id: 2, nombre: 'Memorándum Interno' },
  { id: 3, nombre: 'Circular General' },
  { id: 4, nombre: 'Tarjeta Informativa' },
  { id: 5, nombre: 'Petición Ciudadana' },
];

/**
 * Catálogo de Estados del Oficio (Tabla 'estados' en schema.db)
 * Define el flujo secuencial desde su radicación hasta su conclusión.
 */
export const INITIAL_ESTADOS = [
  { id: 1, nombre: 'Pendiente', orden: 1, color: 'pendiente' },
  { id: 2, nombre: 'Turnado', orden: 2, color: 'turnado' },
  { id: 3, nombre: 'En Proceso', orden: 3, color: 'proceso' },
  { id: 4, nombre: 'Respondido', orden: 4, color: 'respondido' },
  { id: 5, nombre: 'Concluido', orden: 5, color: 'concluido' },
  { id: 6, nombre: 'Vencido', orden: 6, color: 'vencido' },
];

/**
 * Directorio de Usuarios Institucionales (Tabla 'usuarios' en schema.db)
 */
export const INITIAL_USUARIOS = [
  {
    id: 1,
    nombre: 'Lic. Claudia Hernández Mora',
    email: 'oficialia.partes@turismo.gob.mx',
    cargo: 'Responsable de Oficialía de Partes',
    rol_id: 1, // Rol Generador
    departamento_id: 1,
    activo: true,
    avatar: 'CH'
  },
  {
    id: 2,
    nombre: 'Mtra. Josefina Morales Ramírez',
    email: 'directora.general@turismo.gob.mx',
    cargo: 'Secretaria / Directora General de Turismo',
    rol_id: 2, // Rol Directora
    departamento_id: 1,
    activo: true,
    avatar: 'JM'
  },
  {
    id: 3,
    nombre: 'Lic. Carlos Alberto Mendoza',
    email: 'protocolos@turismo.gob.mx',
    cargo: 'Director de Protocolos y Eventos',
    rol_id: 3, // Rol Titular de Departamento
    departamento_id: 2,
    activo: true,
    avatar: 'CM'
  },
  {
    id: 4,
    nombre: 'C.P. Rosalba Sánchez Trejo',
    email: 'admon.18ote@turismo.gob.mx',
    cargo: 'Directora Administrativa (Sede 18 Ote)',
    rol_id: 3, // Rol Titular de Departamento
    departamento_id: 3,
    activo: true,
    avatar: 'RS'
  },
  {
    id: 5,
    nombre: 'Mtro. Héctor Daniel Aguilar',
    email: 'promocion@turismo.gob.mx',
    cargo: 'Subdirector de Promoción Turística',
    rol_id: 3, // Rol Titular de Departamento
    departamento_id: 4,
    activo: true,
    avatar: 'HA'
  },
  {
    id: 6,
    nombre: 'Ing. Rodrigo Vega Solís',
    email: 'admin.sistemas@turismo.gob.mx',
    cargo: 'Administrador de Tecnologías',
    rol_id: 4, // Rol Administrador del Sistema
    departamento_id: 1,
    activo: true,
    avatar: 'RV'
  }
];

/**
 * Expedientes de Correspondencia (Tabla 'oficios' en schema.db)
 */
export const INITIAL_OFICIOS = [
  {
    id: 1,
    folio: 'SECTUR/DGT/2026/0104',
    tipo_documento_id: 1, // Oficio Ordinario
    asunto: 'Solicitud de stand y logística para Tianguis Turístico México 2026',
    objeto: 'Gestión de espacios institucionales, acreditaciones de artesanos y coordinación del pabellón representativo en el Tianguis Turístico 2026.',
    destinatario: 'C. Gobernador Constitucional del Estado / Asuntos Especiales',
    fecha_documento: '2026-09-02',
    fecha_recepcion: '2026-09-03 09:30:00',
    termino: '2026-09-18',
    remitente_usuario_id: 1,
    origen_usuario_id: 1,
    departamento_destino_inicial_id: 2, // Protocolos
    estado_id: 2, // Turnado
    creado_en: '2026-09-03 09:45:00',
    prioridad: 'ALTA'
  },
  {
    id: 2,
    folio: 'SECTUR/DGT/2026/0105',
    tipo_documento_id: 4, // Tarjeta Informativa
    asunto: 'Informe trimestral de ocupación hotelera y afluencia en Pueblos Mágicos',
    objeto: 'Remisión de datos estadísticos levantados durante la temporada de verano para revisión y validación de la Dirección General.',
    destinatario: 'Mtra. Josefina Morales Ramírez - Secretaria de Turismo',
    fecha_documento: '2026-09-05',
    fecha_recepcion: '2026-09-05 11:15:00',
    termino: '2026-09-20',
    remitente_usuario_id: 1,
    origen_usuario_id: 1,
    departamento_destino_inicial_id: 4, // Promoción
    estado_id: 3, // En Proceso
    creado_en: '2026-09-05 11:30:00',
    prioridad: 'MEDIA'
  },
  {
    id: 3,
    folio: 'SECTUR/DGT/2026/0106',
    tipo_documento_id: 2, // Memorándum Interno
    asunto: 'Requerimiento de comprobaciones de viáticos y compras sede 18 Ote',
    objeto: 'Notificación de cierre presupuestal mensual y entrega obligatoria de facturas y formatos de comisión pendientes.',
    destinatario: 'Todos los Titulares de Área',
    fecha_documento: '2026-09-06',
    fecha_recepcion: '2026-09-06 14:00:00',
    termino: '2026-09-12', // Próximo a vencer
    remitente_usuario_id: 1,
    origen_usuario_id: 1,
    departamento_destino_inicial_id: 3, // 18 Ote
    estado_id: 1, // Pendiente de Turno
    creado_en: '2026-09-06 14:15:00',
    prioridad: 'URGENTE'
  },
  {
    id: 4,
    folio: 'SECTUR/DGT/2026/0098',
    tipo_documento_id: 1, // Oficio Ordinario
    asunto: 'Convenio de colaboración turística y cultural con el Municipio de Cuetzalan',
    objeto: 'Revisión y firma del instrumento jurídico para la promoción del festival del café y huipil 2026.',
    destinatario: 'H. Ayuntamiento de Cuetzalan del Progreso',
    fecha_documento: '2026-08-20',
    fecha_recepcion: '2026-08-21 10:00:00',
    termino: '2026-09-05',
    remitente_usuario_id: 1,
    origen_usuario_id: 1,
    departamento_destino_inicial_id: 5, // Jurídico
    estado_id: 5, // Concluido
    creado_en: '2026-08-21 10:30:00',
    prioridad: 'NORMAL'
  },
  {
    id: 5,
    folio: 'SECTUR/DGT/2026/0107',
    tipo_documento_id: 5, // Petición Ciudadana
    asunto: 'Solicitud de apoyo para festival gastronómico de la Sierra Norte',
    objeto: 'Petición del comité comunitario para difusión en medios digitales del estado y apoyo en material de difusión.',
    destinatario: 'Secretaría de Turismo del Estado',
    fecha_documento: '2026-09-08',
    fecha_recepcion: '2026-09-08 16:20:00',
    termino: '2026-09-25',
    remitente_usuario_id: 1,
    origen_usuario_id: 1,
    departamento_destino_inicial_id: 6, // Pueblos Mágicos
    estado_id: 1, // Pendiente
    creado_en: '2026-09-08 16:35:00',
    prioridad: 'NORMAL'
  }
];

/**
 * Tabla Polimórfica de Archivos Adjuntos (Tabla 'adjuntos' en schema.db)
 */
export const INITIAL_ADJUNTOS = [
  {
    id: 1,
    entidad_tipo: 'OFICIO',
    entidad_id: 1,
    nombre_archivo: 'Oficio_Tianguis_Turistico_2026_SECTUR.pdf',
    archivo_url: '/docs/Oficio_Tianguis_Turistico_2026_SECTUR.pdf',
    tamano: '2.4 MB',
    creado_en: '2026-09-03 09:45:00'
  },
  {
    id: 2,
    entidad_tipo: 'OFICIO',
    entidad_id: 2,
    nombre_archivo: 'Informe_Estadistico_Ocupacion_Verano.pdf',
    archivo_url: '/docs/Informe_Estadistico_Ocupacion_Verano.pdf',
    tamano: '5.1 MB',
    creado_en: '2026-09-05 11:30:00'
  },
  {
    id: 3,
    entidad_tipo: 'OFICIO',
    entidad_id: 3,
    nombre_archivo: 'Circular_Cierre_Presupuestal_Viaticos.pdf',
    archivo_url: '/docs/Circular_Cierre_Presupuestal_Viaticos.pdf',
    tamano: '1.2 MB',
    creado_en: '2026-09-06 14:15:00'
  },
  {
    id: 4,
    entidad_tipo: 'SEGUIMIENTO',
    entidad_id: 3,
    nombre_archivo: 'Respuesta_Convenio_Cuetzalan_Firmado.pdf',
    archivo_url: '/docs/Respuesta_Convenio_Cuetzalan_Firmado.pdf',
    tamano: '3.8 MB',
    creado_en: '2026-08-30 12:00:00'
  }
];

/**
 * Historial de Asignaciones y Turnos (Tabla 'oficio_turnos' en schema.db)
 */
export const INITIAL_TURNOS = [
  {
    id: 1,
    oficio_id: 1,
    departamento_id: 2, // Protocolos y Eventos
    turnado_por_usuario_id: 2, // Directora General
    turnado_en: '2026-09-03 12:00:00',
    recibido_en: '2026-09-03 13:10:00',
    instrucciones: 'Por favor atender con carácter de urgente. Coordinar con los artesanos de la Sierra y prever el stand oficial de 120m².'
  },
  {
    id: 2,
    oficio_id: 2,
    departamento_id: 4, // Promoción Turística
    turnado_por_usuario_id: 2,
    turnado_en: '2026-09-05 13:30:00',
    recibido_en: '2026-09-05 14:00:00',
    instrucciones: 'Analizar comparativo respecto al año 2025 para presentación ante el gabinete de desarrollo económico.'
  },
  {
    id: 3,
    oficio_id: 4,
    departamento_id: 5, // Asuntos Jurídicos
    turnado_por_usuario_id: 2,
    turnado_en: '2026-08-21 11:00:00',
    recibido_en: '2026-08-21 11:25:00',
    instrucciones: 'Emitir dictamen de procedencia legal y validar facultades del presidente municipal.'
  }
];

/**
 * Historial de Seguimientos, Observaciones y Respuestas (Tabla 'oficio_seguimiento' en schema.db)
 */
export const INITIAL_SEGUIMIENTOS = [
  {
    id: 1,
    oficio_id: 1,
    usuario_id: 3, // Lic. Carlos Mendoza (Protocolos)
    tipo: 'OBSERVACION',
    contenido: 'Se estableció contacto con el comité organizador de Tianguis Turístico. Se envió plano preliminar para selección de ubicación del pabellón.',
    creado_en: '2026-09-04 10:15:00'
  },
  {
    id: 2,
    oficio_id: 2,
    usuario_id: 5, // Mtro. Héctor Aguilar (Promoción)
    tipo: 'AVANCE',
    contenido: 'Datos recopilados de 10 Pueblos Mágicos. Tasa de ocupación promedio registrada del 76.4%, superando en 4.2% el periodo anterior.',
    creado_en: '2026-09-07 09:40:00'
  },
  {
    id: 3,
    oficio_id: 4,
    usuario_id: 5, // Jurídico
    tipo: 'RESPUESTA_FORMAL',
    contenido: 'Se revisó y dictaminó favorablemente el convenio de colaboración turística. Se anexa documento firmado por el área jurídica.',
    creado_en: '2026-08-30 12:00:00'
  }
];

/**
 * Registro de Lecturas de Oficios por Usuario (Tabla 'oficio_lecturas' en schema.db)
 */
export const INITIAL_LECTURAS = [
  { id: 1, oficio_id: 1, usuario_id: 2, leido_en: '2026-09-03 11:30:00' },
  { id: 2, oficio_id: 1, usuario_id: 3, leido_en: '2026-09-03 13:10:00' },
  { id: 3, oficio_id: 2, usuario_id: 5, leido_en: '2026-09-05 14:00:00' },
  { id: 4, oficio_id: 3, usuario_id: 2, leido_en: '2026-09-07 08:30:00' }
];

/**
 * Bitácora Inmutable de Auditoría (Tabla 'auditoria' en schema.db)
 */
export const INITIAL_AUDITORIA = [
  {
    id: 1,
    usuario_id: 1,
    accion: 'CREAR_OFICIO',
    entidad: 'oficios',
    entidad_id: 1,
    detalle: 'Ingreso inicial del oficio SECTUR/DGT/2026/0104 en Oficialía de Partes con 1 anexo PDF.',
    creado_en: '2026-09-03 09:45:00'
  },
  {
    id: 2,
    usuario_id: 2,
    accion: 'TURNAR_OFICIO',
    entidad: 'oficio_turnos',
    entidad_id: 1,
    detalle: 'La Directora turnó el oficio SECTUR/DGT/2026/0104 al departamento de Protocolos y Eventos.',
    creado_en: '2026-09-03 12:00:00'
  },
  {
    id: 3,
    usuario_id: 3,
    accion: 'REGISTRAR_SEGUIMIENTO',
    entidad: 'oficio_seguimiento',
    entidad_id: 1,
    detalle: 'Protocolos y Eventos agregó observación técnica sobre avance con comité de Tianguis Turístico.',
    creado_en: '2026-09-04 10:15:00'
  },
  {
    id: 4,
    usuario_id: 1,
    accion: 'CREAR_OFICIO',
    entidad: 'oficios',
    entidad_id: 3,
    detalle: 'Ingreso de memorándum interno SECTUR/DGT/2026/0106 de comprobaciones de viáticos.',
    creado_en: '2026-09-06 14:15:00'
  }
];
