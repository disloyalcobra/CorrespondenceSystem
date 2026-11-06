import { sqliteTable, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
});

export const departamentos = sqliteTable("departamentos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  tipo: text("tipo").notNull(), // 'INTERNO' | 'EXTERNO'
  activo: integer("activo", { mode: "boolean" }).notNull().default(true),
});

export const tiposDocumento = sqliteTable("tipos_documento", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  activo: integer("activo", { mode: "boolean" }).notNull().default(true),
});

export const estados = sqliteTable("estados", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  orden: integer("orden").notNull(),
});

export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  rolId: integer("rol_id")
    .notNull()
    .references(() => roles.id),
  departamentoId: integer("departamento_id").references(() => departamentos.id),
  activo: integer("activo", { mode: "boolean" }).notNull().default(true),
  creadoEn: text("creado_en").notNull(),
});

export const oficios = sqliteTable("oficios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  folio: text("folio").notNull().unique(),
  tipoDocumentoId: integer("tipo_documento_id")
    .notNull()
    .references(() => tiposDocumento.id),
  objeto: text("objeto").notNull(),
  asunto: text("asunto").notNull(),
  destinatario: text("destinatario").notNull(),
  fechaDocumento: text("fecha_documento").notNull(),
  fechaRecepcion: text("fecha_recepcion").notNull(),
  termino: text("termino"),
  remitenteUsuarioId: integer("remitente_usuario_id")
    .notNull()
    .references(() => usuarios.id),
  origenUsuarioId: integer("origen_usuario_id")
    .notNull()
    .references(() => usuarios.id),
  departamentoDestinoInicialId: integer("departamento_destino_inicial_id")
    .notNull()
    .references(() => departamentos.id),
  estadoId: integer("estado_id")
    .notNull()
    .references(() => estados.id),
  creadoEn: text("creado_en").notNull(),
});

export const adjuntos = sqliteTable("adjuntos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entidadTipo: text("entidad_tipo").notNull(), // 'OFICIO' | 'SEGUIMIENTO'
  entidadId: integer("entidad_id").notNull(),
  nombreArchivo: text("nombre_archivo").notNull(),
  archivoUrl: text("archivo_url").notNull(),
  creadoEn: text("creado_en").notNull(),
});

export const oficioTurnos = sqliteTable("oficio_turnos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  oficioId: integer("oficio_id")
    .notNull()
    .references(() => oficios.id),
  departamentoId: integer("departamento_id")
    .notNull()
    .references(() => departamentos.id),
  turnadoPorUsuarioId: integer("turnado_por_usuario_id")
    .notNull()
    .references(() => usuarios.id),
  turnadoEn: text("turnado_en").notNull(),
  recibidoEn: text("recibido_en"),
});

export const oficioSeguimiento = sqliteTable("oficio_seguimiento", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  oficioId: integer("oficio_id")
    .notNull()
    .references(() => oficios.id),
  usuarioId: integer("usuario_id")
    .notNull()
    .references(() => usuarios.id),
  tipo: text("tipo").notNull(),
  contenido: text("contenido").notNull(),
  creadoEn: text("creado_en").notNull(),
});

export const oficioLecturas = sqliteTable(
  "oficio_lecturas",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    oficioId: integer("oficio_id")
      .notNull()
      .references(() => oficios.id),
    usuarioId: integer("usuario_id")
      .notNull()
      .references(() => usuarios.id),
    leidoEn: text("leido_en").notNull(),
  },
  (table) => [
    uniqueIndex("idx_oficio_usuario_lectura").on(table.oficioId, table.usuarioId),
  ],
);

export const oficiosSalidas = sqliteTable("oficios_salidas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  folio: text("folio").notNull().unique(),
  oficioId: integer("oficio_id")
    .notNull()
    .unique()
    .references(() => oficios.id),
  enviadoPorUsuarioId: integer("enviado_por_usuario_id")
    .notNull()
    .references(() => usuarios.id),
  enviadoEn: text("enviado_en").notNull(),
});

export const auditoria = sqliteTable("auditoria", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  usuarioId: integer("usuario_id").references(() => usuarios.id),
  accion: text("accion").notNull(),
  entidad: text("entidad").notNull(),
  entidadId: integer("entidad_id"),
  detalle: text("detalle"),
  creadoEn: text("creado_en").notNull(),
});

export const consecutivos = sqliteTable(
  "consecutivos",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nombre: text("nombre").notNull(),
    anio: integer("anio").notNull(),
    ultimo: integer("ultimo").notNull().default(0),
  },
  (table) => [
    uniqueIndex("idx_consecutivos_nombre_anio").on(table.nombre, table.anio),
  ],
);
