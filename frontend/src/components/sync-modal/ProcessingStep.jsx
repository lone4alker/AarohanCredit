import React, { useState, useEffect, useRef } from 'react';
import { Server, Cpu, Clock } from 'lucide-react';

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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const startTimeRef = useRef(Date.now());

  // Stopwatch effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (status === 'processing') {
        setElapsedTime(Date.now() - startTimeRef.current);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [status]);

  // Logs animation effect
  useEffect(() => {
    if (processingLogIndex < PROCESSING_LOGS.length - 1 && status === 'processing') {
      const timeout = setTimeout(() => {
        setProcessingLogIndex(prev => prev + 1);
      }, 2500); // Advance logs every 2.5s
      return () => clearTimeout(timeout);
    }
  }, [processingLogIndex, status]);

  // Trigger Backend Sync
  useEffect(() => {
    const startSync = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sync/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          // Ensure we show the last log
          setProcessingLogIndex(PROCESSING_LOGS.length - 1);

          // Wait a moment before closing to show success state
          setTimeout(() => {
            onComplete();
            onClose();
          }, 1500);
        } else {
          throw new Error(data.message || 'Sync failed');
        }
      } catch (error) {
        console.error("Sync error:", error);
        setStatus('error');
        setErrorMsg(error.message);
      }
    };

    startSync();
  }, [onComplete, onClose]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col justify-center items-center animate-fade-in text-center">

      <div className="relative w-32 h-32 mb-8">
        <div className={`absolute inset-0 rounded-full border-4 ${status === 'error' ? 'border-red-900' : 'border-gray-800'}`}></div>
        {status === 'processing' && (
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {status === 'error' ? (
            <span className="text-red-500 text-4xl">!</span>
          ) : (
            <Server className={`text-gray-500 ${status === 'processing' ? 'animate-pulse' : ''}`} size={40} />
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {status === 'processing' ? 'Analyzing Financial Data' : status === 'success' ? 'Analysis Complete!' : 'Analysis Failed'}
      </h2>

      {status === 'error' ? (
        <p className="text-red-400 mb-8 max-w-sm">{errorMsg}</p>
      ) : (
        <p className="text-gray-400 mb-6 max-w-sm">Please wait while our Agentic AI Orchestrator processes your raw banking data.</p>
      )}

      {/* Stopwatch */}
      <div className="flex items-center space-x-2 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800 mb-8">
        <Clock size={16} className="text-[#00FF75]" />
        <span className="font-mono text-[#00FF75] text-lg">{formatTime(elapsedTime)}</span>
      </div>

      <div className="w-full max-w-md bg-gray-800 h-2 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-500 ease-out ${status === 'error' ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
          style={{ width: `${((processingLogIndex + 1) / PROCESSING_LOGS.length) * 100}%` }}
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