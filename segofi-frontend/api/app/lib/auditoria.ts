import type { Database } from "../db/client";
import * as schema from "../db/schema";

export interface DatosAuditoria {
  usuarioId?: number | null;
  accion: string;
  entidad: string;
  entidadId?: number | null;
  detalle?: string | null;
}

export async function registrar(
  dbOrTx: Database | Parameters<Parameters<Database["transaction"]>[0]>[0],
  datos: DatosAuditoria,
) {
  await (dbOrTx as Database).insert(schema.auditoria).values({
    usuarioId: datos.usuarioId ?? null,
    accion: datos.accion,
    entidad: datos.entidad,
    entidadId: datos.entidadId ?? null,
    detalle: datos.detalle ?? null,
    creadoEn: new Date().toISOString(),
  });
}

