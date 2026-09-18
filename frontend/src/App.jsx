import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import CityMap from './components/CityMap';
import AiRiskEngine from './components/AiRiskEngine';
import AuthorityAlertPanel from './components/AuthorityAlertPanel';
import FederationSection from './components/FederationSection';
import CitizenReportModal from './components/CitizenReportModal';
import ApiKeyModal from './components/ApiKeyModal';
import { Camera, Sparkles, AlertTriangle, CheckCircle, Flame, ExternalLink, RefreshCw, Eye } from 'lucide-react';

export default function App() {
  const [currentCity, setCurrentCity] = useState('Kanpur');
  const [availableCities, setAvailableCities] = useState(['Kanpur', 'Lucknow', 'Prayagraj']);
  const [dashboardData, setDashboardData] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [mapCenter, setMapCenter] = useState([26.4499, 80.3319]);
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [geminiStatus, setGeminiStatus] = useState(null);

  // Modals & loading state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all initial data
  const fetchData = async (city = currentCity) => {
    try {
      // 1. Dashboard summary
      const dashRes = await fetch(`/api/dashboard?city=${city}`);
      if (dashRes.ok) {
        const dData = await dashRes.json();
        setDashboardData(dData);
      }

      // 2. Hotspots
      const spotRes = await fetch(`/api/hotspots?city=${city}`);
      if (spotRes.ok) {
        const sData = await spotRes.json();
        setHotspots(sData.hotspots || []);
        if (sData.center) setMapCenter(sData.center);
      }

      // 3. Alerts
      const alertRes = await fetch(`/api/alerts?city=${city}`);
      if (alertRes.ok) {
        const aData = await alertRes.json();
        setAlerts(aData || []);
      }

      // 4. Reports feed
      const reportRes = await fetch(`/api/reports?city=${city}`);
      if (reportRes.ok) {
        const rData = await reportRes.json();
        setReports(rData || []);
      }

      // 5. Config & Gemini status
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const cData = await configRes.json();
        setGeminiStatus(cData.gemini);
        if (cData.cities) setAvailableCities(cData.cities);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentCity);
  }, [currentCity]);

  // Handle Hotspot Click
  const handleSelectHotspot = (spot) => {
    // Hotspot selected from map
  };

  // Handle citizen report submission
  const handleReportSubmitted = (result) => {
    fetchData(currentCity);
  };

  // Handle prediction complete
  const handlePredictionComplete = (result) => {
    fetchData(currentCity);
  };

  // Handle alert status update
  const handleStatusUpdate = (updatedAlert) => {
    setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
    // Also refresh dashboard alert count
    fetchData(currentCity);
  };

  // Reset demo
  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/reset', { method: 'POST' });
      await fetchData(currentCity);
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar 
        currentCity={currentCity}
        onSelectCity={setCurrentCity}
        availableCities={availableCities}
        geminiStatus={geminiStatus}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        
        {/* Top Section: Dashboard Stat Cards + Report Action CTA */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight m-0">
                {currentCity} Urban Air Shed Overview
              </h1>
              <p className="text-xs text-slate-400 mt-1 m-0">
                Hyperlocal particulate tracking, automated Gemini multimodal vision triage & civic dispatch
              </p>
            </div>

            {/* Prominent Citizen Report CTA */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>Report Local Pollution (Photo)</span>
            </button>
          </div>

          <DashboardStats 
            dashboardData={dashboardData} 
            city={currentCity} 
          />
        </div>

        {/* Section 2: Interactive Hotspot Map & Live Citizen Reports Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Map: 8 Cols */}
          <div className="lg:col-span-8 h-[460px]">
            <CityMap 
              hotspots={hotspots}
              center={mapCenter}
              city={currentCity}
              onSelectHotspot={handleSelectHotspot}
            />
          </div>

          {/* Citizen Reports Feed: 4 Cols */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[460px] shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white tracking-wide uppercase m-0">
                  Citizen Photo Triage
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Gemini Multimodal
              </span>
            </div>

            {/* Reports List */}
            <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
              {reports.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No citizen reports filed yet for {currentCity}.
                </div>
              ) : (
                reports.map(rep => (
                  <div 
                    key={rep.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-200 truncate">{rep.location}</strong>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        rep.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {rep.severity}
                      </span>
                    </div>

                    <div className="text-[11px] text-cyan-300 font-medium">
                      {rep.pollution_type_label || rep.pollution_type}
                    </div>

                    <p className="text-slate-400 text-[11px] leading-relaxed m-0 line-clamp-2">
                      {rep.summary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/60 font-mono">
                      <span>PM2.5: {rep.pm25} µg/m³</span>
                      <span>{rep.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full mt-3 py-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-800/40 rounded-lg transition-colors cursor-pointer"
            >
              + Submit New Photo Report
            </button>
          </div>

        </div>

        {/* Section 3: Core Live AI Demo - Gemini 2.0 Flash Risk Engine */}
        <AiRiskEngine 
          currentCity={currentCity}
          onPredictionComplete={handlePredictionComplete}
        />

        {/* Section 4: Authority Alert Console */}
        <AuthorityAlertPanel 
          alerts={alerts}
          currentCity={currentCity}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Section 5: Federation Architecture Concept */}
        <FederationSection />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-bold">AirWatch AI</span>
            <span>•</span>
            <span>Google AI Hackathon (Clean Air & Climate Resilience Track)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Model: Google Gemini 2.0 Flash</span>
            <span>•</span>
            <span>Sensor Standard: CPCB CAAQMS (data.gov.in)</span>
          </div>
        </div>
      </footer>

      {/* Citizen Report Modal */}
      <CitizenReportModal 
        currentCity={currentCity}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={handleReportSubmitted}
      />

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        currentStatus={geminiStatus}
        onKeyUpdated={(newStatus) => setGeminiStatus(newStatus)}
      />

    </div>
  );
}
