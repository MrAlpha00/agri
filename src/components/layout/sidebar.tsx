"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, UploadCloud, Database, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
    { name: "Upload", href: "/upload", icon: UploadCloud },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Dataset", href: "/dataset", icon: Database },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={cn(
                "relative flex flex-col h-full flex-shrink-0 z-20 bg-white/80 backdrop-blur-md border-r border-slate-200 shadow-sm transition-all duration-300",
                isCollapsed ? "w-[80px]" : "w-[260px]"
            )}
        >
            <div className={cn("p-6 flex items-center h-20", isCollapsed ? "justify-center px-0" : "gap-3")}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
                    <Leaf className="w-6 h-6 text-white" />
                </div>
                {!isCollapsed && (
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 whitespace-nowrap">
                        AgriScan AI
                    </span>
                )}
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-200 hover:bg-brand-50 transition-all z-30"
            >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/" && item.href !== "/upload");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={isCollapsed ? item.name : undefined}
                            className={cn(
                                "flex items-center rounded-xl transition-all duration-300 group overflow-hidden",
                                isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                                isActive
                                    ? "bg-brand-50 text-brand-600 font-medium border border-brand-100 shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-brand-500" : "text-slate-400 group-hover:text-brand-500")} />
                            {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    title={isCollapsed ? "Logout" : undefined}
                    className={cn(
                        "flex items-center rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent w-full overflow-hidden",
                        isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                    )}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </div>
    );
}
