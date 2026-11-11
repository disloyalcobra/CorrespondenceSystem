import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../_app/db/schema.js";
import { migrar } from "../_app/db/migrate.js";
import { seed } from "../_app/db/seed.js";
import { createApp } from "../index.js";
import { hashPassword } from "../_app/lib/auth.js";
import { setBlobUploader, MockBlobUploader } from "../_app/lib/blob.js";

describe("Task 12 — Adjuntos con Vercel Blob y control de alcance", () => {
    let client: ReturnType<typeof createClient>;
    let db: ReturnType<typeof drizzle<typeof schema>>;
    let app: ReturnType<typeof createApp>;

    let cookieAdmin: string;
    let cookieOpDept1: string;
    let cookieOpDept2: string;

    let oficioDept1Id: number;

    beforeEach(async () => {
        // Usar el Mock Uploader para no interactuar con red
        setBlobUploader(new MockBlobUploader());

        client = createClient({ url: ":memory:" });
        await client.execute("PRAGMA foreign_keys = ON;");
        db = drizzle(client, { schema });
        await migrar(db);
        await seed(db);
        app = createApp(db);

        const pw = await hashPassword("Password123!");
        const ahora = new Date().toISOString();

        // 1. Admin (Rol 2)
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

        // 2. Operativo Dept 1 (Rol 1, Dept 1)
        await db.insert(schema.usuarios).values({
            nombre: "Operativo 1",
            email: "op1@test.com",
            passwordHash: pw,
            rolId: 1,
            departamentoId: 1,
            activo: true,
            creadoEn: ahora,
        });

        // 3. Operativo Dept 2 (Rol 1, Dept 2)
        await db.insert(schema.usuarios).values({
            nombre: "Operativo 2",
            email: "op2@test.com",
            passwordHash: pw,
            rolId: 1,
            departamentoId: 2,
            activo: true,
            creadoEn: ahora,
        });

        // Oficio con destino Departamento 1
        const [oficio] = await db
            .insert(schema.oficios)
            .values({
                folio: "OFI-ADJ-0001",
                tipoDocumentoId: 1,
                objeto: "Oficio para adjuntos",
                asunto: "Asunto adjuntos",
                destinatario: "Destinatario",
                fechaDocumento: "2026-01-01",
                fechaRecepcion: ahora,
                termino: null,
                remitenteUsuarioId: admin.id,
                origenUsuarioId: admin.id,
                departamentoDestinoInicialId: 1,
                estadoId: 1, // Pendiente
                creadoEn: ahora,
            })
            .returning();
        oficioDept1Id = oficio.id;

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

    it("subir archivo a oficio en alcance devuelve 201 y crea registro de metadatos", async () => {
        const formData = new FormData();
        const fakeFile = new File(["contenido de prueba"], "oficio_anexo.pdf", {
            type: "application/pdf",
        });
        formData.append("archivo", fakeFile);

        const res = await app.request(`/api/oficios/${oficioDept1Id}/adjuntos`, {
            method: "POST",
            headers: { Cookie: cookieOpDept1 },
            body: formData,
        });

        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.adjunto).toBeDefined();
        expect(body.adjunto.nombreArchivo).toBe("oficio_anexo.pdf");
        expect(body.adjunto.archivoUrl).toContain("mock-blob.local");
    });

    it("GET /api/adjuntos/:id/url con usuario en alcance devuelve 200 con la URL", async () => {
        // 1. Subir archivo
        const formData = new FormData();
        formData.append("archivo", new File(["test"], "anexo.pdf", { type: "application/pdf" }));
        const uploadRes = await app.request(`/api/oficios/${oficioDept1Id}/adjuntos`, {
            method: "POST",
            headers: { Cookie: cookieAdmin },
            body: formData,
        });
        const { adjunto } = await uploadRes.json();

        // 2. Op1 (Dept 1) pide la URL
        const urlRes = await app.request(`/api/adjuntos/${adjunto.id}/url`, {
            headers: { Cookie: cookieOpDept1 },
        });

        expect(urlRes.status).toBe(200);
        const body = await urlRes.json();
        expect(body.url).toBe(adjunto.archivoUrl);
    });

    it("GET /api/adjuntos/:id/url sin sesión devuelve 401", async () => {
        const res = await app.request(`/api/adjuntos/1/url`);
        expect(res.status).toBe(401);
    });

    it("GET /api/adjuntos/:id/url fuera de alcance devuelve 404", async () => {
        // 1. Subir archivo al oficio de Dept 1
        const formData = new FormData();
        formData.append("archivo", new File(["test"], "privado.pdf", { type: "application/pdf" }));
        const uploadRes = await app.request(`/api/oficios/${oficioDept1Id}/adjuntos`, {
            method: "POST",
            headers: { Cookie: cookieAdmin },
            body: formData,
        });
        const { adjunto } = await uploadRes.json();

        // 2. Op2 (Dept 2) intenta obtener la URL -> debe dar 404 (ocultar existencia)
        const res = await app.request(`/api/adjuntos/${adjunto.id}/url`, {
            headers: { Cookie: cookieOpDept2 },
        });
        expect(res.status).toBe(404);
    });
});
