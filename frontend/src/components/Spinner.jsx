import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function Spinner({ steps = ["Searching web databases...", "Analyzing supplier pages...", "Verifying part availability...", "Generating AI summary..."] }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-20 h-20 rounded-full border border-brand-500/20 animate-ping opacity-75"></div>
        {/* Middle pulsing glow */}
        <div className="absolute w-16 h-16 rounded-full bg-brand-600/10 blur-xl"></div>
        {/* Inner rotating spinner */}
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin relative" />
      </div>
      
      <p className="mt-6 text-sm font-medium text-slate-300 font-sans tracking-wide">
        {steps[currentStep]}
      </p>
      
      <div className="mt-4 flex space-x-1.5">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentStep ? 'w-6 bg-brand-500' : 'w-1.5 bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Spinner;
