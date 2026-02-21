import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth();
    if (session?.user) redirect("/dashboard/builder");

    return (
        <div className="flex bg-background min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground">Enter your email to sign in</p>
                </div>
                <form action={async (formData) => {
                    "use server";
                    await signIn("nodemailer", formData, { redirectTo: "/dashboard/builder" });
                }} className="space-y-4">
                    <Input name="email" type="email" placeholder="name@example.com" required />
                    <Button type="submit" className="w-full">Sign In with Email</Button>
                </form>
            </div>
        </div>
    );
}
