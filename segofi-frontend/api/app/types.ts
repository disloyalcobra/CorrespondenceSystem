import type { Database } from "./db/client";
import type { UsuarioSchema } from "./schemas/auth";

export type AppEnv = {
  Variables: {
    db: Database;
    user?: UsuarioSchema;
  };
};

