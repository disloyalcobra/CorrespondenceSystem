import { and, desc, eq, gte, like, lte, sql, type SQL } from "drizzle-orm";
import type { Database } from "../db/client";
import * as schema from "../db/schema";
import type { UsuarioSchema } from "../schemas/auth";
import type { FiltroOficios, OficioResumen, Paginado } from "../schemas/oficio";
import { condicionAlcanceSQL } from "./alcance";

export interface LineaTiempoItem {
  id: number;
  tipo: string;
  contenido?: string;
  departamentoId?: number;
  usuarioId: number;
  fecha: string;
  detalles?: unknown;
}

export interface OficioDetalle extends OficioResumen {
  lineaTiempo: LineaTiempoItem[];
  lecturas: (typeof schema.oficioLecturas.$inferSelect)[];
  adjuntos: (typeof schema.adjuntos.$inferSelect)[];
  salida: typeof schema.oficiosSalidas.$inferSelect | null;
}

export async function listarOficios(
  db: Database,
  u: UsuarioSchema,
  filtros: FiltroOficios,
): Promise<Paginado<OficioResumen>> {
  const condiciones: SQL[] = [condicionAlcanceSQL(u)];

  if (filtros.folio) {
    condiciones.push(like(schema.oficios.folio, `%${filtros.folio}%`));
  }
  if (filtros.asunto) {
    condiciones.push(like(schema.oficios.asunto, `%${filtros.asunto}%`));
  }
  if (filtros.estado_id) {
    condiciones.push(eq(schema.oficios.estadoId, filtros.estado_id));
  }
  if (filtros.tipo_documento_id) {
    condiciones.push(eq(schema.oficios.tipoDocumentoId, filtros.tipo_documento_id));
  }
  if (filtros.fecha_desde) {
    condiciones.push(gte(schema.oficios.fechaDocumento, filtros.fecha_desde));
  }
  if (filtros.fecha_hasta) {
    condiciones.push(lte(schema.oficios.fechaDocumento, filtros.fecha_hasta));
  }

  const whereClause = and(...condiciones);

  // Conteo total
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.oficios)
    .where(whereClause);

  const total = Number(count);
  const page = filtros.page ?? 1;
  const pageSize = filtros.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const data = await db
    .select()
    .from(schema.oficios)
    .where(whereClause)
    .orderBy(desc(schema.oficios.id))
    .limit(pageSize)
    .offset(offset);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

export async function obtenerOficio(
  db: Database,
  u: UsuarioSchema,
  id: number,
): Promise<OficioDetalle | null> {
  const whereClause = and(eq(schema.oficios.id, id), condicionAlcanceSQL(u));

  const [oficio] = await db
    .select()
    .from(schema.oficios)
    .where(whereClause)
    .limit(1);

  if (!oficio) return null;

  // Turnos
  const turnos = await db
    .select()
    .from(schema.oficioTurnos)
    .where(eq(schema.oficioTurnos.oficioId, id))
    .orderBy(desc(schema.oficioTurnos.id));

  // Seguimientos
  const seguimientos = await db
    .select()
    .from(schema.oficioSeguimiento)
    .where(eq(schema.oficioSeguimiento.oficioId, id))
    .orderBy(desc(schema.oficioSeguimiento.id));

  // Lecturas
  const lecturas = await db
    .select()
    .from(schema.oficioLecturas)
    .where(eq(schema.oficioLecturas.oficioId, id));

  // Adjuntos del oficio
  const adjuntos = await db
    .select()
    .from(schema.adjuntos)
    .where(
      and(
        eq(schema.adjuntos.entidadTipo, "OFICIO"),
        eq(schema.adjuntos.entidadId, id),
      ),
    );

  // Salida si existe
  const [salida] = await db
    .select()
    .from(schema.oficiosSalidas)
    .where(eq(schema.oficiosSalidas.oficioId, id))
    .limit(1);

  // Armar línea de tiempo combinada
  const lineaTiempo: LineaTiempoItem[] = [
    ...turnos.map((t) => ({
      id: t.id,
      tipo: "TURNO",
      departamentoId: t.departamentoId,
      usuarioId: t.turnadoPorUsuarioId,
      fecha: t.turnadoEn,
      detalles: { recibidoEn: t.recibidoEn },
    })),
    ...seguimientos.map((s) => ({
      id: s.id,
      tipo: s.tipo || "SEGUIMIENTO",
      contenido: s.contenido,
      usuarioId: s.usuarioId,
      fecha: s.creadoEn,
    })),
  ].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return {
    ...oficio,
    lineaTiempo,
    lecturas,
    adjuntos,
    salida: salida ?? null,
  };
}

