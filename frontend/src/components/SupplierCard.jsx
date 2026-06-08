import React from 'react';
import { ExternalLink, CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

function SupplierCard({ supplier }) {
  const { name, url, availability, notes } = supplier;

  // Extract domain for screenshot and clean display
  let cleanDomain = '';
  let screenshotUrl = '';
  try {
    const parsedUrl = new URL(url);
    cleanDomain = parsedUrl.hostname.replace('www.', '');
    screenshotUrl = `https://image.thum.io/get/width/400/crop/800/maxAge/12/${url}`;
  } catch (e) {
    cleanDomain = url || 'supplier.com';
    screenshotUrl = `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=60`;
  }

  // Get availability badge styling
  const getAvailabilityBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'in stock':
        return {
          classes: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          text: 'In Stock'
        };
      case 'limited':
        return {
          classes: 'bg-amber-950/60 text-amber-400 border border-amber-500/20',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          text: 'Limited Stock'
        };
      case 'out of stock':
        return {
          classes: 'bg-rose-950/60 text-rose-400 border border-rose-500/20',
          icon: <XCircle className="w-3.5 h-3.5" />,
          text: 'Out of Stock'
        };
      default:
        return {
          classes: 'bg-slate-800 text-slate-400 border border-slate-700/50',
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          text: status || 'Unknown Availability'
        };
    }
  };

  const badge = getAvailabilityBadge(availability);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full group">
      {/* Website screenshot container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-slate-800/50">
        <img
          src={screenshotUrl}
          alt={`${name} Website Preview`}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=60`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight text-sm">
              {name}
            </h3>
            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${badge.classes} shrink-0`}>
              {badge.icon}
              <span>{badge.text}</span>
            </span>
          </div>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-400 hover:text-brand-300 hover:underline font-mono inline-block truncate max-w-full"
          >
            {cleanDomain}
          </a>
          
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
            {notes || "No additional notes available for this supplier."}
          </p>
        </div>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-dark-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-medium px-4 py-2.5 rounded-xl text-xs transition-all active:scale-[0.98]"
        >
          <span>Visit Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export default SupplierCard;
