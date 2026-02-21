import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request, { params }: { params: { handle: string } }) {
    try {
        const { handle } = params;
        const supabase = createSupabaseAdmin();

        // Ensure unique handle lookup matches user_id logic if possible.
        // Wait, handle might conceptually map to users table. We created 'handle' text unique in profiles!
        // We need to resolve user_id by 'handle' on profiles table.
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("handle", handle)
            .single();

        // If no matching handle, try to match by username from old users table (fallback)
        // For simplicity, assuming profile maps directly if migrated well.
        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

        const userId = profile.id;

        const { data: items } = await supabase
            .from("page_items")
            .select("*")
            .eq("user_id", userId)
            .eq("enabled", true)
            .order("order", { ascending: true });

        // Filter scheduled items dynamically
        const now = new Date();
        const activeItems = (items || []).filter(item => {
            if (item.schedule_start && new Date(item.schedule_start) > now) return false;
            if (item.schedule_end && new Date(item.schedule_end) < now) return false;
            return true;
        });

        const data = {
            profile: {
                name: profile.display_name || handle,
                bio: profile.bio || "",
                avatarUrl: profile.avatar_url || "",
            },
            theme: {
                preset: profile.theme_config?.preset || "neutral",
                primaryColor: profile.theme_config?.primaryColor || "#000000",
                backgroundStyle: profile.theme_config?.backgroundStyle || "solid",
                buttonRadius: profile.theme_config?.buttonRadius || "md",
                fontPreset: profile.theme_config?.fontPreset || "roboto",
            },
            newsletter: {
                enabled: profile.newsletter_config?.enabled ?? false,
                title: profile.newsletter_config?.title || "Subscribe",
                description: profile.newsletter_config?.description || "",
            },
            items: activeItems,
        };

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Public Profile API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
