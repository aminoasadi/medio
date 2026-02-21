import { auth } from "@/auth";
import { handleApiError, formatSuccess, formatError } from "@/lib/errors";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";

const newPostSchema = z.object({ title: z.string().min(1), slug: z.string().optional(), content: z.string().optional() });

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const userPosts = await db.select().from(posts)
            .where(eq(posts.user_id, session.user.id))
            .orderBy(desc(posts.created_at));

        return formatSuccess(userPosts);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const json = await req.json();
        const parsed = newPostSchema.parse(json);
        const slug = parsed.slug || parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const [newPost] = await db.insert(posts).values({
            user_id: session.user.id,
            title: parsed.title,
            slug,
            content: parsed.content || "",
            published: false,
        }).returning();

        return formatSuccess(newPost, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
