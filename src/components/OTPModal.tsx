import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, X } from 'lucide-react';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: 'pickup' | 'delivery';
  orderId?: string;
  expectedOTP?: string;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  type,
  orderId = 'SH-9902',
  expectedOTP = '2026',
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [status, setStatus] = useState<'input' | 'verifying' | 'success' | 'error'>('input');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '']);
      setStatus('input');
      setErrorMsg('');
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next field
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setErrorMsg('Please enter the full 4-digit code.');
      return;
    }

    setStatus('verifying');
    setErrorMsg('');

    // Simulate network delay
    setTimeout(() => {
      if (code === expectedOTP) {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setStatus('error');
        setErrorMsg('Invalid verification code. Try again (Hint: ' + expectedOTP + ').');
      }
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass-panel p-8 rounded-3xl overflow-hidden shadow-2xl border border-cardBorder text-fgApp z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-cardBorder/30 transition-colors text-mutedApp hover:text-fgApp"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content Switcher */}
            {status === 'input' || status === 'error' ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primaryApp/10 border border-primaryApp/20 flex items-center justify-center mx-auto mb-5">
                  <ShieldCheck className="w-7 h-7 text-primaryApp" />
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wide">
                  Verify {type === 'pickup' ? 'Pickup' : 'Delivery'} OTP
                </h3>
                <p className="text-xs text-mutedApp mt-2 max-w-xs mx-auto leading-relaxed">
                  Enter the verification code sent to the {type === 'pickup' ? 'Sender' : 'Receiver'} for Order <span className="font-semibold text-fgApp">{orderId}</span>.
                </p>

                {/* Input fields */}
                <div className="flex justify-center gap-3 mt-6">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el as HTMLInputElement; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-14 h-16 text-center text-2xl font-bold bg-cardBg rounded-2xl border border-cardBorder focus:border-primaryApp focus:shadow-[0_0_12px_rgba(var(--primary-rgb),0.2)] focus:outline-none transition-all"
                    />
                  ))}
                </div>

                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-medium mt-4 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg flex items-center gap-2 justify-center"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {errorMsg}
                  </motion.p>
                )}

                <button
                  onClick={handleVerify}
                  className="w-full bg-primaryApp hover:bg-primaryApp-hover text-bgApp font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 mt-6 btn-glow text-sm"
                >
                  Confirm Verification Code
                </button>

                <p className="text-[10px] text-mutedApp mt-4">
                  Did not receive it? <span className="text-primaryApp font-medium hover:underline cursor-pointer">Resend OTP</span> (Hint: 2026)
                </p>
              </div>
            ) : status === 'verifying' ? (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-cardBorder" />
                  <div className="absolute inset-0 rounded-full border-4 border-primaryApp border-t-transparent animate-spin" />
                </div>
                <h3 className="text-lg font-bold font-display">Verifying OTP Securely...</h3>
                <p className="text-xs text-mutedApp mt-2">Checking the signature on the Route Matrix ledger.</p>
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center justify-center">
                {/* Success Animation */}
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto"
                  >
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                  </motion.div>
                  
                  {/* Decorative sparkles */}
                  <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-green-400 sparkle-dot" style={{ animationDelay: '0.1s' }} />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-green-300 sparkle-dot" style={{ animationDelay: '0.4s' }} />
                  <div className="absolute top-8 -right-4 w-2 h-2 rounded-full bg-green-400 sparkle-dot" style={{ animationDelay: '0.7s' }} />
                </div>

                <h3 className="text-2xl font-bold font-display text-green-500">OTP Verified Successfully!</h3>
                <p className="text-xs text-mutedApp mt-2 max-w-xs">
                  {type === 'pickup'
                    ? 'Parcel picked up. Navigation routes unlocked.'
                    : 'Parcel successfully hand-delivered. Payment processing initiated.'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
