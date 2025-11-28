import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Smartphone, 
  Building2, 
  CheckCircle, 
  X, 
  ChevronRight, 
  Loader2, 
  Lock, 
  FileText, 
  Server, 
  Cpu, 
  AlertCircle 
} from 'lucide-react';

// --- MOCK DATA FOR DISCOVERY ---
const MOCK_ACCOUNTS = [
  { id: 1, bank: 'HDFC Bank', type: 'Current Account', mask: 'XXXX-4921', logo: 'H', status: 'active' },
  { id: 2, bank: 'State Bank of India', type: 'Savings Account', mask: 'XXXX-8822', logo: 'S', status: 'active' },
  { id: 3, bank: 'GST Network', type: 'GST Returns', mask: '27AAAAA0000A1Z5', logo: 'G', status: 'active' },
  { id: 4, bank: 'Axis Bank', type: 'Overdraft', mask: 'XXXX-1102', logo: 'A', status: 'error' }, // Example of error account
];

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

const SyncModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState('intro'); // intro, mobile, otp, discovery, bank_otp, consent, processing
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [discoveredAccounts, setDiscoveredAccounts] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [processingLogIndex, setProcessingLogIndex] = useState(0);
  
  // Refs for OTP focus
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setMobile('');
      setOtp(['', '', '', '']);
      setDiscoveredAccounts([]);
      setProcessingLogIndex(0);
    }
  }, [isOpen]);

  // --- LOGIC: ACCOUNT DISCOVERY ANIMATION ---
  useEffect(() => {
    if (step === 'discovery') {
      setIsScanning(true);
      setDiscoveredAccounts([]);
      
      // Simulate "One by One" Discovery
      let delay = 1000;
      MOCK_ACCOUNTS.forEach((acc, index) => {
        setTimeout(() => {
          setDiscoveredAccounts(prev => [...prev, acc]);
          if (index === MOCK_ACCOUNTS.length - 1) setIsScanning(false);
        }, delay);
        delay += 800; // 800ms gap between each discovery
      });
    }
  }, [step]);

  // --- LOGIC: AI PROCESSING SIMULATION ---
  useEffect(() => {
    if (step === 'processing') {
      if (processingLogIndex < PROCESSING_LOGS.length) {
        const timeout = setTimeout(() => {
          setProcessingLogIndex(prev => prev + 1);
        }, 2500); // 2.5 seconds per log line ~ 25-30s total
        return () => clearTimeout(timeout);
      } else {
        // Complete
        setTimeout(() => {
          onComplete();
          onClose();
        }, 1000);
      }
    }
  }, [step, processingLogIndex, onComplete, onClose]);

  // --- HANDLERS ---
  
  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (mobile.length === 10) setStep('otp');
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 3) otpRefs[index + 1].current.focus();
  };

  const handleVerifyOtp = () => {
    // TODO: Integrate Twilio Verification Here
    // const code = otp.join('');
    // await verifyTwilioOTP(mobile, code);
    setStep('discovery');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className={`bg-[#1a1b23] border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${step === 'discovery' || step === 'consent' ? 'h-[80vh]' : 'h-auto min-h-[500px]'}`}>
        

        {/* MODAL BODY */}
        <div className="flex-1 p-6 overflow-y-auto relative">

          {/* STEP 1: INTRO */}
          {step === 'intro' && (
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
          )}

          {/* STEP 2: MOBILE INPUT (DISCOVERY) */}
          {step === 'mobile' && (
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
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === 'otp' && (
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
              {/* <div className="text-xs text-yellow-500/50 mb-4 font-mono">
                [DEV NOTE: Connect Twilio Verify API here]
              </div> */}

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
          )}

          {/* STEP 4: ACCOUNT DISCOVERY (ANIMATED) */}
          {step === 'discovery' && (
            <div className="h-full flex flex-col animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">Discovered Accounts</h2>
                <p className="text-sm text-gray-400">Select the accounts you want to link for credit assessment.</p>
              </div>

              {/* Scanning Indicator */}
              {isScanning && (
                <div className="flex items-center justify-center space-x-2 mb-4 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400 text-sm">
                   <Loader2 size={16} className="animate-spin" />
                   <span>Scanning banking networks...</span>
                </div>
              )}

              {/* Account List */}
              <div className="space-y-3 flex-1 overflow-y-auto px-2">
                {discoveredAccounts.map((acc) => (
                   <div key={acc.id} className="group flex items-center p-4 bg-gray-800/40 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all duration-300 animate-slide-up cursor-pointer">
                      {/* Selection Checkbox */}
                      <div className={`w-5 h-5 rounded border flex items-center justify-center mr-4 transition-colors ${acc.status === 'error' ? 'border-red-500/50 bg-red-500/10' : 'border-blue-500 bg-blue-600'}`}>
                         {acc.status !== 'error' && <CheckCircle size={14} className="text-white" />}
                         {acc.status === 'error' && <AlertCircle size={14} className="text-red-500" />}
                      </div>

                      {/* Bank Logo Placeholder */}
                      <div className="w-10 h-10 rounded-full bg-white text-gray-900 font-bold flex items-center justify-center text-lg mr-4">
                        {acc.logo}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{acc.bank}</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-400">{acc.type}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          <span className="text-gray-500 font-mono">{acc.mask}</span>
                        </div>
                      </div>

                      {/* Status Tag */}
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

              {/* Footer Actions */}
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
          )}

          {/* STEP 6 (Skipped 5 for simplicity): CONSENT REVIEW */}
          {step === 'consent' && (
            <div className="h-full flex flex-col animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6">Review Consent Artifact</h2>
              
              <div className="flex-1 overflow-y-auto bg-gray-800/30 rounded-xl border border-gray-700 p-6 space-y-6">
                
                {/* Purpose Section */}
                <div>
                   <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Purpose of Request</h4>
                   <p className="text-white text-sm bg-[#15161c] p-3 rounded-lg border border-gray-700">
                     Credit Assessment and Cash Flow Analysis for MSME Loan Application.
                   </p>
                </div>

                {/* Data Requested */}
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

                {/* Validity */}
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

                {/* Disclaimer */}
                <div className="flex items-start bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  <Shield size={16} className="text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-blue-200">
                    Your data is fetched directly from the source banks via the Account Aggregator network. We do not store your banking credentials.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                 <button onClick={() => onClose()} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium">
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
          )}

          {/* STEP 7: AI PROCESSING SIMULATION */}
          {step === 'processing' && (
            <div className="h-full flex flex-col justify-center items-center animate-fade-in text-center">
              
              {/* Spinner & Icons */}
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Server className="text-gray-500 animate-pulse" size={40} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Analyzing Financial Data</h2>
              <p className="text-gray-400 mb-8 max-w-sm">Please wait while our Agentic AI Orchestrator processes your raw banking data.</p>

              {/* Progress Bar */}
              <div className="w-full max-w-md bg-gray-800 h-2 rounded-full overflow-hidden mb-6">
                 <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${(processingLogIndex / PROCESSING_LOGS.length) * 100}%` }}
                 ></div>
              </div>

              {/* Terminal Logs */}
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
          )}

        </div>
      </div>
    </div>
  );
};

export default SyncModal;