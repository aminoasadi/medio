import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { LivePreview } from "@/components/preview/LivePreview";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
            {/* Pane 1: Sidebar Nav */}
            <SidebarNav user={session.user} />

            {/* Pane 2: Workspace */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-3xl border-r">
                {children}
            </main>

            {/* Pane 3: Live Preview */}
            <aside className="hidden lg:flex w-[400px] bg-muted/10 p-4 shrink-0 overflow-y-auto">
                <LivePreview />
            </aside>
        </div>
    );
}
