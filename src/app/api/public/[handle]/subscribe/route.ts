import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request, { params }: { params: { handle: string } }) {
    try {
        const { handle } = params;
        const json = await req.json();
        const { email, source } = json;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const supabase = createSupabaseAdmin();

        // Resolve Handle
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("handle", handle)
            .single();

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

        // Upsert Contact
        await supabase.from("contacts").upsert(
            { user_id: profile.id, email, source: source || "profile" },
            { onConflict: "user_id,email" }
        );

        // Optional Event log natively attached
        await supabase.from("events").insert({
            user_id: profile.id,
            handle: handle,
            event_type: "subscribe_submit",
            meta: { email_captured: true, source },
            created_at: new Date().toISOString()
        });

        return NextResponse.json({ success: true, subscribed: true });
    } catch (error) {
        console.error("Public Subscribe API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
