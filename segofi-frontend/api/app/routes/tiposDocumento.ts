import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { requireUser, requireRol } from "../lib/auth";
import { ApiError } from "../lib/http";
import { registrar } from "../lib/auditoria";
import { tipoDocumentoSchema } from "../schemas/catalogos";
import type { Database } from "../db/client";
import { getDb } from "../db/client";
import * as schema from "../db/schema";
import type { AppEnv } from "../types";

const tiposDocumentoRouter = new Hono<AppEnv>();

// Listado de tipos de documento
tiposDocumentoRouter.get("/", async (c) => {
  await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  const tiposDocumento = await db
    .select()
    .from(schema.tiposDocumento)
    .orderBy(schema.tiposDocumento.id);

  return c.json({ tiposDocumento }, 200);
});

// Crear tipo de documento (Admin / Directora)
tiposDocumentoRouter.post("/", requireRol(2, 3), async (c) => {
  const user = await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  let bodyJson: unknown;
  try {
    bodyJson = await c.req.json();
  } catch {
    throw new ApiError(400, "Cuerpo de solicitud JSON inválido");
  }

  const parsed = tipoDocumentoSchema.safeParse(bodyJson);
  if (!parsed.success) {
    throw new ApiError(400, "Datos de tipo de documento inválidos", parsed.error.format());
  }

  const [tipo] = await db
    .insert(schema.tiposDocumento)
    .values({
      nombre: parsed.data.nombre,
      activo: parsed.data.activo ?? true,
    })
    .returning();

  await registrar(db, {
    usuarioId: user.id,
    accion: "crear",
    entidad: "tipo_documento",
    entidadId: tipo.id,
    detalle: `Creación de tipo de documento: ${tipo.nombre}`,
  });

  return c.json({ tipoDocumento: tipo }, 201);
});

// Actualizar tipo de documento
tiposDocumentoRouter.put("/:id", requireRol(2, 3), async (c) => {
  const user = await requireUser(c);
  const id = Number(c.req.param("id"));
  if (!id) throw new ApiError(400, "ID de tipo de documento inválido");

  const db: Database = c.get("db") ?? getDb();

  let bodyJson: unknown;
  try {
    bodyJson = await c.req.json();
  } catch {
    throw new ApiError(400, "Cuerpo de solicitud JSON inválido");
  }

  const parsed = tipoDocumentoSchema.partial().safeParse(bodyJson);
  if (!parsed.success) {
    throw new ApiError(400, "Datos de actualización inválidos", parsed.error.format());
  }

  const [tipo] = await db
    .update(schema.tiposDocumento)
    .set(parsed.data)
    .where(eq(schema.tiposDocumento.id, id))
    .returning();

  if (!tipo) throw new ApiError(404, "Tipo de documento no encontrado");

  await registrar(db, {
    usuarioId: user.id,
    accion: "actualizar",
    entidad: "tipo_documento",
    entidadId: tipo.id,
    detalle: `Actualización de tipo de documento: ${tipo.nombre}`,
  });

  return c.json({ tipoDocumento: tipo }, 200);
});

// Desactivación lógica
tiposDocumentoRouter.delete("/:id", requireRol(2, 3), async (c) => {
  const user = await requireUser(c);
  const id = Number(c.req.param("id"));
  if (!id) throw new ApiError(400, "ID de tipo de documento inválido");

  const db: Database = c.get("db") ?? getDb();

  const [tipo] = await db
    .update(schema.tiposDocumento)
    .set({ activo: false })
    .where(eq(schema.tiposDocumento.id, id))
    .returning();

  if (!tipo) throw new ApiError(404, "Tipo de documento no encontrado");

  await registrar(db, {
    usuarioId: user.id,
    accion: "desactivar",
    entidad: "tipo_documento",
    entidadId: tipo.id,
    detalle: `Desactivación lógica del tipo de documento: ${tipo.nombre}`,
  });

  return c.json({ ok: true, tipoDocumento: tipo }, 200);
});

export default tiposDocumentoRouter;

