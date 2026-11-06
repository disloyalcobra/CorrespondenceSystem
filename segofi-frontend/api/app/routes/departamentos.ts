import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { requireUser, requireRol } from "../lib/auth";
import { ApiError } from "../lib/http";
import { registrar } from "../lib/auditoria";
import { departamentoSchema } from "../schemas/catalogos";
import type { Database } from "../db/client";
import { getDb } from "../db/client";
import * as schema from "../db/schema";
import type { AppEnv } from "../types";

const departamentosRouter = new Hono<AppEnv>();

// Listado de departamentos
departamentosRouter.get("/", async (c) => {
  await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  const departamentos = await db
    .select()
    .from(schema.departamentos)
    .orderBy(schema.departamentos.id);

  return c.json({ departamentos }, 200);
});

// Crear departamento (Admin / Directora)
departamentosRouter.post("/", requireRol(2, 3), async (c) => {
  const user = await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  let bodyJson: unknown;
  try {
    bodyJson = await c.req.json();
  } catch {
    throw new ApiError(400, "Cuerpo de solicitud JSON inválido");
  }

  const parsed = departamentoSchema.safeParse(bodyJson);
  if (!parsed.success) {
    throw new ApiError(400, "Datos de departamento inválidos", parsed.error.format());
  }

  const [depto] = await db
    .insert(schema.departamentos)
    .values({
      nombre: parsed.data.nombre,
      tipo: parsed.data.tipo,
      activo: parsed.data.activo ?? true,
    })
    .returning();

  await registrar(db, {
    usuarioId: user.id,
    accion: "crear",
    entidad: "departamento",
    entidadId: depto.id,
    detalle: `Creación de departamento: ${depto.nombre}`,
  });

  return c.json({ departamento: depto }, 201);
});

// Actualizar departamento
departamentosRouter.put("/:id", requireRol(2, 3), async (c) => {
  const user = await requireUser(c);
  const id = Number(c.req.param("id"));
  if (!id) throw new ApiError(400, "ID de departamento inválido");

  const db: Database = c.get("db") ?? getDb();

  let bodyJson: unknown;
  try {
    bodyJson = await c.req.json();
  } catch {
    throw new ApiError(400, "Cuerpo de solicitud JSON inválido");
  }

  const parsed = departamentoSchema.partial().safeParse(bodyJson);
  if (!parsed.success) {
    throw new ApiError(400, "Datos de actualización inválidos", parsed.error.format());
  }

  const [depto] = await db
    .update(schema.departamentos)
    .set(parsed.data)
    .where(eq(schema.departamentos.id, id))
    .returning();

  if (!depto) throw new ApiError(404, "Departamento no encontrado");

  await registrar(db, {
    usuarioId: user.id,
    accion: "actualizar",
    entidad: "departamento",
    entidadId: depto.id,
    detalle: `Actualización de departamento: ${depto.nombre}`,
  });

  return c.json({ departamento: depto }, 200);
});

// Desactivación lógica
departamentosRouter.delete("/:id", requireRol(2, 3), async (c) => {
  const user = await requireUser(c);
  const id = Number(c.req.param("id"));
  if (!id) throw new ApiError(400, "ID de departamento inválido");

  const db: Database = c.get("db") ?? getDb();

  const [depto] = await db
    .update(schema.departamentos)
    .set({ activo: false })
    .where(eq(schema.departamentos.id, id))
    .returning();

  if (!depto) throw new ApiError(404, "Departamento no encontrado");

  await registrar(db, {
    usuarioId: user.id,
    accion: "desactivar",
    entidad: "departamento",
    entidadId: depto.id,
    detalle: `Desactivación lógica del departamento: ${depto.nombre}`,
  });

  return c.json({ ok: true, departamento: depto }, 200);
});

export default departamentosRouter;

