import React from 'react';
import { Shield, Lock, Building2, CheckCircle, ChevronRight } from 'lucide-react';

const IntroStep = ({ setStep }) => {
  return (
    <div className="text-center space-y-6 animate-fade-in py-4">
      <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-blue-500/50">
        <Shield size={40} className="text-blue-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Secure Data Synchronization</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          We use the RBI-approved <span className="text-blue-400 font-semibold">Account Aggregator (AA)</span> framework. 
          This ensures your data is encrypted, consent-based, and fetched directly from your banks.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-lg mx-auto mt-8">
        {[
          { icon: Lock, title: "100% Encrypted", desc: "Data is never stored in plain text." },
          { icon: Building2, title: "RBI Regulated", desc: "Standardized & compliant flow." },
          { icon: CheckCircle, title: "User Consent", desc: "You control what you share." }
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
            <item.icon size={20} className="text-emerald-500 mb-2" />
            <h4 className="font-semibold text-white text-sm">{item.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <button 
          onClick={() => setStep('mobile')}
          className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2"
        >
          <span>Connect Securely</span>
          <ChevronRight size={18} />
        </button>
        <p className="text-xs text-gray-600 mt-4">By continuing, you agree to our Terms of Service.</p>
      </div>
    </div>
  );
};

export default IntroStep;