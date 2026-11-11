import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as schema from "../_app/db/schema.js";
import { migrar } from "../_app/db/migrate.js";
import { seed } from "../_app/db/seed.js";
import { createApp } from "../index.js";
import { hashPassword } from "../_app/lib/auth.js";
import { resetBlobUploader } from "../_app/lib/blob.js";

/**
 * Regresión del fallo reportado: al crear un oficio con archivo el servidor
 * devolvía "Error interno del servidor" porque el almacenamiento remoto no
 * tenía credenciales. Sin token de Vercel Blob los adjuntos se guardan en disco
 * y se sirven por la API respetando el control de alcance.
 */
describe("Adjuntos con almacenamiento local (sin token de Vercel Blob)", () => {
    let client: ReturnType<typeof createClient>;
    let db: ReturnType<typeof drizzle<typeof schema>>;
    let app: ReturnType<typeof createApp>;
    let dirAdjuntos: string;

    let cookieAdmin: string;
    let cookieFueraDeAlcance: string;
    let oficioId: number;

    beforeEach(async () => {
        dirAdjuntos = mkdtempSync(join(tmpdir(), "segofi-adjuntos-"));
        process.env.SEGOFI_UPLOADS_DIR = dirAdjuntos;
        resetBlobUploader();

        client = createClient({ url: ":memory:" });
        await client.execute("PRAGMA foreign_keys = ON;");
        db = drizzle(client, { schema });
        await migrar(db);
        await seed(db);
        app = createApp(db);

        const pw = await hashPassword("Password123!");
        const ahora = new Date().toISOString();

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

        await db.insert(schema.usuarios).values({
            nombre: "Operativo Dept 2",
            email: "op2@test.com",
            passwordHash: pw,
            rolId: 1,
            departamentoId: 2,
            activo: true,
            creadoEn: ahora,
        });

        const [oficio] = await db
            .insert(schema.oficios)
            .values({
                folio: "OFI-LOCAL-0001",
                tipoDocumentoId: 1,
                objeto: "Oficio con adjunto local",
                asunto: "Asunto con adjunto",
                destinatario: "Destinatario",
                fechaDocumento: "2026-01-01",
                fechaRecepcion: ahora,
                termino: null,
                remitenteUsuarioId: admin.id,
                origenUsuarioId: admin.id,
                departamentoDestinoInicialId: 1,
                estadoId: 1,
                creadoEn: ahora,
            })
            .returning();
        oficioId = oficio.id;

        const lAdmin = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@test.com", password: "Password123!" }),
        });
        cookieAdmin = (lAdmin.headers.get("set-cookie") || "").split(";")[0];

        const lOp2 = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "op2@test.com", password: "Password123!" }),
        });
        cookieFueraDeAlcance = (lOp2.headers.get("set-cookie") || "").split(";")[0];
    });

    afterEach(() => {
        delete process.env.SEGOFI_UPLOADS_DIR;
        resetBlobUploader();
        rmSync(dirAdjuntos, { recursive: true, force: true });
    });

    it("sube el archivo a disco y responde 201 con una URL local", async () => {
        const formData = new FormData();
        formData.append(
            "archivo",
            new File(["contenido del anexo"], "anexo.pdf", { type: "application/pdf" })
        );

        const res = await app.request(`/api/oficios/${oficioId}/adjuntos`, {
            method: "POST",
            headers: { Cookie: cookieAdmin },
            body: formData,
        });

        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.adjunto.nombreArchivo).toBe("anexo.pdf");
        expect(body.adjunto.archivoUrl.startsWith("local://")).toBe(true);

        const archivos = readdirSync(dirAdjuntos);
        expect(archivos).toHaveLength(1);
        expect(archivos[0]).toContain("anexo.pdf");
    });

    it("sirve el archivo por la API y devuelve el contenido", async () => {
        const formData = new FormData();
        formData.append(
            "archivo",
            new File(["contenido del anexo"], "anexo.pdf", { type: "application/pdf" })
        );

        const uploadRes = await app.request(`/api/oficios/${oficioId}/adjuntos`, {
            method: "POST",
            headers: { Cookie: cookieAdmin },
            body: formData,
        });
        const { adjunto } = await uploadRes.json();

        const res = await app.request(`/api/adjuntos/${adjunto.id}/archivo`, {
            headers: { Cookie: cookieAdmin },
        });

        expect(res.status).toBe(200);
        expect(res.headers.get("content-type")).toBe("application/pdf");
        expect(await res.text()).toBe("contenido del anexo");
    });

    it("GET /api/adjuntos/:id/url devuelve la ruta de la API para archivos locales", async () => {
        const formData = new FormData();
        formData.append("archivo", new File(["datos"], "datos.txt"));

        const uploadRes = await app.request(`/api/oficios/${oficioId}/adjuntos`, {
            method: "POST",
            headers: { Cookie: cookieAdmin },
            body: formData,
        });
        const { adjunto } = await uploadRes.json();

        const res = await app.request(`/api/adjuntos/${adjunto.id}/url`, {
            headers: { Cookie: cookieAdmin },
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.url).toBe(`/api/adjuntos/${adjunto.id}/archivo`);
    });

    it("no entrega el archivo a un usuario fuera de alcance", async () => {
        const formData = new FormData();
        formData.append("archivo", new File(["privado"], "privado.pdf"));

        const uploadRes = await app.request(`/api/oficios/${oficioId}/adjuntos`, {
            method: "POST",
            headers: { Cookie: cookieAdmin },
            body: formData,
        });
        const { adjunto } = await uploadRes.json();

        const res = await app.request(`/api/adjuntos/${adjunto.id}/archivo`, {
            headers: { Cookie: cookieFueraDeAlcance },
        });

        expect(res.status).toBe(404);
    });

    it("informa cuando el archivo ya no está en el servidor", async () => {
        const formData = new FormData();
        formData.append("archivo", new File(["temporal"], "temporal.pdf"));

        const uploadRes = await app.request(`/api/oficios/${oficioId}/adjuntos`, {
            method: "POST",
            headers: { Cookie: cookieAdmin },
            body: formData,
        });
        const { adjunto } = await uploadRes.json();

        rmSync(dirAdjuntos, { recursive: true, force: true });

        const res = await app.request(`/api/adjuntos/${adjunto.id}/archivo`, {
            headers: { Cookie: cookieAdmin },
        });

        expect(res.status).toBe(404);
        expect(existsSync(dirAdjuntos)).toBe(false);
    });
});
