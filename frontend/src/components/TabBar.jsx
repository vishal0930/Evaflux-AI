import React from 'react';
import { Search, Mail } from 'lucide-react';

function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="flex p-1.5 rounded-xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-sm">
      <button
        onClick={() => setActiveTab('partsource')}
        className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === 'partsource'
            ? 'bg-brand-600 text-white shadow-glow-blue'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>Part Sourcing</span>
      </button>
      
      <button
        onClick={() => setActiveTab('followup')}
        className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === 'followup'
            ? 'bg-brand-600 text-white shadow-glow-blue'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
        }`}
      >
        <Mail className="w-4 h-4" />
        <span>Follow-up Generator</span>
      </button>
    </div>
  );
}

export default TabBar;
