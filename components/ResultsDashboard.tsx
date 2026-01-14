// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ghost,
  Target,
  Crown,
  Activity,
  Zap,
  BarChart3,
  Bike,
  MessageCircle,
  RotateCw,
  Eye,
  ShieldCheck,
  DollarSign,
  Star,
  Quote as QuoteIcon,
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

  // ---------------- Anti-NaN Engine & base numbers ----------------
  const currentYear = new Date().getFullYear();
  const rawEstablishedYear = Number(data.establishedYear);
  const ageYears =
    Number.isFinite(rawEstablishedYear) &&
    rawEstablishedYear > 1900 &&
    rawEstablishedYear <= currentYear
      ? Math.max(1, currentYear - rawEstablishedYear)
      : 1;

  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;

  // آخر أسبوع: نحاول قراءة أكثر من اسم حقل محتمل، ثم نرجع لـ weeklyGrowth لو موجود
  const lastWeekRaw =
    Number((data as any).lastWeekReviews) ||
    Number((data as any).reviewsLast7Days) ||
    Number((data as any).reviewsLastWeek) ||
    Number(data.weeklyGrowth) ||
    0;

  const lastWeekReviews =
    Number.isFinite(lastWeekRaw) && lastWeekRaw > 0 ? lastWeekRaw : 0;

  // مشتقّات من آخر أسبوع → شهري وسنوي
  const derivedMonthlyFromWeek =
    lastWeekReviews > 0 ? Number((lastWeekReviews * 4.3).toFixed(1)) : 0;

  const fallbackWeekly = Number(data.weeklyGrowth) || 0;
  const fallbackMonthly = Number(data.monthlyGrowth) || 0;

  const currentWeekly = lastWeekReviews || fallbackWeekly;
  const currentMonthly =
    derivedMonthlyFromWeek || fallbackMonthly || (currentWeekly ? currentWeekly * 4.3 : 0);
  const currentYearlyReviews = Math.round(currentMonthly * 12);

  // متوسط التقييم السنوي على عمر النشاط
  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;
  const avgReviewsPerMonth = Number((avgReviewsPerYear / 12).toFixed(1)) || 0;

  // ---------------- Regional currency (from old design) ----------------
  const getRegionalData = () => {
    const address = (data.address || '').toLowerCase();
    const isKuwait =
      address.includes('kuwait') || address.includes('الكويت');

    if (isKuwait) {
      return {
        symbol: isRTL ? 'د.ك' : 'KWD',
        ticket: 20,
      };
    } else {
      return {
        symbol: isRTL ? 'دولار' : 'USD',
        ticket: 60,
      };
    }
  };

  const regional = getRegionalData();
  const currency = (t.dashboard?.currency as string) || regional.symbol;

  // ---------------- Growth / restaurant flags ----------------
  const isRestaurant =
    data.projectType === 'restaurant' ||
    data.projectType === 'مطعم' ||
    data.projectType === 'cafe';

  const multiplier = isRestaurant ? 10 : 6;

  const projectedWeekly = Math.max(8, currentWeekly * multiplier || 8);
  const projectedMonthly = Math.max(35, currentMonthly * multiplier || 35);
  const projectedYearlyReviews = projectedMonthly * 12;

  const percentageIncrease =
    currentYearlyReviews > 0
      ? Math.round(
          ((projectedYearlyReviews - currentYearlyReviews) /
            currentYearlyReviews) *
            100,
        )
      : 100;

  const customerLossMultiplier = 4;
  const lostCustomersCount = Math.max(
    0,
    (projectedYearlyReviews - currentYearlyReviews) * customerLossMultiplier,
  );
  const lostRevenue = lostCustomersCount * regional.ticket;

  // ---------------- Extra opportunity logic from new design ----------------
  const systemDailyPotential = Math.round(dailyCustomers * 0.1);
  const annualAdditionalReviews = systemDailyPotential * 365;

  const avgTicket = 10;
  const rawRevenueOpportunity =
    dailyCustomers * 30 * 12 * 0.3 * avgTicket;
  const annualRevenueOpportunity = Number.isFinite(rawRevenueOpportunity)
    ? rawRevenueOpportunity
    : 0;

  const rawDynamicProfitValue = annualAdditionalReviews * avgTicket * 5;
  const dynamicProfit = Number.isFinite(rawDynamicProfitValue)
    ? rawDynamicProfitValue.toLocaleString()
    : '0';

  // ---------------- Market status (SEO-based) ----------------
  // Benchmark سنوي تقريبي للظهور الجيد في السيو
  const seoBenchmark = isRestaurant ? 60 : 40;

  const getMarketStatus = () => {
    const incentive = isRTL
      ? '⚠️ تنبيه SEO: المنافسون في منطقتك يضاعفون عدد التقييمات الحديثة، ما يجعلهم يتصدرون صفحة البحث الأولى بينما حسابك يتراجع في النتائج.'
      : '⚠️ SEO Alert: Competitors near you are generating fresh reviews and outranking you on the first search page while your account falls behind.';

    const hasFreshActivity = lastWeekReviews > 0;
    const veryLowAnnual = avgReviewsPerYear < seoBenchmark * 0.25;
    const belowBenchmark = avgReviewsPerYear < seoBenchmark;

    if (veryLowAnnual && !hasFreshActivity) {
      return {
        title: isRTL
          ? 'شبح رقمي في نتائج البحث'
          : 'SEO Digital Ghost',
        desc: isRTL
          ? 'حسابك لا يملك معدل تقييم سنوي كافٍ ولا نشاطاً في آخر أسبوع، لذلك لا تكاد تظهر في نتائج البحث المحلية أو خرائط جوجل. العملاء الجدد لا يرونك، والمنافسون يملؤون الشاشة أمامك.'
          : 'Your annual review volume is very low and there is no activity in the last week, so you are almost invisible on local search and Google Maps. New customers barely see you while competitors dominate the screen.',
        color: 'text-red-500',
        bg: 'bg-red-900/20',
        border: 'border-red-500/30',
        icon: Ghost,
        incentive,
      };
    } else if (belowBenchmark || lastWeekReviews <= 3) {
      return {
        title: isRTL ? 'تواجد متقطع في السيو' : 'Inconsistent SEO Presence',
        desc: isRTL
          ? 'لديك تقييمات وتظهر أحياناً في نتائج البحث، لكن معدل التقييم السنوي أقل من الحد الموصى به لنشاط متصدر، وعدد التقييمات في آخر أسبوع محدود. أي تراجع بسيط يسمح للمنافسين بالظهور قبلك دائماً.'
          : 'You do have reviews and sometimes appear in search results, but your annual average is below the recommended level for a leading business and last-week activity is low. Any small decline lets competitors consistently outrank you.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-500/30',
        icon: Target,
        incentive,
      };
    }
    return {
      title: isRTL
        ? 'حضور قوي يحتاج أتمتة سيو'
        : 'Strong Presence – Needs SEO Automation',
      desc: isRTL
        ? 'معدل تقييماتك السنوي ونشاطك الأسبوعي جيدان، ما يمنحك ظهوراً قوياً في نتائج البحث. لكن للحفاظ على الصدارة وتوسيعها، تحتاج لأتمتة ذكية تضمن استمرار التقييمات والردود بدون توقف.'
        : 'Your annual review volume and weekly activity are strong, giving you solid visibility in search results. But to keep and expand your top positions, you need smart automation that keeps reviews and replies flowing nonstop.',
      color: 'text-green-500',
      bg: 'bg-green-900/20',
      border: 'border-green-500/30',
      icon: Crown,
      incentive,
    };
  };

  const status = getMarketStatus();

  // ---------------- Dashboard text objects from TEXTS ----------------
  const dashboard = t.dashboard ?? {};
  const quote = dashboard.quote ?? { text: '', attribution: '' };
  const strategic = dashboard.strategicRecommendation ?? {
    title: '',
    text: '',
  };
  const marketing = dashboard.marketing ?? {
    persuasive: '',
    motivational: '',
  };

  // ---------------- WhatsApp link (unified) ----------------
  const waNumber = '96566305551';
  const customWAMessage = isRTL
    ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName || 'مشروع جديد'}) لزيادة التقييمات وتحسين الظهور في نتائج البحث.`
    : `Hello Elegant Options, I am interested in your system for my project (${data.projectName || 'New Project'}) to grow reviews and improve SEO visibility.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    customWAMessage,
  )}`;

  const positiveReviews = Number(data.positiveReviews) || 0;
  const negativeReviews = Number(data.negativeReviews) || 0;

  return (
    <div
      className={`max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 ${
        isRTL ? 'font-tajawal text-right' : 'font-sans text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          {isRTL ? (
            <ArrowRight className="w-5 h-5" />
          ) : (
            <ArrowLeft className="w-5 h-5" />
          )}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
        <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
          <BarChart3 className="w-3 h-3" />
          {dashboard.title || 'Growth & SEO Report'}
        </span>
      </div>

      {/* 1. تشخيص سوقي (Hero Status Card) */}
      <div
        className={`p-8 rounded-[2.5rem] border ${status.border} ${status.bg} backdrop-blur-sm relative overflow-hidden group shadow-2xl`}
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <status.icon size={150} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
          <div className={`p-6 rounded-full bg-slate-900 shadow-2xl ${status.color}`}>
            <status.icon size={48} />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">
              {isRTL ? 'التشخيص السوقي وفعالية السيو' : 'Market & SEO Diagnosis'}
            </h3>
            <div className={`text-4xl font-black ${status.color} mb-3`}>
              {status.title}
            </div>
            <p className="text-slate-300 text-sm mb-3 leading-relaxed font-medium opacity-90">
              {status.desc}
            </p>
            <p className="text-slate-400 text-xs mb-2 leading-relaxed">
              {isRTL
                ? `عمر النشاط: ${ageYears} سنة، إجمالي التقييمات: ${totalReviews}، ومتوسط التقييم السنوي: ${avgReviewsPerYear} تقييم/سنة، مقارنة بالحد الأدنى الموصى به لنشاط ظاهر في نتائج البحث وهو حوالي ${seoBenchmark} تقييم سنوياً.`
                : `Business age: ${ageYears} year(s), total reviews: ${totalReviews}, with an annual average of ${avgReviewsPerYear} reviews/year versus a recommended minimum of about ${seoBenchmark} reviews/year for visible local SEO.`}
            </p>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              {isRTL
                ? `خلال آخر أسبوع فقط حصلت على (${lastWeekReviews}) تقييم، وهذا المعدل يعادل تقريباً ${(derivedMonthlyFromWeek || 0).toFixed(
                    1,
                  )} تقييماً شهرياً. كلما زاد هذا المعدل واستمر بشكل ثابت، ارتفع ظهورك في الصفحة الأولى على جوجل ماب وجوجل سيرش.`
                : `In the last week alone, you received (${lastWeekReviews}) review(s), which is roughly ${(derivedMonthlyFromWeek || 0).toFixed(
                    1,
                  )} reviews per month. The higher and more consistent this number is, the stronger your chances of staying on the first page in Google Maps and Search.`}
            </p>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-orange-400 text-sm font-bold animate-pulse">
              {status.incentive}
            </div>
          </div>
        </div>
      </div>

      {/* 2. أرقام أساسية (العمر، إجمالي التقييمات، المتوسطات) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 text-center">
          <span className="text-slate-500 text-xs font-bold block mb-2">
            {dashboard.age || (isRTL ? 'عمر المشروع (سنوات)' : 'Project Age (Years)')}
          </span>
          <div className="text-3xl font-black text-white">{ageYears}</div>
        </div>
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 text-center">
          <span className="text-slate-500 text-xs font-bold block mb-2">
            {dashboard.totalReviews || (isRTL ? 'إجمالي التقييمات' : 'Total Reviews')}
          </span>
          <div className="text-3xl font-black text-white">
            {totalReviews.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-indigo-500/20 text-center">
          <span className="text-indigo-400 text-xs font-bold block mb-2">
            {isRTL ? 'متوسط التقييم السنوي' : 'Annual Avg'}
          </span>
          <div className="text-3xl font-black text-indigo-400">
            {avgReviewsPerYear}
          </div>
        </div>
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 text-center">
          <span className="text-slate-500 text-xs font-bold block mb-2">
            {isRTL ? 'متوسط التقييم الشهري' : 'Monthly Avg'}
          </span>
          <div className="text-3xl font-black text-white">
            {avgReviewsPerMonth.toFixed(1)}
          </div>
        </div>
      </div>

      {/* 3. تحليل جودة التقييمات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <span className="text-slate-500 text-xs font-bold block mb-2">
            {isRTL ? 'إجمالي التقييمات' : 'Total Reviews'}
          </span>
          <div className="text-3xl font-black text-white">
            {totalReviews || 0}
          </div>
        </div>
        <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
          <span className="text-green-500 text-xs font-bold block mb-2">
            {isRTL ? 'إيجابية (4-5 نجوم)' : 'Positive (4–5 Stars)'}
          </span>
          <div className="text-3xl font-black text-green-400">
            {positiveReviews}
          </div>
        </div>
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20 relative">
          <span className="text-red-500 text-xs font-bold block mb-2">
            {isRTL ? 'سلبية (1-3 نجوم)' : 'Negative (1–3 Stars)'}
          </span>
          <div className="text-3xl font-black text-red-500">
            {negativeReviews}
          </div>
          <div className="mt-4 p-3 bg-red-500/10 rounded-xl text-[10px] text-red-300 leading-relaxed italic border border-red-500/10">
            {isRTL
              ? `⚠️ لو كنت مشتركاً بنظامنا، لكانت هذه التقييمات السلبية (${negativeReviews}) قد حُلت داخلياً عبر درع الحماية قبل أن تُنشر علناً على خرائط جوجل وتؤثر على السيو.`
              : `⚠️ With our Reputation Shield, these (${negativeReviews}) negative reviews would have been handled privately before going public on Google Maps and hurting your SEO.`}
          </div>
        </div>
      </div>

      {/* 4. مقارنة الأداء: بدون نظام vs مع Elegant Options (باستخدام آخر أسبوع) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Status */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 relative">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <Activity className="text-slate-500" size={20} />
            <h3 className="text-slate-400 font-bold">
              {isRTL ? 'الوضع الحالي (بدون نظام)' : 'Current Status (No System)'}
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm font-medium">
                {isRTL ? 'التقييمات في آخر أسبوع' : 'Reviews in Last Week'}
              </span>
              <span className="text-2xl font-black text-slate-300">
                {lastWeekReviews}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm font-medium">
                {isRTL ? 'المعدل الشهري الحالي' : 'Current Monthly Avg'}
              </span>
              <span className="text-2xl font-black text-slate-300">
                {currentMonthly.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-slate-800/50">
              <span className="text-slate-500 text-xs font-medium">
                {isRTL ? 'رصيد التقييمات السنوي' : 'Annual Reviews Asset'}
              </span>
              <span className="text-xl font-bold text-slate-400">
                {currentYearlyReviews}
              </span>
            </div>
          </div>
        </div>

        {/* With Elegant Options */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-blue-600" />
          <div className="flex items-center gap-3 mb-6 border-b border-indigo-500/20 pb-4">
            <Zap className="text-indigo-400" size={20} />
            <h3 className="text-white font-bold">
              {isRTL ? 'مع Elegant Options' : 'With Elegant Options'}{' '}
              <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-md">
                PRO
              </span>
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-blue-100 text-sm font-medium">
                {isRTL ? 'النمو الأسبوعي المتوقع' : 'Projected Weekly Growth'}
              </span>
              <span className="text-3xl font-black text-indigo-400">
                +{projectedWeekly}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-blue-100 text-sm font-medium">
                {isRTL ? 'النمو الشهري المتوقع' : 'Projected Monthly Growth'}
              </span>
              <span className="text-3xl font-black text-indigo-400">
                +{projectedMonthly.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-indigo-500/20">
              <span className="text-blue-200 text-xs font-medium">
                {isRTL ? 'زيادة سنوية تقديرية' : 'Estimated Annual Increase'}
              </span>
              <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-green-400 font-black text-sm">
                +{percentageIncrease}%+
              </div>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-slate-300 leading-relaxed">
            {isRTL
              ? `النظام يستغل حركة العملاء اليومية (بمتوسط ${dailyCustomers} عميل يومياً) وتحويلها إلى ما يقارب ${annualAdditionalReviews} تقييم إضافي في السنة بدون جهد يدوي، ما يعزز السيو ويرفع ترتيبك في نتائج البحث.`
              : `The system leverages your daily traffic (~${dailyCustomers} customers/day) to generate around ${annualAdditionalReviews} extra reviews per year automatically, boosting your SEO and rankings in search results.`}
          </p>
        </div>
      </div>

      {/* 5. Talabat & Keeta Integration (restaurants only) */}
      {isRestaurant && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-orange-500/30 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="flex -space-x-4 rtl:space-x-reverse">
              <div className="w-16 h-16 rounded-2xl bg-[#ff5a00] flex items-center justify-center border-4 border-slate-900 z-10 shadow-lg">
                <Bike className="text-white w-8 h-8" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-[#fec400] flex items-center justify-center border-4 border-slate-900 shadow-lg">
                <Zap className="text-black w-8 h-8 fill-black" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-white font-black text-xl mb-2">
                {isRTL
                  ? 'مضاعفة النتائج عبر تطبيقات التوصيل'
                  : 'Talabat & Keeta Integration'}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {isRTL
                  ? 'نقوم بإرسال رسائل واتساب تلقائية لعملائك القادمين من (طلبات وكيتا) مباشرة بعد استلام الطلب، نطلب منهم تقييم تجربتهم فوراً. هذه العملية تتم بشكل آلي ومجاني ضمن النظام وتحوّل كل طلب توصيل إلى فرصة تقييم حقيقية تعزز السيو المحلي.'
                  : 'We send automated WhatsApp messages to your customers from Talabat & Keeta immediately after delivery, requesting a review. This runs automatically and at no extra cost, turning every order into a real review opportunity that strengthens local SEO.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Annual Revenue Leak */}
      <div className="bg-gradient-to-br from-red-950 to-slate-900 p-8 rounded-[2.5rem] border border-red-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <AlertTriangle size={150} />
        </div>
        <div className="relative z-10 text-center md:text-right">
          <h4 className="text-red-400 font-black text-xl mb-2">
            {isRTL
              ? 'نزيف الإيرادات السنوي (فرصة ضائعة)'
              : 'Annual Revenue Leak (Lost Opportunity)'}
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {isRTL
              ? 'بسبب ضعف تصنيفك الحالي في نتائج البحث، أنت تفقد حصة سوقية ضخمة لصالح المنافسين الذين يظهرون قبلك. هذه الأرقام تمثل العملاء الذين كان يمكن أن يتحولوا إلى زبائن دائمين لو تم تفعيل نظام المراجعات والأتمتة.'
              : 'Because of your current ranking, you are losing significant market share to competitors who appear before you. These numbers represent customers who could have become loyal if your review and automation system were active.'}
          </p>
          <div className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">
            {lostRevenue.toLocaleString()}{' '}
            <span className="text-2xl text-red-500">{currency}</span>
          </div>
          <p className="mt-3 text-xs text-red-200">
            {isRTL
              ? `وفقاً للحسابات، لديك أيضاً فرصة أرباح سنوية تقديرية تبلغ تقريباً ${annualRevenueOpportunity.toLocaleString()} ${currency} في حال استغلال ولاء العملاء وتعظيم التقييمات الإيجابية.`
              : `You also hold an estimated annual profit opportunity of about ${annualRevenueOpportunity.toLocaleString()} ${currency} if you fully leverage customer loyalty and maximize positive reviews.`}
          </p>
        </div>
      </div>

      {/* 7. Additional Annual Profit (from new design) */}
      <div className="bg-slate-900 border border-slate-700 rounded-[3rem] p-10 md:p-14 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            <h4 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">
              {t.report?.impactTitle ||
                (isRTL ? 'أثر تفعيل نظام الأتمتة' : 'Impact of Activating the System')}
            </h4>
            <p className="text-slate-400 text-lg italic leading-relaxed">
              {marketing.persuasive ||
                (isRTL
                  ? 'زيادة التقييمات ليست مجرد أرقام، بل هي وقود للسيو، وثقة في عين العميل، ومصدر دخل متكرر بدون إعلانات إضافية.'
                  : 'More reviews are not just numbers; they are SEO fuel, social proof in the customer’s eye, and recurring revenue without extra ads.')}
            </p>
          </div>

          <div className="bg-slate-800 p-10 rounded-[2.5rem] border border-indigo-500/30 text-center shadow-3xl min-w-[280px] relative">
            <Zap className="absolute -top-5 -right-5 w-12 h-12 text-yellow-400 fill-yellow-400" />
            <span className="text-slate-500 text-xs font-black uppercase tracking-widest block mb-4">
              {isRTL
                ? 'الأرباح السنوية الإضافية المحتملة'
                : 'Potential Additional Annual Profit'}
            </span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-black text-white leading-none tracking-tighter">
                {dynamicProfit}
              </span>
              <span className="text-sm text-indigo-400 font-black uppercase tracking-[0.3em] mt-4">
                {currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Quote + Strategic Recommendation */}
      {(quote.text || strategic.text) && (
        <div className="space-y-6">
          {quote.text && (
            <div className="text-center py-8 space-y-4">
              <QuoteIcon
                className="text-yellow-500/30 mx-auto"
                size={48}
                fill="currentColor"
              />
              <h3 className="text-white text-2xl font-black italic max-w-3xl mx-auto leading-tight">
                {quote.text}
              </h3>
              {quote.attribution && (
                <span className="text-yellow-500 font-black tracking-[0.3em] text-xs block uppercase">
                  {quote.attribution}
                </span>
              )}
            </div>
          )}

          {strategic.text && (
            <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
              <div className="relative z-10 space-y-4 text-white">
                <div className="flex items-center gap-3 text-indigo-400 mb-2">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                    {strategic.title ||
                      (isRTL
                        ? 'التوصية الاستراتيجية النهائية'
                        : 'Final Strategic Recommendation')}
                  </h3>
                </div>
                <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
                  {strategic.text.replace(
                    '{name}',
                    data.projectName ||
                      (isRTL ? 'مشروعكم' : 'your project'),
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. CTA Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* Visual Experience */}
        <button
          onClick={onVisualExp}
          className="py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
        >
          <Eye size={22} />
          {t.closing?.btnVisual ||
            (isRTL ? 'خذ فكرة (تجربة بصرية)' : 'Visual Simulation')}
        </button>

        {/* WhatsApp Order */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 animate-pulse"
        >
          <MessageCircle size={24} />
          {t.closing?.btn1 ||
            (isRTL ? 'اطلب النظام الآن' : 'Order System Now')}
        </a>
      </div>

      {/* Reset */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="w-full py-4 bg-slate-900 text-slate-500 hover:text-white rounded-2xl font-bold border border-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <RotateCw size={18} />
          {t.closing?.btn2 ||
            (isRTL ? 'تحليل نشاط تجاري آخر' : 'Analyze Another')}
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
