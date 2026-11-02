import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Bell,
  BellRing,
  X,
  TrendingDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface BudgetAlertToastProps {
  totalSpent: number;
  pocketMoney: number;
  onOpenBuddyTab: () => void;
  onEditBudget: () => void;
  onDismiss?: () => void;
}

export const BudgetAlertToast: React.FC<BudgetAlertToastProps> = ({
  totalSpent,
  pocketMoney,
  onOpenBuddyTab,
  onEditBudget,
  onDismiss,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [notificationState, setNotificationState] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [sentAlertForCurrentThreshold, setSentAlertForCurrentThreshold] = useState(false);

  const spentRatio = pocketMoney > 0 ? totalSpent / pocketMoney : 0;
  const spentPercent = Math.round(spentRatio * 100);
  const remaining = Math.max(0, pocketMoney - totalSpent);
  const isTriggered = spentRatio >= 0.8;

  // Check notification support
  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationState('unsupported');
    } else {
      setNotificationState(Notification.permission);
    }
  }, []);

  // Trigger native browser notification if granted and 80% threshold reached
  useEffect(() => {
    if (isTriggered && notificationState === 'granted' && !sentAlertForCurrentThreshold) {
      try {
        new Notification('PaySafe Buddy · 80% Budget Alert ⚠️', {
          body: `Mindful Alert: You have spent ${spentPercent}% (₹${totalSpent.toLocaleString('en-IN')}) of your ₹${pocketMoney.toLocaleString('en-IN')} allowance. Safe balance left: ₹${remaining.toLocaleString('en-IN')}.`,
          icon: '/favicon.ico',
        });
        setSentAlertForCurrentThreshold(true);
      } catch (e) {
        console.warn('Browser notification error:', e);
      }
    }
  }, [isTriggered, notificationState, sentAlertForCurrentThreshold, spentPercent, totalSpent, pocketMoney, remaining]);

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported on this device/browser.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationState(perm);
      if (perm === 'granted') {
        new Notification('PaySafe Buddy · Budget Alert Activated ✅', {
          body: `Real-time student budget tracking is now active! You will get instant alerts at 80% threshold.`,
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.warn('Failed to request notification permission', e);
    }
  };

  const handleSendTestNotification = () => {
    if (notificationState === 'granted') {
      new Notification('PaySafe Buddy · 80% Budget Threshold Reached! ⚠️', {
        body: `Caution: You've consumed ${spentPercent}% of your ₹${pocketMoney.toLocaleString('en-IN')} pocket money. Only ₹${remaining.toLocaleString('en-IN')} left this month.`,
        icon: '/favicon.ico',
      });
    } else {
      handleRequestPermission();
    }
  };

  if (!isTriggered || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Budget alert notification"
      className="fixed top-18 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 dark:bg-[#0c182c]/95 border-2 border-amber-500/80 text-white shadow-2xl shadow-amber-950/40 backdrop-blur-xl p-4 sm:p-5">
        {/* Top ambient glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                <AlertTriangle className="w-5 h-5 animate-pulse text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    Budget Warning · {spentPercent}% Spent
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                    80% Threshold Exceeded
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  You've spent ₹{totalSpent.toLocaleString('en-IN')} of ₹{pocketMoney.toLocaleString('en-IN')}
                </h4>
              </div>
            </div>

            {/* Dismiss Cross */}
            <button
              type="button"
              onClick={() => {
                setIsDismissed(true);
                if (onDismiss) onDismiss();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Dismiss alert for now"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar visual */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono-numbers">
              <span className="text-slate-300">
                Safe Balance Remaining: <strong className="text-amber-300 font-bold">₹{remaining.toLocaleString('en-IN')}</strong>
              </span>
              <span className="text-amber-400 font-bold">{spentPercent}% spent</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.min(100, spentPercent)}%` }}
              />
              {/* 80% marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                style={{ left: '80%' }}
                title="80% budget limit marker"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Tip: Pacing your spending to <strong className="text-slate-200">₹{Math.max(10, Math.round(remaining / 12)).toLocaleString('en-IN')}/day</strong> will ensure your money lasts through month-end.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-2">
              {/* Browser Notification Button */}
              {notificationState === 'granted' ? (
                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  className="px-2.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  title="Test push notification alert"
                >
                  <BellRing className="w-3.5 h-3.5 text-teal-400" />
                  <span>Test Push</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  title="Turn on desktop & mobile browser alerts"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enable Push Alerts</span>
                </button>
              )}

              <button
                type="button"
                onClick={onEditBudget}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Sliders className="w-3 h-3 text-slate-400" />
                <span>Adjust Budget</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onOpenBuddyTab();
                setIsDismissed(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-teal-500/20"
            >
              <span>View Spend Trends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
