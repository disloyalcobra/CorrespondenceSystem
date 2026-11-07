import { put } from "@vercel/blob";
import { getEnv } from "../env";

export interface StorageUploader {
    subir(nombreArchivo: string, contenido: Buffer | Blob | ArrayBuffer): Promise<string>;
}

// Implementación real con @vercel/blob
export class VercelBlobUploader implements StorageUploader {
    async subir(nombreArchivo: string, contenido: Buffer | Blob | ArrayBuffer): Promise<string> {
        const env = getEnv();
        const blob = await put(`adjuntos/${Date.now()}-${nombreArchivo}`, contenido, {
            access: "public",
            token: env.BLOB_READ_WRITE_TOKEN,
        });
        return blob.url;
    }
}

// Implementación mock para tests
export class MockBlobUploader implements StorageUploader {
    async subir(nombreArchivo: string): Promise<string> {
        return `https://mock-blob.local/adjuntos/${Date.now()}-${nombreArchivo}`;
    }
}

let currentUploader: StorageUploader = new VercelBlobUploader();

export function setBlobUploader(uploader: StorageUploader) {
    currentUploader = uploader;
}

export function getBlobUploader(): StorageUploader {
    return currentUploader;
}