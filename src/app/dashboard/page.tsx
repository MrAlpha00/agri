"use client";

import { Leaf, TrendingUp, AlertTriangle, ScanLine } from "lucide-react";
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
    Pie
} from "recharts";

const scanData = [
    { name: 'Mon', scans: 120 },
    { name: 'Tue', scans: 154 },
    { name: 'Wed', scans: 180 },
    { name: 'Thu', scans: 145 },
    { name: 'Fri', scans: 210 },
    { name: 'Sat', scans: 250 },
    { name: 'Sun', scans: 190 },
];

const diseaseDist = [
    { name: 'Healthy', value: 400, color: '#10b981' }, // brand-600
    { name: 'Early Blight', value: 300, color: '#f59e0b' },
    { name: 'Late Blight', value: 150, color: '#ef4444' },
    { name: 'Leaf Rust', value: 120, color: '#8b5cf6' },
    { name: 'Other', value: 80, color: '#6b7280' },
];

export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Analytics Overview</h1>
                <p className="text-zinc-400">Track crop health trends and AI scanning performance.</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Total Scans", value: "1,245", trend: "+12.5%", icon: ScanLine, color: "text-brand-400", bg: "bg-brand-500/10" },
                    { title: "Healthy Crops", value: "32%", trend: "+2.1%", icon: Leaf, color: "text-brand-400", bg: "bg-brand-500/10" },
                    { title: "Disease Detected", value: "48%", trend: "-5.4%", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { title: "Yield Saved (Est.)", value: "1.2k Tons", trend: "+18%", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={stat.trend.startsWith("+") ? "text-brand-400 font-medium text-sm" : "text-amber-400 font-medium text-sm"}>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-zinc-400 text-sm">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Scans over time Chart */}
                <div className="lg:col-span-2 glass-card p-6 border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-400" />
                        Scans Over Time
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={scanData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#121212', borderColor: '#27272a', color: '#fff' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Area type="monotone" dataKey="scans" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                            </AreaChart>
                        </ResponsiveContainer>
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
                                    {diseaseDist.map((entry, index) => (
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
                        {diseaseDist.map((disease, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: disease.color }} />
                                <span className="text-xs text-zinc-400 truncate">{disease.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
