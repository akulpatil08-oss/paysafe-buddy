import React, { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  XCircle,
} from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Check Before You Pay',
      tagline: 'Never lose pocket money to fake Instagram sales or shady internship fees.',
      icon: <ShieldCheck className="w-12 h-12 text-teal-400 stroke-[2]" />,
      detail:
        'Paste any UPI ID or shortlink. PaySafe Buddy scans for scam keywords, high-entropy burner handles, and reported student fraud databases in milliseconds.',
      highlight: 'Rule #1: You NEVER enter your UPI PIN to receive money.',
    },
    {
      title: 'Track After',
      tagline: 'Avoid going broke before the 20th with automated pocket money pacing.',
      icon: <Wallet className="w-12 h-12 text-cyan-400 stroke-[2]" />,
      detail:
        'Auto-sort spending into Food, Travel, Recharge, and Shopping with interactive category donut charts and smart burn-rate warnings.',
      highlight: 'Smart Pacing: Alerts you before mid-month Swiggy orders drain your allowance.',
    },
    {
      title: 'Split Together',
      tagline: 'Split hostel Wi-Fi, midnight biryani, and Goa trips without awkward reminders.',
      icon: <Users className="w-12 h-12 text-teal-300 stroke-[2]" />,
      detail:
        'Our debt minimization engine reduces 10 tangled friend balances into the fewest possible UPI transactions with 1-tap settlement.',
      highlight: 'Settle via UPI: Authentic 1-tap peer payments with verified student badges.',
    },
  ];

  const current = slides[slide];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0b162a] border border-teal-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 sm:p-7 space-y-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Brand Lockup */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>PaySafe Buddy for Indian College Students</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
            "Check before you pay. Track after. Split together."
          </h2>
        </div>

        {/* Slide Visual Container */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/10">
            {current.icon}
          </div>
          <h3 className="text-lg font-bold text-white">{current.title}</h3>
          <p className="text-xs text-teal-300 font-semibold">{current.tagline}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{current.detail}</p>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-teal-400 font-semibold">
            {current.highlight}
          </div>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                slide === i ? 'w-8 bg-teal-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-2 pt-1">
          {slide < slides.length - 1 ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Skip Tour
              </button>
              <button
                onClick={() => setSlide(slide + 1)}
                className="flex-1 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-black cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25"
            >
              <span>Get Started with PaySafe Buddy</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
