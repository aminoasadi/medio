import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function NewPostPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
            </div>
            <form className="space-y-4">
                <Input placeholder="Post Title" className="text-xl font-medium" />
                <Input placeholder="Slug (optional)" />
                <Textarea placeholder="Write your markdown content here..." rows={12} className="resize-y" />
                <div className="flex gap-4">
                    <Button>Publish Post</Button>
                    <Button variant="outline">Save Draft</Button>
                </div>
            </form>
        </div>
    );
}
