import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="flex flex-col gap-6 max-w-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and preferences.</p>
                </div>
            </div>
            <div className="border rounded-xl p-6 bg-card space-y-4">
                <h2 className="font-semibold text-xl">Account Information</h2>
                <form className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Username Handle (e.g. jdoe)</label>
                        <Input placeholder="yourhandle" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Display Name</label>
                        <Input placeholder="John Doe" defaultValue={session.user.name || ""} />
                    </div>
                    <Button className="mt-4">Save Changes</Button>
                </form>
            </div>
        </div>
    );
}
