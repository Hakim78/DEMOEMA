import Link from "next/link";
import { ArrowLeft, Target, Award, Users, Clock, Zap, Building, Crosshair, TrendingUp, AlertCircle, FileText, Share2, MoreVertical } from "lucide-react";

export default async function TargetDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch target data from the Fast API backend
  let targetData = null;
  try {
    const res = await fetch(`http://localhost:8000/api/targets/${id}`, { cache: "no-store" });
    if (res.ok) {
        const json = await res.json();
        targetData = json.data;
    }
  } catch (err) {
      console.error(err);
  }

  if (!targetData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Target Not Found</h1>
          <p className="text-gray-400 mb-6">We couldn't find the target information or the backend is offline.</p>
          <Link href="/" className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all font-medium">
            Return to Dashboard
          </Link>
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20 pt-4 px-4">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-white">{targetData.name}</h1>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {targetData.sector}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Monitoring • Last event detected 2h ago
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <Share2 size={18} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition-all">
            <TrendingUp size={16} /> Update Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Essential Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main Priority Card */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600/20 via-black to-black border border-indigo-500/30 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-500" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Target size={24} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60 mb-1">Confidence Layer</div>
                  <div className="text-xs font-bold text-white">94.2% AI Integrity</div>
                </div>
              </div>

              <div className="flex flex-col items-center mb-10">
                <div className="relative">
                  {/* Custom SVG Ring */}
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                    <circle cx="96" cy="96" r="88" stroke="url(#gradient-ring)" strokeWidth="12" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - targetData.priorityScore / 100)} strokeLinecap="round" fill="transparent" />
                    <defs>
                      <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-white leading-none">{targetData.priorityScore}</span>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Priority Index</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(targetData.scores).map(([key, val]: any) => (
                  <div key={key}>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2 text-gray-400">
                      <span>{key}</span>
                      <span className="text-gray-200">{val}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
               <Zap className="text-amber-400 mb-3" size={20} />
               <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Deal Velocity</div>
               <div className="text-lg font-bold text-white">Accelerating</div>
            </div>
            <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
               <Users className="text-indigo-400 mb-3" size={20} />
               <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Connections</div>
               <div className="text-lg font-bold text-white">4 Warm Paths</div>
            </div>
          </div>

        </div>

        {/* Center/Right Column - Intelligence & Narrative */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* AI Narrative Section */}
          <div className="p-8 rounded-[2rem] bg-indigo-950/20 border border-indigo-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText className="text-indigo-400" size={24} /> AI Investment Thesis
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                <Zap size={10} /> Generated by Copilot
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg mb-6 leading-8">
                {targetData.name} presents a compelling <span className="text-white font-bold underline decoration-indigo-500/50 underline-offset-4">origination opportunity</span> within the {targetData.sector} space. Our signals detect a rare alignment of <span className="text-indigo-300 font-medium">corporate restructuring</span> and <span className="text-indigo-300 font-medium">leadership transition</span> indicators. 
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" /> Catalytic Events
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-3">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      Incoming CFO has a history of private equity exits within 24 months.
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      Recent spin-off rumors confirmed by secondary registry monitoring.
                    </li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Crosshair size={16} className="text-rose-400" /> Strategic Fit
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-3">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      Perfect platform match for existing Buy-and-Build healthcare cluster.
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      Relationship accessibility via Partner John Doe provides unique entry.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Signal Timeline */}
          <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Clock className="text-gray-400" size={24} /> Detected Signal History
              </h3>
              <button className="text-xs font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300">
                View Raw Logs
              </button>
            </div>
            
            <div className="relative pl-10 space-y-10">
              {/* Timeline Stem */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500 via-white/10 to-transparent" />
              
              {targetData.signals.map((signal: string, idx: number) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-lg bg-black border border-indigo-500 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-sm tracking-tight">{signal}</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{idx === 0 ? "2h ago" : "Yesterday"}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                      Automated extractor found high-relevance match in {idx === 0 ? "sector specific journals" : "corporate registry filings"}. Sentiment analysis indicates a {idx === 0 ? "strategic pivot" : "structural preparation"}.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-between items-center p-8 rounded-[2rem] bg-white/5 border border-white/10">
            <div>
               <h4 className="text-white font-bold">Interested in this target?</h4>
               <p className="text-gray-400 text-sm mt-1">Generate a full PDF brief or assign a relationship owner.</p>
            </div>
            <div className="flex gap-4">
               <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
                  Assign Owner
               </button>
               <button className="px-8 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.2)]">
                  Export PDF Brief <Award size={16} />
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
