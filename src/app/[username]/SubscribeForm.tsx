"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const schema = z.object({
    email: z.string().email(),
})

export function SubscribeForm({ username, primaryColor }: { username: string, primaryColor: string }) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof schema>) {
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, username })
            })
            if (!res.ok) throw new Error("Subscription failed.")

            toast({ title: "Subscribed Successfully!" })
            form.reset()
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "An error occurred"
            toast({ title: "Error", description: message, variant: "destructive" })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full bg-slate-50 p-6 rounded-xl border">
                <h3 className="font-semibold text-center mb-2">Subscribe to my newsletter</h3>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    style={{ backgroundColor: primaryColor }}
                >
                    Subscribe
                </Button>
            </form>
        </Form>
    )
}
