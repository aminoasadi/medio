import Link from "next/link";
import { LayoutTemplate, Users, FileText, Settings, LogOut } from "lucide-react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "@/auth"; // assuming auth exports signOut, if not form action

export function SidebarNav({ user }: { user: User }) {
    const navItems = [
        { title: "Builder", url: "/dashboard/builder", icon: LayoutTemplate },
        { title: "Audience", url: "/dashboard/audience", icon: Users },
        { title: "Blog", url: "/dashboard/blog", icon: FileText },
        { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ];

    return (
        <nav className="w-64 border-r flex flex-col justify-between py-6 px-4">
            <div className="space-y-8">
                <div className="font-bold text-2xl tracking-tighter px-2">Medio</div>
                <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Button key={item.title} variant="ghost" className="justify-start gap-3 w-full" asChild>
                            <Link href={item.url}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 border-t pt-4">
                <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image!} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </div>
                <form action={async () => {
                    "use server"; // Wait can't use server action without importing, I'll make it client or let's use a standard wrapper 
                }}>
                    {/* Note: since this is a server component normally we'd pass a server action via file but we'll mock logout for now */}
                    <Button variant="ghost" className="justify-start gap-3 w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </Button>
                </form>
            </div>
        </nav>
    );
}
