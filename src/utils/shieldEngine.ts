import { ReportedScam, RiskCheckResult, RiskLevel } from '../types';

const SUSPICIOUS_KEYWORDS = [
  { word: 'free', weight: 22, reason: 'Contains bait keyword "free", heavily associated with student giveaway traps.' },
  { word: 'lottery', weight: 35, reason: 'Claims lottery or prize winnings, which are classic advance-fee scams.' },
  { word: 'cashback', weight: 25, reason: 'Uses "cashback" hook, often used to disguise fake collect requests.' },
  { word: 'kyc', weight: 30, reason: 'Mentions "KYC" update or verification, a common impersonation tactic.' },
  { word: 'refund', weight: 25, reason: 'References "refund" desk; scammers use fake refund links to pull money.' },
  { word: 'urgent', weight: 20, reason: 'Employs artificial urgency to pressure you into paying without thinking.' },
  { word: 'blocked', weight: 25, reason: 'Claims account or card will be blocked to induce panic.' },
  { word: 'winner', weight: 30, reason: 'Unsolicited contest winner claim detected.' },
  { word: 'reward', weight: 20, reason: 'Offers unearned rewards or coupons requiring UPI initiation.' },
  { word: 'internship', weight: 25, reason: 'Internship payment request. Legitimate companies never charge registration fees.' },
  { word: 'deposit', weight: 20, reason: 'Requests upfront token deposit or advance before viewing product/room.' },
  { word: 'token', weight: 18, reason: 'Demands advance token money before delivering service or goods.' },
  { word: 'bonus', weight: 22, reason: 'Promises instant bonus or double-money return.' },
  { word: 'claim', weight: 20, reason: 'Prompting to "claim" money. Remember: money comes to your bank automatically, no claim PIN needed.' },
];

const SHORTENED_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  'is.gd',
  'cutt.ly',
  'rb.gy',
  'shorturl.at',
  't.ly',
  'v.gd',
  'wa.me',
  't.me',
];

const BRAND_TYPOSQUATS = [
  { fake: 'paytmm', real: 'Paytm' },
  { fake: 'paytm-help', real: 'Paytm' },
  { fake: 'paytm-kyc', real: 'Paytm' },
  { fake: 'g-pay', real: 'Google Pay' },
  { fake: 'gpay-reward', real: 'Google Pay' },
  { fake: 'gpay-bonus', real: 'Google Pay' },
  { fake: 'phonepe-cash', real: 'PhonePe' },
  { fake: 'phonepe-kyc', real: 'PhonePe' },
  { fake: 'phonepe-win', real: 'PhonePe' },
  { fake: 'bhim-reward', real: 'BHIM' },
  { fake: 'sbi-reward', real: 'State Bank of India' },
  { fake: 'amazon-gift', real: 'Amazon Pay' },
  { fake: 'cred-cashback', real: 'CRED' },
];

const VERIFIED_CAMPUS_DOMAINS = [
  'iitd.ac.in',
  'du.ac.in',
  'bits-pilani.ac.in',
  'canteen@iitd',
  'messfee@du',
  'library@campus',
  'irctc@sbi',
  'tatapower@icici',
  'airtel@axisbank',
  'swiggy@axis',
  'zomato@hdfcbank',
];

export function analyzeTarget(input: string, reportedDatabase: ReportedScam[]): RiskCheckResult {
  const cleanInput = input.trim().toLowerCase();
  const rawInput = input.trim();

  const reasons: string[] = [];
  const matchedRules: string[] = [];
  let score = 0;

  if (!cleanInput) {
    return {
      target: '',
      score: 0,
      level: 'safe',
      headline: 'Enter a UPI ID or Link',
      reasons: ['No input provided for analysis.'],
      matchedRules: [],
      recommendation: 'Paste any UPI ID, QR link, or social ad URL to verify.',
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  // 1. Check Community Reported Database (Custom user reports + seeded database)
  const exactReport = reportedDatabase.find((r) => {
    const rTarget = r.target.trim().toLowerCase();
    return cleanInput.includes(rTarget) || rTarget.includes(cleanInput);
  });

  if (exactReport) {
    score = 98;
    matchedRules.push('COMMUNITY_FLAGGED');
    reasons.push(
      `Direct Match: Reported by ${exactReport.reportedBy || 'Student Community'} as "${exactReport.category}".`
    );
    reasons.push(
      `Community Warning: Flagged ${exactReport.timesFlagged} times across college student networks.`
    );
    if (exactReport.notes) {
      reasons.push(`Student Report Detail: "${exactReport.notes}"`);
    }

    return {
      target: rawInput,
      score,
      level: 'danger',
      headline: 'High Risk: Reported Fraud ID',
      reasons,
      matchedRules,
      recommendation: 'DO NOT PAY. Block this account and report on National Cyber Crime Portal (1930).',
      isReportedCommunityScam: true,
      reportedTimes: exactReport.timesFlagged,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  // 2. Check for URL Shorteners
  for (const shortener of SHORTENED_DOMAINS) {
    if (cleanInput.includes(shortener)) {
      score += 40;
      matchedRules.push('SHORTENED_URL');
      reasons.push(
        `Disguised Destination: Uses URL shortener (${shortener}) to hide the actual payment address.`
      );
      break;
    }
  }

  // 3. Check for Suspicious Scam Keywords
  const foundKeywords: string[] = [];
  for (const item of SUSPICIOUS_KEYWORDS) {
    // Check if word appears as whole or part in cleanInput
    const regex = new RegExp(`\\b${item.word}|${item.word}`, 'i');
    if (regex.test(cleanInput)) {
      foundKeywords.push(item.word);
      score += item.weight;
      matchedRules.push(`KEYWORD_${item.word.toUpperCase()}`);
      reasons.push(item.reason);
    }
  }

  // 4. Check for Brand Typosquatting
  for (const typo of BRAND_TYPOSQUATS) {
    if (cleanInput.includes(typo.fake)) {
      score += 45;
      matchedRules.push('BRAND_IMPERSONATION');
      reasons.push(
        `Brand Impersonation: Mimics official "${typo.real}" with misleading handle "${typo.fake}".`
      );
    }
  }

  // 5. Check for Random Digit Entropy in UPI handle (Burner Accounts)
  // Example: "aryan.sharma04@okaxis" has only 2 digits, but "pay9842103841@ybl" or "rahul728192301@icici" has 8+
  const upiMatch = cleanInput.match(/^([^@]+)@([a-z0-9]+)$/);
  if (upiMatch) {
    const handle = upiMatch[1];
    const bankHandle = upiMatch[2];
    const digitsOnly = handle.replace(/\D/g, '');

    if (digitsOnly.length >= 7) {
      score += 30;
      matchedRules.push('HIGH_ENTROPY_DIGITS');
      reasons.push(
        `Disposable Burner Handle: Contains ${digitsOnly.length} random digits, typical of temporary fraud accounts.`
      );
    }

    // Check if official institutional or verified merchant
    const isCampusVerified = VERIFIED_CAMPUS_DOMAINS.some(
      (v) => cleanInput.includes(v) || bankHandle.includes(v)
    );
    if (isCampusVerified) {
      score = Math.max(0, score - 50);
      reasons.push('Verified Institution: Matches registered university mess / public service handle.');
    }
  }

  // 6. Check for Collect Request signals
  if (cleanInput.includes('collect') || cleanInput.includes('approve') || cleanInput.includes('receive')) {
    score += 35;
    matchedRules.push('COLLECT_REQUEST_ALERT');
    reasons.push(
      'Collect Request Trap: Remember that entering your UPI PIN always DEDUCTS money from your bank account.'
    );
  }

  // 7. Check if it's an Instagram ad link with suspicious parameters
  if (cleanInput.includes('instagram.com') || cleanInput.includes('t.me') || cleanInput.includes('telegram')) {
    if (score > 0) {
      score += 15;
      reasons.push('Unregulated Social Channel: Transaction originating from unverified social media profile.');
    }
  }

  // Cap score between 0 and 100
  score = Math.min(100, Math.max(5, score));

  // Determine Level
  let level: RiskLevel = 'safe';
  let headline = 'Verified & Safe to Pay';
  let recommendation = 'No red flags detected. You can proceed with standard caution.';

  if (score >= 66) {
    level = 'danger';
    headline = 'High Risk Scam Detected';
    recommendation =
      'DO NOT PAY! Legitimate colleges, internships, and brands never ask for payments through these channels.';
  } else if (score >= 26) {
    level = 'caution';
    headline = 'Proceed with Caution';
    recommendation =
      'Double check payee identity before entering your UPI PIN. Verify if friends have used this service.';
  } else {
    level = 'safe';
    score = Math.min(15, score); // keep safe scores low and reassuring
    if (reasons.length === 0) {
      reasons.push('Clean handle structure without deceptive brand keywords or URL shorteners.');
      reasons.push('Valid bank VPA routing format standard in Indian banking system.');
      reasons.push('Zero community scam reports or cyber complaints on record.');
    }
  }

  return {
    target: rawInput,
    score,
    level,
    headline,
    reasons: reasons.slice(0, 4), // keep 2-4 clean reasons
    matchedRules,
    recommendation,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
