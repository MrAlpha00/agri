"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, UploadCloud, Database, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Upload", href: "/", icon: UploadCloud },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Dataset", href: "/dataset", icon: Database },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r border-white/5 bg-dark-100 flex flex-col h-full flex-shrink-0 relative z-20">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    AgriScan AI
                </span>
            </div>

            <nav className="flex-1 px-4 mt-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-brand-500/10 text-brand-400 font-medium border border-brand-500/20"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-brand-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
