"use client";

import { useBuilderStore } from "@/store/builder.store";
import { Button } from "@/components/ui/button";
import { Copy01Icon, LinkSquare02Icon, SmartPhone01Icon, ComputerIcon, Mail02Icon } from "hugeicons-react";
import { useToast } from "@/hooks/use-toast";

export function PreviewPane() {
    const { profile, theme, items } = useBuilderStore();
    const { toast } = useToast();
    const activeItems = items.filter(b => b.enabled).sort((a, b) => a.order - b.order);

    const publicUrl = `https://medio.vercel.app/u/${profile.name.toLowerCase().replace(/\s+/g, '-') || "user"}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(publicUrl);
        toast({ title: "Link copied to clipboard!" });
    };

    const handleView = () => {
        window.open(publicUrl, "_blank");
    };

    return (
        <div className="flex flex-col h-full w-full p-6 text-foreground">
            <div className="flex items-center justify-between mb-8 gap-3">
                <div className="flex bg-background border border-border p-1 rounded-xl">
                    <button className="p-1.5 px-3 bg-muted rounded-lg shadow-sm text-foreground"><SmartPhone01Icon className="h-4 w-4" /></button>
                    <button className="p-1.5 px-3 text-muted-foreground hover:text-foreground transition-colors"><ComputerIcon className="h-4 w-4" /></button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-xl font-medium text-xs h-9">
                        <Copy01Icon className="h-4 w-4 mr-2" />
                        Copy URL
                    </Button>
                    <Button variant="default" size="sm" onClick={handleView} className="rounded-xl font-medium text-xs h-9 px-4">
                        <LinkSquare02Icon className="h-4 w-4 mr-2" />
                        View
                    </Button>
                </div>
            </div>

            {/* Mobile Frame Container */}
            <div className="relative mx-auto w-[340px] h-[720px] rounded-[3rem] border-[10px] border-black overflow-hidden bg-background shadow-xl ring-1 ring-border shadow-black/10 flex flex-col items-center">
                {/* Dynamic Content Renderer */}
                <div className="w-full h-full overflow-y-auto no-scrollbar" style={{ backgroundColor: theme.preset === "neutral" ? "#fbfbfb" : "var(--background)" }}>
                    {/* Header */}
                    <div className="flex flex-col items-center text-center p-8 pt-12 pb-6">
                        <div className="w-20 h-20 rounded-full bg-muted/60 mb-4 border border-border shadow-sm flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <div className="text-2xl font-bold text-muted-foreground">{profile.name.charAt(0) || "U"}</div>}
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">{profile.name || "Your Name"}</h2>
                        <p className="text-[13px] font-medium text-zinc-500 mt-2 max-w-[260px] leading-relaxed">{profile.bio || "Build your ultimate creator profile in minutes."}</p>
                    </div>

                    {/* Blocks */}
                    <div className="px-5 pb-12 flex flex-col gap-4">
                        {activeItems.map(item => {
                            if (item.type === 'email_capture') {
                                const cfg = item.config || {};
                                return (
                                    <div key={item.id} className="bg-white border rounded-2xl p-6 shadow-sm border-zinc-200">
                                        <div className="flex flex-col gap-2 mb-4 text-center">
                                            <Mail02Icon className="h-6 w-6 text-zinc-800 mx-auto" />
                                            <h3 className="text-sm font-bold text-zinc-900 leading-tight">{item.title}</h3>
                                            {cfg.description && <p className="text-xs text-zinc-500">{cfg.description}</p>}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <input type="email" placeholder={cfg.placeholder || "Your email address"} className="w-full h-11 bg-zinc-50 px-4 rounded-xl text-sm border focus:ring-2 outline-none font-medium border-zinc-200 text-zinc-900 placeholder:text-zinc-400" />
                                            <button className="w-full h-11 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center group">{cfg.buttonLabel || "Subscribe"}</button>
                                        </div>
                                    </div>
                                );
                            }

                            if (item.type === 'link') {
                                return (
                                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="w-full bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-center shadow-sm hover:bg-zinc-50 transition-all hover:scale-[1.02] group">
                                        <span className="font-semibold text-sm text-zinc-900">{item.title}</span>
                                    </a>
                                );
                            }

                            if (item.type === 'header') {
                                return (
                                    <div key={item.id} className="w-full pt-4 pb-2">
                                        <h3 className="text-lg font-bold text-zinc-900 text-center">{item.title}</h3>
                                        {item.config?.subtitle && <p className="text-sm text-zinc-500 text-center mt-1">{item.config.subtitle}</p>}
                                    </div>
                                );
                            }

                            if (item.type === 'divider') {
                                if (item.config?.style === 'space') return <div key={item.id} className="h-8" />;
                                return <div key={item.id} className="w-2/3 mx-auto h-[1px] bg-zinc-200 my-4" />;
                            }

                            return null;
                        })}
                    </div>
                    {/* Watermark MVP */}
                    <div className="mt-auto pb-6 flex items-center justify-center w-full">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-1.5"><div className="w-3 h-3 bg-zinc-200 rounded-full" /> Medio</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
