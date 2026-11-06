import { sql, eq, or, type SQL } from "drizzle-orm";
import * as schema from "../db/schema";
import type { UsuarioSchema } from "../schemas/auth";

export const ROLES_TOTALES = [2, 3]; // 2: Administrador, 3: Directora

export function tieneAccesoTotal(u: { rol_id: number }): boolean {
  return ROLES_TOTALES.includes(u.rol_id);
}

export function condicionAlcanceSQL(u: UsuarioSchema): SQL {
  if (tieneAccesoTotal(u)) {
    return sql`1 = 1`;
  }

  const deptoId = u.departamento_id ?? -1;

  return or(
    eq(schema.oficios.departamentoDestinoInicialId, deptoId),
    eq(schema.oficios.remitenteUsuarioId, u.id),
    eq(schema.oficios.origenUsuarioId, u.id),
    sql`EXISTS (
      SELECT 1 FROM ${schema.oficioTurnos}
      WHERE ${schema.oficioTurnos.oficioId} = ${schema.oficios.id}
      AND ${schema.oficioTurnos.departamentoId} = ${deptoId}
    )`,
    sql`EXISTS (
      SELECT 1 FROM ${schema.oficioSeguimiento}
      WHERE ${schema.oficioSeguimiento.oficioId} = ${schema.oficios.id}
      AND ${schema.oficioSeguimiento.usuarioId} = ${u.id}
    )`,
  ) as SQL;
}
