import { sql } from "drizzle-orm";
import type { Database } from "./client";

export const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS \`roles\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`nombre\` text NOT NULL
);
CREATE TABLE IF NOT EXISTS \`departamentos\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`nombre\` text NOT NULL,
	\`tipo\` text NOT NULL,
	\`activo\` integer DEFAULT true NOT NULL
);
CREATE TABLE IF NOT EXISTS \`tipos_documento\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`nombre\` text NOT NULL,
	\`activo\` integer DEFAULT true NOT NULL
);
CREATE TABLE IF NOT EXISTS \`estados\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`nombre\` text NOT NULL,
	\`orden\` integer NOT NULL
);
CREATE TABLE IF NOT EXISTS \`usuarios\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`nombre\` text NOT NULL,
	\`email\` text NOT NULL,
	\`password_hash\` text NOT NULL,
	\`rol_id\` integer NOT NULL,
	\`departamento_id\` integer,
	\`activo\` integer DEFAULT true NOT NULL,
	\`creado_en\` text NOT NULL,
	FOREIGN KEY (\`rol_id\`) REFERENCES \`roles\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`departamento_id\`) REFERENCES \`departamentos\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE UNIQUE INDEX IF NOT EXISTS \`usuarios_email_unique\` ON \`usuarios\` (\`email\`);
CREATE TABLE IF NOT EXISTS \`oficios\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`folio\` text NOT NULL,
	\`tipo_documento_id\` integer NOT NULL,
	\`objeto\` text NOT NULL,
	\`asunto\` text NOT NULL,
	\`destinatario\` text NOT NULL,
	\`fecha_documento\` text NOT NULL,
	\`fecha_recepcion\` text NOT NULL,
	\`termino\` text,
	\`remitente_usuario_id\` integer NOT NULL,
	\`origen_usuario_id\` integer NOT NULL,
	\`departamento_destino_inicial_id\` integer NOT NULL,
	\`estado_id\` integer NOT NULL,
	\`creado_en\` text NOT NULL,
	FOREIGN KEY (\`tipo_documento_id\`) REFERENCES \`tipos_documento\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`remitente_usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`origen_usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`departamento_destino_inicial_id\`) REFERENCES \`departamentos\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`estado_id\`) REFERENCES \`estados\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE UNIQUE INDEX IF NOT EXISTS \`oficios_folio_unique\` ON \`oficios\` (\`folio\`);
CREATE TABLE IF NOT EXISTS \`adjuntos\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`entidad_tipo\` text NOT NULL,
	\`entidad_id\` integer NOT NULL,
	\`nombre_archivo\` text NOT NULL,
	\`archivo_url\` text NOT NULL,
	\`creado_en\` text NOT NULL
);
CREATE TABLE IF NOT EXISTS \`oficio_turnos\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`oficio_id\` integer NOT NULL,
	\`departamento_id\` integer NOT NULL,
	\`turnado_por_usuario_id\` integer NOT NULL,
	\`turnado_en\` text NOT NULL,
	\`recibido_en\` text,
	FOREIGN KEY (\`oficio_id\`) REFERENCES \`oficios\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`departamento_id\`) REFERENCES \`departamentos\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`turnado_por_usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE IF NOT EXISTS \`oficio_seguimiento\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`oficio_id\` integer NOT NULL,
	\`usuario_id\` integer NOT NULL,
	\`tipo\` text NOT NULL,
	\`contenido\` text NOT NULL,
	\`creado_en\` text NOT NULL,
	FOREIGN KEY (\`oficio_id\`) REFERENCES \`oficios\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE IF NOT EXISTS \`oficio_lecturas\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`oficio_id\` integer NOT NULL,
	\`usuario_id\` integer NOT NULL,
	\`leido_en\` text NOT NULL,
	FOREIGN KEY (\`oficio_id\`) REFERENCES \`oficios\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE UNIQUE INDEX IF NOT EXISTS \`idx_oficio_usuario_lectura\` ON \`oficio_lecturas\` (\`oficio_id\`,\`usuario_id\`);
CREATE TABLE IF NOT EXISTS \`oficios_salidas\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`folio\` text NOT NULL,
	\`oficio_id\` integer NOT NULL,
	\`enviado_por_usuario_id\` integer NOT NULL,
	\`enviado_en\` text NOT NULL,
	FOREIGN KEY (\`oficio_id\`) REFERENCES \`oficios\`(\`id\`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (\`enviado_por_usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE UNIQUE INDEX IF NOT EXISTS \`oficios_salidas_folio_unique\` ON \`oficios_salidas\` (\`folio\`);
CREATE UNIQUE INDEX IF NOT EXISTS \`oficios_salidas_oficio_id_unique\` ON \`oficios_salidas\` (\`oficio_id\`);
CREATE TABLE IF NOT EXISTS \`auditoria\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`usuario_id\` integer,
	\`accion\` text NOT NULL,
	\`entidad\` text NOT NULL,
	\`entidad_id\` integer,
	\`detalle\` text,
	\`creado_en\` text NOT NULL,
	FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE IF NOT EXISTS \`consecutivos\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`nombre\` text NOT NULL,
	\`anio\` integer NOT NULL,
	\`ultimo\` integer DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS \`idx_consecutivos_nombre_anio\` ON \`consecutivos\` (\`nombre\`,\`anio\`);
`;

export async function migrar(db: Database) {
  const statements = MIGRATION_SQL.split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await db.run(sql.raw(statement));
  }
}
