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

  // 2) rating breakdown (object {1:count,2:count,...} or array)
  const breakdownCandidates = [
    data?.ratingBreakdown,
    data?.starsBreakdown,
    data?.reviewBreakdown,
    data?.ratingHistogram,
  ].filter(Boolean);

  for (const b of breakdownCandidates) {
    // object style
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

    // array style
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

  // 3) Estimate using positive / negative / total counts (no "magic 4.5")
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

  // تقدير "نسبة عدم التشجيع" بناءً على انخفاض النجوم:
  // كل نزول 0.5 نجمة = +5% (سقف منطقي)
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

  // grounded profit story
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
  // 5) MARKET STATUS
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
          ? 'أنت موجود… لكن المنافسون يرفعون حضورهم بالأتمتة ويبتلعون حصتك تدريجيًا.'
          : 'You are present… but competitors use automation to slowly take your market share.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-500/30',
        icon: Target,
      };
    }
    return {
      id: 'strong',
      title: isRTL ? 'رائد يحتاج أتمتة' : 'Market Leader Needs Automation',
      desc: isRTL
        ? 'أداء ممتاز… لكن الحفاظ على القمة أصعب من الوصول إليها. أي ثغرة سيستغلها المنافسون.'
        : 'Great performance… but staying on top is harder than reaching it. Competitors exploit any gap.',
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
  // 7) MANUAL MESSAGE
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
        ? 'أداؤك قوي… لكن القمة تحتاج أتمتة'
        : 'You’re strong… but the top needs automation'
      : status.id === 'average'
      ? isRTL
        ? 'أنت مهدد… المنافسون يسبقونك بالأتمتة'
        : 'You’re at risk… competitors outrun you with automation'
      : isRTL
      ? 'أنت غير مرئي… وتخسر فرصًا يوميًا'
      : 'You’re invisible… losing opportunities daily';

  const manualBody =
    status.id === 'strong'
      ? isRTL
        ? 'التقييمات الحالية جيدة، لكن الاعتماد على الأسلوب الحالي يجعل الحفاظ على القمة مرهقًا ومعرضًا للتراجع… لأن المنافسين يزيدون النشاط تلقائيًا كل يوم.'
        : 'Your reviews are good, but manual effort makes staying on top exhausting and vulnerable—competitors grow automatically every day.'
      : status.id === 'average'
      ? isRTL
        ? 'أنت موجود، لكن ضعف الاستمرارية يمنح المنافسين مساحة لسرقة حصتك. بدون أتمتة، نموك سيبقى أبطأ من السوق.'
        : 'You exist, but inconsistency gives competitors room to take your share. Without automation, your growth stays slower than the market.'
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

            {/* ✅ Rating badge (no default) */}
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
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    {ratingInfo.source === 'direct'
                      ? isRTL
                        ? 'مصدر: حقل مباشر'
                        : 'Source: direct'
                      : ratingInfo.source === 'breakdown'
                      ? isRTL
                        ? 'مصدر: توزيع النجوم'
                        : 'Source: breakdown'
                      : isRTL
                      ? 'مصدر: تقدير من الإيجابي/السلبي'
                      : 'Source: estimated'}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                  <Star className="text-slate-400" size={18} />
                  <span className="text-slate-200 font-black">
                    {isRTL
                      ? 'التقييم النجمي غير متاح من البيانات الحالية'
                      : 'Star rating not available in current data'}
                  </span>
                </div>
              )}
            </div>

            {/* ✅ Negative rating impact */}
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
                    ? 'نطبق قاعدة الـ 10% الذهبية: تحويل كل 10 عملاء على الاقل من أصل 100 يزورون مشروعك إلى مقيمين نشطين بشكل آلي بالكامل.'
                    : 'We apply the Golden 10% Rule: converting 10 out of every 100 daily visitors into active reviewers—fully automated.'}
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
                  label: isRTL ? 'اليومي بعد الأتمتة' : 'Daily After Automation',
                  value: `+${systemDailyPotential}`,
                  sub: isRTL ? 'تقييم / يوم' : 'reviews / day',
                },
                {
                  label: isRTL ? 'الأسبوعي بعد الأتمتة' : 'Weekly After Automation',
                  value: `+${systemWeekly}`,
                  sub: isRTL ? 'تقييم / أسبوع' : 'reviews / week',
                },
                {
                  label: isRTL ? 'الشهري بعد الأتمتة' : 'Monthly After Automation',
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
                  ? 'كل يوم تتوقف فيه الأتمتة… أنت تترك فرص تقييم “جاهزة” تضيع بلا رجعة.'
                  : 'Every day without automation… you leave “ready-to-win” reviews on the table.'}
              </p>
              <p className="text-slate-400 text-base md:text-lg font-semibold mt-3 leading-relaxed">
                {isRTL
                  ? 'النتيجة: منافسون يظهرون قبلك، ثقة أقل، وزيارات أقل — بينما الحل هو تدفق تقييمات بشكل يومي ومستمر  “يشاهده جوجل” يبني مصداقيتك أمام العملاء أولًا، ثم يدفع جوجل لرفعك تلقائيًا دون إعلانات إضافية..'
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

        {/* Delivery Integration */}
        <div className={`group relative rounded-[3.5rem] overflow-hidden ${!isRestaurant ? 'opacity-60 grayscale' : ''}`}>
          <div className="absolute inset-0 rounded-[3.5rem] p-[1px] bg-gradient-to-br from-green-500/40 via-slate-700/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,197,94,.18),transparent_55%),radial-gradient(circle_at_100%_30%,rgba(34,197,94,.12),transparent_40%)]" />
          <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-1000" />

          <div className={`relative bg-slate-900/70 border border-slate-800/70 p-10 rounded-[3.5rem] space-y-7 shadow-2xl flex flex-col min-h-[520px] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_30px_120px_-25px_rgba(34,197,94,.28)] group-hover:border-green-500/30 ${!isRestaurant ? 'pointer-events-none' : ''}`}>
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-green-500/10 blur-[90px] rounded-full" />

            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 shadow-inner ring-1 ring-white/10 group-hover:ring-green-400/30 transition-all">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-lg bg-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Bike size={36} className="relative group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h4 className="text-2xl md:text-3xl font-black text-white italic tracking-tight">
                {isRTL ? 'دمج تطبيقات التوصيل' : 'Delivery Integration'}
              </h4>

              {!isRestaurant && (
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-black bg-white/5 border border-white/10 text-slate-200">
                  {isRTL ? 'حصري للمطاعم' : 'Restaurants only'}
                </span>
              )}
            </div>

            <p className="text-slate-300 text-lg leading-relaxed font-semibold flex-1">
              {isRTL
                ? 'بعد كل طلب… نرسل رسالة طلب تقييم تلقائية عبر واتساب في التوقيت المثالي. هكذا تتحول “الطلبات الصامتة” إلى تقييمات إيجابية تدفع ظهورك للأعلى.'
                : 'After each order… an automatic WhatsApp review request is sent at the perfect moment. Silent orders turn into positive reviews that boost visibility.'}
            </p>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="relative text-slate-200 font-black text-sm">
                {isRTL
                  ? 'تطبيق مباشر لقاعدة 10%: تحويل جزء ثابت من عملائك اليوميين إلى تقييمات نشطة.'
                  : 'Direct application of the 10% rule: converting a consistent share of daily customers into active reviews.'}
              </p>
            </div>

            {!isRestaurant && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-6 py-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                  <p className="text-white font-black">
                    {isRTL ? 'هذه الميزة تُفعّل للمطاعم فقط' : 'This feature is enabled for restaurants only'}
                  </p>
                  <p className="text-slate-200/80 text-sm font-semibold mt-1">
                    {isRTL ? 'اختر نوع النشاط مطعم لتفعيلها' : 'Select “Restaurant” to unlock it'}
                  </p>
                </div>
              </div>
            )}
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

        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[4rem] p-12 md:p-16 relative overflow-hidden group shadow-2xl">
          <div className="absolute -top-12 -right-12 p-8 text-indigo-500/5 rotate-12 transition-transform group-hover:scale-110">
            <ShieldCheck size={300} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-5 text-indigo-400">
              <ShieldCheck size={48} />
              <h3 className="text-3xl md:text-4xl font-black italic">
                {isRTL ? 'التوصية الاستراتيجية النهائية' : 'Strategic Recommendation'}
              </h3>
            </div>

            <p className="text-slate-200 text-xl md:text-3xl leading-relaxed font-bold max-w-5xl">
              {isRTL
                ? `بناءً على تحليل بيانات (${data.projectName || 'مشروعك'})، التوصية واضحة: تفعيل نظام الأتمتة لحماية السمعة ورفع الظهور بشكل مستمر. الهدف ليس “زيادة تقييمات” فقط… بل تثبيت مركزك في البحث ومنع التسرب الصامت وتحويل العملاء إلى ولاء وربح متكرر.`
                : `Based on the analysis of (${data.projectName || 'your business'}), the recommendation is clear: activate automation to protect reputation and continuously boost visibility. The goal isn’t just “more reviews”—it’s locking your search position, preventing silent churn, and turning customers into repeat profit.`}
            </p>

            <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
              <p className="text-slate-300 text-base md:text-lg font-semibold leading-relaxed">
                {isRTL
                  ? `ما نقدّمه ليس أداة… بل نظام يضاعف كفاءتك ويختصر وقتك ويقودك لنمو حقيقي.

القيمة الحقيقية تكمن في الكفاءة، توفير الوقت، وبناء نمو طويل الأمد.).`
                  : 'If you want, you can watch a visual simulation showing the full journey (visit/order → review request → positive review → higher visibility → more customers).'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="text-center space-y-12 pt-10 border-t border-slate-800">
        <div className="space-y-6">
          <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter italic">
            {isRTL ? 'لا تكن خفيًا…' : "Don’t be invisible…"}
          </h2>

          <p className="text-indigo-400 text-xl md:text-2xl font-black leading-relaxed max-w-3xl mx-auto">
            {isRTL
              ? '⬇️ قبل الطلب… شاهد التجربة البصرية لتفهم كيف نحول 10% على الاقل من عملائك اليوميين إلى تقييمات ثابتة “تدفع ظهورك للأعلى” بشكل مستمر.'
              : '⬇️ Before ordering… watch the visual experience to see how we convert 10% of daily customers into consistent reviews that push your visibility up.'}
          </p>

          <p className="text-slate-500 text-sm md:text-base font-semibold max-w-3xl mx-auto">
            {isRTL
              ? 'كل تقييم غير مُدار قد يعني عميلًا فقدته للأبد — بينما النظام يجعل الثقة تتجدد كل يوم.'
              : 'Every unmanaged review can be a customer lost forever—automation makes trust renew daily.'}
          </p>
        </div>

        <div className="flex flex-col gap-8 justify-center items-center">
          <button
            onClick={onVisualExp}
            className="w-full md:w-auto px-16 py-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-2xl md:text-3xl rounded-[3rem] shadow-2xl transform hover:-translate-y-2 transition-all flex items-center justify-center gap-5 group"
          >
            <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
            {isRTL ? 'ابدأ التجربة البصرية' : 'Start Visual Experience'}
          </button>

          <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-16 py-10 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-3xl rounded-[3rem] shadow-2xl shadow-green-500/40 transform hover:-translate-y-2 transition-all flex items-center justify-center gap-6 group"
            >
              <MessageCircle className="w-10 h-10 group-hover:scale-110 transition-transform" />
              {isRTL ? 'اطلب النظام الآن' : 'Order System Now'}
            </a>

            <button
              onClick={onReset}
              className="w-full md:w-auto px-12 py-10 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-2xl rounded-[3rem] border border-slate-700 transition-all flex items-center justify-center gap-5 group"
            >
              <RotateCw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
              {isRTL ? 'تحليل نشاط آخر' : 'Analyze Another'}
            </button>
          </div>

          {/* Optional: small footer note for rating confidence */}
          <div className="text-slate-600 text-xs font-bold pt-4">
            {rating === null
              ? isRTL
                ? 'ملاحظة: لم يتم توفير تقييم النجوم ضمن البيانات المدخلة.'
                : 'Note: star rating was not provided in input data.'
              : isRTL
              ? `ملاحظة: تم استخراج التقييم (${rating.toFixed(1)}/5) — دقة: ${ratingInfo.confidence}.`
              : `Note: rating extracted (${rating.toFixed(1)}/5) — confidence: ${ratingInfo.confidence}.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
