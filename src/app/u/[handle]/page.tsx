"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { BuilderSnapshotDTO } from "@/types/dto";
import Link from "next/link";
import { Mail02Icon } from "hugeicons-react";

export default function PublicProfilePage({ params }: { params: { handle: string } }) {
    const { handle } = params;
    const [data, setData] = useState<BuilderSnapshotDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/public/${handle}/profile`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) notFound();
                    throw new Error("Failed");
                }
                return res.json();
            })
            .then(resData => {
                setData(resData.data);
                setLoading(false);

                // Track Page View
                fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        handle,
                        event_type: 'page_view',
                        meta: { userAgent: navigator.userAgent }
                    })
                }).catch(console.error);
            })
            .catch(() => setLoading(false));
    }, [handle]);

    const trackLinkClick = (itemId: string, url: string) => {
        fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                handle,
                event_type: 'link_click',
                item_id: itemId,
                meta: { url }
            })
        }).catch(console.error);
    };

    const handleSubscribe = (e: React.FormEvent, itemId: string, email: string) => {
        e.preventDefault();
        fetch(`/api/public/${handle}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, source: "profile_block" })
        }).catch(console.error);
        alert("Subscribed successfully!");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center">Profile not found.</div>;

    const { profile, theme, items } = data;

    return (
        <div className="min-h-screen flex justify-center w-full" style={{ backgroundColor: theme.preset === "neutral" ? "#fbfbfb" : "var(--background)" }}>
            <div className="w-full max-w-[600px] p-6 flex flex-col items-center gap-6 pb-20">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-3 mt-12 w-full">
                    <div className="h-24 w-24 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shadow-sm flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {profile.avatarUrl ? <img src={profile.avatarUrl} className="object-cover w-full h-full" alt="avatar" /> : <span className="text-2xl font-bold opacity-30">{profile.name.charAt(0)}</span>}
                    </div>
                    <h1 className="font-bold text-2xl text-zinc-900 mt-2">{profile.name || `@${handle}`}</h1>
                    <p className="text-sm font-medium text-zinc-500 max-w-[400px] leading-relaxed">{profile.bio}</p>
                </div>

                {/* Blocks Output */}
                <div className="w-full flex flex-col gap-4 mt-8 px-2 md:px-6">
                    {items.map(item => {
                        if (item.type === 'email_capture') {
                            const cfg = item.config || {};
                            return (
                                <div key={item.id} className="bg-white border rounded-2xl p-6 shadow-sm border-zinc-200 w-full mb-2 mt-2">
                                    <div className="flex flex-col gap-2 mb-4 text-center">
                                        <Mail02Icon className="h-6 w-6 text-zinc-800 mx-auto" />
                                        <h3 className="text-sm font-bold text-zinc-900 leading-tight">{item.title}</h3>
                                        {cfg.description && <p className="text-xs text-zinc-500">{cfg.description}</p>}
                                    </div>
                                    <form onSubmit={(e) => {
                                        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                                        handleSubscribe(e, item.id, email);
                                    }} className="flex flex-col gap-2">
                                        <input type="email" name="email" placeholder={cfg.placeholder || "Your email address"} required className="w-full h-11 bg-zinc-50 px-4 rounded-xl text-sm border focus:ring-2 outline-none font-medium border-zinc-200 text-zinc-900 placeholder:text-zinc-400" />
                                        <button type="submit" className="w-full h-11 rounded-xl bg-zinc-900 text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center group">{cfg.buttonLabel || "Subscribe"}</button>
                                    </form>
                                </div>
                            );
                        }

                        if (item.type === 'link') {
                            return (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackLinkClick(item.id, item.url || "")}
                                    className="w-full bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-center shadow-sm hover:bg-zinc-50 transition-all hover:scale-[1.02] group"
                                    style={{
                                        borderRadius: theme.buttonRadius === 'sm' ? '0.25rem' : theme.buttonRadius === 'md' ? '0.75rem' : theme.buttonRadius === 'lg' ? '1rem' : theme.buttonRadius === 'full' ? '9999px' : '0'
                                    }}
                                >
                                    <span className="font-semibold text-sm text-zinc-900">{item.title}</span>
                                </a>
                            );
                        }

                        if (item.type === 'header') {
                            return (
                                <div key={item.id} className="w-full pt-6 pb-2">
                                    <h3 className="text-lg font-bold text-zinc-900 text-center tracking-tight">{item.title}</h3>
                                    {item.config?.subtitle && <p className="text-sm text-zinc-500 text-center mt-1">{item.config.subtitle}</p>}
                                </div>
                            );
                        }

                        if (item.type === 'divider') {
                            if (item.config?.style === 'space') return <div key={item.id} className="h-8" />;
                            return <div key={item.id} className="w-2/3 mx-auto h-[1px] bg-zinc-200 my-4" />;
                        }

                        if (item.type === 'social_row') {
                            return (
                                <div key={item.id} className="flex gap-4 justify-center my-4">
                                    {Array.isArray(item.config?.items) && item.config.items.map((s: { network: string, url: string }, idx: number) => (
                                        <a key={idx} href={s.url} target="_blank" rel="noreferrer" onClick={() => trackLinkClick(item.id, s.url)} className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold hover:scale-110 transition-transform">
                                            {(s.network || "S")[0].toUpperCase()}
                                        </a>
                                    ))}
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>

                <div className="mt-16 mb-8 flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full bg-zinc-200 mb-2"></div>
                    <Link href="/" className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-zinc-600 transition-colors">
                        Powered by Medio
                    </Link>
                </div>
            </div>
        </div>
    );
}
