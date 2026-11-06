import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Context, MiddlewareHandler } from "hono";
import { eq } from "drizzle-orm";
import { getEnv } from "../env";
import { ApiError } from "./http";
import type { Database } from "../db/client";
import { getDb } from "../db/client";
import * as schema from "../db/schema";
import type { UsuarioSchema } from "../schemas/auth";

export const NOMBRE_COOKIE_SESION = "sesion";

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(getEnv().JWT_SECRET);
}

export interface JwtPayloadSession {
  sub: string;
  rol_id: number;
  departamento_id: number | null;
}

export async function crearSesionUsuario(
  c: Context,
  usuario: { id: number; rolId: number; departamentoId: number | null },
): Promise<string> {
  const token = await new SignJWT({
    sub: String(usuario.id),
    rol_id: usuario.rolId,
    departamento_id: usuario.departamentoId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  setCookie(c, NOMBRE_COOKIE_SESION, token, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return token;
}

export function limpiarSesion(c: Context) {
  deleteCookie(c, NOMBRE_COOKIE_SESION, {
    path: "/",
  });
}

export async function requireUser(c: Context): Promise<UsuarioSchema> {
  // Si ya fue resuelto en este ciclo de request, retornarlo
  const cached = c.get("user") as UsuarioSchema | undefined;
  if (cached) return cached;

  const token = getCookie(c, NOMBRE_COOKIE_SESION);
  if (!token) {
    throw new ApiError(401, "No autenticado: sesión requerida");
  }

  let payload: JwtPayloadSession;
  try {
    const verified = await jwtVerify(token, getJwtSecret());
    payload = verified.payload as unknown as JwtPayloadSession;
  } catch {
    limpiarSesion(c);
    throw new ApiError(401, "Sesión inválida o expirada");
  }

  const userId = Number(payload.sub);
  if (!userId) {
    throw new ApiError(401, "Token de sesión inválido");
  }

  // Recarga el usuario desde la base de datos para revalidar que siga activo
  const db: Database = c.get("db") ?? getDb();
  const [userDb] = await db
    .select()
    .from(schema.usuarios)
    .where(eq(schema.usuarios.id, userId))
    .limit(1);

  if (!userDb) {
    limpiarSesion(c);
    throw new ApiError(401, "El usuario ya no existe");
  }

  if (!userDb.activo) {
    limpiarSesion(c);
    throw new ApiError(401, "Usuario inactivo: cuenta desactivada");
  }

  const usuario: UsuarioSchema = {
    id: userDb.id,
    nombre: userDb.nombre,
    email: userDb.email,
    rol_id: userDb.rolId,
    departamento_id: userDb.departamentoId,
    activo: Boolean(userDb.activo),
    creado_en: userDb.creadoEn,
  };

  c.set("user", usuario);
  return usuario;
}

export function requireUserMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    await requireUser(c);
    await next();
  };
}

export function requireRol(...rolesPermitidos: number[]): MiddlewareHandler {
  return async (c, next) => {
    const user = await requireUser(c);
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(user.rol_id)) {
      throw new ApiError(403, "No autorizado para este recurso");
    }
    await next();
  };
}

