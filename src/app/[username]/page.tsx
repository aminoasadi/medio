import { db } from "@/lib/db"
import { users, links, posts, social_feeds } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { SubscribeForm } from "./SubscribeForm"

interface PageProps {
    params: { username: string }
}

export default async function PublicProfile({ params }: PageProps) {
    const { username } = params

    const userRecord = await db.query.users.findFirst({
        where: eq(users.username, username),
    })

    if (!userRecord) {
        notFound()
    }

    const userId = userRecord.id
    const theme = userRecord.theme_config as { primaryColor?: string } | null
    const primaryColor = theme?.primaryColor || "#000000"

    const userLinks = await db.select().from(links).where(and(eq(links.user_id, userId), eq(links.active, true))).orderBy(links.order_index)
    const userSocials = await db.select().from(social_feeds).where(and(eq(social_feeds.user_id, userId), eq(social_feeds.active, true)))
    const recentPosts = await db.select().from(posts).where(and(eq(posts.user_id, userId), eq(posts.published, true))).orderBy(desc(posts.created_at)).limit(3)

    return (
        <main className="min-h-screen py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-md mx-auto space-y-8">

                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={userRecord.image || ""} />
                        <AvatarFallback>{userRecord.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{userRecord.name || `@${userRecord.username}`}</h1>
                        {userRecord.bio && <p className="text-muted-foreground mt-2">{userRecord.bio}</p>}
                    </div>
                </div>

                {/* Links */}
                <div className="space-y-4 flex flex-col w-full">
                    {userLinks.map(link => (
                        <Button
                            key={link.id}
                            asChild
                            variant="outline"
                            className="w-full py-6 text-lg"
                            style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.title}
                            </a>
                        </Button>
                    ))}
                </div>

                {/* Lead Capture Block */}
                <div className="w-full mt-8">
                    <SubscribeForm username={username} primaryColor={primaryColor} />
                </div>

                {/* Blog Feed */}
                {recentPosts.length > 0 && (
                    <div className="space-y-4 mt-8 w-full">
                        <h2 className="text-xl font-bold text-center">Latest Posts</h2>
                        {recentPosts.map(post => (
                            <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <Link href={`/${username}/blog/${post.slug}`}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{post.title}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{post.created_at.toLocaleDateString()}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm line-clamp-2">{post.content}</p>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}

            </div>
        </main>
    )
}
