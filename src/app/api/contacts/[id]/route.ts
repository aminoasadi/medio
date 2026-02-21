import { auth } from "@/auth";
import { handleApiError, formatSuccess } from "@/lib/errors";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        return formatSuccess({ success: true, id: params.id }); // Placeholder for MVP
    } catch (error) {
        return handleApiError(error);
    }
}
