import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../app/db/schema.js";
import { migrar } from "../app/db/migrate.js";
import { seed } from "../app/db/seed.js";
import { createApp } from "../index.js";
import { hashPassword } from "../app/lib/auth.js";

describe("Task 13 — Auditoría, reportes/exportación y notificaciones", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let app: ReturnType<typeof createApp>;

  let cookieAdmin: string;
  let cookieOpDept1: string;
  let cookieOpDept2: string;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
    app = createApp(db);

    const pw = await hashPassword("Password123!");
    const ahora = new Date().toISOString();

    // 1. Admin (Rol 2, Depto 1)
    const [admin] = await db
      .insert(schema.usuarios)
      .values({
        nombre: "Admin User",
        email: "admin@test.com",
        passwordHash: pw,
        rolId: 2,
        departamentoId: 1,
        activo: true,
        creadoEn: ahora,
      })
      .returning();

    // 2. Operativo Depto 1 (Rol 1, Depto 1)
     await db
      .insert(schema.usuarios)
      .values({
        nombre: "Operativo 1",
        email: "op1@test.com",
        passwordHash: pw,
        rolId: 1,
        departamentoId: 1,
        activo: true,
        creadoEn: ahora,
      })
      .returning();

    // 3. Operativo Depto 2 (Rol 1, Depto 2)
     await db
      .insert(schema.usuarios)
      .values({
        nombre: "Operativo 2",
        email: "op2@test.com",
        passwordHash: pw,
        rolId: 1,
        departamentoId: 2,
        activo: true,
        creadoEn: ahora,
      })
      .returning();

    // Oficio 1: Depto 1, Vencido (termino en el pasado), Estado 1 (Pendiente)
    await db.insert(schema.oficios).values({
      folio: "OFI-2026-0001",
      tipoDocumentoId: 1,
      objeto: "Oficio vencido Dept 1",
      asunto: "Asunto 1",
      destinatario: "Dest 1",
      fechaDocumento: "2026-01-01",
      fechaRecepcion: ahora,
      termino: "2026-01-10", // pasado
      remitenteUsuarioId: admin.id,
      origenUsuarioId: admin.id,
      departamentoDestinoInicialId: 1,
      estadoId: 1, // Pendiente
      creadoEn: ahora,
    });

    // Oficio 2: Depto 1, Concluido (Estado 5), con termino en el pasado (NO debe contar como vencido)
    await db.insert(schema.oficios).values({
      folio: "OFI-2026-0002",
      tipoDocumentoId: 1,
      objeto: "Oficio concluido Dept 1",
      asunto: "Asunto 2",
      destinatario: "Dest 2",
      fechaDocumento: "2026-01-01",
      fechaRecepcion: ahora,
      termino: "2026-01-10",
      remitenteUsuarioId: admin.id,
      origenUsuarioId: admin.id,
      departamentoDestinoInicialId: 1,
      estadoId: 5, // Concluido (terminal)
      creadoEn: ahora,
    });

    // Oficio 3: Depto 2, Estado 1 (Pendiente)
     await db
      .insert(schema.oficios)
      .values({
        folio: "OFI-2026-0003",
        tipoDocumentoId: 1,
        objeto: "Oficio Dept 2",
        asunto: "Asunto Dept 2",
        destinatario: "Dest 3",
        fechaDocumento: "2026-01-01",
        fechaRecepcion: ahora,
        termino: "2099-01-01", // Futuro
        remitenteUsuarioId: admin.id,
        origenUsuarioId: admin.id,
        departamentoDestinoInicialId: 2,
        estadoId: 1,
        creadoEn: ahora,
      })
      .returning();

    // Login Admin
    const lAdmin = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@test.com", password: "Password123!" }),
    });
    cookieAdmin = (lAdmin.headers.get("set-cookie") || "").split(";")[0];

    // Login Op1
    const lOp1 = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "op1@test.com", password: "Password123!" }),
    });
    cookieOpDept1 = (lOp1.headers.get("set-cookie") || "").split(";")[0];

    // Login Op2
    const lOp2 = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "op2@test.com", password: "Password123!" }),
    });
    cookieOpDept2 = (lOp2.headers.get("set-cookie") || "").split(";")[0];
  });

  it("GET /api/auditoria: Rol 2 obtiene lista filtrada; Rol 1 recibe 403 Forbidden", async () => {
    // 1. Operativo (Rol 1) recibe 403
    const resOp = await app.request("/api/auditoria", {
      headers: { Cookie: cookieOpDept1 },
    });
    expect(resOp.status).toBe(403);

    // 2. Admin (Rol 2) recibe 200 y puede filtrar
    const resAdmin = await app.request("/api/auditoria?entidad=usuario", {
      headers: { Cookie: cookieAdmin },
    });
    expect(resAdmin.status).toBe(200);
    const body = await resAdmin.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.page).toBe(1);
  });

  it("GET /api/reportes/resumen: cuenta vencidos sin pisar estados terminales y respeta alcance", async () => {
    // 1. Admin ve todos los oficios (3 en total, 1 vencido no terminal)
    const resAdmin = await app.request("/api/reportes/resumen", {
      headers: { Cookie: cookieAdmin },
    });
    expect(resAdmin.status).toBe(200);
    const bodyAdmin = await resAdmin.json();
    expect(bodyAdmin.total).toBe(3);
    expect(bodyAdmin.vencidos).toBe(1); // El oficio 1 está vencido; el oficio 2 está concluido y no cuenta
    expect(bodyAdmin.porEstado[1]).toBe(2); // 2 pendientes
    expect(bodyAdmin.porEstado[5]).toBe(1); // 1 concluido

    // 2. Operativo Dept 2 solo ve 1 oficio (depto 2) y 0 vencidos
    const resOp2 = await app.request("/api/reportes/resumen", {
      headers: { Cookie: cookieOpDept2 },
    });
    expect(resOp2.status).toBe(200);
    const bodyOp2 = await resOp2.json();
    expect(bodyOp2.total).toBe(1);
    expect(bodyOp2.vencidos).toBe(0);
  });

  it("GET /api/reportes/export?formato=csv: genera CSV respetando alcance", async () => {
    // Operativo 2 exporta: solo debe contener OFI-2026-0003 y no los del Depto 1
    const res = await app.request("/api/reportes/export?formato=csv", {
      headers: { Cookie: cookieOpDept2 },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");

    const text = await res.text();
    expect(text).toContain("Folio,Asunto");
    expect(text).toContain("OFI-2026-0003");
    expect(text).not.toContain("OFI-2026-0001");
    expect(text).not.toContain("OFI-2026-0002");
  });

  it("GET /api/notificaciones: de Rol 1 excluye oficios de otro departamento", async () => {
    // Operativo 2 solo debe tener notificación de OFI-2026-0003
    const res = await app.request("/api/notificaciones", {
      headers: { Cookie: cookieOpDept2 },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);

    const folios = body.data.map((n: { folio: string }) => n.folio);
    expect(folios).toContain("OFI-2026-0003");
    expect(folios).not.toContain("OFI-2026-0001");
    expect(folios).not.toContain("OFI-2026-0002");
  });
});
