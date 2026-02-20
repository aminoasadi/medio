import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { updateSettings } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const userRecord = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    })

    // Ensure theme is correctly passed as JSON
    const theme = userRecord?.theme_config as { primaryColor?: string } | null
    const primaryColor = theme?.primaryColor || "#000000"

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                        Update your public profile information like your unique username, display name, bio, and primary color.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updateSettings} className="space-y-6 max-w-xl">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                defaultValue={userRecord?.username || ""}
                                placeholder="your_unique_username"
                            />
                            <p className="text-xs text-muted-foreground">This string will be used for your public profile URL.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={userRecord?.name || ""}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={userRecord?.bio || ""}
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="primaryColor"
                                    name="primaryColor"
                                    type="color"
                                    defaultValue={primaryColor}
                                    className="w-24 h-12 p-1 cursor-pointer"
                                />
                                <span className="text-muted-foreground text-sm font-mono">{primaryColor}</span>
                            </div>
                        </div>

                        <Button type="submit">Save Settings</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
