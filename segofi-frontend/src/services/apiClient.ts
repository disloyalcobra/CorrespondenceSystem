// 1. Definimos una clase personalizada de Error.
export class ApiError extends Error {
    status: number;
    data?: unknown;

    constructor(status: number, message: string, data?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}
// 2. Opciones adicionales que puede recibir nuestra petición
interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}

//3. Funcion central que procesa todas las llamadas http de la aplicacion
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    //Aseguramos que la ruta empieze con api
    let url = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`;

    //Si no pasaron parámetros en un objeto, los convertimos a formato '?clave=valor&otra=123'
    if (options.params) {
        const searchParams = new URLSearchParams();
        for (const [key, val] of Object.entries(options.params)) {
            if (val !== undefined && val !== null) {
                searchParams.append(key, String(val));
            }
        }
        const queryString = searchParams.toString();
        if (queryString) {
            url += (url.includes("?") ? "&" : "?") + queryString;
        }
    }
    //Preparamos los encabezados HTTP
    const headers = new Headers(options.headers || {});

    // Si no es formData (subida de archivos) le indicamos al servidor que enviamos JSON
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    //Armamos la configuración final para fetch
    const config: RequestInit = {
        ...options,
        headers,
        // ¡CRÍTICO!: 'include' le dice al navegador que incluya las cookies de sesión
        // incluso si la petición se considera cross-origin en algunos entornos.    credentials: "include"
        credentials: "include",
    };

    //Ejecutamos la llamada de red
    const response = await fetch(url, config);

    //Si la respuesta no está en el rango 200-299 arrojamos un ApiError
    if (!response.ok) {
        let mensaje = 'Error HTTP ${response.status}';
        let dataError: unknown = undefined;
        try {
            // Intentamos leer el mensaje JSON que programamos en el backend
            const errorJson = await response.json();
            mensaje = errorJson.error || errorJson.message || mensaje;
            dataError = errorJson;
        } catch {
            // si la respuesta de error no era JSON dejamos el mensaje por defecto

        }
        throw new ApiError(response.status, mensaje, dataError);
    }

    //si el servidor responde con un archivo 
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/csv") || contentType.includes("application/octet-stream")) {
        return (await response.blob()) as unknown as T;
    }
    //Por defecto parseamos y devolvemos el cuerpo como objeto tipado con typescript
    return response.json();
}

// Exportamos un objeto con metodos semánticos
export const apiClient = {
    get: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: "GET" }),

    post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, {
            ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, {
            ...options,
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),
    patch: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, {
            ...options,
            method: "PATCH",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),
    delete: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: "DELETE" }),
};