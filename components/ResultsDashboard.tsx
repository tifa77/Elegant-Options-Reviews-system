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
  ArrowUpRight,
  MessageCircle,
  RotateCw,
  Play,
  Zap,
  BarChart3,
  Utensils,
  Bike,
  Percent,
  Users,
  Award,
  CheckCircle,
  Eye,
  ShieldCheck,
  DollarSign,
  Star,
  HelpCircle,
  Quote,
  Share2,
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
    Number((avgReviewsPerYear / 52).toFixed(1)) /* قد يكون 0 في البدايات */ ||
    0;

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

      {/* Comparison Section */}
      <div className="grid md:grid-cols-2 gap-8 text-white">
        {/* Current manual status */}
        <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-slate-800 relative">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
            <TrendingDown className="text-red-500" size={28} />
            <h3 className="text-slate-300 font-black text-xl uppercase tracking-tighter">
              {isRTL ? 'الوضع اليدوي الحالي' : 'Manual Status'}
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm font-bold uppercase">
                {isRTL ? 'النمو الأسبوعي (فعلي)' : 'Weekly Growth (Actual)'}
              </span>
              <span className="text-3xl font-black text-slate-300">
                {baselineWeekly}
              </span>
            </div>
            <p className="text-red-400 text-sm font-bold italic leading-relaxed border-t border-slate-800/50 pt-4">
              {isRTL
                ? '⚠️ المنافسون يستغلون ضعف الوجود الرقمي ويزيدون أرباحهم.'
                : '⚠️ Competitors are exploiting this weak presence.'}
            </p>
          </div>
        </div>

        {/* With Elegant Options PRO */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 p-10 rounded-[3rem] border-2 border-indigo-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 text-indigo-500/10">
            <Rocket size={120} />
          </div>
          <div className="flex items-center gap-4 mb-8 border-b border-indigo-500/20 pb-6 text-white">
            <Zap className="text-indigo-400 fill-indigo-400" size={28} />
            <h3 className="text-white font-black text-xl uppercase tracking-tighter">
              With Elegant Options PRO
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-indigo-200 text-sm font-bold uppercase">
                {isRTL ? 'المعدل الإضافي المتوقع' : 'Projected Extra Weekly'}
              </span>
              <span className="text-4xl font-black text-indigo-400">
                +{projectedWeeklyExtra}
              </span>
            </div>
            <p className="text-indigo-300 text-xs font-bold leading-relaxed pt-2">
              {isRTL
                ? 'كل أسبوع تنضم مجموعة جديدة من العملاء لتقييم نشاطك، وتتحول التقييمات إلى زيارات متكررة ومبيعات حقيقية.'
                : 'Every week, new customers join your rating funnel, turning reviews into repeat visits and real sales.'}
            </p>
            <div className="pt-4 border-t border-indigo-500/20 flex justify-between items-center">
              <span className="text-indigo-300 text-xs font-black uppercase">
                {isRTL ? 'زيادة سنوية تقديرية' : 'Annual Increase'}
              </span>
              <div className="bg-green-500 text-black px-4 py-1 rounded-full font-black text-sm">
                +{percentageIncrease}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Features */}
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

      {/* Dynamic Profit Section */}
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

      {/* Action Buttons */}
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
