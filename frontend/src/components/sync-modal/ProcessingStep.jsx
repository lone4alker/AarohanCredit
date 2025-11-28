import React, { useState, useEffect } from 'react';
import { Server, Cpu } from 'lucide-react';

const PROCESSING_LOGS = [
  "Connecting to Account Aggregator (FinVu)...",
  "Verifying Consent Artifacts...",
  "Fetching Statement: HDFC Bank (12 Months)...",
  "Fetching Statement: SBI (12 Months)...",
  "Retrieving GSTR-1 & GSTR-3B Data...",
  "Orchestrating AI Agents...",
  "Financial Health Agent: Analyzing Cash Flow...",
  "Risk Agent: Calculating Behavioral Score...",
  "Guidance Agent: Generating Insights...",
  "Finalizing Report..."
];

const ProcessingStep = ({ onComplete, onClose }) => {
  const [processingLogIndex, setProcessingLogIndex] = useState(0);

  useEffect(() => {
    if (processingLogIndex < PROCESSING_LOGS.length) {
      const timeout = setTimeout(() => {
        setProcessingLogIndex(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1000);
    }
  }, [processingLogIndex, onComplete, onClose]);

  return (
    <div className="h-full flex flex-col justify-center items-center animate-fade-in text-center">
      
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Server className="text-gray-500 animate-pulse" size={40} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Analyzing Financial Data</h2>
      <p className="text-gray-400 mb-8 max-w-sm">Please wait while our Agentic AI Orchestrator processes your raw banking data.</p>

      <div className="w-full max-w-md bg-gray-800 h-2 rounded-full overflow-hidden mb-6">
         <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${(processingLogIndex / PROCESSING_LOGS.length) * 100}%` }}
         ></div>
      </div>

      <div className="w-full max-w-md bg-black/50 rounded-xl border border-gray-800 p-4 text-left font-mono text-xs h-32 overflow-hidden flex flex-col-reverse shadow-inner">
        {PROCESSING_LOGS.slice(0, processingLogIndex + 1).reverse().map((log, i) => (
          <div key={i} className={`mb-1 ${i === 0 ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>
            <span className="mr-2 opacity-50">{new Date().toLocaleTimeString()} &gt;</span>
            {log}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-600">
        <Cpu size={12} className="inline mr-1" />
        Powered by Gemini 1.5 Pro
      </div>

    </div>
  );
};

export default ProcessingStep;