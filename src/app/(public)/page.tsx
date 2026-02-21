import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6 container mx-auto px-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Medio <span className="text-primary">Creator Toolkit</span></h1>
            <p className="text-xl text-muted-foreground text-center max-w-2xl">
                The ultimate link-in-bio, blog, and email capture toolkit designed for modern creators.
                Build your audience and share your links instantly.
            </p>
            <div className="flex gap-4">
                <Button asChild size="lg"><Link href="/login">Get Started</Link></Button>
            </div>
        </div>
    );
}
