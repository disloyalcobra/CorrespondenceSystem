import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const envSchema = z.object({
    TURSO_DATABASE_URL: z.string().default("file:local.db"),
    TURSO_AUTH_TOKEN: z.string().optional(),
    JWT_SECRET: z.string().default("dev_jwt_secret_change_in_production"),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
    SEED_ADMIN_EMAIL: z.string().email().default("admin@sectur.gob.mx"),
    SEED_ADMIN_PASSWORD: z.string().default("AdminPassword123!"),
    SEED_ADMIN_NOMBRE: z.string().default("Administrador General"),
});

export type Env = z.infer<typeof envSchema>;

// Raíz del proyecto (segofi-frontend) resuelta desde api/_app/env.ts
const RAIZ_PROYECTO = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * Convierte el contenido de un archivo .env en un mapa de variables.
 * Ignora comentarios y líneas en blanco, y quita las comillas del valor.
 */
export function parsearEnvFile(contenido: string): Record<string, string> {
    const salida: Record<string, string> = {};

    for (const linea of contenido.split(/\r?\n/)) {
        const limpio = linea.trim();
        if (!limpio || limpio.startsWith("#")) continue;

        const separador = limpio.indexOf("=");
        if (separador === -1) continue;

        const clave = limpio.slice(0, separador).trim();
        if (!clave) continue;

        let valor = limpio.slice(separador + 1).trim();
        if (
            (valor.startsWith('"') && valor.endsWith('"') && valor.length > 1) ||
            (valor.startsWith("'") && valor.endsWith("'") && valor.length > 1)
        ) {
            valor = valor.slice(1, -1);
        }

        salida[clave] = valor;
    }

    return salida;
}

/** Ruta del archivo .env a cargar. Puede sobrescribirse con SEGOFI_ENV_FILE (útil en tests). */
export function rutaEnvFile(): string {
    return process.env.SEGOFI_ENV_FILE ?? resolve(RAIZ_PROYECTO, ".env");
}

/**
 * Carga el archivo .env en process.env sin sobrescribir variables ya definidas:
 * las variables reales del entorno (producción) siempre tienen precedencia.
 * Devuelve el nombre de las variables que se agregaron.
 */
export function cargarEnvLocal(ruta: string = rutaEnvFile()): string[] {
    const aplicadas: string[] = [];

    if (!existsSync(ruta)) return aplicadas;

    let contenido: string;
    try {
        contenido = readFileSync(ruta, "utf8");
    } catch {
        return aplicadas;
    }

    for (const [clave, valor] of Object.entries(parsearEnvFile(contenido))) {
        if (process.env[clave] === undefined) {
            process.env[clave] = valor;
            aplicadas.push(clave);
        }
    }

    return aplicadas;
}

let parsedEnv: Env | null = null;

export function getEnv(): Env {
    if (!parsedEnv) {
        // El archivo .env se carga aquí porque tsx y vitest no lo hacen por sí solos;
        // sin esto la API arrancaba con la base local y las escrituras no llegaban
        // a la base de datos configurada.
        cargarEnvLocal();

        const result = envSchema.safeParse(process.env);
        if (!result.success) {
            console.error("Configuración de entorno inválida:", result.error.format());
            throw new Error("Variables de entorno inválidas");
        }
        parsedEnv = result.data;

        if (parsedEnv.TURSO_DATABASE_URL.startsWith("file:")) {
            console.warn(
                `[SegOfi] TURSO_DATABASE_URL no está configurada: se usará la base local "${parsedEnv.TURSO_DATABASE_URL}". ` +
                    "Los datos NO se guardarán en la base de datos configurada del proyecto."
            );
        }
    }
    return parsedEnv;
}
