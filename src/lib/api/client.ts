import { UnifiedResponse } from "@/types/dto";

class ApiError extends Error {
    public code: string;
    public fieldErrors?: Record<string, string[]>;
    constructor(code: string, message: string, fieldErrors?: Record<string, string[]>) {
        super(message);
        this.code = code;
        this.fieldErrors = fieldErrors;
    }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(endpoint, {
        ...options,
        headers: { "Content-Type": "application/json", ...options.headers },
    });

    const json: UnifiedResponse<T> = await res.json().catch(() => ({}));
    if (!res.ok || json.error) {
        throw new ApiError(
            json.error?.code || "UNKNOWN_ERROR",
            json.error?.message || res.statusText,
            json.error?.fieldErrors
        );
    }
    return json.data as T;
}

export const apiGet = <T>(url: string) => request<T>(url, { method: "GET" });
export const apiPost = <T>(url: string, body?: unknown) => request<T>(url, { method: "POST", body: JSON.stringify(body) });
export const apiPut = <T>(url: string, body?: unknown) => request<T>(url, { method: "PUT", body: JSON.stringify(body) });
export const apiDelete = <T>(url: string) => request<T>(url, { method: "DELETE" });
