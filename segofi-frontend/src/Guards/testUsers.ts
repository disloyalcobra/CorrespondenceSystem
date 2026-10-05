import type { Usuario } from "./authTypes";

export type TestUser = Omit<Usuario, "id" | "password_hash"> & { passwordRaw: string };

export const testUsers: TestUser[] = [
  {
    email: "admin@sectur.gob.mx",
    passwordRaw: "admin123",
    nombre: "Ana Martínez",
    rol_id: 2,
    departamento_id: 1, // Despacho
    activo: true,
  },
  {
    email: "directora@sectur.gob.mx",
    passwordRaw: "dir123",
    nombre: "Laura Gómez",
    rol_id: 3,
    departamento_id: 1, // Despacho
    activo: true,
  },
  {
    email: "jefe.ti@sectur.gob.mx",
    passwordRaw: "jefe123",
    nombre: "Carlos Ruiz",
    rol_id: 4,
    departamento_id: 3, // TI
    activo: true,
  },
  {
    email: "usuario.ti@sectur.gob.mx",
    passwordRaw: "user123",
    nombre: "Luis Fernández",
    rol_id: 1,
    departamento_id: 3, // TI
    activo: true,
  },
];
