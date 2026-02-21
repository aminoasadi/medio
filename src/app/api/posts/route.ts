import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const supabase = createSupabaseAdmin();
        const { data: posts, error } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json({ data: posts || [] });
    } catch (e) {
        console.error("Posts GET Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { title, slug, content } = await req.json();
        const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const supabase = createSupabaseAdmin();
        const { data: newPost, error } = await supabase
            .from("posts")
            .insert({
                user_id: session.user.id,
                title,
                slug: generatedSlug,
                content_md: content || "",
                status: "draft"
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ data: newPost }, { status: 201 });
    } catch (e) {
        console.error("Posts POST Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
