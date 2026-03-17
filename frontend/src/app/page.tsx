"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, Building, AlertTriangle, ArrowRight, Zap, ChevronRight, MessageSquare, Target, Activity, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { SkeletonCard, SkeletonKPI } from "@/components/LoadingSkeleton";

// --- Types ---
interface TargetScore {
  transmission: number;
  transaction: number;
  preparation: number;
  relationship: number;
  timing: number;
}

interface Target {
  id: string;
  name: string;
  sector: string;
  priorityScore: number;
  signals: string[];
  dealType: string;
  timeframe: string;
  accessibility: string;
  scores: TargetScore;
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export default function Home() {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // Copilot States
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  // Fetch targets from FastAPI backend
  useEffect(() => {
    fetch("http://localhost:8000/api/targets")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTargets(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch targets:", err);
        setFetchError(true);
        setLoading(false);
      });
  }, []);

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const userMsg = query;
    setQuery("");
    setChatHistory(prev => [...prev, {role: "user", content: userMsg}]);
    setIsTyping(true);

    try {
      const res = await fetch(`http://localhost:8000/api/copilot/query?q=${encodeURIComponent(userMsg)}`);
      const data = await res.json();
      setChatHistory(prev => [...prev, {role: "ai", content: data.response}]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, {role: "ai", content: "Sorry, I am having trouble connecting to the intelligence engine."}]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto relative">
      {/* Header */}
      <header className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Intelligence Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            AI-driven origination pipeline prioritizing short-term transaction windows.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-[#ffffff0a] border border-[#ffffff10] text-sm font-medium text-white hover:bg-[#ffffff15] transition-all">
            Filter View
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center gap-2">
            <Zap size={16} /> Update Scoring
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : [
              { icon: Building, label: "Active Monitored", value: "2,408", trend: "+12%" },
              { icon: AlertTriangle, label: "High Priority Signals", value: "45", trend: "+5" },
              { icon: Users, label: "Relationship Paths", value: "891", trend: "+24" },
              { icon: TrendingUp, label: "Predicted Transactions (6m)", value: "18", trend: "-2" },
            ].map((card, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={card.label}
                className="p-5 rounded-2xl bg-gradient-to-br from-[#ffffff08] to-[#ffffff02] border border-[#ffffff10] backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-[#ffffff0a]">
                    <card.icon size={20} className="text-indigo-400" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    card.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {card.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
                <div className="text-sm text-gray-400">{card.label}</div>
              </motion.div>
            ))
        }
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ranked Targets List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <Target size={18} className="text-indigo-400" /> Top Priority Targets
            </h2>
            <button onClick={() => router.push("/pipeline")} className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center">
              View All Pipeline <ChevronRight size={16} />
            </button>
          </div>

          {/* Error state */}
          {fetchError && (
            <div className="mb-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
              <span className="text-rose-400 text-lg">⚠</span>
              <span>Impossible de contacter le backend. Vérifiez que FastAPI tourne sur <code className="font-mono text-rose-200 bg-rose-500/10 px-1 rounded">http://localhost:8000</code>.</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : targets.map((target, idx) => (
              <motion.div 
                onClick={() => router.push(`/targets/${target.id}`)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                key={target.id}
                className="group p-5 rounded-2xl bg-[#0a0a0a] border border-[#ffffff10] hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">{target.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {target.sector}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {target.signals.map((signal) => (
                        <span key={signal} className="px-2.5 py-1 rounded bg-[#ffffff08] text-gray-300 text-xs flex items-center gap-1.5 border border-[#ffffff0a]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 leading-none">
                      {target.priorityScore}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold mt-1">
                      Priority Score
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#ffffff0a] flex justify-between items-center bottom-content">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs block mb-0.5">Hypothesized Deal</span>
                      <span className="text-gray-200 font-medium">{target.dealType}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block mb-0.5">Est. Window</span>
                      <span className="text-gray-200 font-medium">{target.timeframe}</span>
                    </div>
                  </div>
                  
                  <button className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-[#ffffff0a] group-hover:bg-indigo-500 group-hover:text-white transition-all flex items-center gap-2 border border-[#ffffff10] group-hover:border-indigo-500 z-10 relative">
                    Origination Sheet <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Copilot Side Panel Snippet or Sector Heatmap */}
        <div className="flex flex-col gap-4">
           {/* Sub-Sector Heatmap */}
           <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-md flex-1 flex flex-col">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <Activity size={20} className="text-indigo-400" /> Sector Signal Intensities
              </h2>
              
              <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden">
                {[
                  { name: "Industrial Tech", score: "High", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: "↑ 24%" },
                  { name: "Digital Health", score: "Med", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", icon: "↑ 12%" },
                  { name: "SaaS Clusters", score: "High", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: "↑ 38%" },
                  { name: "FinTech Rollup", score: "Low", color: "bg-rose-500/20 text-rose-400 border-rose-500/30", icon: "↓ 4%" },
                ].map((sector) => (
                  <div key={sector.name} className={`p-4 rounded-2xl border ${sector.color} flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all`}>
                    <div className="flex justify-between items-start">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{sector.score} Intensity</span>
                       <span className="text-[10px] font-bold">{sector.icon}</span>
                    </div>
                    <div className="text-sm font-bold mt-4 group-hover:translate-x-1 transition-transform">{sector.name}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
                 <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <span>Engine Confidence</span>
                    <span className="text-emerald-500">98.4%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[98.4%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                 </div>
              </div>
            </div>

           {/* Mini Copilot Prompt Context */}
           <div 
             onClick={() => setCopilotOpen(true)}
             className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/10 border border-indigo-500/20 backdrop-blur-md cursor-pointer hover:border-indigo-500/50 transition-all flex flex-col gap-3 group"
           >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Zap size={16} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-indigo-100">AI Copilot Insights</h3>
              </div>
              <p className="text-sm text-indigo-200/70 leading-relaxed">
                "I noticed 3 new holding vehicles created in the French Industrial Tech sector this week. Would you like me to aggregate founders nearing retirement age in this cohort?"
              </p>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium group-hover:text-indigo-300 mt-2">
                 Ask Copilot <MessageSquare size={14} />
              </div>
           </div>
        </div>

      </div>

      {/* AI Copilot Slide-out Panel */}
      <AnimatePresence>
        {copilotOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setCopilotOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-[#050505] border-l border-[#ffffff15] shadow-2xl z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-4 border-b border-[#ffffff10] flex items-center justify-between bg-black/50 backdrop-blur-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.4)]">
                     <Zap size={16} className="text-white" />
                   </div>
                   <div>
                     <h2 className="text-white font-semibold flex items-center gap-2 text-sm">Origination Copilot <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Beta</span></h2>
                   </div>
                 </div>
                 <button onClick={() => setCopilotOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#ffffff10] transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {/* Greeting */}
                 <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-900/30 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                      <Target size={14} className="text-indigo-400" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-[#ffffff0a] border border-[#ffffff05] text-sm text-gray-200">
                      Hello John. I've been monitoring the Industrial Tech space. I noticed 3 new holding vehicles created in France this week. How can I help you today?
                    </div>
                 </div>

                 {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border
                        ${msg.role === "user" ? "bg-purple-900/30 border-purple-500/20" : "bg-indigo-900/30 border-indigo-500/20"}
                      `}>
                        {msg.role === "user" ? <span className="text-purple-400 text-xs font-bold">JD</span> : <Target size={14} className="text-indigo-400" />}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl text-sm border ${
                        msg.role === "user" 
                          ? "bg-purple-500/10 border-purple-500/20 text-purple-100 rounded-tr-sm" 
                          : "bg-[#ffffff0a] border-[#ffffff05] text-gray-200 rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                 ))}

                 {isTyping && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-900/30 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                        <Target size={14} className="text-indigo-400" />
                      </div>
                      <div className="px-4 py-4 rounded-2xl bg-[#ffffff0a] border border-[#ffffff05] flex items-center gap-1.5">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      </div>
                    </div>
                 )}
              </div>

              <div className="p-4 border-t border-[#ffffff10] bg-black">
                <form onSubmit={handleCopilotSubmit} className="relative">
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about sectors, signals or targets..." 
                    className="w-full bg-[#ffffff0a] border border-[#ffffff15] rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 shadow-inner"
                  />
                  <button 
                    type="submit" 
                    disabled={!query.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight size={16} />
                  </button>
                </form>
                <div className="mt-2 text-center">
                   <span className="text-[10px] text-gray-600">AI can make mistakes. Verify important facts with data room.</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
