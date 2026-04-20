"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, X, ChevronDown, Copy, Check, Trash2, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

const M = { fontFamily: "'JetBrains Mono',monospace" } as const;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  source?: string;
}

const SUGGESTIONS: Record<string, string[]> = {
  "/":         ["Top 20 cibles prioritaires", "Fondateurs > 60 ans", "Signaux BODACC récents"],
  "/targets":  ["Cibles score > 65", "Entreprises familiales", "Rechercher par SIREN"],
  "/pipeline": ["État du pipeline", "Cibles en closing", "Taux de conversion"],
  "/signals":  ["Signaux haute priorité", "Alertes BODACC", "Tendances sectorielles"],
  "/graph":    ["Chemins d'approche clés", "Connexions dirigeants", "Nœuds influents"],
  "/map":      ["Top 10 région Île-de-France", "Cibles chaud secteur Industrie", "Carte scoring"],
};

export default function GlobalCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMin, setIsMin] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestions = SUGGESTIONS[pathname] ?? SUGGESTIONS["/"];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  useEffect(() => {
    if (isOpen && !isMin) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, isMin]);

  useEffect(() => {
    const toggle = () => setIsOpen(p => !p);
    window.addEventListener("toggle-copilot", toggle);
    return () => window.removeEventListener("toggle-copilot", toggle);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "j") { e.preventDefault(); setIsOpen(p => !p); }
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const send = async (e?: React.FormEvent, preset?: string) => {
    if (e) e.preventDefault();
    const q = preset ?? input;
    if (!q.trim() || loading) return;
    const uid = Date.now().toString();
    const aid = (Date.now() + 1).toString();
    setMsgs(p => [...p, { id: uid, role: "user", content: q, timestamp: Date.now() }]);
    setInput("");
    setLoading(true);
    setMsgs(p => [...p, { id: aid, role: "assistant", content: "", timestamp: Date.now() }]);

    try {
      const res = await fetch(`/api/copilot/stream?q=${encodeURIComponent(q)}`);
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const ev = JSON.parse(line.slice(6));
            if (ev.chunk) setMsgs(p => p.map(m => m.id === aid ? { ...m, content: m.content + ev.chunk } : m));
            if (ev.done && ev.source) setMsgs(p => p.map(m => m.id === aid ? { ...m, source: ev.source } : m));
          } catch { /* ignore */ }
        }
      }
    } catch {
      try {
        const r = await fetch(`/api/copilot/query?q=${encodeURIComponent(q)}`);
        const d = await r.json();
        setMsgs(p => p.map(m => m.id === aid ? { ...m, content: d.response || "Erreur serveur." } : m));
      } catch {
        setMsgs(p => p.map(m => m.id === aid ? { ...m, content: "ERREUR: Serveur inaccessible." } : m));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Copilot IA (⌘J)"
        style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 200,
          width: 40, height: 40,
          background: "#0A0A0A", border: "1px solid #1F1F1F",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#FF4500",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#FF4500")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#1F1F1F")}
      >
        {msgs.length > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            width: 14, height: 14, borderRadius: "50%",
            background: "#FF4500", border: "2px solid #0A0A0A",
            display: "flex", alignItems: "center", justifyContent: "center",
            ...M, fontSize: 7, color: "#0A0A0A",
          }}>{msgs.filter(m => m.role === "assistant").length}</span>
        )}
        <Sparkles size={14} />
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      bottom: isMin ? 20 : 0, right: 0,
      width: isMin ? 260 : "100%", maxWidth: isMin ? 260 : 400,
      height: isMin ? 48 : "min(600px, 100dvh)",
      background: "#050505", border: "1px solid #1F1F1F",
      borderBottom: isMin ? "1px solid #1F1F1F" : "none",
      display: "flex", flexDirection: "column",
      zIndex: 200, overflow: "hidden",
      transition: "all 0.2s",
    }}>
      {/* Header */}
      <div style={{
        height: 40, borderBottom: "1px solid #1F1F1F", flexShrink: 0,
        display: "flex", alignItems: "center", padding: "0 12px", gap: 8,
        background: "#080808",
      }}>
        <Sparkles size={11} style={{ color: "#FF4500" }} />
        <span style={{ ...M, fontSize: 9, color: "#444444", letterSpacing: "0.15em", flex: 1 }}>COPILOT_EDRCF_6.0</span>
        <span style={{ ...M, fontSize: 8, color: "#4A9A5A" }}>● LIVE</span>
        {msgs.length > 0 && (
          <button onClick={() => setMsgs([])} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#333333", display: "flex", padding: 2 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FF4500")}
            onMouseLeave={e => (e.currentTarget.style.color = "#333333")}
          ><Trash2 size={10} /></button>
        )}
        <button onClick={() => setIsMin(p => !p)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#333333", display: "flex", padding: 2 }}>
          <ChevronDown size={12} style={{ transform: isMin ? "rotate(180deg)" : "none" }} />
        </button>
        <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#333333", display: "flex", padding: 2 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#FAFAFA")}
          onMouseLeave={e => (e.currentTarget.style.color = "#333333")}
        ><X size={12} /></button>
      </div>

      {!isMin && (
        <>
          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "12px 0" }} className="thin-scrollbar">
            {msgs.length === 0 ? (
              <div style={{ padding: "24px 16px" }}>
                <div style={{ ...M, fontSize: 9, color: "#2A2A2A", letterSpacing: "0.15em", marginBottom: 16 }}>REQUÊTES_SUGGÉRÉES</div>
                {suggestions.map(s => (
                  <button key={s} onClick={() => send(undefined, s)} style={{
                    width: "100%", textAlign: "left", padding: "8px 12px",
                    borderBottom: "1px solid #111111", background: "transparent", border: "none",
                    borderLeft: "2px solid transparent", cursor: "pointer",
                    ...M, fontSize: 10, color: "#333333", letterSpacing: "0.04em",
                    display: "block",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#FAFAFA"; e.currentTarget.style.borderLeftColor = "#FF4500"; e.currentTarget.style.background = "#0D0D0D"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#333333"; e.currentTarget.style.borderLeftColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              msgs.map(m => (
                <div key={m.id} style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #0D0D0D",
                  borderLeft: `2px solid ${m.role === "user" ? "transparent" : "#1A1A1A"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ ...M, fontSize: 8, color: m.role === "user" ? "#FF4500" : "#444444", letterSpacing: "0.12em" }}>
                      {m.role === "user" ? "VOUS" : "COPILOT"}
                    </span>
                    {m.source && (
                      <span style={{ ...M, fontSize: 7, color: "#333333", letterSpacing: "0.08em" }}>{m.source}</span>
                    )}
                    <span style={{ ...M, fontSize: 7, color: "#222222", marginLeft: "auto" }}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {m.role === "assistant" && m.content && (
                      <button onClick={() => copy(m.content, m.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#333333", display: "flex" }}>
                        {copied === m.id ? <Check size={9} style={{ color: "#4A9A5A" }} /> : <Copy size={9} />}
                      </button>
                    )}
                  </div>
                  <div style={{ ...M, fontSize: 11, color: "#FAFAFA", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {m.content || (m.role === "assistant" && loading ? (
                      <span style={{ color: "#333333" }}>…</span>
                    ) : "")}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Suggestions strip after messages */}
          {msgs.length > 0 && msgs.length < 6 && !loading && (
            <div style={{ borderTop: "1px solid #111111", padding: "6px 12px", display: "flex", gap: 4, flexWrap: "wrap" }}>
              {suggestions.slice(0, 2).map(s => (
                <button key={s} onClick={() => send(undefined, s)} style={{
                  ...M, fontSize: 8, color: "#444444", background: "transparent",
                  border: "1px solid #1F1F1F", padding: "3px 8px", cursor: "pointer",
                  letterSpacing: "0.06em",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#FAFAFA"; e.currentTarget.style.borderColor = "#FF4500"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#444444"; e.currentTarget.style.borderColor = "#1F1F1F"; }}
                >{s.slice(0, 20)}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "8px 12px", borderTop: "1px solid #1F1F1F", background: "#080808" }}>
            <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Requête intelligence M&A…"
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "1px solid #1F1F1F",
                  padding: "8px 10px", color: "#FAFAFA",
                  ...M, fontSize: 10, outline: "none", resize: "none",
                  lineHeight: 1.5, minHeight: 34, maxHeight: 100,
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  width: 34, height: 34, flexShrink: 0,
                  background: input.trim() && !loading ? "#FF4500" : "#111111",
                  border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: input.trim() && !loading ? "#0A0A0A" : "#333333",
                  transition: "background 0.15s",
                  alignSelf: "flex-end",
                }}
              >
                <Send size={13} />
              </button>
            </form>
            <div style={{ ...M, fontSize: 7, color: "#2A2A2A", marginTop: 4, textAlign: "center", letterSpacing: "0.1em" }}>
              ENTRÉE — ENVOYER · MAJ+ENTRÉE — SAUT · ⌘J — TOGGLE
            </div>
          </div>
        </>
      )}
    </div>
  );
}
