import { notFound } from "next/navigation";
import { BuilderSnapshotDTO } from "@/types/dto";
import Link from "next/link";
import { headers } from "next/headers";

async function getProfileData(handle: string): Promise<BuilderSnapshotDTO> {
    const host = headers().get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const res = await fetch(`${protocol}://${host}/api/public/${handle}/profile`, { next: { revalidate: 60 } });

    if (!res.ok) {
        if (res.status === 404) notFound();
        throw new Error("Failed to load profile");
    }

    const json = await res.json();
    return json.data;
}

export default async function PublicProfilePage({ params }: { params: { handle: string } }) {
    const { handle } = params;
    const data = await getProfileData(handle);
    const { profile, theme, links, newsletter, socials } = data;

    return (
        <div className="min-h-screen flex justify-center w-full"
            style={{
                backgroundColor: theme.backgroundStyle === 'solid' ? theme.primaryColor : 'transparent',
                backgroundImage: theme.backgroundStyle === 'gradient' ? `linear-gradient(to bottom, ${theme.primaryColor}55, #00000010)` : 'none'
            }}
        >
            <div className="w-full max-w-[500px] p-6 flex flex-col items-center gap-6">
                {/* Profile */}
                <div className="flex flex-col items-center text-center gap-3 mt-12">
                    <div className="h-24 w-24 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shadow-sm">
                        {profile.avatarUrl ? <img src={profile.avatarUrl} className="object-cover w-full h-full" alt="avatar" /> : null}
                    </div>
                    <h1 className="font-bold text-2xl">{profile.name || `@${handle}`}</h1>
                    <p className="opacity-90">{profile.bio}</p>
                </div>

                {/* Socials */}
                {socials.length > 0 && (
                    <div className="flex gap-4 my-2">
                        {socials.map(s => (
                            <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                                {s.network[0].toUpperCase()}
                            </a>
                        ))}
                    </div>
                )}

                {/* Links */}
                <div className="w-full flex flex-col gap-4">
                    {links.map(l => (
                        <a
                            key={l.id}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-4 px-6 text-center font-semibold shadow-sm transition-transform hover:scale-[1.02] border"
                            style={{
                                backgroundColor: theme.preset === 'dark' ? '#1f2937' : '#ffffff',
                                color: theme.preset === 'dark' ? '#f9fafb' : '#111827',
                                borderColor: theme.preset === 'dark' ? '#374151' : '#e5e7eb',
                                borderRadius: theme.buttonRadius === 'sm' ? '0.25rem' : theme.buttonRadius === 'md' ? '0.5rem' : theme.buttonRadius === 'lg' ? '1rem' : theme.buttonRadius === 'full' ? '9999px' : '0'
                            }}
                        >
                            {l.title}
                        </a>
                    ))}
                </div>

                {/* Newsletter */}
                {newsletter.enabled && (
                    <div className="w-full mt-6 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center border">
                        <h3 className="font-bold text-lg">{newsletter.title}</h3>
                        <p className="text-sm opacity-80 mt-2 mb-4">{newsletter.description}</p>
                        <form className="flex gap-2">
                            <input type="email" placeholder="Your email address" className="flex-1 rounded-md px-3 py-2 border shadow-sm" required />
                            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-md font-medium">Subscribe</button>
                        </form>
                    </div>
                )}

                <div className="mt-12 mb-8">
                    <Link href="/" className="text-xs font-semibold opacity-50 hover:opacity-100 tracking-widest uppercase">
                        Create your Medio
                    </Link>
                </div>
            </div>
        </div>
    );
}
