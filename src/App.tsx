/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { ShieldTab } from './components/ShieldTab';
import { BuddyTab } from './components/BuddyTab';
import { GroupWalletTab } from './components/GroupWalletTab';
import { ProfileTab } from './components/ProfileTab';
import { CashbackModal } from './components/CashbackModal';
import { ActualUPIPaymentModal } from './components/ActualUPIPaymentModal';
import { OnboardingModal } from './components/OnboardingModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MPINLoginScreen } from './components/MPINLoginScreen';
import { QuickPayHub } from './components/QuickPayHub';
import { FounderDashboardModal } from './components/FounderDashboardModal';
import { RevenueStreamsModal } from './components/RevenueStreamsModal';
import { PitchModeModal } from './components/PitchModeModal';
import { GrowthHubModal } from './components/GrowthHubModal';
import { PayLaterCheckModal } from './components/PayLaterCheckModal';
import { PayLaterHubModal } from './components/PayLaterHubModal';
import { PremiumSubscriptionModal } from './components/PremiumSubscriptionModal';
import { BudgetAlertToast } from './components/BudgetAlertToast';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
  INITIAL_EXPENSES,
  INITIAL_GROUP_WALLETS,
  INITIAL_PAY_LATER_ACCOUNT,
  INITIAL_REFERRALS,
  INITIAL_REPORTED_SCAMS,
  INITIAL_SCRATCH_CARDS,
  INITIAL_USER_PROFILE,
  SCAM_ALERTS,
} from './data/mockData';
import {
  Expense,
  GroupExpense,
  GroupWallet,
  PayLaterAccount,
  ReferralFriend,
  ReportedScam,
  ScratchCard,
  SettlementTransfer,
  UserProfile,
} from './types';

export default function App() {
  // MPIN Authentication State (default to true for instant live demo access)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('paysafe_is_authenticated') !== 'false';
    } catch {
      return true;
    }
  });

  // Theme State: 'light' default with 'dark' support (Prompt B requirement)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('paysafe_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('paysafe_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn('Theme storage error:', e);
    }
  }, [theme]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('shield');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {
      // fallback
    }
  };

  // Network & Offline Status
  const isOnline = useOnlineStatus();
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // Modal States
  const [showCashbackModal, setShowCashbackModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showFounderDashboard, setShowFounderDashboard] = useState(false);
  const [showRevenueStreams, setShowRevenueStreams] = useState(false);
  const [showPitchMode, setShowPitchMode] = useState(false);
  const [showGrowthHub, setShowGrowthHub] = useState(false);
  const [showPayLaterCheck, setShowPayLaterCheck] = useState(false);
  const [showPayLaterHub, setShowPayLaterHub] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // PayLater Student Credit Line State
  const [payLaterAccount, setPayLaterAccount] = useState<PayLaterAccount>(() => {
    try {
      const saved = localStorage.getItem('paysafe_paylater_account');
      return saved ? JSON.parse(saved) : INITIAL_PAY_LATER_ACCOUNT;
    } catch {
      return INITIAL_PAY_LATER_ACCOUNT;
    }
  });

  const handleUpdatePayLaterAccount = (updated: PayLaterAccount) => {
    setPayLaterAccount(updated);
    try {
      localStorage.setItem('paysafe_paylater_account', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save pay later account', e);
    }
  };

  // Actual UPI Payment Modal State (for real deep-link & dynamic QR transfers)
  const [actualUpiTransfer, setActualUpiTransfer] = useState<{
    payeeName: string;
    upiId: string;
    amount: number;
    note: string;
    transferKey?: string;
    groupId?: string;
  } | null>(null);

  // Persistent States with localStorage fallbacks
  const [reportedScams, setReportedScams] = useState<ReportedScam[]>(() => {
    try {
      const saved = localStorage.getItem('paysafe_reported_scams');
      return saved ? JSON.parse(saved) : INITIAL_REPORTED_SCAMS;
    } catch {
      return INITIAL_REPORTED_SCAMS;
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem('paysafe_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [groups, setGroups] = useState<GroupWallet[]>(() => {
    try {
      const saved = localStorage.getItem('paysafe_groups');
      return saved ? JSON.parse(saved) : INITIAL_GROUP_WALLETS;
    } catch {
      return INITIAL_GROUP_WALLETS;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('paysafe_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Aryan Sharma' || !parsed.name || parsed.college?.includes('IIT')) {
          const updated = {
            ...INITIAL_USER_PROFILE,
            ...parsed,
            name: 'Akul Patil',
            college: 'REVA University (Bengaluru)',
            upiId: 'akulpatil@oksbi',
            safetyTitle: 'REVA Campus Shield Lead',
          };
          localStorage.setItem('paysafe_user_profile', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
      return INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [cashbackBalance, setCashbackBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('paysafe_cashback_balance');
      return saved ? Number(saved) : 135;
    } catch {
      return 135;
    }
  });

  const [scratchCards, setScratchCards] = useState<ScratchCard[]>(() => {
    try {
      const saved = localStorage.getItem('paysafe_scratch_cards');
      return saved ? JSON.parse(saved) : INITIAL_SCRATCH_CARDS;
    } catch {
      return INITIAL_SCRATCH_CARDS;
    }
  });

  const [referrals, setReferrals] = useState<ReferralFriend[]>(() => {
    try {
      const saved = localStorage.getItem('paysafe_referrals');
      return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
    } catch {
      return INITIAL_REFERRALS;
    }
  });

  const [settledTransferKeys, setSettledTransferKeys] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('paysafe_settled_keys');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('paysafe_is_authenticated', String(isLoggedIn));
      localStorage.setItem('paysafe_reported_scams', JSON.stringify(reportedScams));
      localStorage.setItem('paysafe_expenses', JSON.stringify(expenses));
      localStorage.setItem('paysafe_groups', JSON.stringify(groups));
      localStorage.setItem('paysafe_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('paysafe_cashback_balance', String(cashbackBalance));
      localStorage.setItem('paysafe_scratch_cards', JSON.stringify(scratchCards));
      localStorage.setItem('paysafe_referrals', JSON.stringify(referrals));
      localStorage.setItem('paysafe_settled_keys', JSON.stringify(settledTransferKeys));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }, [
    isLoggedIn,
    reportedScams,
    expenses,
    groups,
    userProfile,
    cashbackBalance,
    scratchCards,
    referrals,
    settledTransferKeys,
  ]);

  // Login & Lock Handlers
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem('paysafe_is_authenticated', 'true');
    } catch {
      // safe fallback
    }
    setUserProfile((prev) => ({
      ...prev,
      lastLoginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  };

  const handleLockApp = () => {
    try {
      localStorage.setItem('paysafe_is_authenticated', 'false');
    } catch {
      // safe fallback
    }
    setIsLoggedIn(false);
  };

  const handleResetMpin = (newMpin: string) => {
    setUserProfile((prev) => ({ ...prev, mpin: newMpin }));
  };

  // Handlers
  const handleReportScam = (target: string, category: string, notes: string) => {
    const newReport: ReportedScam = {
      id: `scam-${Date.now()}`,
      target: target.trim(),
      category,
      reportedAt: new Date().toISOString().split('T')[0],
      notes: notes || 'Reported by college student network',
      reportedBy: `${userProfile.name} (${userProfile.college.split(' ')[0]})`,
      timesFlagged: 1,
    };

    setReportedScams((prev) => [newReport, ...prev]);
  };

  const handleIncrementSafetyScore = (points: number, reason: string) => {
    setUserProfile((prev) => {
      const nextScore = Math.min(100, prev.safetyScore + points);
      return {
        ...prev,
        safetyScore: nextScore,
      };
    });
  };

  const handleUnlockScratchCard = (title: string, amount: number, reason: string) => {
    const newCard: ScratchCard = {
      id: `sc-${Date.now()}`,
      title,
      rewardAmount: amount,
      reason,
      isScratched: false,
      date: 'Just now',
    };
    setScratchCards((prev) => [newCard, ...prev]);
  };

  const handleScratchCard = (cardId: string, amount: number) => {
    setScratchCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isScratched: true } : c))
    );
    setCashbackBalance((prev) => prev + amount);
  };

  const handleSimulateReferral = (friendName: string, college: string) => {
    const newFriend: ReferralFriend = {
      id: `ref-${Date.now()}`,
      name: friendName,
      college,
      status: 'Verified 1st UPI',
      rewardEarned: 50,
      date: 'Just now',
    };

    setReferrals((prev) => [newFriend, ...prev]);
    handleUnlockScratchCard(
      `Referral Bonus: ${friendName}`,
      50,
      `${friendName} from ${college} checked their first UPI handle!`
    );
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleLoadSampleTransactions = () => {
    setExpenses(INITIAL_EXPENSES);
  };

  const handleUpdatePocketMoney = (val: number) => {
    setUserProfile((prev) => ({ ...prev, pocketMoney: val }));
  };

  const handleCreateGroup = (name: string, emoji: string, memberNames: string[]) => {
    const colors = ['#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#10B981'];
    const newMembers = [
      {
        id: 'm1',
        name: `${userProfile.name} (You)`,
        upiId: userProfile.upiId,
        avatarColor: '#0D9488',
        isCurrentUser: true,
      },
      ...memberNames.map((name, i) => ({
        id: `m-new-${Date.now()}-${i}`,
        name,
        upiId: `${name.toLowerCase().replace(/\s+/g, '')}@oksbi`,
        avatarColor: colors[i % colors.length],
      })),
    ];

    const newGroup: GroupWallet = {
      id: `group-${Date.now()}`,
      name,
      emoji: emoji || '👥',
      description: 'College shared bills and splitting',
      members: newMembers,
      expenses: [],
    };

    setGroups((prev) => [...prev, newGroup]);
  };

  const handleAddGroupExpense = (groupId: string, expense: Omit<GroupExpense, 'id'>) => {
    const newExp: GroupExpense = {
      ...expense,
      id: `ge-${Date.now()}`,
    };

    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, expenses: [newExp, ...g.expenses] } : g))
    );
  };

  // Triggered when user clicks "Settle via UPI" in Group Wallet
  const handleInitiateActualUpiPayment = (transfer: SettlementTransfer, groupId: string) => {
    const transferKey = `${transfer.fromMemberId}-${transfer.toMemberId}-${transfer.amount}`;
    setActualUpiTransfer({
      payeeName: transfer.toName,
      upiId: transfer.toUpiId,
      amount: transfer.amount,
      note: `Split Settlement for ${transfer.toName}`,
      transferKey,
      groupId,
    });
  };

  // Direct UPI Transfer trigger (Multi-App UPI)
  const handleOpenDirectUpiTransfer = (customPayee?: { name: string; upiId: string; amount?: number; note?: string }) => {
    const savedRealUpi = typeof window !== 'undefined' ? localStorage.getItem('paysafe_real_user_upi') : null;
    setActualUpiTransfer({
      payeeName: customPayee?.name || 'Rohan Verma',
      upiId: customPayee?.upiId || savedRealUpi || 'rohan.v99@oksbi',
      amount: customPayee?.amount || 150,
      note: customPayee?.note || 'PaySafe Campus Transfer',
    });
  };

  // Callback when actual UPI / PayLater transfer is confirmed
  const handleActualUpiTransferSuccess = (details: {
    payeeName: string;
    upiId: string;
    amount: number;
    txnId: string;
    note: string;
    paymentMethod?: 'UPI' | 'PayLater';
  }) => {
    // If it was a group settlement, mark as settled
    if (actualUpiTransfer?.transferKey) {
      setSettledTransferKeys((prev) => [...prev, actualUpiTransfer.transferKey!]);
    }

    const isPayLater = details.paymentMethod === 'PayLater';

    if (isPayLater) {
      // Deduct from Pay Later account
      const newTxn = {
        id: `plt-${Date.now()}`,
        payeeName: details.payeeName,
        upiId: details.upiId,
        amount: details.amount,
        date: 'Today',
        status: 'pending' as const,
        billingCycle: 'Current Cycle',
      };
      const updated = {
        ...payLaterAccount,
        usedLimit: payLaterAccount.usedLimit + details.amount,
        availableLimit: Math.max(0, payLaterAccount.availableLimit - details.amount),
        transactions: [newTxn, ...payLaterAccount.transactions],
      };
      handleUpdatePayLaterAccount(updated);
    }

    // Auto-record in Buddy expenses
    handleAddExpense({
      title: `${isPayLater ? '⚡ PayLater' : 'UPI Payment'} to ${details.payeeName}`,
      amount: details.amount,
      category: 'Others',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: isPayLater ? 'PayLater' : 'UPI (Actual Transfer)',
      notes: `${details.note} [Ref: ${details.txnId}]`,
    });

    handleIncrementSafetyScore(10, `Completed verified ${isPayLater ? 'PayLater' : 'UPI'} payment of ₹${details.amount}`);
    handleUnlockScratchCard(
      `${isPayLater ? 'PayLater 0% Reward' : 'UPI Transfer CashBack'}`,
      isPayLater ? 25 : 15,
      `Safe ${isPayLater ? 'PayLater' : 'UPI'} payment of ₹${details.amount} to ${details.payeeName}`
    );
  };

  const handleResetDemoData = () => {
    localStorage.clear();
    setReportedScams(INITIAL_REPORTED_SCAMS);
    setExpenses(INITIAL_EXPENSES);
    setGroups(INITIAL_GROUP_WALLETS);
    setUserProfile(INITIAL_USER_PROFILE);
    setCashbackBalance(135);
    setScratchCards(INITIAL_SCRATCH_CARDS);
    setReferrals(INITIAL_REFERRALS);
    setSettledTransferKeys([]);
    setPayLaterAccount(INITIAL_PAY_LATER_ACCOUNT);
  };

  const unscratchedCount = scratchCards.filter((c) => !c.isScratched).length;
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  // If user is locked out, render the MPIN Login Screen (Multi-App UPI Style)
  if (!isLoggedIn) {
    return (
      <MPINLoginScreen
        userProfile={userProfile}
        onLoginSuccess={handleLoginSuccess}
        onResetMpin={handleResetMpin}
      />
    );
  }

  const handleUpgradePremium = (planName: string) => {
    setUserProfile((prev) => ({
      ...prev,
      isPremium: true,
      premiumPlan: planName,
      premiumExpiresAt: 'In 365 Days',
    }));
    setPayLaterAccount((prev) => ({
      ...prev,
      totalLimit: Math.max(prev.totalLimit, 10000),
      availableLimit: Math.max(prev.availableLimit, 9550),
    }));
    handleUnlockScratchCard(`Premium Member Bonus`, 75, `Upgraded to ${planName}!`);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#061129] text-slate-100' : 'bg-[#F5F8FA] text-slate-900'} flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 overflow-x-hidden w-full max-w-full`}>
      {/* Offline Connectivity Notification Banner */}
      <OfflineIndicator
        isOnline={isOnline}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
      />

      {/* Top Header */}
      <Header
        cashbackBalance={cashbackBalance}
        unscratchedCount={unscratchedCount}
        safetyScore={userProfile.safetyScore}
        isOnline={isOnline}
        isSimulatedOffline={isSimulatedOffline}
        theme={theme}
        isPremium={userProfile.isPremium || false}
        onToggleTheme={toggleTheme}
        onToggleOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
        onOpenCashback={() => setShowCashbackModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onResetDemoData={handleResetDemoData}
        onOpenDirectUpiTransfer={handleOpenDirectUpiTransfer}
        onLockApp={handleLockApp}
        onOpenPitchMode={() => setShowPitchMode(true)}
        onOpenGrowthHub={() => setShowGrowthHub(true)}
        onOpenPremium={() => setShowPremiumModal(true)}
      />

      {/* 80% Monthly Budget Threshold Alert (On-screen Toast & Push Notification) */}
      <BudgetAlertToast
        totalSpent={totalSpent}
        pocketMoney={userProfile.pocketMoney}
        onOpenBuddyTab={() => handleTabChange('buddy')}
        onEditBudget={() => handleTabChange('buddy')}
      />

      {/* Main Responsive Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-4 pb-20">
        {/* Animated Main Tab View with Subtle Fade-In Glide */}
        <div key={activeTab} className="animate-tab-fade">
          {/* Tab 1: Shield */}
          {activeTab === 'shield' && (
            <div className="space-y-4">
              {/* Universal UPI Quick Banking Hub (Google Pay, PhonePe, Paytm, BHIM, PayLater) */}
              <QuickPayHub
                userProfile={userProfile}
                pocketMoney={userProfile.pocketMoney}
                totalSpent={totalSpent}
                cashbackBalance={cashbackBalance}
                payLaterAccount={payLaterAccount}
                onOpenDirectUpiTransfer={handleOpenDirectUpiTransfer}
                onSelectTab={handleTabChange}
                onOpenCashback={() => setShowCashbackModal(true)}
                onOpenPayLaterHub={() => setShowPayLaterHub(true)}
                onLockApp={handleLockApp}
              />
              <ShieldTab
                reportedScams={reportedScams}
                scamAlerts={SCAM_ALERTS}
                expenses={expenses}
                onReportScam={handleReportScam}
                onIncrementSafetyScore={handleIncrementSafetyScore}
                onUnlockScratchCard={handleUnlockScratchCard}
                onOpenDirectUpiTransfer={handleOpenDirectUpiTransfer}
              />
            </div>
          )}

          {/* Tab 2: Buddy */}
          {activeTab === 'buddy' && (
            <BuddyTab
              expenses={expenses}
              pocketMoney={userProfile.pocketMoney}
              payLaterAccount={payLaterAccount}
              isPremium={userProfile.isPremium || false}
              onUpdatePocketMoney={handleUpdatePocketMoney}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              onLoadSampleTransactions={handleLoadSampleTransactions}
              onOpenDirectUpiTransfer={handleOpenDirectUpiTransfer}
              onOpenPayLaterCheck={() => setShowPayLaterCheck(true)}
              onOpenPayLaterHub={() => setShowPayLaterHub(true)}
              onOpenPremium={() => setShowPremiumModal(true)}
            />
          )}

          {/* Tab 3: Group Wallet */}
          {activeTab === 'group' && (
            <GroupWalletTab
              groups={groups}
              onCreateGroup={handleCreateGroup}
              onAddGroupExpense={handleAddGroupExpense}
              onInitiateMockUpiPayment={handleInitiateActualUpiPayment}
              settledTransferKeys={settledTransferKeys}
            />
          )}

          {/* Tab 4: Profile */}
          {activeTab === 'profile' && (
            <ProfileTab
              userProfile={userProfile}
              cashbackBalance={cashbackBalance}
              unscratchedCount={unscratchedCount}
              theme={theme}
              payLaterAccount={payLaterAccount}
              onToggleTheme={toggleTheme}
              onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
              onOpenCashback={() => setShowCashbackModal(true)}
              onOpenOnboarding={() => setShowOnboardingModal(true)}
              onResetDemoData={handleResetDemoData}
              onLockApp={handleLockApp}
              onUpdateMpin={handleResetMpin}
              onOpenFounderDashboard={() => setShowFounderDashboard(true)}
              onOpenPitchMode={() => setShowPitchMode(true)}
              onOpenRevenueStreams={() => setShowRevenueStreams(true)}
              onOpenGrowthHub={() => setShowGrowthHub(true)}
              onOpenPayLaterCheck={() => setShowPayLaterCheck(true)}
              onOpenPayLaterHub={() => setShowPayLaterHub(true)}
              onOpenPremium={() => setShowPremiumModal(true)}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unscratchedCount={unscratchedCount}
      />

      {/* Founder View / Business Dashboard Modal */}
      {showFounderDashboard && (
        <FounderDashboardModal
          onClose={() => setShowFounderDashboard(false)}
          onOpenRevenueStreams={() => {
            setShowFounderDashboard(false);
            setShowRevenueStreams(true);
          }}
          onOpenPitchMode={() => {
            setShowFounderDashboard(false);
            setShowPitchMode(true);
          }}
        />
      )}

      {/* Revenue Streams & Plans Modal */}
      {showRevenueStreams && (
        <RevenueStreamsModal
          isPremiumUser={userProfile.isPremium || false}
          onUpgradePremium={handleUpgradePremium}
          onClose={() => setShowRevenueStreams(false)}
        />
      )}

      {/* PaySafe Buddy Premium Subscription Pop-up Modal */}
      {showPremiumModal && (
        <PremiumSubscriptionModal
          isPremiumUser={userProfile.isPremium || false}
          currentPlan={userProfile.premiumPlan}
          onUpgradePremium={handleUpgradePremium}
          onClose={() => setShowPremiumModal(false)}
        />
      )}

      {/* Pitch Mode (6-Step Walkthrough) Modal */}
      {showPitchMode && (
        <PitchModeModal
          onClose={() => setShowPitchMode(false)}
          onOpenFounderDashboard={() => {
            setShowPitchMode(false);
            setShowFounderDashboard(true);
          }}
        />
      )}

      {/* Growth Hub (Radar, Streak, Leaderboard, Share Card, Ambassador) */}
      {showGrowthHub && (
        <GrowthHubModal
          userProfile={userProfile}
          referrals={referrals}
          onSimulateReferral={handleSimulateReferral}
          onClose={() => setShowGrowthHub(false)}
        />
      )}

      {/* PaySafe PayLater 0% Student Credit Hub Modal */}
      {showPayLaterHub && (
        <PayLaterHubModal
          payLaterAccount={payLaterAccount}
          userProfile={userProfile}
          onUpdateAccount={handleUpdatePayLaterAccount}
          onOpenPayLaterCheck={() => {
            setShowPayLaterHub(false);
            setShowPayLaterCheck(true);
          }}
          onClose={() => setShowPayLaterHub(false)}
        />
      )}

      {/* Pay-Later & BNPL Safety Check Modal */}
      {showPayLaterCheck && (
        <PayLaterCheckModal
          monthlyPocketMoney={userProfile.pocketMoney}
          onClose={() => setShowPayLaterCheck(false)}
        />
      )}

      {/* Cashback & Refer a Friend Modal */}
      {showCashbackModal && (
        <CashbackModal
          cashbackBalance={cashbackBalance}
          scratchCards={scratchCards}
          referrals={referrals}
          onScratchCard={handleScratchCard}
          onSimulateReferral={handleSimulateReferral}
          onClose={() => setShowCashbackModal(false)}
        />
      )}

      {/* Actual Live UPI Payment Sheet (NPCI Deep Links + Dynamic QR + PayLater) */}
      {actualUpiTransfer && (
        <ActualUPIPaymentModal
          initialPayeeName={actualUpiTransfer.payeeName}
          initialUpiId={actualUpiTransfer.upiId}
          amount={actualUpiTransfer.amount}
          note={actualUpiTransfer.note}
          reportedScams={reportedScams}
          transferKey={actualUpiTransfer.transferKey}
          payLaterAccount={payLaterAccount}
          onSuccess={(details) => {
            handleActualUpiTransferSuccess(details);
            setActualUpiTransfer(null);
          }}
          onClose={() => setActualUpiTransfer(null)}
        />
      )}

      {/* Onboarding Tour Modal */}
      {showOnboardingModal && (
        <OnboardingModal onClose={() => setShowOnboardingModal(false)} />
      )}
    </div>
  );
}
