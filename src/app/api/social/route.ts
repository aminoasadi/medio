import { auth } from "@/auth";
import { handleApiError, formatSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { social_feeds } from "@/lib/db/schema";
import { SocialItemsSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const json = await req.json();
        const { items } = SocialItemsSchema.parse(json);

        const userId = session.user.id;
        await db.transaction(async (tx) => {
            // For MVP, just update or insert. Since it's a fixed list, maybe delete all and insert
            await tx.delete(social_feeds).where(eq(social_feeds.user_id, userId));
            if (items.length > 0) {
                const insertData = items.map(item => ({
                    user_id: userId,
                    platform: item.network,
                    url: item.url,
                    active: item.isEnabled
                }));
                await tx.insert(social_feeds).values(insertData);
            }
        });

        return formatSuccess({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
