import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BlogPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
                    <p className="text-muted-foreground">Write and manage your blog posts.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/blog/new">Write Post</Link>
                </Button>
            </div>
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
                <p>Your posts will appear here. (MVP Placeholder)</p>
            </div>
        </div>
    );
}
