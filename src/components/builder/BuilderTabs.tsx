"use client";

import { useEffect, useState } from "react";
import { useBuilderStore } from "@/store/builder.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { apiGet } from "@/lib/api/client";
import { BuilderSnapshotDTO } from "@/types/dto";

function SaveStatus() {
    const { ui } = useBuilderStore();
    if (ui.status === "saving") return <span className="text-xs text-muted-foreground">Saving...</span>;
    if (ui.status === "saved" && !ui.dirty) return <span className="text-xs text-green-500">Saved</span>;
    if (ui.status === "error") return <span className="text-xs text-red-500">Error saving</span>;
    return null;
}

export function BuilderTabs() {
    const { hydrateFromServer, setProfile, profile, newsletter, toggleNewsletter, theme, setTheme } = useBuilderStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load initial data
        apiGet<BuilderSnapshotDTO>("/api/builder/snapshot")
            .then(data => {
                hydrateFromServer(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load snaphot", err);
                setLoading(false);
            });
    }, [hydrateFromServer]);

    if (loading) return <div className="p-8 animate-pulse text-muted-foreground text-center">Loading builder...</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <SaveStatus />
            </div>

            <Tabs defaultValue="blocks" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger value="blocks">Blocks</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                </TabsList>

                <TabsContent value="blocks" className="space-y-6 mt-6">
                    <section className="border p-4 rounded-xl space-y-4 bg-card">
                        <h3 className="font-semibold text-lg">Profile</h3>
                        <div className="grid gap-3">
                            <Input
                                placeholder="Name"
                                value={profile.name}
                                onChange={e => setProfile({ name: e.target.value })}
                            />
                            <Input
                                placeholder="Bio"
                                value={profile.bio || ""}
                                onChange={e => setProfile({ bio: e.target.value })}
                            />
                            <Input
                                placeholder="Avatar URL"
                                value={profile.avatarUrl || ""}
                                onChange={e => setProfile({ avatarUrl: e.target.value })}
                            />
                        </div>
                    </section>

                    <section className="border p-4 rounded-xl space-y-4 bg-card">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Newsletter & Lead Capture</h3>
                            <Switch checked={newsletter.enabled} onCheckedChange={toggleNewsletter} />
                        </div>
                        {newsletter.enabled && (
                            <div className="grid gap-3 mt-4">
                                <p className="text-sm text-muted-foreground">Ask your audience to subscribe to your updates.</p>
                            </div>
                        )}
                    </section>

                    {/* Links and Socials MVP Placeholders */}
                    <section className="border p-4 rounded-xl space-y-4 bg-card">
                        <h3 className="font-semibold text-lg">Links (MVP Placeholder)</h3>
                        <p className="text-sm text-muted-foreground">Manage links via Zustand store here.</p>
                        <Button variant="secondary" size="sm">Add Link</Button>
                    </section>
                </TabsContent>

                <TabsContent value="design" className="space-y-6 mt-6">
                    <section className="border p-4 rounded-xl space-y-4 bg-card">
                        <h3 className="font-semibold text-lg">Appearance</h3>
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <span>Theme Preset</span>
                                <select
                                    className="p-2 border rounded bg-background"
                                    value={theme.preset}
                                    onChange={e => setTheme({ preset: e.target.value })}
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>Primary Color</span>
                                <input
                                    type="color"
                                    value={theme.primaryColor}
                                    onChange={e => setTheme({ primaryColor: e.target.value })}
                                    className="w-10 h-10 rounded cursor-pointer border"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Button Style</span>
                                <select
                                    className="p-2 border rounded bg-background"
                                    value={theme.buttonRadius}
                                    onChange={e => setTheme({ buttonRadius: e.target.value as any })}
                                >
                                    <option value="sm">Small Radius</option>
                                    <option value="md">Medium Radius</option>
                                    <option value="lg">Large Radius</option>
                                    <option value="full">Pill (Full)</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </TabsContent>
            </Tabs>
        </div>
    );
}
