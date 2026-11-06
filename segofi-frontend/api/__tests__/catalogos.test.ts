import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../app/db/schema";
import { migrar } from "../app/db/migrate";
import { seed } from "../app/db/seed";
import { createApp } from "../index";
import { hashPassword } from "../app/lib/auth";

describe("Catálogos y administración de departamentos / tipos de documento", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let app: ReturnType<typeof createApp>;
  let cookieAdmin: string;
  let cookieOperativo: string;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
    app = createApp(db);

    // Creamos un usuario de rol 1 (Operativo / Usuario)
    const passHash = await hashPassword("UserPassword123!");
    const [userOp] = await db
      .insert(schema.usuarios)
      .values({
        nombre: "Juan Operativo",
        email: "juan@sectur.gob.mx",
        passwordHash: passHash,
        rolId: 1, // Rol 1: Usuario operativo
        departamentoId: 1,
        activo: true,
        creadoEn: new Date().toISOString(),
      })
      .returning();

    // Login Admin (rol 2)
    const loginAdminRes = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sectur.gob.mx",
        password: "AdminPassword123!",
      }),
    });
    const setCookieAdmin = loginAdminRes.headers.get("set-cookie") || "";
    cookieAdmin = setCookieAdmin.split(";")[0];

    // Login Operativo (rol 1)
    const loginOpRes = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userOp.email,
        password: "UserPassword123!",
      }),
    });
    const setCookieOp = loginOpRes.headers.get("set-cookie") || "";
    cookieOperativo = setCookieOp.split(";")[0];
  });

  it("GET /api/catalogos sin sesión devuelve 401", async () => {
    const res = await app.request("/api/catalogos");
    expect(res.status).toBe(401);
  });

  it("GET /api/catalogos con rol 1 devuelve 200 y listados de estados, tipos y departamentos", async () => {
    const res = await app.request("/api/catalogos", {
      headers: { Cookie: cookieOperativo },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.estados).toBeInstanceOf(Array);
    expect(data.estados.length).toBe(7);
    expect(data.tiposDocumento).toBeInstanceOf(Array);
    expect(data.departamentos).toBeInstanceOf(Array);
  });

  it("POST /api/departamentos con rol 1 devuelve 403 (No autorizado)", async () => {
    const res = await app.request("/api/departamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieOperativo,
      },
      body: JSON.stringify({
        nombre: "Nuevo Departamento Prohibido",
        tipo: "INTERNO",
      }),
    });

    expect(res.status).toBe(403);
  });

  it("POST /api/departamentos con rol 2 crea departamento y registra auditoría", async () => {
    const res = await app.request("/api/departamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieAdmin,
      },
      body: JSON.stringify({
        nombre: "Coordinación de Pueblos Mágicos",
        tipo: "INTERNO",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.departamento).toBeDefined();
    expect(body.departamento.nombre).toBe("Coordinación de Pueblos Mágicos");
    expect(body.departamento.activo).toBe(true);

    // Verificar en auditoría
    const registros = await db
      .select()
      .from(schema.auditoria)
      .where(eq(schema.auditoria.entidad, "departamento"));

    const auditoriaCreacion = registros.find(
      (r) => r.accion === "crear" && r.entidadId === body.departamento.id,
    );
    expect(auditoriaCreacion).toBeDefined();
  });

  it("DELETE /api/departamentos/:id realiza desactivación lógica (activo=false) y audita", async () => {
    // 1. Creamos departamento
    const createRes = await app.request("/api/departamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieAdmin,
      },
      body: JSON.stringify({
        nombre: "Área Temporal",
        tipo: "INTERNO",
      }),
    });
    const { departamento } = await createRes.json();

    // 2. Desactivamos con DELETE
    const deleteRes = await app.request(`/api/departamentos/${departamento.id}`, {
      method: "DELETE",
      headers: { Cookie: cookieAdmin },
    });

    expect(deleteRes.status).toBe(200);

    // 3. La fila sigue existiendo en la BD pero con activo = false
    const [deptoDb] = await db
      .select()
      .from(schema.departamentos)
      .where(eq(schema.departamentos.id, departamento.id));

    expect(deptoDb).toBeDefined();
    expect(deptoDb.activo).toBe(false);

    // 4. Existe auditoría de desactivación
    const registros = await db
      .select()
      .from(schema.auditoria)
      .where(eq(schema.auditoria.entidad, "departamento"));

    const auditoriaBaja = registros.find(
      (r) => r.accion === "desactivar" && r.entidadId === departamento.id,
    );
    expect(auditoriaBaja).toBeDefined();
  });

  it("CRUD de tipos de documento: rol 2 puede crear y desactivar lógicamente", async () => {
    // Crear tipo de documento
    const postRes = await app.request("/api/tipos-documento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieAdmin,
      },
      body: JSON.stringify({
        nombre: "Decreto Gubernamental",
      }),
    });

    expect(postRes.status).toBe(201);
    const { tipoDocumento } = await postRes.json();
    expect(tipoDocumento.nombre).toBe("Decreto Gubernamental");

    // Desactivar
    const deleteRes = await app.request(`/api/tipos-documento/${tipoDocumento.id}`, {
      method: "DELETE",
      headers: { Cookie: cookieAdmin },
    });

    expect(deleteRes.status).toBe(200);

    const [tipoDb] = await db
      .select()
      .from(schema.tiposDocumento)
      .where(eq(schema.tiposDocumento.id, tipoDocumento.id));

    expect(tipoDb.activo).toBe(false);
  });
});
