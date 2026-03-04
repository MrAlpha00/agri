"use client";

import { Leaf, AlertTriangle, Syringe, Pill, ChevronLeft, Droplets, ArrowDownRight, Wind, ShieldAlert, Activity, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { getRecommendations } from "@/lib/recommendation";

interface ResultPageProps {
    params: { id: string };
}

export default function ResultPage({ params }: ResultPageProps) {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResult() {
            try {
                // If ID is simple string (mock generation locally without DB access)
                if (params.id.length < 15) {
                    console.log("Using local mock display because ID is short:", params.id);
                    setResult({
                        id: params.id,
                        disease: "Sample Disease (Mock)",
                        confidence: 0.95,
                        severity: "High",
                        crop: "Tomato",
                        image_url: null,
                    });
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('predictions')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error || !data) {
                    console.error("Error fetching prediction:", error);
                    notFound();
                } else {
                    setResult(data);
                }
            } catch (err) {
                console.error("Failed to load result", err);
            } finally {
                setLoading(false);
            }
        }

        fetchResult();
    }, [params.id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
                <p className="text-zinc-400">Loading analysis results...</p>
            </div>
        );
    }

    if (!result) {
        return notFound();
    }

    const recommendations = getRecommendations(result.crop, result.disease, result.severity);
    const confidencePercentage = (result.confidence * 100).toFixed(1);

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Analysis Result</h1>
                    <p className="text-zinc-400 text-sm mt-1">Scan ID: {result.id.substring(0, 8)}... | Crop: {result.crop}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Image & Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="aspect-[4/3] bg-dark-200 relative flex items-center justify-center group overflow-hidden border-b border-white/5">
                            {result.image_url ? (
                                <img src={result.image_url} alt="Crop Scan" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full bg-brand-500/10 flex items-center justify-center blur-2xl absolute" />
                                    <Leaf className="w-16 h-16 text-brand-400/50" />
                                </div>
                            )}

                            {/* Scan overlay scanner effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500/50 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-[scan_3s_ease-in-out_infinite]" />
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wide
                                    ${result.severity === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        result.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            result.severity === 'None' ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' :
                                                'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                    {result.severity} Severity
                                </span>
                                <span className="text-zinc-400 text-sm font-medium">
                                    {result.confidence > 1 ? result.confidence : confidencePercentage}% Confidence
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">{result.disease}</h2>
                            <p className="text-zinc-400 text-sm mb-6 pb-6 border-b border-white/5">Crop identified: <span className="text-zinc-300">{result.crop}</span></p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-dark-200 rounded-xl p-4 border border-white/5">
                                    <div className="text-zinc-500 text-xs uppercase font-semibold mb-1">Status</div>
                                    <div className="text-xl font-bold text-white tracking-tight">{result.severity === 'None' ? 'Healthy' : 'Infected'}</div>
                                </div>
                                <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10 relative overflow-hidden">
                                    <div className="absolute -right-2 -bottom-2 text-red-500/20">
                                        <ArrowDownRight className="w-16 h-16" />
                                    </div>
                                    <div className="text-red-400/80 text-xs uppercase font-semibold mb-1 relative z-10">Est. Yield Loss</div>
                                    <div className="text-2xl font-bold text-red-500 tracking-tight relative z-10">
                                        {recommendations.estimatedYieldLoss}
                                    </div>
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
                                <Activity className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Symptoms Analysis</h2>
                        </div>
                        <p className="text-zinc-300 leading-relaxed bg-dark-200 p-5 rounded-xl border border-white/5 hover:border-brand-500/20 transition-colors">
                            {recommendations.symptoms}
                        </p>
                    </div>

                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                                <Pill className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Treatment Plan</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl bg-dark-200 border border-white/5 group hover:border-brand-500/20 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <Syringe className="w-5 h-5 text-brand-400" />
                                    <h3 className="text-white font-semibold">Recommended Pesticide</h3>
                                </div>
                                <p className="text-zinc-400 leading-relaxed">{recommendations.recommendedPesticide}</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-dark-200 border border-white/5 group hover:border-brand-500/20 transition-colors">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle2 className="w-5 h-5 text-brand-400" />
                                    <h3 className="text-white font-semibold">Action Steps</h3>
                                </div>
                                <ul className="space-y-3">
                                    {recommendations.treatmentSteps.map((step, idx) => (
                                        <li key={idx} className="flex gap-3 text-zinc-400 items-start">
                                            <span className="text-brand-500 font-bold mt-0.5">{idx + 1}.</span>
                                            <span className="leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Prevention Tips</h2>
                        </div>
                        <ul className="space-y-3 p-5 rounded-2xl bg-dark-200 border border-white/5 hover:border-brand-500/20 transition-colors">
                            {recommendations.preventionTips.map((tip, idx) => (
                                <li key={idx} className="flex gap-3 text-zinc-400 items-start">
                                    <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-2" />
                                    <span className="leading-relaxed">{tip}</span>
                                </li>
                            ))}
                        </ul>
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
