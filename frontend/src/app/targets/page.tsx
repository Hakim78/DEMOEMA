"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Search, Filter, ArrowUpDown, ChevronRight, Building } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TargetsPage() {
  const [targets, setTargets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/targets")
      .then(res => res.json())
      .then(data => {
        setTargets(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-[calc(100vh-2rem)]">
      {/* Header */}
      <header className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            <Target className="text-indigo-400" size={28} /> Target Directory
          </h1>
          <p className="text-gray-400 text-sm">
            Comprehensive list of monitored entities and transaction likelihood scores.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
               <Search size={16} />
            </span>
            <input 
               type="text" 
               placeholder="Search targets..." 
               className="w-64 bg-[#ffffff05] border border-[#ffffff10] rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:bg-[#ffffff0a] transition-all"
            />
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#ffffff0a] border border-[#ffffff10] text-sm font-medium text-white hover:bg-[#ffffff15] transition-all flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
      </header>

      {/* Table Area */}
      <div className="flex-1 bg-[#050505] border border-[#ffffff10] rounded-2xl overflow-hidden flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#ffffff10] bg-[#ffffff05] text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-colors">
            Company Name <ArrowUpDown size={14} />
          </div>
          <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-colors">
            Sector <ArrowUpDown size={14} />
          </div>
          <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-colors">
            Hypothesis <ArrowUpDown size={14} />
          </div>
          <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-colors justify-end">
            Score <ArrowUpDown size={14} />
          </div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full gap-4">
              <div className="w-8 h-8 rounded-full border-t-2 border-indigo-500 animate-spin" />
              Loading targets...
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#ffffff0a]">
              {targets.map((target, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={target.id}
                  onClick={() => router.push(`/targets/${target.id}`)}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#ffffff08] transition-colors cursor-pointer group"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#ffffff0a] border border-[#ffffff10] flex items-center justify-center text-indigo-400">
                       <Building size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{target.name}</div>
                      <div className="text-xs text-gray-500">{target.id}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="px-2 py-1 rounded text-[10px] font-semibold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {target.sector}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm text-gray-300 font-medium">{target.dealType}</div>
                    <div className="text-xs text-gray-500">{target.timeframe}</div>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        {target.priorityScore}
                      </span>
                      <span className="text-[10px] text-gray-500 mb-1">/100</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button className="text-gray-400 hover:text-white p-2 rounded hover:bg-[#ffffff10] transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {/* Add dummy targets to fill out table */}
              {[4, 5, 6, 7].map((num) => (
                <div key={num} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#ffffff08] transition-colors cursor-pointer opacity-50">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#ffffff0a] border border-[#ffffff10] flex items-center justify-center text-gray-500">
                       <Building size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-300 text-sm">Undisclosed Target {num}</div>
                      <div className="text-xs text-gray-600">Pending classification</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="px-2 py-1 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#ffffff10] text-gray-400 border border-[#ffffff20]">
                      TBD
                    </span>
                  </div>
                  <div className="col-span-3">
                    <div className="text-xs text-gray-600">Data insufficient</div>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <span className="text-sm font-medium text-gray-500">--</span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <ChevronRight size={18} className="text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
