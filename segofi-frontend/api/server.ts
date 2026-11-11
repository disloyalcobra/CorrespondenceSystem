import { serve } from "@hono/node-server";
import { createApp } from "./index";

const app = createApp();
const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`\n🚀 Servidor API de SegOfi escuchando en http://localhost:${info.port}/api\n`);
  }
);
