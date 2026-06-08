import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';

function SearchForm({ onSubmit, isLoading }) {
  const [partNumber, setPartNumber] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [productType, setProductType] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!partNumber.trim() || !manufacturer.trim()) return;
    onSubmit({ partNumber, manufacturer, productType, additionalContext });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full glass-panel rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="partNumber" className="block text-sm font-semibold text-slate-300 mb-2">
            Part Number <span className="text-red-500">*</span>
          </label>
          <input
            id="partNumber"
            type="text"
            required
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            placeholder="e.g. 6ES7214-1AG40-0XB0"
            className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono"
          />
        </div>
        
        <div>
          <label htmlFor="manufacturer" className="block text-sm font-semibold text-slate-300 mb-2">
            Manufacturer <span className="text-red-500">*</span>
          </label>
          <input
            id="manufacturer"
            type="text"
            required
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            placeholder="e.g. Siemens"
            className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="productType" className="block text-sm font-semibold text-slate-300 mb-2">
            Product Type <span className="text-slate-500 text-xs font-normal">(Optional)</span>
          </label>
          <input
            id="productType"
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            placeholder="e.g. PLC, HMI, Servo Drive"
            className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        <div>
          <label htmlFor="additionalContext" className="block text-sm font-semibold text-slate-300 mb-2">
            Additional Context <span className="text-slate-500 text-xs font-normal">(Optional)</span>
          </label>
          <textarea
            id="additionalContext"
            rows={1}
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="e.g. Need immediate stock, urgent shipping"
            className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all resize-none"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-2 text-slate-500 text-xs">
          <Info className="w-4 h-4 text-brand-500/80 shrink-0" />
          <span>Real-time web search combined with AI synthesis.</span>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !partNumber.trim() || !manufacturer.trim()}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-900/50 disabled:text-slate-500 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-glow-blue hover:shadow-glow-blue-lg active:scale-[0.98] duration-200"
        >
          <Search className="w-4 h-4" />
          <span>{isLoading ? 'Searching...' : 'Find Suppliers'}</span>
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
