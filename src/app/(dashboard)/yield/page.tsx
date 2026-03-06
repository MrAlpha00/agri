"use client";

import { useState } from "react";
import { TrendingUp, Scale, Thermometer, Droplets, MapPin, Calculator, Beaker, CheckCircle, Leaf, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";

interface PredictionResult {
    yieldPerAcre: number;
    totalYield: number;
    riskFactors: string[];
    suggestions: string[];
}

export default function YieldPredictionPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        cropType: "Wheat",
        soilType: "Loamy",
        rainfall: 800,
        temperature: 24,
        fertilizer: 120, // kg per acre
        acreage: 10
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate AI model inference processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple Heuristic ML Simulation
        // Base yields (kg/acre approx)
        const baseYields: Record<string, number> = {
            "Wheat": 1200,
            "Rice": 1500,
            "Corn": 1800,
            "Soybean": 900
        };

        let estYield = baseYields[formData.cropType] || 1000;
        let risks: string[] = [];
        let tips: string[] = [];

        // Temperature adjustments
        if (formData.temperature > 35) {
            estYield *= 0.8;
            risks.push("High temperature heat stress");
            tips.push("Apply heat-resistant varieties or increase irrigation frequency.");
        } else if (formData.temperature < 15) {
            estYield *= 0.85;
            risks.push("Low temperature risks for early growth");
            tips.push("Consider delayed sowing or row covers to raise soil temp.");
        } else {
            estYield *= 1.05; // Ideal
        }

        // Rain adjustments
        if (formData.rainfall < 400) {
            estYield *= 0.7;
            risks.push("Severe drought risk");
            tips.push("Implement drip irrigation to maximize water efficiency.");
        } else if (formData.rainfall > 1200) {
            estYield *= 0.8;
            risks.push("Waterlogging and root rot risk");
            tips.push("Improve field drainage to prevent anaerobic soil conditions.");
        }

        // Soil adjustments
        if (formData.soilType === "Sandy" && formData.rainfall < 600) {
            estYield *= 0.8;
            risks.push("Poor water retention in sandy soil");
            tips.push("Add organic matter/compost to improve soil holding capacity.");
        } else if (formData.soilType === "Loamy") {
            estYield *= 1.1; // Ideal
        }

        // Fertilizer limit check
        if (formData.fertilizer > 200) {
            estYield *= 0.95; // Toxicity
            risks.push("Potential fertilizer toxicity/burn");
            tips.push("Reduce nitrogen application. More is not always better.");
        } else if (formData.fertilizer < 50) {
            estYield *= 0.75;
            risks.push("Nutrient deficiency (Nitrogen/Phosphorus)");
            tips.push("Increase balanced NPK application based on soil test.");
        } else {
            estYield += (formData.fertilizer * 1.5); // Boost
        }

        setResult({
            yieldPerAcre: Math.round(estYield),
            totalYield: Math.round(estYield * formData.acreage),
            riskFactors: risks.length > 0 ? risks : ["None detected. Conditions are optimal."],
            suggestions: tips.length > 0 ? tips : ["Continue current agricultural practices."]
        });

        setLoading(false);
    };

    // Chart data for comparing current prediction vs hypothetical ideal
    const chartData = result ? [
        {
            name: 'Current Estimate',
            yield: result.yieldPerAcre,
            color: '#3b82f6'
        },
        {
            name: 'Ideal Potential',
            yield: Math.round(result.yieldPerAcre * 1.3), // Simulated max potential
            color: '#10b981'
        }
    ] : [];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Crop Yield Prediction AI</h1>
                <p className="text-slate-500 max-w-2xl">Use our agronomic ML model to forecast expected harvest volume and identify risk factors before planting.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-5 glass-card p-6 border-slate-200 bg-white">
                    <div className="flex items-center gap-2 mb-6">
                        <Calculator className="w-5 h-5 text-brand-500" />
                        <h2 className="text-lg font-semibold text-slate-900">Farm Parameters</h2>
                    </div>

                    <form onSubmit={handlePredict} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Crop Type</label>
                                <div className="relative">
                                    <Leaf className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <select
                                        name="cropType"
                                        value={formData.cropType}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    >
                                        {["Wheat", "Rice", "Corn", "Soybean"].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Soil Type</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <select
                                        name="soilType"
                                        value={formData.soilType}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    >
                                        {["Loamy", "Clay", "Sandy", "Peat"].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Annual Rainfall (mm)</label>
                            <div className="relative">
                                <Droplets className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="rainfall"
                                    required
                                    min="0"
                                    value={formData.rainfall}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Avg Temperature (°C)</label>
                            <div className="relative">
                                <Thermometer className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="temperature"
                                    required
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Fertilizer (kg/acre)</label>
                                <div className="relative">
                                    <Beaker className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        name="fertilizer"
                                        required
                                        min="0"
                                        value={formData.fertilizer}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Farm Size (Acres)</label>
                                <div className="relative">
                                    <Scale className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        name="acreage"
                                        required
                                        min="1"
                                        value={formData.acreage}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Running AI Model...
                                </>
                            ) : (
                                "Predict Yield"
                            )}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Top Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-6 border-slate-200 bg-white relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
                                        <TrendingUp className="w-32 h-32 text-slate-900" />
                                    </div>
                                    <h4 className="text-slate-500 text-sm font-medium mb-1">Estimated Yield (Per Acre)</h4>
                                    <div className="text-4xl font-bold text-slate-900 mb-2">
                                        {result.yieldPerAcre.toLocaleString()} <span className="text-base font-normal text-slate-500">kg/acre</span>
                                    </div>
                                </div>
                                <div className="glass-card p-6 border-slate-200 bg-brand-50 relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
                                        <Scale className="w-32 h-32 text-brand-900" />
                                    </div>
                                    <h4 className="text-brand-700 text-sm font-medium mb-1">Total Expected Harvest</h4>
                                    <div className="text-4xl font-bold text-brand-900 mb-2">
                                        {(result.totalYield / 1000).toFixed(1)} <span className="text-base font-normal text-brand-700">Tons</span>
                                    </div>
                                    <p className="text-xs text-brand-600 font-medium">For {formData.acreage} acres</p>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="glass-card p-6 border-slate-200 bg-white">
                                <h3 className="text-lg font-semibold text-slate-900 mb-6">Yield Potential Comparison</h3>
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                            <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px' }}
                                                formatter={(val) => [`${val} kg/acre`, 'Yield Estimate']}
                                            />
                                            <Bar dataKey="yield" radius={[0, 4, 4, 0]} barSize={32}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* AI Insights */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-6 border-rose-100 bg-rose-50/50">
                                    <h4 className="text-sm font-semibold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" /> Risk Factors
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.riskFactors.map((risk, idx) => (
                                            <li key={idx} className="text-sm text-rose-700 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                                {risk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="glass-card p-6 border-emerald-100 bg-emerald-50/50">
                                    <h4 className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> AI Suggestions
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.suggestions.map((tip, idx) => (
                                            <li key={idx} className="text-sm text-emerald-700 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass-card border-slate-200 bg-white/50 border-dashed">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <Calculator className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Awaiting Parameters</h3>
                            <p className="text-slate-500 max-w-sm">Enter your farm specifications on the left and run the AI model to forecast your yield and receive actionable agronomic insights.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
