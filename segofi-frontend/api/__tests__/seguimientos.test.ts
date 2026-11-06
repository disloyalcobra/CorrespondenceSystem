import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../app/db/schema";
import { migrar } from "../app/db/migrate";
import { seed } from "../app/db/seed";
import { createApp } from "../index";
import { hashPassword } from "../app/lib/auth";
import { eq } from "drizzle-orm";

describe("Task 9 — Seguimientos, respuestas y lecturas", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let app: ReturnType<typeof createApp>;

  // Cookies de sesión
  let cookieAdmin: string;    // Rol 2 — acceso total
  let cookieOp1: string;      // Rol 1 — Dept 1 (destino del oficio)
  let cookieOp2: string;      // Rol 1 — Dept 2 (fuera de alcance del oficio)

  // IDs reutilizables
  let oficioTurnadoId: number;
  let oficioEnviadoId: number;
  let op1Id: number;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
    app = createApp(db);

    const pw = await hashPassword("Password123!");
    const ahora = new Date().toISOString();

    // Admin (Rol 2, Dept 1)
    await db.insert(schema.usuarios).values({
      nombre: "Admin",
      email: "admin@test.com",
      passwordHash: pw,
      rolId: 2,
      departamentoId: 1,
      activo: true,
      creadoEn: ahora,
    });

    // Op1 (Rol 1, Dept 1 — departamento destino del oficio)
    const [op1] = await db.insert(schema.usuarios).values({
      nombre: "Operativo 1",
      email: "op1@test.com",
      passwordHash: pw,
      rolId: 1,
      departamentoId: 1,
      activo: true,
      creadoEn: ahora,
    }).returning();
    op1Id = op1.id;

    // Op2 (Rol 1, Dept 2 — fuera de alcance)
    await db.insert(schema.usuarios).values({
      nombre: "Operativo 2",
      email: "op2@test.com",
      passwordHash: pw,
      rolId: 1,
      departamentoId: 2,
      activo: true,
      creadoEn: ahora,
    });

    // Oficio en estado Turnado (2) — destino Dept 1
    const [adminRow] = await db.select().from(schema.usuarios)
      .where(eq(schema.usuarios.email, "admin@test.com")).limit(1);

    const [ofTurnado] = await db.insert(schema.oficios).values({
      folio: "OFI-TURN-0001",
      tipoDocumentoId: 1,
      objeto: "Oficio turnado prueba",
      asunto: "Asunto turnado",
      destinatario: "Dept 1",
      fechaDocumento: "2026-01-01",
      fechaRecepcion: ahora,
      termino: null,
      remitenteUsuarioId: adminRow.id,
      origenUsuarioId: adminRow.id,
      departamentoDestinoInicialId: 1,
      estadoId: 2, // Turnado
      creadoEn: ahora,
    }).returning();
    oficioTurnadoId = ofTurnado.id;

    // Oficio en estado Enviado (7)
    const [ofEnviado] = await db.insert(schema.oficios).values({
      folio: "OFI-ENVI-0001",
      tipoDocumentoId: 1,
      objeto: "Oficio enviado prueba",
      asunto: "Asunto enviado",
      destinatario: "Dept 1",
      fechaDocumento: "2026-01-01",
      fechaRecepcion: ahora,
      termino: null,
      remitenteUsuarioId: adminRow.id,
      origenUsuarioId: adminRow.id,
      departamentoDestinoInicialId: 1,
      estadoId: 7, // Enviado
      creadoEn: ahora,
    }).returning();
    oficioEnviadoId = ofEnviado.id;

    // Obtener cookies de sesión
    const loginAdmin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.com", password: "Password123!" }),
    });
    cookieAdmin = (loginAdmin.headers.get("set-cookie") || "").split(";")[0];

    const loginOp1 = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "op1@test.com", password: "Password123!" }),
    });
    cookieOp1 = (loginOp1.headers.get("set-cookie") || "").split(";")[0];

    const loginOp2 = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "op2@test.com", password: "Password123!" }),
    });
    cookieOp2 = (loginOp2.headers.get("set-cookie") || "").split(";")[0];
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Paso 1a: NOTA en oficio Turnado → estado pasa a 3 (En proceso)
  // ──────────────────────────────────────────────────────────────────────────
  it("NOTA en oficio Turnado cambia estado a En proceso (3)", async () => {
    const res = await app.request(`/api/oficios/${oficioTurnadoId}/seguimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
      body: JSON.stringify({ tipo: "NOTA", contenido: "Nota de seguimiento" }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.seguimiento).toMatchObject({ tipo: "NOTA", contenido: "Nota de seguimiento" });
    expect(body.estadoId).toBe(3); // En proceso

    // Verificar en DB
    const [oficio] = await db.select().from(schema.oficios)
      .where(eq(schema.oficios.id, oficioTurnadoId)).limit(1);
    expect(oficio.estadoId).toBe(3);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Paso 1b: RESPUESTA con decidirConclusion=false → estado 4 (Respondido)
  // ──────────────────────────────────────────────────────────────────────────
  it("RESPUESTA con decidirConclusion=false → estado 4 (Respondido)", async () => {
    const res = await app.request(`/api/oficios/${oficioTurnadoId}/seguimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
      body: JSON.stringify({ tipo: "RESPUESTA", contenido: "Respuesta parcial", decidirConclusion: false }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.estadoId).toBe(4); // Respondido

    const [oficio] = await db.select().from(schema.oficios)
      .where(eq(schema.oficios.id, oficioTurnadoId)).limit(1);
    expect(oficio.estadoId).toBe(4);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Paso 1c: RESPUESTA con decidirConclusion=true → estado 5 (Concluido)
  // ──────────────────────────────────────────────────────────────────────────
  it("RESPUESTA con decidirConclusion=true → estado 5 (Concluido)", async () => {
    const res = await app.request(`/api/oficios/${oficioTurnadoId}/seguimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
      body: JSON.stringify({ tipo: "RESPUESTA", contenido: "Respuesta final", decidirConclusion: true }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.estadoId).toBe(5); // Concluido

    const [oficio] = await db.select().from(schema.oficios)
      .where(eq(schema.oficios.id, oficioTurnadoId)).limit(1);
    expect(oficio.estadoId).toBe(5);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Paso 1d: NOTA en oficio Enviado (7) → 409
  // ──────────────────────────────────────────────────────────────────────────
  it("NOTA en oficio Enviado devuelve 409", async () => {
    const res = await app.request(`/api/oficios/${oficioEnviadoId}/seguimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
      body: JSON.stringify({ tipo: "NOTA", contenido: "Intentar nota en enviado" }),
    });
    expect(res.status).toBe(409);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Paso 1e: Rol 1 en oficio fuera de su alcance → 404
  // ──────────────────────────────────────────────────────────────────────────
  it("Rol 1 en oficio fuera de su departamento devuelve 404", async () => {
    // Op2 es de Dept 2, el oficio es de Dept 1 → fuera de alcance
    const res = await app.request(`/api/oficios/${oficioTurnadoId}/seguimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieOp2 },
      body: JSON.stringify({ tipo: "NOTA", contenido: "Nota desde fuera" }),
    });
    expect(res.status).toBe(404);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Paso 1f: Segunda lectura del mismo usuario → misma fila, no duplica (200)
  // ──────────────────────────────────────────────────────────────────────────
  it("segunda lectura del mismo usuario devuelve la misma fila sin duplicar (200)", async () => {
    const first = await app.request(`/api/oficios/${oficioTurnadoId}/seguimientos/lecturas`, {
      method: "POST",
      headers: { Cookie: cookieOp1 },
    });
    expect(first.status).toBe(201);
    const { lectura: l1 } = await first.json();

    const second = await app.request(`/api/oficios/${oficioTurnadoId}/seguimientos/lecturas`, {
      method: "POST",
      headers: { Cookie: cookieOp1 },
    });
    expect(second.status).toBe(200);
    const { lectura: l2 } = await second.json();
    expect(l2.id).toBe(l1.id);

    // Verificar que no hay duplicados en DB
    const lecturas = await db.select().from(schema.oficioLecturas)
      .where(eq(schema.oficioLecturas.oficioId, oficioTurnadoId));
    expect(lecturas.filter((l) => l.usuarioId === op1Id).length).toBe(1);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Paso 1g: Auditoría registra actor y acción
  // ──────────────────────────────────────────────────────────────────────────
  it("auditoría registra acción 'responder' con el usuarioId correcto", async () => {
    await app.request(`/api/oficios/${oficioTurnadoId}/seguimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
      body: JSON.stringify({ tipo: "RESPUESTA", contenido: "Respuesta auditada", decidirConclusion: false }),
    });

    const [adminRow] = await db.select().from(schema.usuarios)
      .where(eq(schema.usuarios.email, "admin@test.com")).limit(1);

    const auditorias = await db.select().from(schema.auditoria)
      .where(eq(schema.auditoria.accion, "responder"));

    expect(auditorias.length).toBeGreaterThanOrEqual(1);
    expect(auditorias[0].usuarioId).toBe(adminRow.id);
    expect(auditorias[0].entidad).toBe("oficio");
    expect(auditorias[0].entidadId).toBe(oficioTurnadoId);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Validación: falta 'contenido' → 422
  // ──────────────────────────────────────────────────────────────────────────
  it("falta 'contenido' en seguimiento devuelve 422", async () => {
    const res = await app.request(`/api/oficios/${oficioTurnadoId}/seguimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
      body: JSON.stringify({ tipo: "NOTA" }),
    });
    expect(res.status).toBe(422);
  });
});
