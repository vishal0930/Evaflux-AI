import React from 'react';
import { Cpu, FileText, Info } from 'lucide-react';

function PartInfoCard({ partNumber, manufacturer, partInfo, summary }) {
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-800/80 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-brand-900/40 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-mono">{partNumber}</h2>
            <p className="text-sm text-slate-400">Manufacturer: <span className="font-semibold text-slate-300">{manufacturer}</span></p>
          </div>
        </div>
        
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
          AI Analyzed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-brand-500" />
            <span>Part Specifications</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-dark-950/50 p-4 rounded-xl border border-slate-800/50">
            {partInfo || `Details for part ${partNumber} manufactured by ${manufacturer}.`}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 flex items-center space-x-2">
            <Info className="w-4 h-4 text-brand-500" />
            <span>AI Sourcing Analysis Summary</span>
          </h3>
          <p className="text-sm text-brand-100/90 leading-relaxed bg-brand-950/10 p-4 rounded-xl border border-brand-500/10">
            {summary || "AI sourcing summary could not be loaded."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PartInfoCard;
