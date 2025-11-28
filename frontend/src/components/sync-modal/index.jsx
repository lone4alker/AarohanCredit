import React, { useState, useEffect, useRef } from 'react';
import IntroStep from './IntroStep';
import MobileStep from './MobileStep';
import OtpStep from './OtpStep';
import DiscoveryStep from './DiscoveryStep';
import ConsentStep from './ConsentStep';
import ProcessingStep from './ProcessingStep';
import ProgressBar from './ProgressBar';
import { X } from 'lucide-react';

const SyncModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState('intro');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  // Refs for OTP focus
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setMobile('');
      setOtp(['', '', '', '']);
    }
  }, [isOpen]);

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

  const steps = ['intro', 'mobile', 'otp', 'discovery', 'consent', 'processing'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className={`bg-[#1a1b23] border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${step === 'discovery' || step === 'consent' ? 'h-[80vh]' : 'h-auto min-h-[500px]'}`}>
        <ProgressBar currentStep={currentStepIndex} totalSteps={steps.length} />
        {step !== 'processing' && (
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
        )}
        <div className="flex-1 p-6 overflow-y-auto relative">
          {step === 'intro' && <IntroStep setStep={setStep} />}
          {step === 'mobile' && <MobileStep mobile={mobile} setMobile={setMobile} handleMobileSubmit={handleMobileSubmit} />}
          {step === 'otp' && <OtpStep otp={otp} otpRefs={otpRefs} mobile={mobile} handleOtpChange={handleOtpChange} handleVerifyOtp={handleVerifyOtp} setStep={setStep} />}
          {step === 'discovery' && <DiscoveryStep setStep={setStep} />}
          {step === 'consent' && <ConsentStep setStep={setStep} onClose={onClose} />}
          {step === 'processing' && <ProcessingStep onComplete={onComplete} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default SyncModal;