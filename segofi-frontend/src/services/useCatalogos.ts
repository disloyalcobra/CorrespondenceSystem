import { useCallback, useEffect, useState } from "react";
import { apiClient } from "./apiClient";

export interface EstadoCatalogo {
    id: number;
    nombre: string;
    orden?: number;
}

export interface DepartamentoCatalogo {
    id: number;
    nombre: string;
    tipo: string;
    activo: boolean;
}

export interface Catalogos {
    estados: EstadoCatalogo[];
    tiposDocumento: EstadoCatalogo[];
    departamentos: DepartamentoCatalogo[];
    roles: EstadoCatalogo[];
}

const CATALOGOS_VACIOS: Catalogos = {
    estados: [],
    tiposDocumento: [],
    departamentos: [],
    roles: [],
};

/**
 * Catálogos del servidor (estados, tipos de documento, departamentos y roles).
 * Reemplaza a los datos de demostración para no mostrar catálogos desactualizados.
 */
export function useCatalogos() {
    const [catalogos, setCatalogos] = useState<Catalogos>(CATALOGOS_VACIOS);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const recargar = useCallback(() => {
        setCargando(true);
        apiClient
            .get<Catalogos>("/catalogos")
            .then((data) => {
                setCatalogos({
                    estados: data.estados ?? [],
                    tiposDocumento: data.tiposDocumento ?? [],
                    departamentos: data.departamentos ?? [],
                    roles: data.roles ?? [],
                });
                setError(null);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Error al cargar los catálogos");
            })
            .finally(() => setCargando(false));
    }, []);

    useEffect(() => {
        let montado = true;

        apiClient
            .get<Catalogos>("/catalogos")
            .then((data) => {
                if (!montado) return;
                setCatalogos({
                    estados: data.estados ?? [],
                    tiposDocumento: data.tiposDocumento ?? [],
                    departamentos: data.departamentos ?? [],
                    roles: data.roles ?? [],
                });
                setError(null);
            })
            .catch((err) => {
                if (!montado) return;
                setError(err instanceof Error ? err.message : "Error al cargar los catálogos");
            })
            .finally(() => {
                if (montado) setCargando(false);
            });

        return () => {
            montado = false;
        };
    }, []);

    return { catalogos, cargando, error, recargar };
}
