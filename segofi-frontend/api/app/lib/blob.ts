import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";
import { getEnv } from "../env.js";

export interface StorageUploader {
    subir(nombreArchivo: string, contenido: Buffer | Blob | ArrayBuffer): Promise<string>;
}

/** Prefijo de las URL guardadas en BD para archivos que viven en el disco local. */
export const PREFIJO_LOCAL = "local://";

// Raíz del proyecto (segofi-frontend) resuelta desde api/app/lib/blob.ts
const RAIZ_PROYECTO = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

/** Directorio donde se guardan los adjuntos cuando no hay almacenamiento remoto configurado. */
export function directorioAdjuntos(): string {
    return process.env.SEGOFI_UPLOADS_DIR ?? resolve(RAIZ_PROYECTO, "uploads", "adjuntos");
}

function sanearNombre(nombreArchivo: string): string {
    const limpio = nombreArchivo.replace(/[^\w.-]+/g, "_").replace(/^\.+/, "");
    return limpio.slice(0, 120) || "archivo";
}

async function aBuffer(contenido: Buffer | Blob | ArrayBuffer): Promise<Buffer> {
    if (Buffer.isBuffer(contenido)) return contenido;
    if (contenido instanceof ArrayBuffer) return Buffer.from(contenido);
    return Buffer.from(await (contenido as Blob).arrayBuffer());
}

// Implementación real con @vercel/blob
export class VercelBlobUploader implements StorageUploader {
    async subir(nombreArchivo: string, contenido: Buffer | Blob | ArrayBuffer): Promise<string> {
        const env = getEnv();
        const blob = await put(`adjuntos/${Date.now()}-${sanearNombre(nombreArchivo)}`, contenido, {
            access: "public",
            token: env.BLOB_READ_WRITE_TOKEN,
        });
        return blob.url;
    }
}

/**
 * Almacenamiento en disco local. Se usa cuando no hay token de Vercel Blob
 * (por ejemplo en desarrollo), para que los adjuntos siga siendo posibles.
 */
export class LocalFileUploader implements StorageUploader {
    constructor(private readonly directorio?: string) {}

    async subir(nombreArchivo: string, contenido: Buffer | Blob | ArrayBuffer): Promise<string> {
        const destino = this.directorio ?? directorioAdjuntos();
        await mkdir(destino, { recursive: true });
        const nombre = `${Date.now()}-${sanearNombre(nombreArchivo)}`;
        await writeFile(join(destino, nombre), await aBuffer(contenido));
        return `${PREFIJO_LOCAL}${nombre}`;
    }
}

// Implementación mock para tests
export class MockBlobUploader implements StorageUploader {
    async subir(nombreArchivo: string): Promise<string> {
        return `https://mock-blob.local/adjuntos/${Date.now()}-${nombreArchivo}`;
    }
}

const vercelUploader = new VercelBlobUploader();
const localUploader = new LocalFileUploader();

let currentUploader: StorageUploader | null = null;

export function setBlobUploader(uploader: StorageUploader) {
    currentUploader = uploader;
}

export function resetBlobUploader() {
    currentUploader = null;
}

/**
 * Uploader activo: el inyectado en tests tiene prioridad; si no hay ninguno,
 * se usa Vercel Blob cuando hay token configurado y disco local en caso contrario.
 */
export function getBlobUploader(): StorageUploader {
    if (currentUploader) return currentUploader;
    return getEnv().BLOB_READ_WRITE_TOKEN ? vercelUploader : localUploader;
}

/** Indica si una URL guardada en BD apunta a un archivo local en disco. */
export function esUrlLocal(url: string): boolean {
    return url.startsWith(PREFIJO_LOCAL);
}

/**
 * Resuelve la ruta en disco de una URL local. Devuelve null si la URL no es local
 * o si intenta salir del directorio de adjuntos.
 */
export function rutaArchivoLocal(url: string): string | null {
    if (!esUrlLocal(url)) return null;
    const nombre = url.slice(PREFIJO_LOCAL.length);
    if (!/^[\w.-]+$/.test(nombre)) return null;
    return join(directorioAdjuntos(), nombre);
}

/** Lee el contenido de un archivo local; null si no existe o la URL no es local. */
export async function leerArchivoLocal(url: string): Promise<Uint8Array<ArrayBuffer> | null> {
    const ruta = rutaArchivoLocal(url);
    if (!ruta || !existsSync(ruta)) return null;
    const contenido = await readFile(ruta);
    const bytes = new Uint8Array(new ArrayBuffer(contenido.byteLength));
    bytes.set(contenido);
    return bytes;
}
