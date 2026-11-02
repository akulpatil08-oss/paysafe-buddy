import React from 'react';
import { WifiOff, Wifi, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
}) => {
  const isActuallyOffline = !isOnline || isSimulatedOffline;

  if (!isActuallyOffline) {
    return null;
  }

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] px-4 py-2.5 rounded-2xl bg-amber-950/95 border border-amber-500/50 text-amber-200 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-3">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-bold text-amber-300 block">
            Offline Mode Active {isSimulatedOffline && '(Simulated)'}
          </span>
          <span className="text-[11px] text-amber-200/80">
            Shield checks, local ledger, and UPI dynamic QR work 100% offline.
          </span>
        </div>
      </div>

      <button
        onClick={onToggleSimulatedOffline}
        className="px-2.5 py-1 rounded-xl bg-amber-900/60 hover:bg-amber-900 text-amber-200 text-[10px] font-bold border border-amber-700/60 cursor-pointer shrink-0 transition-colors"
      >
        {isSimulatedOffline ? 'Go Online' : 'Dismiss'}
      </button>
    </div>
  );
};
