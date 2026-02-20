"use client"

import { useFormState, useFormStatus } from "react-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { unifiedAuthAction } from "./actions"
import { signIn } from "next-auth/react"
import { Mail, Lock } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-[#333] h-11 mt-4"
            disabled={pending}
        >
            {pending ? "Please wait..." : "Continue"}
        </Button>
    )
}

export default function LoginPage() {
    const [authState, dispatchAuth] = useFormState(unifiedAuthAction, undefined)

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white px-4 shadow-[inset_0_0_120px_rgba(29,78,216,0.15)]">
            <div className="w-full max-w-[360px] flex flex-col items-center">

                {/* Minimal Logo Spot */}
                <div className="h-12 w-12 bg-white rounded-xl mb-6 flex items-center justify-center text-black font-extrabold text-xl">
                    M
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold mb-2 tracking-tight">Welcome to Medio</h1>
                    <p className="text-sm text-[#888888]">Please sign in or sign up below.</p>
                </div>

                <form action={dispatchAuth} className="w-full space-y-4">
                    <div className="space-y-3">
                        <p className="text-xs text-left text-[#888888] pl-1">Enter your email or phone</p>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#888888]" />
                            <Input
                                name="identifier"
                                placeholder="name@email.com"
                                required
                                className="bg-[#0A0A0A] border-[#222] pl-10 h-11 text-white placeholder:text-[#555] focus-visible:ring-1 focus-visible:ring-[#444] rounded-lg"
                            />
                        </div>

                        <div className="relative mt-2">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#888888]" />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="bg-[#0A0A0A] border-[#222] pl-10 h-11 text-white placeholder:text-[#555] focus-visible:ring-1 focus-visible:ring-[#444] rounded-lg"
                            />
                        </div>
                    </div>

                    {authState?.error && (
                        <p className="text-sm text-red-500/90 font-medium text-center">{authState.error}</p>
                    )}

                    <SubmitButton />
                </form>

                <div className="flex w-full items-center gap-4 text-xs text-[#444] my-6">
                    <div className="h-px w-full bg-[#222]" />
                    OR
                    <div className="h-px w-full bg-[#222]" />
                </div>

                <Button
                    variant="outline"
                    className="w-full bg-transparent border-[#222] text-white hover:bg-[#1A1A1A] hover:text-white h-11 rounded-lg"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard/settings" })}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </Button>

                <p className="text-center text-[11px] text-[#666] mt-8 leading-relaxed max-w-[280px]">
                    By signing up, you agree to the <a href="#" className="underline underline-offset-2 hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="underline underline-offset-2 hover:text-white transition-colors">Privacy Policy</a>.
                </p>

            </div>
        </div>
    )
}
