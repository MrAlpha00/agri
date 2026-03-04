import { LayoutDashboard } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-dark-200 border border-white/5 flex items-center justify-center">
                    <LayoutDashboard className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                    <div className="h-8 w-64 bg-dark-200 rounded-md mb-2"></div>
                    <div className="h-4 w-48 bg-dark-200 rounded-md"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card p-6 h-32 flex flex-col justify-between">
                        <div className="h-4 w-24 bg-dark-200 rounded-md"></div>
                        <div className="h-10 w-16 bg-dark-200 rounded-md"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 h-[400px]">
                    <div className="h-6 w-48 bg-dark-200 rounded-md mb-8"></div>
                    <div className="h-[300px] w-full bg-dark-200/50 rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                </div>
                <div className="glass-card p-6 h-[400px]">
                    <div className="h-6 w-48 bg-dark-200 rounded-md mb-8"></div>
                    <div className="h-[300px] w-full bg-dark-200/50 rounded-xl rounded-full relative overflow-hidden flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full border-8 border-dark-200"></div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 h-[400px]">
                <div className="h-6 w-48 bg-dark-200 rounded-md mb-8"></div>
                <div className="h-[300px] w-full bg-dark-200/50 rounded-xl"></div>
            </div>
        </div>
    );
}
