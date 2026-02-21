import Link from "next/link";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/dashboard/UserMenu";
import {
    Layout01Icon,
    UserMultiple02Icon,
    File01Icon,
    Settings02Icon
} from "hugeicons-react";

export function SidebarNav({ user }: { user: User }) {
    const navItems = [
        { title: "Builder", url: "/dashboard/builder", icon: Layout01Icon },
        { title: "Audience", url: "/dashboard/audience", icon: UserMultiple02Icon },
        { title: "Blog", url: "/dashboard/blog", icon: File01Icon },
        { title: "Settings", url: "/dashboard/settings", icon: Settings02Icon },
    ];

    return (
        <nav className="w-64 border-r border-border bg-background flex flex-col justify-between py-6 px-4">
            <div className="space-y-8">
                <div className="font-bold text-2xl tracking-tighter px-2 text-foreground">Medio</div>
                <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Button
                            key={item.title}
                            variant="ghost"
                            className="justify-start gap-3 w-full text-muted-foreground hover:text-foreground hover:bg-muted"
                            asChild
                        >
                            <Link href={item.url}>
                                <item.icon className="h-5 w-5 stroke-[1.5]" />
                                <span className="font-medium">{item.title}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            <div className="border-t border-border pt-4">
                <UserMenu user={user} />
            </div>
        </nav>
    );
}
