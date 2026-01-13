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
  Quote, Share2 
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ language, data, onReset, onBack, onVisualExp }) => {
  // 1. Fallback لضمان عدم انهيار التطبيق عند فقدان اللغة
  const t = TEXTS[language] ?? TEXTS['ar'];
  const isRTL = language === 'ar';

  // 2. Safe Objects مع قيم افتراضية لمنع "Cannot read properties of undefined"
  const dashboard = t.dashboard ?? {};
  const delivery = dashboard.delivery ?? { title: '', text: '' };
  const quote = dashboard.quote ?? { text: '', attribution: '' };
  const strategic = dashboard.strategicRecommendation ?? { title: '', text: '' };
  const marketing = dashboard.marketing ?? { persuasive: '', motivational: '' };

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
    if (actualMonthlyReviews === 0) return dashboard.statusLabels?.zero ?? '';
    const rawRank = data.searchRanking || "";
    const num = parseInt(rawRank.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return dashboard.statusLabels?.invisible ?? '';
    if (num <= 3) return dashboard.statusLabels?.strong ?? '';
    if (num <= 10) return dashboard.statusLabels?.average ?? '';
    return dashboard.statusLabels?.weak ?? '';
  };

  const currentStatus = getBusinessStatus();
  const isHealthy = actualMonthlyReviews > 5;

  const waNumber = "96566305551"; 
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-center">
               <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-3">{dashboard.age}</span>
               <span className="text-3xl font-black text-white">{ageYears}</span>
            </div>
            {/* ... بقية الـ Metrics بنفس الأسلوب الآمن ... */}
          </div>

          {/* Safe Delivery Integration Usage */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex items-start gap-5">
             <div className="p-3 bg-primary-500/10 rounded-2xl shrink-0">
                <Share2 className="w-6 h-6 text-primary-400" />
             </div>
             <div>
                <h4 className="text-white font-bold mb-2">{delivery.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{delivery.text}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Safe Quote Usage */}
      <div className="py-6 border-y border-slate-800/50 flex flex-col items-center text-center space-y-4">
         <Quote className="w-8 h-8 text-indigo-500/30" />
         <p className="text-slate-200 text-xl md:text-2xl font-black italic max-w-2xl leading-relaxed">
            "{quote.text}"
         </p>
         <span className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            {quote.attribution}
         </span>
      </div>

      {/* Safe Strategic Recommendation Usage */}
      <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
         <div className="absolute -top-12 -right-12 p-8 text-indigo-500/5">
            <Award className="w-48 h-48" />
         </div>
         <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
               <ShieldCheck className="w-6 h-6" />
               <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">{strategic.title}</h3>
            </div>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
               {strategic.text.replace('{name}', data.projectName)}
            </p>
         </div>
      </div>

      <div className="text-center space-y-12 pt-14">
         <div className="space-y-6">
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed italic">
               {marketing.persuasive}
            </p>
            <div className="space-y-4">
               <h2 className="text-6xl font-black text-white leading-tight tracking-tighter uppercase">{isRTL ? "لا تكن خفياً" : "Don't Be Invisible"}.</h2>
               <p className="text-primary-400 text-2xl max-w-2xl mx-auto font-black animate-pulse">
                  {marketing.motivational}
               </p>
            </div>
         </div>

         <div className="flex flex-col gap-6 justify-center items-center">
            <button onClick={onVisualExp} className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-[2.5rem] shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group">
                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                {t.closing?.btnVisual ?? ''}
            </button>

            <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-12 py-7 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl shadow-green-500/50 transform hover:-translate-y-2 transition-all flex items-center justify-center gap-4 group">
                   <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                   {t.closing?.btn1 ?? ''}
                </a>
                <button onClick={onReset} className="w-full md:w-auto px-12 py-7 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xl rounded-[2.5rem] border border-slate-700 transition-all flex items-center justify-center gap-4 group">
                   <RotateCw className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                   {t.closing?.btn2 ?? ''}
                </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ResultsDashboard;
