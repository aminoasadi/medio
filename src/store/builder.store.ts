import { create } from "zustand";
import { BuilderSnapshotDTO, ProfileDTO, ThemeDTO, NewsletterDTO, LinkDTO, SocialDTO } from "@/types/dto";
import { apiPut, apiPost, apiDelete } from "@/lib/api/client";

interface BuilderState extends BuilderSnapshotDTO {
    ui: {
        status: "idle" | "saving" | "saved" | "error";
        error?: string;
        dirty: boolean;
    };

    hydrateFromServer: (snapshot: BuilderSnapshotDTO) => void;
    setProfile: (profile: Partial<ProfileDTO>) => void;
    setTheme: (theme: Partial<ThemeDTO>) => void;
    toggleNewsletter: (enabled: boolean) => void;
    setNewsletterDetails: (details: Partial<NewsletterDTO>) => void;

    addLink: (link: LinkDTO) => void;
    updateLink: (id: string, updates: Partial<LinkDTO>) => void;
    removeLink: (id: string) => void;
    reorderLinks: (sourceIndex: number, destIndex: number) => void;

    updateSocials: (items: SocialDTO[]) => void;

    save: () => Promise<void>;
    retrySave: () => Promise<void>;
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const useBuilderStore = create<BuilderState>((set, get) => ({
    profile: { name: "", bio: "", avatarUrl: "" },
    theme: { preset: "light", primaryColor: "#000000", backgroundStyle: "solid", buttonRadius: "md" },
    newsletter: { enabled: false, title: "", description: "" },
    links: [],
    socials: [],
    ui: { status: "idle", dirty: false },

    hydrateFromServer: (snapshot) => set({ ...snapshot, ui: { status: "idle", dirty: false } }),

    setProfile: (updates) => {
        set((state) => ({ profile: { ...state.profile, ...updates } }));
        get().save();
    },

    setTheme: (updates) => {
        set((state) => ({ theme: { ...state.theme, ...updates } }));
        get().save();
    },

    toggleNewsletter: (enabled) => {
        set((state) => ({ newsletter: { ...state.newsletter, enabled } }));
        get().save();
    },

    setNewsletterDetails: (updates) => {
        set((state) => ({ newsletter: { ...state.newsletter, ...updates } }));
        get().save();
    },

    addLink: (link) => {
        set((state) => ({ links: [...state.links, link] }));
        // Saving happens outside typically when the item is fully added via API
    },

    updateLink: (id, updates) => {
        set((state) => ({
            links: state.links.map(l => l.id === id ? { ...l, ...updates } : l)
        }));
        get().save();
    },

    removeLink: (id) => {
        set((state) => ({ links: state.links.filter(l => l.id !== id) }));
        apiDelete(`/api/links/${id}`).catch(console.error);
    },

    reorderLinks: (sourceIndex, destIndex) => {
        set((state) => {
            const links = [...state.links];
            const [moved] = links.splice(sourceIndex, 1);
            links.splice(destIndex, 0, moved);
            return { links };
        });
        // Trigger atomic save
        const orderedIds = get().links.map(l => l.id);
        apiPost("/api/links/reorder", { orderedIds }).catch(console.error);
    },

    updateSocials: (items) => {
        set({ socials: items });
        get().save();
    },

    save: async () => {
        set((state) => ({ ui: { ...state.ui, status: "saving", dirty: true } }));
        if (saveTimeout) clearTimeout(saveTimeout);

        saveTimeout = setTimeout(async () => {
            try {
                const { profile, theme, newsletter, socials } = get();
                await Promise.all([
                    apiPut("/api/me", profile),
                    apiPut("/api/me/theme", theme),
                    apiPut("/api/me/newsletter", newsletter),
                    apiPut("/api/social", { items: socials })
                ]);
                set((state) => ({ ui: { ...state.ui, status: "saved", dirty: false } }));
            } catch (error: unknown) {
                set(() => ({ ui: { status: "error", error: error instanceof Error ? error.message : "Unknown error", dirty: true } }));
            }
        }, 900);
    },

    retrySave: () => get().save()
}));
