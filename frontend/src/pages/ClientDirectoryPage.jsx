import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Globe, Cpu, DollarSign, ArrowRight, Layers, UserCheck } from 'lucide-react';

// Fallback clients in case backend fetch fails
const FALLBACK_CLIENTS = [
  { "id": 1, "name": "Alpha Automation Systems", "country": "United States", "productName": "Siemens Simatic S7-1500 PLC", "targetPrice": 1800 },
  { "id": 2, "name": "Bavaria Tech Group", "country": "Germany", "productName": "Beckhoff CX5130 Embedded PC", "targetPrice": 950 },
  { "id": 3, "name": "Nippon Systems Ltd", "country": "Japan", "productName": "Mitsubishi FX5U PLC", "targetPrice": 450 },
  { "id": 4, "name": "Gulf Controls & Sensors", "country": "United Arab Emirates", "productName": "Omron E2E Proximity Sensor", "targetPrice": 120 },
  { "id": 5, "name": "Indus Robotics Co", "country": "India", "productName": "Yaskawa Sigma-7 Servo Drive", "targetPrice": 1100 },
  { "id": 6, "name": "Sino Manufacturing Corp", "country": "China", "productName": "Delta AS300 PLC", "targetPrice": 300 },
  { "id": 7, "name": "UK Power & Logic Ltd", "country": "United Kingdom", "productName": "Schneider Electric Modicon M221", "targetPrice": 550 },
  { "id": 8, "name": "Nordic Wind Systems", "country": "Denmark", "productName": "Danfoss VLT FC-302 VFD", "targetPrice": 1500 },
  { "id": 9, "name": "Rio Automated Lines", "country": "Brazil", "productName": "WEG CFW500 Variable Speed Drive", "targetPrice": 680 },
  { "id": 10, "name": "Sydney Water Solutions", "country": "Australia", "productName": "Allen-Bradley ControlLogix 5580", "targetPrice": 3200 },
  { "id": 11, "name": "Milan Smart Factory", "country": "Italy", "productName": "SMC Pneumatic Valve Manifold", "targetPrice": 850 },
  { "id": 12, "name": "Singapore Chip Foundry", "country": "Singapore", "productName": "Keyence LJ-X8000 3D Laser Profile", "targetPrice": 4500 },
  { "id": 13, "name": "Seoul Precision Machinery", "country": "South Korea", "productName": "Autonics TK4S Temperature Controller", "targetPrice": 90 },
  { "id": 14, "name": "Mex Automation S.A.", "country": "Mexico", "productName": "Phoenix Contact Quint Power Supply", "targetPrice": 350 },
  { "id": 15, "name": "Cape Town Distilleries", "country": "South Africa", "productName": "Endress+Hauser Promass Flowmeter", "targetPrice": 2600 },
  { "id": 16, "name": "Toronto Packaging Systems", "country": "Canada", "productName": "Sick deTec4 Safety Light Curtain", "targetPrice": 1300 },
  { "id": 17, "name": "Lyon Robotics & Logistics", "country": "France", "productName": "Fanuc R-30iB Controller", "targetPrice": 5200 },
  { "id": 18, "name": "Ankara Steel Works", "country": "Turkey", "productName": "Siemens Sirius Soft Starter", "targetPrice": 720 },
  { "id": 19, "name": "Polish Grid Solutions", "country": "Poland", "productName": "ABB ACS580 Variable Frequency Drive", "targetPrice": 1400 },
  { "id": 20, "name": "Hanoi Agro-processing", "country": "Vietnam", "productName": "Fuji Electric HMI Monitouch", "targetPrice": 480 }
];

function ClientDirectoryPage({ onSelectTemplate }) {
  const [clients, setClients] = useState(FALLBACK_CLIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const apiBase = window.location.origin.includes('localhost')
          ? 'http://localhost:8000'
          : 'https://evaflux-ai.onrender.com';
        const response = await axios.get(`${apiBase}/api/leads/clients`);
        if (response.data && response.data.success && response.data.clients?.length > 0) {
          setClients(response.data.clients);
        }
      } catch (err) {
        console.warn('Failed to load clients from API, using fallback data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col items-center space-y-6 mt-4">
      {/* Header Block */}
      <div className="text-center max-w-2xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Client Reference Profiles
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Select any of the 20 pre-configured client profiles below. Use them as templates to test and validate lead matching, target pricing, and localized conversion scores.
        </p>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-4xl relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name, country, or product..."
          className="w-full bg-dark-900/60 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans text-sm shadow-xl"
        />
        {loading && (
          <div className="absolute right-4 top-4 text-xs text-brand-500 animate-pulse font-semibold">
            Syncing...
          </div>
        )}
      </div>

      {/* Client List Grid */}
      <div className="w-full max-w-6xl">
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="glass-panel group relative rounded-2xl p-6 border border-slate-850 hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between space-y-5 hover:shadow-glow-blue-sm overflow-hidden"
              >
                {/* Background decorative glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-3 z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-400 border border-slate-800">
                      ID: #{client.id}
                    </span>
                    <div className="flex items-center space-x-1.5 text-xs text-brand-400 font-semibold">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Standard Profile</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors duration-200">
                    {client.name}
                  </h3>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center text-slate-350 text-sm space-x-2.5">
                      <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{client.country}</span>
                    </div>

                    <div className="flex items-center text-slate-350 text-sm space-x-2.5">
                      <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="truncate" title={client.productName}>
                        {client.productName}
                      </span>
                    </div>

                    <div className="flex items-center text-emerald-400 text-sm font-semibold space-x-2.5">
                      <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Target Price: ${client.targetPrice.toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTemplate(client)}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-900/60 border border-slate-800 hover:border-brand-500/30 hover:bg-brand-950/40 text-slate-200 hover:text-white font-semibold py-2.5 rounded-xl transition-all duration-300 text-sm z-10 group/btn active:scale-95"
                >
                  <span>Test in Lead Scorer</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover/btn:translate-x-1 group-hover/btn:text-brand-400 transition-all duration-300" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 text-sm">
            No profiles match your search criteria. Try checking your spelling or search terms.
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDirectoryPage;
