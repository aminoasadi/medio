import { handleApiError, formatSuccess, formatError } from "@/lib/errors";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { handle: string } }) {
    try {
        const { handle } = params;

        const userRecord = await db.query.users.findFirst({ where: eq(users.username, handle) });
        if (!userRecord) return formatError("NOT_FOUND", "Profile not found", 404);

        const userPosts = await db.select()
            .from(posts)
            .where(and(eq(posts.user_id, userRecord.id), eq(posts.published, true)))
            .orderBy(desc(posts.created_at));

        return formatSuccess(userPosts.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            publishedAt: p.created_at,
        })));
    } catch (error) {
        return handleApiError(error);
    }
}
