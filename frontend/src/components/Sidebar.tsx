"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Database, Layers, Radio,
  Map, BarChart3, Network, Sparkles,
} from "lucide-react";

const NAV = [
  { href: "/",          icon: LayoutDashboard, title: "Dashboard"          },
  { href: "/targets",   icon: Database,        title: "Intelligence Vault" },
  { href: "/pipeline",  icon: Layers,          title: "Pipeline M&A"       },
  { href: "/graph",     icon: Network,         title: "Graphe Réseau"      },
  { href: "/signals",   icon: Radio,           title: "Signaux Marché"     },
  { href: "/map",       icon: Map,             title: "Carte Tactique"     },
  { href: "/analytics", icon: BarChart3,       title: "Analytics"          },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0,
      width: 48, height: "100dvh",
      background: "#0A0A0A",
      borderRight: "1px solid #1F1F1F",
      display: "flex", flexDirection: "column",
      zIndex: 100,
    }}>
      {/* Logo dot */}
      <div style={{
        height: 48, display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid #1F1F1F", flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 500, color: "#FF4500",
        }}>E</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 0", gap: 2 }}>
        {NAV.map(({ href, icon: Icon, title }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} title={title} style={{
              position: "relative",
              width: 48, height: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: active ? "#FAFAFA" : "#333333",
              background: active ? "#141414" : "transparent",
              transition: "color 0.15s, background 0.15s",
              textDecoration: "none",
            }}>
              {active && (
                <span style={{
                  position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                  width: 2, height: 20, background: "#FF4500",
                  boxShadow: "0 0 6px rgba(255,69,0,0.4)",
                }} />
              )}
              <Icon size={16} />
            </Link>
          );
        })}
      </nav>

      {/* Copilot + user */}
      <div style={{
        borderTop: "1px solid #1F1F1F", padding: "6px 0 10px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-copilot"))}
          title="Copilot IA"
          style={{
            position: "relative", width: 48, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", cursor: "pointer", color: "#444444",
          }}
        >
          <span style={{
            position: "absolute", top: 8, right: 10,
            width: 5, height: 5, borderRadius: "50%", background: "#4A9A5A",
          }} />
          <Sparkles size={15} />
        </button>
        <div style={{
          width: 22, height: 22, borderRadius: 3,
          background: "#111111", border: "1px solid #1F1F1F",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: "#555555" }}>QM</span>
        </div>
      </div>
    </aside>
  );
}
