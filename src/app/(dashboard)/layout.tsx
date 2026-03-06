"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />
                <Header />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
