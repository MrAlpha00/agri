import { UploadZone } from "@/components/UploadZone";
import { Leaf, ShieldAlert, BadgeCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/10 blur-[100px] -z-10 rounded-full" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
          <Leaf className="w-4 h-4" />
          <span>AI-Powered Agriculture</span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Detect Crop Diseases in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-600">Seconds</span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Upload a high-quality photo of the affected plant leaf, and our advanced AI model will identify the disease and recommend actionable treatments instantly.
        </p>
      </div>

      <UploadZone />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
        {[
          {
            icon: ShieldAlert,
            title: "Early Detection",
            desc: "Identify potential threats before they spread and destroy your yield."
          },
          {
            icon: BadgeCheck,
            title: "High Accuracy",
            desc: "Our model is trained on millions of images for precise disease identification."
          },
          {
            icon: Leaf,
            title: "Actionable Insights",
            desc: "Get immediate treatment recommendations including chemical and organic solutions."
          }
        ].map((feature, i) => (
          <div key={i} className="glass-card p-6 flex flex-col items-start gap-4 hover:border-brand-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
