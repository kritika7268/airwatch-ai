import React, { useState } from 'react';
import { Key, Sparkles, X, CheckCircle, AlertCircle, ExternalLink, Shield } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, currentStatus, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/config/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey.trim() })
      });

      const data = await response.json();
      if (data.success) {
        setFeedback({ success: true, message: 'Google Gemini 2.0 Flash connected successfully!' });
        if (onKeyUpdated) onKeyUpdated(data.gemini_status);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setFeedback({ success: false, message: data.message || 'Failed to initialize Gemini with this key.' });
      }
    } catch (err) {
      setFeedback({ success: false, message: 'Network error connecting to backend.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white m-0">Google Gemini API Configuration</h2>
              <p className="text-xs text-slate-400 m-0">Hot-Swap Live Model vs Fallback</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed m-0">
            AirWatch AI integrates with <strong>Google Gemini 2.0 Flash</strong> for multimodal pollution photo classification and multivariable civic risk reasoning.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Current Engine:</span>
              <span className="font-mono text-emerald-400 font-semibold">{currentStatus?.mode}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Target Model:</span>
              <span className="font-mono text-slate-200">gemini-2.0-flash</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Get free key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>Free tier supported</span>
            </div>

            {feedback && (
              <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                feedback.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
              }`}>
                {feedback.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close / Keep Fallback
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !apiKey.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Save & Activate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
