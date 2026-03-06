"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Leaf, TrendingUp, AlertTriangle, ScanLine, Activity, Map as MapIcon, CloudRain } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    LineChart,
    Line,
    Legend
} from "recharts";
import WeatherWidget from "@/components/dashboard/WeatherWidget";

// Leaflet requires client-side only rendering due to window object references
const SatelliteMap = dynamic(() => import("@/components/dashboard/SatelliteMap"), {
    ssr: false,
    loading: () => (
        <div className="glass-card p-6 border-slate-200 bg-white h-[400px] flex flex-col justify-center items-center">
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-2" />
            <p className="text-slate-500 text-sm">Loading Satellite Data...</p>
        </div>
    )
});

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-20 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-500">Aggregating platform analytics...</p>
            </div>
        );
    }

    // Default empty state placeholders if no data
    const diseaseDist = stats?.diseaseDistribution?.length > 0 ? stats.diseaseDistribution : [{ name: 'No Data', value: 1, color: '#e2e8f0' }];
    const totalScans = stats?.totalAnalyzed || 0;
    const healthyPercent = totalScans > 0 ? Math.round((stats.healthyCount / totalScans) * 100) : 0;
    const diseasePercent = totalScans > 0 ? Math.round((stats.diseasedCount / totalScans) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Platform Overview</h1>
                <p className="text-slate-500">Comprehensive AI, geospatial, and weather intelligence for your farm.</p>
            </div>

            {/* Top row: Weather & Map */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1 h-full min-h-[400px]">
                    <WeatherWidget />
                </div>
                <div className="xl:col-span-2 h-full min-h-[400px]">
                    <SatelliteMap />
                </div>
            </div>

            <hr className="border-slate-200/60 my-6" />

            {/* Stats row */}
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Crop Health Diagnostics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total AI Scans", value: totalScans.toString(), trend: "Active", icon: ScanLine, color: "text-brand-500", bg: "bg-brand-50" },
                    { title: "Healthy Crops", value: `${healthyPercent}%`, trend: `${stats.healthyCount} scans`, icon: Leaf, color: "text-brand-500", bg: "bg-brand-50" },
                    { title: "Disease Detected", value: `${diseasePercent}%`, trend: `${stats.diseasedCount} scans`, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
                    { title: "Crop Types", value: stats?.cropInfection?.length || 0, trend: "Monitored", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 border-slate-200 bg-white relative overflow-hidden transition-all hover:shadow-md hover:border-brand-200 group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all">
                            <stat.icon className="w-24 h-24 text-slate-900" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={"text-slate-500 font-medium text-sm"}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1 relative z-10">{stat.value}</h3>
                        <p className="text-slate-500 text-sm relative z-10">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Crop-wise infection Chart */}
                <div className="lg:col-span-2 glass-card p-6 border-slate-200 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <ScanLine className="w-5 h-5 text-brand-500" />
                        Crop-Wise Infection Analysis
                    </h3>
                    <div className="h-[300px] w-full">
                        {stats?.cropInfection?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.cropInfection} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="healthy" name="Healthy" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="infected" name="Infected" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 border border-slate-200 bg-slate-50 rounded-xl">
                                No sufficient data to display chart.
                            </div>
                        )}
                    </div>
                </div>

                {/* Disease Distribution Pie Chart */}
                <div className="lg:col-span-1 glass-card p-6 border-slate-200 bg-white flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Disease Distribution
                    </h3>
                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={diseaseDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {diseaseDist.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#0f172a' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Custom Legend */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {diseaseDist.map((disease: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: disease.color }} />
                                <span className="text-xs text-slate-600 truncate">{disease.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
