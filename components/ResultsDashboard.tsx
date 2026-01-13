// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  AlertTriangle, TrendingUp, TrendingDown, Zap, RotateCw, 
  ArrowLeft, ArrowRight, MessageCircle, Globe, BarChart3, Rocket, 
  ShieldCheck, CheckCircle2, DollarSign, Star, Play, HelpCircle, Quote, Share2, Award
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

  // --- محرك الأمان الرقمي (Anti-NaN Engine) ---
  
  // 1. معالجة عمر المشروع بأمان
  const currentYear = new Date().getFullYear();
  const rawEstablishedYear = Number(data.establishedYear);
  const ageYears = (Number.isFinite(rawEstablishedYear) && rawEstablishedYear > 1900 && rawEstablishedYear <= currentYear)
    ? Math.max(1, currentYear - rawEstablishedYear)
    : 1; // الافتراضي سنة واحدة لمنع NaN في القسمة

  // 2. معالجة أرقام التقييمات والزوار
  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;
  
  // 3. حسابات المعدلات والنمو (مع ضمان عدم وجود NaN)
  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;
  
  const systemDailyPotential = Math.round(dailyCustomers * 0.10); // قاعدة الـ 10%
  const annualAdditionalReviews = systemDailyPotential * 365;
  
  // 4. حسابات الأرباح المتوقعة
  const avgTicket = 10; // متوسط الفاتورة بالكويت
  const rawRevenueOpportunity = (dailyCustomers * 30 * 12 * 0.30) * avgTicket;
  const annualRevenueOpportunity = Number.isFinite(rawRevenueOpportunity) ? rawRevenueOpportunity : 0;

  const rawDynamicProfitValue = annualAdditionalReviews * avgTicket * 5;
  const dynamicProfit = Number.isFinite(rawDynamicProfitValue) 
    ? rawDynamicProfitValue.toLocaleString() 
    : "0";

  // --- منطق التشخيص الآمن ---
  const getBusinessStatus = () => {
    const dashboard = t.dashboard || {};
    if (avgReviewsPerYear < 5) return dashboard.statusLabels?.zero ?? '';
    if (avgReviewsPerYear < 20) return dashboard.statusLabels?.weak ?? '';
    if (avgReviewsPerYear < 100) return dashboard.statusLabels?.average ?? '';
    return dashboard.statusLabels?.strong ?? '';
  };

  const currentStatus = getBusinessStatus();
  const isHealthy = avgReviewsPerYear > 20;

  // الاستخدام الآمن لكائنات الترجمة المضافة حديثاً
  const dashboard = t.dashboard ?? {};
  const delivery = dashboard.delivery ?? { title: '', text: '' };
  const quote = dashboard.quote ?? { text: '', attribution: '' };
  const strategic = dashboard.strategicRecommendation ?? { title: '', text: '' };
  const marketing = dashboard.marketing ?? { persuasive: '', motivational: '' };

  const waNumber = "96566305551";
  const customWAMessage = isRTL 
    ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName || 'جديد'})` 
    : `Hello, interested in the system for (${data.projectName || 'New Project'})`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-10 animate-fade-in pb-16 relative ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* زر الرجوع الآمن */}
      <div className="flex items-center justify-between px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
      </div>

      <div className="bg-slate-850/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-800/50 bg-slate-900/30">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                 <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{dashboard.title}</h2>
           </div>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-center">
               <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-3">{dashboard.age}</span>
               <span className="text-3xl font-black">{ageYears}</span>
            </div>
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-center">
               <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-3">{dashboard.totalReviews}</span>
               <span className="text-3xl font-black">{totalReviews.toLocaleString()}</span>
            </div>
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-indigo-500/20 text-center">
               <span className="text-indigo-400 text-[10px] uppercase font-bold tracking-widest block mb-3">{isRTL ? "المعدل السنوي" : "Annual Avg"}</span>
               <span className="text-3xl font-black text-indigo-400">{avgReviewsPerYear}</span>
            </div>
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-center">
               <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-3">{isRTL ? "المعدل الشهري" : "Monthly Avg"}</span>
               <span className="text-3xl font-black">{(avgReviewsPerYear / 12).toFixed(1)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-indigo-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <span className="text-slate-200 font-bold text-sm mb-6 block uppercase tracking-wide">{isHealthy ? t.dashboard.protectionAnalysis : t.dashboard.lossAnalysis}</span>
               <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-white leading-none">{annualRevenueOpportunity.toLocaleString()}</span>
                  <span className="text-lg text-slate-400 font-bold">{t.dashboard.currency}</span>
               </div>
               <p className="text-[10px] text-slate-500 max-w-[240px] leading-relaxed font-bold uppercase">{isHealthy ? t.dashboard.protectionDesc : t.dashboard.lossDesc}</p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-3xl border border-green-500/10 flex flex-col relative overflow-hidden">
               <div className="flex flex-col items-end">
                  <span className="text-slate-300 font-bold text-sm mb-4">{t.dashboard.rankTitle}</span>
                  <div className={`text-3xl md:text-4xl font-black leading-tight mb-6 text-center w-full ${isHealthy ? 'text-green-500' : 'text-red-500'}`}>
                    {currentStatus}
                  </div>
                  <div className={`${isHealthy ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg mx-auto md:mx-0`}>
                     {isHealthy ? t.dashboard.king : t.dashboard.ghost}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* قسم التوصية الاستراتيجية الآمن */}
      <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
         <div className="relative z-10 space-y-4 text-white">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
               <ShieldCheck className="w-6 h-6" />
               <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{strategic.title}</h3>
            </div>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
               {strategic.text.replace('{name}', data.projectName || (isRTL ? 'مشروعكم' : 'Your Project'))}
            </p>
         </div>
      </div>

      {/* قسم الأرباح الديناميكي المحمي من NaN */}
      <div className="bg-slate-900 border border-slate-700 rounded-[3rem] p-10 md:p-14 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6">
                  <h4 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">{t.report.impactTitle}</h4>
                  <p className="text-slate-400 text-lg italic leading-relaxed">{marketing.persuasive}</p>
              </div>

              <div className="bg-slate-800 p-10 rounded-[2.5rem] border border-primary-500/30 text-center shadow-3xl min-w-[300px]">
                  <Zap className="absolute -top-5 -right-5 w-12 h-12 text-yellow-400 fill-yellow-400" />
                  <span className="text-slate-500 text-xs font-black uppercase tracking-widest block mb-4">{isRTL ? "الأرباح السنوية الإضافية" : "Additional Annual Profit"}</span>
                  <div className="flex flex-col items-center">
                      <span className="text-7xl font-black text-white leading-none tracking-tighter">{dynamicProfit}</span>
                      <span className="text-sm text-primary-500 font-black uppercase tracking-[0.3em] mt-4">{t.dashboard.currency}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* أزرار الإجراءات النهائية */}
      <div className="flex flex-col gap-6 justify-center items-center">
         <button onClick={onVisualExp} className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-[2.5rem] transition-all flex items-center justify-center gap-4 group">
             <Play className="w-6 h-6 fill-current" />
             {t.closing?.btnVisual ?? 'Visual Experience'}
         </button>

         <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
             <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-12 py-7 bg-green-500 hover:bg-green-600 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl shadow-green-500/50 transition-all flex items-center justify-center gap-4 group">
                <MessageCircle className="w-8 h-8" />
                {t.closing?.btn1 ?? 'Contact Us'}
             </a>
             <button onClick={onReset} className="w-full md:w-auto px-12 py-7 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xl rounded-[2.5rem] border border-slate-700 transition-all flex items-center justify-center gap-4 group">
                <RotateCw className="w-7 h-7" />
                {t.closing?.btn2 ?? 'Reset'}
             </button>
         </div>
      </div>

    </div>
  );
};

export default ResultsDashboard;
