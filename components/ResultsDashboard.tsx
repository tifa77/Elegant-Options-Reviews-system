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
    Number(data.weeklyGrowth) || Number((avgReviewsPerYear / 52).toFixed(1)) || 0;

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
  // 4) REVENUE LEAK (less exaggerated)
  // ==========================
  const baseYearlyReviews = baselineMonthly * 12;
  const projectedYearlyReviews = systemMonthly * 12;

  const reviewGapYearly = Math.max(0, projectedYearlyReviews - baseYearlyReviews);

  const customerLossMultiplier = 4;
  const lostCustomersCount = Math.max(0, reviewGapYearly * customerLossMultiplier);

  const lostRevenueValue = lostCustomersCount * regional.ticket;
  const lostRevenue = Number.isFinite(lostRevenueValue) ? Math.round(lostRevenueValue) : 0;

  const percentageIncrease =
    baseYearlyReviews > 0
      ? Math.round(((projectedYearlyReviews - baseYearlyReviews) / baseYearlyReviews) * 100)
      : 100;

  const loyaltyConversionRate = 0.35;
  const visitsPerLoyalClientPerYear = 3;

  const annualAdditionalReviews = systemYearly;
  const additionalLoyalClients = Math.max(0, Math.round(annualAdditionalReviews * loyaltyConversionRate));

  const dynamicProfitValue =
    annualAdditionalReviews *
    loyaltyConversionRate *
    visitsPerLoyalClientPerYear *
    regional.ticket;

  const dynamicProfit = Number.isFinite(dynamicProfitValue)
    ? Math.round(dynamicProfitValue).toLocaleString()
    : '0';

  // ==========================
  // 5) MARKET STATUS (UNCHANGED CORE IDEA)
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
          ? 'أنت موجود… لكن المنافسين يرفعون ولاء عملائهم بالتواصل المستمر ويثبتون أنفسهم كخيار أول في جوجل تدريجيًا.'
          : 'You exist… but competitors build loyalty through consistent communication and gradually position themselves as a top Google choice.',
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
  // 7) MANUAL MESSAGE (UPDATED CONTENT ONLY)
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
        ? 'أداؤك قوي… لكن القمة تحتاج استمرارية ذكية'
        : 'You’re strong… but the top needs consistent momentum'
      : status.id === 'average'
      ? isRTL
        ? 'أنت مهدد… المنافسون يسبقونك بتواصلهم وبناء ولائهم'
        : 'You’re at risk… competitors win with consistent communication & loyalty'
      : isRTL
      ? 'أنت غير مرئي… وتخسر فرصًا يوميًا'
      : 'You’re invisible… losing opportunities daily';

  const manualBody =
    status.id === 'strong'
      ? isRTL
        ? 'التقييمات الحالية جيدة، لكن الاعتماد على الأسلوب الحالي يجعل الاستمرارية أصعب ومعرضة للتراجع… لأن المنافسين يحافظون على تواصلهم مع عملائهم ويبنون ولاءً يثبتهم في مقدمة خيارات جوجل.'
        : 'Your reviews are good, but relying on the current approach makes consistency harder and vulnerable—competitors maintain ongoing communication, build loyalty, and stay top in Google choices.'
      : status.id === 'average'
      ? isRTL
        ? 'أنت موجود، لكن ضعف الاستمرارية يمنح المنافسين مساحة ليتقدموا بتواصلهم المستمر وبناء الولاء… فيظهرون قبلك في خيارات جوجل تدريجيًا.'
        : 'You’re present, but inconsistency gives competitors room to advance through consistent communication and loyalty building—so they show up before you in Google choices.'
      : isRTL
      ? 'محركات البحث تتجاهلك بسبب نقص الإشارات الثابتة للثقة. كل يوم يمر بدون تدفق تقييمات… يعني عملاء يذهبون لغيرك.'
      : 'Search engines ignore you without consistent trust signals. Every day without review flow means customers choosing competitors.';

  // ==========================
  // 8) NEW SECTION: NEGATIVE RATING IMPACT (AFTER CURRENT STATUS)
  // ==========================
  const rawRating = Number(
    (data as any).rating ?? (data as any).averageRating ?? (data as any).stars
  );

  const rating =
    Number.isFinite(rawRating) && rawRating > 0 && rawRating <= 5 ? rawRating : 4.5;

  const dropFromFive = Math.max(0, 5 - rating);

  // كل نزول 0.5 نجمة = +5%
  const negativeImpactPercent = Math.min(
    60,
    Math.max(0, Math.ceil(dropFromFive / 0.5) * 5)
  );

  const negativeStatus =
    negativeImpactPercent >= 30
      ? {
          title: isRTL ? 'خطر عالي على اكتساب العملاء' : 'High Risk to Customer Acquisition',
          color: 'text-red-400',
          bg: 'bg-red-500/5',
          border: 'border-red-500/20',
          hint: isRTL
            ? 'هذا معدل كبير… يقلل قرار الشراء بسرعة ويحتاج معالجة فورية.'
            : 'This is a significant rate—reduces purchase decisions fast and needs immediate fixing.',
        }
      : negativeImpactPercent >= 15
      ? {
          title: isRTL ? 'معدل مقلق ويحتاج تحسين' : 'Concerning Rate—Needs Improvement',
          color: 'text-yellow-300',
          bg: 'bg-yellow-500/5',
          border: 'border-yellow-500/20',
          hint: isRTL
            ? 'هذا الرقم يؤثر على الثقة… ويمكن تحسينه بإدارة التقييمات وردود ذكية ومعالجة الداخل قبل العلن.'
            : 'This impacts trust—can be improved with review management, smart replies, and private resolution before public damage.',
        }
      : {
          title: isRTL ? 'معدل طبيعي لكن قابل للتحسين' : 'Normal Rate, Still Improveable',
          color: 'text-green-300',
          bg: 'bg-green-500/5',
          border: 'border-green-500/20',
          hint: isRTL
            ? 'وضع جيد… ومع الإدارة الذكية ستزيد الثقة ويثبت ظهورك.'
            : 'Good status—smart management boosts trust and stabilizes visibility.',
        };

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
                {isRTL ? 'تقييمات تفقدها بسبب الأسلوب الحالي' : 'Reviews Lost Due To Current Approach'}
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

        {/* ✅ NEW: NEGATIVE RATING IMPACT SECTION (AFTER CURRENT STATUS) */}
        <div className={`bg-slate-900/80 p-10 md:p-14 rounded-[3.5rem] border-2 ${negativeStatus.border} ${negativeStatus.bg} relative overflow-hidden shadow-2xl`}>
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <ShieldCheck className={`${negativeStatus.color}`} size={34} />
                <h3 className="text-slate-200 font-black text-2xl md:text-3xl uppercase tracking-tighter">
                  {isRTL ? 'تحليل التأثير السلبي على اكتساب العملاء' : 'Negative Impact on Customer Acquisition'}
                </h3>
              </div>

              <p className="text-slate-200 text-xl md:text-2xl font-black leading-relaxed">
                {isRTL
                  ? `معدل نجومك الحالي تقريبًا: ${rating.toFixed(1)} / 5 — وهذا يعني أن لديك "نسبة نفور" محتملة تقارب`
                  : `Your current rating is about: ${rating.toFixed(1)} / 5 — which indicates a potential “drop-off rate” of`}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className={`px-6 py-3 rounded-2xl border border-white/10 bg-black/30 ${negativeStatus.color} font-black text-3xl`}>
                  {negativeImpactPercent}%
                </div>
                <div className="text-slate-300 font-bold text-sm md:text-base leading-relaxed">
                  {isRTL
                    ? 'من العملاء الجدد قد يترددون أو يختارون منافسًا بسبب “عدم كفاية الثقة” في النجوم.'
                    : 'of new customers may hesitate or choose competitors due to lower trust in the rating.'}
                </div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
                <p className={`font-black text-lg ${negativeStatus.color}`}>
                  {negativeStatus.title}
                </p>
                <p className="text-slate-300 font-semibold mt-2 leading-relaxed">
                  {negativeStatus.hint}
                </p>
                <p className="text-slate-500 text-sm font-bold mt-3 leading-relaxed">
                  {isRTL
                    ? 'منطق الحساب: كل نزول بمقدار نصف نجمة (0.5) يضيف 5% نفور إضافي — لذلك تحسين النجوم ليس “شكل”… بل قرار ربح.'
                    : 'Logic: every 0.5-star drop adds +5% extra drop-off — improving stars isn’t cosmetic, it’s profit.'}
                </p>
              </div>
            </div>

            <div className="w-full md:w-96 bg-black/20 rounded-3xl p-8 border border-white/10 text-center flex flex-col justify-center space-y-4">
              <h4 className="text-slate-200 font-black text-sm uppercase tracking-widest">
                {isRTL ? 'ماذا يعني ذلك عمليًا؟' : 'What this means in practice'}
              </h4>

              <div className="text-6xl font-black text-white leading-none">
                {Math.round((dailyCustomers || 0) * (negativeImpactPercent / 100))}
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                {isRTL ? 'عميل يوميًا قد يتردد أو لا يختارك' : 'customers/day may hesitate or not choose you'}
              </p>

              <div className="pt-4 border-t border-white/10 text-slate-300 text-sm font-semibold leading-relaxed">
                {isRTL
                  ? 'وهنا يأتي دور ردود AI + درع حماية السمعة… لتقليل الضرر ورفع التقييم تدريجيًا.'
                  : 'That’s where AI replies + Reputation Shield reduce damage and lift rating over time.'}
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
                    {isRTL ? 'مع نظام Elegant Options PRO' : 'With Elegant Options PRO'}
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

      {/* باقي الكود كما هو بدون تغيير */}
      {/* ... (SYSTEM FEATURES, QUOTE, RECOMMENDATION, FINAL CTA) */}
      {/* ملاحظة: اترك بقية الأقسام في ملفك كما هي تماماً */}

      {/* FINAL CTA with guidance line */}
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
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
