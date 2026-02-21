import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: { postId: string } }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const [post] = await db.select().from(posts).where(
        and(eq(posts.id, params.postId), eq(posts.user_id, session.user.id))
    ).limit(1);

    if (!post) notFound();

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
            </div>
            <form className="space-y-4">
                <Input placeholder="Post Title" className="text-xl font-medium" defaultValue={post.title} />
                <Input placeholder="Slug" defaultValue={post.slug} />
                <Textarea placeholder="Write your markdown content here..." rows={12} className="resize-y" defaultValue={post.content || ""} />
                <div className="flex gap-4">
                    <Button>Update Post</Button>
                    {post.published ? (
                        <Button variant="secondary" type="button">Unpublish</Button>
                    ) : (
                        <Button variant="secondary" type="button">Publish</Button>
                    )}
                </div>
            </form>
        </div>
    );
}
