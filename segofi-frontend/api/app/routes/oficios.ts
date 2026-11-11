import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { requireUser } from "../lib/auth.js";
import { ApiError } from "../lib/http.js";
import { registrar } from "../lib/auditoria.js";
import { reservarFolioOficio } from "../lib/folio.js";
import { filtroOficiosSchema } from "../schemas/oficio.js";
import { radicarOficioSchema } from "../schemas/radicar.js";
import { listarOficios, obtenerOficio } from "../lib/query.js";
import type { Database } from "../db/client.js";
import { getDb } from "../db/client.js";
import * as schema from "../db/schema.js";
import type { AppEnv } from "../types.js";

const oficiosRouter = new Hono<AppEnv>();

// Listado de oficios con alcance, filtros y paginación
oficiosRouter.get("/", async (c) => {
  const user = await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  const query = c.req.query();
  const parsed = filtroOficiosSchema.safeParse(query);
  if (!parsed.success) {
    throw new ApiError(400, "Parámetros de búsqueda inválidos", parsed.error.format());
  }

  const paginado = await listarOficios(db, user, parsed.data);
  return c.json(paginado, 200);
});

// Detalle de oficio (404 si está fuera de alcance o no existe)
oficiosRouter.get("/:id", async (c) => {
  const user = await requireUser(c);
  const id = Number(c.req.param("id"));
  if (!id) throw new ApiError(400, "ID de oficio inválido");

  const db: Database = c.get("db") ?? getDb();

  const oficio = await obtenerOficio(db, user, id);
  if (!oficio) {
    throw new ApiError(404, "Oficio no encontrado");
  }

  return c.json({ oficio }, 200);
});

// Radicar nuevo oficio (transaccional: folio + insert + adjuntos + auditoría)
oficiosRouter.post("/", async (c) => {
  const user = await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  let bodyJson: unknown;
  try {
    bodyJson = await c.req.json();
  } catch {
    throw new ApiError(422, "Cuerpo de solicitud JSON inválido");
  }

  const parsed = radicarOficioSchema.safeParse(bodyJson);
  if (!parsed.success) {
    throw new ApiError(422, "Datos de radicación inválidos", parsed.error.format());
  }

  const data = parsed.data;

  // Validar existencia de departamento destino inicial
  const [depto] = await db
    .select()
    .from(schema.departamentos)
    .where(eq(schema.departamentos.id, data.departamento_destino_inicial_id))
    .limit(1);

  if (!depto) {
    throw new ApiError(422, "Departamento de destino inexistente");
  }

  // Validar existencia de tipo de documento
  const [tipoDoc] = await db
    .select()
    .from(schema.tiposDocumento)
    .where(eq(schema.tiposDocumento.id, data.tipo_documento_id))
    .limit(1);

  if (!tipoDoc) {
    throw new ApiError(422, "Tipo de documento inexistente");
  }

  const anio =
    parseInt(data.fecha_documento.split("-")[0], 10) || new Date().getFullYear();
  const ahora = new Date().toISOString();

  // Transacción atómica
  const oficioCreado = await db.transaction(async (tx) => {
    const folio = await reservarFolioOficio(tx, anio);

    const [nuevoOficio] = await tx
      .insert(schema.oficios)
      .values({
        folio,
        tipoDocumentoId: data.tipo_documento_id,
        objeto: data.objeto,
        asunto: data.asunto,
        destinatario: data.destinatario,
        fechaDocumento: data.fecha_documento,
        fechaRecepcion: ahora,
        termino: data.termino ?? null,
        remitenteUsuarioId: user.id,
        origenUsuarioId: user.id,
        departamentoDestinoInicialId: data.departamento_destino_inicial_id,
        estadoId: 1, // Pendiente
        creadoEn: ahora,
      })
      .returning();

    if (data.adjuntos && data.adjuntos.length > 0) {
      for (const adj of data.adjuntos) {
        await tx.insert(schema.adjuntos).values({
          entidadTipo: "OFICIO",
          entidadId: nuevoOficio.id,
          nombreArchivo: adj.nombre_archivo,
          archivoUrl: adj.archivo_url,
          creadoEn: ahora,
        });
      }
    }

    await registrar(tx, {
      usuarioId: user.id,
      accion: "radicar",
      entidad: "oficio",
      entidadId: nuevoOficio.id,
      detalle: `Radicación de oficio ${folio}`,
    });

    return nuevoOficio;
  });

  return c.json({ oficio: oficioCreado }, 201);
});

import seguimientosRouter from "../routes/seguimientos.js";

// Mount sub‑router for seguimientos and lecturas
oficiosRouter.route("/:id/seguimientos", seguimientosRouter);

export default oficiosRouter;
