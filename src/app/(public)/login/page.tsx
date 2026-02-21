import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

import Link from "next/link";

export default async function LoginPage() {
    const session = await auth();
    if (session?.user) redirect("/dashboard/builder");

    return (
        <div className="flex bg-[#FAFAFA] min-h-screen flex-col items-center justify-center p-4">
            <Link href="/" className="mb-8 font-bold text-xl tracking-tight text-zinc-900">Medio</Link>
            <div className="w-full max-w-[360px] rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8 space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900">Welcome Back</h1>
                    <p className="text-sm text-zinc-500">Enter your email to sign in to your account</p>
                </div>
                <form action={async (formData) => {
                    "use server";
                    await signIn("nodemailer", formData, { redirectTo: "/dashboard/builder" });
                }} className="space-y-4">
                    <Input name="email" type="email" placeholder="name@example.com" required className="h-11 rounded-lg" />
                    <Button type="submit" className="w-full h-11 rounded-lg shadow-sm">Sign in with Email</Button>
                </form>
            </div>
            <p className="max-w-[320px] text-center text-xs text-zinc-400 mt-8">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
    );
}
