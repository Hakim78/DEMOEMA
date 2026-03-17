"use client";

import { motion } from "framer-motion";
import { Network, Search, Filter, ZoomIn, ZoomOut, Download, Users, Briefcase, ChevronRight, MapPin, CheckCircle, ExternalLink } from "lucide-react";

export default function RelationshipGraph() {
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full max-w-7xl mx-auto pb-4">
      {/* Header */}
      <header className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            <Network className="text-indigo-400" size={28} /> Network Intelligence Explorer
          </h1>
          <p className="text-gray-400 text-sm">
            AI-mapped relationship graph connecting LP limited partners, advisors, and target executives.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
               <Search size={16} />
            </span>
            <input 
               type="text" 
               placeholder="Search nodes..." 
               className="w-64 bg-[#ffffff05] border border-[#ffffff10] rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:bg-[#ffffff0a] transition-all"
            />
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#ffffff0a] border border-[#ffffff10] text-sm font-medium text-white hover:bg-[#ffffff15] transition-all flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* Graph Area */}
        <div className="lg:col-span-3 rounded-2xl bg-[#050505] border border-[#ffffff10] relative overflow-hidden flex flex-col group shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          {/* Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button className="w-8 h-8 rounded-lg bg-[#ffffff10] text-gray-400 hover:text-white hover:bg-[#ffffff20] transition-colors flex items-center justify-center border border-[#ffffff0a] backdrop-blur-md">
               <ZoomIn size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#ffffff10] text-gray-400 hover:text-white hover:bg-[#ffffff20] transition-colors flex items-center justify-center border border-[#ffffff0a] backdrop-blur-md">
               <ZoomOut size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#ffffff10] text-gray-400 hover:text-white hover:bg-[#ffffff20] transition-colors flex items-center justify-center border border-[#ffffff0a] backdrop-blur-md mt-4">
               <Network size={16} />
            </button>
          </div>

          <div className="absolute top-4 left-4 z-10 flex gap-2">
             <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-[#ffffff10] backdrop-blur-md text-xs font-semibold text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Internal Team
             </div>
             <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-[#ffffff10] backdrop-blur-md text-xs font-semibold text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Target C-Level
             </div>
             <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-[#ffffff10] backdrop-blur-md text-xs font-semibold text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Advisors
             </div>
          </div>

          {/* D3 Mock Background */}
          <div className="flex-1 w-full h-full relative" style={{ backgroundImage: "radial-gradient(#ffffff05 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
             {/* Center Node */}
             <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }} 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
             >
                <div className="w-16 h-16 rounded-full bg-indigo-600 border-4 border-[#050505] shadow-[0_0_30px_rgba(99,102,241,0.5)] z-20 relative flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold text-lg">JD</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center w-32 pb-4">
                  <div className="text-xs font-bold text-white">John Doe</div>
                  <div className="text-[10px] text-indigo-400 uppercase tracking-wider">Partner</div>
                </div>
             </motion.div>

             {/* Node 1 */}
             <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
               <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="50%" y1="50%" x2="30%" y2="30%" stroke="#ffffff15" strokeWidth="2" strokeDasharray="4 4" />
               <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="50%" y1="50%" x2="70%" y2="25%" stroke="rgba(99,102,241,0.4)" strokeWidth="2" />
               <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="70%" y1="25%" x2="80%" y2="50%" stroke="#ffffff20" strokeWidth="1" />
               <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="50%" y1="50%" x2="40%" y2="70%" stroke="#ffffff15" strokeWidth="2" />
               <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="40%" y1="70%" x2="65%" y2="80%" stroke="#ffffff20" strokeWidth="1" />
             </svg>

             {/* Connecting Nodes */}
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10">
                <div className="w-12 h-12 rounded-full bg-[#111] border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center">
                  <span className="text-amber-500 font-bold text-xs">SJ</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center w-24">
                  <div className="text-[10px] font-bold text-gray-200">Sarah Jenkins</div>
                </div>
             </motion.div>

             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute top-[25%] left-[70%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10">
                <div className="w-14 h-14 rounded-full bg-[#111] border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center ring-4 ring-emerald-500/20">
                  <span className="text-emerald-500 font-bold text-sm">MB</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center w-32">
                  <div className="text-[10px] font-bold text-white">Marc Berenson</div>
                  <div className="text-[9px] text-emerald-400">CEO, Target A</div>
                </div>
             </motion.div>

             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10">
                <div className="w-10 h-10 rounded-full bg-[#111] border-2 border-gray-600 flex items-center justify-center">
                  <span className="text-gray-400 font-bold text-xs">RJ</span>
                </div>
             </motion.div>

             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="absolute top-[70%] left-[40%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10">
                <div className="w-12 h-12 rounded-full bg-[#111] border-2 border-amber-500 flex items-center justify-center">
                  <span className="text-amber-500 font-bold text-xs">AL</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center w-24">
                  <div className="text-[10px] font-bold text-gray-200">Alice L.</div>
                </div>
             </motion.div>

             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="absolute top-[80%] left-[65%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10">
                <div className="w-12 h-12 rounded-full bg-[#111] border-2 border-emerald-500 flex items-center justify-center">
                  <span className="text-emerald-500 font-bold text-xs">TW</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center w-24">
                  <div className="text-[10px] font-bold text-gray-200">Thomas W.</div>
                </div>
             </motion.div>

          </div>
        </div>

        {/* Node Detail Sidebar */}
        <div className="rounded-2xl bg-black/40 border border-[#ffffff10] backdrop-blur-md p-5 flex flex-col overflow-y-auto shadow-xl">
           <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                    MB
                 </div>
                 <div>
                    <h2 className="text-white font-bold text-lg leading-tight">Marc Berenson</h2>
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Target C-Level</p>
                 </div>
              </div>
           </div>

           <div className="space-y-4 flex-1">
              <div className="p-4 rounded-xl bg-[#ffffff05] border border-[#ffffff0a]">
                 <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <Briefcase size={14} className="text-gray-500" /> 
                    <span className="font-medium text-white">CEO</span> at <span className="text-indigo-300">Aetherial SA</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={14} className="text-gray-500" /> Paris, France
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Strongest Path</h3>
                 <div className="p-3 rounded-xl bg-[#ffffff02] border border-[#ffffff05] border-l-2 border-l-indigo-500 relative">
                    <div className="absolute -left-[5px] top-4 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#050505]" />
                    <div className="absolute -left-[5px] bottom-5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#050505]" />
                    <div className="pl-3 space-y-4">
                       <div>
                          <div className="text-xs text-indigo-400 font-medium">John Doe</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">Internal Partner</div>
                       </div>
                       <div className="py-1">
                          <div className="h-4 w-px bg-gradient-to-b from-indigo-500/50 to-emerald-500/50 ml-1" />
                       </div>
                       <div>
                          <div className="text-xs text-white font-medium">Marc Berenson</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">Board member overlap via TechFlow</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Context Signals</h3>
                 <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-[#ffffff05] border border-[#ffffff0a] flex items-start gap-2">
                       <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                       <div className="text-xs text-gray-300 leading-relaxed">Attended the Industrial Leaders Summit last month. John Doe is also an alumni.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#ffffff05] border border-[#ffffff0a] flex items-start gap-2">
                       <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                       <div className="text-xs text-gray-300 leading-relaxed">Approaching retirement age (63). Likely considering succession planning.</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="pt-4 mt-2 border-t border-[#ffffff10]">
              <button className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2">
                 Generate Briefing <ExternalLink size={16} />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
