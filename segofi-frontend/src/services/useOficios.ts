import { useCallback, useEffect, useState } from "react";
import { oficiosService, type FiltrosOficioParams } from "./oficiosService";
import type { Oficio } from "../Data/oficio";

interface ResultadoOficios {
    oficios: Oficio[];
    total: number;
    cargando: boolean;
    error: string | null;
    recargar: () => void;
}

/**
 * Carga los oficios del usuario desde la API.
 * No hay respaldo con datos de demostración: si el servidor falla, se muestra el error.
 */
export function useOficios(filtros: FiltrosOficioParams = {}): ResultadoOficios {
    const [oficios, setOficios] = useState<Oficio[]>([]);
    const [total, setTotal] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Serializa los filtros para que el useEffect no se dispare en cada render
    const filtrosSerializados = JSON.stringify(filtros);

    const recargar = useCallback(() => {
        setCargando(true);
        oficiosService
            .listar(JSON.parse(filtrosSerializados) as FiltrosOficioParams)
            .then((res) => {
                setOficios(res.oficios);
                setTotal(res.total);
                setError(null);
            })
            .catch((err) => {
                setOficios([]);
                setTotal(0);
                setError(err instanceof Error ? err.message : "Error al cargar los oficios");
            })
            .finally(() => setCargando(false));
    }, [filtrosSerializados]);

    useEffect(() => {
        let montado = true;

        // La carga se dispara dentro del efecto y actualiza el estado al resolver,
        // para no provocar renders en cascada.
        oficiosService
            .listar(JSON.parse(filtrosSerializados) as FiltrosOficioParams)
            .then((res) => {
                if (!montado) return;
                setOficios(res.oficios);
                setTotal(res.total);
                setError(null);
            })
            .catch((err) => {
                if (!montado) return;
                setOficios([]);
                setTotal(0);
                setError(
                    err instanceof Error ? err.message : "Error al cargar los oficios"
                );
            })
            .finally(() => {
                if (montado) setCargando(false);
            });

        return () => {
            montado = false;
        };
    }, [filtrosSerializados]);

    return { oficios, total, cargando, error, recargar };
}
