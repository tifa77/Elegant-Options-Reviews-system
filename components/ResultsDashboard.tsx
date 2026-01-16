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
  Globe,
  Bot,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
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

  // =======================
  // 1. محرك الأمان والحسابات
  // =======================

  const currentYear = new Date().getFullYear();
  const rawEstablishedYear = Number(
    (data as any).establishmentYear ?? (data as any).establishedYear
  );

  const ageYears =
    Number.isFinite(rawEstablishedYear) &&
    rawEstablishedYear > 1900 &&
    rawEstablishedYear <= currentYear
      ? Math.max(1, currentYear - rawEstablishedYear)
      : 1;

  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;

  // معدل التقييم السنوي خلال فترة النشاط
  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;

  const getRegionalData = () => {
    const address = (data.address || '').toLowerCase();
    const isKuwait = address.includes('kuwait') || address.includes('الكويت');
    return isKuwait
      ? { symbol: isRTL ? 'د.ك' : 'KWD', ticket: 20 }
      : { symbol: isRTL ? 'دولار' : 'USD', ticket: 60 };
  };

  const regional = getRegionalData();
  const currency = regional.symbol;

  const currentWeekly = Number(data.weeklyGrowth) || 0;
  const currentMonthly = Number(data.monthlyGrowth) || 0;

  const multiplier = isRestaurant ? 10 : 6;

  const projectedWeeklyRaw = currentWeekly * multiplier || 8;
  const projectedMonthly = Math.max(35, currentMonthly * multiplier || 35);
  const projectedYearlyReviews = projectedMonthly * 12;
  const baseYearlyReviews = currentMonthly * 12;

  const percentageIncrease =
    baseYearlyReviews > 0
      ? Math.round(
          ((projectedYearlyReviews - baseYearlyReviews) / baseYearlyReviews) *
            100
        )
      : 100;

  // --- أرقام مبنية على حركة العملاء اليومية ---
  const systemDailyPotential = Math.round(dailyCustomers * 0.1); // 10% من حركة اليوم يمكن تحويلها لطلبات تقييم
  const annualAdditionalReviews = systemDailyPotential * 365;

  // معدل أسبوعي أساسي من التقييمات الحالية
  const baselineWeekly =
    Number((avgReviewsPerYear / 52).toFixed(1)) /* قد يكون 0 في البدايات */ || 0;

  // زيادة أسبوعية مغرية متولدة من النظام (لكن ليست خيالية)
  const extraWeeklyFromSystem = Math.max(
    3, // حد أدنى مغرٍ
    Math.round(systemDailyPotential * 0.6) // 60% من فرص اليوم تتحول لتقييمات أسبوعية
  );

  // هذا هو الرقم الذي يظهر في بطاقة "المعدل الإضافي المتوقع"
  const projectedWeeklyExtra = extraWeeklyFromSystem;

  // --- نزيف العملاء والإيرادات (بدون نظام) ---
  const customerLossMultiplier = 4;
  const lostCustomersCount = Math.max(
    0,
    (projectedYearlyReviews - baseYearlyReviews) * customerLossMultiplier
  );
  const lostRevenue = lostCustomersCount * regional.ticket;

  // --- نموذج أرباح إضافية واقعي لكن محفّز ---
  const loyaltyConversionRate = 0.35; // 35% من التقييمات الإضافية تتحول لعملاء أوفياء
  const visitsPerLoyalClientPerYear = 3; // كل عميل وفيّ يكرر الشراء 3 مرات بالسنة

  const additionalLoyalClients = Math.round(
    annualAdditionalReviews * loyaltyConversionRate
  );

  const dynamicProfitValue =
    annualAdditionalReviews *
    loyaltyConversionRate *
    visitsPerLoyalClientPerYear *
    regional.ticket;

  const dynamicProfit = Number.isFinite(dynamicProfitValue)
    ? Math.round(dynamicProfitValue).toLocaleString()
    : '0';

  // =======================
  // 2. التشخيص السوقي الواقعي
  // =======================

  const getMarketStatus = () => {
    const incentive = isRTL
      ? '⚠️ تنبيه: المنافسون في منطقتك يكثفون نشاطهم الآن لتجاوز تصنيفك.'
      : '⚠️ Alert: Competitors are intensifying their activity to overtake you.';

    if (avgReviewsPerYear < 15) {
      return {
        key: 'ghost',
        title: isRTL ? 'شبح رقمي - مخفي' : 'Digital Ghost',
        desc: isRTL
          ? 'أنت غير مرئي للعملاء الجدد. محركات البحث تتجاهل نشاطك بسبب ضعف التفاعل الحقيقي.'
          : 'Invisible to new customers. Search engines ignore you due to low engagement.',
        color: 'text-red-500',
        bg: 'bg-red-900/20',
        border: 'border-red-500/30',
        icon: Ghost,
        incentive,
      };
    } else if (avgReviewsPerYear < 80) {
      return {
        key: 'average',
        title: isRTL ? 'تواجد متوسط - مهدد' : 'Average Presence',
        desc: isRTL
          ? 'أنت موجود ولكنك مهدد. المنافسون يبتلعون حصتك السوقية تدريجياً لأنهم أكثر نشاطاً منك.'
          : 'You are present but at risk. Competitors are eating your market share.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-500/30',
        icon: Target,
        incentive,
      };
    }
    return {
      key: 'strong',
      title: isRTL ? 'متواجد بقوة' : 'Strong Presence',
      desc: isRTL
        ? 'أداء ممتاز، ولكن الحفاظ على القمة أصعب من الوصول إليها. المنافسون يتربصون بك.'
        : 'Good performance, but staying on top is harder. Competitors are watching.',
      color: 'text-green-500',
      bg: 'bg-green-900/20',
      border: 'border-green-500/30',
      icon: Crown,
      incentive,
    };
  };

  const status = getMarketStatus();

  const waNumber = '96566305551';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    isRTL
      ? `أريد تفعيل نظام النمو وإيقاف خسارة العملاء لمشروعي (${data.projectName})`
      : `I want to activate growth for (${data.projectName})`
  )}`;

  // =======================
  // 2.1 أرقام الواقع الحالي (بدون NaN)
  // =======================

  const safeBaselineWeekly = Number.isFinite(baselineWeekly) ? baselineWeekly : 0;

  const baselineDaily = Number(((safeBaselineWeekly || 0) / 7).toFixed(1)) || 0;

  const baselineMonthlyFromWeekly =
    Number(((safeBaselineWeekly || 0) * 4.3).toFixed(1)) || 0;

  const baselineMonthly =
    Number.isFinite(currentMonthly) && currentMonthly > 0
      ? Number(currentMonthly.toFixed(1))
      : baselineMonthlyFromWeekly;

  const systemWeekly = Math.max(0, systemDailyPotential * 7);
  const systemMonthly = Math.max(0, systemDailyPotential * 30);
  const systemYearly = Math.max(0, systemDailyPotential * 365);

  const lostReviewsPerDayRaw = Math.max(0, systemDailyPotential - baselineDaily);
  const lostReviewsPerDay =
    lostReviewsPerDayRaw === 0 ? 0 : Number(lostReviewsPerDayRaw.toFixed(1));

  const lostReviewsPerWeekRaw = Math.max(0, systemWeekly - safeBaselineWeekly);
  const lostReviewsPerWeek =
    lostReviewsPerWeekRaw === 0 ? 0 : Number(lostReviewsPerWeekRaw.toFixed(1));

  // Manual card theme must match diagnosis
  const manualTheme =
    status.key === 'strong'
      ? {
          icon: TrendingUp,
          accent: 'text-green-400',
          border: 'border-green-500/20',
          headerBg: 'bg-green-500/10',
          title: isRTL ? 'الوضع اليدوي الحالي' : 'Manual Status',
          headline: isRTL
            ? 'أنت قوي الآن… لكن الاستمرار بنفس الأسلوب قد يُسقطك تدريجياً.'
            : "You're strong now… but keeping the same approach can slowly drop you.",
          note: isRTL
            ? 'حتى وأنت في القمة، المنافسون يكسبون تقييمات أسرع منك ويزاحمونك على النتائج.'
            : 'Even at the top, competitors can outpace you in reviews and push you down.',
        }
      : status.key === 'average'
      ? {
          icon: AlertTriangle,
          accent: 'text-yellow-400',
          border: 'border-yellow-500/20',
          headerBg: 'bg-yellow-500/10',
          title: isRTL ? 'الوضع اليدوي الحالي' : 'Manual Status',
          headline: isRTL
            ? 'تواجدك موجود… لكنه مهدد فعلياً إذا استمر نفس الأسلوب.'
            : 'You are present… but truly at risk if you keep the same approach.',
          note: isRTL
            ? 'نشاط المنافسين أعلى، وهذا يترجم مباشرة إلى ثقة أكبر وظهور أعلى.'
            : 'Competitors are more active, translating directly into higher trust and visibility.',
        }
      : {
          icon: TrendingDown,
          accent: 'text-red-400',
          border: 'border-red-500/20',
          headerBg: 'bg-red-500/10',
          title: isRTL ? 'الوضع اليدوي الحالي' : 'Manual Status',
          headline: isRTL
            ? 'أنت غير مرئي للعملاء الجدد… وهذا يعني خسائر يومية صامتة.'
            : 'You are invisible to new customers… which means silent daily losses.',
          note: isRTL
            ? 'بدون تدفق تقييمات مستمر، محركات البحث لا تمنحك فرصة حقيقية للظهور.'
            : 'Without a steady review flow, search engines won’t give you real visibility.',
        };

  const ManualIcon = manualTheme.icon;

  // =======================
  // 3. واجهة التقرير (Landing Style)
  // =======================

  return (
    <div
      className={`max-w-5xl mx-auto space-y-16 animate-fade-in pb-32 ${
        isRTL ? 'font-tajawal text-right' : 'font-sans text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-4 text-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span className="font-bold text-sm uppercase tracking-wider">
            {t.back}
          </span>
        </button>
        <span className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
          Growth Intelligence
        </span>
      </div>

      {/* Hero Section */}
      <div
        className={`p-10 md:p-14 rounded-[3rem] border ${status.border} ${status.bg} backdrop-blur-md relative overflow-hidden group shadow-2xl`}
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <status.icon size={250} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div
            className={`p-8 rounded-full bg-slate-950 shadow-2xl ${status.color} border border-white/5`}
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
            <p className="text-slate-200 text-lg md:text-xl font-bold leading-relaxed">
              {status.desc}
            </p>
            <div className="inline-flex p-4 bg-black/60 rounded-2xl border border-orange-500/20 text-orange-400 text-md font-black animate-pulse uppercase tracking-widest">
              {status.incentive}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: isRTL ? 'عمر النشاط' : 'Age',
            value: ageYears,
            sub: isRTL ? 'سنوات' : 'Years',
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
            className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 text-center group hover:border-indigo-500/30 transition-all"
          >
            <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest block mb-3">
              {m.label}
            </span>
            <span className={`text-4xl font-black text-white ${m.color || ''}`}>
              {m.value}
            </span>
            <span className="text-[10px] text-slate-500 font-bold mt-2 block uppercase">
              {m.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Comparison Section (UPDATED: vertical, consistent with diagnosis) */}
      <div className="space-y-8 text-white">
        {/* Manual block (top) */}
        <div
          className={`bg-slate-900/80 p-10 md:p-12 rounded-[3.25rem] border ${manualTheme.border} relative overflow-hidden shadow-2xl`}
        >
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
            <div className={`p-3 rounded-2xl ${manualTheme.headerBg}`}>
              <ManualIcon className={`${manualTheme.accent}`} size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-slate-200 font-black text-xl md:text-2xl uppercase tracking-tighter">
                {manualTheme.title}
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                {isRTL
                  ? 'واقعك الحالي مرتبط بالتشخيص السوقي أعلاه'
                  : 'Your current reality is directly tied to the diagnosis above'}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {manualTheme.headline}
              </h4>
              <p className="text-slate-300 text-lg md:text-xl font-bold leading-relaxed">
                {status.desc}
              </p>
              <p className="text-slate-400 text-sm md:text-base font-semibold leading-relaxed">
                {manualTheme.note}
              </p>
            </div>

            {/* Current reality numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/30 border border-slate-800 rounded-2xl p-6">
                <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                  {isRTL ? 'المعدل اليومي الحالي' : 'Current Daily Rate'}
                </div>
                <div className="mt-3 text-4xl font-black text-white">
                  {baselineDaily}
                </div>
                <div className="mt-2 text-slate-500 text-[10px] font-bold uppercase">
                  {isRTL ? 'تقييم / يوم' : 'reviews / day'}
                </div>
              </div>

              <div className="bg-slate-950/30 border border-slate-800 rounded-2xl p-6">
                <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                  {isRTL ? 'المعدل الأسبوعي الحالي' : 'Current Weekly Rate'}
                </div>
                <div className="mt-3 text-4xl font-black text-white">
                  {safeBaselineWeekly}
                </div>
                <div className="mt-2 text-slate-500 text-[10px] font-bold uppercase">
                  {isRTL ? 'تقييم / أسبوع' : 'reviews / week'}
                </div>
              </div>

              <div className="bg-slate-950/30 border border-slate-800 rounded-2xl p-6">
                <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
                  {isRTL ? 'المعدل الشهري الحالي' : 'Current Monthly Rate'}
                </div>
                <div className="mt-3 text-4xl font-black text-white">
                  {baselineMonthly}
                </div>
                <div className="mt-2 text-slate-500 text-[10px] font-bold uppercase">
                  {isRTL ? 'تقييم / شهر' : 'reviews / month'}
                </div>
              </div>
            </div>

            {/* Lost reviews metric */}
            <div className="bg-black/40 border border-orange-500/20 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-orange-400 text-xs font-black uppercase tracking-widest">
                    {isRTL ? 'نزيف التقييمات اليومي' : 'Daily Review Leakage'}
                  </div>
                  <p className="text-slate-300 text-sm md:text-base font-semibold mt-2 leading-relaxed">
                    {isRTL
                      ? 'هذا هو الفرق بين وضعك الحالي وبين المستوى المتوقع عند تحويل 10% من عملائك اليوميين إلى تقييمات.'
                      : 'This is the gap between your current flow and what you could reach by converting 10% of daily customers into reviews.'}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-5xl font-black text-orange-400">
                    {lostReviewsPerDay}
                  </div>
                  <div className="text-orange-300 text-[10px] font-black uppercase tracking-widest mt-1">
                    {isRTL ? 'تقييم تخسره يومياً' : 'reviews lost / day'}
                  </div>
                  <div className="text-slate-500 text-xs font-bold mt-2">
                    {isRTL
                      ? `≈ ${lostReviewsPerWeek} أسبوعياً`
                      : `≈ ${lostReviewsPerWeek} per week`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* With Elegant Options PRO block (full width, bigger & persuasive) */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 p-12 md:p-14 rounded-[3.25rem] border-2 border-indigo-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 text-indigo-500/10">
            <Rocket size={140} />
          </div>

          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/10">
                <Zap className="text-indigo-400 fill-indigo-400" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter">
                  With Elegant Options PRO
                </h3>
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">
                  {isRTL
                    ? 'تحويل 10% من عملائك اليوميين إلى تقييمات تلقائياً'
                    : 'Convert 10% of daily customers into reviews—automatically'}
                </p>
              </div>
              <div className="bg-green-500 text-black px-4 py-2 rounded-full font-black text-sm md:text-base">
                +{percentageIncrease}%
              </div>
            </div>

            <div className="space-y-5">
              <h4 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {isRTL
                  ? 'بدلاً من انتظار التقييمات… اجعلها تأتيك يومياً وبشكل ثابت.'
                  : 'Stop waiting for reviews—make them arrive daily, consistently.'}
              </h4>
              <p className="text-indigo-200 text-lg md:text-xl font-semibold leading-relaxed">
                {isRTL
                  ? `إذا كان عندك ${dailyCustomers.toLocaleString()} عميل يومياً، فالنظام يستطيع (بشكل واقعي) تحويل 10% منهم إلى تقييمات عبر أتمتة طلب التقييم بعد الخدمة أو الطلب.`
                  : `If you have ${dailyCustomers.toLocaleString()} customers per day, the system can realistically convert 10% into reviews by automating review requests after service/order completion.`}
              </p>
              <p className="text-slate-300 text-sm md:text-base font-semibold leading-relaxed">
                {isRTL
                  ? 'النتيجة: تدفق تقييمات يُغذي الثقة، يرفع الظهور، ويمنع خسارة الولاء بصمت.'
                  : 'Result: a review flow that boosts trust, improves visibility, and prevents silent loyalty loss.'}
              </p>
            </div>

            {/* Derived numbers (daily/weekly/monthly/yearly) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 text-center">
                <div className="text-indigo-300 text-[10px] uppercase font-black tracking-widest">
                  {isRTL ? 'تقييمات يومية متوقعة' : 'Projected Daily'}
                </div>
                <div className="mt-3 text-5xl font-black text-white">
                  {systemDailyPotential}
                </div>
                <div className="mt-2 text-slate-400 text-[10px] font-bold uppercase">
                  {isRTL ? 'تقييم / يوم' : 'reviews / day'}
                </div>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 text-center">
                <div className="text-indigo-300 text-[10px] uppercase font-black tracking-widest">
                  {isRTL ? 'أسبوعياً' : 'Weekly'}
                </div>
                <div className="mt-3 text-5xl font-black text-white">
                  {systemWeekly.toLocaleString()}
                </div>
                <div className="mt-2 text-slate-400 text-[10px] font-bold uppercase">
                  {isRTL ? 'تقييم / أسبوع' : 'reviews / week'}
                </div>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 text-center">
                <div className="text-indigo-300 text-[10px] uppercase font-black tracking-widest">
                  {isRTL ? 'شهرياً' : 'Monthly'}
                </div>
                <div className="mt-3 text-5xl font-black text-white">
                  {systemMonthly.toLocaleString()}
                </div>
                <div className="mt-2 text-slate-400 text-[10px] font-bold uppercase">
                  {isRTL ? 'تقييم / شهر' : 'reviews / month'}
                </div>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 text-center">
                <div className="text-indigo-300 text-[10px] uppercase font-black tracking-widest">
                  {isRTL ? 'سنوياً' : 'Yearly'}
                </div>
                <div className="mt-3 text-5xl font-black text-white">
                  {systemYearly.toLocaleString()}
                </div>
                <div className="mt-2 text-slate-400 text-[10px] font-bold uppercase">
                  {isRTL ? 'تقييم / سنة' : 'reviews / year'}
                </div>
              </div>
            </div>

            {/* Lost reviews repeated (optional echo) */}
            <div className="bg-black/35 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-slate-300 font-semibold leading-relaxed">
                  {isRTL
                    ? 'الفرق الذي تستعيده يومياً عند تشغيل النظام:'
                    : 'The gap you recover daily by activating the system:'}
                </div>
                <div className="text-center md:text-left">
                  <div className="text-5xl font-black text-emerald-400">
                    +{lostReviewsPerDay}
                  </div>
                  <div className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mt-1">
                    {isRTL ? 'تقييم إضافي / يوم' : 'extra reviews / day'}
                  </div>
                </div>
              </div>
            </div>

            {/* Extra weekly from system (existing logic, kept) */}
            <div className="pt-2">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                <div>
                  <div className="text-indigo-200 text-sm font-bold uppercase">
                    {isRTL ? 'المعدل الإضافي المتوقع أسبوعياً' : 'Projected Extra Weekly'}
                  </div>
                  <div className="text-slate-400 text-xs font-semibold mt-2">
                    {isRTL
                      ? 'هذا الرقم مبني على فرص التقييم الناتجة من حركة العملاء اليومية، وليس رقمًا عشوائياً.'
                      : 'This number is derived from daily customer flow opportunities—not a random estimate.'}
                  </div>
                </div>
                <div className="text-6xl font-black text-indigo-400">
                  +{projectedWeeklyExtra}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADDITION: Landing narrative section (before System Features) */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[3.25rem] p-10 md:p-12 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800">
            <ShieldCheck className="text-indigo-400" size={28} />
          </div>
          <div>
            <h3 className="text-white font-black text-2xl md:text-3xl tracking-tight">
              {isRTL ? 'كيف تغيّر الأتمتة مستوى مشروعك؟' : 'How Automation Upgrades Your Business'}
            </h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              {isRTL
                ? 'تحويل التقييمات إلى ثقة ثم إلى عملاء أوفياء'
                : 'Turning reviews into trust, then into loyal customers'}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-slate-300 text-lg md:text-xl font-semibold leading-relaxed">
            {isRTL
              ? 'عند تشغيل الأتمتة، لا تصبح التقييمات “حدثاً عشوائياً”… بل تصبح نظاماً يومياً ثابتاً يرفع ظهورك ويمنع خسارة ولاء العملاء بصمت.'
              : 'When automation is activated, reviews stop being “random events”—they become a steady daily system that boosts visibility and prevents silent loyalty loss.'}
          </p>
          <p className="text-slate-400 text-sm md:text-base font-semibold leading-relaxed">
            {isRTL
              ? 'كل تقييم جديد يضيف طبقة ثقة، وكل طبقة ثقة ترفع قرار الشراء بدون أن تدفع إعلانات إضافية. وهذا ينعكس على الأرباح لأن العملاء يعودون أكثر من مرة.'
              : 'Every new review adds a layer of trust. Each layer increases purchase decisions without extra ad spend—reflecting directly on profits as customers return more often.'}
          </p>
          <p className="text-slate-400 text-sm md:text-base font-semibold leading-relaxed">
            {isRTL
              ? 'الأهم: بدل أن يسبقك المنافسون بعدد تقييمات أكبر، يصبح لديك تدفق أعلى يدعم مركزك في النتائج ويحمي حصتك السوقية.'
              : 'Most importantly: instead of competitors outrunning you with higher review volume, you get a stronger flow that supports ranking and protects market share.'}
          </p>

          <ul className="grid md:grid-cols-3 gap-4 pt-4">
            <li className="bg-slate-950/30 border border-slate-800 rounded-2xl p-6">
              <div className="text-indigo-400 text-xs font-black uppercase tracking-widest">
                {isRTL ? 'أتمتة طلب التقييم' : 'Automated Review Requests'}
              </div>
              <div className="text-slate-300 text-sm font-semibold mt-3 leading-relaxed">
                {isRTL
                  ? 'رسائل ذكية بعد الخدمة/الطلب لرفع معدل التقييمات يومياً.'
                  : 'Smart post-service/order prompts that raise daily review flow.'}
              </div>
            </li>

            <li className="bg-slate-950/30 border border-slate-800 rounded-2xl p-6">
              <div className="text-indigo-400 text-xs font-black uppercase tracking-widest">
                {isRTL ? 'ثقة أعلى + ظهور أقوى' : 'Higher Trust + Visibility'}
              </div>
              <div className="text-slate-300 text-sm font-semibold mt-3 leading-relaxed">
                {isRTL
                  ? 'التقييمات المتكررة ترفع ترتيبك وتزيد النقرات والاتصالات.'
                  : 'Consistent reviews improve ranking and increase clicks & calls.'}
              </div>
            </li>

            <li className="bg-slate-950/30 border border-slate-800 rounded-2xl p-6">
              <div className="text-indigo-400 text-xs font-black uppercase tracking-widest">
                {isRTL ? 'ولاء يمنع التسرب الصامت' : 'Loyalty Prevents Silent Churn'}
              </div>
              <div className="text-slate-300 text-sm font-semibold mt-3 leading-relaxed">
                {isRTL
                  ? 'تحويل العملاء الراضين إلى عملاء أوفياء يعودون مراراً.'
                  : 'Turn satisfied customers into loyal repeat buyers.'}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* System Features (UNCHANGED content; kept) */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] space-y-8 hover:border-indigo-500/30 transition-all flex flex-col shadow-2xl">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
            <Bot size={40} />
          </div>
          <h4 className="text-2xl font-black text-white italic tracking-tight">
            AI Smart Replies
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed flex-1">
            رد آلي وذكي على كافة التقييمات في Google Maps على مدار 24 ساعة، مما
            يحسن السيو ويُشعر العميل بالاهتمام الفوري.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] space-y-8 hover:border-orange-500/30 transition-all flex flex-col shadow-2xl">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shrink-0">
            <ShieldCheck size={40} />
          </div>
          <h4 className="text-2xl font-black text-white italic tracking-tight">
            Reputation Shield
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed flex-1">
            فلترة ذكية تمنع ظهور أي تقييم (3 نجوم أو أقل) علناً، وتحويله فوراً
            لرسالة خاصة للإدارة لمعالجة المشكلة بخصوصية تامة.
          </p>
        </div>

        <div
          className={`bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] space-y-8 hover:border-green-500/30 transition-all flex flex-col shadow-2xl ${
            !isRestaurant && 'opacity-50 grayscale'
          }`}
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 shrink-0">
            <Bike size={40} />
          </div>
          <h4 className="text-2xl font-black text-white italic tracking-tight">
            Delivery Integration
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed flex-1">
            ربط مباشر مع طلبات وكيتا؛ إرسال رسائل طلب تقييم تلقائية عبر واتساب
            فور استلام الطلب، مما يضاعف تقييماتك آلياً.
          </p>
        </div>
      </div>

      {/* Dynamic Profit Section (UNCHANGED logic; kept) */}
      <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[4rem] p-12 md:p-16 relative overflow-hidden shadow-3xl">
        <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8 text-white">
            <div className="inline-flex items-center gap-3 bg-indigo-500/10 text-indigo-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20">
              <Rocket className="w-4 h-4 animate-bounce" />
              {isRTL ? 'فرصة نمو استثنائية' : 'Growth Opportunity'}
            </div>
            <h4 className="text-4xl md:text-5xl font-black italic">
              {isRTL ? 'أرباح إضافية بانتظار تفعيلها' : 'Hidden Profits Waiting'}
            </h4>
            <p className="text-slate-400 text-xl font-medium leading-relaxed italic border-l-4 border-indigo-500/30 pl-8">
              {(t.dashboard?.marketing?.persuasive ||
                'Elegant Options protects your loyalty and prevents silent churn.') +
                (isRTL
                  ? ' كل تقييم إيجابي يمكن أن يتحول إلى عميل وفيّ يزورك أكثر من مرة في السنة بدلاً من أن يمر مرور الكرام.'
                  : ' Every positive review can turn into a loyal customer who comes back multiple times a year instead of a one-off visit.')}
            </p>
          </div>

          <div className="bg-slate-800/50 p-14 rounded-[3.5rem] border border-indigo-500/30 text-center shadow-3xl min-w-[340px] transform hover:scale-105 transition-transform backdrop-blur-xl relative">
            <Zap className="absolute -top-8 -right-8 w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
            <span className="text-slate-500 text-xs font-black uppercase tracking-widest block mb-6">
              {isRTL
                ? 'أرباح سنوية إضافية محتملة'
                : 'Potential Additional Annual Profit'}
            </span>
            <div className="flex flex-col items-center gap-4">
              <span className="text-8xl font-black text-white leading-none tracking-tighter drop-shadow-xl">
                {dynamicProfit}
              </span>
              <span className="text-2xl text-indigo-400 font-black uppercase tracking-[0.4em]">
                {currency}
              </span>
              <span className="text-xs text-slate-400 font-semibold mt-2">
                {isRTL
                  ? `تقريباً ${additionalLoyalClients.toLocaleString()} عميل وفيّ إضافي في السنة، ينفقون معك أكثر من مرة بلا أي حملات مدفوعة إضافية.`
                  : `Roughly ${additionalLoyalClients.toLocaleString()} extra loyal customers per year, spending with you multiple times without extra ad spend.`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (UNCHANGED) */}
      <div className="flex flex-col md:flex-row gap-8 justify-center pt-16">
        <button
          onClick={onVisualExp}
          className="px-16 py-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-3xl rounded-[3rem] shadow-2xl flex items-center justify-center gap-5 transition-all transform hover:-translate-y-1"
        >
          <Play size={32} fill="currentColor" />
          {isRTL ? 'تجربة بصرية' : 'Visual Experience'}
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-16 py-8 bg-green-500 hover:bg-green-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl flex items-center justify-center gap-6 transition-all animate-pulse transform hover:-translate-y-1"
        >
          <MessageCircle size={36} />
          {isRTL ? 'اطلب النظام الآن' : 'Order System'}
        </a>
      </div>

      <div className="text-center pt-10">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-4 text-slate-500 hover:text-white font-black text-2xl transition-all opacity-50 hover:opacity-100"
        >
          <RotateCw size={24} />
          {isRTL ? 'تحليل نشاط آخر' : 'Analyze Another'}
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
