import { auth } from "@/auth";
import { handleApiError, formatSuccess } from "@/lib/errors";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        return formatSuccess([]); // Placeholder for MVP
    } catch (error) {
        return handleApiError(error);
    }
}
