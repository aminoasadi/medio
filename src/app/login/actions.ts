"use server"

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq, or } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { isRedirectError } from "next/dist/client/components/redirect"

const registerSchema = z.object({
    identifier: z.string().min(3, "Must provide an email or phone number."),
    password: z.string().min(6, "Password must be at least 6 characters."),
})

export async function registerAction(prevState: any, formData: FormData) {
    const identifier = formData.get("identifier") as string
    const password = formData.get("password") as string

    const parsed = registerSchema.safeParse({ identifier, password })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const isEmail = identifier.includes("@")

    const existing = await db.select().from(users).where(
        or(eq(users.email, identifier), eq(users.phone, identifier))
    ).limit(1)

    if (existing.length > 0) {
        return { error: "User already exists with this identifier." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.insert(users).values({
        [isEmail ? "email" : "phone"]: identifier,
        password: hashedPassword,
    })

    // Auto sign in user
    try {
        await signIn("credentials", { identifier, password, redirectTo: "/dashboard/settings" })
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return { error: "Auto-login failed. Please sign in." }
    }
}

export async function loginAction(prevState: any, formData: FormData) {
    try {
        await signIn("credentials", {
            identifier: formData.get("identifier"),
            password: formData.get("password"),
            redirectTo: "/dashboard/settings",
        })
    } catch (error) {
        if (isRedirectError(error)) throw error;
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') return { error: "Invalid credentials." }
            return { error: "Authentication failed." }
        }
        return { error: "Something went wrong." }
    }
}

export async function unifiedAuthAction(prevState: any, formData: FormData) {
    const identifier = formData.get("identifier") as string
    if (!identifier) return { error: "Identifier is required." }

    const existing = await db.select().from(users).where(
        or(eq(users.email, identifier), eq(users.phone, identifier))
    ).limit(1)

    if (existing.length > 0) {
        return await loginAction(prevState, formData)
    } else {
        return await registerAction(prevState, formData)
    }
}
