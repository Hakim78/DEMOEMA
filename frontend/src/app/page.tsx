"use client";

import { useTargets } from "@/lib/queries/useTargets";
import { useSignals } from "@/lib/queries/useSignals";
import { useMemo } from "react";
import type { Target, Signal } from "@/types";
import { ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

const M = { fontFamily: "'JetBrains Mono',monospace" } as const;
const S = { fontFamily: "Inter,sans-serif" } as const;

function Sparkline({ data }: { data: number[] }) {
  if (!data?.length) return null;
  const w = 40, h = 12;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke="#444444" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? "#FAFAFA" : score >= 55 ? "#888888" : "#555555";
  return <span style={{ ...M, fontSize: 12, color }}>{score}</span>;
}

function TargetRow({ t, rank }: { t: Target; rank: number }) {
  const hot = t.bodacc_recent || (t.topSignals?.[0]?.severity === "high");
  const signal = t.topSignals?.[0]?.label ?? "—";
  const trend = [60, 65, 62, 70, 68, 72, t.globalScore];

  return (
    <Link href={`/targets/${t.id}`} style={{
      display: "grid",
      gridTemplateColumns: "32px 1fr 52px 70px 48px 1fr",
      padding: "0 16px", height: 40, alignItems: "center",
      borderBottom: "1px solid #111111",
      textDecoration: "none", color: "inherit",
      transition: "background 0.1s",
    }}
      onMouseEnter={e => (e.currentTarget.style.background = "#0E0E0E")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ ...M, fontSize: 9, color: "#2A2A2A" }}>{String(rank).padStart(2, "0")}</span>
      <div>
        <span style={{ ...S, fontSize: 12, color: "#FAFAFA" }}>{t.name}</span>
        <span style={{ ...M, fontSize: 9, color: "#2A2A2A", marginLeft: 8 }}>{t.sector}</span>
      </div>
      <ScoreBar score={t.globalScore} />
      <span style={{ ...M, fontSize: 11, color: "#666666", textAlign: "right" }}>
        {t.financials?.revenue ?? "—"}
      </span>
      <Sparkline data={trend} />
      <span style={{
        ...M, fontSize: 9,
        color: hot ? "#FF4500" : "#444444",
        letterSpacing: "0.02em",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {signal.toUpperCase()}
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: targetsData, isLoading } = useTargets();
  const { data: signalsData } = useSignals();

  const targets = useMemo(() =>
    [...(targetsData?.data ?? [])].sort((a, b) => b.globalScore - a.globalScore).slice(0, 20),
    [targetsData]
  );

  const total = targetsData?.total ?? 0;
  const avgScore = useMemo(() => {
    if (!targets.length) return 0;
    return Math.round(targets.reduce((s: number, t: Target) => s + t.globalScore, 0) / targets.length);
  }, [targets]);

  const hotCount = useMemo(() =>
    (targetsData?.data ?? []).filter((t: Target) => t.bodacc_recent || t.topSignals?.some((s: Signal) => s.severity === "high")).length,
    [targetsData]
  );

  const kpis = [
    { label: "CIBLES_ACTIVES",  value: total.toLocaleString("fr"),    delta: "+2.3K",  up: true  },
    { label: "AVG_SCORE",       value: avgScore.toString(),            delta: "STABLE", up: null  },
    { label: "SIGNAUX_CHAUDS",  value: hotCount.toLocaleString("fr"),  delta: "LIVE",   up: true  },
    { label: "BODACC_24H",      value: "1,094",                        delta: "SYNC",   up: null  },
  ];

  const feed = useMemo(() =>
    (signalsData?.data ?? []).slice(0, 18).map((s: Signal & { targetName?: string }, i: number) => ({
      time: `${String(8 + Math.floor(i / 3)).padStart(2,"0")}:${String((i * 7) % 60).padStart(2,"0")}:${String((i * 13) % 60).padStart(2,"0")}`,
      company: s.targetName ?? "—",
      action: s.label ?? s.source ?? "Signal détecté",
      hot: i < 3,
    })),
    [signalsData]
  );

  const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden", background: "#0A0A0A" }}>

      {/* Top KPI bar */}
      <div style={{
        height: 40, borderBottom: "1px solid #1F1F1F", flexShrink: 0,
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 0,
        background: "#050505",
      }}>
        <span style={{ ...M, fontSize: 10, color: "#444444", letterSpacing: "0.1em", marginRight: 24 }}>
          EdRCF_6.0
        </span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 24 }}>
          {kpis.map(k => (
            <div key={k.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ ...M, fontSize: 9, color: "#333333", letterSpacing: "0.1em" }}>{k.label}</span>
              <span style={{ ...M, fontSize: 11, color: "#FAFAFA", fontWeight: 500 }}>{k.value}</span>
              <span style={{ ...M, fontSize: 9, color: k.up === true ? "#4A9A5A" : k.up === false ? "#FF4500" : "#444444" }}>
                {k.delta}
              </span>
            </div>
          ))}
        </div>
        <span style={{ ...M, fontSize: 9, color: "#4A9A5A" }}>● {now}</span>
      </div>

      {/* Command bar */}
      <div style={{
        height: 48, borderBottom: "1px solid #1F1F1F", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 16px",
      }}>
        <div style={{
          width: "40%", display: "flex", alignItems: "center",
          borderBottom: "1px solid #1F1F1F", paddingBottom: 2, gap: 8,
        }}>
          <span style={{ ...M, fontSize: 12, color: "#333333" }}>›</span>
          <input
            placeholder="/requête  (ex: top 20 agro bretagne CA>5M)"
            onFocus={() => window.dispatchEvent(new CustomEvent("toggle-copilot"))}
            readOnly
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#666666", fontFamily: "Inter,sans-serif", fontSize: 12,
              cursor: "pointer",
            }}
          />
          <span style={{ ...M, fontSize: 10, color: "#2A2A2A", whiteSpace: "nowrap" }}>⌘K</span>
        </div>
      </div>

      {/* Main split */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left — vault list */}
        <div style={{ flex: "0 0 75%", display: "flex", flexDirection: "column", borderRight: "1px solid #1F1F1F", overflow: "hidden" }}>

          {/* Tab bar */}
          <div style={{
            height: 36, borderBottom: "1px solid #1F1F1F",
            display: "flex", alignItems: "center", padding: "0 0 0 16px",
            gap: 0, flexShrink: 0,
          }}>
            <span style={{ ...M, fontSize: 10, color: "#FAFAFA", letterSpacing: "0.1em", padding: "0 12px", height: 36, display: "flex", alignItems: "center", borderBottom: "1px solid #FAFAFA" }}>
              PRIORITY_TARGETS_STREAM
            </span>
            <span style={{ ...M, fontSize: 10, color: "#333333", letterSpacing: "0.1em", padding: "0 12px", height: 36, display: "flex", alignItems: "center" }}>
              PIPELINE
            </span>
            <div style={{ flex: 1 }} />
            <Link href="/targets" style={{
              ...M, fontSize: 9, color: "#444444", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 4, paddingRight: 16,
            }}>
              VOIR TOUT <ChevronRight size={10} />
            </Link>
          </div>

          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "32px 1fr 52px 70px 48px 1fr",
            padding: "0 16px", height: 28, alignItems: "center",
            borderBottom: "1px solid #1A1A1A", flexShrink: 0,
          }}>
            {["#", "NOM", "SCORE", "CA (M€)", "ÉVO.", "SIGNAL"].map(h => (
              <span key={h} style={{ ...M, fontSize: 9, color: "#333333", letterSpacing: "0.12em" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: "auto" }} className="thin-scrollbar">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ height: 40, borderBottom: "1px solid #111111", padding: "0 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 120, height: 8, background: "#111111", borderRadius: 2 }} />
                  <div style={{ width: 30, height: 8, background: "#111111", borderRadius: 2 }} />
                </div>
              ))
              : targets.map((t, i) => <TargetRow key={t.id} t={t} rank={i + 1} />)
            }
          </div>

          {/* Status bar */}
          <div style={{
            height: 28, borderTop: "1px solid #1F1F1F",
            display: "flex", alignItems: "center",
            padding: "0 16px", gap: 16, flexShrink: 0,
          }}>
            <span style={{ ...M, fontSize: 9, color: "#2A2A2A", letterSpacing: "0.08em" }}>
              SILVER {(10.4).toLocaleString("fr")}M   GOLD {(194.8).toLocaleString("fr")}K   BODACC 1,094
            </span>
            <div style={{ flex: 1 }} />
            <span style={{ ...M, fontSize: 9, color: "#4A9A5A" }}>● LIVE</span>
          </div>
        </div>

        {/* Right — feed */}
        <div style={{ flex: "0 0 25%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            height: 36, borderBottom: "1px solid #1F1F1F",
            display: "flex", alignItems: "center", padding: "0 12px",
            gap: 6, flexShrink: 0,
          }}>
            <Activity size={10} style={{ color: "#FF4500" }} />
            <span style={{ ...M, fontSize: 10, color: "#444444", letterSpacing: "0.1em" }}>FEED_LIVE</span>
            <div style={{ flex: 1 }} />
            <span style={{ ...M, fontSize: 9, color: "#2A2A2A" }}>{feed.length} events</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }} className="thin-scrollbar">
            {feed.map((f: { time: string; company: string; action: string; hot: boolean }, i: number) => (
              <div key={i} style={{
                padding: "8px 12px", borderBottom: "1px solid #111111",
                display: "flex", flexDirection: "column", gap: 2,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ ...M, fontSize: 9, color: "#2A2A2A", whiteSpace: "nowrap" }}>{f.time}</span>
                  <span style={{ ...S, fontSize: 11, color: f.hot ? "#FF4500" : "#FAFAFA", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.company}
                  </span>
                </div>
                <span style={{ ...M, fontSize: 9, color: "#444444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
