import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function OnboardingPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border rounded-xl p-8 space-y-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Welcome to Medio!</h1>
                <p className="text-muted-foreground">Let's set up your custom profile handle so you can start sharing your link.</p>
                <form className="space-y-4 text-left">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Claim your username</label>
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 px-3 flex-shrink-0 text-muted-foreground sm:text-sm">medio.com/</span>
                            <Input className="rounded-none rounded-r-md" placeholder="username" />
                        </div>
                    </div>
                    <Button className="w-full">Complete Setup</Button>
                </form>
            </div>
        </div>
    );
}
