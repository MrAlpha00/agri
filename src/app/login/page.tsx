"use client";

import { Leaf, ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password) {
            setError("Please enter the admin passcode");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                // Force a hard navigation to bypass static caches
                window.location.href = "/dashboard";
            } else {
                const data = await res.json();
                setError(data.error || "Invalid passcode");
            }
        } catch (err) {
            setError("A network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-dark-200">

            {/* Left side: Branding / Promotional */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-zinc-900 border-r border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent z-0" />
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <Leaf className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        AgriScan AI
                    </span>
                </div>

                <div className="relative z-10 max-w-lg mt-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Admin Portal</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Protect your <br /> crop yield with <br /> intelligent analysis.
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Access the private AgriScan dashboard to view system-wide predictions, statistics, and historical crop data from your field agents.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-6 text-zinc-500 text-sm">
                    <span>© 2026 AgriScan AI Inc.</span>
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8 glass-card p-10"
                >

                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-dark-200 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <Lock className="w-8 h-8 text-brand-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                        <p className="text-zinc-400">Enter the master passcode to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 pt-4">

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-zinc-300">Passcode</label>
                            </div>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-dark-200 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all font-mono"
                                />
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Hint: Try `admin123` for the MVP demo.</p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center gap-3 text-red-400 text-sm mt-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Authenticate <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link href="/" className="text-zinc-500 text-sm hover:text-white transition-colors flex items-center justify-center gap-2">
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Back to public scanner
                        </Link>
                    </div>

                </motion.div>
            </div>

        </div>
    );
}
