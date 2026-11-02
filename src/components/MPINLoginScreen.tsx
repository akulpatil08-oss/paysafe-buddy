import React, { useState } from 'react';
import {
  Lock,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserProfile } from '../types';

interface MPINLoginScreenProps {
  userProfile: UserProfile;
  onLoginSuccess: () => void;
  onResetMpin: (newMpin: string) => void;
}

export const MPINLoginScreen: React.FC<MPINLoginScreenProps> = ({
  userProfile,
  onLoginSuccess,
  onResetMpin,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'otp' | 'newpin'>('otp');
  const [otpInput, setOtpInput] = useState('');
  const [newMpinInput, setNewMpinInput] = useState('');

  const targetMpin = userProfile.mpin || '123456';

  const handleNumberClick = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg(null);

      // Auto-validate once 6 digits are entered
      if (nextPin.length === 6) {
        validatePin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const validatePin = (inputPin: string) => {
    if (inputPin === targetMpin) {
      onLoginSuccess();
    } else {
      setIsShaking(true);
      setErrorMsg(`Incorrect MPIN. (Default demo MPIN: ${targetMpin})`);
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 700);
    }
  };

  const handleBiometricAuth = () => {
    // Simulate biometric scan
    setErrorMsg(null);
    onLoginSuccess();
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 'otp') {
      if (otpInput.length >= 4) {
        setForgotStep('newpin');
      } else {
        setErrorMsg('Please enter 4-digit OTP sent to registered mobile');
      }
    } else {
      if (newMpinInput.length === 6) {
        onResetMpin(newMpinInput);
        setShowForgotModal(false);
        setForgotStep('otp');
        setOtpInput('');
        setNewMpinInput('');
        onLoginSuccess();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061129] via-[#091B42] to-[#050C1D] text-slate-100 flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Multi-App UPI Branding */}
      <div className="w-full max-w-sm mx-auto pt-5 text-center space-y-3 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-bold shadow-md">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>PaySafe Buddy · Works with GPay, PhonePe & Paytm</span>
        </div>

        <div className="pt-2">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-purple-600 to-teal-400 p-[2px] mx-auto shadow-xl shadow-teal-500/20">
            <div className="w-full h-full bg-[#081533] rounded-[22px] flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-teal-300 stroke-[2.2]" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-3 tracking-tight">
            Hello, {userProfile.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {userProfile.college} · {userProfile.upiId}
          </p>

          {/* Supported Apps Mini Badges */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
              Google Pay
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
              PhonePe
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
              Paytm
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              BHIM
            </span>
          </div>
        </div>
      </div>

      {/* Center MPIN Pad & Dots */}
      <div className="w-full max-w-sm mx-auto space-y-6 z-10 my-auto py-4">
        {/* MPIN Prompt */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5 text-teal-400" />
            <span>Enter 6-Digit MPIN to Unlock</span>
          </div>

          {/* 6 Masked MPIN Dots */}
          <div
            className={`flex justify-center gap-3 py-2 transition-transform ${
              isShaking ? 'translate-x-[-10px] duration-75 animate-bounce text-rose-400' : ''
            }`}
          >
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  pin.length > idx
                    ? 'bg-teal-400 border-teal-300 scale-125 shadow-[0_0_10px_rgba(45,212,191,0.8)]'
                    : 'border-slate-600 bg-slate-900/60'
                }`}
              />
            ))}
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 font-semibold flex items-center justify-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tactical Keypad */}
        <div className="grid grid-cols-3 gap-3 px-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'].map((key, i) => {
            if (key === 'bio') {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={handleBiometricAuth}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-700/60 text-teal-400 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                  title="Use Biometrics / Fingerprint"
                >
                  <Fingerprint className="w-6 h-6" />
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5">Biometric</span>
                </button>
              );
            }
            if (key === 'del') {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={handleDelete}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-900/70 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-bold text-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                  title="Backspace"
                >
                  ⌫
                </button>
              );
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleNumberClick(key)}
                className="h-14 sm:h-16 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-md shadow-slate-950/40"
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Quick Demo Bypass & Forgot MPIN */}
        <div className="flex items-center justify-between text-xs px-2 pt-2">
          <button
            onClick={() => validatePin(targetMpin)}
            className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            title="Fast 1-tap unlock for demos"
          >
            <Sparkles className="w-3 h-3" />
            <span>Demo Unlock (123456)</span>
          </button>

          <button
            onClick={() => setShowForgotModal(true)}
            className="text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Forgot MPIN?
          </button>
        </div>
      </div>

      {/* Bottom NPCI / Bank Security Banner */}
      <div className="w-full max-w-sm mx-auto text-center pb-2 z-10">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Lock className="w-3 h-3 text-teal-400" />
          <span>NPCI 256-Bit Encrypted · Works with GPay, PhonePe, Paytm & BHIM</span>
        </div>
      </div>

      {/* Forgot MPIN Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-teal-400" />
              <span>Reset 6-Digit Login MPIN</span>
            </h3>

            {forgotStep === 'otp' ? (
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter 4-digit OTP sent to registered student phone for <strong>{userProfile.name}</strong>:
                </p>
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-digit OTP (e.g. 7842)"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-mono-numbers font-bold text-teal-300 tracking-widest focus:outline-none focus:border-teal-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Verify OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <p className="text-xs text-slate-300">Set your new 6-digit MPIN:</p>
                <input
                  type="password"
                  maxLength={6}
                  value={newMpinInput}
                  onChange={(e) => setNewMpinInput(e.target.value)}
                  placeholder="New 6-digit MPIN"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-mono-numbers font-bold text-teal-300 tracking-widest focus:outline-none focus:border-teal-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Set MPIN & Unlock
                </button>
              </form>
            )}

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
