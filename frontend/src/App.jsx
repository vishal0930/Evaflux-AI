import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TabBar from './components/TabBar';
import PartSourcingPage from './pages/PartSourcingPage';
import FollowUpPage from './pages/FollowUpPage';

function App() {
  const [activeTab, setActiveTab] = useState('partsource');

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 radial-glow flex flex-col pb-16">
      <Navbar />
      
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex-grow flex flex-col items-center">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="w-full mt-6 transition-all duration-300">
          {activeTab === 'partsource' ? (
            <PartSourcingPage />
          ) : (
            <FollowUpPage />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
