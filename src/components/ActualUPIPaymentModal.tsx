import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  QrCode,
  Smartphone,
  Check,
  XCircle,
  AlertTriangle,
  Sparkles,
  Edit2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { PayLaterAccount, ReportedScam } from '../types';
import { buildUpiUri, generateUpiQrCode, getAppSpecificUpiUri } from '../utils/upiUtils';
import { analyzeTarget } from '../utils/shieldEngine';
import { playUpiSuccessChime } from '../utils/audioChime';
import { Zap, CreditCard as CardIcon } from 'lucide-react';

interface ActualUPIPaymentModalProps {
  initialPayeeName: string;
  initialUpiId: string;
  amount: number;
  note?: string;
  reportedScams: ReportedScam[];
  transferKey?: string;
  payLaterAccount?: PayLaterAccount;
  onSuccess: (details: {
    payeeName: string;
    upiId: string;
    amount: number;
    txnId: string;
    note: string;
    paymentMethod?: 'UPI' | 'PayLater';
  }) => void;
  onClose: () => void;
}

export const ActualUPIPaymentModal: React.FC<ActualUPIPaymentModalProps> = ({
  initialPayeeName,
  initialUpiId,
  amount: initialAmount,
  note: initialNote = 'PaySafe Buddy Transfer',
  reportedScams,
  transferKey,
  payLaterAccount,
  onSuccess,
  onClose,
}) => {
  // Check if user previously saved their real personal UPI ID in localStorage
  const savedRealUpi = typeof window !== 'undefined' ? localStorage.getItem('paysafe_real_user_upi') : null;

  const [paymentSource, setPaymentSource] = useState<'upi' | 'paylater'>('upi');
  const [payeeName, setPayeeName] = useState(initialPayeeName);
  const [upiId, setUpiId] = useState(savedRealUpi || initialUpiId);
  const [amount, setAmount] = useState(initialAmount);
  const [note, setNote] = useState(initialNote);
  const [isEditingPayee, setIsEditingPayee] = useState(false);

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'qr' | 'app'>('qr'); // default to QR so user sees live QR immediately
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [txnRef] = useState(`UPI/2026/${Math.floor(10000000 + Math.random() * 90000000)}`);

  // Common UPI suffixes for fast selection
  const commonSuffixes = ['@okhdfcbank', '@oksbi', '@okaxis', '@paytm', '@ybl', '@ibl'];

  // Shield safety scan of the payee UPI before transfer
  const shieldCheck = analyzeTarget(upiId, reportedScams);

  // Generate real QR code when parameters change
  useEffect(() => {
    let isMounted = true;
    generateUpiQrCode({
      pa: upiId,
      pn: payeeName,
      am: amount,
      tn: note,
    }).then((url) => {
      if (isMounted) setQrCodeUrl(url);
    });

    return () => {
      isMounted = false;
    };
  }, [upiId, payeeName, amount, note]);

  const upiUri = buildUpiUri({
    pa: upiId,
    pn: payeeName,
    am: amount,
    tn: note,
  });

  const gpayUri = getAppSpecificUpiUri('gpay', { pa: upiId, pn: payeeName, am: amount, tn: note });
  const phonepeUri = getAppSpecificUpiUri('phonepe', { pa: upiId, pn: payeeName, am: amount, tn: note });
  const paytmUri = getAppSpecificUpiUri('paytm', { pa: upiId, pn: payeeName, am: amount, tn: note });
  const credUri = getAppSpecificUpiUri('cred', { pa: upiId, pn: payeeName, am: amount, tn: note });

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveRealUpi = (newUpi: string) => {
    const trimmed = newUpi.trim();
    if (trimmed) {
      setUpiId(trimmed);
      localStorage.setItem('paysafe_real_user_upi', trimmed);
    }
  };

  const handleMarkPaymentDone = (overrideMethod?: 'UPI' | 'PayLater') => {
    const finalMethod = overrideMethod || (paymentSource === 'paylater' ? 'PayLater' : 'UPI');
    playUpiSuccessChime();
    setIsSuccessState(true);
    setTimeout(() => {
      onSuccess({
        payeeName,
        upiId,
        amount,
        txnId: txnRef,
        note,
        paymentMethod: finalMethod,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#0b162a] border border-teal-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide uppercase block">
                {paymentSource === 'paylater' ? 'PaySafe PayLater Checkout' : 'Live UPI Payment & QR Code'}
              </span>
              <span className="text-[10px] text-teal-300">
                {paymentSource === 'paylater' ? '0% Student Credit Line · 15-Day Cycle' : 'NPCI Certified Standard · Real Money'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {isSuccessState ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                {paymentSource === 'paylater' ? '⚡ PaySafe PayLater Approved' : 'UPI Transfer Recorded & Settled'}
              </span>
              <h3 className="text-3xl font-black text-white tabular-nums font-mono-numbers">
                ₹{amount}
              </h3>
              <p className="text-xs text-slate-300">
                Paid to <strong className="text-white">{payeeName}</strong> ({upiId})
              </p>
              {paymentSource === 'paylater' && (
                <p className="text-[11px] text-teal-300 font-medium pt-1">
                  0% Interest · Settle bill by {payLaterAccount?.dueDate || '20th of month'}
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-left text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Payment Mode:</span>
                <span className="text-teal-300 font-bold">
                  {paymentSource === 'paylater' ? 'PaySafe PayLater (0% Credit)' : 'Bank Account (UPI Direct)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transaction Ref:</span>
                <span className="text-slate-200 font-mono-numbers">{txnRef}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span className="text-slate-200">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Buddy Ledger:</span>
                <span className="text-emerald-400 font-bold">Auto-Logged in Passbook</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-teal-500/20 cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Payee Info & Real UPI Input Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Payee Registered UPI Handle</span>
                <button
                  onClick={() => setIsEditingPayee(!isEditingPayee)}
                  className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{isEditingPayee ? 'Done' : 'Change UPI ID'}</span>
                </button>
              </div>

              {isEditingPayee ? (
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-0.5">
                      Enter Your Actual Registered UPI ID (to receive money):
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => handleSaveRealUpi(e.target.value)}
                      placeholder="e.g. 9876543210@paytm or yourname@okhdfcbank"
                      className="w-full px-3 py-2 bg-slate-950 border border-teal-500 rounded-xl text-xs text-teal-300 font-mono-numbers font-semibold focus:outline-none"
                    />
                  </div>

                  {/* Quick Suffix Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] text-slate-500 mr-1 self-center">Suffixes:</span>
                    {commonSuffixes.map((suffix) => (
                      <button
                        type="button"
                        key={suffix}
                        onClick={() => {
                          const base = upiId.includes('@') ? upiId.split('@')[0] : upiId;
                          handleSaveRealUpi((base || 'user') + suffix);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-mono cursor-pointer"
                      >
                        {suffix}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">Payee Name:</label>
                      <input
                        type="text"
                        value={payeeName}
                        onChange={(e) => setPayeeName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">Amount (₹):</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono-numbers font-bold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-white">{payeeName}</h3>
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="text-xs text-teal-300 font-mono-numbers font-medium flex items-center gap-1.5">
                      <span>{upiId}</span>
                      <button
                        onClick={() => copyToClipboard(upiId, 'upiId')}
                        className="text-slate-400 hover:text-white"
                        title="Copy UPI ID"
                      >
                        {copiedField === 'upiId' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-white tabular-nums font-mono-numbers block">
                      ₹{amount}
                    </span>
                    <div className="flex gap-1 justify-end mt-0.5">
                      {[1, 10, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setAmount(amt)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            amount === amt ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Unlimited Customizable Transfer Amount Section */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <span>Transfer Amount</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 font-extrabold border border-teal-500/30">
                      Unlimited · Custom Amount
                    </span>
                  </label>
                  <span className="text-[10px] text-slate-400">No transfer limits</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-black text-teal-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={amount || ''}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value) || 0);
                      setAmount(val);
                    }}
                    placeholder="Enter custom amount..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border-2 border-teal-500/50 focus:border-teal-400 rounded-xl text-2xl font-black text-white font-mono-numbers focus:outline-none transition-colors"
                  />
                </div>

                {/* Fast Preset & Booster Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                  {[50, 100, 250, 500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap ${
                        amount === amt
                          ? 'bg-teal-500 text-slate-950 shadow-sm font-black'
                          : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount((prev) => prev + 500)}
                    className="px-2 py-1 rounded-lg text-xs font-bold bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap"
                    title="Add ₹500 to current amount"
                  >
                    +₹500
                  </button>
                </div>
              </div>

              {/* PaySafe Shield Live Verification Banner */}
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                  shieldCheck.level === 'danger'
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    : shieldCheck.level === 'caution'
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {shieldCheck.level === 'danger' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                ) : shieldCheck.level === 'caution' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <div className="leading-tight">
                  <span className="font-bold">PaySafe Shield: </span>
                  <span>{shieldCheck.headline} (Risk: {shieldCheck.score}/100)</span>
                </div>
              </div>
            </div>

            {/* Payment Source: Bank Account (UPI) vs PaySafe PayLater */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Select Payment Method
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentSource('upi')}
                  className={`p-3 rounded-2xl border text-left transition-all duration-150 active:scale-95 cursor-pointer ${
                    paymentSource === 'upi'
                      ? 'bg-teal-500/20 border-teal-400 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <CardIcon className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold block">Bank UPI</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">SBI Savings ···· 4092</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentSource('paylater')}
                  className={`p-3 rounded-2xl border text-left transition-all duration-150 active:scale-95 cursor-pointer relative overflow-hidden ${
                    paymentSource === 'paylater'
                      ? 'bg-teal-500/20 border-teal-400 text-white shadow-sm ring-1 ring-teal-400/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-bold block">Pay Later</span>
                    </div>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300">
                      5% Interest
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-300 block mt-0.5 font-mono-numbers font-medium">
                    ₹{payLaterAccount?.availableLimit ?? 2550} limit left
                  </span>
                </button>
              </div>
            </div>

            {/* PAY LATER CHECKOUT VIEW */}
            {paymentSource === 'paylater' ? (
              <div className="space-y-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                        PaySafe Student Credit Line
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      5% Cycle Interest Rate
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 block">Available Credit</span>
                      <span className="text-base font-black text-white tabular-nums font-mono-numbers">
                        ₹{payLaterAccount?.availableLimit ?? 2550}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 block">Bill Due Date</span>
                      <span className="text-base font-bold text-teal-300">
                        {payLaterAccount?.dueDate ?? '20th of month'}
                      </span>
                    </div>
                  </div>

                  {/* 5% Interest Fee Calculation Breakdown */}
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-1 font-mono-numbers">
                    <div className="flex justify-between text-slate-400">
                      <span>Principal Amount:</span>
                      <span className="text-white font-bold">₹{amount}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>5% Student Cycle Interest:</span>
                      <span className="text-amber-400 font-bold">+₹{Math.round(amount * 0.05)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                      <span className="text-slate-300">Total Dues at Cycle End:</span>
                      <span className="text-teal-300">₹{amount + Math.round(amount * 0.05)}</span>
                    </div>
                  </div>

                  {payLaterAccount?.isFrozen ? (
                    <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Your PayLater account is currently frozen. Unfreeze it to make purchases.</span>
                    </div>
                  ) : (payLaterAccount?.availableLimit ?? 2550) < amount ? (
                    <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Insufficient limit. Amount (₹{amount}) exceeds remaining credit.</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/20 text-[11px] text-teal-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>Nominal 5% student interest applied on billing date. Backed by REVA ID.</span>
                    </div>
                  )}
                </div>

                {/* Instant PayLater Action Button */}
                <button
                  type="button"
                  onClick={() => handleMarkPaymentDone('PayLater')}
                  disabled={payLaterAccount?.isFrozen || (payLaterAccount?.availableLimit ?? 2550) < amount}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-lg active:scale-95 cursor-pointer ${
                    payLaterAccount?.isFrozen || (payLaterAccount?.availableLimit ?? 2550) < amount
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-slate-950 shadow-teal-500/30'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Pay ₹{amount} with PayLater (5% Interest)</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  Instant settlement · No OTP required · Auto-billed on 15th
                </p>
              </div>
            ) : (
              <>
                {/* Mode Switch: Scan Dynamic QR vs Launch UPI App */}
                <div className="flex rounded-2xl bg-slate-950 border border-slate-800 p-1 gap-1">
                  <button
                    onClick={() => setActiveTab('qr')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'qr'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan Dynamic QR</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('app')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'app'
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Open in UPI App</span>
                  </button>
                </div>

            {/* TAB A: Scan Dynamic UPI QR Code */}
            {activeTab === 'qr' && (
              <div className="space-y-3 text-center">
                {/* Important Real Bank Tip */}
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-left text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Why did your app say "Not Registered"?</strong>
                    <span>
                      Live banking apps (GPay, PhonePe, Paytm) connect to real bank servers. Mock sample handles aren't on NPCI servers. To test scanning real money, click <strong>"Change UPI ID"</strong> above and enter your actual bank UPI ID (e.g. <code>98xxxxxxxx@paytm</code> or <code>yourname@okhdfcbank</code>). The QR updates instantly!
                    </span>
                  </div>
                </div>

                <div className="inline-block p-4 bg-white rounded-3xl shadow-xl shadow-teal-500/10 border-4 border-teal-500/30 mx-auto">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt={`UPI QR code for ₹${amount}`}
                      className="w-52 h-52 mx-auto"
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center text-slate-900 text-xs">
                      Generating Live NPCI QR...
                    </div>
                  )}
                  <div className="text-xs text-slate-900 font-bold mt-1 tracking-tight">
                    BHIM UPI · ₹{amount}
                  </div>
                </div>

                <div className="text-xs text-teal-300 font-mono-numbers">
                  Payee: {payeeName} ({upiId})
                </div>
              </div>
            )}

            {/* TAB B: Launch Installed UPI Apps */}
            {activeTab === 'app' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Tap your preferred UPI app on this device to transfer ₹{amount} directly with payee prefilled:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {/* Google Pay */}
                  <a
                    href={gpayUri}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-teal-400 text-white font-bold text-xs flex items-center justify-between transition-all hover:bg-slate-800 active:scale-95 group shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black">
                        G
                      </span>
                      <span>Google Pay</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400" />
                  </a>

                  {/* PhonePe */}
                  <a
                    href={phonepeUri}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-purple-400 text-white font-bold text-xs flex items-center justify-between transition-all hover:bg-slate-800 active:scale-95 group shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-black">
                        Pe
                      </span>
                      <span>PhonePe</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400" />
                  </a>

                  {/* Paytm */}
                  <a
                    href={paytmUri}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-bold text-xs flex items-center justify-between transition-all hover:bg-slate-800 active:scale-95 group shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-black">
                        P
                      </span>
                      <span>Paytm</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                  </a>

                  {/* CRED */}
                  <a
                    href={credUri}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-white font-bold text-xs flex items-center justify-between transition-all hover:bg-slate-800 active:scale-95 group shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black">
                        C
                      </span>
                      <span>CRED UPI</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                  </a>
                </div>

                {/* Universal Any UPI App Intent Button */}
                <a
                  href={upiUri}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/25 active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Launch Default UPI App (BHIM / Bank / Any)</span>
                </a>

                {/* Copy URI Link as Fallback */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
                  <span className="truncate mr-2 font-mono">{upiUri}</span>
                  <button
                    onClick={() => copyToClipboard(upiUri, 'upiUri')}
                    className="text-teal-400 hover:text-white font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1"
                  >
                    {copiedField === 'upiUri' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'upiUri' ? 'Copied' : 'Copy Intent'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Complete Payment Confirmation Bar (For Bank UPI) */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <button
                onClick={() => handleMarkPaymentDone('UPI')}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Confirm Actual UPI Payment Completed</span>
              </button>

              <p className="text-[10px] text-slate-500 text-center leading-tight">
                Once you approve the transfer in your UPI banking app, tap the green confirmation above to update the ledger & earn rewards.
              </p>
            </div>
          </>
        )}
      </div>
    )}
      </div>
    </div>
  );
};
