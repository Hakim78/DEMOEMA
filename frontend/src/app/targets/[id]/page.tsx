"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Target, ShieldCheck, Zap, TrendingUp, AlertCircle, 
  Share2, ArrowRight, Radio, Fingerprint, Activity, Clock, 
  Users, Briefcase, Crosshair, MapPin, Gauge
} from "lucide-react";
import { useParams } from "next/navigation";
import { Target as TargetType } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function TargetDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [targetData, setTargetData] = useState<TargetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAction = (name: string, message: string) => {
    setProcessingAction(name);
    setTimeout(() => {
      setProcessingAction(null);
      setNotification({ message, type: 'success' });
    }, 1500);
  };

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetch(`${API_URL}/api/targets/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(json => {
        setTargetData(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full" />
          <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(79,70,229,0.5)]" />
        </div>
        <span className="font-black uppercase tracking-[0.4em] text-[10px] text-indigo-400">Initializing EDRCF Intercept Node {id}...</span>
      </div>
    );
  }

  if (error || !targetData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 shadow-2xl">
            <AlertCircle size={40} className="text-rose-500" />
          </div>
          <h1 className="text-3xl font-black mb-3 tracking-tighter">Intercept Failed</h1>
          <p className="text-gray-400 mb-8 max-w-sm text-center font-medium leading-relaxed">Intelligence node {id} is currently unreachable or does not exist in the primary vault.</p>
          <Link href="/" className="px-8 py-4 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-500 transition-all font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30">
            Return to Command Center
          </Link>
        </div>
      );
  }

  const getPriorityColor = (level: string) => {
    if (level === "Opportunité Forte") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (level === "Cible Prioritaire") return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    if (level === "Cible à Préparer") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-gray-400 bg-white/5 border-white/10";
  };

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto pb-32 pt-6 px-4 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[200] px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 border border-indigo-400 backdrop-blur-xl"
          >
            <ShieldCheck size={16} /> {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-6 border-b border-white/5 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Link href="/targets" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-xl group shrink-0">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white truncate max-w-full uppercase">{targetData.name}</h1>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${getPriorityColor(targetData.priorityLevel)}`}>
                {targetData.priorityLevel}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="flex items-center gap-2.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest w-fit">
                  {targetData.sector} • EDRCF Radar V5.0
               </div>
               <p className="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                  ID: <span className="text-gray-300">{targetData.id.toUpperCase()}</span> • Transaction Window: <span className="text-white">{targetData.analysis.window}</span>
               </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
          <button 
            onClick={() => handleAction('share', 'Dossier link copied')}
            className="flex-1 lg:flex-none w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
          >
            <Share2 size={24} />
          </button>
          <button 
            disabled={processingAction === 'fetch'}
            onClick={() => handleAction('fetch', 'Radar synchronized')}
            className="flex-[4] lg:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
          >
            {processingAction === 'fetch' ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Activity size={20} />
            )}
            {processingAction === 'fetch' ? 'Scanning...' : 'Radar Refresh'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column - Origination Card */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Fiche d'Origination Core */}
          <div className="p-10 rounded-[3rem] bg-black/40 border border-indigo-500/20 relative overflow-hidden group shadow-2xl backdrop-blur-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-12">
                <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Fingerprint size={32} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80 mb-1">EDRCF Integrity</div>
                  <div className="text-xs font-black text-white flex items-center gap-2 justify-end">
                    <ShieldCheck size={14} className="text-emerald-500" /> 100% SECURE
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center mb-12">
                <div className="relative">
                  <svg className="w-64 h-64 transform -rotate-90">
                    <circle cx="128" cy="128" r="115" stroke="rgba(255,255,255,0.03)" strokeWidth="16" fill="transparent" />
                    <motion.circle 
                      initial={{ strokeDashoffset: 2 * Math.PI * 115 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 115 * (1 - targetData.globalScore / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="128" cy="128" r="115" 
                      stroke="url(#gradient-radar)" 
                      strokeWidth="16" 
                      strokeDasharray={2 * Math.PI * 115} 
                      strokeLinecap="round" 
                      fill="transparent" 
                    />
                    <defs>
                      <linearGradient id="gradient-radar" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-white leading-none tracking-tighter">{targetData.globalScore}</span>
                    <span className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Score Global</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Signal Breakdown</h4>
                {Object.entries(targetData.scores).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 capitalize">{key}</span>
                    <span className="text-sm font-black text-white">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* activation & Context */}
          <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Crosshair size={120} />
             </div>
             <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
               <Crosshair size={18} /> Activation Strategique
             </h4>
             <div className="space-y-6 relative z-10">
                <div>
                   <div className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-1.5 opacity-60">Angle d'approche</div>
                   <div className="text-sm font-bold leading-relaxed">{targetData.activation.approach}</div>
                </div>
                <div>
                   <div className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-1.5 opacity-60">Raison objective</div>
                   <div className="text-sm font-bold leading-relaxed">{targetData.activation.reason}</div>
                </div>
             </div>
          </div>

        </div>

        {/* Right Column - Deep Analysis */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Fiche d'Origination Narrative */}
          <div className="p-12 rounded-[3.5rem] bg-black/40 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
               <h3 className="text-3xl font-black tracking-tighter text-white">Analyse Narrative</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
               <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Type Probable</h4>
                  <div className="text-2xl font-black text-white italic">{targetData.analysis.type}</div>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Lecture Stratégique</h4>
                  <p className="text-gray-300 leading-relaxed font-bold tracking-tight text-lg">
                    {targetData.analysis.narrative}
                  </p>
               </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Top 5 Signaux Détectés</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {targetData.topSignals.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-indigo-500/30 transition-all">
                       <span className="text-indigo-500 font-black text-xs">0{idx+1}</span>
                       <div>
                          <div className="text-xs font-black text-white uppercase tracking-tight">{s.label}</div>
                          <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{s.family}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {/* Décideurs Section */}
             <div className="p-10 rounded-[3rem] bg-black/40 border border-white/10">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                   <Users size={16} /> Décideurs Probables
                </h3>
                <div className="flex flex-col gap-4">
                   {targetData.activation.deciders.map((d, i) => (
                     <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                           <Users size={20} />
                        </div>
                        <span className="font-black text-sm text-white">{d}</span>
                     </div>
                   ))}
                </div>
             </div>

             {/* Risques Section */}
             <div className="p-10 rounded-[3rem] bg-rose-500/5 border border-rose-500/10">
                <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                   <AlertCircle size={16} /> Vigilance & Risques
                </h3>
                <div className="space-y-6">
                   <div>
                      <div className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest mb-1.5">Risque de Faux Positif</div>
                      <div className="text-lg font-black text-rose-200">{targetData.risks.falsePositive}</div>
                   </div>
                   <div>
                      <div className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest mb-1.5">Points d'incertitude</div>
                      <p className="text-xs font-bold text-gray-400 leading-relaxed">{targetData.risks.uncertainties}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Generate PDF Section */}
          <div className="p-10 rounded-[3rem] bg-white text-black flex flex-col sm:flex-row items-center justify-between gap-8">
             <div className="text-center sm:text-left">
                <h4 className="text-2xl font-black tracking-tighter mb-1">Dossier d'Origination Complet</h4>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Générer le rapport PDF pour comité</p>
             </div>
             <Link href={`/targets/${id}/report`} className="px-12 py-5 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-4 shadow-2xl active:scale-95">
                Générer Dossier <ArrowRight size={20} />
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
