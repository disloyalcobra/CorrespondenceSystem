import { Hono } from "hono";
import { handle } from "@hono/vercel";
import { handleApiError } from "./app/lib/http";
import authRouter from "./app/routes/auth";
import type { Database } from "./app/db/client";
import { getDb } from "./app/db/client";

export function createApp(customDb?: Database): Hono {
  const app = new Hono().basePath("/api");

  app.use("*", async (c, next) => {
    c.set("db", customDb ?? getDb());
    await next();
  });

  app.onError(handleApiError);

  app.get("/health", (c) => {
    return c.json({ ok: true });
  });

  app.route("/auth", authRouter);

  return app;
}

const app = createApp();

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export default handle(app);
