"use client";

import { motion } from "framer-motion";
import { Activity, Bell, Filter, Search, ShieldAlert, ArrowUpRight, Clock, MapPin } from "lucide-react";

export default function SignalsPage() {
  const signals = [
    { type: "Critical Event", title: "CFO Replacement at TechFlow Industrials", time: "2 hours ago", source: "Press Release Analysis", severity: "high", location: "Global" },
    { type: "Weak Signal", title: "Succession Pattern detected: Founder of Aetherial SA approaching 65", time: "Yesterday", source: "Proprietary Data", severity: "medium", location: "Europe" },
    { type: "Market Movement", title: "New holding vehicle registered linked to NexSphere board", time: "2 days ago", source: "Corporate Registry", severity: "medium", location: "France" },
    { type: "Rumor", title: "Spin-off discussions reported in Industrial Tech sector forums", time: "4 days ago", source: "NLP Web Scrape", severity: "low", location: "North America" },
    { type: "Pattern Match", title: "Historical holding period (5+ years) reached for 14 portfolio companies of EQT", time: "1 week ago", source: "PE Database", severity: "high", location: "Global" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-[calc(100vh-2rem)]">
      {/* Header */}
      <header className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            <Activity className="text-indigo-400" size={28} /> Market Signals Feed
          </h1>
          <p className="text-gray-400 text-sm">
            AI-detected events, anomalies, and patterns indicating transaction probability.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
               <Search size={16} />
            </span>
            <input 
               type="text" 
               placeholder="Search signals..." 
               className="w-64 bg-[#ffffff05] border border-[#ffffff10] rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:bg-[#ffffff0a] transition-all"
            />
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#ffffff0a] border border-[#ffffff10] text-sm font-medium text-white hover:bg-[#ffffff15] transition-all flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Main Feed */}
        <div className="lg:col-span-3 bg-[#050505] border border-[#ffffff10] rounded-2xl overflow-hidden flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="p-4 border-b border-[#ffffff10] flex gap-2">
             <button className="px-3 py-1.5 rounded bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">All Signals</button>
             <button className="px-3 py-1.5 rounded text-gray-400 hover:bg-[#ffffff0a] hover:text-white text-xs font-semibold transition-colors">High Probability</button>
             <button className="px-3 py-1.5 rounded text-gray-400 hover:bg-[#ffffff0a] hover:text-white text-xs font-semibold transition-colors">Succession</button>
             <button className="px-3 py-1.5 rounded text-gray-400 hover:bg-[#ffffff0a] hover:text-white text-xs font-semibold transition-colors">Carve-outs</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {signals.map((signal, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="p-5 rounded-2xl bg-[#ffffff05] border border-[#ffffff10] hover:border-indigo-500/30 transition-all group flex gap-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border
                    ${signal.severity === 'high' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : ''}
                    ${signal.severity === 'medium' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : ''}
                    ${signal.severity === 'low' ? 'bg-gray-500/10 border-gray-500/30 text-gray-400' : ''}
                  `}>
                    <Bell size={18} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
                      ${signal.severity === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-[#ffffff0a] text-gray-400'}
                    `}>
                      {signal.type}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {signal.time}</span>
                  </div>
                  
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {signal.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-gray-400" /> Source: {signal.source}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" /> {signal.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center px-2">
                  <button className="w-8 h-8 rounded-full bg-[#ffffff0a] group-hover:bg-indigo-600 text-gray-400 group-hover:text-white flex items-center justify-center transition-all shadow-lg border border-[#ffffff15] group-hover:border-indigo-500">
                     <ArrowUpRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#050505] p-5 rounded-2xl border border-[#ffffff10] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Signal Velocity</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                142
              </span>
              <span className="text-sm text-gray-400 font-medium mb-1.5">signals/week</span>
            </div>
            <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded inline-block">
              +24% vs last week
            </div>
          </div>

          <div className="bg-[#050505] p-5 rounded-2xl border border-[#ffffff10] shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex-1">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Top Sub-Sectors</h3>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs text-gray-300 font-medium mb-1.5">
                    <span>Industrial Tech</span>
                    <span className="text-indigo-400">45 alerts</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#ffffff0a] rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '80%' }} />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs text-gray-300 font-medium mb-1.5">
                    <span>Healthcare Carveouts</span>
                    <span className="text-indigo-400">28 alerts</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#ffffff0a] rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400" style={{ width: '50%' }} />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs text-gray-300 font-medium mb-1.5">
                    <span>Consumer Retail</span>
                    <span className="text-gray-500">12 alerts</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#ffffff0a] rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500" style={{ width: '25%' }} />
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
