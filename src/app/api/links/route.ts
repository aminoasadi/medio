import { auth } from "@/auth";
import { handleApiError, formatSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { CreateLinkSchema } from "@/lib/validators";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const json = await req.json();
        const parsed = CreateLinkSchema.parse(json);

        const newLink = await db.insert(links).values({
            user_id: session.user.id,
            title: parsed.title,
            url: parsed.url,
            active: parsed.isActive,
            order_index: 999, // default to end
        }).returning();

        return formatSuccess(newLink[0], 201);
    } catch (error) {
        return handleApiError(error);
    }
}
