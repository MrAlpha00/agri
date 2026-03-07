"use client";

import { Leaf, AlertTriangle, Syringe, Pill, ChevronLeft, Droplets, ArrowDownRight, Wind, ShieldAlert, Activity, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getRecommendations } from "@/lib/recommendation";

interface ResultPageProps {
    params: Promise<{ id: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
    const { id } = use(params);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResult() {
            try {


                const { data, error } = await supabase
                    .from('predictions')
                    .select('*')
                    .eq('id', id)
                    .single();

                console.log("Supabase response:", { data, error });

                if (error || !data) {
                    console.error("Error fetching prediction:", error);
                    setResult(null);
                } else {
                    setResult(data);
                }
            } catch (err) {
                console.error("Failed to load result", err);
                setResult(null);
            } finally {
                setLoading(false);
            }
        }

        fetchResult();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500">Loading analysis results...</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="max-w-6xl mx-auto py-32 flex flex-col items-center justify-center">
                <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Result not found</h1>
                <p className="text-slate-500 mb-8">We couldn't find the requested scan analysis.</p>
                <Link href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 transform">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const isUncertain = result.disease === "Model uncertain. Please upload a clearer image.";

    if (isUncertain) {
        return (
            <div className="max-w-6xl mx-auto py-32 flex flex-col items-center justify-center">
                <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Analysis Uncertain</h1>
                <p className="text-slate-500 mb-8 text-center max-w-md">Our AI model confidence was below the 75% threshold. Please upload a clearer, well-lit image of the affected plant area.</p>
                <div className="flex gap-4">
                    <Link href="/dashboard" className="px-6 py-3 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                        Return to Dashboard
                    </Link>
                    <Link href="/upload" className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 transform">
                        Try Another Scan
                    </Link>
                </div>
            </div>
        );
    }

    const recommendations = getRecommendations(result.crop, result.disease, result.severity);
    const confidencePercentage = (result.confidence * 100).toFixed(1);

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analysis Result</h1>
                    <p className="text-slate-500 text-sm mt-1">Scan ID: {result.id.substring(0, 8)}... | Crop: {result.crop}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Image & Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="aspect-[4/3] bg-slate-50 relative flex items-center justify-center group overflow-hidden border-b border-slate-200">
                            {result.image_url ? (
                                <img src={result.image_url} alt="Crop Scan" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full bg-brand-500/10 flex items-center justify-center blur-2xl absolute" />
                                    <Leaf className="w-16 h-16 text-brand-500/50" />
                                </div>
                            )}

                            {/* Scan overlay scanner effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-[scan_3s_ease-in-out_infinite]" />
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wide
                                    ${result.severity === 'High' ? 'bg-red-50 text-red-600 border-red-200' :
                                        result.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                            result.severity === 'None' ? 'bg-brand-50 text-brand-600 border-brand-200' :
                                                'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    {result.severity} Severity
                                </span>
                                <span className="text-slate-500 text-sm font-medium">
                                    {result.confidence > 1 ? result.confidence : confidencePercentage}% Confidence
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-1">{result.disease}</h2>
                            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">Crop identified: <span className="text-slate-700 font-medium">{result.crop}</span></p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="text-slate-500 text-xs uppercase font-semibold mb-1">Status</div>
                                    <div className="text-xl font-bold text-slate-900 tracking-tight">{result.severity === 'None' ? 'Healthy' : 'Infected'}</div>
                                </div>
                                <div className="bg-red-50 rounded-xl p-4 border border-red-100 relative overflow-hidden">
                                    <div className="absolute -right-2 -bottom-2 text-red-100">
                                        <ArrowDownRight className="w-16 h-16" />
                                    </div>
                                    <div className="text-red-700/80 text-xs uppercase font-semibold mb-1 relative z-10">Est. Yield Loss</div>
                                    <div className="text-2xl font-bold text-red-600 tracking-tight relative z-10">
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
                            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Symptoms Analysis</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-brand-200 transition-colors">
                            {recommendations.symptoms}
                        </p>
                    </div>

                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                                <Pill className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Treatment Plan</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 group hover:border-brand-200 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <Syringe className="w-5 h-5 text-brand-500" />
                                    <h3 className="text-slate-900 font-semibold">Recommended Pesticide</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">{recommendations.recommendedPesticide}</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 group hover:border-brand-200 transition-colors">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle2 className="w-5 h-5 text-brand-500" />
                                    <h3 className="text-slate-900 font-semibold">Action Steps</h3>
                                </div>
                                <ul className="space-y-3">
                                    {recommendations.treatmentSteps.map((step, idx) => (
                                        <li key={idx} className="flex gap-3 text-slate-600 items-start">
                                            <span className="text-brand-600 font-bold mt-0.5">{idx + 1}.</span>
                                            <span className="leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Prevention Tips</h2>
                        </div>
                        <ul className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-200 transition-colors">
                            {recommendations.preventionTips.map((tip, idx) => (
                                <li key={idx} className="flex gap-3 text-slate-600 items-start">
                                    <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-2" />
                                    <span className="leading-relaxed">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        <div>
                            <h4 className="text-blue-700 font-semibold mb-1">Important Notice</h4>
                            <p className="text-blue-600 text-sm leading-relaxed">
                                These recommendations are generated by an AI model and should be used as a guideline. Always consult with a local agricultural extension officer or agronomist before applying chemical treatments, especially near harvest.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
