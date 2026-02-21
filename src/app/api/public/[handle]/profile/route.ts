import { handleApiError, formatSuccess, formatError } from "@/lib/errors";
import { db } from "@/lib/db";
import { users, links, social_feeds } from "@/lib/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { BuilderSnapshotDTO } from "@/types/dto";

export async function GET(req: Request, { params }: { params: { handle: string } }) {
    try {
        const { handle } = params;

        const userRecord = await db.query.users.findFirst({ where: eq(users.username, handle) });
        if (!userRecord) return formatError("NOT_FOUND", "Profile not found", 404);

        const userId = userRecord.id;
        const userLinks = await db.select().from(links).where(and(eq(links.user_id, userId), eq(links.active, true))).orderBy(asc(links.order_index));
        const userSocials = await db.select().from(social_feeds).where(and(eq(social_feeds.user_id, userId), eq(social_feeds.active, true)));

        const themeConfig = userRecord?.theme_config as any || {};

        const data: BuilderSnapshotDTO = {
            profile: {
                name: userRecord?.name || handle,
                bio: userRecord?.bio || "",
                avatarUrl: userRecord?.image || "",
            },
            theme: {
                preset: themeConfig.preset || "light",
                primaryColor: themeConfig.primaryColor || "#000000",
                backgroundStyle: themeConfig.backgroundStyle || "solid",
                buttonRadius: themeConfig.buttonRadius || "md",
                fontPreset: themeConfig.fontPreset || "inter",
            },
            newsletter: {
                enabled: userRecord?.newsletter_enabled ?? false,
                title: userRecord?.newsletter_title || "Subscribe to my updates",
                description: userRecord?.newsletter_description || "Get the latest news directly to your inbox.",
            },
            links: userLinks.map(l => ({
                id: l.id,
                title: l.title,
                url: l.url,
                orderIndex: l.order_index,
                isActive: l.active ?? true,
            })),
            socials: userSocials.map(s => ({
                id: s.id,
                network: s.network || "",
                url: s.url,
                isEnabled: s.active ?? true,
            }))
        };

        return formatSuccess(data);
    } catch (error) {
        return handleApiError(error);
    }
}
