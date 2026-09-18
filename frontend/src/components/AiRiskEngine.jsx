import React, { useState } from 'react';
import { Cpu, Sparkles, Send, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, Wind, Eye } from 'lucide-react';

export default function AiRiskEngine({ currentCity, onPredictionComplete }) {
  // Input parameters
  const [pm25, setPm25] = useState(188);
  const [pm10, setPm10] = useState(315);
  const [windSpeed, setWindSpeed] = useState(3.2);
  const [reportCount, setReportCount] = useState(12);
  const [visionType, setVisionType] = useState('industrial_smoke');
  const [hotspotName, setHotspotName] = useState('Panki Industrial Area, Phase II');

  // Loading & Result state
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const runPrediction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pm25: parseFloat(pm25),
          pm10: parseFloat(pm10),
          wind_speed: parseFloat(windSpeed),
          report_count: parseInt(reportCount),
          recent_vision_type: visionType,
          city: currentCity,
          hotspot_name: hotspotName
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);

      if (onPredictionComplete) {
        onPredictionComplete(data);
      }
    } catch (err) {
      console.error('Error in AI prediction:', err);
      setError(err.message || 'Failed to execute Gemini reasoning call');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (score) => {
    if (score >= 80) {
      return {
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        label: 'CRITICAL HAZARD',
        bar: 'bg-rose-500',
        ring: 'border-rose-500'
      };
    }
    if (score >= 50) {
      return {
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        label: 'HIGH RISK',
        bar: 'bg-amber-500',
        ring: 'border-amber-500'
      };
    }
    return {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      label: 'MODERATE / NORMAL',
      bar: 'bg-emerald-500',
      ring: 'border-emerald-500'
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide m-0">
                Gemini 2.0 Flash AI Risk Engine
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Core AI Demo
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0">
              Multivariable Environmental Physics & Civic Reasoning
            </p>
          </div>
        </div>

        {/* Live Model Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>model: gemini-2.0-flash</span>
        </div>
      </div>

      {/* Interactive Telemetry Tuning Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        
        {/* Controls Column */}
        <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center justify-between">
            <span>Simulation Parameters (CPCB Inputs)</span>
            <span className="text-[10px] text-emerald-400 font-normal">Adjust & Run Live</span>
          </p>

          {/* Hotspot location */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Target Hotspot / Ward</label>
            <input
              type="text"
              value={hotspotName}
              onChange={(e) => setHotspotName(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* PM2.5 Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Sensor PM2.5:</span>
              <span className="font-mono font-bold text-rose-400">{pm25} µg/m³</span>
            </div>
            <input
              type="range"
              min="30"
              max="280"
              value={pm25}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPm25(val);
                setPm10(Math.round(val * 1.65));
              }}
              className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Standard (60)</span>
              <span>Unhealthy (120)</span>
              <span>Severe (250+)</span>
            </div>
          </div>

          {/* Wind Speed & Citizen Reports */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Wind Speed:</span>
                <span className="font-mono text-cyan-400">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">
                {windSpeed < 4 ? '⚠️ Stagnant Inversion' : 'Normal dispersion'}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Citizen Reports:</span>
                <span className="font-mono text-amber-400">{reportCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={reportCount}
                onChange={(e) => setReportCount(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Last 60 mins</span>
            </div>
          </div>

          {/* Gemini Multimodal Vision Type */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">
              Gemini Vision Classification Input
            </label>
            <select
              value={visionType}
              onChange={(e) => setVisionType(e.target.value)}
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="industrial_smoke">Industrial Smoke (Boiler stacks, foundries)</option>
              <option value="crop_burning">Crop Stubble Burning (Parali/biomass)</option>
              <option value="vehicle_emission">Heavy Diesel Exhaust (Truck corridors)</option>
              <option value="dust">Fugitive Road / Construction Dust</option>
              <option value="other">Municipal Waste Burning / Urban Smog</option>
            </select>
          </div>

          {/* Execute Button */}
          <button
            onClick={runPrediction}
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Reasoning with Gemini 2.0 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Run Live Gemini Risk Reasoning</span>
              </>
            )}
          </button>
        </div>

        {/* Live Analysis Output Card */}
        <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[300px]">
          
          {isLoading ? (
            /* Loading State with animated scanner */
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-2 border-cyan-500/50 animate-spin"></div>
                <Cpu className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-slate-200">Querying Google Gemini 2.0 Flash...</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Fusing PM2.5 telemetry ({pm25} µg/m³), wind physics ({windSpeed} km/h), and citizen photo patterns.
              </p>
            </div>
          ) : prediction ? (
            /* Prediction Result Output */
            <div className="space-y-4">
              
              {/* Header result row */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Synthesized Risk Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl font-extrabold text-white">
                      {prediction.risk_score}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadge(prediction.risk_score).bg}`}>
                    {prediction.status} Hazard
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    {prediction.ai_badge}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getRiskBadge(prediction.risk_score).bar}`}
                  style={{ width: `${Math.min(100, prediction.risk_score)}%` }}
                ></div>
              </div>

              {/* Likely Cause Diagnosis */}
              <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-800 text-xs">
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Likely Cause Diagnosis</span>
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {prediction.likely_cause}
                </p>
              </div>

              {/* Recommended Authority Action */}
              <div className="bg-emerald-950/30 p-3.5 rounded-lg border border-emerald-800/40 text-xs">
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Recommended Municipal Action</span>
                </p>
                <p className="text-emerald-200/90 leading-relaxed font-medium">
                  {prediction.recommended_action}
                </p>
                <div className="mt-2 pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Designated Authority:</span>
                  <span className="text-slate-200 font-semibold">{prediction.target_authority}</span>
                </div>
              </div>

              {/* Alert confirmation note */}
              {prediction.alert_created && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>High Risk Trigger: Alert automatically posted to Authority Panel!</span>
                </div>
              )}

            </div>
          ) : (
            /* Initial Empty State */
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-slate-500">
              <Sparkles className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">Ready for Gemini Multivariable Reasoning</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Click "Run Live Gemini Risk Reasoning" to pass the sensor telemetry and citizen photos to Gemini 2.0 Flash.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
