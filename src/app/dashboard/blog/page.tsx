import { auth } from "@/auth"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { createPost, deletePost } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import Link from "next/link"

export default async function BlogPage() {
    const session = await auth()
    if (!session?.user?.id || !session.user.name) return null
    const userName = session.user.name

    const userPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.user_id, session.user.id))
        .orderBy(desc(posts.created_at))

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Blog Manager</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Write a New Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createPost} className="space-y-4">
                        <Input name="title" placeholder="Post Title" required />
                        <Textarea
                            name="content"
                            placeholder="Write your markdown content here..."
                            required
                            rows={8}
                        />
                        <Button type="submit">Publish Post</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {userPosts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    <Link href={`/${userName}/blog/${post.slug}`} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">/{post.slug}</div>
                            </div>
                            <form action={deletePost.bind(null, post.id)}>
                                <Button variant="ghost" size="icon" type="submit" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-3 text-sm">{post.content}</p>
                        </CardContent>
                    </Card>
                ))}
                {userPosts.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No posts yet. Start writing!</p>
                )}
            </div>
        </div>
    )
}
