import { Hono } from "hono";
import type { Context } from "hono";
import { and, eq } from "drizzle-orm";
import { requireUser } from "../lib/auth";
import { ApiError } from "../lib/http";
import { registrar } from "../lib/auditoria";
import { getDb } from "../db/client";
import type { Database } from "../db/client";
import * as schema from "../db/schema";
import { condicionAlcanceSQL } from "../lib/alcance";
import { esUrlLocal, getBlobUploader, leerArchivoLocal } from "../lib/blob";
import type { AppEnv } from "../types";

const TIPOS_MIME: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
};

function tipoMime(nombreArchivo: string): string {
    const extension = nombreArchivo.split(".").pop()?.toLowerCase() ?? "";
    return TIPOS_MIME[extension] ?? "application/octet-stream";
}

/** Router para montar en /oficios/:id/adjuntos */
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

    let archivoUrl: string;
    try {
        archivoUrl = await uploader.subir(file.name, buffer);
    } catch (error) {
        // Sin credenciales de Vercel Blob (o sin almacenamiento disponible) no debe
        // devolverse un 500 genérico: se informa que el almacenamiento no está disponible.
        console.error("Error al guardar el archivo adjunto:", error);
        throw new ApiError(
            503,
            "El almacenamiento de archivos no está disponible. Configura BLOB_READ_WRITE_TOKEN o revisa el directorio de adjuntos."
        );
    }

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

/**
 * Obtiene un adjunto validando que el usuario tenga alcance sobre el oficio
 * al que pertenece (o devuelve 404 para no revelar su existencia).
 */
async function obtenerAdjuntoConAlcance(
    c: Context<AppEnv>,
    adjuntoId: number
): Promise<typeof schema.adjuntos.$inferSelect> {
    const user = await requireUser(c);
    const db: Database = c.get("db") ?? getDb();

    const [adjunto] = await db
        .select()
        .from(schema.adjuntos)
        .where(eq(schema.adjuntos.id, adjuntoId))
        .limit(1);

    if (!adjunto) {
        throw new ApiError(404, "Adjunto no encontrado");
    }

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

    return adjunto;
}

adjuntosRouter.get("/:id/url", async (c) => {
    const adjuntoId = Number(c.req.param("id"));
    if (!adjuntoId) throw new ApiError(400, "ID de adjunto inválido");

    const adjunto = await obtenerAdjuntoConAlcance(c, adjuntoId);

    // Los archivos locales se sirven siempre por la API para respetar el control de alcance
    const url = esUrlLocal(adjunto.archivoUrl)
        ? `/api/adjuntos/${adjunto.id}/archivo`
        : adjunto.archivoUrl;

    return c.json({ url }, 200);
});

// Descarga del archivo: sirve el contenido local o redirige al almacenamiento remoto
adjuntosRouter.get("/:id/archivo", async (c) => {
    const adjuntoId = Number(c.req.param("id"));
    if (!adjuntoId) throw new ApiError(400, "ID de adjunto inválido");

    const adjunto = await obtenerAdjuntoConAlcance(c, adjuntoId);

    if (!esUrlLocal(adjunto.archivoUrl)) {
        return c.redirect(adjunto.archivoUrl, 302);
    }

    const contenido = await leerArchivoLocal(adjunto.archivoUrl);
    if (!contenido) {
        throw new ApiError(404, "El archivo no está disponible en el servidor");
    }

    return c.body(contenido, 200, {
        "Content-Type": tipoMime(adjunto.nombreArchivo),
        // inline permite abrir el archivo en el navegador; el enlace de descarga
        // del frontend usa el atributo download para guardarlo.
        "Content-Disposition": `inline; filename="${adjunto.nombreArchivo}"`,
    });
});