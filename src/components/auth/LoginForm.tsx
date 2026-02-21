"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ViewIcon, ViewOffSlashIcon, Loading02Icon } from "hugeicons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginWithCredentials, loginWithGoogle } from "@/app/(public)/actions";
import { GoogleIcon } from "./icons";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

export function LoginForm() {
    const [isPending, startTransition] = React.useTransition();
    const [isGooglePending, startGoogleTransition] = React.useTransition();
    const [showPassword, setShowPassword] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("password", values.password);
            await loginWithCredentials(formData);
        });
    }

    return (
        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500 relative bg-background">
            <div className="flex flex-col space-y-2 text-center mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Welcome Back
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Enter your credentials to access your account
                </p>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-xl p-6 sm:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            className={cn(
                                                "h-11 rounded-lg bg-background border-border focus-visible:ring-primary focus-visible:border-primary",
                                                fieldState.error && "border-destructive focus-visible:ring-destructive"
                                            )}
                                            {...field}
                                            disabled={isPending || isGooglePending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-destructive font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-foreground">Password</FormLabel>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-semibold text-primary hover:text-primary/80"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className={cn(
                                                    "h-11 rounded-lg bg-background border-border focus-visible:ring-primary focus-visible:border-primary pr-10",
                                                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                                                )}
                                                {...field}
                                                disabled={isPending || isGooglePending}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                disabled={isPending || isGooglePending}
                                            >
                                                {showPassword ? (
                                                    <ViewOffSlashIcon className="h-4 w-4" />
                                                ) : (
                                                    <ViewIcon className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-destructive font-medium" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={!form.formState.isValid || isPending || isGooglePending}
                            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium tracking-wide transition-all active:scale-[0.98]"
                        >
                            {isPending && <Loading02Icon className="mr-2 h-4 w-4 animate-spin stroke-[1.5]" />}
                            Log In
                        </Button>
                    </form>
                </Form>

                <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-3 text-muted-foreground font-medium tracking-wider">
                            Or
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        startGoogleTransition(async () => {
                            await loginWithGoogle();
                        });
                    }}
                    disabled={isGooglePending || isPending}
                    className="w-full h-11 bg-background border-border hover:bg-accent text-foreground font-medium rounded-lg transition-all"
                >
                    {isGooglePending ? (
                        <Loading02Icon className="mr-2 h-4 w-4 animate-spin stroke-[1.5]" />
                    ) : (
                        <GoogleIcon className="mr-2 h-4 w-4" />
                    )}
                    Continue with Google
                </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground font-medium">
                New here?{" "}
                <Link
                    href="/register"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                    Create Account
                </Link>
            </p>
        </div>
    );
}
