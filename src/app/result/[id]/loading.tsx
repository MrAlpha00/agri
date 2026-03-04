export default function ResultLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
            <div className="text-center mb-10 mt-4 flex flex-col items-center">
                <div className="h-8 w-64 bg-slate-200 rounded-md mb-4"></div>
                <div className="h-4 w-96 bg-slate-100 rounded-md mb-8"></div>
                <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Skeleton */}
                <div className="glass-card p-2 flex flex-col h-full min-h-[400px]">
                    <div className="w-full h-full bg-slate-50 rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                </div>

                {/* Data Skeleton */}
                <div className="space-y-6">
                    <div className="glass-card p-8">
                        <div className="h-6 w-48 bg-slate-200 rounded-md mb-6"></div>
                        <div className="grid grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 w-20 bg-slate-100 rounded-md"></div>
                                    <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 min-h-[250px]">
                        <div className="h-6 w-48 bg-slate-200 rounded-md mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-slate-100 rounded-md"></div>
                            <div className="h-4 w-5/6 bg-slate-100 rounded-md"></div>
                            <div className="h-4 w-4/6 bg-slate-100 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
