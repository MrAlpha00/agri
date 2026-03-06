import { UploadZone } from "@/components/UploadZone";
import { Leaf, ShieldAlert, BadgeCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-brand-50/50 to-background py-16 md:py-24">
      {/* Soft gradient background effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-semibold mb-8 shadow-sm">
          <Leaf className="w-4 h-4" />
          <span>Intelligent AgriTech Solutions</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
          AI Crop Disease Detection
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload a plant image and instantly detect crop diseases with AI-powered analysis.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 pb-16">
        <UploadZone />

        <div className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Platform Capabilities</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to monitor and protect your crops effectively.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Get analysis results in seconds to make quick critical decisions for your farm."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-start gap-4 hover:border-brand-300 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
