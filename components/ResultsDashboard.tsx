// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Target,
  Ghost,
  Crown,
  Activity,
  MessageCircle,
  RotateCw,
  Play,
  Zap,
  BarChart3,
  Bike,
  CheckCircle,
  ShieldCheck,
  Quote as QuoteIcon,
  Globe,
  Bot,
  Rocket,
  Star,
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

/**
 * ✅ Best-effort extractor for Google rating (0..5) WITHOUT defaulting to 4.5
 * Priority:
 * 1) Direct fields: rating / averageRating / googleRating / stars / ratingValue ...
 * 2) Rating breakdown object/array (1..5 stars)
 * 3) Estimate from positive/negative/total reviews (no fixed 4.5)
 * 4) If nothing -> null (unknown)
 */
function extractRatingSmart(data: any): {
  rating: number | null;
  source: 'direct' | 'breakdown' | 'estimated' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
} {
  const clamp = (v: number) => Math.max(0, Math.min(5, v));

  const toNum = (v: any) => {
    const n = typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // 1) direct keys (common across APIs/forms)
  const directKeys = [
    'rating',
    'averageRating',
    'googleRating',
    'stars',
    'ratingValue',
    'avgRating',
    'placeRating',
    'overallRating',
  ];

  for (const k of directKeys) {
    const n = toNum(data?.[k]);
    if (n !== null && n >= 0 && n <= 5) {
      return { rating: clamp(n), source: 'direct', confidence: 'high' };
    }
  }

  // 2) rating breakdown
  const breakdownCandidates = [
    data?.ratingBreakdown,
    data?.starsBreakdown,
    data?.reviewBreakdown,
    data?.ratingHistogram,
  ].filter(Boolean);

  for (const b of breakdownCandidates) {
    if (typeof b === 'object' && !Array.isArray(b)) {
      let sum = 0;
      let total = 0;
      for (const s of [1, 2, 3, 4, 5]) {
        const c = toNum(b?.[s]) ?? toNum(b?.[String(s)]);
        if (c !== null && c >= 0) {
          sum += s * c;
          total += c;
        }
      }
      if (total > 0) {
        return { rating: clamp(sum / total), source: 'breakdown', confidence: 'high' };
      }
    }

    if (Array.isArray(b)) {
      let sum = 0;
      let total = 0;
      for (const item of b) {
        const s = toNum(item?.stars ?? item?.star ?? item?.rating);
        const c = toNum(item?.count ?? item?.value ?? item?.n);
        if (s !== null && c !== null && s >= 0 && s <= 5 && c >= 0) {
          sum += s * c;
          total += c;
        }
      }
      if (total > 0) {
        return { rating: clamp(sum / total), source: 'breakdown', confidence: 'high' };
      }
    }
  }

  // 3) Estimate using positive / negative / total counts (no fixed 4.5)
  const totalReviews = Number(data?.currentReviews) || 0;
  const positive = Number(data?.positiveReviews) || 0;
  const negative = Number(data?.negativeReviews) || 0;
  const remainder = Math.max(0, totalReviews - positive - negative);

  if (totalReviews > 0 && (positive > 0 || negative > 0)) {
    const posAvg = 4.6;
    const negAvg = 2.3;
    const neuAvg = 3.5;

    const est =
      (positive * posAvg + negative * negAvg + remainder * neuAvg) / totalReviews;

    return { rating: clamp(est), source: 'estimated', confidence: 'medium' };
  }

  return { rating: null, source: 'unknown', confidence: 'low' };
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  language,
  data,
  onReset,
  onBack,
  onVisualExp,
}) => {
  const t = TEXTS[language] ?? TEXTS['ar'];
  const isRTL = language === 'ar';

  const isRestaurant =
    data.projectType === 'restaurant' ||
    data.projectType === 'مطعم' ||
    data.projectType === 'cafe';

  // ==========================
  // 0) SMART RATING (NO DEFAULT)
  // ==========================
  const ratingInfo = React.useMemo(() => extractRatingSmart(data), [data]);
  const rating = ratingInfo.rating; // number | null
  const ratingPercent = rating !== null ? Math.round((rating / 5) * 100) : null;

  // تأثير سلبي تقديري بناءً على انخفاض النجوم (كل 0.5 نجمة = +5%)
  const negativeImpactPercent = React.useMemo(() => {
    if (rating === null) return null;
    const delta = Math.max(0, 5 - rating);
    const steps = delta / 0.5;
    const impact = Math.round(steps * 5);
    return Math.min(60, impact);
  }, [rating]);

  // ==========================
  // 1) SAFE CORE NUMBERS
  // ==========================
  const currentYear = new Date().getFullYear();

  const establishedYear = Number(
    (data as any).establishedYear ?? (data as any).establishmentYear
  );

  const ageYears =
    Number.isFinite(establishedYear) &&
    establishedYear >= 1900 &&
    establishedYear <= currentYear
      ? Math.max(1, currentYear - establishedYear)
      : 1;

  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;

  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;

  // Baseline (Current Reality)
  const baselineWeekly =
    Number(data.weeklyGrowth) ||
    Number((avgReviewsPerYear / 52).toFixed(1)) ||
    0;

  const baselineDaily = Number((baselineWeekly / 7).toFixed(1)) || 0;

  const baselineMonthly =
    Number(data.monthlyGrowth) ||
    (baselineWeekly > 0 ? Number((baselineWeekly * 4.3).toFixed(1)) : 0) ||
    0;

  // ==========================
  // 2) SYSTEM POTENTIAL (10% RULE)
  // ==========================
  const systemDailyPotential = Math.round(dailyCustomers * 0.10);
  const systemWeekly = systemDailyPotential * 7;
  const systemMonthly = systemDailyPotential * 30;
  const systemYearly = systemDailyPotential * 365;

  const lostDailyReviewsRaw = Math.max(0, systemDailyPotential - baselineDaily);
  const lostWeeklyReviewsRaw = Math.max(0, systemWeekly - baselineWeekly);

  const lostDailyReviews =
    lostDailyReviewsRaw === 0 ? 0 : Number(lostDailyReviewsRaw.toFixed(1));
  const lostWeeklyReviews =
    lostWeeklyReviewsRaw === 0 ? 0 : Number(lostWeeklyReviewsRaw.toFixed(1));

  // ==========================
  // 3) REGIONAL CURRENCY + TICKET
  // ==========================
  const getRegionalData = () => {
    const address = (data.address || '').toLowerCase();
    const isKuwait = address.includes('kuwait') || address.includes('الكويت');
    return isKuwait
      ? { symbol: isRTL ? 'د.ك' : 'KWD', ticket: 20 }
      : { symbol: isRTL ? 'دولار' : 'USD', ticket: 60 };
  };

  const regional = getRegionalData();
  const currency = regional.symbol;

  // ==========================
  // 4) REVENUE LEAK
  // ==========================
  const baseYearlyReviews = baselineMonthly * 12;
  const projectedYearlyReviews = systemMonthly * 12;

  const reviewGapYearly = Math.max(0, projectedYearlyReviews - baseYearlyReviews);

  const customerLossMultiplier = 4;
  const lostCustomersCount = Math.max(0, reviewGapYearly * customerLossMultiplier);

  const lostRevenueValue = lostCustomersCount * regional.ticket;
  const lostRevenue = Number.isFinite(lostRevenueValue)
    ? Math.round(lostRevenueValue)
    : 0;

  const percentageIncrease =
    baseYearlyReviews > 0
      ? Math.round(
          ((projectedYearlyReviews - baseYearlyReviews) / baseYearlyReviews) * 100
        )
      : 100;

  const loyaltyConversionRate = 0.35;
  const visitsPerLoyalClientPerYear = 3;

  const annualAdditionalReviews = systemYearly;

  const dynamicProfitValue =
    annualAdditionalReviews *
    loyaltyConversionRate *
    visitsPerLoyalClientPerYear *
    regional.ticket;

  const dynamicProfit = Number.isFinite(dynamicProfitValue)
    ? Math.round(dynamicProfitValue).toLocaleString()
    : '0';

  // ==========================
  // 5) MARKET STATUS (تعديل النص فقط)
  // ==========================
  const getMarketStatus = () => {
    if (avgReviewsPerYear < 15) {
      return {
        id: 'ghost',
        title: isRTL ? 'شبح رقمي - مخفي' : 'Digital Ghost',
        desc: isRTL
          ? 'أنت غير مرئي للعملاء الجدد. محركات البحث تتجاهل نشاطك بسبب ضعف التفاعل الحقيقي.'
          : 'Invisible to new customers. Search engines ignore you due to low engagement.',
        color: 'text-red-500',
        bg: 'bg-red-900/20',
        border: 'border-red-500/30',
        icon: Ghost,
      };
    } else if (avgReviewsPerYear < 80) {
      return {
        id: 'average',
        title: isRTL ? 'تواجد متوسط - مهدد' : 'Average Presence',
        desc: isRTL
          ? 'أنت موجود… لكن المنافسون يسبقونك بمراسلات العملاء وزيادة ولائهم، ويضمنون التواجد في المقدمة ضمن خيارات جوجل.'
          : 'You are present… but competitors win through continuous customer communication and loyalty-building—staying top in Google choices.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-500/30',
        icon: Target,
      };
    }
    return {
      id: 'strong',
      title: isRTL ? 'رائد يحتاج نظام ثابت' : 'Market Leader Needs A System',
      desc: isRTL
        ? 'أداء ممتاز… لكن الحفاظ على القمة يحتاج نظام يحافظ على التواصل والولاء ويمنع أي ثغرة يستغلها المنافسون.'
        : 'Great performance… staying on top needs a system that protects loyalty and prevents competitors from exploiting any gap.',
      color: 'text-green-500',
      bg: 'bg-green-900/20',
      border: 'border-green-500/30',
      icon: Crown,
    };
  };

  const status = getMarketStatus();

  // ==========================
  // 6) WHATSAPP LINK
  // ==========================
  const waNumber = '96566305551';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    isRTL
      ? `أريد تفعيل نظام Elegant Options وإيقاف خسارة العملاء لمشروعي (${data.projectName})`
      : `I want to activate Elegant Options for my business (${data.projectName})`
  )}`;

  // ==========================
  // 7) MANUAL MESSAGE (تعديل النص فقط)
  // ==========================
  const manualIcon =
    status.id === 'strong' ? (
      <TrendingUp className="text-green-500" size={32} />
    ) : status.id === 'average' ? (
      <Target className="text-yellow-500" size={32} />
    ) : (
      <TrendingDown className="text-red-500" size={32} />
    );

  const manualHeadline =
    status.id === 'strong'
      ? isRTL
        ? 'أداؤك قوي… لكن القمة تحتاج نظام ثابت'
        : 'You’re strong… but the top needs a system'
      : status.id === 'average'
      ? isRTL
        ? 'أنت مهدد… المنافسون يسبقونك بمراسلات العملاء وزيادة ولائهم'
        : 'You’re at risk… competitors win through loyalty communication'
      : isRTL
      ? 'أنت غير مرئي… وتخسر فرصًا يوميًا'
      : 'You’re invisible… losing opportunities daily';

  const manualBody =
    status.id === 'strong'
      ? isRTL
        ? 'التقييمات الحالية جيدة، لكن الاعتماد على الأسلوب الحالي يجعل الحفاظ على القمة مرهقًا ومعرضًا للتراجع… لأن المنافسين يبنون ولاء العملاء بتواصل مستمر كل يوم.'
        : 'Your reviews are good, but manual effort makes staying on top exhausting—competitors build loyalty through continuous communication every day.'
      : status.id === 'average'
      ? isRTL
        ? 'أنت موجود، لكن ضعف التواصل المستمر يقلل الولاء ويعطي المنافسين مساحة لسرقة حصتك. بدون نظام ثابت للمراسلات وطلب التقييمات، نموك سيبقى أبطأ من السوق.'
        : 'You exist, but inconsistent communication weakens loyalty and opens space for competitors. Without a consistent system, your growth stays slower.'
      : isRTL
      ? 'محركات البحث تتجاهلك بسبب نقص الإشارات الثابتة للثقة. كل يوم يمر بدون تدفق تقييمات… يعني عملاء يذهبون لغيرك.'
      : 'Search engines ignore you without consistent trust signals. Every day without review flow means customers choosing competitors.';

  // ==========================
  // RENDER
  // ==========================
  return (
    <div
      className={`max-w-5xl mx-auto space-y-16 animate-fade-in pb-32 ${
        isRTL ? 'font-tajawal text-right' : 'font-sans text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-2 pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span className="font-bold text-sm uppercase tracking-wider">
            {t.back}
          </span>
        </button>

        <span className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
          {isRTL ? 'تقرير ذكاء النمو' : 'Growth Intelligence Report'}
        </span>
      </div>

      {/* HERO: MARKET DIAGNOSIS */}
      <div
        className={`p-10 md:p-14 rounded-[3rem] border ${status.border} ${status.bg} backdrop-blur-md relative overflow-hidden group shadow-2xl`}
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <status.icon size={280} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div
            className={`p-8 rounded-3xl bg-slate-950 shadow-2xl ${status.color} border border-white/5`}
          >
            <status.icon size={64} />
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">
              {isRTL ? 'التشخيص السوقي الفعلي' : 'Real Market Diagnosis'}
            </h3>

            <div
              className={`text-5xl md:text-7xl font-black ${status.color} tracking-tighter italic uppercase`}
            >
              {status.title}
            </div>

            <p className="text-slate-200 text-lg md:text-2xl font-bold leading-relaxed opacity-90">
              {status.desc}
            </p>

            <div className="inline-flex items-center gap-3 bg-black/40 border border-white/10 px-5 py-3 rounded-2xl text-slate-200 font-black text-sm md:text-base">
              <AlertTriangle className="text-orange-400" size={18} />
              <span>
                {isRTL
                  ? 'تنبيه: المنافسون يستغلون أي فجوة في نشاطك الرقمي لتجاوزك.'
                  : 'Alert: competitors exploit any digital gap to overtake you.'}
              </span>
            </div>

            {/* Rating badge */}
            <div className="pt-3">
              {rating !== null ? (
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                  <Star className="text-yellow-400" size={18} />
                  <span className="text-white font-black">
                    {isRTL ? 'تقييمك الحالي:' : 'Current Rating:'} {rating.toFixed(1)} / 5
                  </span>
                  <span className="text-slate-400 font-black text-sm">
                    ({ratingPercent}%)
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                  <Star className="text-slate-400" size={18} />
                  <span className="text-slate-200 font-black">
                    {isRTL ? 'التقييم النجمي غير متاح من البيانات الحالية' : 'Star rating not available in current data'}
                  </span>
                </div>
              )}
            </div>

            {negativeImpactPercent !== null && (
              <div className="pt-2">
                <div className="inline-flex items-center gap-3 bg-red-500/5 border border-red-500/20 px-5 py-3 rounded-2xl">
                  <AlertTriangle className="text-red-400" size={18} />
                  <span className="text-red-200 font-black">
                    {isRTL
                      ? `هذا المستوى قد يقلل قابلية اكتساب عملاء جدد بنحو ${negativeImpactPercent}% (تقدير).`
                      : `This level may reduce new-customer acquisition by ~${negativeImpactPercent}% (estimate).`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CORE METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: isRTL ? 'عمر النشاط' : 'Business Age',
            value: ageYears,
            sub: isRTL ? 'سنة' : 'Years',
            icon: Globe,
          },
          {
            label: isRTL ? 'إجمالي التقييمات' : 'Total Reviews',
            value: totalReviews.toLocaleString(),
            sub: isRTL ? 'تقييم' : 'Reviews',
            icon: BarChart3,
          },
          {
            label: isRTL ? 'المعدل السنوي' : 'Annual Avg',
            value: avgReviewsPerYear,
            sub: isRTL ? 'تقييم / سنة' : 'per year',
            icon: Activity,
            color: 'text-indigo-400',
          },
          {
            label: isRTL ? 'المعدل الشهري' : 'Monthly Avg',
            value: (avgReviewsPerYear / 12).toFixed(1),
            sub: isRTL ? 'تقييم / شهر' : 'per month',
            icon: Zap,
          },
        ].map((m, i) => (
          <div
            key={i}
            className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 text-center hover:border-slate-700 transition-all group shadow-lg"
          >
            <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest block mb-4">
              {m.label}
            </span>
            <div className="flex flex-col items-center">
              <span className={`text-4xl font-black text-white ${m.color || ''}`}>
                {m.value}
              </span>
              <span className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                {m.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* PERFORMANCE COMPARISON */}
      <div className="space-y-10">
        {/* MANUAL STATUS */}
        <div
          className={`bg-slate-900/80 p-10 md:p-14 rounded-[3.5rem] border-2 ${status.border} relative group overflow-hidden shadow-2xl`}
        >
          <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                {manualIcon}
                <h3 className="text-slate-200 font-black text-2xl md:text-3xl uppercase tracking-tighter">
                  {isRTL ? 'الوضع الحالي' : 'Current Manual Status'}
                </h3>
              </div>

              <p className="text-slate-200 text-2xl md:text-3xl font-black leading-tight">
                {manualHeadline}
              </p>

              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic max-w-3xl">
                {manualBody}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <span className="text-slate-500 text-xs block mb-1 uppercase font-black tracking-widest">
                    {isRTL ? 'المعدل اليومي' : 'Daily Rate'}
                  </span>
                  <span className="text-3xl font-black text-white">
                    {baselineDaily}
                  </span>
                </div>

                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <span className="text-slate-500 text-xs block mb-1 uppercase font-black tracking-widest">
                    {isRTL ? 'المعدل الأسبوعي' : 'Weekly Rate'}
                  </span>
                  <span className="text-3xl font-black text-white">
                    {baselineWeekly}
                  </span>
                </div>

                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <span className="text-slate-500 text-xs block mb-1 uppercase font-black tracking-widest">
                    {isRTL ? 'المعدل الشهري' : 'Monthly Rate'}
                  </span>
                  <span className="text-3xl font-black text-white">
                    {baselineMonthly}
                  </span>
                </div>
              </div>
            </div>

            {/* Lost Reviews */}
            <div className="w-full md:w-96 bg-red-500/5 rounded-3xl p-8 border border-red-500/20 flex flex-col justify-center text-center space-y-4">
              <AlertTriangle className="text-red-500 mx-auto" size={40} />
              <h4 className="text-red-500 font-black text-sm uppercase tracking-widest">
                {isRTL
                  ? 'تقييمات تفقدها بسبب الأسلوب الحالي'
                  : 'Reviews Lost Due To Current Approach'}
              </h4>

              <div className="space-y-2">
                <div className="text-6xl font-black text-white leading-none">
                  -{lostDailyReviews}
                </div>
                <p className="text-red-400/80 text-xs font-bold uppercase tracking-widest">
                  {isRTL ? 'تقييم يوميًا' : 'per day'}
                </p>

                <div className="text-2xl font-black text-slate-200 mt-4">
                  -{lostWeeklyReviews}
                </div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  {isRTL ? 'تقييم أسبوعيًا' : 'per week'}
                </p>
              </div>

              <div className="pt-4 border-t border-red-500/10 text-slate-500 text-[11px] font-bold leading-relaxed">
                {isRTL
                  ? 'هذه الفجوة لا تختفي… بل تتحول تلقائيًا إلى مكسب مباشر للمنافسين.'
                  : 'This gap doesn’t vanish—it becomes direct competitor gain.'}
              </div>
            </div>
          </div>
        </div>

        {/* WITH SYSTEM (PRO) */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 p-10 md:p-16 rounded-[4rem] border-4 border-indigo-500/30 relative overflow-hidden shadow-indigo-500/20 shadow-2xl group">
          <div className="absolute top-0 right-0 p-8 text-indigo-500/10 group-hover:scale-110 transition-transform duration-700">
            <Rocket size={210} />
          </div>

          <div className="relative z-10 space-y-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-indigo-500/20 pb-10">
              <div className="space-y-5 text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <Zap className="text-indigo-400 fill-indigo-400" size={42} />
                  <h3 className="text-white font-black text-4xl md:text-5xl italic">
                    {isRTL
                      ? 'مع نظام Elegant Options PRO'
                      : 'With Elegant Options PRO'}
                  </h3>
                </div>

                <p className="text-indigo-100 text-xl md:text-2xl font-black leading-relaxed max-w-3xl">
                  {isRTL
                    ? 'نطبق قاعدة الـ 10% الذهبية عبر نظام Elegant Options: تحويل جزء ثابت من عملائك اليوميين إلى مقيمين نشطين بشكل منتظم.'
                    : 'We apply the Golden 10% Rule with Elegant Options: converting a consistent share of daily customers into active reviewers.'}
                </p>

                <p className="text-slate-300 text-lg md:text-xl font-semibold leading-relaxed max-w-3xl">
                  {isRTL
                    ? 'الفكرة ليست فقط “زيادة تقييمات”… بل تثبيت مكانك في نتائج البحث، رفع الثقة، وتحويل الزوار إلى ولاء وربح متكرر.'
                    : 'It’s not just “more reviews”… it’s locking your search position, boosting trust, and turning visitors into repeat profit.'}
                </p>
              </div>

              <div className="bg-green-500 text-black px-8 py-3 rounded-full font-black text-xl shadow-xl shadow-green-500/20">
                +{percentageIncrease}%
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  label: isRTL ? 'اليومي بعد استخدام النظام' : 'Daily With The System',
                  value: `+${systemDailyPotential}`,
                  sub: isRTL ? 'تقييم / يوم' : 'reviews / day',
                },
                {
                  label: isRTL ? 'الأسبوعي بعد استخدام النظام' : 'Weekly With The System',
                  value: `+${systemWeekly}`,
                  sub: isRTL ? 'تقييم / أسبوع' : 'reviews / week',
                },
                {
                  label: isRTL ? 'الشهري بعد استخدام النظام' : 'Monthly With The System',
                  value: `+${systemMonthly}`,
                  sub: isRTL ? 'تقييم / شهر' : 'reviews / month',
                },
                {
                  label: isRTL ? 'رصيد سنوي إضافي' : 'Annual Review Asset',
                  value: `+${systemYearly.toLocaleString()}`,
                  sub: isRTL ? 'تقييم جديد سنويًا' : 'new reviews yearly',
                  color: 'text-green-400',
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-md p-7 rounded-3xl border border-white/10 text-center"
                >
                  <span className="text-indigo-300 text-[10px] uppercase font-black tracking-widest block mb-3">
                    {p.label}
                  </span>
                  <span className={`text-4xl font-black ${p.color || 'text-white'}`}>
                    {p.value}
                  </span>
                  <span className="text-slate-500 text-[10px] block mt-2 font-bold uppercase">
                    {p.sub}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-black/30 border border-white/10 rounded-3xl p-8">
              <p className="text-white text-xl md:text-2xl font-black leading-relaxed">
                {isRTL
                  ? 'كل يوم تتوقف فيه عن استخدام نظام Elegant Options… أنت تترك فرص تقييم “جاهزة” تضيع بلا رجعة.'
                  : 'Every day you stop using Elegant Options… you leave “ready-to-win” reviews on the table.'}
              </p>
              <p className="text-slate-400 text-base md:text-lg font-semibold mt-3 leading-relaxed">
                {isRTL
                  ? 'النتيجة: منافسون يظهرون قبلك، ثقة أقل، وزيارات أقل — بينما الحل هو تدفق تقييمات بشكل يومي ومستمر “يشاهده جوجل” يبني مصداقيتك أمام العملاء أولًا، ثم يدفع جوجل لرفعك تلقائيًا دون إعلانات إضافية..'
                  : 'Result: competitors rank above you, trust drops, visits drop — the fix is a consistent review flow Google rewards with visibility.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM FEATURES (ENHANCED UI + EFFECTS) */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* AI Smart Replies */}
        <div className="group relative rounded-[3.5rem] overflow-hidden">
          <div className="absolute inset-0 rounded-[3.5rem] p-[1px] bg-gradient-to-br from-indigo-500/40 via-slate-700/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,.18),transparent_55%),radial-gradient(circle_at_100%_30%,rgba(99,102,241,.12),transparent_40%)]" />
          <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-1000" />

          <div className="relative bg-slate-900/70 border border-slate-800/70 p-10 rounded-[3.5rem] space-y-7 shadow-2xl flex flex-col min-h-[520px] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_30px_120px_-25px_rgba(99,102,241,.35)] group-hover:border-indigo-500/30">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 blur-[90px] rounded-full" />

            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner ring-1 ring-white/10 group-hover:ring-indigo-400/30 transition-all">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-lg bg-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Bot size={36} className="relative group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <h4 className="text-2xl md:text-3xl font-black text-white italic tracking-tight">
              {isRTL ? 'ردود ذكية بالذكاء الاصطناعي' : 'AI Smart Replies'}
            </h4>

            <p className="text-slate-300 text-lg leading-relaxed font-semibold flex-1">
              {isRTL
                ? 'رد تلقائي احترافي على جميع التقييمات 24 ساعه لا يتوقف… يزيد الثقة، يرفع جودة الصفحة، ويمنح جوجل إشارات نشاط مستمرة تدعم ترتيبك.'
                : 'Professional auto-replies 24 hours non-stop… increase trust, improve profile quality, and feed Google continuous activity signals that support ranking.'}
            </p>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="relative text-slate-200 font-black text-sm">
                {isRTL
                  ? 'النتيجة: عميل يشعر بالاهتمام → تقييم أفضل → ظهور أعلى.'
                  : 'Result: customer feels cared for → better reviews → higher visibility.'}
              </p>
            </div>
          </div>
        </div>

        {/* Reputation Shield */}
        <div className="group relative rounded-[3.5rem] overflow-hidden">
          <div className="absolute inset-0 rounded-[3.5rem] p-[1px] bg-gradient-to-br from-orange-500/40 via-slate-700/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(249,115,22,.18),transparent_55%),radial-gradient(circle_at_100%_30%,rgba(249,115,22,.12),transparent_40%)]" />
          <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-1000" />

          <div className="relative bg-slate-900/70 border border-slate-800/70 p-10 rounded-[3.5rem] space-y-7 shadow-2xl flex flex-col min-h-[520px] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_30px_120px_-25px_rgba(249,115,22,.30)] group-hover:border-orange-500/30">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/10 blur-[90px] rounded-full" />

            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shadow-inner ring-1 ring-white/10 group-hover:ring-orange-400/30 transition-all">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-lg bg-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShieldCheck size={36} className="relative group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <h4 className="text-2xl md:text-3xl font-black text-white italic tracking-tight">
              {isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}
            </h4>

            <p className="text-slate-300 text-lg leading-relaxed font-semibold flex-1">
              {isRTL
                ? 'نظام يلتقط أي تقييم سلبي مبكرًا ويحوّله لمعالجة داخلية خاصة قبل أن يؤثر على قرار العملاء الجدد… ويحافظ على متوسط تقييمك قويًا.'
                : 'A system that catches negative feedback early, routes it privately for resolution before it impacts new customers—keeping your rating strong.'}
            </p>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="relative text-slate-200 font-black text-sm">
                {isRTL
                  ? 'النتيجة: ثقة أعلى + ضرر أقل + قرار شراء أسرع.'
                  : 'Result: higher trust + less damage + faster purchase decisions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery / Integrations Card (CHANGED behavior) */}
        <div className="group relative rounded-[3.5rem] overflow-hidden">
          <div className="absolute inset-0 rounded-[3.5rem] p-[1px] bg-gradient-to-br from-green-500/40 via-slate-700/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,.18),transparent_55%),radial-gradient(circle_at_100%_30%,rgba(34,197,94,.12),transparent_40%)]" />
          <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-1000" />

          <div className="relative bg-slate-900/70 border border-slate-800/70 p-10 rounded-[3.5rem] space-y-7 shadow-2xl flex flex-col min-h-[520px] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_30px_120px_-25px_rgba(34,197,94,.28)] group-hover:border-green-500/30">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-green-500/10 blur-[90px] rounded-full" />

            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 shadow-inner ring-1 ring-white/10 group-hover:ring-green-400/30 transition-all">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-lg bg-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Bike size={36} className="relative group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h4 className="text-2xl md:text-3xl font-black text-white italic tracking-tight">
                {isRTL
                  ? (isRestaurant ? 'دمج تطبيقات التوصيل' : 'ربط الأنظمة حسب نوع مشروعك')
                  : (isRestaurant ? 'Delivery Integration' : 'System Integrations For Your Business')}
              </h4>

              {!isRestaurant && (
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-black bg-white/5 border border-white/10 text-slate-200">
                  {isRTL ? 'قابل للتخصيص' : 'Customizable'}
                </span>
              )}
            </div>

            <p className="text-slate-300 text-lg leading-relaxed font-semibold flex-1">
              {isRTL ? (
                isRestaurant
                  ? 'ربط مباشر مع طلبات وكيتا؛ إرسال رسائل طلب تقييم تلقائية عبر واتساب فور استلام الطلب، مما يضاعف تقييماتك بشكل منتظم.'
                  : 'يمكننا ربط نظامك (مبيعات/حجوزات/فواتير/تطبيق/متجر) لإرسال طلب تقييم تلقائي في التوقيت المثالي حسب طبيعة مشروعك، بحيث تتحول كل عملية مكتملة إلى تقييم إيجابي يدعم ظهورك.'
              ) : (
                isRestaurant
                  ? 'Direct integration with delivery apps; automatic WhatsApp review requests after each order—boosting reviews consistently.'
                  : 'We can integrate your business systems (sales/bookings/invoices/app/store) to send smart review requests at the perfect moment—turning completed actions into reviews that boost visibility.'
              )}
            </p>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="relative text-slate-200 font-black text-sm">
                {isRTL
                  ? 'تطبيق آلية مراسلات بينك وبين عملائك لزيادة الولاء واكتساب عدد يومي من التقييمات الإيجابية التي ترفع من مستوى نشاطك وتزيد عملائك.'
                  : 'A customer messaging mechanism that builds loyalty and generates daily positive reviews—raising activity signals and bringing more customers.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUOTE + STRATEGIC RECOMMENDATION */}
      <div className="space-y-16 py-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto px-4">
          <QuoteIcon className="text-indigo-500/20" size={80} fill="currentColor" />
          <p className="text-slate-200 text-2xl md:text-4xl font-black italic leading-tight tracking-tight">
            {isRTL
              ? '"زيادة نجمة واحدة في التقييم تؤدي إلى زيادة في الإيرادات بنسبة 5% إلى 9%."'
              : '"A one-star increase in rating can lead to a 5%–9% increase in revenue."'}
          </p>
          <div className="w-20 h-1 bg-yellow-500/30 rounded-full" />
          <span className="text-yellow-500 font-black tracking-[0.4em] text-sm uppercase">
            Harvard Business School
          </span>
        </div>

        {/* (باقي الكود بدون تغيير) */}
        {/* ... أكمل كما كان لديك بعد هذا القسم ... */}
      </div>

      {/* FINAL CTA */}
      {/* ... أكمل كما كان لديك ... */}
    </div>
  );
};

export default ResultsDashboard;
