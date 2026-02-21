import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <>
            <nav className="fixed top-0 inset-x-0 w-full z-50 px-6 py-6 flex items-center justify-between pointer-events-none mix-blend-difference">
                <div className="font-extrabold tracking-tighter text-2xl uppercase pointer-events-auto text-white">Medio.</div>
                <div className="flex gap-6 items-center pointer-events-auto">
                    <Link href="/login" className="text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors">Log in</Link>
                    <Button asChild className="rounded-none bg-white text-black hover:bg-zinc-200 uppercase font-bold tracking-wider px-6 h-12 shadow-none" size="sm">
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>
            </nav>

            <main className="flex-1 flex flex-col relative w-full overflow-hidden bg-[#0a0a0a] text-white pt-32">
                {/* Fooror style hero section */}
                <div className="w-full px-6 flex flex-col gap-8 pb-20 border-b border-zinc-800">
                    <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter uppercase max-w-[95%]">
                        We Create Toolkits <br />
                        <span className="text-zinc-500">That Grow</span> <br />
                        <div className="flex items-center gap-4 md:gap-8 overflow-hidden whitespace-nowrap">
                            Your Audience
                            <div className="hidden md:flex h-4 w-4 rounded-full bg-red-600 animate-pulse"></div>
                        </div>
                    </h1>

                    <div className="flex flex-col md:flex-row gap-12 md:items-end justify-between mt-8">
                        <p className="text-xl md:text-2xl text-zinc-400 max-w-xl font-medium leading-relaxed">
                            Strategic tools & CRM integration. A creator platform combining link-in-bio, blog, and email capture seamlessly.
                        </p>
                        <Button asChild size="lg" className="rounded-full bg-red-600 text-white hover:bg-red-700 h-24 w-24 md:h-32 md:w-32 flex items-center justify-center p-0 rounded-full text-lg uppercase font-bold transition-transform hover:scale-105">
                            <Link href="/login" className="flex flex-col items-center justify-center h-full w-full">
                                <span>Start</span>
                                <span>Now</span>
                                <span className="block mt-1">↗</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Marquee Section */}
                <div className="relative flex overflow-x-hidden bg-white text-black py-4 border-y border-zinc-200 z-10">
                    <div className="animate-marquee whitespace-nowrap flex items-center font-bold uppercase tracking-widest text-lg md:text-2xl">
                        <span className="mx-4">More than just a link-in-bio</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just a blog</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just an audience</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just a link-in-bio</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just a blog</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just an audience</span> <span className="mx-4 text-red-600">✱</span>
                    </div>
                    <div className="animate-marquee whitespace-nowrap flex items-center font-bold uppercase tracking-widest text-lg md:text-2xl absolute top-4">
                        <span className="mx-4">More than just a link-in-bio</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just a blog</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just an audience</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just a link-in-bio</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just a blog</span> <span className="mx-4 text-red-600">✱</span>
                        <span className="mx-4">More than just an audience</span> <span className="mx-4 text-red-600">✱</span>
                    </div>
                </div>

                {/* Featured Projects / Features Section */}
                <div className="py-24 px-6 md:px-12 bg-[#0a0a0a]">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 pb-8 border-b border-zinc-800">
                        Featured Tools
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="group cursor-pointer">
                            <div className="w-full aspect-[4/3] bg-zinc-900 overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <div className="w-full h-full border border-zinc-700 rounded-lg bg-zinc-800/50 flex flex-col">
                                        <div className="h-10 border-b border-zinc-700 flex items-center px-4 gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col gap-4">
                                            <div className="h-8 bg-zinc-700/50 rounded w-1/3"></div>
                                            <div className="h-4 bg-zinc-700/30 rounded w-full mt-4"></div>
                                            <div className="h-4 bg-zinc-700/30 rounded w-5/6"></div>
                                            <div className="h-4 bg-zinc-700/30 rounded w-4/6"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-white font-bold uppercase tracking-widest border border-white px-6 py-2 rounded-full">Explore Link-in-Bio</div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold uppercase">Link-in-Bio</h3>
                            <p className="text-zinc-400 mt-2">A personalized space for all your vital connections.</p>
                        </div>

                        <div className="group cursor-pointer">
                            <div className="w-full aspect-[4/3] bg-zinc-900 overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <div className="w-full h-full border border-zinc-700 rounded-lg bg-zinc-800/50 flex flex-col">
                                        <div className="p-6 flex-1 flex flex-col gap-4">
                                            <div className="h-64 bg-zinc-700/50 rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-white font-bold uppercase tracking-widest border border-white px-6 py-2 rounded-full">Explore Newsletter</div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold uppercase">Newsletter & Audience</h3>
                            <p className="text-zinc-400 mt-2">Manage subscribers and capture emails directly.</p>
                        </div>
                    </div>
                </div>

                {/* High visual block */}
                <div className="py-32 px-6 flex flex-col items-center text-center border-t border-zinc-800">
                    <h2 className="text-[8vw] md:text-[6vw] leading-[0.9] font-black tracking-tighter uppercase max-w-[90%] mb-12">
                        You can be sure <br /> that we deliver
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left border-y border-zinc-800 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                        <div className="p-8">
                            <div className="text-red-500 font-black text-xl mb-4">01</div>
                            <h4 className="text-2xl font-bold uppercase mb-4">Unlimited Growth</h4>
                            <p className="text-zinc-400">Scale your audience without platform limitations or hidden fees.</p>
                        </div>
                        <div className="p-8">
                            <div className="text-red-500 font-black text-xl mb-4">02</div>
                            <h4 className="text-2xl font-bold uppercase mb-4">Live Preview</h4>
                            <p className="text-zinc-400">See changes in real-time as you build your ultimate creator hub.</p>
                        </div>
                        <div className="p-8">
                            <div className="text-red-500 font-black text-xl mb-4">03</div>
                            <h4 className="text-2xl font-bold uppercase mb-4">Full Ownership</h4>
                            <p className="text-zinc-400">Your audience, your data. Export your contacts whenever you need.</p>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
}
