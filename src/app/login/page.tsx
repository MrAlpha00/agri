"use client";

import { Leaf, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import Image from "next/image";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: token })
            });

            if (res.ok) {
                // Force a hard navigation to bypass static caches
                window.location.href = "/dashboard";
            } else {
                const data = await res.json();
                setError(data.error || "Authentication failed");
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50">

            {/* Left side: Branding / Promotional */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-white border-r border-slate-200">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent z-0" />
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-100 blur-[120px] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <Leaf className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        AgriScan AI
                    </span>
                </div>

                <div className="relative z-10 max-w-lg mt-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100 text-sm font-medium mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Admin Portal</span>
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                        Protect your <br /> crop yield with <br /> intelligent analysis.
                    </h1>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Access the private AgriScan dashboard to view system-wide predictions, statistics, and historical crop data from your field agents.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-6 text-slate-500 text-sm">
                    <span>© 2026 AgriScan AI Inc.</span>
                    <Link href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
                >

                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-8 h-8 text-brand-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access</h2>
                        <p className="text-slate-500">Sign in to the AgriScan Command Center</p>
                    </div>

                    <div className="space-y-6 pt-4">

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 rounded-xl border border-red-200 bg-red-50 flex items-center gap-3 text-red-600 text-sm mb-4">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Sign in with Google
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <Link href="/" className="text-slate-500 text-sm hover:text-brand-600 transition-colors flex items-center justify-center gap-2">
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Back to public scanner
                        </Link>
                    </div>

                </motion.div>
            </div>

        </div>
    );
}
