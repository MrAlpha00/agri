"use client";

import { useState } from "react";
import { Download, Search, Filter, MoreHorizontal } from "lucide-react";
import * as XLSX from "xlsx";

const initialData = [
    { id: "S-1042", date: "2026-03-04", crop: "Tomato", disease: "Early Blight", confidence: 94, severity: "High" },
    { id: "S-1041", date: "2026-03-03", crop: "Potato", disease: "Late Blight", confidence: 88, severity: "Medium" },
    { id: "S-1040", date: "2026-03-02", crop: "Wheat", disease: "Leaf Rust", confidence: 91, severity: "High" },
    { id: "S-1039", date: "2026-03-01", crop: "Corn", disease: "Healthy", confidence: 98, severity: "None" },
    { id: "S-1038", date: "2026-02-28", crop: "Tomato", disease: "Healthy", confidence: 99, severity: "None" },
    { id: "S-1037", date: "2026-02-27", crop: "Potato", disease: "Early Blight", confidence: 85, severity: "Low" },
];

export default function DatasetPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = initialData.filter(item =>
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CropData");
        XLSX.writeFile(wb, "AgriScan_Dataset.xlsx");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Analysis Dataset</h1>
                    <p className="text-zinc-400">View, search, and export your historical scan data.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export to Excel
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-dark-100/50">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by ID, Crop or Disease..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark-200 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-dark-200/50 text-zinc-400 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium">Scan ID</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Crop</th>
                                <th className="px-6 py-4 font-medium">Detected Disease</th>
                                <th className="px-6 py-4 font-medium">Confidence</th>
                                <th className="px-6 py-4 font-medium">Severity</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredData.map((row) => (
                                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 font-medium text-brand-400">{row.id}</td>
                                    <td className="px-6 py-4 text-zinc-400">{row.date}</td>
                                    <td className="px-6 py-4 text-white">{row.crop}</td>
                                    <td className="px-6 py-4 text-white">
                                        <span className="flex items-center gap-2">
                                            {row.disease === "Healthy" ? (
                                                <span className="w-2 h-2 rounded-full bg-brand-500" />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                            )}
                                            {row.disease}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">{row.confidence}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.severity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                row.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    row.severity === 'Low' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                                            }`}>
                                            {row.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                                        No records found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
