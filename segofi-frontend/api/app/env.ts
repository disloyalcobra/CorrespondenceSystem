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

let parsedEnv: Env | null = null;

export function getEnv(): Env {
  if (!parsedEnv) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error("Configuración de entorno inválida:", result.error.format());
      throw new Error("Variables de entorno inválidas");
    }
    parsedEnv = result.data;
  }
  return parsedEnv;
}

