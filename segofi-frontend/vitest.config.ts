import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["api/__tests__/**/*.test.ts"],
    // Los tests NUNCA deben tocar la base de datos configurada (Turso) ni la local:
    // se aíslan con una base en memoria y sin credenciales de almacenamiento externo.
    env: {
      TURSO_DATABASE_URL: ":memory:",
      TURSO_AUTH_TOKEN: "",
      BLOB_READ_WRITE_TOKEN: "",
      JWT_SECRET: "jwt_secret_de_pruebas",
    },
  },
});
