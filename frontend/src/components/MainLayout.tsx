"use client";

import Sidebar from "@/components/Sidebar";
import GlobalCopilot from "@/components/GlobalCopilot";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: "#0A0A0A" }}>
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: 0,
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
        className="md:ml-12"
      >
        {/* Mobile top bar */}
        <div className="md:hidden" style={{
          height: 48, borderBottom: "1px solid #1F1F1F",
          display: "flex", alignItems: "center",
          padding: "0 16px", gap: 12,
          background: "#0A0A0A", position: "sticky", top: 0, zIndex: 50,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 11, color: "#FF4500", letterSpacing: "0.1em",
          }}>EdRCF_6.0</span>
          <div style={{ flex: 1 }} />
          <span style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 9, color: "#444444",
          }}>● LIVE</span>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "hidden", paddingBottom: "64px" }} className="md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

      {/* Global Copilot overlay */}
      <GlobalCopilot />
    </div>
  );
}
