import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AudiencePage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audience</h1>
                    <p className="text-muted-foreground">Manage your captured subscribers.</p>
                </div>
            </div>
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <p>Subscriber view is coming soon. (MVP Implementation)</p>
            </div>
        </div>
    );
}
