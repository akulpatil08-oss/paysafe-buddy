import React, { useState } from 'react';
import {
  Send,
  QrCode,
  Users,
  Gift,
  Eye,
  EyeOff,
  Lock,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Building,
  Zap,
} from 'lucide-react';
import { PayLaterAccount, UserProfile } from '../types';

interface QuickPayHubProps {
  userProfile: UserProfile;
  pocketMoney: number;
  totalSpent: number;
  cashbackBalance: number;
  payLaterAccount?: PayLaterAccount;
  onOpenDirectUpiTransfer: (customPayee?: { name: string; upiId: string; amount?: number; note?: string }) => void;
  onSelectTab: (tab: 'shield' | 'buddy' | 'group' | 'profile') => void;
  onOpenCashback: () => void;
  onOpenPayLaterHub: () => void;
  onLockApp: () => void;
}

export const QuickPayHub: React.FC<QuickPayHubProps> = ({
  userProfile,
  pocketMoney,
  totalSpent,
  cashbackBalance,
  payLaterAccount,
  onOpenDirectUpiTransfer,
  onSelectTab,
  onOpenCashback,
  onOpenPayLaterHub,
  onLockApp,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedApp, setSelectedApp] = useState<'all' | 'gpay' | 'phonepe' | 'paytm'>('all');

  const availableBalance = Math.max(0, pocketMoney - totalSpent);

  // Real Indian UPI Supported Apps
  const supportedUpiApps = [
    { id: 'gpay', name: 'Google Pay', short: 'GPay', color: 'from-blue-500 to-indigo-600', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'phonepe', name: 'PhonePe', short: 'PhonePe', color: 'from-purple-600 to-indigo-700', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'paytm', name: 'Paytm UPI', short: 'Paytm', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { id: 'bhim', name: 'BHIM UPI', short: 'BHIM', color: 'from-emerald-500 to-teal-700', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'cred', name: 'CRED UPI', short: 'CRED', color: 'from-amber-600 to-rose-700', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  ];

  return (
    <div className="space-y-4 mb-5">
      {/* Greeting & Quick Lock Header */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Universal UPI · Multi-App Student Wallet</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] dark:text-white tracking-tight">
            Hi, {userProfile.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Lock Button */}
          <button
            onClick={onLockApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 hover:border-rose-400 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            title="Lock PaySafe Buddy with MPIN"
          >
            <Lock className="w-3.5 h-3.5 text-teal-500" />
            <span className="hidden sm:inline">Lock MPIN</span>
          </button>
        </div>
      </div>

      {/* Modern Student Account Card with Multi-App UPI Integration */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1f3d] via-[#0f2d59] to-[#07152b] p-5 sm:p-6 text-white shadow-xl shadow-cyan-950/20 border border-slate-700/70">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        {/* Top Badges: Bank & Linked UPI Apps */}
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5">
              <Building className="w-3 h-3 text-teal-400" />
              <span>{userProfile.bankAccountNumber || 'SBI Savings ···· 4092'}</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              GPay · PhonePe · Paytm
            </span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="relative z-10 pt-4 space-y-1">
          <span className="text-[11px] text-slate-300 font-medium tracking-wide block">
            Available Pocket Money Balance
          </span>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl font-black tabular-nums font-mono-numbers tracking-tight text-white">
              {showBalance ? `₹${availableBalance.toLocaleString('en-IN')}` : '₹ ••••••••'}
            </span>
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-all duration-150 active:scale-95 cursor-pointer"
              title={showBalance ? 'Hide Balance' : 'Show Balance'}
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Card Footer */}
        <div className="relative z-10 pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
          <div className="flex items-center gap-2.5 font-mono-numbers">
            <span>Budget: ₹{pocketMoney}</span>
            <span>·</span>
            <span className="text-rose-300">Spent: ₹{totalSpent}</span>
          </div>

          <button
            onClick={() => onSelectTab('buddy')}
            className="text-white hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer transition-all duration-150 active:scale-95"
          >
            <span>View Passbook</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PaySafe PayLater 0% Student Credit Line Banner */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 dark:from-teal-500/15 dark:via-cyan-500/10 dark:to-indigo-500/15 border border-teal-500/30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-teal-500/20 shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-[#0B2545] dark:text-white uppercase tracking-wider">
                PaySafe PayLater
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                0% APR · 15-Day Cycle
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Available Credit: <strong className="font-mono-numbers text-teal-600 dark:text-teal-300">₹{(payLaterAccount?.availableLimit ?? 2550).toLocaleString('en-IN')}</strong> / ₹{(payLaterAccount?.totalLimit ?? 3000).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPayLaterHub}
          className="px-3 py-1.5 rounded-xl bg-[#0B2545] dark:bg-teal-500 hover:bg-slate-800 dark:hover:bg-teal-400 text-white dark:text-slate-950 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
        >
          Pay Later Hub
        </button>
      </div>

      {/* Multi-App UPI Quick Pay Strip (GPay, PhonePe, Paytm, BHIM, PayLater) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Pay Directly With Your Installed App
          </h3>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">1-Click Launch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Google Pay Direct Button */}
          <button
            onClick={() => onOpenDirectUpiTransfer({ name: 'Google Pay Transfer', upiId: userProfile.upiId, amount: 150 })}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 flex items-center gap-2.5 cursor-pointer transition-all active:scale-95 group shadow-sm text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">Google Pay</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">GPay UPI</span>
            </div>
          </button>

          {/* PhonePe Direct Button */}
          <button
            onClick={() => onOpenDirectUpiTransfer({ name: 'PhonePe Transfer', upiId: userProfile.upiId, amount: 150 })}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 flex items-center gap-2.5 cursor-pointer transition-all active:scale-95 group shadow-sm text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
              Pe
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">PhonePe</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">PhonePe UPI</span>
            </div>
          </button>

          {/* Paytm Direct Button */}
          <button
            onClick={() => onOpenDirectUpiTransfer({ name: 'Paytm Transfer', upiId: userProfile.upiId, amount: 150 })}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 flex items-center gap-2.5 cursor-pointer transition-all active:scale-95 group shadow-sm text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">Paytm</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Paytm Wallet</span>
            </div>
          </button>

          {/* Pay Later Quick Option */}
          <button
            onClick={onOpenPayLaterHub}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 flex items-center gap-2.5 cursor-pointer transition-all active:scale-95 group shadow-sm text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">Pay Later</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">0% Credit</span>
            </div>
          </button>

          {/* Scan Any QR Button */}
          <button
            onClick={() => onOpenDirectUpiTransfer({ name: 'REVA Central Food Court QR', upiId: 'canteen@reva.edu.in', amount: 80, note: 'QR Payment' })}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 flex items-center gap-2.5 cursor-pointer transition-all active:scale-95 group shadow-sm text-left col-span-2 sm:col-span-1"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">Scan Any QR</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-300">Camera / Photo</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
