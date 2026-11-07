import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { requireUser } from "../lib/auth";
import { ApiError } from "../lib/http";
import { registrar } from "../lib/auditoria";
import { getDb } from "../db/client";
import type { Database } from "../db/client";
import * as schema from "../db/schema";
import { condicionAlcanceSQL } from "../lib/alcance";
import { getBlobUploader } from "../lib/blob";
import type { AppEnv } from "../types";

// Router para montar en /oficios/:id/adjuntos
export const oficiosAdjuntosRouter = new Hono<AppEnv>();

oficiosAdjuntosRouter.post("/:id/adjuntos", async (c) => {
    const user = await requireUser(c);
    const oficioId = Number(c.req.param("id"));
    if (!oficioId) throw new ApiError(400, "ID de oficio inválido");

    const db: Database = c.get("db") ?? getDb();

    // Validar existencia y alcance del oficio
    const [oficio] = await db
        .select()
        .from(schema.oficios)
        .where(and(eq(schema.oficios.id, oficioId), condicionAlcanceSQL(user)))
        .limit(1);

    if (!oficio) {
        throw new ApiError(404, "Oficio no encontrado");
    }

    // Oficio en estado Enviado (7) es de solo lectura
    if (oficio.estadoId === 7) {
        throw new ApiError(409, "El oficio está en estado terminal y no admite adjuntos");
    }

    const body = await c.req.parseBody();
    const file = body["archivo"];

    if (!file || !(file instanceof File)) {
        throw new ApiError(400, "Se requiere un archivo en el campo 'archivo'");
    }

    const uploader = getBlobUploader();
    const buffer = await file.arrayBuffer();
    const archivoUrl = await uploader.subir(file.name, buffer);
    const ahora = new Date().toISOString();

    const [nuevoAdjunto] = await db.transaction(async (tx) => {
        const [creado] = await tx
            .insert(schema.adjuntos)
            .values({
                entidadTipo: "OFICIO",
                entidadId: oficioId,
                nombreArchivo: file.name,
                archivoUrl,
                creadoEn: ahora,
            })
            .returning();

        await registrar(tx, {
            usuarioId: user.id,
            accion: "adjunto_subir",
            entidad: "oficio",
            entidadId: oficioId,
            detalle: `Adjunto subido: ${file.name}`,
        });

        return [creado];
    });

    return c.json({ adjunto: nuevoAdjunto }, 201);
});

// Router para montar en /adjuntos
export const adjuntosRouter = new Hono<AppEnv>();

adjuntosRouter.get("/:id/url", async (c) => {
    const user = await requireUser(c);
    const adjuntoId = Number(c.req.param("id"));
    if (!adjuntoId) throw new ApiError(400, "ID de adjunto inválido");

    const db: Database = c.get("db") ?? getDb();

    // 1. Obtener adjunto
    const [adjunto] = await db
        .select()
        .from(schema.adjuntos)
        .where(eq(schema.adjuntos.id, adjuntoId))
        .limit(1);

    if (!adjunto) {
        throw new ApiError(404, "Adjunto no encontrado");
    }

    // 2. Si el adjunto pertenece a un oficio, verificar alcance sobre ese oficio
    if (adjunto.entidadTipo === "OFICIO") {
        const [oficio] = await db
            .select()
            .from(schema.oficios)
            .where(and(eq(schema.oficios.id, adjunto.entidadId), condicionAlcanceSQL(user)))
            .limit(1);

        if (!oficio) {
            throw new ApiError(404, "Adjunto no encontrado");
        }
    }

    return c.json({ url: adjunto.archivoUrl }, 200);
});