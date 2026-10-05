export interface Persona {
  id: number;
  nombre: string;
  correo: string;
  cargo?: string;
  rol_id?: number;
  departamento_id?: number;
}

export const PERSONAS_DEMO: Persona[] = [
  { id: 1, nombre: "Lic. Carlos Eduardo Martínez López", correo: "usuario@puebla.gob.mx", cargo: "Encargado de Protocolos", rol_id: 1, departamento_id: 2 },
  { id: 2, nombre: "Ing. Jorge Luis Cano Pérez", correo: "admin@puebla.gob.mx", cargo: "Administrador del sistema", rol_id: 2, departamento_id: 1 },
  { id: 3, nombre: "Mtra. Fernanda Ibarra Solís", correo: "directora@puebla.gob.mx", cargo: "Directora de Promoción Turística", rol_id: 3, departamento_id: 1 },
  { id: 4, nombre: "Lic. Ana Patricia Rojas Vega", correo: "jefedepto@puebla.gob.mx", cargo: "Jefa de Departamento", rol_id: 4, departamento_id: 2 },
  { id: 5, nombre: "Lic. Roberto Sánchez Gómez", correo: "roberto.sanchez@puebla.gob.mx", cargo: "Analista de Datos", rol_id: 1, departamento_id: 1 },
  { id: 6, nombre: "Mtro. Sergio Mendoza Ruiz", correo: "sergio.mendoza@puebla.gob.mx", cargo: "Coordinador de Eventos", rol_id: 1, departamento_id: 2 },
  { id: 7, nombre: "Lic. Gabriela Torres Luna", correo: "gabriela.torres@puebla.gob.mx", cargo: "Asistente Administrativa", rol_id: 1, departamento_id: 4 },
  { id: 8, nombre: "Ing. Mario Alberto Solís", correo: "mario.solis@puebla.gob.mx", cargo: "Especialista en TI", rol_id: 1, departamento_id: 1 },
  { id: 9, nombre: "Lic. Claudia Jimenez Vera", correo: "claudia.jimenez@puebla.gob.mx", cargo: "Enlace Gubernamental", rol_id: 1, departamento_id: 4 },
  { id: 10, nombre: "Mtra. Yolanda Castro Ruiz", correo: "yolanda.castro@puebla.gob.mx", cargo: "Supervisora de Calidad", rol_id: 1, departamento_id: 2 },
];
