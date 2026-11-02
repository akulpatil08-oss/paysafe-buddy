import React, { useState } from 'react';
import {
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Percent,
  XCircle,
  HelpCircle,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Sliders,
} from 'lucide-react';

interface PayLaterCheckModalProps {
  monthlyPocketMoney: number;
  onClose: () => void;
}

export const PayLaterCheckModal: React.FC<PayLaterCheckModalProps> = ({
  monthlyPocketMoney,
  onClose,
}) => {
  const [itemTitle, setItemTitle] = useState('Fest Ticket / Noise Headphones');
  const [principal, setPrincipal] = useState(2500);
  const [tenureMonths, setTenureMonths] = useState(3);
  const [processingFee, setProcessingFee] = useState(150);
  const [interestRateAnnual, setInterestRateAnnual] = useState(24); // 24% typical student BNPL
  const [isStressTestActive, setIsStressTestActive] = useState(false);

  // Calculations
  // Total cost = Principal + Processing Fee + Interest
  const monthlyRate = interestRateAnnual / 12 / 100;
  const interestAmount = Math.round(principal * monthlyRate * tenureMonths);
  const totalCost = principal + processingFee + interestAmount;
  const monthlyRepayment = Math.round(totalCost / tenureMonths);

  // Stress test: pocket money reduced by 25% or unexpected exam/mess fees
  const adjustedPocketMoney = isStressTestActive
    ? Math.round(monthlyPocketMoney * 0.75)
    : monthlyPocketMoney;

  const moneyLeftAfterEMI = Math.max(0, adjustedPocketMoney - monthlyRepayment);
  const emiRatio = monthlyRepayment / adjustedPocketMoney;

  // Verdict logic
  let verdict: { level: 'safe' | 'caution' | 'danger'; label: string; explanation: string };
  if (emiRatio <= 0.15) {
    verdict = {
      level: 'safe',
      label: 'Safe to Borrow',
      explanation: `Repayment is only ${Math.round(emiRatio * 100)}% of your allowance. Comfortable to repay without skipping meals.`,
    };
  } else if (emiRatio <= 0.28) {
    verdict = {
      level: 'caution',
      label: 'Tight Budget · Proceed with Caution',
      explanation: `Repayment consumes ${Math.round(emiRatio * 100)}% of pocket money. You may run short before the 24th of the month.`,
    };
  } else {
    verdict = {
      level: 'danger',
      label: 'High Risk of Debt Trap',
      explanation: `Repayment takes ${Math.round(emiRatio * 100)}% of your monthly pocket money! High likelihood of defaulting and suffering penalty charges.`,
    };
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#0b162a] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-teal-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Pay-Later & BNPL Safety Check
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Stress-test loans, EMI apps & BNPL credit lines before you sign
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Inputs Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                Purchase / Loan Description:
              </label>
              <input
                type="text"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                placeholder="e.g. Goa trip flight ticket or semester textbook"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Amount (₹):</label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono-numbers font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Tenure (Months):</label>
                <select
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value={1}>1 Month (Next Pocket Money)</option>
                  <option value={2}>2 Months</option>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Upfront Fee (₹):</label>
                <input
                  type="number"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono-numbers"
                />
              </div>
            </div>
          </div>

          {/* THREE BIG NUMBER TILES (Explicit User Requirement) */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Tile 1: Monthly Repayment */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                Monthly EMI
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums font-mono-numbers">
                ₹{monthlyRepayment.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400 block">for {tenureMonths} mos</span>
            </div>

            {/* Tile 2: Total Cost */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                Total Cost
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums font-mono-numbers">
                ₹{totalCost.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400 block">+₹{totalCost - principal} extra fee</span>
            </div>

            {/* Tile 3: Money Left */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
                Money Left
              </span>
              <div className={`text-xl sm:text-2xl font-black tabular-nums font-mono-numbers ${
                moneyLeftAfterEMI < 1500 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                ₹{moneyLeftAfterEMI.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400 block">per month left</span>
            </div>
          </div>

          {/* VERDICT CHIP (Green, Amber, Red) */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
              verdict.level === 'danger'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-200'
                : verdict.level === 'caution'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            {verdict.level === 'danger' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            ) : verdict.level === 'caution' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider block">
                {verdict.label}
              </span>
              <p className="text-xs leading-relaxed opacity-90">
                {verdict.explanation}
              </p>
            </div>
          </div>

          {/* STRESS TEST TOGGLE WITH SMOOTH ANIMATION (Explicit User Requirement) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-white">
                  Campus Budget Stress Test
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsStressTestActive(!isStressTestActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isStressTestActive ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isStressTestActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Simulates a 25% allowance drop (exam fee deductions, late home pocket money, or emergency medical costs).
            </p>

            {isStressTestActive && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
                Stress Mode: Available monthly budget drops to <strong>₹{adjustedPocketMoney}</strong>. EMI burden increases to <strong>{Math.round((monthlyRepayment / adjustedPocketMoney) * 100)}%</strong>.
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-teal-500 hover:bg-slate-800 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Done with Check
          </button>
        </div>
      </div>
    </div>
  );
};
