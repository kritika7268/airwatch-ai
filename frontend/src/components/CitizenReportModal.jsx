import React, { useState } from 'react';
import { Camera, Upload, Sparkles, CheckCircle, AlertCircle, Eye, MapPin, X, Image as ImageIcon } from 'lucide-react';

// Sample base64 preset images for rapid 1-click hackathon judging & testing
// Realistic SVGs rendered into data URLs for reliable upload without external network dependencies
const PRESET_SAMPLES = [
  {
    id: 'industrial',
    name: '🏭 Factory Stack Plume',
    type: 'industrial_smoke',
    location: 'Panki Industrial Area, Sector 3',
    description: 'Black unscrubbed smoke plume billowing from foundry furnace chimney.',
    pm25: 198,
    // Realistic SVG data URL depicting industrial stack
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231e293b"/><rect x="80" y="140" width="50" height="160" fill="%23475569"/><rect x="180" y="100" width="70" height="200" fill="%23334155"/><rect x="195" y="80" width="40" height="20" fill="%230f172a"/><circle cx="215" cy="55" r="35" fill="%23111827" opacity="0.9"/><circle cx="240" cy="35" r="45" fill="%23111827" opacity="0.8"/><circle cx="280" cy="20" r="55" fill="%23111827" opacity="0.7"/><circle cx="330" cy="15" r="65" fill="%23111827" opacity="0.5"/><text x="20" y="280" fill="%2394a3b8" font-family="sans-serif" font-size="12">AirWatch AI Test Asset: Industrial Boiler Stack</text></svg>'
  },
  {
    id: 'crop',
    name: '🌾 Stubble / Parali Fire',
    type: 'crop_burning',
    location: 'Bithoor Peri-Urban Agricultural Belt',
    description: 'Extensive agricultural field burning with dense yellowish-white smoke covering the GT road bypass.',
    pm25: 185,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23262626"/><rect x="0" y="190" width="400" height="110" fill="%23713f12"/><polygon points="40,200 60,150 80,200" fill="%23ea580c"/><polygon points="75,200 95,140 115,200" fill="%23f59e0b"/><polygon points="120,200 145,130 170,200" fill="%23ea580c"/><ellipse cx="140" cy="90" rx="110" ry="40" fill="%23d4d4d4" opacity="0.75"/><ellipse cx="220" cy="60" rx="140" ry="50" fill="%23e5e5e5" opacity="0.65"/><ellipse cx="300" cy="40" rx="160" ry="60" fill="%23f5f5f5" opacity="0.55"/><text x="20" y="280" fill="%23fef08a" font-family="sans-serif" font-size="12">AirWatch AI Test Asset: Agricultural Stubble Fire</text></svg>'
  },
  {
    id: 'traffic',
    name: '🚚 Diesel Truck Corridor',
    type: 'vehicle_emission',
    location: 'Jajmau Highway Junction',
    description: 'Congested interstate commercial diesel trucks idling in bottleneck with thick tailpipe exhaust.',
    pm25: 165,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230f172a"/><rect x="0" y="180" width="400" height="120" fill="%23334155"/><line x1="0" y1="240" x2="400" y2="240" stroke="%23facc15" stroke-dasharray="15 15" stroke-width="4"/><rect x="60" y="110" width="130" height="85" fill="%231e3a8a"/><rect x="190" y="130" width="70" height="65" fill="%231e40af"/><circle cx="100" cy="200" r="18" fill="%23020617"/><circle cx="210" cy="200" r="18" fill="%23020617"/><ellipse cx="280" cy="180" rx="40" ry="20" fill="%23020617" opacity="0.85"/><ellipse cx="330" cy="165" rx="55" ry="30" fill="%231e293b" opacity="0.75"/><text x="20" y="280" fill="%2393c5fd" font-family="sans-serif" font-size="12">AirWatch AI Test Asset: Commercial Diesel Emissions</text></svg>'
  },
  {
    id: 'dust',
    name: '🏗️ Construction Road Dust',
    type: 'dust',
    location: 'Kalyanpur Metro Pier Construction',
    description: 'Uncovered dry road excavation without water sprinkling causing high airborne dust resuspension.',
    pm25: 140,
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231c1917"/><polygon points="50,220 180,120 260,220" fill="%2378716c"/><polygon points="200,220 300,140 380,220" fill="%23a8a29e"/><ellipse cx="220" cy="110" rx="160" ry="60" fill="%23d6d3d1" opacity="0.6"/><ellipse cx="250" cy="80" rx="180" ry="70" fill="%23e7e5e4" opacity="0.4"/><text x="20" y="280" fill="%23f5f5f4" font-family="sans-serif" font-size="12">AirWatch AI Test Asset: Fugitive Construction Dust</text></svg>'
  }
];

export default function CitizenReportModal({ currentCity, isOpen, onClose, onReportSubmitted }) {
  const [location, setLocation] = useState('Panki Industrial Area, Sector 3');
  const [pollutionType, setPollutionType] = useState('industrial_smoke');
  const [pm25, setPm25] = useState(195);
  const [description, setDescription] = useState('Heavy black particulate plume observed issuing from foundry stack.');
  const [imagePreview, setImagePreview] = useState(PRESET_SAMPLES[0].imageUrl);
  const [imageFile, setImageFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Load Preset
  const handleSelectPreset = (sample) => {
    setImagePreview(sample.imageUrl);
    setImageFile(null);
    setPollutionType(sample.type);
    setLocation(sample.location);
    setDescription(sample.description);
    setPm25(sample.pm25);
    setAnalysisResult(null);
  };

  // Submit Report & trigger Gemini Vision
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('city', currentCity);
      formData.append('location', location);
      formData.append('pollution_type', pollutionType);
      formData.append('pm25', pm25.toString());
      formData.append('description', description);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imagePreview && imagePreview.startsWith('data:')) {
        // Convert data URL to Blob for upload
        const res = await fetch(imagePreview);
        const blob = await res.blob();
        formData.append('image', blob, 'sample_photo.svg');
      }

      const response = await fetch('/api/report', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server returned error ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);

      if (onReportSubmitted) {
        onReportSubmitted(data);
      }
    } catch (err) {
      console.error('Report submission error:', err);
      setErrorMessage(err.message || 'Failed to submit report and trigger vision analysis');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white m-0">
                Citizen Hyperlocal Pollution Report
              </h2>
              <p className="text-xs text-slate-400 m-0">
                Upload photo to trigger Google Gemini 2.0 Flash Multimodal Vision
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Quick preset selector for judges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Quick Hackathon Test Presets:
              </span>
              <span className="text-[10px] text-emerald-400">Click to auto-populate photo</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_SAMPLES.map(sample => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectPreset(sample)}
                  className="text-left p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/50 transition-all text-xs"
                >
                  <p className="font-semibold text-slate-200 truncate m-0">{sample.name}</p>
                  <p className="text-[10px] text-slate-400 truncate m-0 mt-0.5">{sample.type}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Preview & Upload Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Citizen Photo Preview
                </label>
                <div className="h-44 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden relative group">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Pollution report preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-500">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No image selected</p>
                    </div>
                  )}

                  {/* Overlay upload prompt */}
                  <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-xs text-white gap-1 font-medium">
                    <Upload className="w-5 h-5" />
                    <span>Upload Custom Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Location / Ward / Landmark
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Panki Industrial Area, Sector 3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Citizen Category Guess
                    </label>
                    <select
                      value={pollutionType}
                      onChange={(e) => setPollutionType(e.target.value)}
                      className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="industrial_smoke">Industrial Smoke</option>
                      <option value="crop_burning">Crop Stubble Burning</option>
                      <option value="vehicle_emission">Vehicle Emission</option>
                      <option value="dust">Construction Dust</option>
                      <option value="other">Other / Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Observed PM2.5 (µg/m³)
                    </label>
                    <input
                      type="number"
                      value={pm25}
                      onChange={(e) => setPm25(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Observations / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                    placeholder="Describe color, thickness, and origin of smoke plume..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Gemini 2.0 Multimodal Vision Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Submit Report & Classify with Gemini Multimodal</span>
                </>
              )}
            </button>
          </form>

          {/* Analysis Result Display */}
          {analysisResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Gemini Multimodal Vision Assessment
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {analysisResult.vision_analysis?.ai_badge}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Classified Type</span>
                  <span className="font-bold text-cyan-300">
                    {analysisResult.vision_analysis?.pollution_type_label || analysisResult.report.pollution_type}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Visual Severity</span>
                  <span className={`font-bold capitalize ${
                    analysisResult.vision_analysis?.severity === 'high' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {analysisResult.vision_analysis?.severity || 'Medium'} Severity
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Confidence</span>
                  <span className="font-bold text-emerald-400">
                    {Math.round((analysisResult.vision_analysis?.confidence_score || 0.92) * 100)}%
                  </span>
                </div>
              </div>

              {/* Visual Clues */}
              {analysisResult.vision_analysis?.visual_clues?.length > 0 && (
                <div className="text-xs">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">
                    Visual Evidence Identified by Gemini:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.vision_analysis.visual_clues.map((clue, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                        • {clue}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto Alert note */}
              {analysisResult.auto_alert_created && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
                  <span>High severity visual signature triggered an automatic Authority Alert!</span>
                  <span className="font-mono font-bold text-[10px] bg-rose-500/20 px-2 py-0.5 rounded">
                    {analysisResult.auto_alert?.id}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
