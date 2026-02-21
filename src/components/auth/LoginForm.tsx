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
        <div className="w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col space-y-2 text-center mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Welcome Back
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    Enter your credentials to access your account
                </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-6 sm:p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-700 dark:text-zinc-300">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            className={cn(
                                                "h-11 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500",
                                                fieldState.error && "border-red-500 focus-visible:ring-red-500"
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-zinc-700 dark:text-zinc-300">Password</FormLabel>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
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
                                                    "h-11 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 pr-10",
                                                    fieldState.error && "border-red-500 focus-visible:ring-red-500"
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
                                                {showPassword ? (
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
                            Log In
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
                New here?{" "}
                <Link
                    href="/register"
                    className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
                >
                    Create Account
                </Link>
            </p>
        </div>
    );
}
