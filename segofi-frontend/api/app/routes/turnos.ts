import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireUser, requireRol } from "../lib/auth";
import { ApiError } from "../lib/http";
import { registrar } from "../lib/auditoria";
import type { Database } from "../db/client";
import { getDb } from "../db/client";
import * as schema from "../db/schema";

const turnosRouter = new Hono();

const crearTurnoSchema = z.object({
  departamento_id: z.number().int().positive("Departamento destino requerido"),
});

turnosRouter.post("/:id/turnos", requireRol(2, 3), async (c) => {
  const user = await requireUser(c);
  const oficioId = Number(c.req.param("id"));
  if (!oficioId) throw new ApiError(400, "ID de oficio inválido");

  const db: Database = c.get("db") ?? getDb();

  let bodyJson: unknown;
  try {
    bodyJson = await c.req.json();
  } catch {
    throw new ApiError(400, "Cuerpo JSON inválido");
  }

  const parsed = crearTurnoSchema.safeParse(bodyJson);
  if (!parsed.success) {
    throw new ApiError(422, "Datos de turno inválidos", parsed.error.format());
  }

  const { departamento_id } = parsed.data;

  // Validar existencia de departamento
  const [depto] = await db
    .select()
    .from(schema.departamentos)
    .where(eq(schema.departamentos.id, departamento_id))
    .limit(1);

  if (!depto) {
    throw new ApiError(422, "Departamento no encontrado");
  }

  // Transacción atómica
  const turnoCreado = await db.transaction(async (tx) => {
    const [oficio] = await tx
      .select()
      .from(schema.oficios)
      .where(eq(schema.oficios.id, oficioId))
      .limit(1);

    if (!oficio) {
      throw new ApiError(404, "Oficio no encontrado");
    }

    // Estados terminales o inmutables (5: Concluido, 7: Enviado)
    if (oficio.estadoId === 7 || oficio.estadoId === 5) {
      throw new ApiError(
        409,
        "El oficio se encuentra en un estado terminal y no puede ser turnado",
      );
    }

    const ahora = new Date().toISOString();

    const [nuevoTurno] = await tx
      .insert(schema.oficioTurnos)
      .values({
        oficioId,
        departamentoId: departamento_id,
        turnadoPorUsuarioId: user.id,
        turnadoEn: ahora,
        recibidoEn: null,
      })
      .returning();

    // Si estaba Pendiente (1), pasa a Turnado (2)
    if (oficio.estadoId === 1) {
      await tx
        .update(schema.oficios)
        .set({ estadoId: 2 })
        .where(eq(schema.oficios.id, oficioId));
    }

    await registrar(tx, {
      usuarioId: user.id,
      accion: "turnar",
      entidad: "oficio",
      entidadId: oficioId,
      detalle: `Turnado al departamento: ${depto.nombre}`,
    });

    return nuevoTurno;
  });

  return c.json({ turno: turnoCreado }, 201);
});

export default turnosRouter;
