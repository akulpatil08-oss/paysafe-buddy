import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Clipboard,
  Flag,
  Share2,
  ExternalLink,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  XCircle,
  Sparkles,
  Send,
  Receipt,
  ArrowUpRight,
  User,
} from 'lucide-react';
import { Expense, ReportedScam, RiskCheckResult, ScamAlert } from '../types';
import { analyzeTarget } from '../utils/shieldEngine';
import { SponsoredAdBanner } from './SponsoredAdBanner';
import { BikeSpeedometerRiskMeter } from './BikeSpeedometerRiskMeter';

interface ShieldTabProps {
  reportedScams: ReportedScam[];
  scamAlerts: ScamAlert[];
  expenses: Expense[];
  onReportScam: (target: string, category: string, notes: string) => void;
  onIncrementSafetyScore: (points: number, reason: string) => void;
  onUnlockScratchCard: (title: string, amount: number, reason: string) => void;
  onOpenDirectUpiTransfer: (customPayee?: { name: string; upiId: string; amount?: number; note?: string }) => void;
}

export const ShieldTab: React.FC<ShieldTabProps> = ({
  reportedScams,
  scamAlerts,
  expenses,
  onReportScam,
  onIncrementSafetyScore,
  onUnlockScratchCard,
  onOpenDirectUpiTransfer,
}) => {
  const [activeSubView, setActiveSubView] = useState<'pay_and_shield' | 'scam_feed'>('pay_and_shield');
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState<RiskCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState('Fake Sale Ad');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSuccessBanner, setReportSuccessBanner] = useState<string | null>(null);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Expense | null>(null);

  // Student Contacts for 1-Tap Real UPI Transfer
  const quickContacts = [
    { name: 'Rohan V.', upiId: 'rohan.v99@oksbi', color: 'from-blue-600 to-indigo-600', avatar: 'R' },
    { name: 'REVA Canteen', upiId: 'canteen@reva.edu.in', color: 'from-teal-500 to-emerald-600', avatar: '☕' },
    { name: 'Yelahanka BMTC', upiId: 'bmtc.reva@sbi', color: 'from-cyan-500 to-blue-600', avatar: '🚌' },
    { name: 'Kabir M.', upiId: 'kabir.m24@icici', color: 'from-amber-500 to-orange-600', avatar: 'K' },
    { name: 'Priya Sen', upiId: 'priya.sen@okaxis', color: 'from-pink-500 to-rose-600', avatar: 'P' },
    { name: 'Kaveri Mess', upiId: 'kaverimess@reva', color: 'from-purple-500 to-indigo-600', avatar: '🍛' },
  ];

  // Quick preset test cases for live 5-minute presentations
  const quickTestChips = [
    {
      label: 'Fake Instagram Sneaker Sale',
      target: 'sneakerz.drop99@icici',
      type: 'danger',
    },
    {
      label: 'Fake Internship Fee Desk',
      target: 'internship.fee.desk@ybl',
      type: 'danger',
    },
    {
      label: 'Scholarship Collect Trap Link',
      target: 'bit.ly/aicte-scholarship-claim-2026',
      type: 'danger',
    },
    {
      label: 'Hostel PG Booking Deposit',
      target: 'hostel-room-deposit@barodampay',
      type: 'caution',
    },
    {
      label: 'Verified REVA Canteen (Safe)',
      target: 'canteen@reva.edu.in',
      type: 'safe',
    },
  ];

  const handleRunCheck = (targetToCheck?: string) => {
    const target = (targetToCheck !== undefined ? targetToCheck : inputVal).trim();
    if (!target) return;

    setIsChecking(true);
    setResult(null);

    // 1.5 second realistic heuristic scanning animation (Prompt B requirement)
    setTimeout(() => {
      const evaluation = analyzeTarget(target, reportedScams);
      setResult(evaluation);
      setIsChecking(false);
      onIncrementSafetyScore(3, 'Verified UPI link prior to payment');
    }, 1500);
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputVal(text);
          handleRunCheck(text);
        }
      }
    } catch {
      setInputVal('cashback-claim-gpay@airtel');
      handleRunCheck('cashback-claim-gpay@airtel');
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const targetToReport = (result?.target || inputVal).trim();
    if (!targetToReport) return;

    onReportScam(targetToReport, reportCategory, reportNotes);
    onIncrementSafetyScore(20, `Reported scam handle: ${targetToReport}`);
    onUnlockScratchCard('Community Shield Bounty', 25, `Earned for reporting scam: ${targetToReport}`);

    setShowReportModal(false);
    setReportNotes('');
    setReportSuccessBanner(`Reported "${targetToReport}"! Safety Score +20 and a ₹25 scratch card added to your wallet.`);

    const reEvaluated = analyzeTarget(targetToReport, [
      ...reportedScams,
      {
        id: 'new-report',
        target: targetToReport,
        category: reportCategory,
        reportedAt: new Date().toISOString().split('T')[0],
        notes: reportNotes || 'Reported by user in campus network',
        reportedBy: 'You (Campus Whistleblower)',
        timesFlagged: 1,
      },
    ]);
    setResult(reEvaluated);

    setTimeout(() => {
      setReportSuccessBanner(null);
    }, 5000);
  };

  const copyResultSummary = () => {
    if (!result) return;
    const summary = `🛡️ PaySafe Buddy Risk Alert:\nTarget: ${result.target}\nRisk: ${result.score}/100 (${result.level.toUpperCase()})\nReasons:\n${result.reasons.map((r) => `• ${r}`).join('\n')}\nRecommendation: ${result.recommendation}`;
    navigator.clipboard?.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Real App Sub-View Segmented Switcher */}
      <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl gap-1">
        <button
          onClick={() => setActiveSubView('pay_and_shield')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubView === 'pay_and_shield'
              ? 'bg-[#0B2545] text-white dark:bg-teal-500 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Quick Pay & Shield Guard</span>
        </button>
        <button
          onClick={() => setActiveSubView('scam_feed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubView === 'scam_feed'
              ? 'bg-[#0B2545] text-white dark:bg-teal-500 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Active Scam Advisories ({scamAlerts.length})</span>
        </button>
      </div>

      {reportSuccessBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{reportSuccessBanner}</p>
          </div>
        </div>
      )}

      {/* SUB-VIEW 1: Real Banking Quick Pay & Shield */}
      {activeSubView === 'pay_and_shield' && (
        <div className="space-y-4">
          {/* Quick Payee Student Contacts (1-Tap Transfer) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0B2545] dark:text-white">
                Send Money to Recent Student Contacts
              </h3>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">1-Tap Pay</span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar w-full">
              {quickContacts.map((contact, i) => (
                <button
                  key={i}
                  onClick={() => onOpenDirectUpiTransfer({ name: contact.name, upiId: contact.upiId, amount: 120 })}
                  className="flex flex-col items-center justify-center shrink-0 w-14 sm:w-16 text-center cursor-pointer group active:scale-95 transition-all duration-150"
                >
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${contact.color} text-white font-bold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    {contact.avatar}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1 truncate w-full">
                    {contact.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Integrated PaySafe Shield Verification Card (Balanced & Clean) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#0B2545] dark:text-white">
                    Pre-Payment Safety Check
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                    Verify handle or link before confirming in your UPI app
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30">
                Guard Active
              </span>
            </div>

            {/* Input Row (Responsive & Never Colliding) */}
            <div className="flex gap-2 w-full">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunCheck()}
                  placeholder="UPI ID (canteen@reva) or link..."
                  className="w-full pl-8 sm:pl-9 pr-14 sm:pr-16 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-teal-500 font-mono-numbers"
                />
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 shadow-xs active:scale-95 transition-all duration-150"
                >
                  <Clipboard className="w-2.5 h-2.5 text-teal-600 dark:text-teal-400" />
                  <span>Paste</span>
                </button>
              </div>

              <button
                onClick={() => handleRunCheck()}
                disabled={isChecking || !inputVal.trim()}
                className="px-3.5 sm:px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all duration-150"
              >
                {isChecking ? '...' : 'Check'}
              </button>
            </div>

            {/* Quick Demo Chips (Wrapping Cleanly With No Horizontal Scrollbar) */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-0.5">
              <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0 text-[10px] uppercase">
                Presets:
              </span>
              {quickTestChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputVal(chip.target);
                    handleRunCheck(chip.target);
                  }}
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold cursor-pointer active:scale-95 transition-all duration-150 ${
                    chip.type === 'danger'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                      : chip.type === 'caution'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* 1.5 Second Scanning State (Prompt B Requirement) */}
            {isChecking && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-500/40 text-center space-y-3 animate-in fade-in shadow-md">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
                  <Search className="w-6 h-6 text-teal-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0B2545] dark:text-white block">
                    Scanning Link & UPI Registry...
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Running heuristic entropy checks, NPCI format verification, and college fraud blacklist match
                  </p>
                </div>
                <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {/* Risk Check Result Card: HERO GAUGE & BOLD BANNER (Prompt B Requirement) */}
            {result && !isChecking && (
              <div
                className={`p-5 rounded-3xl border space-y-4 animate-in fade-in shadow-xl transition-all ${
                  result.level === 'danger'
                    ? 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-400 dark:border-rose-600/50'
                    : result.level === 'caution'
                    ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-400 dark:border-amber-600/50'
                    : 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600/50'
                }`}
              >
                {/* BOLD RED BANNER FOR HIGH RISK (Prompt B Requirement) */}
                {result.level === 'danger' && (
                  <div className="p-3.5 rounded-2xl bg-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-rose-600/30 animate-pulse">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <span>DO NOT PAY · Reported as suspicious / fraud target</span>
                  </div>
                )}

                {/* HERO BIKE SPEEDOMETER GAUGE SECTION */}
                <BikeSpeedometerRiskMeter
                  score={result.score}
                  level={result.level}
                  headline={result.headline}
                  target={result.target}
                  recommendation={result.recommendation}
                />

                {/* REASONS SHOWN AS SMALL CARDS WITH ICONS (Prompt B Requirement) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Why PaySafe Shield Flagged This:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.reasons.map((r, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 shadow-sm"
                      >
                        <div className="w-5 h-5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          ✓
                        </div>
                        <span className="leading-snug">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                  {result.level === 'safe' && (
                    <button
                      onClick={() =>
                        onOpenDirectUpiTransfer({
                          name: result.target.includes('@') ? result.target.split('@')[0] : 'Verified Payee',
                          upiId: result.target,
                          amount: 100,
                          note: 'PaySafe Verified Transfer',
                        })
                      }
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all duration-150 shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Proceed to Pay via UPI (GPay / PhonePe / Paytm)</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-all duration-150"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report Scam (+20 Safety Score)</span>
                    </button>

                    <button
                      onClick={copyResultSummary}
                      className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer font-medium active:scale-95 transition-all duration-150"
                    >
                      <Share2 className="w-3.5 h-3.5 text-teal-500" />
                      <span>{copiedNotification ? 'Copied Alert!' : 'Share Alert Summary'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Space for Advertisement: Verified Student Merchant Deals & Campus Sponsor Banners */}
          <SponsoredAdBanner campusName="REVA University" />

          {/* Recent UPI Passbook (Real Bank Experience) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0B2545] dark:text-white flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Recent UPI Account Activity</span>
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Tap for instant receipt</span>
            </div>

            <div className="grid gap-2">
              {expenses.slice(0, 4).map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setSelectedReceipt(exp)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-teal-500/40 dark:hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {exp.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{exp.category}</span>
                        <span>·</span>
                        <span>{exp.date}</span>
                        <span>·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Successful</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums font-mono-numbers">
                      -₹{exp.amount}
                    </span>
                    <span className="block text-[10px] text-slate-400">View Receipt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Dedicated Scam Alerts Feed (Expanded view on request) */}
      {activeSubView === 'scam_feed' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#0B2545] dark:text-white">Campus Scam Advisories</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">High-frequency scams reported by college students this month</p>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Scam</span>
            </button>
          </div>

          <div className="grid gap-3">
            {scamAlerts.map((alert) => {
              const isExpanded = expandedAlertId === alert.id;
              return (
                <div
                  key={alert.id}
                  className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all shadow-sm"
                >
                  <div
                    className="flex items-start justify-between gap-3 cursor-pointer select-none"
                    onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300">
                          {alert.category}
                        </span>
                        <span className="text-xs text-slate-500">· {alert.date}</span>
                        <span className="text-xs text-rose-500 font-medium">
                          · {alert.reportedCount} reported
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {alert.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInputVal(alert.exampleTarget);
                          setActiveSubView('pay_and_shield');
                          handleRunCheck(alert.exampleTarget);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Test ID</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button className="text-slate-400 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 text-xs text-slate-300 animate-in fade-in">
                      <p className="leading-relaxed">{alert.description}</p>
                      <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <span className="font-bold text-rose-400 block text-xs">Red Flags:</span>
                        <ul className="space-y-1 text-slate-300 text-xs">
                          {alert.redFlags.map((flag, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="text-rose-400">✗</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b162a] border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                UPI Payment Completed
              </span>
              <h3 className="text-2xl font-black text-white tabular-nums font-mono-numbers">
                ₹{selectedReceipt.amount}
              </h3>
              <p className="text-xs text-slate-300 font-semibold">{selectedReceipt.title}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="text-white font-medium">{selectedReceipt.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Date:</span>
                <span className="text-white">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Mode:</span>
                <span className="text-teal-300 font-mono-numbers">{selectedReceipt.paymentMethod || 'UPI (NPCI)'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Reference UTR:</span>
                <span className="text-slate-300 font-mono-numbers">628491028391</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* Report Scam Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Flag className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">Report Scam UPI / Link</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target UPI ID or Link:
                </label>
                <input
                  type="text"
                  value={result?.target || inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-teal-300 font-mono-numbers text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Scam Category:
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                >
                  <option value="Fake Sale Ad">Fake Sale Ad (Instagram/Telegram/Olx)</option>
                  <option value="Fake Internship">Fake Internship Registration Fee</option>
                  <option value="Collect Request Trap">Collect Request ("Enter PIN to receive")</option>
                  <option value="Fake PG / Rental">Fake PG / Hostel Room Booking Deposit</option>
                  <option value="Fake KYC / Refund">Fake KYC / Account Freeze Threat</option>
                  <option value="Other Student Scam">Other Student Scam</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  What happened?:
                </label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="e.g. Asked for ₹1,500 advance for fest tickets then blocked on WhatsApp."
                  className="w-full h-20 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/40 text-xs text-teal-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  Submitting gives <strong>+20 Safety Score</strong> and unlocks a <strong>₹25 CashBack Scratch Card</strong>!
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Submit Scam Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
