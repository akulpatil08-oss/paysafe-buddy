import React, { useState } from 'react';
import {
  CreditCard,
  XCircle,
  Zap,
  ShieldCheck,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt,
  Store,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { PayLaterAccount, UserProfile } from '../types';
import { playUpiSuccessChime } from '../utils/audioChime';

interface PayLaterHubModalProps {
  payLaterAccount: PayLaterAccount;
  userProfile: UserProfile;
  onUpdateAccount: (updated: PayLaterAccount) => void;
  onOpenPayLaterCheck: () => void;
  onClose: () => void;
}

export const PayLaterHubModal: React.FC<PayLaterHubModalProps> = ({
  payLaterAccount,
  userProfile,
  onUpdateAccount,
  onOpenPayLaterCheck,
  onClose,
}) => {
  const [isPayingBill, setIsPayingBill] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const usedPercentage = Math.min(
    100,
    Math.round((payLaterAccount.usedLimit / payLaterAccount.totalLimit) * 100)
  );

  // 5% Student Flexible Cycle Interest
  const interestAmount = Math.round(payLaterAccount.usedLimit * 0.05);
  const totalPayableWithInterest = payLaterAccount.usedLimit + interestAmount;

  const handleToggleFreeze = () => {
    const updated = {
      ...payLaterAccount,
      isFrozen: !payLaterAccount.isFrozen,
    };
    onUpdateAccount(updated);
    setSuccessMessage(
      updated.isFrozen ? 'PayLater line frozen for safety.' : 'PayLater line unfrozen and ready to use.'
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePayBill = () => {
    if (payLaterAccount.usedLimit === 0) return;
    setIsPayingBill(true);
    playUpiSuccessChime();

    setTimeout(() => {
      const settledTxns = payLaterAccount.transactions.map((t) => ({
        ...t,
        status: 'settled' as const,
      }));

      const updated: PayLaterAccount = {
        ...payLaterAccount,
        usedLimit: 0,
        availableLimit: payLaterAccount.totalLimit,
        transactions: settledTxns,
      };

      onUpdateAccount(updated);
      setIsPayingBill(false);
      setSuccessMessage(`PayLater bill paid (₹${totalPayableWithInterest} settled via UPI)! Credit limit restored to ₹${payLaterAccount.totalLimit}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1200);
  };

  const handleDemoPurchase = () => {
    if (payLaterAccount.isFrozen) {
      setSuccessMessage('Cannot make purchase: PayLater line is currently frozen.');
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }
    const demoAmount = 120;
    if (payLaterAccount.availableLimit < demoAmount) {
      setSuccessMessage('Insufficient PayLater limit available.');
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }

    playUpiSuccessChime();
    const newTxn = {
      id: `plt-${Date.now()}`,
      payeeName: 'Hostel Night Canteen (Maggi & Chai)',
      upiId: 'nightcanteen@oksbi',
      amount: demoAmount,
      date: 'Just now',
      status: 'pending' as const,
      billingCycle: 'Current Cycle',
    };

    const updated: PayLaterAccount = {
      ...payLaterAccount,
      usedLimit: payLaterAccount.usedLimit + demoAmount,
      availableLimit: payLaterAccount.availableLimit - demoAmount,
      transactions: [newTxn, ...payLaterAccount.transactions],
    };

    onUpdateAccount(updated);
    setSuccessMessage('Demo ₹120 Canteen payment approved instantly via PayLater!');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#0b162a] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-teal-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  PaySafe PayLater
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  5% Flexible Interest
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pre-approved student credit line for campus meals, books & transit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-300 dark:border-emerald-600/40 px-5 py-2.5 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Main Virtual Credit Card Tile */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1f3d] via-[#102b54] to-[#07162d] p-5 text-white shadow-xl border border-slate-700">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-teal-500/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-teal-300 border border-white/10">
                  Student Credit Line
                </span>
                {payLaterAccount.isFrozen && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Card Frozen
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-300 font-mono">
                {userProfile.college.split(' ')[0]} Verified
              </span>
            </div>

            {/* Balances */}
            <div className="relative z-10 pt-4 pb-2 space-y-1">
              <span className="text-[11px] text-slate-300 font-medium">Available to Spend Now</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tabular-nums font-mono-numbers">
                  ₹{payLaterAccount.availableLimit.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400">
                  / ₹{payLaterAccount.totalLimit.toLocaleString('en-IN')} total
                </span>
              </div>
            </div>

            {/* Limit Progress Bar */}
            <div className="relative z-10 space-y-1.5 pt-1">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-400 to-cyan-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${usedPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-300 font-mono-numbers">
                <span>Principal Used: ₹{payLaterAccount.usedLimit}</span>
                <span>{usedPercentage}% utilized</span>
              </div>
            </div>

            {/* Card Footer: Repayment Due date */}
            <div className="relative z-10 pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Next Bill: <strong>{payLaterAccount.dueDate}</strong></span>
              </div>
              <span className="text-[11px] text-amber-300 font-bold">5% Flexible Interest</span>
            </div>
          </div>

          {/* Dues Breakdown Pill if balance outstanding */}
          {payLaterAccount.usedLimit > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-mono-numbers">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Spent Principal:</span>
                <span className="text-slate-900 dark:text-white font-bold">₹{payLaterAccount.usedLimit}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>5% Student Cycle Fee:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">+₹{interestAmount}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 text-sm font-black text-slate-900 dark:text-teal-300">
                <span>Total Due on {payLaterAccount.dueDate}:</span>
                <span>₹{totalPayableWithInterest}</span>
              </div>
            </div>
          )}

          {/* Action Row: Pay Bill & Freeze Card */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Pay Bill Button */}
            <button
              onClick={handlePayBill}
              disabled={payLaterAccount.usedLimit === 0 || isPayingBill}
              className={`p-3.5 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer shadow-sm ${
                payLaterAccount.usedLimit > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4" />
                <span>{isPayingBill ? 'Paying Bill...' : 'Pay Bill via UPI'}</span>
              </div>
              <span className="text-[10px] font-normal opacity-90 font-mono-numbers">
                {payLaterAccount.usedLimit > 0 ? `Clear ₹${totalPayableWithInterest}` : 'All Dues Cleared'}
              </span>
            </button>

            {/* Toggle Freeze / Security */}
            <button
              onClick={handleToggleFreeze}
              className={`p-3.5 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer shadow-sm active:scale-95 ${
                payLaterAccount.isFrozen
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {payLaterAccount.isFrozen ? (
                  <>
                    <Unlock className="w-4 h-4 text-rose-500" />
                    <span>Unfreeze Line</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-teal-500" />
                    <span>Freeze Card</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-normal opacity-80">
                {payLaterAccount.isFrozen ? 'Card is locked' : 'Instant 1-tap lock'}
              </span>
            </button>
          </div>

          {/* Quick Demo Purchase Test Button */}
          <button
            onClick={handleDemoPurchase}
            className="w-full py-2.5 px-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-between hover:bg-teal-100 dark:hover:bg-teal-950/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Simulate PayLater Checkout (₹120 Campus Cafe)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* BNPL Calculator & Stress Test Link */}
          <button
            onClick={() => {
              onClose();
              onOpenPayLaterCheck();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left flex items-center justify-between hover:border-teal-500/40 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-teal-500 transition-colors">
                  Pay-Later & EMI Stress Tester
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Calculate repayment burden before taking external loans
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
          </button>

          {/* Student Credit Tier & Perks */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Campus Trust Tier 1
                </span>
              </div>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                Safety Score: {userProfile.safetyScore}/100
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on your campus verification at <strong>{userProfile.college}</strong> and your high Safety Score, you unlocked an instant <strong>₹3,000 credit limit</strong>.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Interest Rate</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">0%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Grace Period</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">15 Days</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Next Tier</span>
                <span className="text-xs font-black text-teal-600 dark:text-teal-400">₹5,000</span>
              </div>
            </div>
          </div>

          {/* Recent PayLater Transactions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                PayLater Statement
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {payLaterAccount.transactions.length} records
              </span>
            </div>

            {payLaterAccount.transactions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">No PayLater transactions yet.</p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400">
                  Select "PaySafe PayLater" during any UPI checkout to pay with 0% credit!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {payLaterAccount.transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {txn.payeeName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <span>{txn.date}</span>
                        <span>·</span>
                        <span className="font-mono">{txn.upiId}</span>
                      </div>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums font-mono-numbers block">
                        ₹{txn.amount}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block ${
                          txn.status === 'settled'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {txn.status === 'settled' ? 'Settled' : 'Due on 20th'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-teal-500 hover:bg-slate-800 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Close PayLater Hub
          </button>
        </div>
      </div>
    </div>
  );
};
