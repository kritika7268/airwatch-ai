import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Clock, Users, ArrowRight, CheckCircle2, ChevronRight, ShieldCheck, Flame } from 'lucide-react';

export default function AuthorityAlertPanel({ alerts, currentCity, onStatusUpdate }) {
  const [updatingId, setUpdatingId] = useState(null);

  // Filter alerts for selected city or show all active
  const cityAlerts = (alerts || []).filter(a => !currentCity || a.city === currentCity);

  const handleUpdateStatus = async (alertId, nextStatus, teamName = null) => {
    setUpdatingId(alertId);
    try {
      const response = await fetch(`/api/alert/${alertId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          assigned_team: teamName || `${currentCity} Nagar Nigam Rapid Response Squad & Task Force`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update alert status');
      }

      const data = await response.json();
      if (onStatusUpdate) {
        onStatusUpdate(data.alert);
      }
    } catch (err) {
      console.error('Error updating alert:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: Clock,
          label: 'Pending Triage'
        };
      case 'Assigned':
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          icon: Users,
          label: 'Team Dispatched'
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'Resolved & Mitigated'
        };
      default:
        return {
          bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
          icon: Clock,
          label: status
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide m-0">
                Municipal Authority Dispatch & Alert Console
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Risk &ge; 70 Escalations
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0">
              Live actionable alerts routed to Nagar Nigam, UPPCB, and Traffic Task Forces
            </p>
          </div>
        </div>

        {/* Workflow indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span className="text-rose-400">Pending</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-cyan-400">Assigned</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-400">Resolved</span>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="mt-4 space-y-3.5">
        {cityAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-xs font-semibold text-slate-400">No active high-risk alerts for {currentCity}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Alerts auto-trigger when Gemini Risk Score exceeds 70.
            </p>
          </div>
        ) : (
          cityAlerts.map(alert => {
            const statusConfig = getStatusBadge(alert.status);
            const StatusIcon = statusConfig.icon;
            const isCritical = alert.risk_score >= 80;

            return (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.status === 'Resolved' 
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-75' 
                    : isCritical
                      ? 'bg-gradient-to-r from-rose-950/20 to-slate-900 border-rose-500/40'
                      : 'bg-slate-950/80 border-amber-500/30'
                }`}
              >
                {/* Alert Top Row */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      [{alert.id}]
                    </span>
                    <h3 className="text-sm font-bold text-white m-0">
                      {alert.hotspot_name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isCritical ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      Risk {alert.risk_score}/100
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig.bg}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig.label}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {alert.timestamp}
                    </span>
                  </div>
                </div>

                {/* Root Cause & Action Box */}
                <div className="space-y-1.5 my-2.5 text-xs">
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                      Likely Cause:
                    </span>
                    <p className="text-slate-300 leading-relaxed m-0">
                      {alert.likely_cause}
                    </p>
                  </div>

                  <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-800/30">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                      Authority Directive (Gemini Recommended Action):
                    </span>
                    <p className="text-emerald-200/90 leading-relaxed font-medium m-0">
                      {alert.recommended_action}
                    </p>
                  </div>
                </div>

                {/* Assigned Team Info */}
                {alert.assigned_team && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-3">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dispatched Unit:</span>
                    <strong className="text-slate-200">{alert.assigned_team}</strong>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Trigger: {alert.trigger_source || 'Gemini 2.0 Flash'}
                  </span>

                  <div className="flex items-center gap-2">
                    {alert.status === 'Pending' && (
                      <>
                        <button
                          disabled={updatingId === alert.id}
                          onClick={() => handleUpdateStatus(alert.id, 'Assigned')}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Acknowledge & Assign Team</span>
                        </button>
                      </>
                    )}

                    {alert.status === 'Assigned' && (
                      <button
                        disabled={updatingId === alert.id}
                        onClick={() => handleUpdateStatus(alert.id, 'Resolved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Resolved (Action Complete)</span>
                      </button>
                    )}

                    {alert.status === 'Resolved' && (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mitigation Confirmed</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
