"use client";

import { useState, useEffect } from "react";
import { Search, Command, Target, Zap, Activity, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const items = [
    { id: "dashboard", name: "Dashboard", icon: Command, path: "/" },
    { id: "targets", name: "Targets Directory", icon: Target, path: "/targets" },
    { id: "pipeline", name: "Origination Pipeline", icon: Zap, path: "/pipeline" },
    { id: "signals", name: "Market Signals Feed", icon: Activity, path: "/signals" },
    { id: "graph", name: "Relationship Explorer", icon: Users, path: "/graph" },
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[101] overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="text-gray-500" size={20} />
              <input
                autoFocus
                placeholder="Search anything... (Targets, Pages, Signals)"
                className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-500 font-bold">
                ESC
              </div>
            </div>

            <div className="p-2">
              <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Quick Navigation
              </div>
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(item.path);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                        <item.icon size={18} />
                      </div>
                      <span className="text-gray-300 group-hover:text-white font-medium">
                        {item.name}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Command size={14} className="text-gray-600" />
                    </div>
                  </button>
                ))}
                {filteredItems.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No results found for "{search}"
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-white/[0.02] border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              <span>Shortcuts: ↵ Select • ↑↓ Navigate • ESC Close</span>
              <span className="flex items-center gap-1">
                Origination Platform <span className="text-indigo-500/50">v0.1.0</span>
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
