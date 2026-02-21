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

        const themeConfig = userRecord?.theme_config as Record<string, unknown> || {};

        const data: BuilderSnapshotDTO = {
            profile: {
                name: userRecord?.name || handle,
                bio: userRecord?.bio || "",
                avatarUrl: userRecord?.image || "",
            },
            theme: {
                preset: (themeConfig.preset as string) || "light",
                primaryColor: (themeConfig.primaryColor as string) || "#000000",
                backgroundStyle: (themeConfig.backgroundStyle as string) || "solid",
                buttonRadius: (themeConfig.buttonRadius as "sm" | "md" | "lg" | "full" | "none") || "md",
                fontPreset: (themeConfig.fontPreset as string) || "inter",
            },
            newsletter: {
                enabled: (themeConfig.newsletter_enabled as boolean) ?? false,
                title: (themeConfig.newsletter_title as string) || "Subscribe to my updates",
                description: (themeConfig.newsletter_description as string) || "Get the latest news directly to your inbox.",
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
                network: s.platform || "",
                url: s.url,
                isEnabled: s.active ?? true,
            }))
        };

        return formatSuccess(data);
    } catch (error) {
        return handleApiError(error);
    }
}
