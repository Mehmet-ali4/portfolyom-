"use client";

import { useState } from "react";
import { Lock, User, Loader2, AlertCircle } from "lucide-react";
import { loginAction } from "@/app/actions";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        try {
            const result = await loginAction(formData);
            if (result && !result.success) {
                setError(result.error || "Login failed.");
            }
        } catch {
            // redirect throws, which is expected on success
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6 grid-pattern">
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-primary/5 rounded-full blur-[120px]" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm neon-border-red mb-4">
                        <Lock size={24} className="text-red-primary" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight gradient-text">Admin Access</h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to manage your portfolio</p>
                </div>

                {/* Form */}
                <div className="glass-card p-8 neon-border-blue">
                    <form action={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="text-xs font-medium text-gray-400 mb-2 block uppercase tracking-wider">
                                Username
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="input-dark pl-11"
                                    placeholder="admin"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="text-xs font-medium text-gray-400 mb-2 block uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="input-dark pl-11"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                    Default: admin / admin123
                </p>
            </div>
        </div>
    );
}
