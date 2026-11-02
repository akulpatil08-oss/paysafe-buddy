import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Flame,
  Rocket,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';
import { PITCH_SLIDES } from '../data/mockData';

interface PitchModeModalProps {
  onClose: () => void;
  onOpenFounderDashboard: () => void;
}

export const PitchModeModal: React.FC<PitchModeModalProps> = ({
  onClose,
  onOpenFounderDashboard,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const slides = PITCH_SLIDES;
  const currentSlide = slides[currentStepIndex];

  const getStepIcon = (name: string) => {
    switch (name) {
      case 'AlertOctagon':
        return <AlertOctagon className="w-12 h-12 text-rose-500 stroke-[2.2]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-12 h-12 text-teal-500 stroke-[2.2]" />;
      case 'Cpu':
        return <Cpu className="w-12 h-12 text-blue-500 stroke-[2.2]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-12 h-12 text-amber-500 stroke-[2.2]" />;
      case 'Flame':
        return <Flame className="w-12 h-12 text-orange-500 stroke-[2.2]" />;
      case 'Rocket':
        return <Rocket className="w-12 h-12 text-purple-500 stroke-[2.2]" />;
      default:
        return <Sparkles className="w-12 h-12 text-teal-500 stroke-[2.2]" />;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < slides.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white dark:bg-[#0a182f] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-teal-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col justify-between min-h-[520px] max-h-[92vh]">
        {/* Top Pitch Deck Bar */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              PaySafe Buddy · Pitch Deck
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300">
              Team PaySafe
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              Step {currentStepIndex + 1} of {slides.length}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-6 gap-1 px-5 pt-3">
          {slides.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-teal-500 dark:bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.6)]'
                  : idx < currentStepIndex
                  ? 'bg-teal-200 dark:bg-teal-800'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Slide Content: Big Icon + Two Lines of Text */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col items-center text-center justify-center space-y-5 animate-in fade-in duration-200 key={currentStepIndex}">
          {/* Big Icon */}
          <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-lg shadow-teal-500/5 transition-transform hover:scale-105">
            {getStepIcon(currentSlide.icon)}
          </div>

          {/* Title & Tagline */}
          <div className="space-y-1.5 max-w-md">
            <span className="text-[11px] uppercase tracking-widest font-black text-teal-600 dark:text-teal-400">
              {currentSlide.title}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentSlide.tagline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {currentSlide.summary}
            </p>
          </div>

          {/* Key Metric Hero Tile */}
          <div className="p-3.5 px-6 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-300 tabular-nums font-mono-numbers block">
              {currentSlide.keyMetric}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {currentSlide.keyMetricLabel}
            </span>
          </div>

          {/* 3 Bullet Proof Points */}
          <div className="w-full max-w-md space-y-1.5 text-left text-xs text-slate-700 dark:text-slate-300">
            {currentSlide.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStepIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onOpenFounderDashboard}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Dashboard View
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
            >
              <span>{currentStepIndex === slides.length - 1 ? 'Finish Pitch' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
