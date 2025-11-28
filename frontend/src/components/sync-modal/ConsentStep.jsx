import React from 'react';
import { Shield, FileText } from 'lucide-react';

const ConsentStep = ({ setStep, onClose }) => {
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <h2 className="text-xl font-bold text-white mb-6">Review Consent Artifact</h2>
      
      <div className="flex-1 overflow-y-auto bg-gray-800/30 rounded-xl border border-gray-700 p-6 space-y-6">
        
        <div>
           <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Purpose of Request</h4>
           <p className="text-white text-sm bg-[#15161c] p-3 rounded-lg border border-gray-700">
             Credit Assessment and Cash Flow Analysis for MSME Loan Application.
           </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Data Requested</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-300">
              <FileText size={16} className="text-blue-400 mr-2" />
              <span>Bank Statements (Deposit & Term) - Last 12 Months</span>
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <FileText size={16} className="text-blue-400 mr-2" />
              <span>GST Returns (GSTR-1, GSTR-3B) - Last 12 Months</span>
            </li>
            <li className="flex items-center text-sm text-gray-300">
              <FileText size={16} className="text-blue-400 mr-2" />
              <span>Profile Information (KYC)</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#15161c] p-3 rounded-lg border border-gray-700">
            <span className="block text-xs text-gray-500">Consent Validity</span>
            <span className="block text-white font-medium">30 Days</span>
          </div>
          <div className="bg-[#15161c] p-3 rounded-lg border border-gray-700">
            <span className="block text-xs text-gray-500">Data Frequency</span>
            <span className="block text-white font-medium">One-time Fetch</span>
          </div>
        </div>

        <div className="flex items-start bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
          <Shield size={16} className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-xs text-blue-200">
            Your data is fetched directly from the source banks via the Account Aggregator network. We do not store your banking credentials.
          </p>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
         <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium">
           Reject
         </button>
         <button 
          onClick={() => setStep('processing')}
          className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20"
         >
           Approve & Sync
         </button>
      </div>
    </div>
  );
};

export default ConsentStep;