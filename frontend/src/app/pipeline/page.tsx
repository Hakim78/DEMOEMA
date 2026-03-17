"use client";

import { motion } from "framer-motion";
import { Layers, Plus, MoreHorizontal } from "lucide-react";

export default function PipelinePage() {
  const stages = [
    { title: "Identification", color: "border-gray-500", count: 142 },
    { title: "Qualification", color: "border-indigo-500", count: 18 },
    { title: "Relationship Pathing", color: "border-purple-500", count: 7 },
    { title: "Active Outreach", color: "border-amber-500", count: 3 },
    { title: "NDA / First Round", color: "border-emerald-500", count: 1 },
  ];

  const dummyCards = {
    "Qualification": [
      { name: "TechFlow Industrials", sector: "Industrial Tech", score: 89, tags: ["Warm Intro", "3-6m Window"] },
      { name: "Aetherial SA", sector: "Renewable Energy", score: 76, tags: ["Succession"] },
    ],
    "Relationship Pathing": [
      { name: "NexSphere Healthcare", sector: "MedTech", score: 68, tags: ["Carve-out"] },
    ]
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-[calc(100vh-2rem)]">
      {/* Header */}
      <header className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            <Layers className="text-indigo-400" size={28} /> Pipeline Board
          </h1>
          <p className="text-gray-400 text-sm">
            Kanban view tracking the origination lifecycle of high-priority targets.
          </p>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full w-max min-w-full">
          {stages.map((stage, i) => (
            <div key={stage.title} className="w-80 flex flex-col h-full bg-[#050505] rounded-2xl border border-[#ffffff10] shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Stage Header */}
              <div className={`p-4 border-b border-[#ffffff10] border-t-2 ${stage.color} bg-[#ffffff05] flex items-center justify-between`}>
                <h3 className="font-semibold text-gray-200 text-sm">{stage.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#ffffff10] text-gray-400 text-xs font-mono">{stage.count}</span>
              </div>

              {/* Stage Content */}
              <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
                 {/* @ts-ignore */}
                {dummyCards[stage.title]?.map((card: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="p-4 rounded-xl bg-[#0a0a0a] border border-[#ffffff10] hover:border-indigo-500/50 cursor-grab group transition-colors shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider uppercase bg-[#ffffff0a] text-gray-400 border border-[#ffffff10]">
                        {card.sector}
                      </span>
                      <button className="text-gray-600 hover:text-gray-300">
                         <MoreHorizontal size={14} />
                      </button>
                    </div>
                    
                    <h4 className="font-bold text-white text-sm mb-3 group-hover:text-indigo-400 transition-colors">{card.name}</h4>
                    
                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex gap-1.5 flex-wrap">
                          {card.tags.map((tag: string) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                       </div>
                       <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-900 to-[#111] border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-white">
                         {card.score}
                       </div>
                    </div>
                  </motion.div>
                ))}

                <button className="w-full py-3 rounded-xl border border-dashed border-[#ffffff20] text-sm text-gray-500 font-medium hover:border-[#ffffff40] hover:text-gray-300 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Target
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
