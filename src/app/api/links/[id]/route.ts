import { auth } from "@/auth";
import { handleApiError, formatSuccess, formatError } from "@/lib/errors";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const json = await req.json();

        const [updated] = await db.update(links)
            .set({
                title: json.title,
                url: json.url,
                active: json.isActive,
            })
            .where(and(eq(links.id, params.id), eq(links.user_id, session.user.id)))
            .returning();

        if (!updated) return formatError("NOT_FOUND", "Link not found", 404);

        return formatSuccess(updated);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const [deleted] = await db.delete(links)
            .where(and(eq(links.id, params.id), eq(links.user_id, session.user.id)))
            .returning();

        if (!deleted) return formatError("NOT_FOUND", "Link not found", 404);

        return formatSuccess({ success: true, id: deleted.id });
    } catch (error) {
        return handleApiError(error);
    }
}
