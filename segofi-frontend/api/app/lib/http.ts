import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiError extends Error {
  statusCode: ContentfulStatusCode;
  detalles?: unknown;

  constructor(statusCode: ContentfulStatusCode, message: string, detalles?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.detalles = detalles;
  }
}

export function errorMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof ApiError) {
        return c.json(
          {
            error: err.message,
            ...(err.detalles ? { detalles: err.detalles } : {}),
          },
          err.statusCode,
        );
      }

      if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status);
      }

      console.error("Error no controlado en la API:", err);
      return c.json({ error: "Error interno del servidor" }, 500);
    }
  };
}

