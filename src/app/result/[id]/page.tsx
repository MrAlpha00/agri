import { Leaf, AlertTriangle, Syringe, Pill, ChevronLeft, Droplets, ArrowDownRight, Wind } from "lucide-react";
import Link from "next/link";

interface ResultPageProps {
    params: { id: string };
}

// Since we don't have a real DB yet, let's inject some realistic mock data
const mockResult = {
    id: "abc-123",
    diseaseName: "Early Blight",
    confidence: 94.2,
    pathogen: "Alternaria solani",
    severity: "High",
    affectedArea: "32%",
    yieldLoss: "15-20%",
    treatments: [
        {
            type: "Chemical",
            icon: Syringe,
            action: "Apply Chlorothalonil or Mancozeb based fungicides.",
            details: "Spray every 7-10 days. Ensure full leaf coverage. Do not apply when temperature exceeds 30°C."
        },
        {
            type: "Cultural",
            icon: Wind,
            action: "Improve air circulation and reduce humidity.",
            details: "Prune lower leaves to allow better airflow. Avoid overhead irrigation to keep foliage dry."
        },
        {
            type: "Organic",
            icon: Droplets,
            action: "Apply Copper Fungicide or Neem Oil.",
            details: "Use as a preventative measure. Repeat application after heavy rainfall."
        }
    ]
};

export default function ResultPage({ params }: ResultPageProps) {
    // In a real app, we would fetch data based on params.id

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analysis Result</h1>
                    <p className="text-zinc-400 text-sm mt-1">Scan ID: {params.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Image & Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="aspect-[4/3] bg-dark-200 relative flex items-center justify-center group overflow-hidden border-b border-white/5">
                            {/* Mock Image Placeholder */}
                            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-brand-500/10 flex items-center justify-center blur-2xl absolute" />
                                <Leaf className="w-16 h-16 text-brand-400/50" />
                            </div>

                            {/* Scan overlay scanner effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500/50 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-[scan_3s_ease-in-out_infinite]" />
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20 uppercase tracking-wide">
                                    {mockResult.severity} Severity
                                </span>
                                <span className="text-zinc-400 text-sm font-medium">
                                    {mockResult.confidence}% Confidence
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">{mockResult.diseaseName}</h2>
                            <p className="text-zinc-400 text-sm mb-6 pb-6 border-b border-white/5">Pathogen: <span className="text-zinc-300">{mockResult.pathogen}</span></p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-dark-200 rounded-xl p-4 border border-white/5">
                                    <div className="text-zinc-500 text-xs uppercase font-semibold mb-1">Affected Area</div>
                                    <div className="text-2xl font-bold text-white tracking-tight">{mockResult.affectedArea}</div>
                                </div>
                                <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10 relative overflow-hidden">
                                    <div className="absolute -right-2 -bottom-2 text-red-500/20">
                                        <ArrowDownRight className="w-16 h-16" />
                                    </div>
                                    <div className="text-red-400/80 text-xs uppercase font-semibold mb-1 relative z-10">Est. Yield Loss</div>
                                    <div className="text-2xl font-bold text-red-500 tracking-tight relative z-10">{mockResult.yieldLoss}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Treatments */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                                <Pill className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Treatment Recommendations</h2>
                        </div>

                        <div className="space-y-6">
                            {mockResult.treatments.map((treatment, idx) => (
                                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-dark-200 border border-white/5 hover:border-brand-500/20 transition-colors group">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-dark-100 border border-white/10 flex items-center justify-center group-hover:border-brand-500/30 group-hover:bg-brand-500/5 transition-colors">
                                            <treatment.icon className="w-5 h-5 text-zinc-400 group-hover:text-brand-400 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-semibold text-white tracking-wide">{treatment.type} Approach</span>
                                        </div>
                                        <p className="text-brand-100 font-medium mb-2">{treatment.action}</p>
                                        <p className="text-zinc-400 text-sm leading-relaxed">{treatment.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                        <div>
                            <h4 className="text-blue-400 font-semibold mb-1">Important Notice</h4>
                            <p className="text-blue-400/80 text-sm leading-relaxed">
                                These recommendations are generated by an AI model and should be used as a guideline. Always consult with a local agricultural extension officer or agronomist before applying chemical treatments, especially near harvest.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
