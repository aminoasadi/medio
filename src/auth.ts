import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    trustHost: true,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                const email = credentials.email as string;
                let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

                if (!user) {
                    // Auto-register for staging environment
                    const [newUser] = await db.insert(users).values({
                        email,
                        name: email.split("@")[0],
                    }).returning();
                    user = newUser;
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
})
