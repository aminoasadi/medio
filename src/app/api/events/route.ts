import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { handle, event_type, item_id, meta, user_id } = body;

        let resolvedUserId = user_id;

        const supabase = createSupabaseAdmin();

        // If user_id is missing but we have handle, look it up
        if (!resolvedUserId && handle) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("handle", handle)
                .single();
            if (profile) resolvedUserId = profile.id;
        }

        if (!resolvedUserId) {
            return NextResponse.json({ error: "Missing identity" }, { status: 400 });
        }

        const { error } = await supabase.from("events").insert({
            user_id: resolvedUserId,
            handle: handle || null,
            event_type: event_type || "unknown",
            item_id: item_id || null,
            meta: meta || {},
            created_at: new Date().toISOString()
        });

        if (error) {
            console.error("Supabase insert error", error);
            return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Events API Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
