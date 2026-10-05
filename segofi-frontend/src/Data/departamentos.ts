export interface Departamento {
  id: number;
  nombre: string;
  tipo: string;
}

export const DEPARTAMENTOS_DEMO: Departamento[] = [
  { id: 1, nombre: "Promoción Turística", tipo: "INTERNO" },
  { id: 2, nombre: "Protocolos", tipo: "INTERNO" },
  { id: 3, nombre: "18 Ote", tipo: "EXTERNO" },
  { id: 4, nombre: "Desarrollo Turístico", tipo: "INTERNO" },
  { id: 5, nombre: "Relaciones Públicas", tipo: "INTERNO" },
];
