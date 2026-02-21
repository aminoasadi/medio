import { auth } from "@/auth";
import { handleApiError, formatSuccess, formatError } from "@/lib/errors";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { ReorderSchema } from "@/lib/validators";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const json = await req.json();
        const { orderedIds } = ReorderSchema.parse(json);

        // Naive atomic-ish update in a loop or transaction
        // Drizzle transactions:
        await db.transaction(async (tx) => {
            for (let i = 0; i < orderedIds.length; i++) {
                const id = orderedIds[i];
                await tx.update(links)
                    .set({ order_index: i })
                    .where(and(eq(links.id, id), eq(links.user_id, session.user.id)));
            }
        });

        return formatSuccess({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
