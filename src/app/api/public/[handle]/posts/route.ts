import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request, { params }: { params: { handle: string } }) {
    try {
        const { handle } = params;
        const supabase = createSupabaseAdmin();

        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("handle", handle)
            .single();

        if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

        const { data: posts, error } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", profile.id)
            .eq("status", "published")
            .order("published_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ data: posts || [] });
    } catch (e) {
        console.error("Public Posts GET Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
