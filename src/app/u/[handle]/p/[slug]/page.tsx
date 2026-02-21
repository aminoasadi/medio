import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";

export default async function PublicPostPage({ params }: { params: { handle: string, slug: string } }) {
    const { handle, slug } = params;

    // DB fetching
    const userRecord = await db.query.users.findFirst({ where: eq(users.username, handle) });
    if (!userRecord) notFound();

    const [post] = await db.select().from(posts).where(
        and(eq(posts.user_id, userRecord.id), eq(posts.slug, slug), eq(posts.published, true))
    ).limit(1);

    if (!post) notFound();

    return (
        <div className="min-h-screen flex w-full justify-center bg-slate-50 dark:bg-slate-950 p-6">
            <article className="w-full max-w-3xl prose dark:prose-invert">
                <Link href={`/u/${handle}`} className="text-sm font-semibold opacity-70 hover:opacity-100 no-underline mb-8 block font-sans">
                    &larr; Back to {userRecord.name || handle}&apos;s profile
                </Link>
                <h1>{post.title}</h1>
                <p className="text-xs text-muted-foreground font-sans">Published on {post.created_at.toLocaleDateString()}</p>
                <hr />
                <div className="mt-8 font-sans whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>
        </div>
    );
}
