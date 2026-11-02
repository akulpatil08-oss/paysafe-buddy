export type RiskLevel = 'safe' | 'caution' | 'danger';

export interface RiskCheckResult {
  target: string;
  score: number; // 0 (safest) to 100 (highest risk)
  level: RiskLevel;
  headline: string;
  reasons: string[];
  matchedRules: string[];
  recommendation: string;
  isReportedCommunityScam?: boolean;
  reportedTimes?: number;
  timestamp: string;
}

export interface ReportedScam {
  id: string;
  target: string; // UPI ID or link
  category: string;
  reportedAt: string;
  notes: string;
  reportedBy: string;
  timesFlagged: number;
}

export interface ScamAlert {
  id: string;
  title: string;
  category: 'Fake Sale' | 'Internship' | 'Collect Request' | 'Hostel/PG' | 'Exam Leak' | 'Cashback';
  description: string;
  redFlags: string[];
  exampleTarget: string;
  reportedCount: number;
  date: string;
  severity: 'high' | 'medium';
}

export type ExpenseCategory = 'Food' | 'Travel' | 'Recharge' | 'Shopping' | 'Others';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  paymentMethod?: string;
  notes?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  upiId: string;
  avatarColor: string;
  isCurrentUser?: boolean;
}

export interface GroupExpense {
  id: string;
  title: string;
  amount: number;
  paidByMemberId: string;
  splitBetweenMemberIds: string[];
  date: string;
}

export interface GroupWallet {
  id: string;
  name: string;
  emoji: string;
  description: string;
  members: GroupMember[];
  expenses: GroupExpense[];
}

export interface SettlementTransfer {
  fromMemberId: string;
  fromName: string;
  toMemberId: string;
  toName: string;
  toUpiId: string;
  amount: number;
  settled: boolean;
}

export interface ScratchCard {
  id: string;
  title: string;
  rewardAmount: number;
  reason: string;
  isScratched: boolean;
  date: string;
}

export interface ReferralFriend {
  id: string;
  name: string;
  college: string;
  status: 'Invited' | 'Joined' | 'Verified 1st UPI';
  rewardEarned: number;
  date: string;
}

export interface UserProfile {
  name: string;
  college: string;
  year: string;
  upiId: string;
  pocketMoney: number;
  safetyScore: number;
  safetyTitle: string;
  mpin?: string;
  isBiometricEnabled?: boolean;
  lastLoginTime?: string;
  bankAccountNumber?: string;
  isPremium?: boolean;
  premiumPlan?: string;
  premiumExpiresAt?: string;
  streakDays?: number;
  isAmbassador?: boolean;
}

export interface CampusLeaderboardItem {
  id: string;
  rank: number;
  name: string;
  category: 'Hostel' | 'Department' | 'College';
  campus: string;
  verifiedChecks: number;
  scamsReported: number;
  safetyRating: number;
  badge: string;
}

export interface CampusRadarAlert {
  id: string;
  target: string;
  title: string;
  category: string;
  campus: string;
  timestamp: string;
  upvotes: number;
  verifiedByCyberCell: boolean;
}

export interface PayLaterPlan {
  itemTitle: string;
  principalAmount: number;
  tenureMonths: number;
  interestRateAnnual: number;
  processingFee: number;
  monthlyPocketMoney: number;
}

export interface PayLaterTransaction {
  id: string;
  payeeName: string;
  upiId: string;
  amount: number;
  date: string;
  status: 'settled' | 'pending';
  billingCycle: string;
}

export interface PayLaterAccount {
  isEnabled: boolean;
  totalLimit: number;
  usedLimit: number;
  availableLimit: number;
  billingCycleDate: string;
  dueDate: string;
  interestRate: number;
  isFrozen: boolean;
  transactions: PayLaterTransaction[];
}

