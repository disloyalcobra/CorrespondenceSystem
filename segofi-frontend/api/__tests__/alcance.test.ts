import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../_app/db/schema.js";
import { migrar } from "../_app/db/migrate.js";
import { seed } from "../_app/db/seed.js";
import { createApp } from "../index.js";
import { hashPassword } from "../_app/lib/auth.js";

describe("Alcance server-side, listado y detalle de oficios", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let app: ReturnType<typeof createApp>;

  let cookieDept1: string;
  let cookieDept2: string;
  let cookieDirectora: string;

  let oficioDept1Id: number;
  let oficioDept2Id: number;
  let oficioTurnadoADept1Id: number;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
    app = createApp(db);

    const pw = await hashPassword("Password123!");
    const ahora = new Date().toISOString();

    // 1. Usuario Dept 1 (Rol 1, Dept 1)
    const [uDept1] = await db
      .insert(schema.usuarios)
      .values({
        nombre: "Operativo Dept 1",
        email: "op1@sectur.gob.mx",
        passwordHash: pw,
        rolId: 1,
        departamentoId: 1, // Promoción Turística
        activo: true,
        creadoEn: ahora,
      })
      .returning();

    // 2. Usuario Dept 2 (Rol 1, Dept 2)
    const [uDept2] = await db
      .insert(schema.usuarios)
      .values({
        nombre: "Operativo Dept 2",
        email: "op2@sectur.gob.mx",
        passwordHash: pw,
        rolId: 1,
        departamentoId: 2, // Protocolos
        activo: true,
        creadoEn: ahora,
      })
      .returning();

    // 3. Directora (Rol 3)
    const [uDirectora] = await db
      .insert(schema.usuarios)
      .values({
        nombre: "Directora General",
        email: "directora@sectur.gob.mx",
        passwordHash: pw,
        rolId: 3, // Directora
        departamentoId: 1,
        activo: true,
        creadoEn: ahora,
      })
      .returning();

    // 4. Admin para autorías
    const [admin] = await db.select().from(schema.usuarios).limit(1);

    // Creamos oficios para prueba de alcance
    // Oficio A: Destino Dept 1
    const [oficioA] = await db
      .insert(schema.oficios)
      .values({
        folio: "OFI-2026-0001",
        tipoDocumentoId: 1,
        objeto: "Petición Turismo Dept 1",
        asunto: "Turismo Promoción",
        destinatario: "Director de Promoción",
        fechaDocumento: "2026-02-01",
        fechaRecepcion: ahora,
        remitenteUsuarioId: admin.id,
        origenUsuarioId: admin.id,
        departamentoDestinoInicialId: 1,
        estadoId: 1, // Pendiente
        creadoEn: ahora,
      })
      .returning();
    oficioDept1Id = oficioA.id;

    // Oficio B: Destino Dept 2
    const [oficioB] = await db
      .insert(schema.oficios)
      .values({
        folio: "OFI-2026-0002",
        tipoDocumentoId: 2,
        objeto: "Petición Protocolos Dept 2",
        asunto: "Asunto Reservado Dept 2",
        destinatario: "Jefe de Protocolos",
        fechaDocumento: "2026-02-10",
        fechaRecepcion: ahora,
        remitenteUsuarioId: admin.id,
        origenUsuarioId: admin.id,
        departamentoDestinoInicialId: 2,
        estadoId: 2, // Turnado
        creadoEn: ahora,
      })
      .returning();
    oficioDept2Id = oficioB.id;

    // Oficio C: Destino Inicial Dept 2, pero turnado a Dept 1
    const [oficioC] = await db
      .insert(schema.oficios)
      .values({
        folio: "OFI-2026-0003",
        tipoDocumentoId: 1,
        objeto: "Coordinación Interdepartamental",
        asunto: "Apoyo conjunto Dept 1 y 2",
        destinatario: "Secretaría",
        fechaDocumento: "2026-02-15",
        fechaRecepcion: ahora,
        remitenteUsuarioId: admin.id,
        origenUsuarioId: admin.id,
        departamentoDestinoInicialId: 2,
        estadoId: 2,
        creadoEn: ahora,
      })
      .returning();
    oficioTurnadoADept1Id = oficioC.id;

    // Insertar turno hacia Dept 1
    await db.insert(schema.oficioTurnos).values({
      oficioId: oficioC.id,
      departamentoId: 1, // Dept 1 participa aquí
      turnadoPorUsuarioId: admin.id,
      turnadoEn: ahora,
    });

    // Iniciar sesiones
    const loginD1 = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: uDept1.email, password: "Password123!" }),
    });
    cookieDept1 = (loginD1.headers.get("set-cookie") || "").split(";")[0];

    const loginD2 = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: uDept2.email, password: "Password123!" }),
    });
    cookieDept2 = (loginD2.headers.get("set-cookie") || "").split(";")[0];

    const loginDir = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: uDirectora.email, password: "Password123!" }),
    });
    cookieDirectora = (loginDir.headers.get("set-cookie") || "").split(";")[0];
  });

  it("Rol 1 lista solo oficios de su departamento o donde participa (Dept 1)", async () => {
    const res = await app.request("/api/oficios", {
      headers: { Cookie: cookieDept1 },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    const ids = body.data.map((o: { id: number }) => o.id);

    // Debe ver Oficio 1 (su depto) y Oficio 3 (turnado a su depto)
    expect(ids).toContain(oficioDept1Id);
    expect(ids).toContain(oficioTurnadoADept1Id);
    // NO debe ver Oficio 2 (exclusivo Dept 2)
    expect(ids).not.toContain(oficioDept2Id);

    // Dept 2 debe ver Oficio 2 y Oficio 3 (origen Dept 2), pero no Oficio 1 (exclusivo Dept 1)
    const resD2 = await app.request("/api/oficios", {
      headers: { Cookie: cookieDept2 },
    });
    const bodyD2 = await resD2.json();
    const idsD2 = bodyD2.data.map((o: { id: number }) => o.id);
    expect(idsD2).toContain(oficioDept2Id);
    expect(idsD2).not.toContain(oficioDept1Id);
  });

  it("Rol 3 (Directora) tiene acceso total y lista todos los oficios", async () => {
    const res = await app.request("/api/oficios", {
      headers: { Cookie: cookieDirectora },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    const ids = body.data.map((o: { id: number }) => o.id);

    expect(ids).toContain(oficioDept1Id);
    expect(ids).toContain(oficioDept2Id);
    expect(ids).toContain(oficioTurnadoADept1Id);
    expect(body.total).toBe(3);
  });

  it("Filtros en servidor por folio, asunto, estado_id y rango de fechas", async () => {
    // Filtro por folio exacto
    const resFolio = await app.request("/api/oficios?folio=OFI-2026-0001", {
      headers: { Cookie: cookieDirectora },
    });
    const bodyFolio = await resFolio.json();
    expect(bodyFolio.data).toHaveLength(1);
    expect(bodyFolio.data[0].folio).toBe("OFI-2026-0001");

    // Filtro por estado_id = 1 (Pendiente)
    const resEstado = await app.request("/api/oficios?estado_id=1", {
      headers: { Cookie: cookieDirectora },
    });
    const bodyEstado = await resEstado.json();
    expect(bodyEstado.data).toHaveLength(1);
    expect(bodyEstado.data[0].id).toBe(oficioDept1Id);

    // Filtro por fecha_desde y fecha_hasta
    const resFecha = await app.request(
      "/api/oficios?fecha_desde=2026-02-05&fecha_hasta=2026-02-12",
      { headers: { Cookie: cookieDirectora } },
    );
    const bodyFecha = await resFecha.json();
    expect(bodyFecha.data).toHaveLength(1);
    expect(bodyFecha.data[0].id).toBe(oficioDept2Id);
  });

  it("Paginación server-side devuelve página, tamaño y total", async () => {
    const res = await app.request("/api/oficios?page=1&pageSize=2", {
      headers: { Cookie: cookieDirectora },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(2);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(2);
    expect(body.total).toBe(3);
    expect(body.totalPages).toBe(2);
  });

  it("Detalle de oficio fuera del alcance devuelve 404 (sin revelar existencia)", async () => {
    // Usuario Dept 1 intenta ver Oficio 2 (de Dept 2)
    const res = await app.request(`/api/oficios/${oficioDept2Id}`, {
      headers: { Cookie: cookieDept1 },
    });

    expect(res.status).toBe(404);
  });

  it("Detalle de oficio dentro del alcance devuelve datos completos, línea de tiempo y adjuntos", async () => {
    const res = await app.request(`/api/oficios/${oficioTurnadoADept1Id}`, {
      headers: { Cookie: cookieDept1 },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.oficio).toBeDefined();
    expect(body.oficio.id).toBe(oficioTurnadoADept1Id);
    expect(body.oficio.lineaTiempo).toBeInstanceOf(Array);
    expect(body.oficio.lineaTiempo.length).toBeGreaterThanOrEqual(1);
    expect(body.oficio.lineaTiempo[0].tipo).toBe("TURNO");
    expect(body.oficio.adjuntos).toBeInstanceOf(Array);
    expect(body.oficio.lecturas).toBeInstanceOf(Array);
  });
});
