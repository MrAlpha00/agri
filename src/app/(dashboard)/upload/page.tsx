import { UploadZone } from "@/components/UploadZone";

export default function UploadPage() {
    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Scan</h1>
                <p className="text-slate-500">Upload a new crop image for AI disease detection.</p>
            </div>
            <UploadZone />
        </div>
    );
}
