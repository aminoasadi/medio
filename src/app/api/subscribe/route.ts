import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { contacts, users } from "@/lib/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

const subscribeSchema = z.object({
    email: z.string().email(),
    username: z.string().min(1),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = subscribeSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid email or username" }, { status: 400 })
        }

        const { email, username } = parsed.data

        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        await db.insert(contacts).values({
            user_id: user.id,
            email,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
