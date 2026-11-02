import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  XCircle,
  GraduationCap,
  ArrowRight,
  Check,
  Lock,
  Star,
  Users,
  Award,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

interface PremiumSubscriptionModalProps {
  isPremiumUser: boolean;
  currentPlan?: string;
  onUpgradePremium: (planName: string) => void;
  onClose: () => void;
}

export const PremiumSubscriptionModal: React.FC<PremiumSubscriptionModalProps> = ({
  isPremiumUser,
  currentPlan = 'Annual Pro Plan',
  onUpgradePremium,
  onClose,
}) => {
  const [selectedTier, setSelectedTier] = useState<'monthly' | 'yearly'>('yearly');
  const [studentEmail, setStudentEmail] = useState('');
  const [isStudentVerified, setIsStudentVerified] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'gpay' | 'phonepe' | 'paytm' | 'upi'>('gpay');

  const monthlyPrice = isStudentVerified ? 39 : 49;
  const yearlyPrice = isStudentVerified ? 319 : 399;

  const handleVerifyStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      studentEmail.includes('@') &&
      (studentEmail.endsWith('.edu') ||
        studentEmail.includes('.ac.') ||
        studentEmail.includes('iit') ||
        studentEmail.includes('nit') ||
        studentEmail.includes('bits') ||
        studentEmail.includes('du') ||
        studentEmail.includes('college'))
    ) {
      setIsStudentVerified(true);
      setStudentError(null);
    } else {
      setStudentError('Please enter a valid campus email (.edu, .ac.in, etc.)');
    }
  };

  const handleConfirmUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const planName =
        selectedTier === 'yearly'
          ? `PaySafe Pro Annual (₹${yearlyPrice}/yr)`
          : `PaySafe Pro Monthly (₹${monthlyPrice}/mo)`;
      onUpgradePremium(planName);
      setIsProcessing(false);
      setShowCelebration(true);
      setTimeout(() => {
        onClose();
      }, 2400);
    }, 1200);
  };

  const premiumFeatures = [
    {
      icon: ShieldCheck,
      title: 'Pro AI Phishing Scanner',
      desc: 'Real-time deep scan on all UPI IDs, payment links, and fake college job offers',
    },
    {
      icon: TrendingUp,
      title: 'Recharts 7-Day & 30-Day Trends',
      desc: 'Full consumption habit breakdowns, weekend spikes, and burn-rate exhaustion warnings',
    },
    {
      icon: Zap,
      title: 'PayLater Limit Boost to ₹10,000',
      desc: 'Instant 0% interest emergency credit line for semester fees, books & mess food',
    },
    {
      icon: Users,
      title: 'Unlimited Squad Wallets',
      desc: 'Create unlimited trip & hostel split groups with automated WhatsApp & UPI pay links',
    },
    {
      icon: Award,
      title: 'Campus Ambassador Resume Badge',
      desc: 'Official digital verified certificate recognizing student cybersecurity leadership',
    },
    {
      icon: Star,
      title: 'Zero Ads & Priority Help',
      desc: '100% ad-free experience with direct 24x7 student UPI grievance escalation',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#0a1526] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-teal-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-[#0B2545] via-[#0f3460] to-[#13A89E] p-6 text-white overflow-hidden shrink-0">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-10"
            title="Close"
          >
            <XCircle className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30 shrink-0">
              <Crown className="w-6 h-6 stroke-[2.3] text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-teal-300">
                  Exclusive Student Upgrade
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                  PRO
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                PaySafe Buddy Premium
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-teal-100/90 mt-2 font-medium">
            Lock in top-tier fraud protection, 0% PayLater boosts, and in-depth Recharts money habit tracking.
          </p>
        </div>

        {/* Success Modal Overlay */}
        {showCelebration && (
          <div className="p-8 text-center space-y-4 my-auto animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-[#0B2545] dark:text-white">
              Welcome to PaySafe Premium! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              Your account has been upgraded! 0% PayLater credit line boosted to ₹10,000 and advanced Recharts trend tracking unlocked.
            </p>
          </div>
        )}

        {!showCelebration && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {/* If Already Premium User */}
            {isPremiumUser && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Active Subscription: {currentPlan}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      All Pro features active · Next renewal in 30 days
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950">
                  Active
                </span>
              </div>
            )}

            {/* Pricing Selection Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Monthly Option */}
              <div
                onClick={() => setSelectedTier('monthly')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedTier === 'monthly'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Monthly Plan
                    </span>
                    {selectedTier === 'monthly' && (
                      <div className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-[#0B2545] dark:text-white font-mono-numbers">
                      ₹{monthlyPrice}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ mo</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Cancel anytime. Pocket-money friendly.
                </p>
              </div>

              {/* Annual Option (Most Popular) */}
              <div
                onClick={() => setSelectedTier('yearly')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedTier === 'yearly'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-md ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-[9px] font-black tracking-wider uppercase shadow-sm">
                  Most Popular · Save 32%
                </span>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Annual Pro
                    </span>
                    {selectedTier === 'yearly' && (
                      <div className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-[#0B2545] dark:text-white font-mono-numbers">
                      ₹{yearlyPrice}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ yr</span>
                  </div>
                </div>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-2 font-bold">
                  Just ₹{Math.round(yearlyPrice / 12)}/month! Includes 2 mos free.
                </p>
              </div>
            </div>

            {/* Student College Email Discount Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-teal-500" />
                  <span>College Email? Unlock 20% Student Discount</span>
                </span>
                {isStudentVerified && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified (-20%)</span>
                  </span>
                )}
              </div>

              {!isStudentVerified ? (
                <form onSubmit={handleVerifyStudent} className="flex gap-2">
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Enter college .edu or .ac.in email"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold cursor-pointer transition-all"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Applied campus discount to your rates: ₹{monthlyPrice}/mo or ₹{yearlyPrice}/yr!
                </p>
              )}
              {studentError && (
                <p className="text-[10px] text-rose-500 font-medium">{studentError}</p>
              )}
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                Included in PaySafe Buddy Pro
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {premiumFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {feat.title}
                        </h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
                Pay Securely via any UPI App:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['gpay', 'phonepe', 'paytm', 'upi'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`py-2 px-1 rounded-xl text-center border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      selectedPaymentMethod === method
                        ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {method === 'gpay'
                      ? 'GPay'
                      : method === 'phonepe'
                      ? 'PhonePe'
                      : method === 'paytm'
                      ? 'Paytm'
                      : 'Any UPI'}
                  </button>
                ))}
              </div>
            </div>

            {/* Main CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black text-sm transition-all shadow-lg shadow-teal-500/25 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing UPI Activation...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-slate-950 stroke-slate-950" />
                    <span>
                      {isPremiumUser
                        ? `Switch Plan (₹${selectedTier === 'yearly' ? yearlyPrice : monthlyPrice})`
                        : `Activate Premium for ₹${selectedTier === 'yearly' ? yearlyPrice : monthlyPrice}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 mt-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                  <span>NPCI Encrypted</span>
                </span>
                <span>•</span>
                <span>Instant Auto-Activation</span>
                <span>•</span>
                <span>7-Day Money Back</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
