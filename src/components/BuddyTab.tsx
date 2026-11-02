import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  TrendingDown,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Layers,
  Utensils,
  Train,
  Smartphone,
  ShoppingBag,
  MoreHorizontal,
  RotateCcw,
  Sparkles,
  XCircle,
  IndianRupee,
  Send,
  ArrowRight,
  Zap,
  AlertTriangle,
  Bell,
  BellRing,
} from 'lucide-react';
import { Expense, ExpenseCategory, PayLaterAccount } from '../types';
import { INITIAL_EXPENSES } from '../data/mockData';
import { SpendingTrendChart } from './SpendingTrendChart';
import { SponsoredAdBanner } from './SponsoredAdBanner';

interface BuddyTabProps {
  expenses: Expense[];
  pocketMoney: number;
  payLaterAccount?: PayLaterAccount;
  isPremium?: boolean;
  onUpdatePocketMoney: (val: number) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onLoadSampleTransactions: () => void;
  onOpenDirectUpiTransfer: () => void;
  onOpenPayLaterCheck?: () => void;
  onOpenPayLaterHub?: () => void;
  onOpenPremium?: () => void;
}

const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string; hex: string }> = {
  Food: { bg: 'bg-amber-500/10', text: 'text-amber-400', hex: '#F59E0B' },
  Travel: { bg: 'bg-blue-500/10', text: 'text-blue-400', hex: '#3B82F6' },
  Recharge: { bg: 'bg-teal-500/10', text: 'text-teal-400', hex: '#14B8A6' },
  Shopping: { bg: 'bg-pink-500/10', text: 'text-pink-400', hex: '#EC4899' },
  Others: { bg: 'bg-purple-500/10', text: 'text-purple-400', hex: '#8B5CF6' },
};

export const BuddyTab: React.FC<BuddyTabProps> = ({
  expenses,
  pocketMoney,
  payLaterAccount,
  isPremium,
  onUpdatePocketMoney,
  onAddExpense,
  onDeleteExpense,
  onLoadSampleTransactions,
  onOpenDirectUpiTransfer,
  onOpenPayLaterCheck,
  onOpenPayLaterHub,
  onOpenPremium,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditingPocketMoney, setIsEditingPocketMoney] = useState(false);
  const [tempPocketMoney, setTempPocketMoney] = useState(pocketMoney.toString());

  // Form states for new expense
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('Food');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPaymentMethod, setNewPaymentMethod] = useState('UPI (GPay)');

  // Calculations
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = pocketMoney - totalSpent;

  // Category totals
  const categoryTotals: Record<ExpenseCategory, number> = {
    Food: 0,
    Travel: 0,
    Recharge: 0,
    Shopping: 0,
    Others: 0,
  };

  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Smart pacing calculations: assume day 18 of a 30-day month for demo simulation
  const daysInMonth = 30;
  const currentDay = 18;
  const daysLeft = daysInMonth - currentDay;
  const dailySpendVelocity = currentDay > 0 ? totalSpent / currentDay : 0;
  const projectedTotalSpend = dailySpendVelocity * daysInMonth;

  // Calculate day when money runs out
  let projectedExhaustionDay = 30;
  let isBudgetInDanger = false;
  if (dailySpendVelocity > 0) {
    projectedExhaustionDay = Math.min(30, Math.floor(pocketMoney / dailySpendVelocity));
    if (projectedExhaustionDay <= 28) {
      isBudgetInDanger = true;
    }
  }

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory === 'All') return true;
    return e.category === selectedCategory;
  });

  const handleSavePocketMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(tempPocketMoney, 10);
    if (!isNaN(val) && val > 0) {
      onUpdatePocketMoney(val);
      setIsEditingPocketMoney(false);
    }
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(amountVal) || amountVal <= 0) return;

    onAddExpense({
      title: newTitle.trim(),
      amount: amountVal,
      category: newCategory,
      date: newDate,
      paymentMethod: newPaymentMethod,
    });

    setNewTitle('');
    setNewAmount('');
    setShowAddModal(false);
  };

  // SVG Donut Chart calculation
  const totalForDonut = Math.max(1, totalSpent);
  const categoriesList: ExpenseCategory[] = ['Food', 'Travel', 'Recharge', 'Shopping', 'Others'];
  let cumulativePercent = 0;

  const donutSlices = categoriesList.map((cat) => {
    const value = categoryTotals[cat];
    const percent = value / totalForDonut;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return {
      category: cat,
      value,
      percent: Math.round(percent * 100),
      startPercent,
      color: CATEGORY_COLORS[cat].hex,
    };
  });

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  // Daily Safe to Spend calculation (Prompt B Requirement)
  const dailySafeToSpend = Math.max(0, Math.round(remainingBudget / Math.max(1, daysLeft)));

  return (
    <div className="space-y-6 pb-20">
      {/* Top Pocket Money & Velocity Overview Card */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-teal-50/30 dark:from-slate-900 dark:via-[#0a182b] dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-teal-600 dark:text-teal-400">
                Monthly Pocket Money Budget
              </span>
              <button
                onClick={() => {
                  setTempPocketMoney(pocketMoney.toString());
                  setIsEditingPocketMoney(true);
                }}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 underline underline-offset-2 cursor-pointer font-medium"
              >
                Edit
              </button>
            </div>

            {isEditingPocketMoney ? (
              <form onSubmit={handleSavePocketMoney} className="flex items-center gap-2 mt-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={tempPocketMoney}
                    onChange={(e) => setTempPocketMoney(e.target.value)}
                    className="pl-6 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-teal-500 rounded-xl text-lg font-bold text-slate-900 dark:text-white w-32 focus:outline-none"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingPocketMoney(false)}
                  className="px-2 py-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#0B2545] dark:text-white tabular-nums font-mono-numbers">
                  ₹{pocketMoney.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ month allowance</span>
              </div>
            )}
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 gap-3 sm:w-auto">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Spent So Far</span>
              <span className="text-lg font-bold text-rose-500 dark:text-rose-400 tabular-nums font-mono-numbers">
                ₹{totalSpent.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Remaining</span>
              <span
                className={`text-lg font-bold tabular-nums font-mono-numbers ${
                  remainingBudget > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500 dark:text-rose-400'
                }`}
              >
                ₹{remainingBudget.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* HERO TILE: BIG "SAFE TO SPEND TODAY" NUMBER (Prompt B Requirement) */}
        <div className="mt-5 p-4 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-teal-300/60 dark:border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-black tracking-widest text-teal-700 dark:text-teal-300 block">
                Safe to Spend Today
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#0B2545] dark:text-white tabular-nums font-mono-numbers">
                  ₹{dailySafeToSpend}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  / day (across {daysLeft} days remaining)
                </span>
              </div>
            </div>
          </div>

          {onOpenPayLaterCheck && (
            <button
              onClick={onOpenPayLaterCheck}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-slate-300 dark:border-slate-700"
            >
              <span>Check BNPL / Pay-Later</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
            </button>
          )}
        </div>

        {/* Friendly Warning Card: Required by user specification */}
        <div className="mt-4">
          {isBudgetInDanger ? (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/40 text-amber-900 dark:text-amber-200">
              <AlertOctagon className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-0.5">
                <p className="font-bold text-amber-800 dark:text-amber-300">
                  ⚠️ Friendly Heads Up: At this pace, you'll run out of money by the {projectedExhaustionDay}th!
                </p>
                <p className="text-amber-800/80 dark:text-amber-200/80 text-xs">
                  Your current velocity is <strong className="font-mono-numbers">₹{Math.round(dailySpendVelocity)}/day</strong>. If you cap daily spending at <strong className="font-mono-numbers">₹{dailySafeToSpend}</strong>, your pocket money will comfortably last until month-end!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-600/40 text-teal-900 dark:text-teal-200">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-0.5">
                <p className="font-bold text-teal-800 dark:text-teal-300">
                  ✅ Pacing Well: You're on track to save ₹{Math.max(0, pocketMoney - Math.round(projectedTotalSpend))} this month!
                </p>
                <p className="text-teal-800/80 dark:text-teal-200/80 text-xs">
                  Your daily spend is ₹{Math.round(dailySpendVelocity)}/day with {daysLeft} days remaining. Keep it up!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 80% Monthly Budget Threshold Monitor */}
        <div className="mt-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  totalSpent / pocketMoney >= 0.8
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                    : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                }`}
              >
                {totalSpent / pocketMoney >= 0.8 ? (
                  <AlertTriangle className="w-4 h-4 animate-pulse text-amber-500" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0B2545] dark:text-white">
                    80% Budget Threshold Monitor
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      totalSpent / pocketMoney >= 0.8
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
                        : 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/40'
                    }`}
                  >
                    {Math.round((totalSpent / pocketMoney) * 100)}% Spent
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalSpent / pocketMoney >= 0.8
                    ? `⚠️ Alert Active: Spent ₹${totalSpent.toLocaleString('en-IN')} of ₹${pocketMoney.toLocaleString('en-IN')}. Push & toast active.`
                    : `Safe: ₹${totalSpent.toLocaleString('en-IN')} spent. An on-screen toast & push notification triggers at ₹${Math.round(pocketMoney * 0.8).toLocaleString('en-IN')} (80%).`}
                </p>
              </div>
            </div>

            {/* Quick Demo Controls for Judges */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {totalSpent / pocketMoney < 0.8 ? (
                <button
                  type="button"
                  onClick={() => {
                    const needed = Math.max(0, Math.round(pocketMoney * 0.82) - totalSpent);
                    onAddExpense({
                      title: 'College Mess & Hostel Fee Dues (Demo)',
                      amount: needed,
                      category: 'Others',
                      date: new Date().toISOString().split('T')[0],
                      paymentMethod: 'UPI (GPay)',
                      notes: 'Demo expense to trigger 80% budget alert',
                    });
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold cursor-pointer transition-all active:scale-95"
                  title="Simulate spending >80% to see toast & browser alert"
                >
                  ⚡ Simulate 80% Spent
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onLoadSampleTransactions}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-all active:scale-95"
                  title="Reset to initial expenses below 80%"
                >
                  Reset Spends
                </button>
              )}
            </div>
          </div>

          {/* Progress bar visual with 80% tick */}
          <div className="space-y-1">
            <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalSpent / pocketMoney >= 0.8
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-500'
                }`}
                style={{ width: `${Math.min(100, Math.round((totalSpent / pocketMoney) * 100))}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900/40 dark:bg-white/60 z-10"
                style={{ left: '80%' }}
                title="80% budget limit marker"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono-numbers">
              <span>₹0</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">80% Threshold (₹{Math.round(pocketMoney * 0.8).toLocaleString('en-IN')})</span>
              <span>₹{pocketMoney.toLocaleString('en-IN')} (100%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day vs Previous Week Spending Trend Chart (Recharts) */}
      <SpendingTrendChart
        expenses={expenses}
        isPremium={isPremium}
        onOpenPremium={onOpenPremium}
      />

      {/* Space for Advertisement: Student Money-Saving Merchant Deals & Offers */}
      <SponsoredAdBanner campusName="REVA University" />

      {/* Visual Spending Breakdown: Donut Chart & Category Details */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Category Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400">Where your UPI pocket money is going</p>
          </div>
          <span className="text-xs text-slate-400 font-mono-numbers">
            {expenses.length} Transactions
          </span>
        </div>

        {/* SVG Donut Chart + Legend Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Custom SVG Donut */}
          <div className="relative flex items-center justify-center py-2">
            <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-44 h-44 -rotate-90">
              {donutSlices.map((slice, i) => {
                if (slice.value === 0) return null;
                const [startX, startY] = getCoordinatesForPercent(slice.startPercent);
                const [endX, endY] = getCoordinatesForPercent(slice.startPercent + slice.percent / 100);
                const largeArcFlag = slice.percent / 100 > 0.5 ? 1 : 0;
                const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`;

                return (
                  <path
                    key={i}
                    d={pathData}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="0.32"
                    strokeLinecap="round"
                    className="transition-all hover:stroke-white cursor-pointer"
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total</span>
              <span className="text-lg font-extrabold text-white font-mono-numbers">
                ₹{totalSpent}
              </span>
            </div>
          </div>

          {/* Category Percentage Legend List */}
          <div className="space-y-2">
            {donutSlices.map((slice) => (
              <button
                key={slice.category}
                onClick={() =>
                  setSelectedCategory(selectedCategory === slice.category ? 'All' : slice.category)
                }
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedCategory === slice.category
                    ? 'bg-slate-800 border-teal-500/50'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-xs font-semibold text-slate-200">{slice.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono-numbers">{slice.percent}%</span>
                  <span className="text-xs font-bold text-white font-mono-numbers">
                    ₹{slice.value.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0B2545] dark:text-white">
              UPI Transactions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedCategory === 'All' ? 'All student expenses' : `Filtered by: ${selectedCategory}`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenDirectUpiTransfer}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer"
              title="Transfer real money to any UPI ID"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Send Money via UPI</span>
            </button>

            <button
              onClick={onLoadSampleTransactions}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Reset or load realistic student UPI expenses"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Load Sample UPI</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* PayLater Upcoming Bill Alert (if any dues pending) */}
        {payLaterAccount && payLaterAccount.usedLimit > 0 && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/15 via-teal-500/10 to-indigo-500/15 border border-teal-500/30 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#0B2545] dark:text-white">PayLater Dues:</span>
                  <span className="text-teal-600 dark:text-teal-300 font-bold font-mono-numbers">₹{payLaterAccount.usedLimit}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Due on {payLaterAccount.dueDate} · 0% interest</span>
              </div>
            </div>

            <button
              onClick={onOpenPayLaterHub}
              className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-sm active:scale-95"
            >
              Settle Dues
            </button>
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['All', 'Food', 'Travel', 'Recharge', 'Shopping', 'Others'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expense List */}
        <div className="grid gap-2">
          {filteredExpenses.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-slate-500 dark:text-slate-400 text-sm">No expenses in this category.</p>
              <button
                onClick={onLoadSampleTransactions}
                className="text-xs text-teal-600 dark:text-teal-400 font-semibold underline underline-offset-2"
              >
                Load sample student transactions
              </button>
            </div>
          ) : (
            filteredExpenses.map((expense) => {
              const meta = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Others;
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-teal-500/40 dark:hover:border-slate-700 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.text}`}
                    >
                      {expense.category === 'Food' && <Utensils className="w-5 h-5" />}
                      {expense.category === 'Travel' && <Train className="w-5 h-5" />}
                      {expense.category === 'Recharge' && <Smartphone className="w-5 h-5" />}
                      {expense.category === 'Shopping' && <ShoppingBag className="w-5 h-5" />}
                      {expense.category === 'Others' && <MoreHorizontal className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {expense.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className={meta.text}>{expense.category}</span>
                        <span>·</span>
                        <span>{expense.date}</span>
                        {expense.paymentMethod === 'PayLater' ? (
                          <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                            ⚡ PayLater
                          </span>
                        ) : expense.paymentMethod ? (
                          <>
                            <span>·</span>
                            <span>{expense.paymentMethod}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tabular-nums font-mono-numbers">
                      -₹{expense.amount}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="text-slate-400 hover:text-rose-500 text-xs p-1 transition-colors cursor-pointer"
                      title="Delete expense"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" />
                <span>Add UPI Expense</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Expense Title / Merchant:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Canteen Masala Dosa, Metro card"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Amount (₹):
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-teal-300 font-bold font-mono-numbers text-sm focus:outline-none focus:border-teal-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Category:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  >
                    <option value="Food">Food (Canteen, Zomato, Mess)</option>
                    <option value="Travel">Travel (Metro, Auto, Bus)</option>
                    <option value="Recharge">Recharge (Jio, Airtel, Wi-Fi)</option>
                    <option value="Shopping">Shopping (Books, Fest, Clothes)</option>
                    <option value="Others">Others (Stationary, Xerox, Misc)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Date:</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Method:</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-teal-400"
                  >
                    <option value="UPI (GPay)">UPI (GPay)</option>
                    <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                    <option value="UPI (Paytm)">UPI (Paytm)</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
