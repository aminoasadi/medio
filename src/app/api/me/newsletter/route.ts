import { auth } from "@/auth";
import { handleApiError, formatSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { NewsletterSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("401");

        const json = await req.json();
        const parsed = NewsletterSchema.parse(json);

        const userRecord = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
        const themeConfig = (userRecord?.theme_config as Record<string, unknown>) || {};

        await db.update(users)
            .set({
                theme_config: { ...themeConfig, newsletter_enabled: parsed.enabled, newsletter_title: parsed.title, newsletter_description: parsed.description }
            })
            .where(eq(users.id, session.user.id));

        return formatSuccess({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
