import type { Oficio } from "../Data/oficio";
import type { Usuario } from "./authTypes";

const ROLES_ADMIN = [2, 3]; // Admin, Directora

export function tieneAccesoTotal(usuario: Usuario | null): boolean {
  if (!usuario) return false;
  return ROLES_ADMIN.includes(usuario.rol_id);
}

export function puedeVerOficio(usuario: Usuario | null, oficio: Oficio): boolean {
  if (!usuario) return false;
  if (tieneAccesoTotal(usuario)) return true;

  // Pertenece a su departamento
  if (oficio.departamento_destino_inicial_id === usuario.departamento_id) return true;

  // O interactuó con él
  if (oficio.seguimiento?.some(s => s.usuario_id === usuario.id)) return true;

  return false;
}

export function oficiosVisibles(usuario: Usuario | null, oficios: Oficio[]): Oficio[] {
  if (!usuario) return [];
  if (tieneAccesoTotal(usuario)) return oficios;
  return oficios.filter((o) => puedeVerOficio(usuario, o));
}

export function notificacionesVisibles(usuario: Usuario | null, notificaciones: any[]) {
  if (!usuario) return [];
  if (tieneAccesoTotal(usuario)) return notificaciones;
  // TODO: filtrar por departamento cuando la notificación esté conectada a la BD real
  return notificaciones; 
}
