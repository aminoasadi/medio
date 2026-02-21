import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const supabase = createSupabaseAdmin();
        const { error } = await supabase
            .from("posts")
            .update({
                status: "published",
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq("id", params.id)
            .eq("user_id", session.user.id);

        if (error) return NextResponse.json({ error: "Failed to publish" }, { status: 400 });
        return NextResponse.json({ success: true, published: true });
    } catch (e) {
        console.error("Post Publish Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
