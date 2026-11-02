import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BadgeCheck,
  Tag,
  Copy,
  Check,
  Megaphone,
  X,
  Info,
  Building,
  Coffee,
  ShoppingBag,
  Zap,
} from 'lucide-react';

interface SponsoredAdBannerProps {
  campusName?: string;
  className?: string;
}

interface AdItem {
  id: string;
  brand: string;
  category: string;
  tagline: string;
  offer: string;
  code: string;
  verifiedMerchant: boolean;
  ctaText: string;
  badgeText: string;
  gradient: string;
  accentColor: string;
  icon: React.ReactNode;
}

export const SponsoredAdBanner: React.FC<SponsoredAdBannerProps> = ({
  campusName = 'REVA University',
  className = '',
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAdInfoModal, setShowAdInfoModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const ads: AdItem[] = [
    {
      id: 'ad-reva-foodcourt',
      brand: 'REVA Central Food Court',
      category: 'Campus Canteen · Verified Vendor',
      tagline: 'Exclusive lunch combo & cold cold coffee for engineering & science blocks.',
      offer: 'Flat 20% Instant Discount on UPI Payments',
      code: 'REVAPAY20',
      verifiedMerchant: true,
      ctaText: 'Redeem at Counter 3',
      badgeText: 'REVA Campus Partner',
      gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
      accentColor: 'text-amber-500',
      icon: <Coffee className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'ad-dominos',
      brand: "Domino's Pizza Kattigenahalli",
      category: 'Student Late-Night Hunger Deal',
      tagline: 'Hostel delivery guaranteed in under 20 mins to Kaveri & Tungabhadra blocks.',
      offer: '2 Regular Pizzas @ ₹199 + Free Delivery',
      code: 'REVACHEESE',
      verifiedMerchant: true,
      ctaText: 'Apply via GPay / PhonePe',
      badgeText: 'Verified Brand Sponsor',
      gradient: 'from-blue-600/15 via-indigo-600/10 to-transparent',
      accentColor: 'text-blue-500',
      icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
    },
    {
      id: 'ad-boat',
      brand: 'boAt Lifestyle Campus Rush',
      category: 'Electronics · Exam Season Prep',
      tagline: '42-hour battery life ANC noise-cancelling earbuds for library study sessions.',
      offer: 'Flat 50% Off with College ID Check',
      code: 'BOATSTUDENT',
      verifiedMerchant: true,
      ctaText: 'Claim Student Code',
      badgeText: 'National Brand Partner',
      gradient: 'from-rose-500/15 via-pink-500/10 to-transparent',
      accentColor: 'text-rose-500',
      icon: <Zap className="w-5 h-5 text-rose-500" />,
    },
    {
      id: 'ad-blinkit',
      brand: 'Blinkit Yelahanka Hub',
      category: '10-Min Stationery & Maggi Delivery',
      tagline: 'Semester exam lab records, blue chart papers, stationery & energy drinks.',
      offer: 'Flat ₹75 Cashback on 1st Order via UPI',
      code: 'REVA75',
      verifiedMerchant: true,
      ctaText: 'Instant Delivery',
      badgeText: 'Quick Commerce Sponsor',
      gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
      accentColor: 'text-emerald-500',
      icon: <Building className="w-5 h-5 text-emerald-500" />,
    },
  ];

  const current = ads[currentAdIndex];

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      // fallback
    }
  };

  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  if (isDismissed) {
    return (
      <div className="py-1 text-center">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 underline cursor-pointer"
        >
          Show campus merchant deals & sponsored offers
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#0a182c] border border-slate-200/90 dark:border-slate-800 shadow-md transition-all ${className}`}>
        {/* Soft background gradient based on active brand */}
        <div className={`absolute inset-0 bg-gradient-to-r ${current.gradient} pointer-events-none`} />

        <div className="relative z-10 p-4 sm:p-5 space-y-3">
          {/* Top Label: Sponsored Banner Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Megaphone className="w-3 h-3 text-amber-400 dark:text-amber-500" />
                <span>Sponsored</span>
              </span>

              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-teal-500" />
                <span>{current.badgeText}</span>
              </span>

              <span className="text-[11px] text-slate-600 dark:text-slate-400 hidden sm:inline">
                Verified genuine offer for students
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Ad Info & Advertise button */}
              <button
                type="button"
                onClick={() => setShowAdInfoModal(true)}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="About PaySafe Ads & Advertise Here"
              >
                <Info className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden md:inline">Advertise Here</span>
              </button>

              {/* Close ad */}
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                title="Dismiss ad"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ad Content Hero Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                {current.icon}
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex flex-col">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#0B2545] dark:text-white tracking-tight leading-snug truncate">
                    {current.brand}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    {current.category}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-black text-teal-600 dark:text-teal-400 tracking-tight pt-0.5">
                  {current.offer}
                </div>

                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                  {current.tagline}
                </p>
              </div>
            </div>

            {/* Promo Code & Action Button */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80 shrink-0">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-mono font-black text-[#0B2545] dark:text-white px-2 tracking-wider">
                  {current.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(current.code)}
                  className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95 shadow-sm"
                  title="Copy discount promo code"
                >
                  {copiedCode === current.code ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Valid for {campusName}
              </span>
            </div>
          </div>

          {/* Carousel Footer & Dots */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-1.5">
              {ads.map((ad, idx) => (
                <button
                  key={ad.id}
                  onClick={() => setCurrentAdIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentAdIndex
                      ? 'w-6 bg-teal-500'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  title={ad.brand}
                />
              ))}
              <span className="text-slate-600 dark:text-slate-400 text-[10px] ml-1.5 font-medium">
                Ad {currentAdIndex + 1} of {ads.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevAd}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Previous deal"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextAd}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Next deal"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advertise with PaySafe Buddy / Business Revenue Modal */}
      {showAdInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#0c1a2e] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 text-slate-900 dark:text-white shadow-2xl relative">
            <button
              onClick={() => setShowAdInfoModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0B2545] dark:text-white">
                  PaySafe Buddy Ad & Merchant Network
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Monetization Layer · Genuine Student Commercial Partnerships
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-1">
                <span className="font-extrabold text-teal-800 dark:text-teal-300 block">
                  Why Brands & Campus Merchants Pay To Advertise Here:
                </span>
                <p>
                  PaySafe Buddy reaches 14,000+ active college students at the exact moment of payment intention. Unlike noisy social media ads, every deal is verified with an NPCI-compliant trust badge, preventing student scams.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono-numbers">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase font-bold">Local Merchant Slot</span>
                  <span className="text-base font-black text-[#0B2545] dark:text-white">₹499 / mo</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 block mt-0.5">Includes green verified badge</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase font-bold">National Brand Slot</span>
                  <span className="text-base font-black text-[#0B2545] dark:text-white">₹4,999 / mo</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 block mt-0.5">Full campus multi-channel reach</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-[11px]">
                <strong>Faculty & Judge Note:</strong> This forms Revenue Stream #4 in the PaySafe Buddy Business Model, contributing ~₹25,000/month recurring income from local campus merchants.
              </div>
            </div>

            <button
              onClick={() => {
                setShowAdInfoModal(false);
                alert('Demo: Ad slot reservation inquiry submitted for REVA University campus!');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-teal-500/20 active:scale-98 transition-all"
            >
              Simulate Booking an Ad Slot (Demo)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
