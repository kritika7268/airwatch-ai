import React from 'react';
import { Network, ShieldCheck, Database, ArrowRight, Lock, Share2, Globe2 } from 'lucide-react';

export default function FederationSection() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Background visual motif */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide m-0">
                Federated Cross-City Intelligence Grid
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Interoperability Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0">
              State-wide Scalability Across Indian Municipalities & Air Sheds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-800/40 px-3 py-1 rounded-lg">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero Citizen PII Leakage • Edge Sovereignty</span>
        </div>
      </div>

      {/* Diagram Section */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch relative">
          
          {/* Box 1: Local City Model (Kanpur / Lucknow) */}
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between relative group hover:border-cyan-500/60 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Node 1: Local Municipal Edge
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              </div>
              <h3 className="text-sm font-bold text-white m-0">
                Local City Model (e.g. Kanpur / Lucknow)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed m-0">
                Ingests local CPCB CAAQMS sensors, micro-weather wind sensors, and crowdsourced citizen photos within municipal borders.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-300/90 font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Raw photos & GPS stay strictly local</span>
            </div>
          </div>

          {/* Connection Arrow 1 (Desktop) */}
          <div className="hidden md:flex absolute top-1/2 left-[32.5%] -translate-y-1/2 z-10 -ml-3">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 shadow-md">
              <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
            </div>
          </div>

          {/* Box 2: Shared Model Layer */}
          <div className="bg-gradient-to-b from-purple-950/30 to-slate-950 border border-purple-500/40 rounded-xl p-4 flex flex-col justify-between relative group hover:border-purple-500/70 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                  Aggregation Layer
                </span>
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white m-0">
                Shared Federated Model Layer
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed m-0">
                Harmonizes cross-city plume dispersion patterns, seasonal stubble-burning trajectories, and industrial emission vectors into an open weight consensus.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-purple-300 font-mono flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Weights & insights federated only</span>
            </div>
          </div>

          {/* Connection Arrow 2 (Desktop) */}
          <div className="hidden md:flex absolute top-1/2 left-[66%] -translate-y-1/2 z-10 -ml-3">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 shadow-md">
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Box 3: Other Indian Cities / States */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between relative group hover:border-emerald-500/60 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Node N: Inter-City Grid
                </span>
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white m-0">
                Other Cities & Downwind States (e.g. Delhi-NCR, Varanasi, Patna)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed m-0">
                Instantly receives early warning intelligence of inbound transboundary regional smoke plumes without waiting for local ground sensor spikes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Proactive inter-state coordination</span>
            </div>
          </div>

        </div>
      </div>

      {/* Explanatory 3-Line Summary satisfying hackathon criteria */}
      <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1.5 text-xs text-slate-300">
        <p className="font-semibold text-slate-100 flex items-center gap-1.5 m-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Privacy-Preserving Interoperability Architecture:</span>
        </p>
        <p className="text-slate-400 leading-relaxed m-0">
          <strong>1. Local Data Sovereignty:</strong> Raw citizen report imagery, location coordinates, and municipal sensor feeds remain securely contained on municipal servers.
        </p>
        <p className="text-slate-400 leading-relaxed m-0">
          <strong>2. Federated Insight Exchange:</strong> Only sanitized model weight updates, pollution classification heuristics, and meteorological dispersion coefficients are transmitted to the national shared layer.
        </p>
        <p className="text-slate-400 leading-relaxed m-0">
          <strong>3. Pan-India Scalability:</strong> Any Indian municipal corporation (from tier-1 metros like Delhi to tier-2 hubs like Kanpur and Prayagraj) can plug in their CPCB CAAQMS feed to immediately leverage collective regional intelligence.
        </p>
      </div>

    </div>
  );
}
