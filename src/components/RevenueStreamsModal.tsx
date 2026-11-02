import React, { useState } from 'react';
import {
  Crown,
  GraduationCap,
  Building2,
  BadgeCheck,
  Check,
  Lock,
  Sparkles,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

interface RevenueStreamsModalProps {
  isPremiumUser: boolean;
  onUpgradePremium: (plan: string) => void;
  onClose: () => void;
}

export const RevenueStreamsModal: React.FC<RevenueStreamsModalProps> = ({
  isPremiumUser,
  onUpgradePremium,
  onClose,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [studentEmail, setStudentEmail] = useState('');
  const [isStudentVerified, setIsStudentVerified] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [selectedPlanSuccess, setSelectedPlanSuccess] = useState<string | null>(null);

  const handleVerifyStudentEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentEmail.includes('@') && (studentEmail.endsWith('.edu') || studentEmail.includes('.ac.') || studentEmail.includes('iit') || studentEmail.includes('du') || studentEmail.includes('bits') || studentEmail.includes('college'))) {
      setIsStudentVerified(true);
      setStudentError(null);
    } else {
      setStudentError('Please enter a valid college or university email (.edu, .ac.in, etc.)');
    }
  };

  const handleSelectUpgrade = (planName: string) => {
    onUpgradePremium(planName);
    setSelectedPlanSuccess(`Upgraded to ${planName}! Premium safety unlocked.`);
    setTimeout(() => {
      setSelectedPlanSuccess(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#0b162a] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-teal-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Revenue Streams & Plans
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                How PaySafe Buddy creates sustainable value across campus ecosystems
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {selectedPlanSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-300 dark:border-emerald-500/40 px-5 py-2.5 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{selectedPlanSuccess}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-white dark:bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                  Save 32%
                </span>
              </button>
            </div>
          </div>

          {/* STREAM 1: Free vs Premium Side-by-Side (User Requirement) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Stream 1: B2C Student Subscriptions
              </h3>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                Who pays & why: Students pay for zero-delay fraud alerts, custom rules, & priority safety
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Free Plan */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                      Standard
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      Forever Free
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono-numbers">
                    ₹0
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Essential on-device safety checks and daily pocket money tracking for every student.
                  </p>

                  <ul className="text-xs space-y-1.5 pt-2 text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-500" />
                      <span>Basic UPI VPA & link scanning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-500" />
                      <span>Pocket money expense ledger</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-teal-500" />
                      <span>Hostel bill split calculator</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Limited to 10 checks per day</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <span className="block text-center text-xs font-semibold py-2 text-slate-500 dark:text-slate-400">
                    Default Current Plan
                  </span>
                </div>
              </div>

              {/* Premium Plan (Most Popular) */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-50 to-teal-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-teal-950/40 border-2 border-amber-500/50 dark:border-amber-500/60 space-y-3 flex flex-col justify-between shadow-lg">
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Most Popular
                </span>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                      PaySafe Pro
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white font-mono-numbers">
                      {isStudentVerified
                        ? billingCycle === 'monthly'
                          ? '₹29'
                          : '₹249'
                        : billingCycle === 'monthly'
                        ? '₹49'
                        : '₹399'}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                    {isStudentVerified && (
                      <span className="ml-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        (40% Student Discount)
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Full proactive safety, unmetered scans, and instant campus dispute assistance.
                  </p>

                  <ul className="text-xs space-y-1.5 pt-2 text-slate-800 dark:text-slate-200">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span><strong>Unlimited</strong> link & QR safety checks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Live campus fraud radar alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pay-Later & BNPL debt trap safety engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>2x CashBack rewards on safe checks</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleSelectUpgrade(billingCycle === 'monthly' ? 'Pro Monthly' : 'Pro Annual')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>{isPremiumUser ? 'Renew Premium Plan' : 'Upgrade to Pro'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STREAM 2: Student Offer Card */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Stream 2: College Student Offer (.edu / College Email)
                  </h4>
                  <p className="text-[11px] text-teal-700 dark:text-teal-300">
                    Who pays & why: College students pay with verified email to get 40% off (only ₹29/mo)
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20">
                40% Off
              </span>
            </div>

            {isStudentVerified ? (
              <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/40 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>College email verified: <strong>{studentEmail}</strong>. 40% discount applied!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStudentVerified(false)}
                  className="text-[11px] underline text-emerald-700 dark:text-emerald-300 cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyStudentEmail} className="flex gap-2">
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="e.g. akul.patil@reva.edu.in"
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  Apply 40% Student Pass
                </button>
              </form>
            )}
            {studentError && <p className="text-[11px] text-rose-500">{studentError}</p>}
          </div>

          {/* STREAM 3: Campus Institutional Partnerships */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Stream 3: Campus Institutional Partnerships (B2B)
                  </h4>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    Who pays & why: Colleges & Student Welfare Councils buy a cyber-safety pack to protect all students & lower FIRs
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono-numbers font-black text-blue-800 dark:text-blue-300">
                ₹25k–₹75k / yr
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Student Body Coverage</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">All enrolled students get Premium automatically</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Cyber Cell Telemetry</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Admin radar for campus phishing & fake job desks</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Freshers Orientation</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Onboarding workshops & anti-scam campus drives</span>
              </div>
            </div>
          </div>

          {/* STREAM 4: Verified-Merchant Trust Badge & In-App Campus Ads */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Stream 4: Verified Merchant Badges & Campus In-App Ad Space
                  </h4>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                    Who pays & why: Campus canteens, stationery stores & youth brands pay for trust badges and verified student banner ads
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono-numbers font-black text-indigo-800 dark:text-indigo-300">
                ₹499 – ₹4,999
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Green QR Counter Badge
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      NPCI verified student vendor mark
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  ₹499/yr
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    📢
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Sponsored Campus Ad Slot
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      In-app student deals & discounts
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
