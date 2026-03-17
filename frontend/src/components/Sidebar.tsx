"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Network, Layers, Activity, Search } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Targets", icon: Target, href: "/targets" },
    { label: "Relationship Graph", icon: Network, href: "/graph" },
    { label: "Pipeline", icon: Layers, href: "/pipeline" },
    { label: "Market Signals", icon: Activity, href: "/signals" },
  ];

  return (
    <aside className="w-64 h-screen bg-black/40 backdrop-blur-xl border-r border-[#ffffff10] flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <span className="text-white font-bold text-lg leading-none">O</span>
        </div>
        <span className="text-gray-100 font-semibold tracking-wide">Origination</span>
      </div>

      <div className="relative mb-6 cursor-pointer" onClick={() => {
        // Trigger Cmd+K dispatch manually if needed, or just rely on the component
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true
        });
        document.dispatchEvent(event);
      }}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </span>
        <div className="w-full bg-[#ffffff05] border border-[#ffffff10] rounded-xl py-2 pl-10 pr-4 text-xs text-gray-500 flex justify-between items-center hover:bg-[#ffffff0a] transition-all">
          <span>Search...</span>
          <span className="px-1.5 py-0.5 rounded bg-[#ffffff10] border border-[#ffffff10] text-[10px] font-bold">⌘K</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? "bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_10px_rgba(99,102,241,0.05)]" 
                  : "text-gray-400 hover:bg-[#ffffff05] hover:text-gray-200"
                }
              `}
            >
              <Icon size={18} className={isActive ? "text-indigo-400" : "text-gray-400 group-hover:text-gray-200"} />
              {item.label}
              
              {item.label === "Market Signals" && (
                <div className="ml-auto flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-amber-500/80">3 NEW</span>
                </div>
              )}

              {isActive && item.label !== "Market Signals" && (
                <div className="ml-auto w-1 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="px-4 py-2 rounded-xl bg-[#ffffff03] border border-[#ffffff05] flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Engine Active</span>
           </div>
           <span className="text-[10px] font-bold text-gray-600">8ms latency</span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#ffffff05] to-[#ffffff01] border border-[#ffffff0a] group hover:border-indigo-500/30 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all">
              <span className="text-indigo-200 text-sm font-bold group-hover:text-white">JD</span>
            </div>
            <div>
              <div className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold mb-0.5">Partner</div>
              <div className="text-sm text-gray-200 font-bold tracking-tight">John Doe</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
