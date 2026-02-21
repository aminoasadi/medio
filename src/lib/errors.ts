import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UnifiedResponse } from "@/types/dto";

export function formatError(code: string, message: string, status = 400, fieldErrors?: Record<string, string[]>) {
    const body: UnifiedResponse = { error: { code, message, fieldErrors } };
    return NextResponse.json(body, { status });
}

export function formatSuccess<T>(data: T, status = 200) {
    const body: UnifiedResponse<T> = { data };
    return NextResponse.json(body, { status });
}

export function handleApiError(error: unknown) {
    if (error instanceof ZodError) {
        return formatError("VALIDATION_ERROR", "Invalid input parameters", 400, error.flatten().fieldErrors);
    }
    if (error instanceof Error && error.message.includes("401")) {
        return formatError("UNAUTHORIZED", "Missing or invalid session", 401);
    }
    console.error("[API Error]", error);
    return formatError("INTERNAL_ERROR", "An unexpected error occurred", 500);
}
