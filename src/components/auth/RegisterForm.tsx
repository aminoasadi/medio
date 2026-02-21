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
import { registerWithCredentials, loginWithGoogle } from "@/app/(public)/actions";
import { GoogleIcon } from "./icons";
import { cn } from "@/lib/utils";

const formSchema = z
    .object({
        username: z.string().min(1, { message: "Username is required." }),
        email: z.string().email({ message: "Please enter a valid email address." }),
        password: z.string().min(8, { message: "Password must be at least 8 characters." }),
        confirmPassword: z.string().min(8, { message: "Confirm password is required." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export function RegisterForm() {
    const [isPending, startTransition] = React.useTransition();
    const [isGooglePending, startGoogleTransition] = React.useTransition();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onBlur", // Helps with indicating errors when leaving the field
    });

    const watchPassword = form.watch("password");

    // Minimal strength indicator (calculates based on length)
    const passwordStrength = React.useMemo(() => {
        if (!watchPassword) return 0;
        let score = 0;
        if (watchPassword.length >= 8) score += 25;
        if (watchPassword.length >= 10) score += 25;
        if (/[A-Z]/.test(watchPassword)) score += 25;
        if (/[0-9]/.test(watchPassword)) score += 25;
        return score;
    }, [watchPassword]);

    const strengthColor =
        passwordStrength < 50
            ? "bg-destructive"
            : passwordStrength < 100
                ? "bg-amber-400"
                : "bg-emerald-500";

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("email", values.email);
            formData.append("password", values.password);
            await registerWithCredentials(formData);
        });
    }

    return (
        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500 bg-background relative">
            <div className="flex flex-col space-y-2 text-center mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Create Your Medio Account
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Join us and start building today
                </p>
            </div>

            <div className="bg-card border border-border shadow-sm rounded-xl p-6 sm:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="johndoe"
                                            className={cn(
                                                "h-11 rounded-lg bg-background border-border focus-visible:ring-primary",
                                                fieldState.invalid && "border-destructive focus-visible:ring-destructive"
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
                            name="email"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            className={cn(
                                                "h-11 rounded-lg bg-background border-border focus-visible:ring-primary",
                                                fieldState.invalid && "border-destructive focus-visible:ring-destructive"
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
                                    <FormLabel className="text-foreground">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className={cn(
                                                    "h-11 rounded-lg bg-background border-border focus-visible:ring-primary pr-10",
                                                    fieldState.invalid && "border-destructive focus-visible:ring-destructive"
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
                                                {showPassword ? <ViewOffSlashIcon className="h-4 w-4" /> : <ViewIcon className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    {/* Minimal strength indicator */}
                                    {watchPassword && !fieldState.invalid && (
                                        <div className="h-1 w-full bg-accent rounded-full mt-2 overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all duration-300", strengthColor)}
                                                style={{ width: `${passwordStrength}%` }}
                                            />
                                        </div>
                                    )}
                                    <FormMessage className="text-destructive font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className={cn(
                                                    "h-11 rounded-lg bg-background border-border focus-visible:ring-primary pr-10",
                                                    fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                                                )}
                                                {...field}
                                                disabled={isPending || isGooglePending}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                disabled={isPending || isGooglePending}
                                            >
                                                {showConfirmPassword ? (
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
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium tracking-wide transition-all active:scale-[0.98]"
                        >
                            {isPending && <Loading02Icon className="mr-2 h-4 w-4 animate-spin stroke-[1.5]" />}
                            Create Account
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
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                    Log In
                </Link>
            </p>
        </div>
    );
}
