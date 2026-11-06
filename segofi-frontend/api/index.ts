import { Hono } from "hono";
import { handle } from "@hono/vercel";
import { errorMiddleware } from "./app/lib/http";

export function createApp(): Hono {
  const app = new Hono().basePath("/api");

  app.use("*", errorMiddleware());

  app.get("/health", (c) => {
    return c.json({ ok: true });
  });

  return app;
}

const app = createApp();

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export default handle(app);

