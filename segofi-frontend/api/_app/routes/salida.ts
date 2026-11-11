import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { requireUser, requireRol } from "../lib/auth.js";
import { ApiError } from "../lib/http.js";
import { registrar } from "../lib/auditoria.js";
import { reservarFolioSalida } from "../lib/folio.js";
import { getDb } from "../db/client.js";
import type { Database } from "../db/client.js";
import * as schema from "../db/schema.js";
import type { AppEnv } from "../types.js";

const salidasRouter = new Hono<AppEnv>();

salidasRouter.post("/:id/salida", requireRol(2, 3), async (c) => {
  const user = await requireUser(c);
  const oficioId = Number(c.req.param("id"));
  if (!oficioId) throw new ApiError(400, "ID de oficio inválido");

  const db: Database = c.get("db") ?? getDb();
  const anio = new Date().getFullYear();

  const salida = await db.transaction(async (tx) => {
    // 1. Verificar que el oficio existe
    const [oficio] = await tx
      .select()
      .from(schema.oficios)
      .where(eq(schema.oficios.id, oficioId))
      .limit(1);
    if (!oficio) throw new ApiError(404, "Oficio no encontrado");

    // 2. Verificar que no tiene salida ya registrada
    const [existente] = await tx
      .select()
      .from(schema.oficiosSalidas)
      .where(eq(schema.oficiosSalidas.oficioId, oficioId))
      .limit(1);
    if (existente) throw new ApiError(409, "El oficio ya fue enviado");

    // 3. Reservar folio SAL-YYYY-NNNN
    const folio = await reservarFolioSalida(tx, anio);
    const ahora = new Date().toISOString();

    // 4. Cambiar estado a Enviado (7)
    await tx
      .update(schema.oficios)
      .set({ estadoId: 7 })
      .where(eq(schema.oficios.id, oficioId));

    // 5. Insertar registro de salida
    const [nuevaSalida] = await tx
      .insert(schema.oficiosSalidas)
      .values({
        folio,
        oficioId,
        enviadoPorUsuarioId: user.id,
        enviadoEn: ahora,
      })
      .returning();

    // 6. Auditoría
    await registrar(tx, {
      usuarioId: user.id,
      accion: "enviar",
      entidad: "oficio",
      entidadId: oficioId,
      detalle: `Oficio enviado con folio ${folio}`,
    });

    return nuevaSalida;
  });

  return c.json({ salida }, 201);
});

export default salidasRouter;
