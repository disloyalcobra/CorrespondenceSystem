import type { Usuario } from "./authTypes";

export interface TestUser extends Usuario {
  correo: string;
  contrasena: string;
}


export const TEST_USERS: TestUser[] = [
  {
    correo: "usuario@puebla.gob.mx",
    contrasena: "puebla2026",
    nombre: "Lic. Carlos Eduardo Martínez López",
    cargo: "Encargado de Protocolos",
    dependencia: "Promoción Turística",
    rol: "Usuario",
  },
  {
    correo: "admin@puebla.gob.mx",
    contrasena: "puebla2026",
    nombre: "Ing. Jorge Luis Cano Pérez",
    cargo: "Administrador del sistema",
    dependencia: "Secretaría de Desarrollo Turístico",
    rol: "Administrador",
  },
  {
    correo: "directora@puebla.gob.mx",
    contrasena: "puebla2026",
    nombre: "Mtra. Fernanda Ibarra Solís",
    cargo: "Directora de Promoción Turística",
    dependencia: "Secretaría de Desarrollo Turístico",
    rol: "Directora",
  },
  {
    correo: "jefedepto@puebla.gob.mx",
    contrasena: "puebla2026",
    nombre: "Lic. Ana Patricia Rojas Vega",
    cargo: "Jefa de Departamento",
    dependencia: "Protocolos",
    rol: "JefeDepartamento",
  },
];
