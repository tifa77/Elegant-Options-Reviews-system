// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  AlertTriangle, TrendingUp, TrendingDown, Zap, RotateCw, 
  ArrowLeft, ArrowRight, MessageCircle, Globe, Coins, 
  ShieldCheck, CheckCircle, Target, Award, UserCheck, 
  Crown, Flame, Rocket, BarChart3, FastForward, 
  ShieldAlert, ArrowDownCircle, Info, Play, HelpCircle,
  Quote, Share2 // أضيفت للاقتباس ودمج التطبيقات
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ language, data, onReset, onBack, onVisualExp }) => {
  const t = TEXTS[language];
  const isRTL = language === 'ar';

  const currentYear = new Date().getFullYear();
  const ageYears = Math.max(1, currentYear - data.establishedYear);
  const totalReviews = data.currentReviews || 0;
  
  const actualMonthlyReviews = data.monthlyGrowth || 0;
  const actualWeeklyReviews = data.weeklyGrowth || 0;
  
  const systemDailyPotential = Math.round(data.dailyCustomers * 0.10);
  const systemYearlyPotential = systemDailyPotential * 365;
  
  const avgTicket = 10; 
  const annualRevenueOpportunity = (data.dailyCustomers * 30 * 12 * 0.30) * avgTicket;

  const getBusinessStatus = () => {
    if (actualMonthlyReviews === 0) return t.dashboard.statusLabels.zero;
    const rawRank = data.searchRanking || "";
    const num = parseInt(rawRank.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return t.dashboard.statusLabels.invisible;
    if (num <= 3) return t.dashboard.statusLabels.strong;
    if (num <= 10) return t.dashboard.statusLabels.average;
    return t.dashboard.statusLabels.weak;
  };

  const currentStatus = getBusinessStatus();
  const isHealthy = actualMonthlyReviews > 5;

  const waNumber = "96566305551"; // رقم Elegant Options الرسمي
  const customWAMessage = isRTL 
    ? `مرحباً، أنا مهتم بنظام التقييمات Elegant Options لمشروعي (${data.projectName})` 
    : `Hello, I am interested in the Elegant Options reputation system for my project (${data.projectName})`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-10 animate-fade-in pb-16 relative ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* WhatsApp Floating CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-sm animate-bounce">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-lg">
            <MessageCircle className="w-6 h-6" />
            {isRTL ? "تفعيل النظام الآن" : "Activate System Now"}
          </a>
      </div>

      <div className="flex items-center justify-between px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
        <div className="flex items-center gap-2">
           <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Engine Report</span>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="bg-slate-850/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-800/50 bg-slate-900/30">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                 <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{t.dashboard.title}</h2>
           </div>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric Cards remain as per original code */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-center relative overflow-hidden group">
               <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-3">{t.dashboard.age}</span>
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white leading-none">{ageYears}</span>
                  <span className="text-[10px] text-slate-400 font-bold mt-2">{t.dashboard.years}</span>
               </div>
            </div>
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-center relative overflow-hidden group">
               <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-3">{t.dashboard.totalReviews}</span>
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-white leading-none">{totalReviews.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-bold mt-2">{t.dashboard.reviews}</span>
               </div>
            </div>
            <div className={`bg-slate-900/80 p-6 rounded-2xl border ${actualWeeklyReviews === 0 ? 'border-red-500/30' : 'border-primary-500/20'} text-center relative overflow-hidden group`}>
               <span className="text-primary-400 text-[10px] uppercase font-bold tracking-widest block mb-3">{t.dashboard.weeklyRate}</span>
               <span className={`text-3xl font-black ${actualWeeklyReviews === 0 ? 'text-red-500' : 'text-white'} leading-none`}>{actualWeeklyReviews}</span>
            </div>
            <div className={`bg-slate-900/80 p-6 rounded-2xl border ${actualMonthlyReviews === 0 ? 'border-red-500/30' : 'border-primary-500/20'} text-center relative overflow-hidden group`}>
               <span className="text-primary-400 text-[10px] uppercase font-bold tracking-widest block mb-3">{isRTL ? "معدل الشهر" : "Monthly Rate"}</span>
               <span className={`text-3xl font-black ${actualMonthlyReviews === 0 ? 'text-red-500' : 'text-white'} leading-none`}>{actualMonthlyReviews}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-indigo-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden group">
               <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform cursor-help">
                  <HelpCircle className="w-5 h-5 text-indigo-400 opacity-60" />
               </div>
               <span className="text-slate-200 font-bold text-sm mb-6 block uppercase tracking-wide">{isHealthy ? t.dashboard.protectionAnalysis : t.dashboard.lossAnalysis}</span>
               <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-white leading-none">{annualRevenueOpportunity.toLocaleString()}</span>
                  <span className="text-lg text-slate-400 font-bold">{t.dashboard.currency}</span>
               </div>
               <div className="w-full max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden mb-4 shadow-inner">
                  <div className={`h-full bg-gradient-to-r from-indigo-600 to-primary-400 ${isHealthy ? 'w-[90%]' : 'w-[40%]'} rounded-full`}></div>
               </div>
               <p className="text-[10px] text-slate-500 max-w-[240px] leading-relaxed font-bold uppercase">{isHealthy ? t.dashboard.protectionDesc : t.dashboard.lossDesc}</p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-3xl border border-green-500/10 flex flex-col relative overflow-hidden">
               <div className="absolute top-6 left-6 text-green-500/30">
                  <Globe className="w-8 h-8" />
               </div>
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

          {/* ADDITION #4: Delivery Apps Integration Card */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex items-start gap-5">
             <div className="p-3 bg-primary-500/10 rounded-2xl shrink-0">
                <Share2 className="w-6 h-6 text-primary-400" />
             </div>
             <div>
                <h4 className="text-white font-bold mb-2">{t.dashboard.delivery.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{t.dashboard.delivery.text}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="text-center py-6">
         <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">{t.report.impactTitle}</h2>
         <div className="w-24 h-2 bg-primary-500 mx-auto rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)]"></div>
         <p className="text-primary-400 text-xs font-bold mt-4 uppercase tracking-widest animate-pulse">{t.dashboard.annualProjection}</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
          <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-primary-500/5 rounded-full blur-[120px]"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-3 bg-primary-500/10 text-primary-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-primary-500/20">
                     <Rocket className="w-4 h-4 animate-bounce" /> {t.report.impactTitle}
                  </div>
                  <h4 className="text-3xl font-black text-white leading-tight">{t.report.impactDesc}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
                         <span className="text-[10px] text-slate-500 block font-black mb-2 uppercase tracking-widest">{t.dashboard.dailyVisitors}</span>
                         <span className="text-4xl font-black text-white">{data.dailyCustomers}</span>
                      </div>
                      <div className="bg-primary-500/5 p-6 rounded-2xl border border-primary-500/20 shadow-xl">
                         <span className="text-[10px] text-primary-500 block font-black mb-2 uppercase tracking-widest">{t.dashboard.expectedPulse}</span>
                         <span className="text-4xl font-black text-white">{systemDailyPotential}</span>
                      </div>
                  </div>
              </div>

              <div className="bg-slate-800 p-10 rounded-[2.5rem] border border-primary-500/30 text-center shadow-3xl relative min-w-[300px] transform hover:scale-105 transition-transform">
                  <Zap className="absolute -top-5 -right-5 w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                  <span className="text-slate-500 text-xs font-black uppercase tracking-widest block mb-4">{t.dashboard.predictedAnnual}</span>
                  <div className="flex flex-col items-center">
                      <span className="text-7xl font-black text-white leading-none tracking-tighter drop-shadow-lg">{systemYearlyPotential.toLocaleString()}</span>
                      <span className="text-sm text-primary-500 font-black uppercase tracking-[0.3em] mt-4">{t.dashboard.newReviews}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* ADDITION #2: Famous Quote Section (Credibility Booster) */}
      <div className="py-6 border-y border-slate-800/50 flex flex-col items-center text-center space-y-4">
         <Quote className="w-8 h-8 text-indigo-500/30" />
         <p className="text-slate-200 text-xl md:text-2xl font-black italic max-w-2xl leading-relaxed">
            "{t.dashboard.quote.text}"
         </p>
         <span className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            {t.dashboard.quote.attribution}
         </span>
      </div>

      {/* ADDITION #1: Strategic Recommendation Section */}
      <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
         <div className="absolute -top-12 -right-12 p-8 text-indigo-500/5">
            <Award className="w-48 h-48" />
         </div>
         <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
               <ShieldCheck className="w-6 h-6" />
               <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{t.dashboard.strategicRecommendation.title}</h3>
            </div>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
               {t.dashboard.strategicRecommendation.text.replace('{name}', data.projectName)}
            </p>
         </div>
      </div>

      {/* ADDITION #5 & #6: Motivational Pre-CTA and Marketing Content */}
      <div className="text-center space-y-12 pt-14">
         <div className="space-y-6">
            {/* Persuasive Paragraph */}
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed italic">
               {t.dashboard.marketing.persuasive}
            </p>
            <div className="space-y-4">
               <h2 className="text-6xl font-black text-white leading-tight tracking-tighter uppercase">{isRTL ? "لا تكن خفياً" : "Don't Be Invisible"}.</h2>
               {/* Motivational Phrase */}
               <p className="text-primary-400 text-2xl max-w-2xl mx-auto font-black animate-pulse">
                  {t.dashboard.marketing.motivational}
               </p>
            </div>
         </div>

         <div className="flex flex-col gap-6 justify-center items-center">
            <button onClick={onVisualExp} className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-[2.5rem] shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group">
                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                {t.closing.btnVisual}
            </button>

            <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-12 py-7 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl shadow-green-500/50 transform hover:-translate-y-2 transition-all flex items-center justify-center gap-4 group">
                   <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                   {t.closing.btn1}
                </a>
                <button onClick={onReset} className="w-full md:w-auto px-12 py-7 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xl rounded-[2.5rem] border border-slate-700 transition-all flex items-center justify-center gap-4 group">
                   <RotateCw className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                   {t.closing.btn2}
                </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ResultsDashboard;
