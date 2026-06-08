import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 shadow-glow-blue transition-transform group-hover:scale-105 duration-300">
            <Cpu className="w-5 h-5 text-white" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight font-sans text-white">
              Evaflux <span className="bg-gradient-to-r from-brand-500 to-blue-400 bg-clip-text text-transparent">AI</span>
            </span>
            <span className="text-xs text-slate-500 -mt-1 font-sans">Enterprise Sourcing</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-900/40 text-brand-500 border border-brand-500/20">
            v1.0.0
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
