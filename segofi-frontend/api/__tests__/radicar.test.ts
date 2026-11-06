import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../app/db/schema";
import { migrar } from "../app/db/migrate";
import { seed } from "../app/db/seed";
import { createApp } from "../index";
import { hashPassword } from "../app/lib/auth";

describe("Radicación de oficios (POST /api/oficios)", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let app: ReturnType<typeof createApp>;
  let cookieUsuario: string;
  let usuarioId: number;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
    app = createApp(db);

    const pass = await hashPassword("UserPass123!");
    const [user] = await db
      .insert(schema.usuarios)
      .values({
        nombre: "María Radicadora",
        email: "maria@sectur.gob.mx",
        passwordHash: pass,
        rolId: 1,
        departamentoId: 1,
        activo: true,
        creadoEn: new Date().toISOString(),
      })
      .returning();
    usuarioId = user.id;

    const loginRes = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "maria@sectur.gob.mx", password: "UserPass123!" }),
    });
    cookieUsuario = (loginRes.headers.get("set-cookie") || "").split(";")[0];
  });

  it("con datos válidos devuelve 201 con folio OFI- y estado Pendiente (1)", async () => {
    const res = await app.request("/api/oficios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieUsuario,
      },
      body: JSON.stringify({
        tipo_documento_id: 1,
        objeto: "Petición de promoción turística",
        asunto: "Campaña Primavera 2026",
        destinatario: "Lic. Roberto González",
        fecha_documento: "2026-03-01",
        departamento_destino_inicial_id: 1,
        adjuntos: [
          {
            nombre_archivo: "propuesta.pdf",
            archivo_url: "https://blob.vercel-storage.com/propuesta.pdf",
          },
        ],
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.oficio).toBeDefined();
    expect(body.oficio.folio).toBe("OFI-2026-0001");
    expect(body.oficio.estadoId).toBe(1); // Pendiente
    expect(body.oficio.remitenteUsuarioId).toBe(usuarioId);
    expect(body.oficio.origenUsuarioId).toBe(usuarioId);

    // Verificar en tabla adjuntos
    const adjuntos = await db
      .select()
      .from(schema.adjuntos)
      .where(eq(schema.adjuntos.entidadId, body.oficio.id));
    expect(adjuntos).toHaveLength(1);
    expect(adjuntos[0].nombreArchivo).toBe("propuesta.pdf");

    // Verificar en auditoría
    const registrosAuditoria = await db
      .select()
      .from(schema.auditoria)
      .where(eq(schema.auditoria.entidadId, body.oficio.id));
    expect(registrosAuditoria).toHaveLength(1);
    expect(registrosAuditoria[0].accion).toBe("radicar");
    expect(registrosAuditoria[0].usuarioId).toBe(usuarioId);
  });

  it("falta objeto o asunto devuelve 422 por validación Zod", async () => {
    const res = await app.request("/api/oficios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieUsuario,
      },
      body: JSON.stringify({
        tipo_documento_id: 1,
        // objeto falta
        asunto: "", // asunto vacío
        destinatario: "Lic. Roberto González",
        fecha_documento: "2026-03-01",
        departamento_destino_inicial_id: 1,
      }),
    });

    expect(res.status).toBe(422);
  });

  it("departamento_destino_inicial_id inexistente devuelve 422", async () => {
    const res = await app.request("/api/oficios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieUsuario,
      },
      body: JSON.stringify({
        tipo_documento_id: 1,
        objeto: "Objeto válido",
        asunto: "Asunto válido",
        destinatario: "Destinatario válido",
        fecha_documento: "2026-03-01",
        departamento_destino_inicial_id: 999999, // inexistente
      }),
    });

    expect(res.status).toBe(422);
  });

  it("fecha_documento inválida devuelve 422", async () => {
    const res = await app.request("/api/oficios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieUsuario,
      },
      body: JSON.stringify({
        tipo_documento_id: 1,
        objeto: "Objeto válido",
        asunto: "Asunto válido",
        destinatario: "Destinatario válido",
        fecha_documento: "fecha-invalida-no-formato",
        departamento_destino_inicial_id: 1,
      }),
    });

    expect(res.status).toBe(422);
  });

  it("radicar en secuencia reserva folios consecutivos", async () => {
    const datosBase = {
      tipo_documento_id: 1,
      objeto: "Objeto de prueba",
      asunto: "Asunto consecutivo",
      destinatario: "Destinatario",
      fecha_documento: "2026-03-01",
      departamento_destino_inicial_id: 1,
    };

    const res1 = await app.request("/api/oficios", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieUsuario },
      body: JSON.stringify(datosBase),
    });
    const body1 = await res1.json();

    const res2 = await app.request("/api/oficios", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookieUsuario },
      body: JSON.stringify(datosBase),
    });
    const body2 = await res2.json();

    expect(res1.status).toBe(201);
    expect(res2.status).toBe(201);
    expect(body1.oficio.folio).toBe("OFI-2026-0001");
    expect(body2.oficio.folio).toBe("OFI-2026-0002");
  });
});

