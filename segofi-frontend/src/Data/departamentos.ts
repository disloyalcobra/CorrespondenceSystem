export interface Departamento {
  id: number;
  nombre: string;
  tipo: string;
  clave: string;
}

export const DEPARTAMENTOS_DEMO: Departamento[] = [
  { id: 1, nombre: "Promoción Turística", tipo: "INTERNO", clave: "PT-01" },
  { id: 2, nombre: "Protocolos", tipo: "INTERNO", clave: "PRO-02" },
  { id: 3, nombre: "18 Ote", tipo: "EXTERNO", clave: "EXT-18" },
  { id: 4, nombre: "Desarrollo Turístico", tipo: "INTERNO", clave: "DT-04" },
  { id: 5, nombre: "Relaciones Públicas", tipo: "INTERNO", clave: "RP-05" },
];
