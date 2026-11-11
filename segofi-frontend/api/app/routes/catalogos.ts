import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { requireUser } from "../lib/auth.js";
import type { Database } from "../db/client.js";
import { getDb } from "../db/client.js";
import * as schema from "../db/schema.js";
import type { AppEnv } from "../types.js";

const catalogosRouter = new Hono<AppEnv>();

catalogosRouter.get("/", async (c) => {
  await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  const [estados, tiposDocumento, departamentos, roles] = await Promise.all([
    db.select().from(schema.estados).orderBy(schema.estados.orden),
    db.select().from(schema.tiposDocumento).where(eq(schema.tiposDocumento.activo, true)),
    db.select().from(schema.departamentos).where(eq(schema.departamentos.activo, true)),
    db.select().from(schema.roles).orderBy(schema.roles.id),
  ]);

  return c.json(
    {
      estados,
      tiposDocumento,
      departamentos,
      roles,
    },
    200,
  );
});

export default catalogosRouter;

