import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../app/db/schema.js";
import { migrar } from "../app/db/migrate.js";
import { seed } from "../app/db/seed.js";
import { createApp } from "../index.js";
import { hashPassword } from "../app/lib/auth.js";
import { eq } from "drizzle-orm";

describe("Task 11 - Adminstracion de usuarios", () => {
    let client: ReturnType<typeof createClient>;
    let db: ReturnType<typeof drizzle<typeof schema>>;
    let app: ReturnType<typeof createApp>;

    let cookieAdmin: string;
    let cookieOperativo: string;
    let opId: number;

    beforeEach(async () => {
        client = createClient({ url: ":memory:" });
        await client.execute("PRAGMA foreign_keys = ON;");
        db = drizzle(client, { schema });
        await migrar(db);
        await seed(db);
        app = createApp(db);

        const pw = await hashPassword("Password123!");
        const ahora = new Date().toISOString();

        //Admin (Rol 2)
        await db.insert(schema.usuarios).values({
            nombre: "Admin Central",
            email: "admin@test.com",
            passwordHash: pw,
            rolId: 2,
            departamentoId: 1,
            activo: true,
            creadoEn: ahora,
        });
        // Operativo (Rol 1)
        const [op] = await db
            .insert(schema.usuarios)
            .values({
                nombre: "Operativo Uno",
                email: "op@test.com",
                passwordHash: pw,
                rolId: 1,
                departamentoId: 1,
                activo: true,
                creadoEn: ahora,
            })
            .returning();
        opId = op.id;
        // Login Admin
        const lAdmin = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@test.com", password: "Password123!" }),
        });
        cookieAdmin = (lAdmin.headers.get("set-cookie") || "").split(";")[0];
        // Login Operativo
        const lOp = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "op@test.com", password: "Password123!" }),
        });
        cookieOperativo = (lOp.headers.get("set-cookie") || "").split(";")[0];
    });
    it("GET /api/usuarios con rol 2 devuelve lista sin password_hash", async () => {
        const res = await app.request("/api/usuarios", {
            headers: { Cookie: cookieAdmin },
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(Array.isArray(body.usuarios)).toBe(true);
        expect(body.usuarios.length).toBeGreaterThanOrEqual(2);
        // Verificar que NINGUNO tenga password_hash o password
        for (const u of body.usuarios) {
            expect(u).not.toHaveProperty("passwordHash");
            expect(u).not.toHaveProperty("password_hash");
            expect(u).not.toHaveProperty("password");
        }
    });
    it("Rol 1 al intentar acceder a /api/usuarios devuelve 403", async () => {
        const res = await app.request("/api/usuarios", {
            headers: { Cookie: cookieOperativo },
        });
        expect(res.status).toBe(403);
    });
    it("POST /api/usuarios crea usuario y audita con usuario_crear", async () => {
        const res = await app.request("/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
            body: JSON.stringify({
                nombre: "Nuevo Usuario",
                email: "nuevo@test.com",
                password: "PasswordSeguro123!",
                rol_id: 1,
                departamento_id: 1,
            }),
        });
        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.usuario.email).toBe("nuevo@test.com");
        expect(body.usuario).not.toHaveProperty("passwordHash");
        // Verificar auditoría
        const [audit] = await db
            .select()
            .from(schema.auditoria)
            .where(eq(schema.auditoria.accion, "usuario_crear"));
        expect(audit).toBeDefined();
        expect(audit.entidad).toBe("usuario");
    });
    it("Desactivar usuario hace que su siguiente request con cookie devuelva 401", async () => {
        // 1. Desactivación lógica por el admin
        const updateRes = await app.request(`/api/usuarios/${opId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Cookie: cookieAdmin },
            body: JSON.stringify({ activo: false }),
        });
        expect(updateRes.status).toBe(200);
        // 2. Operativo intenta hacer request a /api/auth/me con su cookie previa
        const meRes = await app.request("/api/auth/me", {
            headers: { Cookie: cookieOperativo },
        });
        expect(meRes.status).toBe(401);
    });
    it("PUT /api/usuarios/:id/password cambia contraseña si la actual es válida", async () => {
        // Intento con contraseña actual incorrecta -> 400
        const failRes = await app.request(`/api/usuarios/${opId}/password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Cookie: cookieOperativo },
            body: JSON.stringify({
                passwordActual: "Incorrecta123!",
                nuevaPassword: "NuevaPassword456!",
            }),
        });
        expect(failRes.status).toBe(400);
        // Intento con contraseña actual correcta -> 200
        const successRes = await app.request(`/api/usuarios/${opId}/password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Cookie: cookieOperativo },
            body: JSON.stringify({
                passwordActual: "Password123!",
                nuevaPassword: "NuevaPassword456!",
            }),
        });
        expect(successRes.status).toBe(200);
        // Login posterior con la nueva contraseña funciona
        const loginNuevo = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "op@test.com", password: "NuevaPassword456!" }),
        });
        expect(loginNuevo.status).toBe(200);
    });
});