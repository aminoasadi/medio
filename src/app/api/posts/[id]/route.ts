import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const supabase = createSupabaseAdmin();
        const { data: post, error } = await supabase
            .from("posts")
            .select("*")
            .eq("id", params.id)
            .eq("user_id", session.user.id)
            .single();

        if (error || !post) return NextResponse.json({ error: "Not Found" }, { status: 404 });
        return NextResponse.json({ data: post });
    } catch (e) {
        console.error("Post GET Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const updates = await req.json();

        const supabase = createSupabaseAdmin();
        const { data: updatedPost, error } = await supabase
            .from("posts")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", params.id)
            .eq("user_id", session.user.id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: "Failed to update" }, { status: 400 });
        return NextResponse.json({ data: updatedPost });
    } catch (e) {
        console.error("Post PATCH Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const supabase = createSupabaseAdmin();
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", params.id)
            .eq("user_id", session.user.id);

        if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Post DELETE Error", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
