import { useSyncExternalStore } from "react";
import { OFICIOS_DEMO, type Oficio } from "./oficio";

export interface EventoBitacora {
  id: string | number;
  actor: string;
  accion: string;
  oficio: string;
  fecha: string;
}

let oficios = OFICIOS_DEMO;
let bitacora: EventoBitacora[] = OFICIOS_DEMO.flatMap((oficio) =>
  oficio.seguimiento.map((evento, index) => ({
    id: `${oficio.numero}-${index}`,
    actor: evento.autor,
    accion: evento.accion,
    oficio: oficio.numero,
    fecha: evento.fecha,
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

function registrar(oficioNumero: string, actor: string, accion: string, fecha: string) {
  bitacora = [{ id: Date.now(), actor, accion, oficio: oficioNumero, fecha }, ...bitacora];
}

function actualizarOficio(numero: string, actualizador: (oficio: Oficio) => Oficio) {
  const actual = oficios.find((oficio) => oficio.numero === numero);
  if (!actual) throw new Error("No se encontró el oficio seleccionado.");
  oficios = oficios.map((oficio) => (oficio.numero === numero ? actualizador(oficio) : oficio));
  notificar();
}

function ahora() {
  return new Date().toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
}

export function turnarOficio(numero: string, departamento: string, instrucciones: string, actor: string) {
  const fecha = ahora();
  actualizarOficio(numero, (oficio) => {
    if (oficio.estado === "Enviado") throw new Error("Un oficio enviado es de solo lectura.");
    return {
      ...oficio,
      departamento,
      estado: "Turnado",
      seguimiento: [...oficio.seguimiento, { autor: actor, accion: `Turnó a ${departamento}: ${instrucciones}`, fecha }],
    };
  });
  registrar(numero, actor, `Turnó el oficio a ${departamento}`, fecha);
  notificar();
}

export function agregarNota(numero: string, contenido: string, actor: string) {
  const fecha = ahora();
  actualizarOficio(numero, (oficio) => {
    if (oficio.estado === "Enviado") throw new Error("Un oficio enviado es de solo lectura.");
    return {
      ...oficio,
      estado: oficio.estado === "Turnado" ? "En seguimiento" : oficio.estado,
      seguimiento: [...oficio.seguimiento, { autor: actor, accion: `Agregó una nota: ${contenido}`, fecha }],
    };
  });
  registrar(numero, actor, `Agregó nota: ${contenido}`, fecha);
  notificar();
}

export function emitirRespuesta(numero: string, contenido: string, actor: string, archivo?: File | null) {
  const fecha = ahora();
  actualizarOficio(numero, (oficio) => {
    if (oficio.estado === "Enviado") throw new Error("Un oficio enviado es de solo lectura.");
      return {
        ...oficio,
        estado: "Respondido",
        adjuntos: archivo
          ? [...(oficio.adjuntos ?? []), { nombre: archivo.name, url: URL.createObjectURL(archivo), fecha }]
          : oficio.adjuntos,
        seguimiento: [...oficio.seguimiento, { autor: actor, accion: `Emitió respuesta: ${contenido}`, fecha }],
    };
  });
  registrar(numero, actor, "Emitió respuesta formal", fecha);
  notificar();
}

export function enviarOficio(numero: string, actor: string) {
  const oficio = oficios.find((item) => item.numero === numero);
  if (!oficio) throw new Error("No se encontró el oficio seleccionado.");
  if (oficio.estado === "Enviado") throw new Error("Este oficio ya fue enviado.");
  const year = new Date().getFullYear();
  const siguiente = oficios
    .map((item) => item.folioSalida?.match(new RegExp(`^SAL-${year}-(\\d+)$`)))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .reduce((max, match) => Math.max(max, Number(match[1])), 0) + 1;
  const folioSalida = `SAL-${year}-${String(siguiente).padStart(4, "0")}`;
  const fecha = ahora();
  actualizarOficio(numero, (actual) => ({
    ...actual,
    estado: "Enviado",
    folioSalida,
    fechaEnvio: fecha,
    seguimiento: [...actual.seguimiento, { autor: actor, accion: `Envió el oficio. Folio de salida ${folioSalida}`, fecha }],
  }));
  registrar(numero, actor, `Envió el oficio. Folio ${folioSalida}`, fecha);
  notificar();
  return folioSalida;
}
