// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import {
  TrendingUp,
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
  Award,
  CheckCircle,
  ShieldCheck,
  Quote as QuoteIcon,
  Globe,
  TrendingDown,
  Bot,
  Rocket,
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

  // =========================================================
  // 1) عمر النشاط: يعتمد على "عدد السنين في الفورم" أو "سنة تأسيس"
  // =========================================================
  const currentYear = new Date().getFullYear();
  const rawEstablished = Number(data.establishedYear);

  // إذا المستخدم أدخل "عدد سنوات" (مثل 16) نستخدمها مباشرة
  // وإذا أدخل "سنة" (مثل 2012) نحسب منها
  const computedAgeYears = (() => {
    if (!Number.isFinite(rawEstablished)) return 1;

    // treat as Year
    if (rawEstablished > 1900 && rawEstablished <= currentYear) {
      return Math.max(1, currentYear - rawEstablished);
    }

    // treat as Age (years)
    if (rawEstablished > 0 && rawEstablished <= 120) {
      return Math.max(1, Math.floor(rawEstablished));
    }

    return 1;
  })();

  const ageYears = computedAgeYears;

  // =========================================================
  // 2) Baseline metrics (بدون NaN)
  // =========================================================
  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;

  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;

  const baselineWeekly =
    Number(data.weeklyGrowth) ||
    Number((avgReviewsPerYear / 52).toFixed(1)) ||
    0;

  const baselineDaily = Number((baselineWeekly / 7).toFixed(1)) || 0;

  const baselineMonthly =
    Number(data.monthlyGrowth) ||
    Number((baselineWeekly * 4.3).toFixed(1)) ||
    0;

  // =========================================================
  // 3) نظام Elegant Options PRO (قاعدة 10%)
  // =========================================================
  const systemDailyPotential = Math.max(0, Math.round(dailyCustomers * 0.1)); // 10%
  const systemWeekly = Math.max(0, systemDailyPotential * 7);
  const systemMonthly = Math.max(0, systemDailyPotential * 30);
  const systemYearly = Math.max(0, systemDailyPotential * 365);

  // فرق التقييمات الحقيقي (للنزيف/الفرص)
  const baselineYearly = Math.max(0, baselineDaily * 365);
  const additionalYearly = Math.max(0, systemYearly - baselineYearly);

  const lostDailyReviewsRaw = Math.max(0, systemDailyPotential - baselineDaily);
  const lostWeeklyReviewsRaw = Math.max(0, systemWeekly - baselineWeekly);

  const lostDailyReviews =
    lostDailyReviewsRaw === 0 ? 0 : Number(lostDailyReviewsRaw.toFixed(1));
  const lostWeeklyReviews =
    lostWeeklyReviewsRaw === 0 ? 0 : Number(lostWeeklyReviewsRaw.toFixed(1));

  // =========================================================
  // 4) عملة/تذكرة حسب المنطقة
  // =========================================================
  const getRegionalData = () => {
    const address = (data.address || '').toLowerCase();
    const isKuwait = address.includes('kuwait') || address.includes('الكويت');
    return isKuwait
      ? { symbol: isRTL ? 'د.ك' : 'KWD', ticket: 20 }
      : { symbol: isRTL ? 'دولار' : 'USD', ticket: 60 };
  };
  const regional = getRegionalData();
  const currency = regional.symbol;

  // =========================================================
  // 5) نزيف الإيرادات السنوي (تم تخفيفه لمنطق واقعي مثل السابق)
  // =========================================================
  // نفترض أن كل تقييم إضافي يمثل "فرصة عميل" أو يحرك ثقة تؤدي لزيارات
  // customerLossMultiplier يترجم فجوة التقييمات إلى خسارة عملاء محتملة
  const customerLossMultiplier = 2.5; // أخف من السابق لتجنب المبالغة
  const lostCustomersCount = Math.max(
    0,
    Math.round(additionalYearly * customerLossMultiplier)
  );

  const lostRevenueValue = lostCustomersCount * regional.ticket;
  const lostRevenue = Number.isFinite(lostRevenueValue) ? lostRevenueValue : 0;

  // نسبة زيادة (موجودة عندك سابقاً—نحافظ على الفكرة بدون تضخيم)
  const percentageIncrease =
    baselineYearly > 0
      ? Math.round(((systemYearly - baselineYearly) / baselineYearly) * 100)
      : 100;

  // أرباح إضافية (تبقى محركة/مقنعة لكن غير مبالغ)
  const dynamicProfitValue = additionalYearly * regional.ticket * 1.2;
  const dynamicProfit = Number.isFinite(dynamicProfitValue)
    ? Math.round(dynamicProfitValue).toLocaleString()
    : '0';

  // =========================================================
  // 6) Market Status (كما هو)
  // =========================================================
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
          ? 'أنت موجود ولكنك مهدد. المنافسون يبتلعون حصتك السوقية تدريجياً عبر الأتمتة.'
          : 'You are present but at risk. Competitors are eating your market share via automation.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-500/30',
        icon: Target,
      };
    }
    return {
      id: 'strong',
      title: isRTL ? 'رائد يحتاج أتمتة' : 'Market Leader',
      desc: isRTL
        ? 'أداء ممتاز، ولكن الحفاظ على القمة يحتاج ذكاءً اصطناعياً لمنع أي ثغرة يستغلها المنافسون.'
        : 'Great performance, but staying on top requires AI to prevent competitor breakthroughs.',
      color: 'text-green-500',
      bg: 'bg-green-900/20',
      border: 'border-green-500/30',
      icon: Crown,
    };
  };

  const status = getMarketStatus();

  const waNumber = '96566305551';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    isRTL
      ? `أريد تفعيل نظام النمو وإيقاف خسارة العملاء لمشروعي (${data.projectName})`
      : `I want to activate growth for (${data.projectName})`
  )}`;

  // =========================================================
  // UI
  // =========================================================
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
          <span className="font-bold text-sm uppercase tracking-wider">{t.back}</span>
        </button>

        <span className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
          {isRTL ? 'تقرير ذكاء النمو' : 'Growth Intelligence Report'}
        </span>
      </div>

      {/* HERO */}
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
          </div>
        </div>
      </div>

      {/* METRICS */}
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

      {/* COMPARISON */}
      <div className="space-y-10">
        {/* MANUAL */}
        <div
          className={`bg-slate-900/80 p-10 md:p-14 rounded-[3.5rem] border-2 ${status.border} relative group overflow-hidden shadow-2xl`}
        >
          <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                {status.id === 'strong' ? (
                  <TrendingUp className="text-green-500" size={32} />
                ) : status.id === 'average' ? (
                  <Target className="text-yellow-500" size={32} />
                ) : (
                  <TrendingDown className="text-red-500" size={32} />
                )}

                <h3 className="text-slate-200 font-black text-2xl md:text-3xl uppercase tracking-tighter">
                  {isRTL ? 'الوضع اليدوي الحالي' : 'Current Manual Status'}
                </h3>
              </div>

              <p className="text-slate-400 text-xl font-medium leading-relaxed italic max-w-3xl">
                {status.id === 'strong'
                  ? isRTL
                    ? 'أداؤك ممتاز، لكن استمرار الأسلوب اليدوي يجعل الحفاظ على القمة أصعب مع الوقت.'
                    : 'You are performing well, but staying manual makes it harder to maintain leadership over time.'
                  : status.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <span className="text-slate-500 text-xs block mb-1 uppercase font-black tracking-widest">
                    {isRTL ? 'المعدل اليومي' : 'Daily Rate'}
                  </span>
                  <span className="text-2xl font-black text-white">{baselineDaily}</span>
                </div>

                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <span className="text-slate-500 text-xs block mb-1 uppercase font-black tracking-widest">
                    {isRTL ? 'المعدل الأسبوعي' : 'Weekly Rate'}
                  </span>
                  <span className="text-2xl font-black text-white">{baselineWeekly}</span>
                </div>

                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <span className="text-slate-500 text-xs block mb-1 uppercase font-black tracking-widest">
                    {isRTL ? 'المعدل الشهري' : 'Monthly Rate'}
                  </span>
                  <span className="text-2xl font-black text-white">{baselineMonthly}</span>
                </div>
              </div>
            </div>

            {/* Lost Reviews */}
            <div className="w-full md:w-80 bg-red-500/5 rounded-3xl p-8 border border-red-500/20 flex flex-col justify-center text-center space-y-4">
              <AlertTriangle className="text-red-500 mx-auto" size={40} />
              <h4 className="text-red-500 font-black text-sm uppercase tracking-widest">
                {isRTL ? 'تقييمات تفقدها' : 'Reviews You Are Losing'}
              </h4>
              <div className="space-y-1">
                <div className="text-5xl font-black text-white">-{lostDailyReviews}</div>
                <p className="text-red-400/80 text-xs font-bold uppercase tracking-widest">
                  {isRTL ? 'يومياً' : 'per day'}
                </p>
                <p className="text-slate-500 text-xs font-bold">
                  {isRTL ? `≈ -${lostWeeklyReviews} أسبوعياً` : `≈ -${lostWeeklyReviews} / week`}
                </p>
              </div>
              <div className="pt-4 border-t border-red-500/10 text-slate-500 text-[10px] font-bold leading-relaxed uppercase">
                {isRTL ? 'هذه الفجوة ترفع منافسيك أكثر منك' : 'This gap boosts competitors more than you'}
              </div>
            </div>
          </div>
        </div>

        {/* PRO */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 p-10 md:p-16 rounded-[4rem] border-4 border-indigo-500/30 relative overflow-hidden shadow-indigo-500/20 shadow-2xl group">
          <div className="absolute top-0 right-0 p-8 text-indigo-500/10 group-hover:scale-110 transition-transform duration-700">
            <Rocket size={200} />
          </div>

          <div className="relative z-10 space-y-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-indigo-500/20 pb-10">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <Zap className="text-indigo-400 fill-indigo-400" size={40} />
                  <h3 className="text-white font-black text-4xl md:text-5xl uppercase tracking-tighter italic">
                    {isRTL ? 'مع نظام Elegant Options PRO' : 'With Elegant Options PRO'}
                  </h3>
                </div>

                {/* ✅ قاعدة 10% الذهبية */}
                <p className="text-indigo-100 text-xl md:text-2xl font-black leading-relaxed max-w-3xl">
                  {isRTL
                    ? 'نطبق قاعدة الـ 10% الذهبية: تحويل كل 10 عملاء من أصل 100 يزورون مشروعك إلى مقيمين نشطين بشكل آلي بالكامل.'
                    : 'We apply the Golden 10% Rule: automatically converting 10 out of every 100 visitors into active reviewers.'}
                </p>

                {/* ✅ إضافة: عند إرسال طلب التقييم يومياً */}
                <p className="text-slate-300 text-base md:text-lg font-semibold leading-relaxed max-w-3xl">
                  {isRTL
                    ? 'يتم إرسال طلب التقييم يومياً لكل العملاء بشكل آلي (واتساب/رسالة)، لضمان تدفق ثابت يعزز ترتيبك وثقة العملاء.'
                    : 'Daily review requests are sent automatically (WhatsApp/SMS) to ensure a steady flow that boosts ranking and trust.'}
                </p>
              </div>

              <div className="bg-green-500 text-black px-8 py-3 rounded-full font-black text-xl shadow-xl shadow-green-500/20">
                +{percentageIncrease}% {isRTL ? 'نمو' : 'Growth'}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  label: isRTL ? 'المعدل اليومي' : 'Daily Potential',
                  value: `+${systemDailyPotential}`,
                  sub: isRTL ? 'تقييم / يوم' : 'reviews / day',
                },
                {
                  label: isRTL ? 'المعدل الأسبوعي' : 'Weekly Potential',
                  value: `+${systemWeekly}`,
                  sub: isRTL ? 'تقييم / أسبوع' : 'reviews / week',
                },
                {
                  label: isRTL ? 'المعدل الشهري' : 'Monthly Potential',
                  value: `+${systemMonthly}`,
                  sub: isRTL ? 'تقييم / شهر' : 'reviews / month',
                },
                {
                  label: isRTL ? 'الرصيد السنوي الإضافي' : 'Annual Asset',
                  value: `+${systemYearly.toLocaleString()}`,
                  sub: isRTL ? 'تقييم جديد سنوياً' : 'new reviews yearly',
                  color: 'text-green-400',
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center"
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
          </div>
        </div>
      </div>

      {/* SYSTEM FEATURES (تصميم محسّن + لغة ملتزمة) */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* AI Replies */}
        <div className="bg-slate-900/70 border border-slate-800 p-10 rounded-[3.5rem] space-y-7 hover:border-indigo-500/30 transition-all shadow-2xl flex flex-col min-h-[520px] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 blur-[80px] rounded-full" />
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
            <Bot size={36} />
          </div>
          <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {isRTL ? 'ردود ذكية بالذكاء الاصطناعي' : 'AI Smart Replies'}
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed flex-1">
            {isRTL
              ? 'رد تلقائي واحترافي على جميع التقييمات خلال 24 ساعة، مما يزيد الثقة ويحسّن الظهور في نتائج البحث.'
              : 'Automatic professional replies to all reviews within 24 hours, increasing trust and improving search visibility.'}
          </p>
          <div className="bg-black/25 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 font-semibold leading-relaxed">
            {isRTL
              ? 'كل رد سريع يقلل التقييمات السلبية ويزيد شعور العميل بالاهتمام.'
              : 'Fast replies reduce negative impact and increase customer confidence.'}
          </div>
        </div>

        {/* Reputation Shield */}
        <div className="bg-slate-900/70 border border-slate-800 p-10 rounded-[3.5rem] space-y-7 hover:border-orange-500/30 transition-all shadow-2xl flex flex-col min-h-[520px] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/10 blur-[80px] rounded-full" />
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shadow-inner">
            <ShieldCheck size={36} />
          </div>
          <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed flex-1">
            {isRTL
              ? 'فلترة ذكية تمنع ظهور التقييمات المنخفضة علناً، وتحولها داخلياً للإدارة لمعالجة المشكلة بخصوصية.'
              : 'Smart filtering prevents low ratings from going public and routes them internally for private resolution.'}
          </p>
          <div className="bg-black/25 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 font-semibold leading-relaxed">
            {isRTL
              ? 'هذا يحمي قرار العميل الجديد ويمنع تأثير “نقطة سلبية” على المبيعات.'
              : 'This protects buying decisions and prevents sales damage from a single bad review.'}
          </div>
        </div>

        {/* Delivery Integration */}
        <div
          className={`bg-slate-900/70 border border-slate-800 p-10 rounded-[3.5rem] space-y-7 hover:border-green-500/30 transition-all shadow-2xl flex flex-col min-h-[520px] relative overflow-hidden ${
            !isRestaurant && 'opacity-50 grayscale'
          }`}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-green-500/10 blur-[80px] rounded-full" />
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 shadow-inner">
            <Bike size={36} />
          </div>
          <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {isRTL ? 'دمج تطبيقات التوصيل' : 'Delivery Integration'}
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed flex-1">
            {isRTL
              ? 'ربط مباشر مع شركات التوصيل لإرسال طلب تقييم تلقائي بعد كل طلب، وتحويل الطلبات الصامتة إلى تقييمات إيجابية.'
              : 'Direct integration with delivery apps to auto-send review requests after each order, turning silent orders into positive reviews.'}
          </p>
          <div className="bg-black/25 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 font-semibold leading-relaxed">
            {isRTL
              ? 'قاعدة 10% الذهبية تتحقق بشكل أسرع لأن كل طلب يصبح فرصة تقييم.'
              : 'The 10% rule accelerates because every order becomes a review opportunity.'}
          </div>
        </div>
      </div>

      {/* ANNUAL REVENUE LEAK (مخفف) */}
      <div className="bg-gradient-to-br from-red-950 to-slate-950 p-12 md:p-16 rounded-[4rem] border border-red-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <AlertTriangle size={250} />
        </div>
        <div className="relative z-10 text-center md:text-right space-y-8">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-red-500/20 animate-pulse">
            <AlertTriangle size={14} />{' '}
            {isRTL ? 'نزيف الإيرادات السنوي (تقديري)' : 'Annual Revenue Leak (Estimated)'}
          </div>

          <p className="text-slate-300 text-xl md:text-2xl font-bold leading-relaxed max-w-4xl italic">
            {isRTL
              ? 'الفجوة بين تقييماتك الحالية وقدرتك الحقيقية (قاعدة 10%) تعني فرصاً تضيع لصالح منافسين أكثر ظهوراً.'
              : 'The gap between your current reviews and your real potential (10% rule) means opportunities leak to more visible competitors.'}
          </p>

          <div className="flex flex-col md:flex-row items-baseline gap-4 justify-center md:justify-start">
            <div className="text-7xl md:text-[9rem] font-black text-white tracking-tighter drop-shadow-2xl">
              {lostRevenue.toLocaleString()}
            </div>
            <div className="text-3xl md:text-6xl font-black text-red-500 uppercase">
              {currency}
            </div>
          </div>

          <div className="pt-6 border-t border-red-500/10 inline-block">
            <p className="text-slate-500 font-black text-sm uppercase tracking-[0.3em]">
              {isRTL ? 'خسارة تقديرية مبنية على فجوة التقييمات' : 'Estimate based on review-gap only'}
            </p>
          </div>
        </div>
      </div>

      {/* GROWTH OPPORTUNITY */}
      <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[4rem] p-12 md:p-16 relative overflow-hidden shadow-3xl group">
        <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8 text-white">
            <div className="inline-flex items-center gap-3 bg-indigo-500/10 text-indigo-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20">
              <Rocket className="w-4 h-4 animate-bounce" />{' '}
              {isRTL ? 'أثر تفعيل النظام' : 'System Impact'}
            </div>

            <h4 className="text-4xl md:text-5xl font-black italic">
              {isRTL ? 'أرباح إضافية بانتظار تفعيلها' : 'Hidden Profits Unlocked'}
            </h4>

            <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-indigo-500/30 pl-8">
              {isRTL
                ? 'كل تقييم إيجابي ثابت يرفع الثقة ويزيد احتمالية عودة العميل، ويقوي ظهورك دون حملات مدفوعة.'
                : 'Every consistent positive review builds trust, increases repeat visits, and strengthens visibility without extra ad spend.'}
            </p>
          </div>

          <div className="bg-slate-800/50 p-14 rounded-[3.5rem] border border-indigo-500/30 text-center shadow-3xl min-w-[340px] transform hover:scale-105 transition-transform backdrop-blur-xl relative">
            <Zap className="absolute -top-8 -right-8 w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
            <span className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] block mb-6">
              {isRTL ? 'أرباح سنوية إضافية محتملة' : 'Potential Additional Annual Profit'}
            </span>
            <div className="flex flex-col items-center">
              <span className="text-8xl font-black text-white leading-none tracking-tighter drop-shadow-xl">
                {dynamicProfit}
              </span>
              <span className="text-2xl text-indigo-400 font-black uppercase tracking-[0.4em] mt-6">
                {currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUOTE + RECOMMENDATION */}
      <div className="space-y-16 py-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto px-4">
          <QuoteIcon className="text-indigo-500/20" size={80} fill="currentColor" />
          <p className="text-slate-200 text-3xl md:text-4xl font-black italic leading-tight tracking-tight">
            "
            {isRTL
              ? 'زيادة نجمة واحدة في التقييم قد ترفع الإيرادات بنسبة 5% إلى 9%'
              : 'A one-star increase in rating can lift revenue by 5% to 9%'}
            "
          </p>
          <div className="w-20 h-1 bg-yellow-500/30 rounded-full" />
          <span className="text-yellow-500 font-black tracking-[0.4em] text-sm uppercase">
            {isRTL ? 'كلية هارفارد للأعمال' : 'Harvard Business School'}
          </span>
        </div>

        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group shadow-2xl">
          <div className="absolute -top-12 -right-12 p-8 text-indigo-500/5 rotate-12 transition-transform group-hover:scale-110">
            <Award size={300} />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-5 text-indigo-400">
              <ShieldCheck size={48} />
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic">
                {isRTL ? 'توصية استراتيجية' : 'Strategic Recommendation'}
              </h3>
            </div>

            <p className="text-slate-300 text-2xl md:text-3xl leading-relaxed font-bold max-w-5xl text-white">
              {isRTL
                ? `نوصي بتفعيل الأتمتة لمشروع (${data.projectName || 'مشروعك'}) لضمان تدفق تقييمات يومي ثابت يحمي ترتيبك ويمنع المنافسين من تجاوزك.`
                : `Activate automation for (${data.projectName || 'your business'}) to secure steady daily reviews that protect ranking and block competitors.`}
            </p>
          </div>
        </div>
      </div>

      {/* FINAL CTA (لغة ملتزمة) */}
      <div className="text-center space-y-12 pt-16 border-t border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-slate-200 text-xl md:text-2xl font-black leading-relaxed">
            {isRTL
              ? '⬇️ قبل طلب النظام… شاهد التجربة البصرية لتفهم كيف نحول العملاء إلى تقييمات يومياً.'
              : '⬇️ Before ordering… watch the visual experience to see how we convert customers into daily reviews.'}
          </p>
          <p className="text-slate-500 text-sm md:text-base font-semibold">
            {isRTL
              ? 'التجربة البصرية توضح رحلة العميل من “زيارة/طلب” إلى “تقييم” ثم “ولاء وأرباح”.'
              : 'The visual experience shows the journey from “visit/order” to “review” then “loyalty and profit”.'}
          </p>
        </div>

        <div className="flex flex-col gap-8 justify-center items-center">
          <button
            onClick={onVisualExp}
            className="w-full md:w-auto px-16 py-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-3xl rounded-[3rem] shadow-2xl transform hover:-translate-y-2 transition-all flex items-center justify-center gap-5 group"
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
              className="w-full md:w-auto px-12 py-10 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black text-2xl rounded-[3rem] border border-slate-700 transition-all flex items-center justify-center gap-5 group"
            >
              <RotateCw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
              {isRTL ? 'تحليل نشاط آخر' : 'Analyze Another'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
