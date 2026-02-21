import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export default async function RegisterPage() {
    const session = await auth();
    if (session?.user) redirect("/dashboard/builder");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/20 relative">
            <div className="absolute top-8 left-8 md:top-12 md:left-12">
                <Link href="/" className="font-black text-2xl tracking-tighter text-foreground hover:opacity-80 transition-opacity">
                    Medio.
                </Link>
            </div>

            <RegisterForm />
        </div>
    );
}
