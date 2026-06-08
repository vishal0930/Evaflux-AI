import React, { useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Mail, Copy, Check, AlertCircle, FileText, Globe, MessageSquare } from 'lucide-react';

function FollowUpPage() {
  const [originalInquiry, setOriginalInquiry] = useState('');
  const [currentSituation, setCurrentSituation] = useState('');
  const [buyerCountry, setBuyerCountry] = useState('');
  const [channel, setChannel] = useState('Email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalInquiry.trim() || !currentSituation.trim() || !buyerCountry.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await axios.post('/api/followup', {
        originalInquiry,
        currentSituation,
        buyerCountry,
        channel,
      });

      if (response.data && response.data.success) {
        setResult(response.data.message);
      } else {
        setError('Failed to generate follow-up message.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.detail || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-8 mt-4">
      {/* Title block */}
      <div className="text-center max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          AI Follow-up Generator
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Draft professional, high-conversion follow-up emails and WhatsApp messages tailored to buyer geography, original request, and quotation context.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Card */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 sm:p-8 shadow-xl h-fit">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="originalInquiry" className="block text-sm font-semibold text-slate-300 mb-2">
                Buyer's Original Inquiry <span className="text-red-500">*</span>
              </label>
              <textarea
                id="originalInquiry"
                required
                rows={4}
                value={originalInquiry}
                onChange={(e) => setOriginalInquiry(e.target.value)}
                placeholder="e.g. Inquired about 5 units of Siemens PLC and requested quotation with shipping..."
                className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label htmlFor="currentSituation" className="block text-sm font-semibold text-slate-300 mb-2">
                Current Quotation Situation <span className="text-red-500">*</span>
              </label>
              <textarea
                id="currentSituation"
                required
                rows={3}
                value={currentSituation}
                onChange={(e) => setCurrentSituation(e.target.value)}
                placeholder="e.g. Sent quote of $1200 on June 1st. Buyer acknowledged receipt but has gone silent since."
                className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="buyerCountry" className="block text-sm font-semibold text-slate-300 mb-2">
                  Buyer's Country <span className="text-red-500">*</span>
                </label>
                <input
                  id="buyerCountry"
                  type="text"
                  required
                  value={buyerCountry}
                  onChange={(e) => setBuyerCountry(e.target.value)}
                  placeholder="e.g. Germany, UAE"
                  className="w-full bg-dark-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Communication Channel
                </label>
                <div className="flex bg-dark-950/80 border border-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setChannel('Email')}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      channel === 'Email'
                        ? 'bg-brand-600 text-white shadow-glow-blue'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('WhatsApp')}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      channel === 'WhatsApp'
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

            <button
              type="submit"
              disabled={loading || !originalInquiry.trim() || !currentSituation.trim() || !buyerCountry.trim()}
              className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-900/50 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition-all shadow-glow-blue hover:shadow-glow-blue-lg active:scale-[0.98] duration-200 text-sm mt-2"
            >
              <span>{loading ? 'Generating...' : 'Generate Follow-up'}</span>
            </button>
          </form>
        </div>

        {/* Output Display Card */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between flex-grow min-h-[350px]">
            {loading ? (
              <div className="my-auto">
                <Spinner steps={["Analyzing situation...", "Applying cultural communication standards...", "Synthesizing follow-up message..."]} />
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/25 flex items-start space-x-3 text-rose-300 my-auto">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Failed to generate</h4>
                  <p className="text-xs text-rose-400">{error}</p>
                </div>
              </div>
            ) : result ? (
              <div className="flex flex-col h-full justify-between space-y-6">
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Generated {channel} Message
                    </span>
                    
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-1 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition text-xs border border-slate-800"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-xs font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Message body display */}
                  <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-dark-950/40 border border-slate-800/50 p-4 rounded-xl max-h-[350px] overflow-y-auto select-text">
                    {result}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-slate-500 text-xs pt-2 border-t border-slate-850">
                  <Globe className="w-4 h-4 text-brand-500/80 shrink-0" />
                  <span>Tone optimized for buyers in <strong className="text-slate-400">{buyerCountry}</strong>.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-300 text-sm">No message generated yet</h4>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Fill out the form on the left and click generate to draft a highly conversion-optimized follow-up.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FollowUpPage;
