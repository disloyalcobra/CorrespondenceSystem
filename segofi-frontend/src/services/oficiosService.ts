import { apiClient } from "./apiClient";
import type { Oficio, EventoSeguimiento, AdjuntoOficio } from "../Data/oficio";

// 1. Interfaces que describen exactamente la forma en que el backend devuelve los datos (DTOs)
export interface BackendOficioDTO {
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
    // Relaciones que pueden venir en el detalle
    turnos?: Array<{
        id: number;
        departamentoId: number;
        instruccion?: string;
        creadoEn: string;
    }>;
    seguimientos?: Array<{
        id: number;
        usuarioId: number;
        tipo: string;
        contenido: string;
        creadoEn: string;
        usuarioNombre?: string;
    }>;
    /** Línea de tiempo que devuelve el detalle: turnos + seguimientos unificados */
    lineaTiempo?: Array<{
        id: number;
        tipo: string;
        contenido?: string;
        departamentoId?: number;
        usuarioId: number;
        usuarioNombre?: string;
        fecha: string;
    }>;
    adjuntos?: Array<{
        id: number;
        entidadTipo: string;
        entidadId: number;
        nombreArchivo: string;
        archivoUrl: string;
        creadoEn: string;
    }>;
    /** Folio de salida (SAL) generado al enviar el oficio */
    salida?: {
        id: number;
        folio: string;
        oficioId: number;
        enviadoEn: string;
    } | null;
}

export interface PaginadoRespuesta<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// 2. Parámetros de búsqueda para filtrar la bandeja de oficios en el servidor
export interface FiltrosOficioParams {
    folio?: string;
    asunto?: string;
    estado_id?: number;
    tipo_documento_id?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
    page?: number;
    pageSize?: number;
}

// 3. Payload para crear/radicar un oficio nuevo
export interface RadicarOficioPayload {
    tipo_documento_id: number;
    objeto: string;
    asunto: string;
    destinatario: string;
    fecha_documento: string;
    termino?: string | null;
    departamento_destino_inicial_id: number;
    adjuntos?: Array<{
        nombre_archivo: string;
        archivo_url: string;
    }>;
}

// 4. Adaptador (Mapper): Convierte el DTO camelCase del backend al tipo Oficio snake_case que usa el UI
interface EventoBackend {
    id: number;
    tipo: string;
    contenido?: string;
    departamentoId?: number;
    usuarioId: number;
    usuarioNombre?: string;
    fecha: string;
}

export function mapDtoToOficio(dto: BackendOficioDTO): Oficio {
    // La línea de tiempo del detalle (turnos + seguimientos) es la fuente de los eventos;
    // el listado no los trae.
    const eventos: EventoBackend[] = [
        ...(dto.lineaTiempo ?? []),
        ...(dto.seguimientos ?? []).map((s) => ({
            id: s.id,
            tipo: s.tipo,
            contenido: s.contenido,
            usuarioId: s.usuarioId,
            usuarioNombre: s.usuarioNombre,
            fecha: s.creadoEn,
        })),
    ];

    return {
        id: dto.id,
        folio: dto.folio,
        tipo_documento_id: dto.tipoDocumentoId,
        objeto: dto.objeto,
        asunto: dto.asunto,
        destinatario: dto.destinatario,
        fecha_documento: dto.fechaDocumento,
        fecha_recepcion: dto.fechaRecepcion,
        termino: dto.termino ?? undefined,
        remitente_usuario_id: dto.remitenteUsuarioId,
        origen_usuario_id: dto.origenUsuarioId,
        departamento_destino_inicial_id: dto.departamentoDestinoInicialId,
        estado_id: dto.estadoId,
        creado_en: dto.creadoEn,
        seguimiento: eventos.map((s): EventoSeguimiento => ({
            id: s.id,
            oficio_id: dto.id,
            usuario_id: s.usuarioId,
            usuario_nombre: s.usuarioNombre,
            tipo: s.tipo,
            contenido:
                s.contenido ??
                (s.departamentoId
                    ? `Turno al departamento ${s.departamentoId}`
                    : "Turno"),
            creado_en: s.fecha,
        })),
        adjuntos: dto.adjuntos?.map((a): AdjuntoOficio => ({
            id: a.id,
            entidad_tipo: a.entidadTipo,
            entidad_id: a.entidadId,
            nombre_archivo: a.nombreArchivo,
            archivo_url: a.archivoUrl,
            creado_en: a.creadoEn,
        })) ?? [],
    };
}

// 5. Acciones por persona sobre los oficios (resumen del servidor)
export interface AccionPersona {
    oficioId: number;
    folio: string;
    asunto: string;
    tipo: string;
    contenido: string;
    fecha: string;
    usuarioId: number;
    usuarioNombre: string;
}

export interface PersonaSeguimiento {
    usuarioId: number;
    usuarioNombre: string;
    acciones: AccionPersona[];
}

// 6. El Servicio Principal de Oficios
export const oficiosService = {
    // A. Listar oficios con filtros y paginación desde el servidor
    async listar(filtros: FiltrosOficioParams = {}): Promise<{ oficios: Oficio[]; total: number }> {
        const res = await apiClient.get<PaginadoRespuesta<BackendOficioDTO>>("/oficios", {
            params: filtros as Record<string, string | number | boolean | undefined>,
        });
        return {
            oficios: res.data.map(mapDtoToOficio),
            total: res.total,
        };
    },

    // B. Obtener detalle de un oficio por ID
    async obtenerPorId(id: number): Promise<Oficio> {
        const res = await apiClient.get<{ oficio: BackendOficioDTO }>(`/oficios/${id}`);
        return mapDtoToOficio(res.oficio);
    },

    // C. Radicar (crear) un oficio nuevo
    async radicar(payload: RadicarOficioPayload): Promise<Oficio> {
        const res = await apiClient.post<{ oficio: BackendOficioDTO }>("/oficios", payload);
        return mapDtoToOficio(res.oficio);
    },

    // D. Turnar oficio a un departamento
    async turnar(oficioId: number, departamentoId: number, instruccion?: string): Promise<void> {
        await apiClient.post(`/oficios/${oficioId}/turnos`, {
            departamento_id: departamentoId,
            instruccion,
        });
    },

    // E. Agregar seguimiento (NOTA, AVANCE o RESPUESTA)
    async agregarSeguimiento(
        oficioId: number,
        tipo: "NOTA" | "AVANCE" | "RESPUESTA",
        contenido: string,
        decidirConclusion?: boolean
    ): Promise<void> {
        await apiClient.post(`/oficios/${oficioId}/seguimientos`, {
            tipo,
            contenido,
            decidirConclusion,
        });
    },

    // F. Registrar lectura de un oficio
    async marcarLeido(oficioId: number): Promise<void> {
        await apiClient.post(`/oficios/${oficioId}/lecturas`);
    },

    // G. Registrar salida y generar folio SAL
    async registrarSalida(oficioId: number): Promise<{ folio: string }> {
        return apiClient.post<{ folio: string }>(`/oficios/${oficioId}/salida`);
    },

    // H. Subir archivo adjunto a un oficio
    async subirAdjunto(oficioId: number, archivo: File): Promise<AdjuntoOficio> {
        const formData = new FormData();
        formData.append("archivo", archivo);
        const res = await apiClient.post<{ adjunto: AdjuntoOficio }>(
            `/oficios/${oficioId}/adjuntos`,
            formData
        );
        return res.adjunto;
    },

    // I. Acciones registradas por persona sobre los oficios del alcance
    async seguimientoPorPersonas(): Promise<PersonaSeguimiento[]> {
        const res = await apiClient.get<{ personas: PersonaSeguimiento[] }>(
            "/seguimientos/personas"
        );
        return res.personas;
    },
};