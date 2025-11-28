import React from 'react';
import { Lock } from 'lucide-react';

const OtpStep = ({ otp, otpRefs, mobile, handleOtpChange, handleVerifyOtp, setStep }) => {
  return (
    <div className="max-w-md mx-auto pt-10 animate-fade-in text-center">
      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock size={30} className="text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Enter OTP</h2>
      <p className="text-gray-400 mb-8">
        We sent a 4-digit code to <span className="text-white font-mono">+91 {mobile}</span>.
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-center space-x-4 mb-8">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={otpRefs[idx]}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            className="w-14 h-14 bg-[#15161c] border border-gray-700 rounded-xl text-center text-2xl text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        ))}
      </div>

      {/* Twilio Placeholder Note */}
      <div className="text-xs text-yellow-500/50 mb-4 font-mono">
        [DEV NOTE: Connect Twilio Verify API here]
      </div>

      <button 
        onClick={handleVerifyOtp}
        disabled={otp.some(d => d === '')}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-all"
      >
        Verify & Discover Accounts
      </button>
      
      <button 
        onClick={() => setStep('mobile')} 
        className="mt-4 text-sm text-gray-500 hover:text-white"
      >
        Change Number
      </button>
    </div>
  );
};

export default OtpStep;