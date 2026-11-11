import { and, eq, sql } from "drizzle-orm";
import type { Database } from "../db/client.js";
import * as schema from "../db/schema.js";

export type TransactionOrDb =
  | Database
  | Parameters<Parameters<Database["transaction"]>[0]>[0];

async function reservarSiguienteNumero(
  tx: TransactionOrDb,
  nombre: string,
  anio: number,
): Promise<number> {
  const runner = tx as Database;

  // Insertar fila si no existe aún para este (nombre, anio)
  await runner
    .insert(schema.consecutivos)
    .values({
      nombre,
      anio,
      ultimo: 0,
    })
    .onConflictDoNothing();

  // Incrementar atómicamente y obtener el nuevo valor
  const [filaActualizada] = await runner
    .update(schema.consecutivos)
    .set({
      ultimo: sql`${schema.consecutivos.ultimo} + 1`,
    })
    .where(
      and(
        eq(schema.consecutivos.nombre, nombre),
        eq(schema.consecutivos.anio, anio),
      ),
    )
    .returning({ ultimo: schema.consecutivos.ultimo });

  return filaActualizada.ultimo;
}

export async function reservarFolioOficio(
  tx: TransactionOrDb,
  anio: number,
): Promise<string> {
  const consecutivo = await reservarSiguienteNumero(tx, "OFICIO", anio);
  const padding = String(consecutivo).padStart(4, "0");
  return `OFI-${anio}-${padding}`;
}

export async function reservarFolioSalida(
  tx: TransactionOrDb,
  anio: number,
): Promise<string> {
  const consecutivo = await reservarSiguienteNumero(tx, "SALIDA", anio);
  const padding = String(consecutivo).padStart(4, "0");
  return `SAL-${anio}-${padding}`;
}

