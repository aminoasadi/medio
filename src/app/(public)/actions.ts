"use server";

import { signIn } from "@/auth";

export async function loginWithCredentials(formData: FormData) {
    // Pass the extracted FormData to NextAuth
    // The current auth implementation only requires email, but in a real scenario it would use password too.
    await signIn("credentials", Object.fromEntries(formData), { redirectTo: "/dashboard/builder" });
}

export async function loginWithGoogle() {
    await signIn("google", { redirectTo: "/dashboard/builder" });
}

export async function registerWithCredentials(formData: FormData) {
    // Here you would normally hash the password and insert the user via Drizzle
    // Since the user is auto-registered in the current auth.ts, we'll just sign them in.
    await signIn("credentials", Object.fromEntries(formData), { redirectTo: "/dashboard/builder" });
}
