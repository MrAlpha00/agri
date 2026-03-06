"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, UploadCloud, Database, Settings, LogOut, ChevronLeft, ChevronRight, X, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
    { name: "Upload", href: "/", icon: UploadCloud },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Yield Predictor", href: "/yield", icon: TrendingUp },
    { name: "Dataset", href: "/dataset", icon: Database },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isDrawer?: boolean;
}

export function Sidebar({ isOpen = false, onClose, isDrawer = false }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isDrawer && isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isDrawer, isOpen]);

    // Close drawer on route change
    useEffect(() => {
        if (isDrawer && isOpen && onClose) {
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const sidebarClasses = cn(
        "flex flex-col h-full flex-shrink-0 z-50 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-2xl md:shadow-sm transition-all duration-300",
        isDrawer ? "fixed top-0 left-0 h-[100dvh]" : "relative",
        isDrawer && !isOpen ? "-translate-x-full" : "translate-x-0",
        isCollapsed && !isDrawer ? "w-[80px]" : "w-[280px]"
    );

    return (
        <>
            {/* Overlay for drawer mode */}
            {isDrawer && (
                <div
                    className={cn(
                        "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300",
                        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={onClose}
                />
            )}

            <div className={sidebarClasses}>
                <div className={cn("p-6 flex items-center h-20", isCollapsed && !isDrawer ? "justify-center px-0" : "justify-between")}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        {(!isCollapsed || isDrawer) && (
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 whitespace-nowrap">
                                AgriScan AI
                            </span>
                        )}
                    </div>

                    {/* Close button for drawer mode */}
                    {isDrawer && onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {!isDrawer && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-brand-500 hover:border-brand-200 hover:bg-brand-50 transition-all z-30 hidden md:flex"
                    >
                        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    </button>
                )}

                <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed && !isDrawer ? item.name : undefined}
                                className={cn(
                                    "flex items-center rounded-xl transition-all duration-300 group overflow-hidden",
                                    isCollapsed && !isDrawer ? "justify-center p-3" : "gap-3 px-4 py-3",
                                    isActive
                                        ? "bg-brand-50 text-brand-600 font-medium border border-brand-100 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-brand-500" : "text-slate-400 group-hover:text-brand-500")} />
                                {(!isCollapsed || isDrawer) && <span className="whitespace-nowrap">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        title={isCollapsed && !isDrawer ? "Logout" : undefined}
                        className={cn(
                            "flex items-center rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent w-full overflow-hidden",
                            isCollapsed && !isDrawer ? "justify-center p-3" : "gap-3 px-4 py-3"
                        )}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {(!isCollapsed || isDrawer) && <span className="whitespace-nowrap">Logout</span>}
                    </button>
                </div>
            </div>
        </>
    );
}
