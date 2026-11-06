import { Hono } from "hono";
import { handle } from "@hono/vercel";
import { handleApiError } from "./app/lib/http";
import authRouter from "./app/routes/auth";
import catalogosRouter from "./app/routes/catalogos";
import departamentosRouter from "./app/routes/departamentos";
import tiposDocumentoRouter from "./app/routes/tiposDocumento";
import oficiosRouter from "./app/routes/oficios";
import turnosRouter from "./app/routes/turnos";
import salidasRouter from "./app/routes/salida";
import type { Database } from "./app/db/client";
import { getDb } from "./app/db/client";
import type { AppEnv } from "./app/types";

export function createApp(customDb?: Database): Hono<AppEnv> {
  const app = new Hono<AppEnv>().basePath("/api");

  app.use("*", async (c, next) => {
    c.set("db", customDb ?? getDb());
    await next();
  });

  app.onError(handleApiError);

  app.get("/health", (c) => {
    return c.json({ ok: true });
  });

  app.route("/auth", authRouter);
  app.route("/catalogos", catalogosRouter);
  app.route("/departamentos", departamentosRouter);
  app.route("/tipos-documento", tiposDocumentoRouter);
  app.route("/oficios", oficiosRouter);
  app.route("/oficios", turnosRouter);
  app.route("/oficios", salidasRouter);

  return app;
}

const app = createApp();

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export default handle(app);
