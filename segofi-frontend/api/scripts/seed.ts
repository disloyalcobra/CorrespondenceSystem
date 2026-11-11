import { getDb } from "../app/db/client";
import { seed } from "../app/db/seed";

async function main() {
  console.log("Sembrando catálogos y usuario administrador en la base de datos...");
  const db = getDb();
  await seed(db);
  console.log("¡Catálogos y administrador sembrados exitosamente!");
}

main().catch((err) => {
  console.error("Error al sembrar datos:", err);
  process.exit(1);
});
