import { Leaf, ShieldCheck, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
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
                        <span>Secure Enterprise Login</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Protect your <br /> crop yield with <br /> intelligent analysis.
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Join thousands of modern farmers using AI to detect, analyze, and treat crop diseases instantly before they spread.
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
                <div className="w-full max-w-md space-y-8 glass-card p-10">

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                        <p className="text-zinc-400 mb-8">Sign in to your AgriScan account</p>
                    </div>

                    <form className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-300">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    placeholder="farmer@john.com"
                                    className="w-full bg-dark-200 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-zinc-300">Password</label>
                                <Link href="#" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-dark-200 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full py-3 mt-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center group"
                        >
                            <span>Sign In to Dashboard</span>
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-zinc-400 text-sm">
                            Don't have an account? <Link href="#" className="text-brand-400 hover:text-white font-medium transition-colors">Create one now</Link>
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}
