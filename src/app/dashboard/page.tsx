"use client";

import { useEffect, useState } from "react";
import { Leaf, TrendingUp, AlertTriangle, ScanLine, Activity } from "lucide-react";
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
                <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
                <p className="text-zinc-400">Aggregating analytics data...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="max-w-7xl mx-auto py-20 text-center text-zinc-400">
                Failed to load analytics data.
            </div>
        );
    }

    // Default empty state placeholders if no data
    const diseaseDist = stats?.diseaseDistribution?.length > 0 ? stats.diseaseDistribution : [{ name: 'No Data', value: 1, color: '#3f3f46' }];
    const totalScans = stats?.totalAnalyzed || 0;
    const healthyPercent = totalScans > 0 ? Math.round((stats.healthyCount / totalScans) * 100) : 0;
    const diseasePercent = totalScans > 0 ? Math.round((stats.diseasedCount / totalScans) * 100) : 0;
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Analytics Overview</h1>
                <p className="text-zinc-400">Track crop health trends and AI scanning performance.</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Scans", value: totalScans.toString(), trend: "Active", icon: ScanLine, color: "text-brand-400", bg: "bg-brand-500/10" },
                    { title: "Healthy Crops", value: `${healthyPercent}%`, trend: `${stats.healthyCount} scans`, icon: Leaf, color: "text-brand-400", bg: "bg-brand-500/10" },
                    { title: "Disease Detected", value: `${diseasePercent}%`, trend: `${stats.diseasedCount} scans`, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { title: "Crop Types", value: stats?.cropInfection?.length || 0, trend: "Monitored", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10" }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <stat.icon className="w-24 h-24" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={"text-zinc-500 font-medium text-sm"}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 relative z-10">{stat.value}</h3>
                        <p className="text-zinc-400 text-sm relative z-10">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Crop-wise infection Chart */}
                <div className="lg:col-span-2 glass-card p-6 border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <ScanLine className="w-5 h-5 text-brand-400" />
                        Crop-Wise Infection Analysis
                    </h3>
                    <div className="h-[300px] w-full">
                        {stats?.cropInfection?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.cropInfection} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff05' }}
                                        contentStyle={{ backgroundColor: '#121212', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="healthy" name="Healthy" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="infected" name="Infected" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500 border border-white/5 bg-dark-200/50 rounded-xl rounded-xl">
                                No sufficient data to display chart.
                            </div>
                        )}
                    </div>
                </div>

                {/* Disease Distribution Pie Chart */}
                <div className="lg:col-span-1 glass-card p-6 border-white/5 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
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
                                    contentStyle={{ backgroundColor: '#121212', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Custom Legend */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {diseaseDist.map((disease: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: disease.color }} />
                                <span className="text-xs text-zinc-400 truncate">{disease.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Yield Loss Line Chart */}
                <div className="lg:col-span-full glass-card p-6 border-white/5 mt-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        Average Yield Loss Estimates (Over Time)
                    </h3>
                    <div className="h-[300px] w-full">
                        {stats?.averageYieldLossOverTime?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.averageYieldLossOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                    <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false}
                                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#121212', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                                        labelFormatter={(label) => `Date: ${label}`}
                                        formatter={(val) => [`${val}%`, 'Avg Yield Loss']}
                                    />
                                    <Line type="monotone" dataKey="avgLoss" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6, fill: '#60a5fa' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500 border border-white/5 bg-dark-200/50 rounded-xl">
                                No yield loss data to display yet. Upload more scans to generate trends.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
