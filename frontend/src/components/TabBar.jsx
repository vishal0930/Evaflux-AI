import React from 'react';
import { Target, Users } from 'lucide-react';

function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="flex p-1.5 rounded-xl bg-dark-900/80 border border-slate-800/80 backdrop-blur-sm">
      <button
        onClick={() => setActiveTab('scorer')}
        className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === 'scorer'
            ? 'bg-brand-600 text-white shadow-glow-blue'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
        }`}
      >
        <Target className="w-4 h-4" />
        <span>Lead Scorer & Generator</span>
      </button>
      
      <button
        onClick={() => setActiveTab('clients')}
        className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === 'clients'
            ? 'bg-brand-600 text-white shadow-glow-blue'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
        }`}
      >
        <Users className="w-4 h-4" />
        <span>Client Directory</span>
      </button>
    </div>
  );
}

export default TabBar;
