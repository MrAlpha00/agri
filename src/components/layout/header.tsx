"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User, Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname();

    // Format pathname for header title
    const title = pathname === "/" || pathname === "/upload"
        ? "Upload & Analyze"
        : pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1);

    return (
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
                    <p className="hidden md:block text-sm text-slate-500 mt-1">Manage your crop health efficiently</p>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <div className="relative group hidden sm:block">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-brand-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search analysis..."
                        className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all w-48 md:w-64 shadow-sm"
                    />
                </div>

                <div className="sm:hidden block">
                    <button className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                <button className="relative p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full border-2 border-white" />
                </button>

                <div className="h-8 w-px bg-slate-200 hidden md:block" />

                <button className="flex items-center gap-3 group">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-900 group-hover:text-brand-600 transition-colors">Farmer John</p>
                        <p className="text-xs text-slate-500">Premium Plan</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <User className="w-5 h-5 text-slate-400" />
                    </div>
                </button>
            </div>
        </header>
    );
}
