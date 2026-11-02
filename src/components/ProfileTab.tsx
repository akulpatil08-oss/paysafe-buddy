import React, { useState } from 'react';
import {
  UserCheck,
  Award,
  ShieldCheck,
  Gift,
  Users,
  Wallet,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Building,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Lock,
  KeyRound,
  Fingerprint,
  Check,
  Zap,
  Crown,
} from 'lucide-react';
import { PayLaterAccount, UserProfile } from '../types';

interface ProfileTabProps {
  userProfile: UserProfile;
  cashbackBalance: number;
  unscratchedCount: number;
  theme: 'light' | 'dark';
  payLaterAccount?: PayLaterAccount;
  onToggleTheme: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenCashback: () => void;
  onOpenOnboarding: () => void;
  onResetDemoData: () => void;
  onLockApp: () => void;
  onUpdateMpin: (newMpin: string) => void;
  onOpenFounderDashboard: () => void;
  onOpenPitchMode: () => void;
  onOpenRevenueStreams: () => void;
  onOpenGrowthHub: () => void;
  onOpenPayLaterCheck: () => void;
  onOpenPayLaterHub?: () => void;
  onOpenPremium?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userProfile,
  cashbackBalance,
  unscratchedCount,
  theme,
  payLaterAccount,
  onToggleTheme,
  onUpdateProfile,
  onOpenCashback,
  onOpenOnboarding,
  onResetDemoData,
  onLockApp,
  onUpdateMpin,
  onOpenFounderDashboard,
  onOpenPitchMode,
  onOpenRevenueStreams,
  onOpenGrowthHub,
  onOpenPayLaterCheck,
  onOpenPayLaterHub,
  onOpenPremium,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [college, setCollege] = useState(userProfile.college);
  const [year, setYear] = useState(userProfile.year);
  const [pocketMoney, setPocketMoney] = useState(userProfile.pocketMoney.toString());
  const [upiId, setUpiId] = useState(userProfile.upiId || 'akulpatil@oksbi');
  const [isChangingMpin, setIsChangingMpin] = useState(false);
  const [newMpinVal, setNewMpinVal] = useState('');
  const [mpinSuccessMsg, setMpinSuccessMsg] = useState<string | null>(null);
  const [mpinErrorMsg, setMpinErrorMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (upiId.trim()) {
      localStorage.setItem('paysafe_real_user_upi', upiId.trim());
    }
    onUpdateProfile({
      name: name.trim(),
      college: college.trim(),
      year: year.trim(),
      pocketMoney: parseInt(pocketMoney, 10) || 6000,
      upiId: upiId.trim(),
    });
    setIsEditing(false);
  };

  // Determine badge level based on user's safety score
  const getBadgeRank = (score: number) => {
    if (score >= 90) return { title: 'Campus Shield Legend', tier: 'Diamond', color: 'text-cyan-300' };
    if (score >= 75) return { title: 'Campus Shield Captain', tier: 'Gold', color: 'text-teal-300' };
    if (score >= 60) return { title: 'Vigilant Student Scout', tier: 'Silver', color: 'text-amber-300' };
    return { title: 'UPI Safety Novice', tier: 'Bronze', color: 'text-slate-300' };
  };

  const rank = getBadgeRank(userProfile.safetyScore);

  return (
    <div className="space-y-6 pb-20">
      {/* Student Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0a182b] to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-teal-500/25 shrink-0">
              {userProfile.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {userProfile.name}
                </h1>
                <span className="p-1 rounded-full bg-teal-500/20 text-teal-400" title="Verified College Student">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                <span>{userProfile.year} · {userProfile.college}</span>
              </p>
              <p className="text-[11px] text-teal-400 font-mono-numbers">
                UPI: {userProfile.upiId}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold self-start sm:self-auto cursor-pointer border border-slate-700"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-5 pt-4 border-t border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Your Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">College / University:</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Year & Degree:</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Monthly Pocket Money (₹):</label>
                <input
                  type="number"
                  value={pocketMoney}
                  onChange={(e) => setPocketMoney(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono-numbers"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">
                  Your Real Registered UPI ID (for receiving real money & QR codes):
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. 9876543210@paytm or yourname@okhdfcbank"
                  className="w-full px-3 py-2 bg-slate-950 border border-teal-500 rounded-xl text-xs text-teal-300 font-mono-numbers font-semibold"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  When you scan QR codes with real GPay / PhonePe, this registered handle receives the money.
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
            >
              Save Profile Updates
            </button>
          </form>
        )}
      </div>

      {/* Safety Score Section: User Specification */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0B2545] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Campus Safety Score</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Earn points each time you check links before paying and report scam accounts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${rank.color}`}>
              {rank.tier} Tier · {rank.title}
            </span>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">
              Current Safety Rating
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-teal-600 dark:text-teal-300 tabular-nums font-mono-numbers">
                {userProfile.safetyScore}
              </span>
              <span className="text-sm text-slate-400 font-semibold">/ 100</span>
            </div>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              Top 5% safest UPI spenders on campus
            </p>
          </div>

          <div className="w-20 h-20 rounded-full border-4 border-teal-500/20 border-t-teal-500 flex items-center justify-center">
            <ShieldCheck className="w-9 h-9 text-teal-600 dark:text-teal-400" />
          </div>
        </div>

        {/* Safety Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xl">🕵️</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Scam Detective</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Reported fraud IDs</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xl">🛡️</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pre-Check Pro</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Checked 10+ links</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xl">💰</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Zero Debt Hero</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Settled room split</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xl">🤝</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Squad Protector</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Referred 4 friends</p>
          </div>
        </div>
      </div>

      {/* PAYSAFE BUDDY PREMIUM SUBSCRIPTION POP-UP PROMO CARD */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#0f3562] to-[#13A89E] rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0 mt-0.5">
              <Crown className="w-6 h-6 stroke-[2.3] text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                  {userProfile.isPremium ? 'PRO ACTIVE' : 'UPGRADE TO PRO'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  ₹49/mo or ₹399/yr
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                {userProfile.isPremium ? 'PaySafe Buddy Pro Member ✨' : 'PaySafe Buddy Premium'}
              </h3>
              <p className="text-xs text-teal-100/90 mt-1 max-w-md">
                {userProfile.isPremium
                  ? `Active Plan: ${userProfile.premiumPlan || 'Annual Pro'}. Enjoy unlimited 0% PayLater boosts & Recharts analytics.`
                  : 'Unlock Pro Phishing AI, Recharts 7-Day & 30-Day trend analytics, and 0% PayLater credit boost to ₹10,000.'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPremium}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-teal-50 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{userProfile.isPremium ? 'Manage Subscription' : 'Upgrade to Pro'}</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* BUSINESS LAYER & FOUNDER TOOLS (Prompt A Requirements) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-slate-50 to-teal-500/10 dark:from-amber-950/30 dark:via-slate-900 dark:to-teal-950/30 border-2 border-amber-500/40 dark:border-amber-500/50 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#0B2545] dark:text-white">
                  Founder View & Business Deck
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Demo Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Business dashboard, revenue models & 6-slide deck for faculty & judges
              </p>
            </div>
          </div>

          {/* Founder View Toggle (Prompt A Requirement: opened from Profile with a 'Founder view' toggle) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 hidden sm:inline">
              Founder view:
            </span>
            <button
              type="button"
              onClick={onOpenFounderDashboard}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Open Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Executive Quick Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Pitch Mode Walkthrough */}
          <button
            onClick={onOpenPitchMode}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                6-Slide Pitch Deck
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              Problem, Solution, Tech, Business Model, Growth, and Ask walkthrough.
            </p>
          </button>

          {/* Revenue Streams & Plans */}
          <button
            onClick={onOpenRevenueStreams}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-teal-400 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
                Revenue Streams & Pricing
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              Free vs Pro (₹49/mo), .edu discount, B2B college packs, & vendor badges.
            </p>
          </button>

          {/* Campus Radar & Growth Hub */}
          <button
            onClick={onOpenGrowthHub}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                Growth & Campus Radar
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              Campus scam alerts, hostel leaderboards, share card, & ambassador badge.
            </p>
          </button>
        </div>
      </div>

      {/* Rewards & Pay-Later Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Rewards & Refer Tile */}
        <div
          onClick={onOpenCashback}
          className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-teal-400 transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0B2545] dark:text-white">
                  CashBack & Referral Hub
                </h3>
                {unscratchedCount > 0 && (
                  <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {unscratchedCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Wallet: <strong className="text-teal-600 dark:text-teal-300 font-mono-numbers">₹{cashbackBalance}</strong> · ₹50 per friend
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* PaySafe PayLater Credit Line */}
        <div
          onClick={onOpenPayLaterHub}
          className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-teal-400 transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0B2545] dark:text-white">
                  PaySafe PayLater Credit Line
                </h3>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300">
                  0% APR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Available: <strong className="text-teal-600 dark:text-teal-300 font-mono-numbers">₹{payLaterAccount?.availableLimit ?? 2550}</strong> / ₹{payLaterAccount?.totalLimit ?? 3000} · Due {payLaterAccount?.dueDate ?? '20th'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Pay-Later & BNPL Safety Check (Prompt B Requirement) */}
        <div
          onClick={onOpenPayLaterCheck}
          className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-teal-400 transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B2545] dark:text-white">
                Pay-Later & BNPL Stress Check
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                EMI stress-test & debt trap risk scanner
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Multi-App UPI MPIN & Security Controls */}
      <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B2545] dark:text-white">UPI Login MPIN & Biometrics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Works with Google Pay, PhonePe & Paytm</p>
            </div>
          </div>
          <button
            onClick={onLockApp}
            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-teal-300 text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Now</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Login MPIN:</span>
                <span className="text-base font-bold text-[#0B2545] dark:text-white font-mono-numbers">
                  •••• {userProfile.mpin ? userProfile.mpin.slice(-2) : '56'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangingMpin(!isChangingMpin);
                  setNewMpinVal('');
                  setMpinErrorMsg(null);
                }}
                className="text-teal-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
              >
                {isChangingMpin ? 'Cancel' : 'Change MPIN'}
              </button>
            </div>

            {isChangingMpin && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                <input
                  type="password"
                  maxLength={6}
                  value={newMpinVal}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setNewMpinVal(val);
                    setMpinErrorMsg(null);
                  }}
                  placeholder="Enter 6-digit MPIN"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-teal-500 rounded-xl text-center text-slate-900 dark:text-white tracking-widest font-mono text-sm focus:outline-none"
                />
                {mpinErrorMsg && <p className="text-[10px] text-rose-500">{mpinErrorMsg}</p>}
                <button
                  type="button"
                  onClick={() => {
                    if (newMpinVal.length === 6) {
                      onUpdateMpin(newMpinVal);
                      setIsChangingMpin(false);
                      setMpinSuccessMsg('MPIN updated to ' + newMpinVal);
                      setTimeout(() => setMpinSuccessMsg(null), 3000);
                    } else {
                      setMpinErrorMsg('MPIN must be exactly 6 digits');
                    }
                  }}
                  className="w-full py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  Save New MPIN
                </button>
              </div>
            )}

            {mpinSuccessMsg && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{mpinSuccessMsg}</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <div>
                <span className="font-semibold text-[#0B2545] dark:text-white block">Biometric Login</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Fingerprint / Face ID</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* App Controls, Dark Mode & Demo Utilities */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Preferences & Controls
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Dark Mode Toggle in Profile (Explicit User Requirement) */}
          <button
            onClick={onToggleTheme}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
              <div>
                <span className="text-xs font-bold text-[#0B2545] dark:text-white block">
                  {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Theme Appearance</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={onOpenOnboarding}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-[#0B2545] dark:text-white block">Onboarding Tour</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Tagline & safety vision</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={onResetDemoData}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between text-left cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <div>
                <span className="text-xs font-bold text-[#0B2545] dark:text-white block">Reset Demo Data</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Restore mock campus state</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
