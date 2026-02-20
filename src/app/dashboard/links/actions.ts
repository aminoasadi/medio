"use server"

import { db } from "@/lib/db"
import { links } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const linkSchema = z.object({
    title: z.string().min(1),
    url: z.string().url(),
})

export async function addLink(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const title = formData.get("title") as string
    const url = formData.get("url") as string

    const parsed = linkSchema.safeParse({ title, url })
    if (!parsed.success) throw new Error("Invalid data")

    await db.insert(links).values({
        user_id: session.user.id,
        title: parsed.data.title,
        url: parsed.data.url,
    })

    revalidatePath("/dashboard/links")
}

export async function deleteLink(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await db.delete(links).where(and(eq(links.id, id), eq(links.user_id, session.user.id)))
    revalidatePath("/dashboard/links")
}

export async function moveLink(id: string, direction: "up" | "down") {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const userLinks = await db.select().from(links).where(eq(links.user_id, session.user.id)).orderBy(asc(links.order_index), asc(links.created_at))

    const currentIndex = userLinks.findIndex(l => l.id === id)
    if (currentIndex === -1) return

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (swapIndex < 0 || swapIndex >= userLinks.length) return

    const current = userLinks[currentIndex]
    const swap = userLinks[swapIndex]

    await db.update(links).set({ order_index: swap.order_index ?? swapIndex }).where(eq(links.id, current.id))
    await db.update(links).set({ order_index: current.order_index ?? currentIndex }).where(eq(links.id, swap.id))

    revalidatePath("/dashboard/links")
}
