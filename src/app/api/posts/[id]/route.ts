import { auth } from "@/auth";
import { handleApiError, formatSuccess, formatError } from "@/lib/errors";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const json = await req.json();
        const updateSchema = z.object({ title: z.string(), slug: z.string(), content: z.string() });
        const parsed = updateSchema.parse(json);

        const [updated] = await db.update(posts)
            .set(parsed)
            .where(and(eq(posts.id, params.id), eq(posts.user_id, session.user.id)))
            .returning();

        if (!updated) return formatError("NOT_FOUND", "Post not found", 404);
        return formatSuccess(updated);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const [deleted] = await db.delete(posts)
            .where(and(eq(posts.id, params.id), eq(posts.user_id, session.user.id)))
            .returning();

        if (!deleted) return formatError("NOT_FOUND", "Post not found", 404);
        return formatSuccess({ success: true, id: deleted.id });
    } catch (error) {
        return handleApiError(error);
    }
}
