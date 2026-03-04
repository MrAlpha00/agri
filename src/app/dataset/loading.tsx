import { Database } from "lucide-react";

export default function DatasetLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-dark-200 border border-white/5 flex items-center justify-center hidden sm:flex">
                        <Database className="w-6 h-6 text-zinc-600" />
                    </div>
                    <div>
                        <div className="h-8 w-56 bg-dark-200 rounded-md mb-2"></div>
                        <div className="h-4 w-64 bg-dark-200 rounded-md"></div>
                    </div>
                </div>
                <div className="h-10 w-36 bg-dark-200 rounded-lg"></div>
            </div>

            <div className="glass-card flex flex-col h-[calc(100vh-250px)] p-6">
                <div className="flex gap-4 mb-8">
                    <div className="h-10 w-[200px] bg-dark-200 rounded-lg"></div>
                    <div className="h-10 w-[150px] bg-dark-200 rounded-lg"></div>
                    <div className="h-10 w-[150px] bg-dark-200 rounded-lg"></div>
                </div>

                <div className="space-y-4">
                    {/* Header skeleton */}
                    <div className="h-12 w-full bg-dark-200/80 rounded-lg"></div>

                    {/* Rows */}
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-16 w-full bg-dark-200/30 rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
