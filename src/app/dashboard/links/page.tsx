import { auth } from "@/auth"
import { db } from "@/lib/db"
import { links } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { addLink, deleteLink, moveLink } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react"

export default async function LinksPage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const userLinks = await db
        .select()
        .from(links)
        .where(eq(links.user_id, session.user.id))
        .orderBy(asc(links.order_index), asc(links.created_at))

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Links</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addLink} className="flex gap-4 items-center">
                        <Input name="title" placeholder="Link Title" required />
                        <Input name="url" placeholder="https://example.com" type="url" required />
                        <Button type="submit">Add Link</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {userLinks.map((link, i) => (
                    <Card key={link.id}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div>
                                <h3 className="font-medium">{link.title}</h3>
                                <p className="text-sm text-muted-foreground">{link.url}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <form action={moveLink.bind(null, link.id, "up")}>
                                    <Button variant="outline" size="icon" disabled={i === 0} type="submit">
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                </form>
                                <form action={moveLink.bind(null, link.id, "down")}>
                                    <Button variant="outline" size="icon" disabled={i === userLinks.length - 1} type="submit">
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                </form>
                                <form action={deleteLink.bind(null, link.id)}>
                                    <Button variant="destructive" size="icon" type="submit">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {userLinks.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No links added yet.</p>
                )}
            </div>
        </div>
    )
}
