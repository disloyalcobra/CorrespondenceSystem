import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cargarEnvLocal, parsearEnvFile } from "../_app/env.js";

/**
 * Regresión del fallo reportado: la API arrancaba sin leer el archivo .env
 * (tsx y vitest no lo cargan solos) y terminaba escribiendo en una base local
 * en lugar de la base de datos configurada.
 */
describe("Carga del archivo .env", () => {
    let dir: string;
    const variablesOriginales: Record<string, string | undefined> = {};

    function guardarOriginal(clave: string) {
        if (!(clave in variablesOriginales)) {
            variablesOriginales[clave] = process.env[clave];
        }
    }

    beforeEach(() => {
        dir = mkdtempSync(join(tmpdir(), "segofi-env-"));
    });

    afterEach(() => {
        for (const [clave, valor] of Object.entries(variablesOriginales)) {
            if (valor === undefined) delete process.env[clave];
            else process.env[clave] = valor;
        }
        rmSync(dir, { recursive: true, force: true });
        vi.resetModules();
    });

    it("parsea las variables ignorando comentarios y quitando comillas", () => {
        const parsed = parsearEnvFile(
            [
                "# comentario",
                "",
                "TURSO_DATABASE_URL=libsql://ejemplo.turso.io",
                'JWT_SECRET="secreto con comillas"',
                "VACIO=",
            ].join("\n")
        );

        expect(parsed).toEqual({
            TURSO_DATABASE_URL: "libsql://ejemplo.turso.io",
            JWT_SECRET: "secreto con comillas",
            VACIO: "",
        });
    });

    it("carga en process.env las variables que faltan", () => {
        guardarOriginal("TURSO_DATABASE_URL");
        guardarOriginal("BLOB_READ_WRITE_TOKEN");

        const ruta = join(dir, ".env");
        writeFileSync(
            ruta,
            "TURSO_DATABASE_URL=libsql://desde-dotenv.turso.io\nBLOB_READ_WRITE_TOKEN=token_prueba\n"
        );

        delete process.env.TURSO_DATABASE_URL;
        delete process.env.BLOB_READ_WRITE_TOKEN;

        const aplicadas = cargarEnvLocal(ruta);

        expect(process.env.TURSO_DATABASE_URL).toBe("libsql://desde-dotenv.turso.io");
        expect(process.env.BLOB_READ_WRITE_TOKEN).toBe("token_prueba");
        expect(aplicadas).toEqual(
            expect.arrayContaining(["TURSO_DATABASE_URL", "BLOB_READ_WRITE_TOKEN"])
        );
    });

    it("no sobrescribe las variables ya definidas en el entorno", () => {
        guardarOriginal("TURSO_DATABASE_URL");

        const ruta = join(dir, ".env");
        writeFileSync(ruta, "TURSO_DATABASE_URL=libsql://desde-dotenv.turso.io\n");

        process.env.TURSO_DATABASE_URL = "libsql://desde-entorno.turso.io";

        const aplicadas = cargarEnvLocal(ruta);

        expect(process.env.TURSO_DATABASE_URL).toBe("libsql://desde-entorno.turso.io");
        expect(aplicadas).not.toContain("TURSO_DATABASE_URL");
    });

    it("getEnv() usa la base de datos declarada en el archivo .env", async () => {
        guardarOriginal("TURSO_DATABASE_URL");
        guardarOriginal("SEGOFI_ENV_FILE");

        const ruta = join(dir, ".env");
        writeFileSync(ruta, "TURSO_DATABASE_URL=libsql://desde-dotenv.turso.io\n");

        delete process.env.TURSO_DATABASE_URL;
        process.env.SEGOFI_ENV_FILE = ruta;

        vi.resetModules();
        const { getEnv } = await import("../_app/env.js");

        expect(getEnv().TURSO_DATABASE_URL).toBe("libsql://desde-dotenv.turso.io");
    });
});
