import { auth } from "@/auth";
import { handleApiError, formatSuccess } from "@/lib/errors";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        // MVP: return empty CSV
        return formatSuccess({ csv: "email,subscribed_at\n" });
    } catch (error) {
        return handleApiError(error);
    }
}
