import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { 
  AlertCircle, Check, Copy, Globe, MessageSquare, Mail, 
  Sparkles, DollarSign, Database, CheckCircle2, ChevronRight, Info 
} from 'lucide-react';

function LeadScorerPage({ templateData, clearTemplateData }) {
  // Form states
  const [geography, setGeography] = useState('');
  const [partType, setPartType] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [partAvailability, setPartAvailability] = useState('In Stock');
  const [communicationChannel, setCommunicationChannel] = useState('Email');
  const [responseSpeed, setResponseSpeed] = useState('Within 24 Hours');
  const [followupsSent, setFollowupsSent] = useState('0');
  const [daysSinceLastReply, setDaysSinceLastReply] = useState(0);

  // Application flow states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeFollowupTab, setActiveFollowupTab] = useState('day2');
  const [copied, setCopied] = useState(false);

  const getFollowupText = (followup) => {
    if (!followup) return '';
    if (typeof followup === 'string') return followup;
    if (typeof followup === 'object') {
      const { subject, body } = followup;
      if (subject && body) {
        return `Subject: ${subject}\n\n${body}`;
      }
      return JSON.stringify(followup, null, 2);
    }
    return String(followup);
  };

  // Populate from template if provided
  useEffect(() => {
    if (templateData) {
      setGeography(templateData.country || '');
      setPartType(templateData.productName || '');
      setTargetPrice(templateData.targetPrice || '');
      // Keep other heuristics to sensible test defaults
      setPartAvailability('In Stock');
      setResponseSpeed('Within 24 Hours');
      setFollowupsSent('0');
      setDaysSinceLastReply(0);
      
      // Auto-submit or focus attention
      setResults(null);
      clearTemplateData();
    }
  }, [templateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!geography.trim() || !partType.trim() || targetPrice === '') return;

    setLoading(true);
    setError(null);
    setResults(null);
    setCopied(false);

    try {
      const apiBase = window.location.origin.includes('localhost')
        ? 'http://localhost:8000'
        : 'https://evaflux-ai.onrender.com';
      
      const payload = {
        geography: geography.trim(),
        partType: partType.trim(),
        targetPrice: parseFloat(targetPrice),
        partAvailability,
        communicationChannel,
        responseSpeed,
        followupsSent: parseInt(followupsSent, 10),
        daysSinceLastReply: parseInt(daysSinceLastReply, 10)
      };

      const response = await axios.post(`${apiBase}/api/leads/evaluate`, payload);

      if (response.data && response.data.success) {
        setResults(response.data);
      } else {
        setError('Failed to evaluate lead details.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.detail || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get score color classes
  const getScoreColor = (score) => {
    if (score >= 75) return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20', fill: '#10b981', ring: 'shadow-emerald-500/20' };
    if (score >= 40) return { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/20', fill: '#f59e0b', ring: 'shadow-amber-500/20' };
    return { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-950/20', fill: '#f43f5e', ring: 'shadow-rose-500/20' };
  };

  const colorConfig = results ? getScoreColor(results.leadScore) : null;

  return (
    <div className="w-full flex flex-col items-center space-y-8 mt-4">
      {/* Title */}
      <div className="text-center max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Lead Scorer & Follow-Up Generator
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Evaluate lead quality across 7 dimensions, check matching parameters against our client base, and generate personalized Day 2, 5, and 10 follow-ups.
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <span>Lead Dimensions</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Geography (Country) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                placeholder="e.g. Germany, UAE, United States"
                className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-650 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Part Type / Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={partType}
                onChange={(e) => setPartType(e.target.value)}
                placeholder="e.g. Siemens PLC, Omron Sensor"
                className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-650 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Target Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full bg-dark-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-100 placeholder-slate-650 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Communication Channel
                </label>
                <div className="flex bg-dark-950/80 border border-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCommunicationChannel('Email')}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      communicationChannel === 'Email'
                        ? 'bg-brand-600 text-white shadow-glow-blue'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommunicationChannel('WhatsApp')}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      communicationChannel === 'WhatsApp'
                        ? 'bg-brand-600 text-white shadow-glow-blue'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Part Availability
                </label>
                <select
                  value={partAvailability}
                  onChange={(e) => setPartAvailability(e.target.value)}
                  className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Limited">Limited</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Response Speed
                </label>
                <select
                  value={responseSpeed}
                  onChange={(e) => setResponseSpeed(e.target.value)}
                  className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Within 24 Hours">Within 24 Hours</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Follow-ups Sent
                </label>
                <select
                  value={followupsSent}
                  onChange={(e) => setFollowupsSent(e.target.value)}
                  className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                >
                  <option value="0">0 follow-ups</option>
                  <option value="1">1 follow-up</option>
                  <option value="2">2 follow-ups</option>
                  <option value="3">3 follow-ups</option>
                  <option value="4">4+ follow-ups</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Days Since Last Reply
                  </label>
                  <span className="text-xs font-bold text-brand-400">{daysSinceLastReply} days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={daysSinceLastReply}
                  onChange={(e) => setDaysSinceLastReply(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-brand-500 border border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !geography.trim() || !partType.trim() || targetPrice === ''}
              className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-900/50 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition-all shadow-glow-blue hover:shadow-glow-blue-lg active:scale-[0.98] duration-200 text-sm mt-4"
            >
              <span>{loading ? 'Evaluating...' : 'Score Lead & Generate'}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-6">
          {loading ? (
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px]">
              <Spinner steps={[
                "Matching data against 20 key clients...",
                "Running heuristic lead-scoring matrix...",
                "Drafting Day 2, 5, and 10 follow-ups with Mistral AI..."
              ]} />
            </div>
          ) : error ? (
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px]">
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/25 flex items-start space-x-3 text-rose-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Evaluation Failed</h4>
                  <p className="text-xs text-rose-450">{error}</p>
                </div>
              </div>
            </div>
          ) : results ? (
            <div className="space-y-6">
              
              {/* Score summary panel */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Circular Gauge */}
                <div className="flex items-center space-x-5">
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="stroke-slate-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="transition-all duration-1000 ease-out"
                        stroke={colorConfig.fill}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - results.leadScore / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white font-sans">{results.leadScore}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Score</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Conversion Probability
                      </span>
                    </div>
                    <h3 className={`text-2xl font-black tracking-tight ${colorConfig.text}`}>
                      {results.conversionProbability}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluated on availability, speed, budget alignment, and follow-ups.
                    </p>
                  </div>
                </div>

                {/* Score badge / status */}
                <div className="flex flex-col space-y-2 md:items-end">
                  <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${colorConfig.border} ${colorConfig.bg} ${colorConfig.text} shadow-glow-blue-sm`}>
                    {results.conversionProbability} Probability
                  </span>
                  <span className="text-xs text-slate-500">
                    Lead Score: {results.leadScore} / 100
                  </span>
                </div>
              </div>

              {/* Client Match Notification */}
              {results.matchedClient ? (
                results.priceMismatch ? (
                  <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/25 flex items-start space-x-3.5 shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-amber-400">Database Match: Pricing Mismatch!</h4>
                        <span className="text-[10px] bg-amber-900/50 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                          Client #{results.matchedClient.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Lead matches client <strong className="text-amber-300 font-semibold">{results.matchedClient.name}</strong> from <strong className="text-slate-200">{results.matchedClient.country}</strong>, but the target price is completely mismatched (market budget is <strong className="text-emerald-400">${results.matchedClient.targetPrice}</strong>).
                      </p>
                      <div className="text-[11px] text-amber-450 font-semibold pt-1">
                        ⚠️ Large budget discrepancy detected. Major conversion penalty applied.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start space-x-3.5 shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-emerald-400">Database Match Identified!</h4>
                        <span className="text-[10px] bg-emerald-900/50 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                          Client #{results.matchedClient.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Lead matches client profile <strong className="text-emerald-300 font-semibold">{results.matchedClient.name}</strong> from <strong className="text-slate-200">{results.matchedClient.country}</strong>.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-400">
                        <span>• Product: <strong className="text-slate-300">{results.matchedClient.productName}</strong></span>
                        <span>• Client Target: <strong className="text-slate-300">${results.matchedClient.targetPrice}</strong></span>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-start space-x-3.5 text-xs text-slate-400">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300">No Direct Client Match:</span> Sourcing price target does not align with any of the 20 pre-configured profiles. Follow-ups will be generated based on standard business inquiries.
                  </div>
                </div>
              )}

              {/* Heuristics breakdown */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Evaluation Dimension Breakdown
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Budget Match & Client Profile Check (Max 25)</span>
                      <span className="text-brand-400">{results.scoreBreakdown.budgetMatch} pts</span>
                    </div>
                    <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.max(0, (results.scoreBreakdown.budgetMatch / 25) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Availability & Supply Level (Max 20)</span>
                      <span className="text-brand-400">{results.scoreBreakdown.availability} pts</span>
                    </div>
                    <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(results.scoreBreakdown.availability / 20) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Response Speed Coefficient (Max 20)</span>
                      <span className="text-brand-400">{results.scoreBreakdown.responseSpeed} pts</span>
                    </div>
                    <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(results.scoreBreakdown.responseSpeed / 20) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Days Since Last Contact (Max 20)</span>
                      <span className="text-brand-400">{results.scoreBreakdown.daysSinceLastReply} pts</span>
                    </div>
                    <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(results.scoreBreakdown.daysSinceLastReply / 20) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Follow-up Cadence (Max 15)</span>
                      <span className="text-brand-400">{results.scoreBreakdown.followupsSent} pts</span>
                    </div>
                    <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(results.scoreBreakdown.followupsSent / 15) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow-up messages tabs */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-850">
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                    {communicationChannel === 'WhatsApp' ? (
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Mail className="w-4 h-4 text-blue-400" />
                    )}
                    <span>AI Localized Follow-Up Messages</span>
                  </h3>
                  
                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(getFollowupText(results.followups[activeFollowupTab]))}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white transition-all text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Active</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Followup Selection Tabs */}
                <div className="flex space-x-2 bg-dark-950 p-1 rounded-xl border border-slate-850">
                  {['day2', 'day5', 'day10'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFollowupTab(tab)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
                        activeFollowupTab === tab
                          ? 'bg-brand-600 text-white shadow-glow-blue'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                      }`}
                    >
                      {tab === 'day2' ? 'Day 2' : tab === 'day5' ? 'Day 5' : 'Day 10'}
                    </button>
                  ))}
                </div>

                {/* Display Area */}
                <div className="text-slate-250 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-dark-950/60 border border-slate-850 p-4 rounded-xl max-h-[300px] overflow-y-auto select-text">
                  {getFollowupText(results.followups[activeFollowupTab])}
                </div>

                {/* AI Status / Meta */}
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-2">
                  <Globe className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span>
                    Localized messaging nuance applied specifically for buyers in <strong className="text-slate-400">{geography}</strong>.
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center my-auto flex flex-col items-center justify-center space-y-4 min-h-[500px]">
              <div className="w-14 h-14 rounded-2xl bg-dark-950 border border-slate-850 flex items-center justify-center text-slate-600 shadow-xl">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-300 text-base">Ready for Lead Scoring</h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mx-auto">
                  Fill out the lead details on the left, or select a preloaded profile from the <strong>Client Directory</strong> tab to run your evaluation and get follow-up messaging.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => document.getElementById('geography')?.focus()}
                  className="inline-flex items-center space-x-1.5 text-xs text-brand-400 font-bold hover:text-brand-300 transition-colors"
                >
                  <span>Focus inputs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadScorerPage;
