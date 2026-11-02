import React, { useState } from 'react';
import {
  ShieldCheck,
  Gift,
  Award,
  HelpCircle,
  RotateCcw,
  Wifi,
  WifiOff,
  Download,
  Send,
  Lock,
  Crown,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  cashbackBalance: number;
  unscratchedCount: number;
  safetyScore: number;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  theme: 'light' | 'dark';
  isPremium?: boolean;
  onToggleTheme: () => void;
  onToggleOffline: () => void;
  onOpenCashback: () => void;
  onOpenOnboarding: () => void;
  onResetDemoData: () => void;
  onOpenDirectUpiTransfer: () => void;
  onLockApp: () => void;
  onOpenPitchMode?: () => void;
  onOpenGrowthHub?: () => void;
  onOpenPremium?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cashbackBalance,
  unscratchedCount,
  safetyScore,
  isOnline,
  isSimulatedOffline,
  theme,
  isPremium,
  onToggleTheme,
  onToggleOffline,
  onOpenCashback,
  onOpenOnboarding,
  onResetDemoData,
  onOpenDirectUpiTransfer,
  onLockApp,
  onOpenPitchMode,
  onOpenGrowthHub,
  onOpenPremium,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const isOfflineActive = !isOnline || isSimulatedOffline;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#071120]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 px-3 sm:px-6 py-2 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#0B2545] via-[#13A89E] to-cyan-400 p-[2px] shadow-sm shrink-0">
            <div className="w-full h-full bg-[#081528] rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 stroke-[2.4]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-black tracking-tight text-[#0B2545] dark:text-white flex items-center gap-1 leading-none truncate">
              PaySafe <span className="text-teal-600 dark:text-teal-400">Buddy</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide mt-0.5 hidden sm:inline truncate">
              Campus UPI Safety & Money
            </span>
          </div>
        </div>

        {/* Right Action Zone (Responsive & Never Overflowing) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Go Pro Button */}
          {onOpenPremium && (
            <button
              onClick={onOpenPremium}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 border border-amber-300 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-500/20 via-teal-500/15 to-amber-500/20 hover:from-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/40'
              }`}
              title={isPremium ? 'PaySafe Premium Member' : 'Upgrade to PaySafe Premium (₹49/mo)'}
            >
              <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span>{isPremium ? 'PRO' : 'Go Pro'}</span>
            </button>
          )}

          {/* Quick Pitch Mode for Judges (Desktop / Tablet) */}
          {onOpenPitchMode && (
            <button
              onClick={onOpenPitchMode}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Open 6-Step Pitch Deck (Faculty & Judges)"
            >
              <Award className="w-3 h-3 stroke-[2.5]" />
              <span>Pitch Deck</span>
            </button>
          )}

          {/* Cashback & Rewards Pill */}
          <button
            onClick={onOpenCashback}
            className="relative flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-teal-50 dark:bg-slate-900 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 hover:border-teal-400 transition-all text-[11px] sm:text-xs font-bold active:scale-95 cursor-pointer shadow-sm"
            title="Open Cashback & Refer a Friend Hub"
          >
            <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="font-mono-numbers">₹{cashbackBalance}</span>
            {unscratchedCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          {/* Offline Indicator & Toggle */}
          <button
            onClick={onToggleOffline}
            className={`hidden sm:flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95 cursor-pointer ${
              isOfflineActive
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title={isOfflineActive ? 'Device is offline (Click to toggle)' : 'Online (Click to simulate offline mode)'}
          >
            {isOfflineActive ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-500 animate-pulse" />
                <span className="text-[10px]">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-teal-500" />
                <span className="text-[10px]">Online</span>
              </>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-all duration-150 active:scale-95 cursor-pointer text-xs shrink-0"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Tour / Info Button (Desktop / Tablet) */}
          <button
            onClick={onOpenOnboarding}
            className="hidden md:flex w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 transition-all duration-150 active:scale-95 cursor-pointer"
            title="App Tour & Safety Rules"
            aria-label="Tour"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Lock App with MPIN Button (Desktop / Tablet) */}
          <button
            onClick={onLockApp}
            className="hidden md:flex w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-all duration-150 active:scale-95 cursor-pointer"
            title="Lock with 6-digit MPIN"
            aria-label="Lock app"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
