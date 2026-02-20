"use server"

import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createPost(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const slug = formData.get("slug") as string || slugify(title)

    await db.insert(posts).values({
        user_id: session.user.id,
        title,
        slug,
        content,
        published: true, // Auto publish for MVP
    })

    revalidatePath("/dashboard/blog")
}

export async function deletePost(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await db.delete(posts).where(and(eq(posts.id, id), eq(posts.user_id, session.user.id)))
    revalidatePath("/dashboard/blog")
}
