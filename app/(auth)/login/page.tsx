'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('next') || '/admin';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Successful login
            router.push(redirectTo);
            router.refresh();
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
                <div className="text-center mb-8">
                    <h1 className={`text-3xl text-[#1C1917] mb-2 ${playfair.className} italic`}>
                        Admin Portal
                    </h1>
                    <p className="text-stone-400 text-sm">Sign in to manage your property</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center justify-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-[#A18058] font-bold mb-2 block">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#A18058] focus:bg-white transition-all text-sm"
                            placeholder="admin@obsidian.com"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-[#A18058] font-bold mb-2 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#A18058] focus:bg-white transition-all text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1C1917] text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-[#2C2926] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-stone-400 hover:text-[#A18058] text-xs transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to public site
                    </Link>
                </div>
            </div>
            <p className="text-center text-xs text-stone-400 mt-8 opacity-60">
                &copy; {new Date().getFullYear()} The Obsidian. Restricted Access.
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-stone-400 text-sm">Loading login...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
