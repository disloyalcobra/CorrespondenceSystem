import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../_app/db/schema.js";
import { seed } from "../_app/db/seed.js";
import { sql } from "drizzle-orm";
import type { Database } from "../_app/db/client.js";

/**
 * Inicializa una base de datos en memoria para los tests.
 * Nunca usa la base configurada (Turso) ni el archivo local: los tests
 * se aislan por completo del entorno de desarrollo.
 */
export async function initTestDb(): Promise<Database> {
  const client = createClient({ url: ":memory:" });
  await client.execute("PRAGMA foreign_keys = ON;");
  const db = drizzle(client, { schema });

  // Crear todas las tablas del schema si no existen
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS roles (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS departamentos (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      tipo   TEXT NOT NULL,
      activo INTEGER NOT NULL DEFAULT 1
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS tipos_documento (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      activo INTEGER NOT NULL DEFAULT 1
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS estados (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      orden  INTEGER NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS usuarios (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre          TEXT NOT NULL,
      email           TEXT NOT NULL UNIQUE,
      password_hash   TEXT NOT NULL,
      rol_id          INTEGER NOT NULL REFERENCES roles(id),
      departamento_id INTEGER REFERENCES departamentos(id),
      activo          INTEGER NOT NULL DEFAULT 1,
      creado_en       TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS oficios (
      id                             INTEGER PRIMARY KEY AUTOINCREMENT,
      folio                          TEXT NOT NULL UNIQUE,
      tipo_documento_id              INTEGER NOT NULL REFERENCES tipos_documento(id),
      objeto                         TEXT NOT NULL,
      asunto                         TEXT NOT NULL,
      destinatario                   TEXT NOT NULL,
      fecha_documento                TEXT NOT NULL,
      fecha_recepcion                TEXT NOT NULL,
      termino                        TEXT,
      remitente_usuario_id           INTEGER NOT NULL REFERENCES usuarios(id),
      origen_usuario_id              INTEGER NOT NULL REFERENCES usuarios(id),
      departamento_destino_inicial_id INTEGER NOT NULL REFERENCES departamentos(id),
      estado_id                      INTEGER NOT NULL REFERENCES estados(id),
      creado_en                      TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS adjuntos (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      entidad_tipo    TEXT NOT NULL,
      entidad_id      INTEGER NOT NULL,
      nombre_archivo  TEXT NOT NULL,
      archivo_url     TEXT NOT NULL,
      creado_en       TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS oficio_turnos (
      id                     INTEGER PRIMARY KEY AUTOINCREMENT,
      oficio_id              INTEGER NOT NULL REFERENCES oficios(id),
      departamento_id        INTEGER NOT NULL REFERENCES departamentos(id),
      turnado_por_usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      turnado_en             TEXT NOT NULL,
      recibido_en            TEXT
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS oficio_seguimiento (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      oficio_id  INTEGER NOT NULL REFERENCES oficios(id),
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      tipo       TEXT NOT NULL,
      contenido  TEXT NOT NULL,
      creado_en  TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS oficio_lecturas (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      oficio_id  INTEGER NOT NULL REFERENCES oficios(id),
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      leido_en   TEXT NOT NULL,
      UNIQUE(oficio_id, usuario_id)
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS oficios_salidas (
      id                     INTEGER PRIMARY KEY AUTOINCREMENT,
      folio                  TEXT NOT NULL UNIQUE,
      oficio_id              INTEGER NOT NULL UNIQUE REFERENCES oficios(id),
      enviado_por_usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      enviado_en             TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS auditoria (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER REFERENCES usuarios(id),
      accion     TEXT NOT NULL,
      entidad    TEXT NOT NULL,
      entidad_id INTEGER,
      detalle    TEXT,
      creado_en  TEXT NOT NULL
    )
  `);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS consecutivos (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      anio   INTEGER NOT NULL,
      ultimo INTEGER NOT NULL DEFAULT 0,
      UNIQUE(nombre, anio)
    )
  `);

  // Poblar catalogos con datos de seed
  await seed(db);

  return db;
}
