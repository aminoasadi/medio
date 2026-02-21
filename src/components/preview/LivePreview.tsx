"use client";
import { useBuilderStore } from "@/store/builder.store";

export function LivePreview() {
    const { profile, theme, links, newsletter, socials } = useBuilderStore();

    return (
        <div className="w-full flex justify-center">
            <div
                className="w-[375px] h-[812px] rounded-[3rem] border-8 border-slate-900 overflow-hidden shadow-2xl relative"
                style={{
                    backgroundColor: theme.backgroundStyle === 'solid' ? theme.primaryColor : 'transparent',
                    backgroundImage: theme.backgroundStyle === 'gradient' ? `linear-gradient(to bottom, ${theme.primaryColor}55, #00000010)` : 'none'
                }}
            >
                <div className="p-6 flex flex-col items-center gap-6 h-full overflow-y-auto no-scrollbar">
                    {/* Profile */}
                    <div className="flex flex-col items-center text-center gap-3 mt-8">
                        <div className="h-20 w-20 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
                            {profile.avatarUrl ? <img src={profile.avatarUrl} className="object-cover w-full h-full" alt="avatar" /> : null}
                        </div>
                        <h2 className="font-bold text-xl">{profile.name || "Your Name"}</h2>
                        <p className="text-sm opacity-80">{profile.bio}</p>
                    </div>

                    {/* Socials */}
                    {socials.length > 0 && (
                        <div className="flex gap-3 my-2">
                            {socials.filter(s => s.isEnabled).map(s => (
                                <div key={s.id} className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                                    {s.network[0].toUpperCase()}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Links */}
                    <div className="w-full flex flex-col gap-3">
                        {links.filter(l => l.isActive).map(l => (
                            <a
                                key={l.id}
                                href={l.url}
                                className="w-full py-4 text-center font-medium shadow-sm transition-transform hover:scale-[1.02]"
                                style={{
                                    backgroundColor: theme.preset === 'dark' ? '#1f2937' : '#ffffff',
                                    color: theme.preset === 'dark' ? '#f9fafb' : '#111827',
                                    borderRadius: theme.buttonRadius === 'sm' ? '0.25rem' : theme.buttonRadius === 'md' ? '0.5rem' : theme.buttonRadius === 'lg' ? '1rem' : theme.buttonRadius === 'full' ? '9999px' : '0'
                                }}
                            >
                                {l.title}
                            </a>
                        ))}
                    </div>

                    {/* Newsletter */}
                    {newsletter.enabled && (
                        <div className="w-full mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                            <h3 className="font-bold">{newsletter.title || "Subscribe"}</h3>
                            <p className="text-xs opacity-80 mt-1 mb-3">{newsletter.description}</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email address" className="flex-1 text-sm rounded bg-white px-2 py-1 border" />
                                <button className="bg-slate-900 text-white px-3 py-1 rounded text-sm font-medium">Join</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
