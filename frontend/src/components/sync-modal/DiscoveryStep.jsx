import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const MOCK_ACCOUNTS = [
  { id: 1, bank: 'HDFC Bank', type: 'Current Account', mask: 'XXXX-4921', logo: 'H', status: 'active' },
  { id: 2, bank: 'State Bank of India', type: 'Savings Account', mask: 'XXXX-8822', logo: 'S', status: 'active' },
  { id: 3, bank: 'GST Network', type: 'GST Returns', mask: '27AAAAA0000A1Z5', logo: 'G', status: 'active' },
  { id: 4, bank: 'Axis Bank', type: 'Overdraft', mask: 'XXXX-1102', logo: 'A', status: 'error' }, // Example of error account
];

const DiscoveryStep = ({ setStep }) => {
  const [discoveredAccounts, setDiscoveredAccounts] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setIsScanning(true);
    setDiscoveredAccounts([]);
    
    let delay = 1000;
    MOCK_ACCOUNTS.forEach((acc, index) => {
      setTimeout(() => {
        setDiscoveredAccounts(prev => [...prev, acc]);
        if (index === MOCK_ACCOUNTS.length - 1) setIsScanning(false);
      }, delay);
      delay += 800;
    });
  }, []);

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white">Discovered Accounts</h2>
        <p className="text-sm text-gray-400">Select the accounts you want to link for credit assessment.</p>
      </div>

      {isScanning && (
        <div className="flex items-center justify-center space-x-2 mb-4 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400 text-sm">
           <Loader2 size={16} className="animate-spin" />
           <span>Scanning banking networks...</span>
        </div>
      )}

      <div className="space-y-3 flex-1 overflow-y-auto px-2">
        {discoveredAccounts.map((acc) => (
           <div key={acc.id} className="group flex items-center p-4 bg-gray-800/40 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all duration-300 animate-slide-up cursor-pointer">
              <div className={`w-5 h-5 rounded border flex items-center justify-center mr-4 transition-colors ${acc.status === 'error' ? 'border-red-500/50 bg-red-500/10' : 'border-blue-500 bg-blue-600'}`}>
                 {acc.status !== 'error' && <CheckCircle size={14} className="text-white" />}
                 {acc.status === 'error' && <AlertCircle size={14} className="text-red-500" />}
              </div>

              <div className="w-10 h-10 rounded-full bg-white text-gray-900 font-bold flex items-center justify-center text-lg mr-4">
                {acc.logo}
              </div>

              <div className="flex-1">
                <h4 className="text-white font-medium">{acc.bank}</h4>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-400">{acc.type}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="text-gray-500 font-mono">{acc.mask}</span>
                </div>
              </div>

              <div>
                {acc.status === 'active' ? (
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs rounded-lg border border-emerald-500/20">Active</span>
                ) : (
                  <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-lg border border-red-500/20">Action Req</span>
                )}
              </div>
           </div>
        ))}
      </div>

      {!isScanning && (
        <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end space-x-3">
          <button onClick={() => setStep('otp')} className="px-6 py-2 rounded-lg text-gray-400 hover:bg-gray-800">Back</button>
          <button 
            onClick={() => setStep('consent')}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            Proceed to Consent
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoveryStep;