import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../app/db/schema";
import { migrar } from "../app/db/migrate";
import { seed } from "../app/db/seed";
import { createApp } from "../index";
import { hashPassword } from "../app/lib/auth";

describe("Turnado de oficios (POST /api/oficios/:id/turnos)", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let app: ReturnType<typeof createApp>;

  let cookieAdmin: string;
  let cookieOperativo: string;
  let adminId: number;

  let oficioPendienteId: number;
  let oficioEnviadoId: number;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
    app = createApp(db);

    const [admin] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.rolId, 2)).limit(1);
    adminId = admin.id;

    // Login Admin (rol 2)
    const loginAdmin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: admin.email, password: "AdminPassword123!" }),
    });
    cookieAdmin = (loginAdmin.headers.get("set-cookie") || "").split(";")[0];

    // Usuario Operativo (rol 1)
    const pass = await hashPassword("UserPass123!");
    const [userOp] = await db
      .insert(schema.usuarios)
      .values({
        nombre: "Operativo Test",
        email: "operativo@sectur.gob.mx",
        passwordHash: pass,
        rolId: 1,
        departamentoId: 1,
        activo: true,
        creadoEn: new Date().toISOString(),
      })
      .returning();

    const loginOp = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userOp.email, password: "UserPass123!" }),
    });
    cookieOperativo = (loginOp.headers.get("set-cookie") || "").split(";")[0];

    const ahora = new Date().toISOString();

    // Oficio Pendiente (estado 1)
    const [oficioP] = await db
      .insert(schema.oficios)
      .values({
        folio: "OFI-2026-0001",
        tipoDocumentoId: 1,
        objeto: "Petición turnado",
        asunto: "Asunto turnado",
        destinatario: "Destinatario",
        fechaDocumento: "2026-03-01",
        fechaRecepcion: ahora,
        remitenteUsuarioId: admin.id,
        origenUsuarioId: admin.id,
        departamentoDestinoInicialId: 1,
        estadoId: 1, // Pendiente
        creadoEn: ahora,
      })
      .returning();
    oficioPendienteId = oficioP.id;

    // Oficio Enviado (estado 7)
    const [oficioE] = await db
      .insert(schema.oficios)
      .values({
        folio: "OFI-2026-0002",
        tipoDocumentoId: 1,
        objeto: "Petición enviada",
        asunto: "Asunto enviado",
        destinatario: "Destinatario",
        fechaDocumento: "2026-03-01",
        fechaRecepcion: ahora,
        remitenteUsuarioId: admin.id,
        origenUsuarioId: admin.id,
        departamentoDestinoInicialId: 1,
        estadoId: 7, // Enviado (terminal / solo lectura)
        creadoEn: ahora,
      })
      .returning();
    oficioEnviadoId = oficioE.id;
  });

  it("rol 2 turna oficio Pendiente: 201, estado pasa a Turnado (2), recibido_en es null y audita", async () => {
    const res = await app.request(`/api/oficios/${oficioPendienteId}/turnos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieAdmin,
      },
      body: JSON.stringify({
        departamento_id: 2, // Turnar a Protocolos
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.turno).toBeDefined();
    expect(body.turno.departamentoId).toBe(2);
    expect(body.turno.turnadoPorUsuarioId).toBe(adminId);
    expect(body.turno.recibidoEn).toBeNull();

    // Verificar en DB que el estado cambió a 2 (Turnado)
    const [oficioDb] = await db
      .select()
      .from(schema.oficios)
      .where(eq(schema.oficios.id, oficioPendienteId));
    expect(oficioDb.estadoId).toBe(2);

    // Verificar auditoría
    const registrosAuditoria = await db
      .select()
      .from(schema.auditoria)
      .where(eq(schema.auditoria.entidadId, oficioPendienteId));
    const registroTurno = registrosAuditoria.find((a) => a.accion === "turnar");
    expect(registroTurno).toBeDefined();
  });

  it("rol 1 al intentar turnar devuelve 403 (No autorizado)", async () => {
    const res = await app.request(`/api/oficios/${oficioPendienteId}/turnos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieOperativo,
      },
      body: JSON.stringify({
        departamento_id: 2,
      }),
    });

    expect(res.status).toBe(403);
  });

  it("turnar oficio inexistente devuelve 404", async () => {
    const res = await app.request("/api/oficios/999999/turnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieAdmin,
      },
      body: JSON.stringify({
        departamento_id: 2,
      }),
    });

    expect(res.status).toBe(404);
  });

  it("turnar oficio con estado Enviado (7) devuelve 409 (Conflicto / solo lectura)", async () => {
    const res = await app.request(`/api/oficios/${oficioEnviadoId}/turnos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieAdmin,
      },
      body: JSON.stringify({
        departamento_id: 2,
      }),
    });

    expect(res.status).toBe(409);
  });
});
