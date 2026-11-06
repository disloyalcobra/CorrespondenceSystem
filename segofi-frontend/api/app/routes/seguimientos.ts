import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { requireUser } from "../lib/auth";
import { ApiError } from "../lib/http";
import { registrar } from "../lib/auditoria";
import { getDb } from "../db/client";
import type { Database } from "../db/client";
import * as schema from "../db/schema";
import { seguimientoCreateSchema } from "../schemas/seguimiento";
import { tieneAccesoTotal } from "../lib/alcance";
import type { AppEnv } from "../types";

const seguimientosRouter = new Hono<AppEnv>();

// Estado 7 = Enviado (solo lectura)
const ESTADO_ENVIADO = 7;
// Transiciones permitidas para NOTA/AVANCE
const ESTADOS_ACTIVOS = [2, 3]; // Turnado, En proceso
// Destino de NOTA/AVANCE → En proceso
const ESTADO_EN_PROCESO = 3;
// Destino de RESPUESTA
const ESTADO_RESPONDIDO = 4;
const ESTADO_CONCLUIDO = 5;

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/oficios/:id/seguimientos — listar seguimientos de un oficio
// ─────────────────────────────────────────────────────────────────────────────
seguimientosRouter.get("/", async (c) => {
  await requireUser(c);
  const oficioId = Number(c.req.param("id"));
  if (!oficioId) throw new ApiError(400, "ID de oficio inválido");

  const db: Database = c.get("db") ?? getDb();

  const seguimientos = await db
    .select()
    .from(schema.oficioSeguimiento)
    .where(eq(schema.oficioSeguimiento.oficioId, oficioId))
    .orderBy(schema.oficioSeguimiento.id);

  return c.json({ seguimientos }, 200);
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/oficios/:id/seguimientos — crear nota / avance / respuesta
// ─────────────────────────────────────────────────────────────────────────────
seguimientosRouter.post("/", async (c) => {
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

  const parsed = seguimientoCreateSchema.safeParse(bodyJson);
  if (!parsed.success) {
    throw new ApiError(422, "Datos de seguimiento inválidos", parsed.error.format());
  }
  const { tipo, contenido, decidirConclusion } = parsed.data;

  const ahora = new Date().toISOString();

  const nuevo = await db.transaction(async (tx) => {
    // Obtener el oficio
    const [oficio] = await tx
      .select()
      .from(schema.oficios)
      .where(eq(schema.oficios.id, oficioId))
      .limit(1);

    if (!oficio) {
      throw new ApiError(404, "Oficio no encontrado");
    }

    // Oficio en estado Enviado → solo lectura (409)
    if (oficio.estadoId === ESTADO_ENVIADO) {
      throw new ApiError(409, "El oficio está enviado y no admite más seguimientos");
    }

    // Validar que el usuario tiene acceso al oficio:
    // - Roles con acceso total (2, 3) siempre tienen acceso
    // - Rol 1: solo si es el remitente/origen o si su departamento es el destino inicial
    //   (ya fue verificado por alcance al radicar; aquí validamos para escritura)
    const esAccesoTotal = tieneAccesoTotal(user);

    if (!esAccesoTotal) {
      const esPropietario =
        oficio.remitenteUsuarioId === user.id ||
        oficio.origenUsuarioId === user.id;
      const esDestinoSuDepto =
        user.departamento_id !== null &&
        oficio.departamentoDestinoInicialId === user.departamento_id;

      if (!esPropietario && !esDestinoSuDepto) {
        throw new ApiError(404, "Oficio no encontrado");
      }
    }

    // RESPUESTA: solo permitida al departamento destino o roles 2/3
    if (tipo === "RESPUESTA") {
      const puedeResponder =
        esAccesoTotal ||
        (user.departamento_id !== null &&
          oficio.departamentoDestinoInicialId === user.departamento_id);

      if (!puedeResponder) {
        throw new ApiError(403, "No autorizado para responder este oficio");
      }
    }

    // Insertar seguimiento
    const [creado] = await tx
      .insert(schema.oficioSeguimiento)
      .values({
        oficioId,
        usuarioId: user.id,
        tipo,
        contenido,
        creadoEn: ahora,
      })
      .returning();

    // Cambio de estado según tipo
    let nuevoEstadoId: number | null = null;

    if (tipo === "NOTA" || tipo === "AVANCE") {
      // Solo cambia si el oficio está en estado activo (Turnado o En proceso)
      if (ESTADOS_ACTIVOS.includes(oficio.estadoId)) {
        nuevoEstadoId = ESTADO_EN_PROCESO;
      }
    } else if (tipo === "RESPUESTA") {
      nuevoEstadoId = decidirConclusion ? ESTADO_CONCLUIDO : ESTADO_RESPONDIDO;
    }

    if (nuevoEstadoId !== null && nuevoEstadoId !== oficio.estadoId) {
      await tx
        .update(schema.oficios)
        .set({ estadoId: nuevoEstadoId })
        .where(eq(schema.oficios.id, oficioId));
    }

    // Auditoría
    const accionAuditoria = tipo === "RESPUESTA" ? "responder" : "seguimiento";
    await registrar(tx, {
      usuarioId: user.id,
      accion: accionAuditoria,
      entidad: "oficio",
      entidadId: oficioId,
      detalle: `Seguimiento tipo ${tipo}${tipo === "RESPUESTA" ? ` (conclusion=${decidirConclusion ?? false})` : ""}`,
    });

    return { seguimiento: creado, estadoId: nuevoEstadoId ?? oficio.estadoId };
  });

  return c.json(nuevo, 201);
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/oficios/:id/seguimientos/lecturas — registrar lectura (idempotente)
// ─────────────────────────────────────────────────────────────────────────────
seguimientosRouter.post("/lecturas", async (c) => {
  const user = await requireUser(c);
  const oficioId = Number(c.req.param("id"));
  if (!oficioId) throw new ApiError(400, "ID de oficio inválido");

  const db: Database = c.get("db") ?? getDb();
  const ahora = new Date().toISOString();

  // Verificar que el oficio existe
  const [oficio] = await db
    .select()
    .from(schema.oficios)
    .where(eq(schema.oficios.id, oficioId))
    .limit(1);
  if (!oficio) throw new ApiError(404, "Oficio no encontrado");

  // Verificar si ya existe la lectura de este usuario
  const [existente] = await db
    .select()
    .from(schema.oficioLecturas)
    .where(
      and(
        eq(schema.oficioLecturas.oficioId, oficioId),
        eq(schema.oficioLecturas.usuarioId, user.id),
      ),
    )
    .limit(1);

  if (existente) {
    return c.json({ lectura: existente }, 200);
  }

  const nueva = await db.transaction(async (tx) => {
    const [creado] = await tx
      .insert(schema.oficioLecturas)
      .values({ oficioId, usuarioId: user.id, leidoEn: ahora })
      .returning();

    await registrar(tx, {
      usuarioId: user.id,
      accion: "lectura",
      entidad: "oficio",
      entidadId: oficioId,
      detalle: "Registro de lectura del oficio",
    });

    return creado;
  });

  return c.json({ lectura: nueva }, 201);
});

export default seguimientosRouter;
