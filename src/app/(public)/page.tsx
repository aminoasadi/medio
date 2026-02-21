import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <>
            <nav className="fixed top-0 inset-x-0 w-full z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
                <div className="font-bold tracking-tight text-xl pointer-events-auto">Medio</div>
                <div className="flex gap-4 items-center pointer-events-auto">
                    <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Log in</Link>
                    <Button asChild className="rounded-full shadow-sm" size="sm">
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#FAFAFA]">
                {/* Subtle dot pattern background */}
                <div className="absolute inset-0 bg-[url('https://otanes.ai/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50 z-0"></div>

                <div className="z-10 container mx-auto px-4 text-center max-w-4xl space-y-12 animate-fade-in-up mt-24">
                    <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-3 py-1 text-sm font-medium text-zinc-600 mb-8 mx-auto">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        Medio Toolkit is live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-zinc-900 leading-[1.1]">
                        Run your creator business <br className="hidden md:block" /> like a pro
                    </h1>

                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
                        Simple, modern, and sleek toolkit. Stay in sync, keep every project moving forward, and track your audience effortlessly. Powered by simplicity.
                    </p>

                    <div className="flex gap-4 justify-center items-center pt-4">
                        <Button asChild size="lg" className="rounded-full shadow-lg h-12 px-8 text-base">
                            <Link href="/login">Start building for free</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full bg-white h-12 px-8 text-base border-zinc-200 shadow-sm">
                            <Link href="#features">Explore features</Link>
                        </Button>
                    </div>
                </div>

                <div className="z-10 w-full max-w-5xl mx-auto mt-24 px-4 pb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="w-full aspect-video rounded-2xl bg-white border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex items-center justify-center p-2 relative">
                        <div className="absolute top-4 left-4 flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="w-full h-full rounded-xl border border-zinc-100 bg-[#FAFAFA] flex flex-col items-center justify-center text-zinc-400 gap-4 mt-8">
                            <div className="grid grid-cols-3 gap-6 w-full max-w-3xl px-8">
                                <div className="h-48 rounded-xl bg-white shadow-sm border border-zinc-100 col-span-1"></div>
                                <div className="h-48 rounded-xl bg-white shadow-sm border border-zinc-100 col-span-2"></div>
                                <div className="h-24 rounded-xl bg-white shadow-sm border border-zinc-100 col-span-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
