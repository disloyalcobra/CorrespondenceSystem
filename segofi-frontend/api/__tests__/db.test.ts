import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../_app/db/schema.js";
import { migrar } from "../_app/db/migrate.js";
import { seed } from "../_app/db/seed.js";

describe("Base de datos: Schema, migraciones, seed e integridad", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
  });

  it("los catálogos de estados contienen los IDs 1..7 con los nombres exactos de logica-sistema.md", async () => {
    const estados = await db.select().from(schema.estados).orderBy(schema.estados.id);
    expect(estados).toHaveLength(7);
    expect(estados.map((e) => ({ id: e.id, nombre: e.nombre }))).toEqual([
      { id: 1, nombre: "Pendiente" },
      { id: 2, nombre: "Turnado" },
      { id: 3, nombre: "En proceso" },
      { id: 4, nombre: "Respondido" },
      { id: 5, nombre: "Concluido" },
      { id: 6, nombre: "Vencido" },
      { id: 7, nombre: "Enviado" },
    ]);
  });

  it("el seed crea el usuario admin inicial y catálogos de roles y tipos", async () => {
    const roles = await db.select().from(schema.roles);
    expect(roles.length).toBeGreaterThanOrEqual(3);

    const tipos = await db.select().from(schema.tiposDocumento);
    expect(tipos.length).toBeGreaterThanOrEqual(4);

    const admins = await db
      .select()
      .from(schema.usuarios)
      .where(eq(schema.usuarios.rolId, 2));
    expect(admins.length).toBeGreaterThanOrEqual(1);
    expect(admins[0].activo).toBe(true);
    expect(admins[0].passwordHash).toBeTruthy();
  });

  it("falla al intentar insertar un oficio con folio duplicado", async () => {
    const admin = (await db.select().from(schema.usuarios).limit(1))[0];
    const depto = (await db.select().from(schema.departamentos).limit(1))[0];

    const dataBase = {
      folio: "OFI-2026-0001",
      tipoDocumentoId: 1,
      objeto: "Petición de información",
      asunto: "Asunto inicial",
      destinatario: "Secretaría General",
      fechaDocumento: "2026-01-01",
      fechaRecepcion: new Date().toISOString(),
      remitenteUsuarioId: admin.id,
      origenUsuarioId: admin.id,
      departamentoDestinoInicialId: depto.id,
      estadoId: 1,
      creadoEn: new Date().toISOString(),
    };

    await db.insert(schema.oficios).values(dataBase);

    await expect(
      db.insert(schema.oficios).values({
        ...dataBase,
        asunto: "Otro asunto con mismo folio",
      }),
    ).rejects.toThrow();
  });

  it("falla al intentar insertar un oficio con FK inexistente", async () => {
    const admin = (await db.select().from(schema.usuarios).limit(1))[0];

    await expect(
      db.insert(schema.oficios).values({
        folio: "OFI-2026-9999",
        tipoDocumentoId: 1,
        objeto: "Petición",
        asunto: "Asunto",
        destinatario: "Destinatario",
        fechaDocumento: "2026-01-01",
        fechaRecepcion: new Date().toISOString(),
        remitenteUsuarioId: admin.id,
        origenUsuarioId: admin.id,
        departamentoDestinoInicialId: 999999, // FK inexistente
        estadoId: 1,
        creadoEn: new Date().toISOString(),
      }),
    ).rejects.toThrow();
  });

  it("impide duplicar lecturas de un mismo usuario sobre un mismo oficio", async () => {
    const admin = (await db.select().from(schema.usuarios).limit(1))[0];
    const depto = (await db.select().from(schema.departamentos).limit(1))[0];

    const [oficio] = await db
      .insert(schema.oficios)
      .values({
        folio: "OFI-2026-0002",
        tipoDocumentoId: 1,
        objeto: "Lectura test",
        asunto: "Asunto lectura",
        destinatario: "Destinatario",
        fechaDocumento: "2026-01-01",
        fechaRecepcion: new Date().toISOString(),
        remitenteUsuarioId: admin.id,
        origenUsuarioId: admin.id,
        departamentoDestinoInicialId: depto.id,
        estadoId: 1,
        creadoEn: new Date().toISOString(),
      })
      .returning();

    await db.insert(schema.oficioLecturas).values({
      oficioId: oficio.id,
      usuarioId: admin.id,
      leidoEn: new Date().toISOString(),
    });

    await expect(
      db.insert(schema.oficioLecturas).values({
        oficioId: oficio.id,
        usuarioId: admin.id,
        leidoEn: new Date().toISOString(),
      }),
    ).rejects.toThrow();
  });
});

