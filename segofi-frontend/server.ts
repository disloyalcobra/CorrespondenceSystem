import { serve } from "@hono/node-server";
import { createApp } from "./api/index.js";

const app = createApp();
const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`\n🚀 Servidor API local de SegOfi escuchando en http://localhost:${info.port}/api\n`);
  }
);
