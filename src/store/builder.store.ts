import { create } from "zustand";
import { NewsletterDTO, ProfileDTO, ThemeDTO, PageItemDTO } from "@/types/dto";

export interface BuilderState {
    status: "idle" | "saving" | "saved" | "error";
    profile: ProfileDTO;
    theme: ThemeDTO;
    newsletter: NewsletterDTO;
    items: PageItemDTO[];
    _saveTimeout: ReturnType<typeof setTimeout> | null;
    hydrate: (data: { profile: ProfileDTO; theme: ThemeDTO; newsletter: NewsletterDTO; items: PageItemDTO[] }) => void;
    updateProfile: (data: Partial<ProfileDTO>) => void;
    updateTheme: (data: Partial<ThemeDTO>) => void;
    updateNewsletter: (data: Partial<NewsletterDTO>) => void;
    addItem: (type: PageItemDTO["type"], defaultValues?: Partial<PageItemDTO>) => void;
    updateItem: (id: string, data: Partial<PageItemDTO>) => void;
    deleteItem: (id: string) => void;
    reorderItems: (oldIndex: number, newIndex: number) => void;
    retrySave: () => void;
    _scheduleSave: () => void;
}

// Actual backend API call to persist the single-source-of-truth 
const saveToApi = async (state: Partial<BuilderState>) => {
    try {
        await fetch('/api/builder/snapshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSONstringifyIfSafe(state)
        });
    } catch {
        throw new Error('Failed to save to API');
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JSONstringifyIfSafe = (data: any) => {
    try { return JSON.stringify(data); } catch { return "{}"; }
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
    status: "idle",
    profile: {
        name: "",
        bio: "",
        avatarUrl: "",
    },
    theme: {
        preset: "neutral",
        primaryColor: "#0EA5E9",
        backgroundStyle: "solid",
        buttonRadius: "md",
        fontPreset: "roboto",
    },
    newsletter: {
        enabled: false,
        title: "Join my newsletter",
        description: "",
    },
    items: [],
    _saveTimeout: null,

    hydrate: ({ profile, theme, newsletter, items }) => {
        set({ profile, theme, newsletter, items, status: "idle" });
    },

    _scheduleSave: () => {
        set((state) => {
            if (state._saveTimeout) clearTimeout(state._saveTimeout);

            const timeout = setTimeout(async () => {
                set({ status: "saving" });
                try {
                    await saveToApi({
                        profile: get().profile,
                        theme: get().theme,
                        newsletter: get().newsletter,
                        items: get().items,
                    });
                    set({ status: "saved" });
                } catch {
                    set({ status: "error" });
                }
            }, 900);
            return { _saveTimeout: timeout, status: "idle" };
        });
    },

    updateProfile: (data) => {
        set((state) => ({ profile: { ...state.profile, ...data } }));
        get()._scheduleSave();
    },

    updateTheme: (data) => {
        set((state) => ({ theme: { ...state.theme, ...data } }));
        get()._scheduleSave();
    },

    updateNewsletter: (data) => {
        set((state) => ({ newsletter: { ...state.newsletter, ...data } }));
        get()._scheduleSave();
    },

    addItem: (type, defaultValues) => {
        const id = crypto.randomUUID(); // Fallback UUID generation
        const newItem: PageItemDTO = {
            id,
            type,
            enabled: true,
            order: get().items.length,
            title: defaultValues?.title || "",
            url: defaultValues?.url || "",
            config: defaultValues?.config || {},
            ...defaultValues
        };
        set((state) => ({ items: [...state.items, newItem] }));
        get()._scheduleSave();
    },

    updateItem: (id, data) => {
        set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, ...data } : i)),
        }));
        get()._scheduleSave();
    },

    deleteItem: (id) => {
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        }));
        get()._scheduleSave();
    },

    reorderItems: (oldIndex, newIndex) => {
        set((state) => {
            const items = [...state.items];
            const [moved] = items.splice(oldIndex, 1);
            items.splice(newIndex, 0, moved);
            return { items: items.map((itm, i) => ({ ...itm, order: i })) };
        });
        get()._scheduleSave();
    },

    retrySave: () => {
        get()._scheduleSave();
    },
}));
