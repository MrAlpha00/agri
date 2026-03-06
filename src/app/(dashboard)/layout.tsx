"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop persistent sidebar */}
            <div className="hidden md:block h-full flex-shrink-0 z-20">
                <Sidebar />
            </div>

            {/* Mobile drawer sidebar */}
            <div className="md:hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isDrawer={true}
                />
            </div>

            <div className="flex-1 flex flex-col relative overflow-hidden w-full">
                {/* Background ambient glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
