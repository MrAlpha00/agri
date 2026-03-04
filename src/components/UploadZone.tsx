"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Trash2, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export function UploadZone() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        cropName: "",
        acreOfLand: "",
        leafEdgeCondition: "smooth",
        leafColor: "green",
        spotsOnLeaf: "none",
        texture: "normal",
    });

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file (JPEG, PNG, WEBP).");
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError("Image must be smaller than 10MB.");
            return;
        }
        setFile(file);

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please select an image first.");
            return;
        }

        // Basic validation
        if (!formData.cropName || !formData.acreOfLand) {
            setError("Crop Name and Acre of Land are required.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
            const filePath = `scans/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('crop-images')
                .upload(filePath, file);

            // We expect an upload error here in a local mock scenario since credentials aren't real yet.
            // But in a real scenario, we'll continue if successful.
            let publicUrl = "https://mock-image-url.com/mock.jpg"; // Fallback for mock execution

            if (!uploadError && data) {
                const { data: { publicUrl: url } } = supabase.storage
                    .from('crop-images')
                    .getPublicUrl(filePath);
                publicUrl = url;
            }

            // 2. Call our AI API endpoint with metadata
            const payload = {
                ...formData,
                imageUrl: publicUrl,
                acreOfLand: Number(formData.acreOfLand)
            };

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to analyze image via API.");
            }

            const result = await response.json();

            // 3. Navigate to result page
            router.push(`/result/${result.id}`);

        } catch (err: any) {
            console.error(err);
            setError(err?.message || "Failed to process the scan. Ensure Supabase is configured correctly.");
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left Column: Image Upload Area */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-1 relative overflow-hidden group h-full flex flex-col"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-brand-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !file && fileInputRef.current?.click()}
                    className={cn(
                        "relative w-full rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center flex-1 min-h-[400px] overflow-hidden",
                        isDragging
                            ? "border-brand-500 bg-brand-500/5 p-4"
                            : "border-zinc-700 hover:border-brand-500/50 hover:bg-white/[0.02] p-4",
                        !file && "cursor-pointer"
                    )}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center pointer-events-none text-center p-8"
                            >
                                <div className="w-20 h-20 rounded-full bg-dark-200 border border-white/5 flex items-center justify-center mb-6 shadow-inner relative">
                                    <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full" />
                                    <Camera className="w-8 h-8 text-brand-400 relative z-10" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Capture or Upload</h3>
                                <p className="text-zinc-400 text-sm max-w-xs mb-6 leading-relaxed">
                                    Drag and drop your crop leaf image here. Ensure the leaf is well-lit and in focus.
                                </p>
                                <button
                                    type="button"
                                    className="px-6 py-2.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 font-medium hover:bg-brand-500/20 transition-all text-sm flex items-center gap-2"
                                >
                                    <UploadCloud className="w-4 h-4" />
                                    Select File
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative w-full h-full flex flex-col items-center justify-center z-10"
                            >
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="Crop Preview"
                                        className="w-full h-full object-cover rounded-lg shadow-2xl absolute inset-0 opacity-40 blur-sm"
                                    />
                                )}
                                <div className="relative z-10 w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-brand-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-6">
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Crop Leaf" className="w-full h-full object-cover" />
                                            {/* Scanning Animation Header */}
                                            {isUploading && (
                                                <motion.div
                                                    initial={{ top: "-10%" }}
                                                    animate={{ top: "110%" }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute left-0 right-0 h-1 bg-brand-400 shadow-[0_0_20px_4px_rgba(16,185,129,0.8)] z-20"
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-zinc-600" />
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10 bg-dark-100/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-full max-w-sm flex items-center justify-between">
                                    <div className="flex flex-col overflow-hidden mr-4">
                                        <span className="text-white font-medium truncate text-sm">{file.name}</span>
                                        <span className="text-zinc-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearFile}
                                        disabled={isUploading}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex-shrink-0"
                                        title="Remove image"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Right Column: Metadata Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 sm:p-8 flex flex-col h-full"
            >
                <div className="mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Scan Details</h3>
                    <p className="text-sm text-zinc-400">Provide field metrics to help the AI calibrate its yield loss estimations accurately.</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-6 flex-1 flex flex-col">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Crop Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Tomato, Wheat"
                                value={formData.cropName}
                                onChange={e => setFormData({ ...formData, cropName: e.target.value })}
                                className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Acre of Land *</label>
                            <input
                                type="number"
                                required
                                step="0.1"
                                min="0"
                                placeholder="0.0"
                                value={formData.acreOfLand}
                                onChange={e => setFormData({ ...formData, acreOfLand: e.target.value })}
                                className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <h4 className="text-sm font-medium text-white mb-4">Visual Characteristics (Optional context)</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Leaf Edge</label>
                                <select
                                    value={formData.leafEdgeCondition}
                                    onChange={e => setFormData({ ...formData, leafEdgeCondition: e.target.value })}
                                    className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-sm appearance-none"
                                >
                                    <option value="smooth">Smooth / Normal</option>
                                    <option value="curled">Curled</option>
                                    <option value="burnt">Burnt / Crispy</option>
                                    <option value="torn">Torn / Damaged</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Leaf Color</label>
                                <select
                                    value={formData.leafColor}
                                    onChange={e => setFormData({ ...formData, leafColor: e.target.value })}
                                    className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-sm appearance-none"
                                >
                                    <option value="green">Healthy Green</option>
                                    <option value="yellowing">Yellowing (Chlorosis)</option>
                                    <option value="brown">Brown / Dark</option>
                                    <option value="pale">Pale / Whiteish</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Spots on Leaf</label>
                                <select
                                    value={formData.spotsOnLeaf}
                                    onChange={e => setFormData({ ...formData, spotsOnLeaf: e.target.value })}
                                    className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-sm appearance-none"
                                >
                                    <option value="none">None</option>
                                    <option value="black_brown">Black / Brown Spots</option>
                                    <option value="yellow_halos">Spots with Yellow Halos</option>
                                    <option value="white_powdery">White Powdery Patches</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Texture</label>
                                <select
                                    value={formData.texture}
                                    onChange={e => setFormData({ ...formData, texture: e.target.value })}
                                    className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all text-sm appearance-none"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="dry_brittle">Dry & Brittle</option>
                                    <option value="wilted">Wilted / Drooping</option>
                                    <option value="sticky">Sticky / Residue</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 sm:pt-8 w-full">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden w-full"
                                >
                                    <div className="mb-4 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center gap-3 text-red-400 text-sm">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isUploading || !file}
                            className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:shadow-none"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analyzing Deep Neural Network...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-6 h-6" />
                                    Analyze Crop Condition
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
