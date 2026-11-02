import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  XCircle,
  Copy,
  Share2,
} from 'lucide-react';
import { SettlementTransfer } from '../types';

interface MockUPIPaymentModalProps {
  transfer: SettlementTransfer;
  onSuccess: (transfer: SettlementTransfer) => void;
  onClose: () => void;
}

export const MockUPIPaymentModal: React.FC<MockUPIPaymentModalProps> = ({
  transfer,
  onSuccess,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'pin' | 'processing' | 'success'>('pin');
  const [txnId] = useState(`UPI/2026/${Math.floor(10000000 + Math.random() * 90000000)}`);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handlePay = () => {
    if (pin.length < 4) return;
    setStep('processing');

    setTimeout(() => {
      setStep('success');
      onSuccess(transfer);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#0b162a] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl space-y-0">
        {/* Header Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">
              Secure UPI Gateway
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {step === 'pin' && (
          <div className="p-6 space-y-5">
            {/* Payee Info */}
            <div className="text-center space-y-1">
              <span className="text-xs text-slate-400">Paying to</span>
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-lg font-bold text-white">{transfer.toName}</h3>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-xs text-teal-300 font-mono-numbers">{transfer.toUpiId}</p>

              <div className="pt-3">
                <span className="text-3xl font-black text-white tabular-nums font-mono-numbers">
                  ₹{transfer.amount}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Hostel Room 304 Split Settlement
                </span>
              </div>
            </div>

            {/* Bank account selection badge */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Debited From:</span>
              <span className="font-semibold text-slate-200">State Bank of India ·· 4092</span>
            </div>

            {/* PIN Entry Dots */}
            <div className="space-y-2 text-center">
              <label className="text-xs font-semibold text-slate-400">
                ENTER 4-DIGIT UPI PIN
              </label>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      pin.length > idx
                        ? 'bg-teal-400 border-teal-300 scale-110 shadow-[0_0_8px_rgba(45,212,191,0.6)]'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, i) => {
                if (key === '') return <div key={i} />;
                if (key === 'del') {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={handleDelete}
                      className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ⌫
                    </button>
                  );
                }
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleKeyPress(key)}
                    className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors cursor-pointer active:scale-95"
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={pin.length < 4}
              className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-black text-sm tracking-tight transition-all shadow-lg shadow-teal-500/25 active:scale-[0.98] cursor-pointer"
            >
              Pay Securely ₹{transfer.amount}
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Contacting NPCI & Bank...</h3>
              <p className="text-xs text-slate-400">Verifying UPI safety parameters</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                Payment Successful
              </span>
              <h3 className="text-2xl font-black text-white tabular-nums font-mono-numbers">
                ₹{transfer.amount}
              </h3>
              <p className="text-xs text-slate-400">
                Paid to <strong className="text-white">{transfer.toName}</strong> ({transfer.toUpiId})
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-left text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref:</span>
                <span className="text-slate-200 font-mono-numbers">{txnId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Time:</span>
                <span className="text-slate-200">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Group Status:</span>
                <span className="text-emerald-400 font-bold">Marked as Settled</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-teal-500/20 cursor-pointer"
            >
              Done & Return to Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
