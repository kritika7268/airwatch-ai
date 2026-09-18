import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, AlertCircle, Wind, Layers, Compass } from 'lucide-react';

export default function CityMap({ hotspots, center, city, onSelectHotspot }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize or update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coordinates [lat, lng]
    const defaultCenter = center || [26.4499, 80.3319];

    if (!mapInstanceRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // High-contrast Dark CartoDB / OSM tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(defaultCenter, 12, { animate: true });
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add Hotspot markers
    (hotspots || []).forEach(spot => {
      const risk = spot.risk_score || 50;
      
      // Color coding: green (<50), orange (50-79), red (80+)
      let colorClass = 'bg-emerald-500 border-emerald-300';
      let haloClass = 'bg-emerald-500/20';
      let badgeLabel = 'Low Risk';

      if (risk >= 80) {
        colorClass = 'bg-rose-500 border-rose-300';
        haloClass = 'bg-rose-500/30 pulse-marker-critical';
        badgeLabel = 'Critical';
      } else if (risk >= 50) {
        colorClass = 'bg-amber-500 border-amber-300';
        haloClass = 'bg-amber-500/20';
        badgeLabel = 'High';
      }

      // Custom HTML Marker icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer">
            <div class="absolute w-8 h-8 rounded-full ${haloClass}"></div>
            <div class="w-5 h-5 rounded-full ${colorClass} border-2 shadow-lg flex items-center justify-center text-[10px] font-bold text-slate-950">
              ${risk}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: inherit; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: #f8fafc; font-size: 13px;">${spot.name}</strong>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${risk >= 80 ? '#e11d48' : risk >= 50 ? '#d97706' : '#059669'}; color: #fff;">
              ${risk}/100
            </span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
            PM2.5: <strong style="color: #e2e8f0;">${spot.pm25} µg/m³</strong> | Wind: <strong style="color: #e2e8f0;">${spot.wind_speed} km/h</strong>
          </div>
          <p style="font-size: 11px; color: #cbd5e1; margin: 4px 0 8px 0; line-height: 1.3;">
            ${spot.likely_cause}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; border-top: 1px solid #334155; padding-top: 6px;">
            <span>Reports: ${spot.report_count}</span>
            <span style="color: #38bdf8;">${spot.last_updated}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectHotspot) onSelectHotspot(spot);
      });

      markersRef.current.push(marker);
    });

    // Cleanup on unmount
    return () => {
      // Keep map instance alive across city changes or re-renders
    };
  }, [hotspots, center]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white tracking-wide uppercase m-0">
            Hyperlocal Hotspot Map • {city}
          </h2>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>&lt;50 Low</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>50-79 High</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>80+ Critical</span>
          </span>
        </div>
      </div>

      {/* Map Element */}
      <div className="relative flex-1 min-h-[380px] w-full rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '380px' }} />

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs text-slate-300 flex items-center gap-2 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any hotspot marker to inspect sensor telemetry</span>
        </div>
      </div>
    </div>
  );
}
