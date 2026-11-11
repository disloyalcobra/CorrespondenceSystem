import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../_app/db/schema.js";
import { migrar } from "../_app/db/migrate.js";
import { seed } from "../_app/db/seed.js";
import { createApp } from "../index.js";
import { hashPassword } from "../_app/lib/auth.js";
import { eq } from "drizzle-orm";

// Helper para crear un oficio en estado Pendiente (1)
async function crearOficio(
  db: ReturnType<typeof drizzle<typeof schema>>,
  adminId: number,
  folioSufijo: string,
) {
  const ahora = new Date().toISOString();
  const [oficio] = await db
    .insert(schema.oficios)
    .values({
      folio: `OFI-SAL-${folioSufijo}`,
      tipoDocumentoId: 1,
      objeto: "Objeto prueba",
      asunto: "Asunto prueba",
      destinatario: "Destinatario",
      fechaDocumento: "2026-01-01",
      fechaRecepcion: ahora,
      termino: null,
      remitenteUsuarioId: adminId,
      origenUsuarioId: adminId,
      departamentoDestinoInicialId: 1,
      estadoId: 1, // Pendiente
      creadoEn: ahora,
    })
    .returning();
  return oficio;
}

describe("Task 10 — Salidas (envío atómico SAL-YYYY-NNNN)", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let app: ReturnType<typeof createApp>;
  let cookieAdmin: string;
  let cookieRol1: string;
  let adminId: number;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
    app = createApp(db);

    const pw = await hashPassword("Password123!");
    const ahora = new Date().toISOString();

    // Admin (Rol 2)
    const [admin] = await db
      .insert(schema.usuarios)
      .values({
        nombre: "Admin",
        email: "admin@test.com",
        passwordHash: pw,
        rolId: 2,
        departamentoId: 1,
        activo: true,
        creadoEn: ahora,
      })
      .returning();
    adminId = admin.id;

    // Operativo (Rol 1) — no puede enviar
    await db.insert(schema.usuarios).values({
      nombre: "Operativo",
      email: "op@test.com",
      passwordHash: pw,
      rolId: 1,
      departamentoId: 1,
      activo: true,
      creadoEn: ahora,
    });

    // Cookies de sesión
    const lAdmin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.com", password: "Password123!" }),
    });
    cookieAdmin = (lAdmin.headers.get("set-cookie") || "").split(";")[0];

    const lOp = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "op@test.com", password: "Password123!" }),
    });
    cookieRol1 = (lOp.headers.get("set-cookie") || "").split(";")[0];
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 1: Envío válido → 201 con folio SAL- y estado 7
  // ──────────────────────────────────────────────────────────────────────────
  it("envío válido devuelve 201 con folio SAL- y oficio queda en estado 7", async () => {
    const oficio = await crearOficio(db, adminId, "0001");

    const res = await app.request(`/api/oficios/${oficio.id}/salida`, {
      method: "POST",
      headers: { Cookie: cookieAdmin },
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.salida.folio).toMatch(/^SAL-\d{4}-\d{4}$/);

    const [oficial] = await db
      .select()
      .from(schema.oficios)
      .where(eq(schema.oficios.id, oficio.id))
      .limit(1);
    expect(oficial.estadoId).toBe(7); // Enviado
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 2: Segundo envío del mismo oficio → 409
  // ──────────────────────────────────────────────────────────────────────────
  it("segundo envío del mismo oficio devuelve 409", async () => {
    const oficio = await crearOficio(db, adminId, "0002");

    // Primer envío
    const r1 = await app.request(`/api/oficios/${oficio.id}/salida`, {
      method: "POST",
      headers: { Cookie: cookieAdmin },
    });
    expect(r1.status).toBe(201);

    // Segundo envío
    const r2 = await app.request(`/api/oficios/${oficio.id}/salida`, {
      method: "POST",
      headers: { Cookie: cookieAdmin },
    });
    expect(r2.status).toBe(409);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 3: Envíos concurrentes sobre oficios distintos → folios únicos
  // ──────────────────────────────────────────────────────────────────────────
  it("envíos concurrentes de 3 oficios distintos generan folios únicos y consecutivos", async () => {
    const o1 = await crearOficio(db, adminId, "C001");
    const o2 = await crearOficio(db, adminId, "C002");
    const o3 = await crearOficio(db, adminId, "C003");

    const [r1, r2, r3] = await Promise.all([
      app.request(`/api/oficios/${o1.id}/salida`, { method: "POST", headers: { Cookie: cookieAdmin } }),
      app.request(`/api/oficios/${o2.id}/salida`, { method: "POST", headers: { Cookie: cookieAdmin } }),
      app.request(`/api/oficios/${o3.id}/salida`, { method: "POST", headers: { Cookie: cookieAdmin } }),
    ]);

    expect(r1.status).toBe(201);
    expect(r2.status).toBe(201);
    expect(r3.status).toBe(201);

    const folios = await Promise.all([r1.json(), r2.json(), r3.json()]);
    const folioSet = new Set(folios.map((b) => b.salida.folio));
    expect(folioSet.size).toBe(3); // todos distintos
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 4: Doble envío concurrente del MISMO oficio → exactamente 1 éxito
  // ──────────────────────────────────────────────────────────────────────────
  it("doble envío concurrente del mismo oficio genera exactamente un 201 y un 409", async () => {
    const oficio = await crearOficio(db, adminId, "D001");

    const [ra, rb] = await Promise.all([
      app.request(`/api/oficios/${oficio.id}/salida`, { method: "POST", headers: { Cookie: cookieAdmin } }),
      app.request(`/api/oficios/${oficio.id}/salida`, { method: "POST", headers: { Cookie: cookieAdmin } }),
    ]);

    const statuses = [ra.status, rb.status].sort((a, b) => a - b);
    expect(statuses).toEqual([201, 409]);

    // Solo debe haber una salida en DB
    const salidas = await db
      .select()
      .from(schema.oficiosSalidas)
      .where(eq(schema.oficiosSalidas.oficioId, oficio.id));
    expect(salidas.length).toBe(1);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 5: Rol 1 no puede enviar → 403
  // ──────────────────────────────────────────────────────────────────────────
  it("rol 1 intenta enviar oficio y recibe 403", async () => {
    const oficio = await crearOficio(db, adminId, "E001");

    const res = await app.request(`/api/oficios/${oficio.id}/salida`, {
      method: "POST",
      headers: { Cookie: cookieRol1 },
    });
    expect(res.status).toBe(403);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 6: Oficio inexistente → 404
  // ──────────────────────────────────────────────────────────────────────────
  it("enviar oficio inexistente devuelve 404", async () => {
    const res = await app.request("/api/oficios/99999/salida", {
      method: "POST",
      headers: { Cookie: cookieAdmin },
    });
    expect(res.status).toBe(404);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 7: Auditoría registra acción "enviar"
  // ──────────────────────────────────────────────────────────────────────────
  it("auditoría registra acción 'enviar' con usuarioId y entidadId correctos", async () => {
    const oficio = await crearOficio(db, adminId, "A001");

    await app.request(`/api/oficios/${oficio.id}/salida`, {
      method: "POST",
      headers: { Cookie: cookieAdmin },
    });

    const audits = await db
      .select()
      .from(schema.auditoria)
      .where(eq(schema.auditoria.accion, "enviar"));

    expect(audits.length).toBeGreaterThanOrEqual(1);
    expect(audits[0].usuarioId).toBe(adminId);
    expect(audits[0].entidadId).toBe(oficio.id);
  });
});
