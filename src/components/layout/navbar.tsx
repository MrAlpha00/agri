"use client";

import Link from "next/link";
import { Leaf, Menu } from "lucide-react";

interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        AgriScan AI
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Upload</Link>
                    <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Dashboard</Link>
                    <Link href="/dataset" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Dataset</Link>
                    <Link href="/settings" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Settings</Link>
                </nav>

                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -mr-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
