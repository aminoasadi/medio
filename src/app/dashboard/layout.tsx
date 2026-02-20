import { redirect } from "next/navigation"
import { auth } from "@/auth"
import {
    SidebarProvider,
    SidebarTrigger,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar"
import { LinkIcon, Users, FileText, Settings, Blocks } from "lucide-react"
import Link from "next/link"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    if (!session?.user) {
        redirect("/api/auth/signin")
    }

    const navItems = [
        { title: "Links", url: "/dashboard/links", icon: LinkIcon },
        { title: "Audience", url: "/dashboard/audience", icon: Users },
        { title: "Blog", url: "/dashboard/blog", icon: FileText },
        { title: "Integrations", url: "/dashboard/integrations", icon: Blocks },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ]

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-lg font-bold">Medio</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <main className="flex-1 w-full min-h-screen">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                </header>
                <div className="p-6 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
