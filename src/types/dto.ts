export interface UnifiedResponse<T = unknown> {
    data?: T;
    error?: {
        code: string;
        message: string;
        fieldErrors?: Record<string, string[]>;
    };
}

export interface ProfileDTO {
    name: string;
    bio: string | null;
    avatarUrl: string | null;
}

export interface ThemeDTO {
    preset: string;
    primaryColor: string;
    backgroundStyle: string;
    buttonRadius: string;
    fontPreset?: string;
}

export interface NewsletterDTO {
    enabled: boolean;
    title: string;
    description: string;
}

export interface PageItemDTO {
    id: string;
    type: "link" | "header" | "divider" | "social_row" | "embed" | "email_capture";
    enabled: boolean;
    order: number;
    title?: string;
    url?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any; // Dynamic based on type
    schedule_start?: string | null;
    schedule_end?: string | null;
}

export interface BuilderSnapshotDTO {
    profile: ProfileDTO;
    theme: ThemeDTO;
    newsletter: NewsletterDTO;
    items: PageItemDTO[];
}
