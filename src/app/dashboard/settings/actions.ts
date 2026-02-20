"use server"

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
    name: z.string().optional(),
    bio: z.string().optional(),
    primaryColor: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/).optional(),
})

export async function updateSettings(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const username = formData.get("username") as string
    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    const primaryColor = formData.get("primaryColor") as string

    const parsed = settingsSchema.safeParse({
        username: username || undefined,
        name: name || undefined,
        bio: bio || undefined,
        primaryColor: primaryColor || undefined,
    })

    if (!parsed.success) {
        throw new Error("Invalid input")
    }

    try {
        const data = parsed.data
        await db
            .update(users)
            .set({
                username: data.username || null,
                name: data.name || null,
                bio: data.bio || null,
                theme_config: { primaryColor: data.primaryColor || "#000000" },
            })
            .where(eq(users.id, session.user.id))

        revalidatePath("/dashboard/settings")
        // Revalidate public profile if possible, it's dynamic
    } catch (err: any) {
        if (err.code === '23505') { // Postgres unique constraint error
            throw new Error("Username already taken")
        }
        throw new Error("Failed to update settings")
    }
}
