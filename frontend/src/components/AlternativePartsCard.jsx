import React, { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

function AlternativePartsCard({ alternatives }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (partNumber, index) => {
    navigator.clipboard.writeText(partNumber);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-brand-900/40 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">AI Recommended Alternatives</h2>
          <p className="text-xs text-slate-400">Compatible components recommended by AI based on specs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alternatives.map((alt, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-dark-950/40 border border-slate-800/80 hover:border-brand-500/20 hover:bg-dark-950/60 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-bold text-slate-100 group-hover:text-brand-400 transition-colors">
                  {alt.partNumber}
                </span>
                
                <button
                  onClick={() => handleCopy(alt.partNumber, index)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy Part Number"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                {alt.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlternativePartsCard;
