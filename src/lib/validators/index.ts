import { z } from "zod";

export const ProfileSchema = z.object({
    name: z.string().min(2),
    bio: z.string().nullable().optional(),
    avatarUrl: z.string().url().nullable().optional(),
});

export const ThemeSchema = z.object({
    preset: z.string(),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{3,4}){1,2}$/),
    backgroundStyle: z.string(),
    buttonRadius: z.enum(["sm", "md", "lg", "full", "none"]),
    fontPreset: z.string().optional(),
});

export const NewsletterSchema = z.object({
    enabled: z.boolean(),
    title: z.string().min(1),
    description: z.string().min(1),
});

export const CreateLinkSchema = z.object({
    title: z.string().min(1),
    url: z.string().url(),
    isActive: z.boolean().default(true),
});

export const ReorderSchema = z.object({
    orderedIds: z.array(z.string()).refine((arr) => new Set(arr).size === arr.length, "IDs must be unique"),
});

export const SocialItemsSchema = z.object({
    items: z.array(z.object({
        network: z.string(),
        url: z.string().url().or(z.string().length(0)),
        isEnabled: z.boolean()
    }))
});

export const SubscribeSchema = z.object({
    email: z.string().email()
});
