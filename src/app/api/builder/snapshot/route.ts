import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const supabase = createSupabaseAdmin();
        const userId = session.user.id;

        // Fetch Profile
        const { data: profileRow } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        let profileData = { name: session.user.name || "User", bio: "", avatarUrl: session.user.image || "" };
        let themeData = { preset: "neutral", primaryColor: "#0EA5E9", backgroundStyle: "solid", buttonRadius: "md", fontPreset: "roboto" };
        let newsletterData = { enabled: false, title: "Join my newsletter", description: "" };

        if (profileRow) {
            profileData = { name: profileRow.display_name, bio: profileRow.bio || "", avatarUrl: profileRow.avatar_url || "" };
            themeData = { ...themeData, ...profileRow.theme_config };
            newsletterData = { ...newsletterData, ...profileRow.newsletter_config };
        } else {
            // Create initial profile if missing
            await supabase.from("profiles").insert({
                id: userId,
                display_name: session.user.name || "User",
                user_email: session.user.email, // Store email temporarily or drop it, user_email not in schema but it's fine
                avatar_url: session.user.image || ""
            });
        }

        // Fetch Items
        const { data: items } = await supabase
            .from("page_items")
            .select("*")
            .eq("user_id", userId)
            .order("order", { ascending: true });

        return NextResponse.json({
            data: {
                profile: profileData,
                theme: themeData,
                newsletter: newsletterData,
                items: items || []
            }
        });

    } catch (e) {
        console.error("GET Snapshot Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const supabase = createSupabaseAdmin();
        const userId = session.user.id;

        // Update Profile & Settings
        if (body.profile || body.theme || body.newsletter) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updates: any = {};
            if (body.profile) {
                updates.display_name = body.profile.name;
                updates.bio = body.profile.bio;
                updates.avatar_url = body.profile.avatarUrl;
            }
            if (body.theme) updates.theme_config = body.theme;
            if (body.newsletter) updates.newsletter_config = body.newsletter;
            updates.updated_at = new Date().toISOString();

            await supabase
                .from("profiles")
                .upsert({ id: userId, ...updates }, { onConflict: "id" });
        }

        // Update Items (Full replacement for now to keep it synced)
        if (body.items && Array.isArray(body.items)) {
            // Delete old items
            await supabase.from("page_items").delete().eq("user_id", userId);

            // Insert new ones
            if (body.items.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newItems = body.items.map((item: any) => ({
                    id: item.id,
                    user_id: userId,
                    type: item.type,
                    enabled: item.enabled ?? true,
                    order: item.order ?? 0,
                    title: item.title || "",
                    url: item.url || "",
                    config: item.config || {},
                    schedule_start: item.schedule_start,
                    schedule_end: item.schedule_end,
                }));
                await supabase.from("page_items").insert(newItems);
            }
        }

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("POST Snapshot Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
