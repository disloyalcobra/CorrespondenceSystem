import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../app/db/schema.js";
import { migrar } from "../app/db/migrate.js";
import { seed } from "../app/db/seed.js";
import { createApp } from "../index.js";
import { hashPassword } from "../app/lib/auth.js";

describe("Seguimiento por persona (GET /api/seguimientos/personas)", () => {
    let client: ReturnType<typeof createClient>;
    let db: ReturnType<typeof drizzle<typeof schema>>;
    let app: ReturnType<typeof createApp>;
    let cookieAdmin: string;
    let cookieOperativo: number;

    beforeEach(async () => {
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

        const [operativo] = await db
            .insert(schema.usuarios)
            .values({
                nombre: "Ana Operativa",
                email: "ana@test.com",
                passwordHash: pw,
                rolId: 1,
                departamentoId: 1,
                activo: true,
                creadoEn: ahora,
            })
            .returning();
        cookieOperativo = operativo.id;

        const [oficio] = await db
            .insert(schema.oficios)
            .values({
                folio: "OFI-PERS-0001",
                tipoDocumentoId: 1,
                objeto: "Objeto",
                asunto: "Asunto de prueba",
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

        await db.insert(schema.oficioSeguimiento).values({
            oficioId: oficio.id,
            usuarioId: admin.id,
            tipo: "NOTA",
            contenido: "Se revisó el documento",
            creadoEn: ahora,
        });

        await db.insert(schema.oficioTurnos).values({
            oficioId: oficio.id,
            departamentoId: 2,
            turnadoPorUsuarioId: operativo.id,
            turnadoEn: ahora,
            recibidoEn: null,
        });

        const login = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@test.com", password: "Password123!" }),
        });
        cookieAdmin = (login.headers.get("set-cookie") || "").split(";")[0];
    });

    it("sin sesión devuelve 401", async () => {
        const res = await app.request("/api/seguimientos/personas");
        expect(res.status).toBe(401);
    });

    it("agrupa las acciones por persona con su nombre real", async () => {
        const res = await app.request("/api/seguimientos/personas", {
            headers: { Cookie: cookieAdmin },
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.personas).toHaveLength(2);

        const ana = body.personas.find((p: { usuarioNombre: string }) => p.usuarioNombre === "Ana Operativa");
        expect(ana).toBeDefined();
        expect(ana.acciones).toHaveLength(1);
        expect(ana.acciones[0].tipo).toBe("TURNO");
        expect(ana.acciones[0].folio).toBe("OFI-PERS-0001");

        const admin = body.personas.find((p: { usuarioNombre: string }) => p.usuarioNombre === "Admin");
        expect(admin).toBeDefined();
        expect(admin.acciones[0].contenido).toBe("Se revisó el documento");
    });

    it("excluye las acciones sobre oficios fuera del alcance del usuario", async () => {
        // El operativo solo tiene alcance por su departamento (1): se agrega un oficio
        // dirigido al departamento 2, que no debe aparecer en su resumen.
        const ahora = new Date().toISOString();
        await db.insert(schema.oficios).values({
            folio: "OFI-PERS-0002",
            tipoDocumentoId: 1,
            objeto: "Objeto",
            asunto: "Fuera de alcance",
            destinatario: "Destinatario",
            fechaDocumento: "2026-01-01",
            fechaRecepcion: ahora,
            termino: null,
            remitenteUsuarioId: cookieOperativo,
            origenUsuarioId: cookieOperativo,
            departamentoDestinoInicialId: 2,
            estadoId: 1,
            creadoEn: ahora,
        });

        const login = await app.request("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "ana@test.com", password: "Password123!" }),
        });
        const cookieOp = (login.headers.get("set-cookie") || "").split(";")[0];

        const res = await app.request("/api/seguimientos/personas", {
            headers: { Cookie: cookieOp },
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        const folios = body.personas.flatMap((p: { acciones: Array<{ folio: string }> }) =>
            p.acciones.map((a: { folio: string }) => a.folio)
        );
        expect(folios).toContain("OFI-PERS-0001");
        expect(folios).not.toContain("OFI-PERS-0002");
    });
});
