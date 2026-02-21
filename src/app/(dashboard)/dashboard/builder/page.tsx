"use client";

import { useEffect } from "react";
import { useBuilderStore } from "@/store/builder.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlocksList } from "@/components/builder/BlocksList";
import { PreviewPane } from "@/components/preview/PreviewPane";
import { Loading02Icon, CheckmarkCircle01Icon, Alert01Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";

export default function BuilderPage() {
    const { hydrate, status, retrySave } = useBuilderStore();

    useEffect(() => {
        // Hydrate from API
        fetch('/api/builder/snapshot')
            .then(res => res.json())
            .then(data => {
                hydrate({
                    profile: data.data?.profile || { name: "Your Name", bio: "Your bio", avatarUrl: "" },
                    theme: data.data?.theme || { preset: "neutral", primaryColor: "#0EA5E9", backgroundStyle: "solid", buttonRadius: "md", fontPreset: "roboto" },
                    newsletter: data.data?.newsletter || { enabled: false, title: "Join my newsletter", description: "" },
                    items: data.data?.items || []
                });
            })
            .catch(() => {
                // Fallback hydration
                hydrate({
                    profile: { name: "Your Name", bio: "Your bio", avatarUrl: "" },
                    theme: { preset: "neutral", primaryColor: "#0EA5E9", backgroundStyle: "solid", buttonRadius: "md", fontPreset: "roboto" },
                    newsletter: { enabled: false, title: "Join my newsletter", description: "" },
                    items: []
                });
            });
    }, [hydrate]);

    return (
        <div className="flex h-full w-full">
            {/* Main Workspace */}
            <main className="flex-1 overflow-y-auto border-r border-border bg-background p-4 md:p-8">
                <div className="max-w-3xl mx-auto h-full flex flex-col">
                    <Tabs defaultValue="content" className="w-full flex-1 flex flex-col">
                        <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 rounded-none h-auto gap-6 mb-8 overflow-x-auto no-scrollbar">
                            <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground px-0 pb-3 rounded-none whitespace-nowrap">Content</TabsTrigger>
                            <TabsTrigger value="design" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground px-0 pb-3 rounded-none whitespace-nowrap">Design</TabsTrigger>
                            <TabsTrigger value="style" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground px-0 pb-3 rounded-none whitespace-nowrap">Style</TabsTrigger>
                            <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground px-0 pb-3 rounded-none whitespace-nowrap">Profile</TabsTrigger>
                            <TabsTrigger value="socials" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground px-0 pb-3 rounded-none whitespace-nowrap">Socials</TabsTrigger>
                            <TabsTrigger value="marketing" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground px-0 pb-3 rounded-none text-muted-foreground mr-auto flex gap-2 items-center whitespace-nowrap" disabled>
                                Marketing <span className="text-[10px] uppercase font-bold tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Coming soon</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="flex-1 flex flex-col gap-6 m-0 border-0 p-0 outline-none">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Blocks</h1>
                                    <p className="text-sm text-muted-foreground mt-1">Add and reorder your content blocks.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        {status === 'saving' && <><Loading02Icon className="h-4 w-4 animate-spin text-muted-foreground" /><span className="text-muted-foreground">Saving...</span></>}
                                        {status === 'saved' && <><CheckmarkCircle01Icon className="h-4 w-4 text-emerald-500" /><span className="text-muted-foreground">Saved</span></>}
                                        {status === 'error' && (
                                            <>
                                                <Alert01Icon className="h-4 w-4 text-destructive" />
                                                <span className="text-destructive">Error</span>
                                                <Button variant="link" size="sm" onClick={retrySave} className="h-auto p-0 text-xs">Retry</Button>
                                            </>
                                        )}
                                        {status === 'idle' && <span className="text-muted-foreground opacity-0">Idle</span>}
                                    </div>
                                </div>
                            </div>

                            <BlocksList />

                        </TabsContent>

                        <TabsContent value="design">
                            <div className="p-8 border rounded-xl bg-card text-center text-muted-foreground">Design settings coming soon</div>
                        </TabsContent>
                        <TabsContent value="style">
                            <div className="p-8 border rounded-xl bg-card text-center text-muted-foreground">Style settings coming soon</div>
                        </TabsContent>
                        <TabsContent value="profile">
                            <div className="p-8 border rounded-xl bg-card text-center text-muted-foreground">Profile editing coming soon</div>
                        </TabsContent>
                        <TabsContent value="socials">
                            <div className="p-8 border rounded-xl bg-card text-center text-muted-foreground">Social linking coming soon</div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Preview Workspace (Pane 3) */}
            <aside className="hidden lg:flex w-[420px] bg-muted/20 shrink-0 overflow-y-auto">
                <PreviewPane />
            </aside>
        </div>
    );
}
