import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, 
  MessageCircle, RotateCw, Zap, Bike, 
  ShieldAlert, Star, TrendingDown, Eye, Quote, CheckCircle2, ThumbsUp, Sparkles, Lock
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
  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'مطعم' || data.projectType === 'cafe';

  // 1. إعدادات المنطقة والعملة
  const getRegionalData = () => {
    const address = data.address?.toLowerCase() || "";
    const isKuwait = address.includes("kuwait") || address.includes("الكويت");
    
    // قيمة الولاء المفقودة (Loyalty Value) = 1 وحدة عملة (أقل التوقعات)
    if (isKuwait) {
      return { symbol: isRTL ? "د.ك" : "KWD", loyaltyVal: 1 }; 
    } else {
      return { symbol: isRTL ? "دولار" : "USD", loyaltyVal: 1 }; 
    }
  };

  const regional = getRegionalData();
  const currency = regional.symbol;

  // استخراج عدد العملاء اليومي
  const dailyCustomers = Number(data.dailyCustomers) || 50; 

  // 2. معادلة النمو (30% من العملاء يقيمون)
  const conversionRate = 0.30; // 30%
  const potentialDailyReviews = Math.floor(dailyCustomers * conversionRate);
  const potentialMonthlyReviews = potentialDailyReviews * 30;
  const potentialYearlyReviews = potentialMonthlyReviews * 12;

  // 3. معادلة "الأرباح الضائعة من الولاء" 
  // المنطق: 30% عملاء × 365 يوم × 1 دينار قيمة ولاء متكررة
  const yearlyRevenueLeak = potentialYearlyReviews * regional.loyaltyVal;
  const monthlyRevenueLeak = potentialMonthlyReviews * regional.loyaltyVal;

  // 4. التصنيف السوقي الحالي
  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearly = currentMonthly * 12;
  const currentWeekly = data.weeklyGrowth || 0;

  const getMarketStatus = () => {
    if (currentMonthly <= 5) {
      return { 
        title: isRTL ? "شبح رقمي (غير مرئي)" : "Digital Ghost", 
        desc: isRTL 
          ? "العملاء يبحثون عنك ولا يجدونك. أنت تمنح منافسيك الفوز مجاناً."
          : "Customers search but can't find you. You are giving competitors a free win.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost 
      };
    } else if (currentMonthly <= 30) {
      return { 
        title: isRTL ? "تواجد ضعيف" : "Weak Presence", 
        desc: isRTL 
          ? "أنت موجود ولكنك الخيار الثاني أو الثالث دائماً."
          : "You are there, but always the second or third choice.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target 
      };
    }
    return { 
      title: isRTL ? "منافس قوي" : "Strong Contender", 
      desc: isRTL 
          ? "أداء جيد، ولكن الحفاظ على القمة يتطلب أتمتة."
          : "Good performance, but staying on top requires automation.",
      color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown 
    };
  };

  const status = getMarketStatus();
  const waNumber = "96550656365";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `مرحباً، قمت بفحص مشروعي (${data.projectName}) ووجدت فرصة لزيادة ولاء العملاء بقيمة ${yearlyRevenueLeak} ${currency}. أريد تفاصيل النظام.` : `Hi, I audited (${data.projectName}) and found a loyalty opportunity of ${yearlyRevenueLeak} ${currency}. I need details.`)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-8 animate-fade-in pb-24 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
        <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          AI GROWTH REPORT
        </span>
      </div>

      {/* 1. Market Diagnosis Card */}
      <div className={`p-8 rounded-[2.5rem] border ${status.border} ${status.bg} backdrop-blur-sm relative overflow-hidden group shadow-2xl`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <status.icon size={150} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
          <div className={`p-6 rounded-full bg-slate-900 shadow-2xl ${status.color}`}>
            <status.icon size={48} />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">{isRTL ? "التشخيص السوقي" : "Market Diagnosis"}</h3>
            <div className={`text-4xl font-black ${status.color} mb-3`}>{status.title}</div>
            <p className="text-slate-200 text-lg font-medium leading-relaxed">
                {status.desc}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Review Breakdown (Restored & Cleaned) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <span className="text-slate-500 text-xs font-bold block mb-2">{isRTL ? "إجمالي التقييمات" : "Total Reviews"}</span>
          <div className="text-3xl font-black text-white">{data.currentReviews || 0}</div>
        </div>
        {/* Positive */}
        <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
          <span className="text-green-500 text-xs font-bold block mb-2">{isRTL ? "إيجابية (4-5 نجوم)" : "Positive"}</span>
          <div className="text-3xl font-black text-green-400">{data.positiveReviews || 0}</div>
        </div>
        {/* Negative with Elegant Options Warning */}
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20 relative">
          <span className="text-red-500 text-xs font-bold block mb-2">{isRTL ? "سلبية (1-3 نجوم)" : "Negative"}</span>
          <div className="text-3xl font-black text-red-500">{data.negativeReviews || 0}</div>
          
          {/* Protection Note */}
          {(data.negativeReviews || 0) > 0 && (
            <div className="mt-3 flex items-start gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/10">
                <ShieldAlert size={14} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-300 leading-tight">
                    {isRTL 
                     ? "لو كنت تستخدم نظام الحماية من Elegant Options، لتم تحويل هذه التقييمات إلى شكاوى سرية."
                     : "With Elegant Options Protection, these would be private complaints."}
                </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Comparison Section (Restored) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Status */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 relative">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
             <Activity className="text-slate-500" size={20} />
             <h3 className="text-slate-400 font-bold">{isRTL ? "الوضع الحالي (بدون نظام)" : "Current Status"}</h3>
           </div>
           <div className="space-y-6">
             <div className="flex justify-between items-end">
               <span className="text-slate-500 text-sm font-medium">{isRTL ? "النمو الأسبوعي" : "Weekly Growth"}</span>
               <span className="text-2xl font-black text-slate-300">{currentWeekly}</span>
             </div>
             <div className="flex justify-between items-end">
               <span className="text-slate-500 text-sm font-medium">{isRTL ? "النمو الشهري" : "Monthly Growth"}</span>
               <span className="text-2xl font-black text-slate-300">{currentMonthly}</span>
             </div>
             <div className="flex justify-between items-end pt-2 border-t border-slate-800/50">
               <span className="text-slate-500 text-xs font-medium">{isRTL ? "رصيد التقييمات السنوي" : "Annual Asset"}</span>
               <span className="text-xl font-bold text-slate-400">{currentYearly}</span>
             </div>
           </div>
        </div>

        {/* With Elegant Options */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-primary-500/30 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-600"></div>
           <div className="flex items-center gap-3 mb-6 border-b border-primary-500/20 pb-4">
             <Zap className="text-primary-400 fill-primary-400" size={20} />
             <h3 className="text-white font-bold">{isRTL ? "مع Elegant Options" : "With Elegant Options"} <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-md">PRO</span></h3>
           </div>
           <div className="space-y-6">
             <div className="flex justify-between items-end">
               <span className="text-blue-100 text-sm font-medium">{isRTL ? "النمو الأسبوعي المتوقع" : "Projected Weekly"}</span>
               <div className="flex items-center gap-2">
                 <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">30% Rate</span>
                 <span className="text-3xl font-black text-primary-400">+{Math.floor(potentialDailyReviews * 7)}</span>
               </div>
             </div>
             <div className="flex justify-between items-end">
               <span className="text-blue-100 text-sm font-medium">{isRTL ? "النمو الشهري المتوقع" : "Projected Monthly"}</span>
               <span className="text-3xl font-black text-primary-400">+{potentialMonthlyReviews}</span>
             </div>
             <div className="flex justify-between items-center pt-2 border-t border-primary-500/20">
               <span className="text-blue-200 text-xs font-medium">{isRTL ? "رصيد التقييمات السنوي" : "Annual Asset"}</span>
               <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-green
