import React, { useState } from 'react';
import { Wind, Key, ShieldCheck, RefreshCw, Cpu, ExternalLink, MapPin } from 'lucide-react';

export default function Navbar({ 
  currentCity, 
  onSelectCity, 
  availableCities, 
  geminiStatus, 
  onOpenKeyModal, 
  onResetDemo,
  isResetting 
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wind className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0">AirWatch AI</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                Google AI Hackathon
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0 hidden sm:block">
              Hyperlocal Air Pollution Intelligence & Civic Resilience • Clean Air Track
            </p>
          </div>
        </div>

        {/* Center: City Selector */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
          <MapPin className="w-4 h-4 text-emerald-400 ml-1" />
          <span className="text-xs font-medium text-slate-400">City:</span>
          <select 
            value={currentCity} 
            onChange={(e) => onSelectCity(e.target.value)}
            className="bg-slate-800 text-slate-100 text-xs font-semibold py-1 px-2.5 rounded border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}, UP
              </option>
            ))}
          </select>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Gemini Model Indicator */}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              geminiStatus?.is_configured
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-700/50 hover:bg-amber-900/40'
            }`}
            title="Click to configure Google Gemini API Key"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {geminiStatus?.is_configured ? 'Gemini 2.0 Flash: Live' : 'Gemini 2.0: Fallback Mode'}
            </span>
            <span className={`w-2 h-2 rounded-full ${geminiStatus?.is_configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <Key className="w-3 h-3 text-slate-400 hover:text-white ml-1" />
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            title="Reset to baseline seed data"
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
}
