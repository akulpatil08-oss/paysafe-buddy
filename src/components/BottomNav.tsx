import React from 'react';
import { Shield, Wallet, Users, UserCheck } from 'lucide-react';

export type TabType = 'shield' | 'buddy' | 'group' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unscratchedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unscratchedCount = 0,
}) => {
  const tabs: { id: TabType; label: string; icon: (isActive: boolean) => React.ReactNode; badge?: number; description: string }[] = [
    {
      id: 'shield',
      label: 'Shield',
      description: 'UPI Scam & QR Detector',
      icon: (isActive) => (
        <Shield
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
          }`}
        />
      ),
    },
    {
      id: 'buddy',
      label: 'Buddy',
      description: 'Pocket Money & Analytics',
      icon: (isActive) => (
        <Wallet
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
          }`}
        />
      ),
    },
    {
      id: 'group',
      label: 'Group Wallet',
      description: 'Hostel & Trip Bill Splitting',
      icon: (isActive) => (
        <Users
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
          }`}
        />
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      description: 'Settings & Founder Hub',
      icon: (isActive) => (
        <UserCheck
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
          }`}
        />
      ),
      badge: unscratchedCount > 0 ? unscratchedCount : undefined,
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#071120]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 px-2 py-1.5 shadow-2xl transition-colors select-none"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              title={tab.description}
              onClick={() => {
                onTabChange(tab.id);
                try {
                  window.scrollTo(0, 0);
                } catch {
                  // safe fallback
                }
              }}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation select-none ${
                isActive
                  ? 'bg-[#0B2545] text-white dark:bg-teal-500 dark:text-slate-950 font-extrabold shadow-md shadow-[#0B2545]/20 dark:shadow-teal-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-medium'
              }`}
            >
              {/* Active top accent bar */}
              {isActive && (
                <span className="absolute -top-1.5 w-8 h-1 bg-teal-400 dark:bg-white rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
              )}

              <div className="relative flex items-center justify-center">
                {tab.icon(isActive)}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-teal-500 text-slate-950 text-[10px] font-black rounded-full leading-tight shadow-sm animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] sm:text-xs mt-1 tracking-tight truncate max-w-[80px] leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
