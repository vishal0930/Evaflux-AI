import React, { useState } from 'react';
import axios from 'axios';
import SearchForm from '../components/SearchForm';
import Spinner from '../components/Spinner';
import PartInfoCard from '../components/PartInfoCard';
import SupplierCard from '../components/SupplierCard';
import AlternativePartsCard from '../components/AlternativePartsCard';
import { AlertCircle, AlertTriangle } from 'lucide-react';

function PartSourcingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleSearch = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await axios.post('/api/partsource', formData);
      if (response.data && response.data.success) {
        setResults(response.data);
      } else {
        setError('Failed to fetch sourcing details.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.detail || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-8 mt-4">
      {/* Title block */}
      <div className="text-center max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          AI Part Sourcing Assistant
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Find real-time suppliers, check stock availability, and identify compatible alternatives for industrial automation components.
        </p>
      </div>

      {/* Search form */}
      <div className="w-full max-w-4xl">
        <SearchForm onSubmit={handleSearch} isLoading={loading} />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="w-full max-w-4xl glass-panel rounded-2xl p-6">
          <Spinner />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="w-full max-w-4xl p-4 rounded-xl bg-rose-950/40 border border-rose-500/25 flex items-start space-x-3 text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Error processing sourcing request</h4>
            <p className="text-xs text-rose-400 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Results view */}
      {results && !loading && (
        <div className="w-full max-w-4xl space-y-8 transition-all duration-300">
          
          {/* Part basic info */}
          <PartInfoCard
            partNumber={results.partNumber}
            manufacturer={results.manufacturer}
            partInfo={results.partInfo}
            summary={results.summary}
          />

          {/* Web Search Warnings (if Tavily failed but AI still generated content) */}
          {results.searchError && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 flex items-start space-x-3 text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <span className="font-semibold">Live Web Search Status: </span>
                <span className="text-amber-400">
                  Could not retrieve current web listings ({results.searchError}). Sourcing information is based on pre-trained knowledge.
                </span>
              </div>
            </div>
          )}

          {/* Supplier lists */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white pl-1 tracking-tight">
              Supplier Results {results.suppliers?.length > 0 && `(${Math.min(4, results.suppliers.length)})`}
            </h2>
            
            {results.suppliers && results.suppliers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.suppliers.slice(0, 4).map((supplier, idx) => (
                  <SupplierCard key={idx} supplier={supplier} />
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-8 text-center text-slate-500 text-sm">
                No active suppliers found in search results. Check alternatives below or broaden search query.
              </div>
            )}
          </div>

          {/* Alternatives */}
          {results.alternativeParts && results.alternativeParts.length > 0 && (
            <AlternativePartsCard alternatives={results.alternativeParts} />
          )}

        </div>
      )}
    </div>
  );
}

export default PartSourcingPage;
