import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BuilderTabs } from "@/components/builder/BuilderTabs";

export default async function BuilderPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Builder</h1>
                    <p className="text-muted-foreground">Design your public Medio profile.</p>
                </div>
            </div>
            <BuilderTabs />
        </div>
    );
}
