import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { loginSchema } from "../schemas/auth";
import { ApiError } from "../lib/http";
import { verifyPassword, crearSesionUsuario, limpiarSesion, requireUser } from "../lib/auth";
import type { Database } from "../db/client";
import { getDb } from "../db/client";
import * as schema from "../db/schema";

const authRouter = new Hono();

authRouter.post("/login", async (c) => {
  let bodyJson: unknown;
  try {
    bodyJson = await c.req.json();
  } catch {
    throw new ApiError(400, "Cuerpo de solicitud JSON inválido");
  }

  const parsed = loginSchema.safeParse(bodyJson);
  if (!parsed.success) {
    throw new ApiError(400, "Datos de inicio de sesión inválidos", parsed.error.format());
  }

  const { email, password } = parsed.data;
  const db: Database = c.get("db") ?? getDb();

  const [usuarioDb] = await db
    .select()
    .from(schema.usuarios)
    .where(eq(schema.usuarios.email, email.toLowerCase().trim()))
    .limit(1);

  if (!usuarioDb) {
    throw new ApiError(401, "Credenciales incorrectas");
  }

  if (!usuarioDb.activo) {
    throw new ApiError(401, "Usuario inactivo: cuenta desactivada");
  }

  const passValida = await verifyPassword(password, usuarioDb.passwordHash);
  if (!passValida) {
    throw new ApiError(401, "Credenciales incorrectas");
  }

  await crearSesionUsuario(c, {
    id: usuarioDb.id,
    rolId: usuarioDb.rolId,
    departamentoId: usuarioDb.departamentoId,
  });

  return c.json(
    {
      usuario: {
        id: usuarioDb.id,
        nombre: usuarioDb.nombre,
        email: usuarioDb.email,
        rol_id: usuarioDb.rolId,
        departamento_id: usuarioDb.departamentoId,
        activo: Boolean(usuarioDb.activo),
        creado_en: usuarioDb.creadoEn,
      },
    },
    200,
  );
});

authRouter.post("/logout", (c) => {
  limpiarSesion(c);
  return c.json({ ok: true }, 200);
});

authRouter.get("/me", async (c) => {
  const usuario = await requireUser(c);
  return c.json({ usuario }, 200);
});

export default authRouter;
