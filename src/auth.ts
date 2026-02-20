import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema"
import Resend from "next-auth/providers/resend"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [
        Resend({
            from: "no-reply@medio.local",
            apiKey: process.env.RESEND_API_KEY || "re_mock",
            sendVerificationRequest({ identifier, url }) {
                console.log(`\n\n======================================================`)
                console.log(`[Mock Email Provider]`)
                console.log(`To: ${identifier}`)
                console.log(`Click this link to sign in:`)
                console.log(url)
                console.log(`======================================================\n\n`)
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                // The Drizzle adapter should provide the user from the db
            }
            return session;
        },
    },
})
