import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq, and } from "drizzle-orm";
import * as schema from "../app/db/schema";
import { migrar } from "../app/db/migrate";
import { reservarFolioOficio, reservarFolioSalida } from "../app/lib/folio";

describe("lib/folio: Reservas transaccionales de folio por año", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
  });

  it("reserva 3 folios de oficio secuenciales en transacciones: OFI-2026-0001..0003", async () => {
    const anio = 2026;

    const folio1 = await db.transaction(async (tx) => {
      return reservarFolioOficio(tx, anio);
    });

    const folio2 = await db.transaction(async (tx) => {
      return reservarFolioOficio(tx, anio);
    });

    const folio3 = await db.transaction(async (tx) => {
      return reservarFolioOficio(tx, anio);
    });

    expect(folio1).toBe("OFI-2026-0001");
    expect(folio2).toBe("OFI-2026-0002");
    expect(folio3).toBe("OFI-2026-0003");

    // Verificar en tabla consecutivos
    const [fila] = await db
      .select()
      .from(schema.consecutivos)
      .where(
        and(
          eq(schema.consecutivos.nombre, "OFICIO"),
          eq(schema.consecutivos.anio, anio),
        ),
      );

    expect(fila).toBeDefined();
    expect(fila.ultimo).toBe(3);
  });

  it("reserva 5 folios de salida secuenciales: SAL-2026-0001..0005", async () => {
    const anio = 2026;
    const folios: string[] = [];

    for (let i = 0; i < 5; i++) {
      const folio = await db.transaction(async (tx) => {
        return reservarFolioSalida(tx, anio);
      });
      folios.push(folio);
    }

    expect(folios).toEqual([
      "SAL-2026-0001",
      "SAL-2026-0002",
      "SAL-2026-0003",
      "SAL-2026-0004",
      "SAL-2026-0005",
    ]);

    const [fila] = await db
      .select()
      .from(schema.consecutivos)
      .where(
        and(
          eq(schema.consecutivos.nombre, "SALIDA"),
          eq(schema.consecutivos.anio, anio),
        ),
      );

    expect(fila.ultimo).toBe(5);
  });

  it("independencia de consecutivos por año y por tipo", async () => {
    const f2026 = await db.transaction(async (tx) => reservarFolioOficio(tx, 2026));
    const f2027 = await db.transaction(async (tx) => reservarFolioOficio(tx, 2027));
    const s2026 = await db.transaction(async (tx) => reservarFolioSalida(tx, 2026));

    expect(f2026).toBe("OFI-2026-0001");
    expect(f2027).toBe("OFI-2027-0001");
    expect(s2026).toBe("SAL-2026-0001");
  });
});
