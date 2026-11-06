import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { getEnv } from "../env";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function createDb(client: ReturnType<typeof createClient>) {
  return drizzle(client, { schema });
}

export function getDb() {
  if (!dbInstance) {
    const env = getEnv();
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

export type Database = ReturnType<typeof getDb>;
