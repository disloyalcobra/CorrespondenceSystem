import { Hono } from "hono";
import { and, desc, eq, notExists, sql } from "drizzle-orm";
import { requireUser } from "../lib/auth";
import { getDb } from "../db/client";
import type { Database } from "../db/client";
import * as schema from "../db/schema";
import { condicionAlcanceSQL } from "../lib/alcance";
import type { AppEnv } from "../types";

const notificacionesRouter = new Hono<AppEnv>();

// GET /api/notificaciones
notificacionesRouter.get("/", async (c) => {
  const user = await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  // Obtenemos los oficios en el alcance del usuario
  // y que además tengan un turno pendiente o no hayan sido leídos por este usuario.
  const subqueryLectura = db
    .select({ dummy: sql`1` })
    .from(schema.oficioLecturas)
    .where(
      and(
        eq(schema.oficioLecturas.oficioId, schema.oficios.id),
        eq(schema.oficioLecturas.usuarioId, user.id)
      )
    );

  const oficiosNoLeidos = await db
    .select({
      id: schema.oficios.id,
      folio: schema.oficios.folio,
      asunto: schema.oficios.asunto,
      termino: schema.oficios.termino,
      estadoId: schema.oficios.estadoId,
      creadoEn: schema.oficios.creadoEn,
    })
    .from(schema.oficios)
    .where(
      and(
        condicionAlcanceSQL(user),
        notExists(subqueryLectura)
      )
    )
    .orderBy(desc(schema.oficios.id))
    .limit(50);

  const hoyStr = new Date().toISOString().slice(0, 10);

  const notificaciones = oficiosNoLeidos.map((of) => {
    const vencido = of.termino && of.termino < hoyStr && ![5, 6, 7].includes(of.estadoId);
    return {
      id: of.id,
      oficioId: of.id,
      folio: of.folio,
      asunto: of.asunto,
      tipo: vencido ? "VENCIDO" : "NO_LEIDO",
      fecha: of.creadoEn,
      leido: false,
    };
  });

  return c.json({
    data: notificaciones,
    total: notificaciones.length,
  });
});

export default notificacionesRouter;
