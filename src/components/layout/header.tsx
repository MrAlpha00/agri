"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User } from "lucide-react";

export function Header() {
    const pathname = usePathname();

    // Format pathname for header title
    const title = pathname === "/"
        ? "Upload & Analyze"
        : pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1);

    return (
        <header className="h-20 border-b border-white/5 bg-dark-100/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
            <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">{title}</h1>
                <p className="text-sm text-zinc-400 mt-1">Manage your crop health efficiently</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group">
                    <Search className="w-5 h-5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-brand-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search analysis..."
                        className="bg-dark-200 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all w-64"
                    />
                </div>

                <button className="relative p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full border-2 border-dark-100" />
                </button>

                <div className="h-8 w-px bg-white/10" />

                <button className="flex items-center gap-3 group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">Farmer John</p>
                        <p className="text-xs text-zinc-500">Premium Plan</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                        <User className="w-5 h-5 text-zinc-400" />
                    </div>
                </button>
            </div>
        </header>
    );
}
