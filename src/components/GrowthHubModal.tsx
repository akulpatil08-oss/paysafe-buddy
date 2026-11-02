import React, { useState } from 'react';
import {
  Flame,
  Users,
  Award,
  Share2,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  XCircle,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Download,
} from 'lucide-react';
import { CampusLeaderboardItem, CampusRadarAlert, ReferralFriend, UserProfile } from '../types';
import { INITIAL_CAMPUS_RADAR, INITIAL_LEADERBOARD } from '../data/mockData';

interface GrowthHubModalProps {
  userProfile: UserProfile;
  referrals: ReferralFriend[];
  onSimulateReferral: (name: string, college: string) => void;
  onClose: () => void;
}

export const GrowthHubModal: React.FC<GrowthHubModalProps> = ({
  userProfile,
  referrals,
  onSimulateReferral,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'referral' | 'radar' | 'leaderboard' | 'ambassador'>('referral');
  const [copiedShareCard, setCopiedShareCard] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('REVA University');
  const [radarList, setRadarList] = useState<CampusRadarAlert[]>(INITIAL_CAMPUS_RADAR);
  const [leaderboardList] = useState<CampusLeaderboardItem[]>(INITIAL_LEADERBOARD);

  // Ambassador Sign-Up State
  const [ambassadorName, setAmbassadorName] = useState(userProfile.name);
  const [ambassadorCollege, setAmbassadorCollege] = useState(userProfile.college);
  const [ambassadorYear, setAmbassadorYear] = useState(userProfile.year);
  const [ambassadorReach, setAmbassadorReach] = useState('Hostel WhatsApp Group & Student Club (300+ students)');
  const [isAmbassadorEnrolled, setIsAmbassadorEnrolled] = useState(userProfile.isAmbassador || false);

  const referralCode = `PAYSAFE-${userProfile.name.split(' ')[0].toUpperCase()}-REVA`;
  const shareMessage = `🛡️ I use PaySafe Buddy to protect my UPI micropayments and split hostel bills without scams! Use my invite code *${referralCode}* to get 1 FREE WEEK of PaySafe Pro: https://paysafebuddy.app/join?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyShareCard = () => {
    navigator.clipboard?.writeText(
      `🛡️ I BLOCKED A SCAM TODAY WITH PAYSAFE BUDDY!\nStudent: ${userProfile.name}\nCampus: ${userProfile.college}\nThreat: Fake Sneaker Sale & Collect Request\nRisk Prevented: ₹1,500\nCheck before you pay with PaySafe Buddy: https://paysafebuddy.app`
    );
    setCopiedShareCard(true);
    setTimeout(() => setCopiedShareCard(false), 2000);
  };

  const handleUpvoteRadar = (id: string) => {
    setRadarList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
    );
  };

  const handleEnrollAmbassador = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAmbassadorEnrolled(true);
  };

  // 1 free week for every referral
  const freeWeeksEarned = referrals.filter((r) => r.status === 'Verified 1st UPI').length;
  const referralTarget = 5;
  const progressPercent = Math.min(100, Math.round((referrals.length / referralTarget) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#0b162a] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-teal-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Campus Growth & Community Shield
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Refer friends, track campus radar, climb hostel ranks & become an ambassador
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer p-1">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-1 gap-1">
          <button
            onClick={() => setActiveTab('referral')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'referral'
                ? 'bg-white dark:bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Referrals</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-white dark:bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Campus Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-white dark:bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Hostel Ranks</span>
          </button>

          <button
            onClick={() => setActiveTab('ambassador')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ambassador'
                ? 'bg-white dark:bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Ambassador</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* TAB 1: REFERRAL & VIRAL SHARE CARD */}
          {activeTab === 'referral' && (
            <div className="space-y-4">
              {/* Progress to Free Premium Month */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-amber-500/10 dark:from-teal-950/30 dark:via-slate-900 dark:to-amber-950/30 border border-teal-200 dark:border-teal-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Referral Free Premium Weeks
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300">
                    {freeWeeksEarned} Weeks Unlocked
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Invite your hostel mates. Both you and your friend get <strong>1 free week of PaySafe Pro</strong> for every signup!
                </p>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 font-mono-numbers">
                    <span>{referrals.length} of {referralTarget} Invited</span>
                    <span>{progressPercent}% to 1-Month Bonus</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-amber-400 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Code Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Your Unique Campus Invite Code
                </span>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700">
                  <span className="text-base font-black text-teal-600 dark:text-teal-400 font-mono tracking-wider">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => onSimulateReferral('Harsh Vardhan', 'REVA University')}
                    className="py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    + Simulate Friend Signup
                  </button>
                </div>
              </div>

              {/* ONE-TAP SHARE CARD: User Requirement */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-[#0B2545] to-slate-900 text-white border border-teal-500/40 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-widest text-teal-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    One-Tap Viral Share Card
                  </span>
                  <span className="text-[10px] text-slate-300">Instagram / WhatsApp Ready</span>
                </div>

                {/* The Visual Graphic Preview */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">PAYSAFE BUDDY · CAMPUS SHIELD</span>
                    <span className="text-xs text-teal-300 font-bold">100% Safe</span>
                  </div>
                  <h3 className="text-lg font-black text-teal-300 leading-tight">
                    "I blocked an online UPI scam today with PaySafe Buddy!"
                  </h3>
                  <div className="flex justify-between text-xs text-slate-300 pt-1 border-t border-white/10 font-mono-numbers">
                    <span>Protected: ₹1,500</span>
                    <span>Student: {userProfile.name}</span>
                    <span>{userProfile.college.split(' ')[0]}</span>
                  </div>
                </div>

                <button
                  onClick={handleCopyShareCard}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-teal-500/25 active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShareCard ? 'Card Text Copied to Clipboard!' : 'Share Status Card to WhatsApp'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CAMPUS SCAM RADAR: User Requirement */}
          {activeTab === 'radar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                    Campus Scam Radar Feed
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live crowd-sourced alerts reported by students at your university
                  </p>
                </div>

                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="REVA University">REVA University (Bengaluru)</option>
                  <option value="BMSCE">BMS College of Engineering</option>
                  <option value="PES University">PES University</option>
                  <option value="MSRIT">Ramaiah Institute of Tech</option>
                </select>
              </div>

              {/* Weekly Campus Counter (Explicit Requirement) */}
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-rose-900 dark:text-rose-200 block">
                      Scams reported at {selectedCampus} this week
                    </span>
                    <span className="text-[10px] text-rose-700 dark:text-rose-300">
                      Verified by Student Cyber Welfare Cell
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono-numbers">
                  14
                </div>
              </div>

              {/* Radar Feed List */}
              <div className="grid gap-2.5">
                {radarList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                            {item.category}
                          </span>
                          {item.verifiedByCyberCell && (
                            <span className="px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              ✓ Cyber Cell Verified
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono-numbers">
                            {item.timestamp}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pt-0.5">
                          {item.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleUpvoteRadar(item.id)}
                        className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3 text-teal-500" />
                        <span className="font-mono-numbers">{item.upvotes}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono-numbers bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded-xl border border-rose-200/50 dark:border-rose-900/40">
                      Flagged Target: <strong>{item.target}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SAFETY STREAK & HOSTEL LEADERBOARD: User Requirement */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              {/* Personal Streak Badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-slate-50 to-amber-500/10 dark:from-orange-950/30 dark:via-slate-900 dark:to-amber-950/30 border border-orange-200 dark:border-orange-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-2xl shadow-sm">
                    🔥
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        12-Day Safe Check Streak!
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        Top 5%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      You've verified all UPI links before paying for 12 days straight.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-bold">Multiplier</span>
                  <span className="text-xl font-black text-orange-500 font-mono-numbers">2.5x</span>
                </div>
              </div>

              {/* Hostel Leaderboard Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                    IIT Delhi Hostel Safety Leaderboard
                  </h4>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                    Updated Daily at Midnight
                  </span>
                </div>

                <div className="grid gap-2">
                  {leaderboardList.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        entry.rank === 1
                          ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40'
                          : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                            entry.rank === 1
                              ? 'bg-amber-400 text-slate-950'
                              : entry.rank === 2
                              ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white'
                              : entry.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          #{entry.rank}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {entry.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              ({entry.category})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {entry.verifiedChecks} Checks · {entry.scamsReported} Scams Flagged
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-teal-600 dark:text-teal-400 font-mono-numbers block">
                          {entry.safetyRating}%
                        </span>
                        <span className="text-[10px] text-slate-500">{entry.badge}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAMPUS AMBASSADOR PAGE: User Requirement */}
          {activeTab === 'ambassador' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-blue-500/10 dark:from-teal-950/30 dark:via-slate-900 dark:to-blue-950/30 border border-teal-200 dark:border-teal-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    PaySafe Campus Ambassador Program
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Lead cyber-safety at your university. Conduct mess onboarding drives, get free PaySafe Pro for life, and earn a verified LinkedIn certificate signed by the founders.
                </p>
              </div>

              {isAmbassadorEnrolled ? (
                /* Verified Certificate Badge */
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1f3d] to-[#061129] text-white border-2 border-teal-500/40 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-400 to-cyan-300 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30">
                    <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-teal-400">
                      Official Certificate Badge
                    </span>
                    <h3 className="text-lg font-black text-white">
                      Certified Campus Safety Ambassador
                    </h3>
                    <p className="text-xs text-slate-300">
                      Awarded to <strong>{ambassadorName}</strong> ({ambassadorCollege}) for leadership in preventing student UPI fraud.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-xs text-slate-200 space-y-1 text-left font-mono-numbers">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Credential ID:</span>
                      <span>PSB-AMB-2026-IITD-882</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Authorized by:</span>
                      <span>Team PaySafe Core</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Perks:</span>
                      <span className="text-teal-300 font-bold">Lifetime Pro + Swag Box</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `🎓 PaySafe Buddy Campus Ambassador Certificate: Verified for ${ambassadorName} (${ambassadorCollege}). Credential: PSB-AMB-2026-IITD-882`
                      );
                      alert('Certificate details copied to clipboard for your LinkedIn profile!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-teal-500/20"
                  >
                    Copy Credential for LinkedIn / Resume
                  </button>
                </div>
              ) : (
                /* Ambassador Sign-Up Form */
                <form onSubmit={handleEnrollAmbassador} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Sign Up for Ambassador Batch 2026
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Full Name:</label>
                      <input
                        type="text"
                        value={ambassadorName}
                        onChange={(e) => setAmbassadorName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">College:</label>
                      <input
                        type="text"
                        value={ambassadorCollege}
                        onChange={(e) => setAmbassadorCollege(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Expected Community Reach:</label>
                    <input
                      type="text"
                      value={ambassadorReach}
                      onChange={(e) => setAmbassadorReach(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-teal-500/20 active:scale-95 cursor-pointer"
                  >
                    Submit Application & Issue Ambassador Badge
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
