import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
            {/* Pane 1: Sidebar Nav */}
            <SidebarNav user={session.user} />

            {/* Dynamic Workspace (Pane 2 & 3 mapped per page) */}
            <div className="flex-1 flex overflow-hidden">
                {children}
            </div>
        </div>
    );
}
