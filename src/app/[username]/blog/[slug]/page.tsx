import { db } from "@/lib/db"
import { users, posts } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function BlogPostPage({ params }: { params: { username: string, slug: string } }) {
    const { username, slug } = params

    const userRecord = await db.query.users.findFirst({
        where: eq(users.username, username),
    })

    if (!userRecord) notFound()

    const post = await db.query.posts.findFirst({
        where: and(eq(posts.user_id, userRecord.id), eq(posts.slug, slug), eq(posts.published, true)),
    })

    if (!post) notFound()

    const theme = userRecord.theme_config as { primaryColor?: string } | null
    const primaryColor = theme?.primaryColor || "#000000"

    return (
        <main className="min-h-screen py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-2xl mx-auto space-y-8">
                <Link href={`/${username}`} className="text-sm flex items-center gap-2 hover:underline text-muted-foreground mr-auto">
                    <ArrowLeft className="h-4 w-4" /> Back to @{username}
                </Link>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl border-b pb-4" style={{ borderColor: primaryColor }}>
                    {post.title}
                </h1>
                <div className="text-sm text-muted-foreground">
                    Published on {post.created_at.toLocaleDateString()}
                </div>
                <article className="prose prose-slate mt-8">
                    {/* Using a simple pre for MVP, robust solution requires Markdown Parser component */}
                    <pre className="whitespace-pre-wrap font-sans text-base">{post.content}</pre>
                </article>
            </div>
        </main>
    )
}
