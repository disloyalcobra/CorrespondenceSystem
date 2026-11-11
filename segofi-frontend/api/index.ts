import { Hono } from "hono";
import { handle } from "@hono/vercel";
import { handleApiError } from "./app/lib/http.js";
import authRouter from "./app/routes/auth.js";
import catalogosRouter from "./app/routes/catalogos.js";
import departamentosRouter from "./app/routes/departamentos.js";
import tiposDocumentoRouter from "./app/routes/tiposDocumento.js";
import oficiosRouter from "./app/routes/oficios.js";
import turnosRouter from "./app/routes/turnos.js";
import salidasRouter from "./app/routes/salida.js";
import type { Database } from "./app/db/client.js";
import { getDb } from "./app/db/client.js";
import type { AppEnv } from "./app/types.js";
import usuariosRouter from "./app/routes/usuarios.js";
import { oficiosAdjuntosRouter, adjuntosRouter } from "./app/routes/adjuntos.js";
import { seguimientosResumenRouter } from "./app/routes/seguimientos.js";
import auditoriaRouter from "./app/routes/auditoria.js";
import reportesRouter from "./app/routes/reportes.js";
import notificacionesRouter from "./app/routes/notificaciones.js";

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
  app.route("/usuarios", usuariosRouter);
  app.route("/oficios", oficiosAdjuntosRouter);
  app.route("/adjuntos", adjuntosRouter);
  app.route("/seguimientos", seguimientosResumenRouter);
  app.route("/auditoria", auditoriaRouter);
  app.route("/reportes", reportesRouter);
  app.route("/notificaciones", notificacionesRouter);

  return app;
}

const app = createApp();

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export default handle(app);
