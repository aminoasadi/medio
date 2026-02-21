import { auth } from "@/auth";
import { handleApiError, formatSuccess, formatError } from "@/lib/errors";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const [updated] = await db.update(posts)
            .set({ published: true })
            .where(and(eq(posts.id, params.id), eq(posts.user_id, session.user.id)))
            .returning();

        if (!updated) return formatError("NOT_FOUND", "Post not found", 404);
        return formatSuccess(updated);
    } catch (error) {
        return handleApiError(error);
    }
}
