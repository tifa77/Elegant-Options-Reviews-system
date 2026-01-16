// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
// استيراد كافة الأيقونات المستخدمة بوضوح لمنع أي ReferenceError
import { 
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, MessageCircle, RotateCw, 
  Play, Zap, BarChart3, Bike, Award, CheckCircle, 
  Eye, ShieldCheck, DollarSign, Star, HelpCircle, Quote, Share2, Globe, Rocket, Bot
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ language, data, onReset, onBack, onVisualExp }) => {
  // 1. حماية كائن الترجمة لمنع الانهيار
  const t = TEXTS[language] ?? TEXTS['ar'];
  const isRTL = language === 'ar';
  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'مطعم' || data.projectType === 'cafe';

  // --- 2. محرك الأمان الرقمي (Anti-NaN Engine) ---
  const currentYear = new Date().getFullYear();
  const rawYear = Number(data.establishedYear);
  const ageYears = (Number.isFinite(rawYear) && rawYear > 1900 && rawYear <= currentYear)
    ? Math.max(1, currentYear - rawYear)
    : 1;

  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;
  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;

  // المعدلات الحالية (Baseline)
  const baselineWeekly = Number(data.weeklyGrowth) || Number((avgReviewsPerYear / 52).toFixed(1)) || 0;
  const baselineDaily = Number((baselineWeekly / 7).toFixed(1)) || 0;
  const baselineMonthly = Number(data.monthlyGrowth) || Number((baselineWeekly * 4.3).toFixed(1)) || 0;

  // قوة النظام (Elegant Options PRO) - قاعدة الـ 10%
  const systemDailyPotential = Math.round(dailyCustomers * 0.10);
  const systemWeekly = systemDailyPotential * 7;
  const systemMonthly = systemDailyPotential * 30;
  const systemYearly = systemDailyPotential * 365;

  // مقاييس الفجوة (Lost)
  const lostDailyReviews = Math.max(0, systemDailyPotential - baselineDaily);

  // منطق العملة
  const getRegionalData = () => {
    const address = (data.address || '').toLowerCase();
    const isKuwait = address.includes('kuwait') || address.includes('الكويت');
    return isKuwait 
      ? { symbol: isRTL ? "د.ك" : "KWD", ticket: 20 }
      : { symbol: isRTL ? "دولار" : "USD", ticket: 60 };
  };
  const regional = getRegionalData();
  const currency = regional.symbol;

  // الحسابات المالية
  const lostCustomersCount = Math.max(50, (systemYearly - avgReviewsPerYear) * 4);
  const lostRevenue = lostCustomersCount * regional.ticket;
  const dynamicProfit = (systemYearly * regional.ticket * 0.5).toLocaleString();

  // --- 3. منطق التشخيص السوقي المتناسق ---
  const getMarketStatus = () => {
    if (avgReviewsPerYear < 15) {
      return { 
        id: 'ghost',
        title: isRTL ? "شبح رقمي - مخفي" : "Digital Ghost", 
        desc: isRTL ? "أنت غير مرئي للعملاء الجدد. محركات البحث تتجاهل نشاطك بسبب ضعف التفاعل الحقيقي." : "Invisible to new customers. Search engines ignore you due to low engagement.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost, theme: 'red'
      };
    } else if (avgReviewsPerYear < 80) {
      return { 
        id: 'average',
        title: isRTL ? "تواجد متوسط - مهدد" : "Average Presence", 
        desc: isRTL ? "أنت موجود ولكنك مهدد. المنافسون يبتلعون حصتك السوقية تدريجياً عبر الأتمتة." : "You are present but at risk. Competitors are eating your market share via automation.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target, theme: 'yellow'
      };
    }
    return { 
      id: 'strong',
      title: isRTL ? "رائد يحتاج أتمتة" : "Market Leader", 
      desc: isRTL ? "أداء ممتاز، ولكن الحفاظ على القمة يحتاج ذكاءً اصطناعياً لمنع أي ثغرة يستغلها المنافسون." : "Great performance, but staying on top requires AI to prevent competitor breakthroughs.",
      color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown, theme: 'green'
    };
  };

  const status = getMarketStatus();

  // --- 4. حماية نصوص الترجمة المتقدمة ---
  const d = t.dashboard || {};
  const strategic = d.strategicRecommendation || { title: 'Strategic Recommendation', text: 'Implementation recommended.' };
  const marketing = d.marketing || { persuasive: '', motivational: '' };
  const quote = d.quote || { text: 'A one-star increase leads to 5-9% revenue growth.', attribution: 'Harvard Business School' };

  const waNumber = "96566305551";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `أريد تفعيل نظام النمو وإيقاف خسارة العملاء لمشروعي (${data.projectName})` : `I want to activate growth for (${data.projectName})`)}`;

  return (
    <div className={`max-w-5xl mx-auto space-y-16 animate-fade-in pb-32 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* هيدر بسيط */}
      <div className="flex items-center justify-between px-2 pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span className="font-bold text-sm uppercase">{t.back}</span>
        </button>
        <span className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black text-indigo-400 uppercase">Growth Intelligence Report</span>
      </div>

      {/* 1. تشخيص سوقي قوي */}
      <div className={`p-10 md:p-14 rounded-[3rem] border ${status.border} ${status.bg} backdrop-blur-md relative overflow-hidden group shadow-2xl`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <status.icon size={250} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className={`p-8 rounded-full bg-slate-950 shadow-2xl ${status.color} border border-white/5`}>
            <status.icon size={64} />
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">{isRTL ? "التشخيص السوقي الفعلي" : "Real Market Diagnosis"}</h3>
            <div className={`text-5xl md:text-7xl font-black ${status.color} tracking-tighter italic uppercase`}>{status.title}</div>
            <p className="text-slate-200 text-lg md:text-xl font-bold leading-relaxed">{status.desc}</p>
          </div>
        </div>
      </div>

      {/* 2. أرقام أساسية آمنة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isRTL ? 'عمر النشاط' : 'Business Age', value: ageYears, sub: isRTL ? 'سنوات' : 'Years' },
          { label: isRTL ? 'إجمالي التقييمات' : 'Total Reviews', value: totalReviews.toLocaleString(), sub: isRTL ? 'تقييم' : 'Reviews' },
          { label: isRTL ? 'المعدل السنوي' : 'Annual Avg', value: avgReviewsPerYear, sub: isRTL ? 'تقييم / سنة' : 'per year', color: 'text-indigo-400' },
          { label: isRTL ? 'المعدل الشهري' : 'Monthly Avg', value: (avgReviewsPerYear / 12).toFixed(1), sub: isRTL ? 'تقييم / شهر' : 'per month' }
        ].map((m, i) => (
          <div key={i} className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 text-center shadow-lg group hover:border-slate-600 transition-all">
             <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest block mb-3">{m.label}</span>
             <span className={`text-4xl font-black text-white ${m.color || ''}`}>{m.value}</span>
             <span className="text-[10px] text-slate-500 font-bold mt-2 block uppercase">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* 3. مقارنة الأداء (Landing Page Layout) */}
      <div className="space-y-10">
        {/* الوضع اليدوي الحالي */}
        <div className={`bg-slate-900/80 p-10 md:p-14 rounded-[3.5rem] border-2 ${status.border} relative overflow-hidden shadow-2xl`}>
           <div className="flex flex-col md:flex-row justify-between gap-10 relative z-10">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6 text-white">
                  {status.id === 'strong' ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />}
                  <h3 className="font-black text-2xl uppercase tracking-tighter">{isRTL ? "الوضع اليدوي الحالي" : "Manual Status"}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-white">
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <span className="text-slate-500 text-[10px] block mb-1 uppercase font-black">{isRTL ? "المعدل اليومي" : "Daily Rate"}</span>
                    <span className="text-2xl font-black">{baselineDaily}</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <span className="text-slate-500 text-[10px] block mb-1 uppercase font-black">{isRTL ? "المعدل الأسبوعي" : "Weekly Rate"}</span>
                    <span className="text-2xl font-black">{baselineWeekly}</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <span className="text-slate-500 text-[10px] block mb-1 uppercase font-black">{isRTL ? "المعدل الشهري" : "Monthly Rate"}</span>
                    <span className="text-2xl font-black">{baselineMonthly}</span>
                  </div>
                </div>
              </div>
              {/* التقييمات المفقودة */}
              <div className="w-full md:w-80 bg-red-500/5 rounded-3xl p-8 border border-red-500/20 text-center space-y-4">
                <AlertTriangle className="text-red-500 mx-auto" size={40} />
                <h4 className="text-red-500 font-black text-sm uppercase">{isRTL ? "نزيف الفرص" : "Lost Reviews"}</h4>
                <div className="text-5xl font-black text-white">-{lostDailyReviews}</div>
                <p className="text-red-400/80 text-[10px] font-bold uppercase tracking-widest">{isRTL ? "تقييم تفقده يومياً" : "Lost every day"}</p>
              </div>
           </div>
        </div>

        {/* مع نظام Elegant Options PRO */}
        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 p-10 md:p-16 rounded-[4rem] border-4 border-indigo-500/30 relative overflow-hidden shadow-2xl group">
           <div className="absolute top-0 right-0 p-8 text-indigo-500/10 group-hover:scale-110 transition-transform duration-700"><Rocket size={200} /></div>
           <div className="relative z-10 space-y-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-indigo-500/20 pb-10">
                <div className="space-y-4 text-center md:text-left">
                  <div className="flex items-center gap-4 justify
