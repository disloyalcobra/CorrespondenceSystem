import { useSyncExternalStore } from "react";
import { OFICIOS_DEMO, type Oficio } from "./oficio";

export interface EventoBitacora {
  id: string | number;
  actor: string | number;
  accion: string;
  oficio: string;
  fecha: string;
}

let oficios = OFICIOS_DEMO;
let bitacora: EventoBitacora[] = OFICIOS_DEMO.flatMap((oficio) =>
  (oficio.seguimiento ?? []).map((evento, index) => ({
    id: `${oficio.folio}-${index}`,
    actor: evento.usuario_id,
    accion: evento.contenido,
    oficio: oficio.folio,
    fecha: evento.creado_en,
  })),
);
const listeners = new Set<() => void>();

function notificar() {
  listeners.forEach((listener) => listener());
}

export function suscribirOficios(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function obtenerOficios() {
  return oficios;
}

export function obtenerBitacora() {
  return bitacora;
}

export function useOficios() {
  return useSyncExternalStore(suscribirOficios, obtenerOficios, obtenerOficios);
}

export function useBitacora() {
  return useSyncExternalStore(suscribirOficios, obtenerBitacora, obtenerBitacora);
}

function registrar(oficioFolio: string, actor: string, accion: string, fecha: string) {
  bitacora = [{ id: Date.now(), actor, accion, oficio: oficioFolio, fecha }, ...bitacora];
}

function actualizarOficio(folio: string, actualizador: (oficio: Oficio) => Oficio) {
  const actual = oficios.find((oficio) => oficio.folio === folio);
  if (!actual) throw new Error("No se encontró el oficio seleccionado.");
  oficios = oficios.map((oficio) => (oficio.folio === folio ? actualizador(oficio) : oficio));
  notificar();
}

function ahora() {
  return new Date().toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
}

export function turnarOficio(folio: string, departamento_id: string, instrucciones: string, actor: string) {
  const fecha = ahora();
  actualizarOficio(folio, (oficio) => {
    if (oficio.estado_id === 6) throw new Error("Un oficio enviado es de solo lectura.");
    return {
      ...oficio,
      departamento_destino_inicial_id: Number(departamento_id),
      estado_id: 3, // Turnado
      seguimiento: [...(oficio.seguimiento ?? []), { id: Date.now(), oficio_id: oficio.id, usuario_id: 1, tipo: "Turno", contenido: `Turnó a depto ${departamento_id}: ${instrucciones}`, creado_en: fecha }],
    };
  });
  registrar(folio, actor, `Turnó el oficio a ${departamento_id}`, fecha);
  notificar();
}

export function agregarNota(folio: string, contenido: string, actor: string) {
  const fecha = ahora();
  actualizarOficio(folio, (oficio) => {
    if (oficio.estado_id === 6) throw new Error("Un oficio enviado es de solo lectura.");
    return {
      ...oficio,
      estado_id: oficio.estado_id === 3 ? 2 : oficio.estado_id, // 2 es En seguimiento
      seguimiento: [...(oficio.seguimiento ?? []), { id: Date.now(), oficio_id: oficio.id, usuario_id: 1, tipo: "Nota", contenido: `Agregó una nota: ${contenido}`, creado_en: fecha }],
    };
  });
  registrar(folio, actor, `Agregó nota: ${contenido}`, fecha);
  notificar();
}

export function emitirRespuesta(folio: string, contenido: string, actor: string, archivo?: File | null) {
  const fecha = ahora();
  actualizarOficio(folio, (oficio) => {
    if (oficio.estado_id === 6) throw new Error("Un oficio enviado es de solo lectura.");
      return {
        ...oficio,
        estado_id: 4, // Respondido
        adjuntos: archivo
          ? [...(oficio.adjuntos ?? []), { id: Date.now(), entidad_tipo: "oficio", entidad_id: oficio.id, nombre_archivo: archivo.name, archivo_url: URL.createObjectURL(archivo), tamano_bytes: archivo.size, creado_en: fecha }]
          : oficio.adjuntos,
        seguimiento: [...(oficio.seguimiento ?? []), { id: Date.now(), oficio_id: oficio.id, usuario_id: 1, tipo: "Respuesta", contenido: `Emitió respuesta: ${contenido}`, creado_en: fecha }],
    };
  });
  registrar(folio, actor, "Emitió respuesta formal", fecha);
  notificar();
}

export function enviarOficio(folio: string, actor: string) {
  const oficio = oficios.find((item) => item.folio === folio);
  if (!oficio) throw new Error("No se encontró el oficio seleccionado.");
  if (oficio.estado_id === 6) throw new Error("Este oficio ya fue enviado.");
  const year = new Date().getFullYear();
  const siguiente = oficios
    .map((item) => item.folio?.match(new RegExp(`^SAL-${year}-(\\d+)$`)))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .reduce((max, match) => Math.max(max, Number(match[1])), 0) + 1;
  const folioSalida = `SAL-${year}-${String(siguiente).padStart(4, "0")}`;
  const fecha = ahora();
  actualizarOficio(folio, (actual) => ({
    ...actual,
    estado_id: 6, // Enviado
    folio: folioSalida, // Reemplazamos el folio
    seguimiento: [...(actual.seguimiento ?? []), { id: Date.now(), oficio_id: actual.id, usuario_id: 1, tipo: "Envio", contenido: `Envió el oficio. Folio de salida ${folioSalida}`, creado_en: fecha }],
  }));
  registrar(folio, actor, `Envió el oficio. Folio ${folioSalida}`, fecha);
  notificar();
  return folioSalida;
}
