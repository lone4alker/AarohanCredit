import React from 'react';
import { Smartphone } from 'lucide-react';

const MobileStep = ({ mobile, setMobile, handleMobileSubmit }) => {
  return (
    <div className="max-w-md mx-auto pt-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">Verify Identity</h2>
      <p className="text-gray-400 mb-8">
        Enter your mobile number linked to your bank accounts. We will auto-discover your AA handle (e.g., @finvu, @onemoney).
      </p>

      <form onSubmit={handleMobileSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Mobile Number</label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3.5 text-gray-500" size={20} />
            <input 
              type="text" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g,'').slice(0, 10))}
              placeholder="98765 43210"
              className="w-full bg-[#15161c] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-lg"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 ml-1">We'll send a One Time Password (OTP) to this number.</p>
        </div>

        <button 
          type="submit"
          disabled={mobile.length !== 10}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default MobileStep;