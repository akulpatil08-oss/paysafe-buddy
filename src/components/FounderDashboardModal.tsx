import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  ShieldAlert,
  Award,
  DollarSign,
  Building2,
  BadgeCheck,
  Crown,
  ChevronRight,
  XCircle,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Briefcase,
  Layers,
  BarChart3,
  Percent,
} from 'lucide-react';
import { BUSINESS_SAMPLE_METRICS } from '../data/mockData';

interface FounderDashboardModalProps {
  onClose: () => void;
  onOpenRevenueStreams: () => void;
  onOpenPitchMode: () => void;
}

export const FounderDashboardModal: React.FC<FounderDashboardModalProps> = ({
  onClose,
  onOpenRevenueStreams,
  onOpenPitchMode,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'growth' | 'revenue'>('metrics');
  const metrics = BUSINESS_SAMPLE_METRICS;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#0b162a] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-teal-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Founder View · Business Dashboard
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/30">
                  Team PaySafe
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Metrics & monetisation deck for faculty, incubators, and demo day judges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Demo Notice Tag */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-500/30 px-5 py-2 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <strong>Prototype Demo Mode:</strong> All figures shown are sample data for presentation
          </span>
          <div className="flex gap-2">
            <button
              onClick={onOpenPitchMode}
              className="underline hover:text-amber-900 dark:hover:text-amber-100 cursor-pointer font-bold"
            >
              Launch 6-Slide Pitch →
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Total Users */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center justify-between">
                <span>Total Users</span>
                <Users className="w-3.5 h-3.5 text-teal-500" />
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums font-mono-numbers">
                {metrics.totalUsers.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Sample data for demo</span>
            </div>

            {/* Free vs Premium */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center justify-between">
                <span>Paid Premium</span>
                <Crown className="w-3.5 h-3.5 text-amber-500" />
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums font-mono-numbers">
                {metrics.premiumUsers.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                {metrics.freeUsers.toLocaleString('en-IN')} Free users
              </span>
            </div>

            {/* Conversion Rate */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center justify-between">
                <span>Conversion Rate</span>
                <Percent className="w-3.5 h-3.5 text-emerald-500" />
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono-numbers">
                {metrics.conversionRate}%
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Sample data for demo</span>
            </div>

            {/* Active Campuses */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center justify-between">
                <span>Active Campuses</span>
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
              </span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums font-mono-numbers">
                {metrics.campusesActive} Colleges
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Sample data for demo</span>
            </div>
          </div>

          {/* Secondary Safety & Referral Numbers */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-500/20 text-center">
              <span className="text-xs text-teal-800 dark:text-teal-300 font-semibold block">Scams Blocked</span>
              <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums font-mono-numbers">
                {metrics.scamsBlocked.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-slate-500 block">Sample data for demo</span>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/20 text-center">
              <span className="text-xs text-rose-800 dark:text-rose-300 font-semibold block">Scams Reported</span>
              <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums font-mono-numbers">
                {metrics.scamsReported.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-slate-500 block">Sample data for demo</span>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 text-center">
              <span className="text-xs text-indigo-800 dark:text-indigo-300 font-semibold block">Referrals Made</span>
              <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums font-mono-numbers">
                {metrics.referralsMade.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-slate-500 block">Sample data for demo</span>
            </div>
          </div>

          {/* Section: 6-Month Growth Chart & User Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  6-Month User Growth & Cohort Trajectory
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Organic hockey-stick growth fueled by campus referral loops (Sample data for demo)
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/30">
                +11.8x Growth
              </span>
            </div>

            {/* SVG Visual Growth Line Chart */}
            <div className="relative pt-3 pb-1">
              <div className="h-44 w-full flex items-end justify-between gap-2 px-2">
                {metrics.userGrowthMonths.map((item, index) => {
                  const maxUsers = 16000;
                  const totalHeight = Math.round((item.users / maxUsers) * 100);
                  const premHeight = Math.round((item.premium / item.users) * 100);

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 opacity-90 group-hover:opacity-100 font-mono-numbers">
                        {(item.users / 1000).toFixed(1)}k
                      </span>

                      {/* Bar Container */}
                      <div className="w-full max-w-[42px] bg-slate-200 dark:bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all group-hover:scale-105" style={{ height: `${totalHeight}%` }}>
                        {/* Free Users layer */}
                        <div className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 flex-1 relative" />
                        {/* Premium Users layer */}
                        <div className="w-full bg-gradient-to-t from-amber-500 to-amber-400" style={{ height: `${Math.max(12, premHeight * 2)}%` }} />
                      </div>

                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-xs pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-teal-600 to-cyan-400" />
                  <span className="text-slate-600 dark:text-slate-300">Free Users (12,870)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-amber-500 to-amber-400" />
                  <span className="text-slate-600 dark:text-slate-300">Premium Subscribers (1,380)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Chart */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Monthly Recurring Revenue (MRR)
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sample data for demo · ₹2,42,570 Total MRR
                </span>
              </div>
              <button
                onClick={onOpenRevenueStreams}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Revenue Model</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Split Bar */}
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
                <div style={{ width: '28%' }} className="bg-amber-500" title="Premium (28%)" />
                <div style={{ width: '62%' }} className="bg-teal-500" title="Campus Site Licenses (62%)" />
                <div style={{ width: '10%' }} className="bg-blue-500" title="Merchant Badges (10%)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono-numbers">
                <span>Student Subscriptions (28%)</span>
                <span>Campus Partnerships (62%)</span>
                <span>Merchant Badges (10%)</span>
              </div>
            </div>

            {/* Revenue Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {metrics.revenueStreamsMonthly.map((stream, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {stream.source}
                    </span>
                    <span className="text-xs font-black text-teal-600 dark:text-teal-400 font-mono-numbers">
                      ₹{stream.mrr.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                    {stream.whyTheyPay}
                  </p>
                  <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 pt-0.5">
                    Rate: {stream.pricing}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={onOpenPitchMode}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Open 6-Step Pitch Deck (Faculty & Judges)</span>
            </button>

            <button
              onClick={onOpenRevenueStreams}
              className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-teal-500" />
              <span>Explore Revenue Streams & Pricing Cards</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
