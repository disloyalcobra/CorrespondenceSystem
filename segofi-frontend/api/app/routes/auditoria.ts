import { Hono } from "hono";
import { AppEnv } from "../types";
import { requireRol } from "../lib/auth";
import { Database } from "../db/client";
import { getDb } from "../db/client";
import * as schema from "../db/schema";
import { and, desc, eq, type SQL } from "drizzle-orm";

const auditoriaRouter = new Hono<AppEnv>();

auditoriaRouter.get("/", requireRol(2, 3), async (c) => {
    const db: Database = c.get("db") ?? getDb();

    const entidad = c.req.query("entidad");
    const usuarioId = c.req.query("usuario_id") ? Number(c.req.query("usuario_id")) : undefined;
    const page = Math.max(1, Number(c.req.query("page")) || 1);
    const limit = Math.max(1, Math.min(100, Number(c.req.query("limit")) || 50));
    const offset = (page - 1) * limit;

    const condiciones: SQL[] = [];
    if (entidad) {
        condiciones.push(eq(schema.auditoria.entidad, entidad));
    }
    if (usuarioId) {
        condiciones.push(eq(schema.auditoria.usuarioId, usuarioId));
    }

    const basQuery = db
        .select({
            id: schema.auditoria.id,
            usuarioiId: schema.auditoria.usuarioId,
            usuarioNombre: schema.usuarios.nombre,
            usuarioEmail: schema.usuarios.email,
            accion: schema.auditoria.accion,
            entidad: schema.auditoria.entidad,
            entidadId: schema.auditoria.entidadId,
            detalle: schema.auditoria.detalle,
            creadoEn: schema.auditoria.creadoEn,
        })
        .from(schema.auditoria)
        .leftJoin(schema.usuarios, eq(schema.auditoria.usuarioId, schema.usuarios.id))
        .orderBy(desc(schema.auditoria.id));

    const registros = condiciones.length > 0
        ? await basQuery.where(and(...condiciones)).limit(limit).offset(offset)
        : await basQuery.limit(limit).offset(offset);

    return c.json({
        data: registros,
        page,
        limit,
    });
});
export default auditoriaRouter;