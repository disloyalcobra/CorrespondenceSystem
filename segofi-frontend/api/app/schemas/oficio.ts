import { z } from "zod";

export const filtroOficiosSchema = z.object({
  folio: z.string().optional(),
  asunto: z.string().optional(),
  estado_id: z.coerce.number().optional(),
  tipo_documento_id: z.coerce.number().optional(),
  fecha_desde: z.string().optional(),
  fecha_hasta: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type FiltroOficios = z.infer<typeof filtroOficiosSchema>;

export interface OficioResumen {
  id: number;
  folio: string;
  tipoDocumentoId: number;
  objeto: string;
  asunto: string;
  destinatario: string;
  fechaDocumento: string;
  fechaRecepcion: string;
  termino: string | null;
  remitenteUsuarioId: number;
  origenUsuarioId: number;
  departamentoDestinoInicialId: number;
  estadoId: number;
  creadoEn: string;
}

export interface Paginado<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

