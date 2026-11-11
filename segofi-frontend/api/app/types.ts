import type { Database } from "./db/client.js";
import type { UsuarioSchema } from "./schemas/auth.js";

export type AppEnv = {
  Variables: {
    db: Database;
    user?: UsuarioSchema;
  };
};

