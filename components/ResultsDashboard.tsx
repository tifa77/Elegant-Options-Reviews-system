// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  // إصلاح أخطاء ReferenceError عبر استيراد كافة الأيقونات المستخدمة
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, ArrowUpRight,
  MessageCircle, RotateCw, Play, Zap, BarChart3,
  Utensils, Bike, Percent, Users, Award, CheckCircle, 
  Eye, ShieldCheck, DollarSign, Star, HelpCircle, Quote as QuoteIcon, Share2, Globe, TrendingDown, Bot
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ language, data, onReset, onBack, onVisualExp }) => {
  const t = TEXTS[language] ?? TEXTS['ar'];
  const isRTL = language === 'ar';
  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'مطعم' || data.projectType === 'cafe';

  // --- 1. محرك الأمان الرقمي والحسابات (حل مشكلة الـ NaN) ---
  const currentYear = new Date().getFullYear();
  const rawEstablishedYear = Number(data.establishedYear);
  
  // التأكد من أن عمر المشروع دائماً رقم صحيح ولا يقل عن سنة واحدة لمنع NaN في القسمة
  const ageYears = (Number.isFinite(rawEstablishedYear) && rawEstablishedYear > 1900 && rawEstablishedYear <= currentYear)
    ? Math.max(1, currentYear - rawEstablishedYear)
    : 1;

  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;
  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;

  // منطق العملة والإقليم
  const getRegionalData = () => {
    const address = (data.address || '').toLowerCase();
    const isKuwait = address.includes('kuwait') || address.includes('الكويت');
    return isKuwait 
      ? { symbol: isRTL ? "د.ك" : "KWD", ticket: 20 }
      : { symbol: isRTL ? "دولار" : "USD", ticket: 60 };
  };
  const regional = getRegionalData();
  const currency = regional.symbol;

  // حسابات النمو (المستقبل مع نظام Elegant Options)
  const systemDailyPotential = Math.round(dailyCustomers * 0.10); // قاعدة الـ 10%
  const annualAdditionalReviews = systemDailyPotential * 365;
  const projectedWeekly = Math.max(8, (avgReviewsPerYear / 52) * (isRestaurant ? 8 : 5));
  const projectedMonthly = Math.max(35, (avgReviewsPerYear / 12) * (isRestaurant ? 8 : 5));
  
  // معادلة نزيف الإيرادات
  const customerLossMultiplier = 4;
  const lostCustomersCount = Math.max(50, annualAdditionalReviews * customerLossMultiplier);
  const lostRevenue = lostCustomersCount * regional.ticket;

  // الأرباح الديناميكية
  const dynamicProfitValue = annualAdditionalReviews * regional.ticket * 0.5;
  const dynamicProfit = Number.isFinite(dynamicProfitValue) ? dynamicProfitValue.toLocaleString() : '0';

  // --- 2. التصنيف السوقي (SEO Focus) ---
  const getMarketStatus = () => {
    const incentive = isRTL 
      ? "⚠️ تنبيه: المنافسون في منطقتك يكثفون نشاطهم الآن لتجاوز تصنيفك في نتائج البحث."
      : "⚠️ Alert: Competitors are intensifying their activity to overtake your search ranking.";

    if (avgReviewsPerYear < 15) {
      return { 
        title: isRTL ? "شبح رقمي - مخفي" : "Digital Ghost", 
        desc: isRTL ? "أنت غير مرئي للعملاء الجدد. محركات البحث تتجاهل نشاطك بسبب ضعف التفاعل الحقيقي." : "Invisible to new customers. Search engines ignore you due to low engagement.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost, incentive 
      };
    } else if (avgReviewsPerYear < 80) {
      return { 
        title: isRTL ? "تواجد متوسط - مهدد" : "Average Presence", 
        desc: isRTL ? "أنت موجود ولكنك مهدد. المنافسون يبتلعون حصتك السوقية تدريجياً عبر الأتمتة." : "You are present but at risk. Competitors are eating your market share via automation.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target, incentive 
      };
    }
    return { 
      title: isRTL ? "رائد يحتاج أتمتة" : "Market Leader", 
      desc: isRTL ? "أداء ممتاز، ولكن الحفاظ على القمة يحتاج ذكاءً اصطناعياً لمنع أي ثغرة يستغلها المنافسون." : "Great performance, but staying on top requires AI to prevent competitor breakthroughs.",
      color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown, incentive 
    };
  };

  const status = getMarketStatus();
  const dashboard = t.dashboard ?? {};

  // روابط الواتساب الرسمية لـ Elegant Options
  const waNumber = "96566305551"; 
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `أريد تفعيل نظام النمو وإيقاف خسارة العملاء لمشروعي (${data.projectName})` : `I want to activate growth for (${data.projectName})`)}`;

  return (
    <div className={`max-w-5xl mx-auto space-y-12 animate-fade-in pb-24 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. Header & Back Button (Fix for Arrow icons) */}
      <div className="flex items-center justify-between px-2 pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span className="font-bold text-sm uppercase">{t.back}</span>
        </button>
        <span className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black text-indigo-400 uppercase">Growth Intelligence Report</span>
      </div>

      {/* 2. Hero Section: Market Diagnosis (Fix for Ghost/Target icons) */}
      <div className={`p-10 md:p-14 rounded-[3rem] border ${status.border} ${status.bg} backdrop-blur-md relative overflow-hidden shadow-2xl`}>
        <div className="absolute top-0 right-0 p-4 opacity-5"><status.icon size={250} /></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className={`p-8 rounded-full bg-slate-950 shadow-2xl ${status.color} border border-white/5`}>
            <status.icon size={64} />
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">{isRTL ? "التشخيص السوقي الفعلي" : "Real Market Diagnosis"}</h3>
            <div className={`text-5xl md:text-7xl font-black ${status.color} tracking-tighter italic`}>{status.title}</div>
            <p className="text-slate-200 text-lg md:text-xl font-bold leading-relaxed">{status.desc}</p>
            <div className="inline-flex p-4 bg-black/60 rounded-2xl border border-orange-500/20 text-orange-400 font-black animate-pulse">
               {status.incentive}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Metrics Grid (Fix for NaN issue) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 text-center">
           <span className="text-slate-500 text-[10px] uppercase font-black block mb-3">{isRTL ? 'عمر النشاط' : 'Age'}</span>
           <span className="text-4xl font-black text-white">{ageYears}</span>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 text-center">
           <span className="text-slate-500 text-[10px] uppercase font-black block mb-3">{isRTL ? 'إجمالي التقييمات' : 'Total Reviews'}</span>
           <span className="text-4xl font-black text-white">{totalReviews.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-indigo-500/20 text-center">
           <span className="text-indigo-400 text-[10px] uppercase font-black block mb-3">{isRTL ? 'المعدل السنوي' : 'Annual Avg'}</span>
           <span className="text-4xl font-black text-indigo-400">{avgReviewsPerYear}</span>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 text-center">
           <span className="text-slate-500 text-[10px] uppercase font-black block mb-3">{isRTL ? 'المعدل الشهري' : 'Monthly Avg'}</span>
           <span className="text-4xl font-black text-white">{(avgReviewsPerYear / 12).toFixed(1)}</span>
        </div>
      </div>

      {/* 4. System Features Section (Fix for Bot/Shield icons) */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400"><Bot size={36} /></div>
          <h4 className="text-2xl font-black text-white">AI Smart Replies</h4>
          <p className="text-slate-400 leading-relaxed">الرد الآلي والذكي على كافة التقييمات في Google Maps على مدار 24 ساعة، مما يحسن ظهورك في محركات البحث.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400"><ShieldCheck size={36} /></div>
          <h4 className="text-2xl font-black text-white">Reputation Shield</h4>
          [cite_start]<p className="text-slate-400 leading-relaxed">فلترة ذكية (نظام شعلة) تمنع التقييمات السلبية من الظهور علناً، وتحولها كشكوى خاصة للإدارة[cite: 74, 10].</p>
        </div>
        <div className={`bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6 shadow-xl ${!isRestaurant && 'opacity-50 grayscale'}`}>
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400"><Bike size={36} /></div>
          <h4 className="text-2xl font-black text-white">Delivery Integration</h4>
          <p className="text-slate-400 leading-relaxed">ربط مباشر مع طلبات وكيتا؛ [cite_start]إرسال رسائل طلب تقييم تلقائية عبر واتساب فور استلام الطلب[cite: 72, 8].</p>
        </div>
      </div>

      {/* 5. Revenue Leak (Annual Opportunity Lost) */}
      <div className="bg-gradient-to-br from-red-950 to-slate-950 p-12 rounded-[4rem] border border-red-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl italic">LOSS</div>
        <div className="relative z-10 text-center md:text-right space-y-8">
             <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-5 py-2 rounded-full text-xs font-black uppercase border border-red-500/20 animate-pulse">
               <AlertTriangle size={14} /> {isRTL ? "نزيف الإيرادات السنوي (فرصة ضائعة)" : "Annual Revenue Leak"}
             </div>
             <div className="flex flex-col md:flex-row items-baseline gap-4 justify-center md:justify-start">
                <div className="text-8xl md:text-[10rem] font-black text-white tracking-tighter drop-shadow-2xl">
                  {lostRevenue.toLocaleString()}
                </div>
                <div className="text-3xl md:text-6xl font-black text-red-500 uppercase">{currency}</div>
             </div>
             <p className="text-slate-500 font-black text-sm uppercase tracking-[0.3em]">{isRTL ? "خسارة سنوية تقديرية" : "Estimated Annual Loss"}</p>
        </div>
      </div>

      {/* 6. Growth Opportunity (Annual Potential) */}
      <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[4rem] p-12 relative overflow-hidden shadow-3xl">
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-3 bg-indigo-500/10 text-indigo-400 px-5 py-2 rounded-full text-xs font-black uppercase border border-indigo-500/20">
                     <Rocket size={16} /> {isRTL ? "أثر تفعيل النظام" : "System Impact"}
                  </div>
                  <h4 className="text-4xl font-black text-white italic">{isRTL ? "أرباح إضافية بانتظار تفعيلها" : "Unlocked Profits"}</h4>
                  <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-indigo-500/30 pl-8">
                    [cite_start]نظام Elegant Options يحمي ولاء عملائك ويحول كل عميل راضٍ إلى مسوق دائم لعلامتك التجارية[cite: 118, 59].
                  </p>
              </div>
              <div className="bg-slate-800/50 p-14 rounded-[3.5rem] border border-indigo-500/30 text-center shadow-3xl min-w-[340px] transform hover:scale-105 transition-transform backdrop-blur-xl">
                  <Zap className="absolute -top-8 -right-8 w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                  <span className="text-slate-500 text-xs font-black uppercase block mb-6">{isRTL ? "أرباح سنوية إضافية محتملة" : "Potential Annual Profit"}</span>
                  <div className="flex flex-col items-center">
                      <span className="text-8xl font-black text-white leading-none tracking-tighter drop-shadow-xl">{dynamicProfit}</span>
                      <span className="text-2xl text-indigo-400 font-black uppercase mt-6">{currency}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* 7. Action Buttons (Fix for Play icon) */}
      <div className="flex flex-col md:flex-row gap-8 justify-center pt-16">
          <button onClick={onVisualExp} className="px-16 py-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-3xl rounded-[3rem] shadow-2xl flex items-center justify-center gap-5 transition-all">
              <Play size={28} fill="currentColor" /> {isRTL ? "تجربة بصرية" : "Visual Experience"}
          </button>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="px-16 py-8 bg-green-500 hover:bg-green-600 text-white font-black text-4xl rounded-[3rem] shadow-2xl flex items-center justify-center gap-6 transition-all animate-pulse">
              <MessageCircle size={36} /> {isRTL ? "اطلب النظام الآن" : "Order Now"}
          </a>
      </div>

      {/* 8. Reset Button (Fix for RotateCw icon) */}
      <div className="text-center pt-10">
        <button onClick={onReset} className="inline-flex items-center gap-4 text-slate-500 hover:text-white font-black text-2xl transition-opacity opacity-50 hover:opacity-100">
          <RotateCw size={24} /> {isRTL ? "تحليل نشاط آخر" : "Analyze Another"}
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
