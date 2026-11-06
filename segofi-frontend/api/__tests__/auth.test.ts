import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "../app/db/schema";
import { migrar } from "../app/db/migrate";
import { seed } from "../app/db/seed";
import { createApp } from "../index";

describe("Autenticación (/api/auth)", () => {
  let client: ReturnType<typeof createClient>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let app: ReturnType<typeof createApp>;

  beforeEach(async () => {
    client = createClient({ url: ":memory:" });
    await client.execute("PRAGMA foreign_keys = ON;");
    db = drizzle(client, { schema });
    await migrar(db);
    await seed(db);
    app = createApp(db);
  });

  it("login válido devuelve 200 y establece cookie httpOnly", async () => {
    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sectur.gob.mx",
        password: "AdminPassword123!",
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.usuario).toBeDefined();
    expect(body.usuario.email).toBe("admin@sectur.gob.mx");
    expect(body.usuario.password_hash).toBeUndefined(); // no expone hash

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("sesion=");
    expect(setCookie?.toLowerCase()).toContain("httponly");
  });

  it("login con contraseña incorrecta devuelve 401", async () => {
    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sectur.gob.mx",
        password: "PasswordErronea",
      }),
    });

    expect(res.status).toBe(401);
  });

  it("login con usuario inactivo (activo=false) devuelve 401", async () => {
    // Desactivamos al admin en la DB
    await db
      .update(schema.usuarios)
      .set({ activo: false })
      .where(eq(schema.usuarios.email, "admin@sectur.gob.mx"));

    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sectur.gob.mx",
        password: "AdminPassword123!",
      }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toMatch(/inactivo|desactivado|no autorizado/i);
  });

  it("ruta protegida /api/auth/me sin cookie devuelve 401", async () => {
    const res = await app.request("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("GET /api/auth/me con usuario desactivado tras iniciar sesión devuelve 401", async () => {
    // 1. Inicia sesión normalmente
    const loginRes = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@sectur.gob.mx",
        password: "AdminPassword123!",
      }),
    });
    expect(loginRes.status).toBe(200);

    const setCookie = loginRes.headers.get("set-cookie") || "";
    const cookieHeader = setCookie.split(";")[0]; // "sesion=..."

    // 2. Desactivamos al usuario en la DB
    await db
      .update(schema.usuarios)
      .set({ activo: false })
      .where(eq(schema.usuarios.email, "admin@sectur.gob.mx"));

    // 3. Intenta acceder con la cookie previa
    const meRes = await app.request("/api/auth/me", {
      headers: { Cookie: cookieHeader },
    });

    expect(meRes.status).toBe(401);
  });

  it("POST /api/auth/logout limpia la sesión", async () => {
    const res = await app.request("/api/auth/logout", {
      method: "POST",
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
  });
});

