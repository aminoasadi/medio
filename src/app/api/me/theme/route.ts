import { auth } from "@/auth";
import { handleApiError, formatSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ThemeSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const json = await req.json();
        const parsed = ThemeSchema.parse(json);

        await db.update(users)
            .set({
                theme_config: parsed,
            })
            .where(eq(users.id, session.user.id));

        return formatSuccess({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
