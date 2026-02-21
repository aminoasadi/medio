import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const supabase = createSupabaseAdmin();
        const { data: contacts, error } = await supabase
            .from("contacts")
            .select("email, source, created_at")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // MVP Export: Return JSON. Reconfigure to CSV easily if required
        return NextResponse.json({ data: contacts || [] });
    } catch (e) {
        console.error("Audience Export Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
