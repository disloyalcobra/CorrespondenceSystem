import bcrypt from "bcryptjs";
import type { Database } from "./client.js";
import * as schema from "./schema.js";
import { getEnv } from "../env.js";

export const ESTADOS_SEED = [
  { id: 1, nombre: "Pendiente", orden: 1 },
  { id: 2, nombre: "Turnado", orden: 2 },
  { id: 3, nombre: "En proceso", orden: 3 },
  { id: 4, nombre: "Respondido", orden: 4 },
  { id: 5, nombre: "Concluido", orden: 5 },
  { id: 6, nombre: "Vencido", orden: 6 },
  { id: 7, nombre: "Enviado", orden: 7 },
];

export const ROLES_SEED = [
  { id: 1, nombre: "Usuario" },
  { id: 2, nombre: "Administrador" },
  { id: 3, nombre: "Directora" },
  { id: 4, nombre: "Jefe de departamento" },
];

export const TIPOS_DOC_SEED = [
  { id: 1, nombre: "Oficio", activo: true },
  { id: 2, nombre: "Memorándum", activo: true },
  { id: 3, nombre: "Circular", activo: true },
  { id: 4, nombre: "Otro", activo: true },
];

export const DEPARTAMENTOS_SEED = [
  { id: 1, nombre: "Promoción Turística", tipo: "INTERNO", activo: true },
  { id: 2, nombre: "Protocolos", tipo: "INTERNO", activo: true },
  { id: 3, nombre: "18 Ote", tipo: "EXTERNO", activo: true },
  { id: 4, nombre: "Desarrollo Turístico", tipo: "INTERNO", activo: true },
  { id: 5, nombre: "Relaciones Públicas", tipo: "INTERNO", activo: true },
];

export async function seed(db: Database) {
  const env = getEnv();

  // Roles
  for (const r of ROLES_SEED) {
    await db
      .insert(schema.roles)
      .values(r)
      .onConflictDoNothing();
  }

  // Estados
  for (const e of ESTADOS_SEED) {
    await db
      .insert(schema.estados)
      .values(e)
      .onConflictDoNothing();
  }

  // Tipos documento
  for (const t of TIPOS_DOC_SEED) {
    await db
      .insert(schema.tiposDocumento)
      .values(t)
      .onConflictDoNothing();
  }

  // Departamentos
  for (const d of DEPARTAMENTOS_SEED) {
    await db
      .insert(schema.departamentos)
      .values(d)
      .onConflictDoNothing();
  }

  // Usuario Administrador Inicial
  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 10);
  const ahora = new Date().toISOString();

  await db
    .insert(schema.usuarios)
    .values({
      nombre: env.SEED_ADMIN_NOMBRE,
      email: env.SEED_ADMIN_EMAIL,
      passwordHash,
      rolId: 2, // Administrador
      departamentoId: 1,
      activo: true,
      creadoEn: ahora,
    })
    .onConflictDoNothing();

  // Registro de auditoría inicial
  await db.insert(schema.auditoria).values({
    usuarioId: null,
    accion: "seed_inicial",
    entidad: "sistema",
    entidadId: null,
    detalle: "Semilla inicial de catálogos y usuario administrador",
    creadoEn: ahora,
  });
}
