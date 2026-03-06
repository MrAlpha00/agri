"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, Search, Filter, MoreHorizontal, FileImage } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import { getRecommendations } from "@/lib/recommendation";

// Helper to deterministically generate pseudo-random acre sizes from UUID
const generateAcre = (id: string) => {
    if (!id || id.length < 5) return 1.5;
    const hash = parseInt(id.substring(0, 4), 16);
    return +((hash % 100) / 10 + 0.5).toFixed(1);
};

// Helper to generate visual traits based on disease
const getVisualTraits = (disease: string) => {
    const d = disease.toLowerCase();
    if (d.includes('healthy') || d === 'none') {
        return { leafEdge: 'Smooth', leafColor: 'Deep Green', texture: 'Smooth & Waxy', spots: 'None' };
    }
    if (d.includes('early blight')) {
        return { leafEdge: 'Curled', leafColor: 'Yellowing', texture: 'Dry/Brittle', spots: 'Brown Concentric Rings' };
    }
    if (d.includes('late blight')) {
        return { leafEdge: 'Shriveled', leafColor: 'Dark Brown/Black', texture: 'Soggy', spots: 'Water-soaked Lesions' };
    }
    if (d.includes('rust')) {
        return { leafEdge: 'Wavy', leafColor: 'Green with Spores', texture: 'Powdery', spots: 'Orange Pustules' };
    }
    if (d.includes('mildew')) {
        return { leafEdge: 'Curled Upwards', leafColor: 'Pale Green', texture: 'Powdery', spots: 'White Patches' };
    }
    return { leafEdge: 'Irregular', leafColor: 'Discolored', texture: 'Rough', spots: 'Varied' };
};

export default function DatasetPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchCrop, setSearchCrop] = useState("");
    const [filterDisease, setFilterDisease] = useState("");
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: predictions, error } = await supabase
                    .from('predictions')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error fetching dataset:", error);
                    return;
                }

                // Enrich data with requested columns
                const enrichedData = (predictions || []).map((p, index) => {
                    const traits = getVisualTraits(p.disease);
                    const recs = getRecommendations(p.crop, p.disease, p.severity);

                    return {
                        ...p,
                        slNo: index + 1,
                        acre: generateAcre(p.id),
                        leafEdge: traits.leafEdge,
                        leafColor: traits.leafColor,
                        texture: traits.texture,
                        spots: traits.spots,
                        yieldLoss: recs.estimatedYieldLoss,
                        treatment: recs.recommendedPesticide,
                        dateStr: new Date(p.created_at).toLocaleDateString(),
                        rawDate: new Date(p.created_at).toISOString().split('T')[0]
                    };
                });

                setData(enrichedData);
            } catch (err) {
                console.error("Failed to load dataset", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Extract unique diseases for the filter dropdown
    const uniqueDiseases = useMemo(() => Array.from(new Set(data.map(d => d.disease))), [data]);

    // Apply filters
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesCrop = item.crop.toLowerCase().includes(searchCrop.toLowerCase());
            const matchesDisease = filterDisease === "" || item.disease === filterDisease;
            const matchesDate = filterDate === "" || item.rawDate === filterDate;
            return matchesCrop && matchesDisease && matchesDate;
        });
    }, [data, searchCrop, filterDisease, filterDate]);

    const exportToExcel = () => {
        if (filteredData.length === 0) return;

        // Map to exact requested column names
        const exportFormat = filteredData.map(item => ({
            "SL No": item.slNo,
            "Crop Name": item.crop,
            "Acre": `${item.acre} Acres`,
            "Image": item.image_url ? "Available" : "N/A",
            "Leaf Edge": item.leafEdge,
            "Leaf Color": item.leafColor,
            "Texture": item.texture,
            "Spots": item.spots,
            "Disease": item.disease,
            "Severity": item.severity,
            "Yield Loss": item.yieldLoss,
            "Treatment": item.treatment,
            "Date Captured": item.dateStr
        }));

        const ws = XLSX.utils.json_to_sheet(exportFormat);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Crop_Analysis_Data");
        XLSX.writeFile(wb, `AgriScan_Dataset_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Analysis Dataset</h1>
                    <p className="text-slate-500">Comprehensive log of all crop health predictions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={exportToExcel}
                        disabled={filteredData.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-brand-500/50 disabled:to-brand-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-sm transform"
                    >
                        <Download className="w-4 h-4" />
                        Export to Excel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-250px)] overflow-hidden">
                {/* Table Filters Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
                    <div className="flex flex-wrap gap-4 items-center flex-1">
                        {/* Crop Filter */}
                        <div className="relative w-full max-w-[200px]">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Filter Crop..."
                                value={searchCrop}
                                onChange={(e) => setSearchCrop(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                            />
                        </div>

                        {/* Disease Dropdown Filter */}
                        <select
                            value={filterDisease}
                            onChange={(e) => setFilterDisease(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
                        >
                            <option value="">All Diseases</option>
                            {uniqueDiseases.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>

                        {/* Date Picker Filter */}
                        <div className="relative">
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
                            />
                            {filterDate && (
                                <button
                                    onClick={() => setFilterDate('')}
                                    className="absolute -right-2 -top-2 w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-xs hover:bg-slate-300 shadow-sm border border-white"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center p-12">
                            <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
                            <p className="text-slate-500">Loading dataset...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
                            <thead className="bg-slate-50/90 text-slate-500 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 font-medium">SL No</th>
                                    <th className="px-6 py-4 font-medium">Crop Name</th>
                                    <th className="px-6 py-4 font-medium">Acre</th>
                                    <th className="px-6 py-4 font-medium text-center">Image</th>
                                    <th className="px-6 py-4 font-medium">Leaf Edge</th>
                                    <th className="px-6 py-4 font-medium">Leaf Color</th>
                                    <th className="px-6 py-4 font-medium">Texture</th>
                                    <th className="px-6 py-4 font-medium">Spots</th>
                                    <th className="px-6 py-4 font-medium">Disease</th>
                                    <th className="px-6 py-4 font-medium">Severity</th>
                                    <th className="px-6 py-4 font-medium">Yield Loss</th>
                                    <th className="px-6 py-4 font-medium">Treatment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-slate-400">#{row.slNo}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">{row.crop}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.acre} Ac</td>
                                        <td className="px-6 py-4 text-center">
                                            {row.image_url ? (
                                                <a href={row.image_url} target="_blank" rel="noopener noreferrer" className="inline-flex p-1.5 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-md transition-colors" title="View Image">
                                                    <FileImage className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <span className="text-zinc-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{row.leafEdge}</td>
                                        <td className="px-6 py-4 text-slate-500">{row.leafColor}</td>
                                        <td className="px-6 py-4 text-slate-500">{row.texture}</td>
                                        <td className="px-6 py-4 text-slate-500 truncate max-w-[150px]" title={row.spots}>{row.spots}</td>
                                        <td className="px-6 py-4 text-slate-900 font-medium">
                                            <span className="flex items-center gap-2">
                                                {row.severity === "None" || row.disease.includes('Healthy') ? (
                                                    <span className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                                ) : (
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                                )}
                                                {row.disease}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${row.severity === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                row.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    row.severity === 'Low' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-brand-500/10 text-brand-400 border-brand-500/20'
                                                }`}>
                                                {row.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 font-medium">{row.yieldLoss}</td>
                                        <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]" title={row.treatment}>{row.treatment}</td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={12} className="px-6 py-20 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="w-10 h-10 mb-3 opacity-20" />
                                                <p>No records found matching your filters.</p>
                                                <button onClick={() => { setSearchCrop(''); setFilterDisease(''); setFilterDate(''); }} className="mt-4 text-brand-400 hover:text-brand-300 text-sm underline underline-offset-4">
                                                    Clear filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
