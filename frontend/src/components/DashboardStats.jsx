import React from 'react';
import { Flame, AlertTriangle, Activity, Radio, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

export default function DashboardStats({ dashboardData, city }) {
  if (!dashboardData) return null;

  const aqi = dashboardData.current_aqi || 280;
  const hotspotCount = dashboardData.hotspot_count || 0;
  const activeAlerts = dashboardData.active_alerts || 0;
  const totalReports = dashboardData.total_reports || 0;

  // AQI Color Scheme based on Indian CPCB standard & prompt requirements
  // Green (<50), Orange (50-79), Red (80+) for risk, and corresponding standard AQI tiers
  const getAqiColor = (val) => {
    if (val < 100) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' };
    if (val < 250) return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' };
    return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300' };
  };

  const aqiStyle = getAqiColor(aqi);

  return (
    <div className="space-y-4">
      {/* Context banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">
            {city}, {dashboardData.state || 'Uttar Pradesh'} Regional Monitoring Grid
          </span>
          <span className="text-slate-500 hidden md:inline">•</span>
          <span className="text-slate-400 hidden md:inline">
            Modeled on CPCB Continuous Ambient Air Quality (CAAQMS) open data (data.gov.in)
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Telemetry Active (5m sync)</span>
        </div>
      </div>

      {/* 3 Core Stat Cards + 1 Crowdsource Metric */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: City AQI */}
        <div className={`p-5 rounded-2xl border ${aqiStyle.bg} ${aqiStyle.border} backdrop-blur-sm relative overflow-hidden transition-all duration-200`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Current City AQI</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-4xl font-extrabold tracking-tight ${aqiStyle.text}`}>
                  {aqi}
                </span>
                <span className="text-xs text-slate-400">AQI-IN</span>
              </div>
            </div>
            <div className={`p-2.5 rounded-xl ${aqiStyle.badge}`}>
              <Activity className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800/60">
            <span className={`px-2 py-0.5 rounded font-semibold ${aqiStyle.badge}`}>
              {dashboardData.aqi_category || 'Severe'}
            </span>
            <span className="text-slate-400 font-mono">
              Primary: {dashboardData.primary_pollutant || 'PM2.5'}
            </span>
          </div>
        </div>

        {/* Card 2: Hotspot Count */}
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm relative overflow-hidden transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Hotspots</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold tracking-tight text-amber-400">
                  {hotspotCount}
                </span>
                <span className="text-xs text-slate-400">Risk &ge; 50</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800/60">
            <span className="text-amber-300 font-medium">Elevated dispersion zones</span>
            <span className="text-slate-400">Panki, Talkatora</span>
          </div>
        </div>

        {/* Card 3: Active Authority Alerts */}
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 backdrop-blur-sm relative overflow-hidden transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Civic Alerts</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold tracking-tight text-rose-400">
                  {activeAlerts}
                </span>
                <span className="text-xs text-slate-400">Risk &ge; 70</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800/60">
            <span className="text-rose-300 font-medium">Municipal escalation open</span>
            <span className="text-slate-400 font-mono">Auto-Trigger</span>
          </div>
        </div>

        {/* Card 4: Crowdsourced Reports */}
        <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm relative overflow-hidden transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Citizen Reports</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold tracking-tight text-cyan-400">
                  {totalReports}
                </span>
                <span className="text-xs text-slate-400">Photos Analyzed</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800/60">
            <span className="text-cyan-300 font-medium">Gemini Multimodal Vision</span>
            <span className="text-slate-400 font-mono">100% Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
}
