import React, { useState } from 'react';
import {
  Gift,
  Share2,
  Copy,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
  XCircle,
  ExternalLink,
  ArrowUpRight,
  Send,
} from 'lucide-react';
import { ReferralFriend, ScratchCard } from '../types';

interface CashbackModalProps {
  cashbackBalance: number;
  scratchCards: ScratchCard[];
  referrals: ReferralFriend[];
  onScratchCard: (cardId: string, amount: number) => void;
  onSimulateReferral: (friendName: string, college: string) => void;
  onClose: () => void;
}

export const CashbackModal: React.FC<CashbackModalProps> = ({
  cashbackBalance,
  scratchCards,
  referrals,
  onScratchCard,
  onSimulateReferral,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'scratch' | 'refer'>('scratch');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);
  const [newFriendName, setNewFriendName] = useState('Rahul Kulkarni');
  const [newFriendCollege, setNewFriendCollege] = useState('IIT Delhi');

  const referralCode = 'PAYSAFE-ARYAN-IITD';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Hey! Check college fest & mess UPI IDs on PaySafe Buddy before paying so you don't get scammed. Use my student code ${referralCode} to get ₹50 bonus on signup: https://paysafe-buddy.app`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleWithdraw = () => {
    if (cashbackBalance <= 0) return;
    setShowWithdrawSuccess(true);
    setTimeout(() => {
      setShowWithdrawSuccess(false);
    }, 4000);
  };

  const unscratchedCount = scratchCards.filter((c) => !c.isScratched).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0b162a] border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Student Cashback & Referral Rewards
              </h2>
              <p className="text-[11px] text-slate-400">Earn rewards for practicing safe UPI payments</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Scratch Cards vs Refer a Friend */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('scratch')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'scratch'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Scratch Cards</span>
            {unscratchedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black">
                {unscratchedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('refer')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'refer'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Refer a College Friend (₹50)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Top Wallet Balance Header */}
          <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-cyan-950/60 border border-teal-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold block">
                Total Cashback Balance
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums font-mono-numbers mt-0.5">
                ₹{cashbackBalance}
              </div>
              <span className="text-[11px] text-slate-400">
                Withdrawable to aryan.sharma04@okaxis
              </span>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={cashbackBalance <= 0}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Transfer to Bank</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {showWithdrawSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                ₹{cashbackBalance} payout successfully initiated to your primary bank account via UPI!
              </span>
            </div>
          )}

          {/* TAB 1: Scratch Cards Content */}
          {activeTab === 'scratch' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Your Earned Scratch Cards</h3>
                  <p className="text-xs text-slate-400">
                    Tap to scratch and claim your UPI safety bonuses
                  </p>
                </div>
                <span className="text-xs text-teal-400 font-semibold">
                  {scratchCards.length} Total Cards
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scratchCards.map((card) => {
                  return (
                    <div
                      key={card.id}
                      className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 p-4 transition-all"
                    >
                      {card.isScratched ? (
                        <div className="space-y-1.5 text-center py-2 animate-in zoom-in-95">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                            Claimed
                          </span>
                          <div className="text-2xl font-black text-white tabular-nums font-mono-numbers">
                            +₹{card.rewardAmount}
                          </div>
                          <p className="text-xs font-semibold text-slate-200">{card.title}</p>
                          <p className="text-[11px] text-slate-400">{card.reason}</p>
                        </div>
                      ) : (
                        <div
                          onClick={() => onScratchCard(card.id, card.rewardAmount)}
                          className="h-28 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600 flex flex-col items-center justify-center p-3 text-center cursor-pointer select-none hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-teal-500/20 group"
                        >
                          <Gift className="w-6 h-6 text-slate-950 mb-1 group-hover:rotate-12 transition-transform" />
                          <span className="text-xs font-extrabold text-slate-950">
                            TAP TO SCRATCH!
                          </span>
                          <span className="text-[10px] text-slate-900/80 font-medium">
                            {card.title}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* How to earn more cards banner */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                <span className="font-bold text-teal-300 block">How to win more scratch cards:</span>
                <ul className="space-y-1 text-slate-400">
                  <li>• Scan any suspicious UPI ID / payment link in Shield (+₹10 to ₹25)</li>
                  <li>• Report a college scam to protect other students (+₹25 to ₹50)</li>
                  <li>• Refer a college friend who completes their first scan (+₹50)</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Refer a Friend Content */}
          {activeTab === 'refer' && (
            <div className="space-y-4">
              {/* Promo Pitch Card */}
              <div className="bg-gradient-to-br from-teal-950/40 via-slate-900 to-teal-950/40 border border-teal-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤝</span>
                  <h3 className="text-sm font-bold text-white">Give ₹50, Get ₹50</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When a college mate joins with your referral code and performs their first safe UPI check on PaySafe Buddy, you both unlock an instant <strong className="text-teal-300">₹50 CashBack</strong> reward!
                </p>

                {/* Referral Code Box */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">YOUR CODE:</span>
                    <span className="text-sm font-black text-teal-300 font-mono tracking-wider">
                      {referralCode}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-teal-400" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Demo Simulation Trigger: For Instant 5-Min Presentation */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Demo Tool: Simulate a College Friend Joining</span>
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    placeholder="Friend's Name"
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newFriendCollege}
                    onChange={(e) => setNewFriendCollege(e.target.value)}
                    placeholder="College"
                    className="w-32 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (newFriendName) {
                        onSimulateReferral(newFriendName, newFriendCollege);
                        setNewFriendName('Aditi Roy');
                      }
                    }}
                    className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Simulate Join (+₹50)
                  </button>
                </div>
              </div>

              {/* Referral List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Referred Friends ({referrals.length})
                </h4>
                <div className="grid gap-2">
                  {referrals.map((friend) => (
                    <div
                      key={friend.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{friend.name}</div>
                        <div className="text-[11px] text-slate-400">{friend.college} · {friend.date}</div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            friend.status === 'Verified 1st UPI'
                              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                              : friend.status === 'Joined'
                              ? 'bg-teal-950/60 border border-teal-500/40 text-teal-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {friend.status}
                        </span>
                        {friend.rewardEarned > 0 && (
                          <div className="text-emerald-400 font-bold font-mono-numbers mt-0.5">
                            +₹{friend.rewardEarned}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
