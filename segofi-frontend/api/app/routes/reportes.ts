import { Hono } from "hono";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "../lib/auth.js";
import { getDb } from "../db/client.js";
import type { Database } from "../db/client.js";
import * as schema from "../db/schema.js";
import { condicionAlcanceSQL } from "../lib/alcance.js";
import type { AppEnv } from "../types.js";

const reportesRouter = new Hono<AppEnv>();

// GET /api/reportes/resumen
reportesRouter.get("/resumen", async (c) => {
  const user = await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  // Estados terminales: 5 (Concluido), 6 (Cancelado), 7 (Enviado)
  const estadosTerminales = [5, 6, 7];

  // Fecha de hoy en formato YYYY-MM-DD
  const hoyStr = new Date().toISOString().slice(0, 10);

  // 1. Obtener oficios dentro del alcance del usuario
  const oficiosEnAlcance = await db
    .select({
      id: schema.oficios.id,
      estadoId: schema.oficios.estadoId,
      termino: schema.oficios.termino,
    })
    .from(schema.oficios)
    .where(condicionAlcanceSQL(user));

  // Contadores por estado (1..7)
  const porEstado: Record<number, number> = {
    1: 0, // Pendiente
    2: 0, // Turnado
    3: 0, // En proceso
    4: 0, // Respondido
    5: 0, // Concluido
    6: 0, // Cancelado
    7: 0, // Enviado
  };

  let vencidos = 0;

  for (const of of oficiosEnAlcance) {
    if (porEstado[of.estadoId] !== undefined) {
      porEstado[of.estadoId]++;
    }

    // Un oficio está vencido si tiene fecha de termino < hoy y NO está en estado terminal
    if (
      of.termino &&
      of.termino < hoyStr &&
      !estadosTerminales.includes(of.estadoId)
    ) {
      vencidos++;
    }
  }

  return c.json({
    total: oficiosEnAlcance.length,
    porEstado,
    vencidos,
  });
});

// GET /api/reportes/export?formato=csv
reportesRouter.get("/export", async (c) => {
  const user = await requireUser(c);
  const db: Database = c.get("db") ?? getDb();

  const oficiosEnAlcance = await db
    .select({
      folio: schema.oficios.folio,
      asunto: schema.oficios.asunto,
      destinatario: schema.oficios.destinatario,
      estado: schema.estados.nombre,
      tipoDocumento: schema.tiposDocumento.nombre,
      fechaDocumento: schema.oficios.fechaDocumento,
      fechaRecepcion: schema.oficios.fechaRecepcion,
      termino: schema.oficios.termino,
    })
    .from(schema.oficios)
    .leftJoin(schema.estados, eq(schema.oficios.estadoId, schema.estados.id))
    .leftJoin(schema.tiposDocumento, eq(schema.oficios.tipoDocumentoId, schema.tiposDocumento.id))
    .where(condicionAlcanceSQL(user))
    .orderBy(desc(schema.oficios.id));

  // Generar CSV
  const headers = [
    "Folio",
    "Asunto",
    "Destinatario",
    "Tipo Documento",
    "Estado",
    "Fecha Documento",
    "Fecha Recepcion",
    "Termino",
  ];

  const escapeCsv = (val: string | null | undefined) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = oficiosEnAlcance.map((o) =>
    [
      escapeCsv(o.folio),
      escapeCsv(o.asunto),
      escapeCsv(o.destinatario),
      escapeCsv(o.tipoDocumento),
      escapeCsv(o.estado),
      escapeCsv(o.fechaDocumento),
      escapeCsv(o.fechaRecepcion),
      escapeCsv(o.termino),
    ].join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\r\n");

  c.header("Content-Type", "text/csv; charset=utf-8");
  c.header("Content-Disposition", 'attachment; filename="reporte_oficios.csv"');
  return c.body(csvContent, 200);
});

export default reportesRouter;
