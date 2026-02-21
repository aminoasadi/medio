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

export interface LinkDTO {
    id: string;
    title: string;
    url: string;
    orderIndex: number;
    isActive: boolean;
}

export interface SocialDTO {
    id: string;
    network: string;
    url: string;
    isEnabled: boolean;
}

export interface BuilderSnapshotDTO {
    profile: ProfileDTO;
    theme: ThemeDTO;
    newsletter: NewsletterDTO;
    links: LinkDTO[];
    socials: SocialDTO[];
}
