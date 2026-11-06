import { Hono } from "hono";
import { requireUser } from "../lib/auth";
import { ApiError } from "../lib/http";
import { filtroOficiosSchema } from "../schemas/oficio";
import { listarOficios, obtenerOficio } from "../lib/query";
import type { Database } from "../db/client";
import { getDb } from "../db/client";

const oficiosRouter = new Hono();

// Listado de oficios con alcance, filtros y paginación
oficiosRouter.get("/", async (c) => {
  const user = await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  const query = c.req.query();
  const parsed = filtroOficiosSchema.safeParse(query);
  if (!parsed.success) {
    throw new ApiError(400, "Parámetros de búsqueda inválidos", parsed.error.format());
  }

  const paginado = await listarOficios(db, user, parsed.data);
  return c.json(paginado, 200);
});

// Detalle de oficio (404 si está fuera de alcance o no existe)
oficiosRouter.get("/:id", async (c) => {
  const user = await requireUser(c);
  const id = Number(c.req.param("id"));
  if (!id) throw new ApiError(400, "ID de oficio inválido");

  const db: Database = c.get("db") ?? getDb();

  const oficio = await obtenerOficio(db, user, id);
  if (!oficio) {
    throw new ApiError(404, "Oficio no encontrado");
  }

  return c.json({ oficio }, 200);
});

export default oficiosRouter;

