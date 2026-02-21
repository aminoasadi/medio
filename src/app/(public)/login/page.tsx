import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

import Link from "next/link";

export default async function LoginPage() {
    const session = await auth();
    if (session?.user) redirect("/dashboard/builder");

    return (
        <div className="flex bg-[#0a0a0a] min-h-screen flex-col items-center justify-center p-4">
            <Link href="/" className="mb-8 font-black text-2xl uppercase tracking-tighter text-white">Medio.</Link>
            <div className="w-full max-w-[360px] rounded-none border border-zinc-800 bg-[#121212] shadow-2xl p-8 space-y-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Welcome Back</h1>
                    <p className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">Enter your email to sign in</p>
                </div>
                <form action={async (formData) => {
                    "use server";
                    await signIn("nodemailer", formData, { redirectTo: "/dashboard/builder" });
                }} className="space-y-4">
                    <Input name="email" type="email" placeholder="name@example.com" required className="h-12 border-zinc-700 bg-black text-white rounded-none placeholder:text-zinc-600" />
                    <Button type="submit" className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-none uppercase font-bold tracking-widest">Sign in with Email</Button>
                </form>
            </div>
            <p className="max-w-[320px] text-center text-xs text-zinc-500 mt-8 uppercase tracking-widest">By signing in, you agree to our Terms of Service.</p>
        </div>
    );
}
