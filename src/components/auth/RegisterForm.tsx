"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
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
            ? "bg-red-500"
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
        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col space-y-2 text-center mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Create Your Medio Account
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    Join us and start building today
                </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-6 sm:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-700 dark:text-zinc-300">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="johndoe"
                                            className={cn(
                                                "h-11 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500",
                                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                                            )}
                                            {...field}
                                            disabled={isPending || isGooglePending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-700 dark:text-zinc-300">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            className={cn(
                                                "h-11 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500",
                                                fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                                            )}
                                            {...field}
                                            disabled={isPending || isGooglePending}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-700 dark:text-zinc-300">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className={cn(
                                                    "h-11 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 pr-10",
                                                    fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                                                )}
                                                {...field}
                                                disabled={isPending || isGooglePending}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                                disabled={isPending || isGooglePending}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    {/* Minimal strength indicator */}
                                    {watchPassword && !fieldState.invalid && (
                                        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all duration-300", strengthColor)}
                                                style={{ width: `${passwordStrength}%` }}
                                            />
                                        </div>
                                    )}
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-700 dark:text-zinc-300">Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className={cn(
                                                    "h-11 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 pr-10",
                                                    fieldState.invalid && "border-red-500 focus-visible:ring-red-500"
                                                )}
                                                {...field}
                                                disabled={isPending || isGooglePending}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                                disabled={isPending || isGooglePending}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={!form.formState.isValid || isPending || isGooglePending}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium tracking-wide shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                </Form>

                <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500 font-medium tracking-wider">
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
                    className="w-full h-11 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-all"
                >
                    {isGooglePending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <GoogleIcon className="mr-2 h-4 w-4" />
                    )}
                    Continue with Google
                </Button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                >
                    Log In
                </Link>
            </p>
        </div>
    );
}
