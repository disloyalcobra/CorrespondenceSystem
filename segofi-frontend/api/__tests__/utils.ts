import { hash } from "bcryptjs";
import { SignJWT } from "jose";
import { randomUUID } from "node:crypto";
import type { Database } from "../_app/db/client.js";
import * as schema from "../_app/db/schema.js";
import { getEnv } from "../_app/env.js";

/** Genera un JWT de sesión directamente con jose (sin necesitar Hono Context). */
async function generarToken(usuarioId: number, rolId: number, departamentoId: number | null): Promise<string> {
  const secret = new TextEncoder().encode(getEnv().JWT_SECRET);
  return new SignJWT({ sub: String(usuarioId), rol_id: rolId, departamento_id: departamentoId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * Crea un usuario de prueba y devuelve su id y un token JWT válido.
 */
export async function createTestUser(
  db: Database,
  overrides: Partial<{
    rol_id: number;
    departamento_id: number;
    activo: boolean;
    nombre: string;
    email: string;
    password: string;
  }> = {}
) {
  const password = overrides.password ?? "Password123!";
  const passwordHash = await hash(password, 10);

  let deptoId = overrides.departamento_id;
  if (!deptoId) {
    const [dept] = await db
      .insert(schema.departamentos)
      .values({ nombre: "Dept Test", tipo: "INTERNO", activo: true })
      .returning();
    deptoId = dept.id;
  }

  const [usuario] = await db
    .insert(schema.usuarios)
    .values({
      nombre: overrides.nombre ?? "Usuario Test",
      email: (overrides.email ?? `test-${randomUUID()}@example.com`).toLowerCase(),
      passwordHash,
      rolId: overrides.rol_id ?? 2,
      departamentoId: deptoId,
      activo: overrides.activo ?? true,
      creadoEn: new Date().toISOString(),
    })
    .returning();

  const token = await generarToken(usuario.id, usuario.rolId, usuario.departamentoId);

  return {
    id: usuario.id,
    token,
    nombre: usuario.nombre,
    email: usuario.email,
    rol_id: usuario.rolId,
    departamento_id: usuario.departamentoId,
  };
}

/**
 * Crea un oficio de prueba asociado al usuario remitente.
 */
export async function createTestOficio(db: Database, remitenteUsuarioId: number) {
  const [tipoDoc] = await db
    .insert(schema.tiposDocumento)
    .values({ nombre: "Tipo Test", activo: true })
    .returning();

  const [estado] = await db
    .insert(schema.estados)
    .values({ nombre: "Pendiente", orden: 1 })
    .returning();

  const [dept] = await db
    .insert(schema.departamentos)
    .values({ nombre: "Dept Dest", tipo: "INTERNO", activo: true })
    .returning();

  const ahora = new Date().toISOString();

  const [oficio] = await db
    .insert(schema.oficios)
    .values({
      folio: `OFI-${Math.floor(Math.random() * 100000)}`,
      tipoDocumentoId: tipoDoc.id,
      objeto: "Objeto de prueba",
      asunto: "Asunto de prueba",
      destinatario: "Destinatario Test",
      fechaDocumento: ahora.split("T")[0],
      fechaRecepcion: ahora,
      termino: null,
      remitenteUsuarioId: remitenteUsuarioId,
      origenUsuarioId: remitenteUsuarioId,
      departamentoDestinoInicialId: dept.id,
      estadoId: estado.id,
      creadoEn: ahora,
    })
    .returning();

  return oficio;
}
