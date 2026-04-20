"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Database, Radio, Map, Sparkles } from "lucide-react";

const ITEMS = [
  { href: "/",        icon: LayoutDashboard, title: "Dashboard" },
  { href: "/targets", icon: Database,        title: "Vault"     },
  { href: "/signals", icon: Radio,           title: "Signaux"   },
  { href: "/map",     icon: Map,             title: "Carte"     },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, height: 56,
      background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)",
      borderTop: "1px solid #1F1F1F",
      display: "flex", alignItems: "center",
      zIndex: 100,
    }}>
      {ITEMS.map(({ href, icon: Icon, title }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link key={href} href={href} title={title} style={{
            flex: 1, height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 3,
            color: active ? "#FAFAFA" : "#444444",
            textDecoration: "none", position: "relative",
          }}>
            {active && (
              <span style={{
                position: "absolute", bottom: 0, left: "25%", right: "25%",
                height: 2, background: "#FF4500",
              }} />
            )}
            <Icon size={18} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: "0.08em" }}>
              {title.toUpperCase()}
            </span>
          </Link>
        );
      })}

      {/* Copilot button */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("toggle-copilot"))}
        style={{
          flex: 1, height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 3,
          background: "transparent", border: "none", cursor: "pointer",
          color: "#444444", position: "relative",
        }}
      >
        <span style={{
          position: "absolute", top: 10, right: "calc(50% - 14px)",
          width: 5, height: 5, borderRadius: "50%", background: "#4A9A5A",
        }} />
        <Sparkles size={18} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: "0.08em" }}>
          COPILOT
        </span>
      </button>
    </nav>
  );
}
