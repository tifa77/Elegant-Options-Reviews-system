// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowRight, ArrowLeft, Target, Ghost, Crown, Activity, Zap, Bike, 
  ShieldAlert, TrendingDown, Eye, Quote, CheckCircle2, Sparkles, Lock, 
  AlertOctagon, Loader2, RotateCw, Play, ShieldCheck, TrendingUp, History, UserCheck
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ language, data, onReset, onBack, onVisualExp }) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>جاري تحميل التقرير...</p>
      </div>
    );
  }

  const t = TEXTS[language];
  const isRTL = language === 'ar';
  const projectType = data.projectType?.toLowerCase() || 'other';
  const isRestaurant = projectType === 'restaurant' || projectType === 'مطعم' || projectType === 'cafe';

  const getRegionalData = () => {
    const address = data.address?.toLowerCase() || "";
    const isKuwait = address.includes("kuwait") || address.includes("الكويت");
    return isKuwait ? { symbol: isRTL ? "د.ك" : "KWD", loyaltyVal: 1 } : { symbol: isRTL ? "دولار" : "USD", loyaltyVal: 3 };
  };

  const regional = getRegionalData();
  const currency = regional.symbol;
  const dailyCustomers = Number(data.dailyCustomers) || 50; 

  // --- تحديث منطق النمو ليكون أكثر واقعية (3-5 تقييمات يومياً) ---
  // نستخدم نسبة تحويل واقعية (حوالي 8%) لضمان بقاء النتائج في النطاق المطلوب
  const potentialDailyReviews = Math.max(3, Math.min(5, Math.floor(dailyCustomers * 0.08))); 
  const potentialMonthlyReviews = potentialDailyReviews * 30; // 90 - 150 تقييم شهرياً
  const potentialYearlyReviews = potentialMonthlyReviews * 12; // 1080 - 1800 تقييم سنوياً

  const yearlyLoyaltyOpportunity = potentialYearlyReviews * regional.loyaltyVal;

  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearly = currentMonthly * 12;
  const currentWeekly = data.weeklyGrowth || 0;

  const getMarketStatus = () => {
    if (currentMonthly <= 5) {
      return { 
        title: isRTL ? "خارج المنافسة (غير مرئي)" : "Out of Competition (Invisible)", 
        desc: isRTL ? "أنت لا تظهر في النتائج الأولى المقترحة للعملاء، مما يجعلهم يذهبون للمنافسين بدلاً منك." : "You don't appear in top results. Customers go to competitors instead.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost 
      };
    } else if (currentMonthly <= 30) {
      return { 
        title: isRTL ? "تواجد ضعيف (مهدد)" : "Weak Presence (At Risk)", 
        desc: isRTL ? "أنت تظهر ولكن كخيار ثانوي. المنافسون الأقوى يخطفون انتباه العميل قبل أن يصل إليك." : "You appear as a secondary option. Stronger competitors grab attention.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target 
      };
    }
    return { title: isRTL ? "منافس قوي" : "Strong Contender", desc: isRTL ? "أداء جيد، ولكن الحفاظ على القمة يتطلب أتمتة مستمرة." : "Good performance, but staying on top requires automation.", color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown };
  };

  const status = getMarketStatus();
  const waNumber = "96566305551"; 
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `مرحباً، قمت بفحص مشروعي (${data.projectName}) وأرغب في تفعيل نظام الهيمنة وتغيير سمعتي السوقية.` : `Hi, I audited my project (${data.projectName}) and want to activate the dominance system.`)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-12 animate-fade-in pb-24 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-2 pt-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
        <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          AI STRATEGIC REPORT - 2026
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
            <div className={`text-4xl font-black ${status.color} mb-4`}>{status.title}</div>
            <p className="text-slate-200 text-xl font-medium leading-relaxed">
                {status.desc}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Review Breakdown (Deserved Positive Focus) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <span className="text-slate-500 text-xs font-bold block mb-2">{isRTL ? "إجمالي التقييمات الحالية" : "Current Total"}</span>
          <div className="text-3xl font-black text-white">{data.currentReviews || 0}</div>
        </div>
        <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
          <span className="text-green-500 text-xs font-bold block mb-2">{isRTL ? "إيجابية مستحقة" : "Deserved Positive"}</span>
          <div className="text-3xl font-black text-green-400">{data.positiveReviews || 0}</div>
        </div>
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20 relative overflow-hidden">
          <span className="text-red-500 text-xs font-bold block mb-2">{isRTL ? "سلبية (يتم حجبها)" : "Negatives (Filtered)"}</span>
          <div className="text-3xl font-black text-red-500 relative z-10">{data.negativeReviews || 0}</div>
          <div className="mt-3 flex items-start gap-2 relative z-10">
              <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-300 leading-tight font-bold">
                  {isRTL ? "هدفنا: تقليل السلبيات لأدنى مستوى وحجبها عن الظهور العام." : "Goal: Minimizing negatives and blocking them from public view."}
              </p>
          </div>
        </div>
      </div>

      {/* 3. Strategic Growth (The Real 3-5 Pulse) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
             <Activity className="text-slate-500" size={20} />
             <h3 className="text-slate-400 font-bold">{isRTL ? "النمو الطبيعي (بدون تدخل)" : "Organic Growth"}</h3>
           </div>
           <div className="space-y-6">
             <div className="flex justify-between items-end"><span className="text-slate-500 text-sm font-medium">{isRTL ? "النمو الأسبوعي" : "Weekly"}</span><span className="text-2xl font-black text-slate-300">{currentWeekly}</span></div>
             <div className="flex justify-between items-end"><span className="text-slate-500 text-sm font-medium">{isRTL ? "النمو الشهري" : "Monthly"}</span><span className="text-2xl font-black text-slate-300">{currentMonthly}</span></div>
             <div className="flex justify-between items-end pt-2 border-t border-slate-800/50"><span className="text-slate-500 text-xs font-medium">{isRTL ? "الرصيد السنوي" : "Annual"}</span><span className="text-xl font-bold text-slate-400">{currentYearly}</span></div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-primary-500/30 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-600"></div>
           <div className="flex items-center gap-3 mb-6 border-b border-primary-500/20 pb-4">
             <Zap className="text-primary-400 fill-primary-400" size={20} />
             <h3 className="text-white font-bold">{isRTL ? "مع نظام Elegant Options" : "Elegant Options Pulse"} <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-md">PRO</span></h3>
           </div>
           <div className="space-y-6">
             <div className="flex justify-between items-end">
                <span className="text-blue-100 text-sm font-medium">{isRTL ? "النمو الأسبوعي المتوقع" : "Projected Weekly"}</span>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">Realistic Pulse</span>
                    <span className="text-3xl font-black text-primary-400">+{potentialDailyReviews * 7}</span>
                </div>
             </div>
             <div className="flex justify-between items-end">
                <span className="text-blue-100 text-sm font-medium">{isRTL ? "النمو الشهري المتوقع" : "Projected Monthly"}</span>
                <span className="text-3xl font-black text-primary-400">+{potentialMonthlyReviews}</span>
             </div>
             <div className="flex justify-between items-center pt-2 border-t border-primary-500/20">
               <span className="text-blue-200 text-xs font-medium">{isRTL ? "الرصيد السنوي المستهدف" : "Target Annual"}</span>
               <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-green-400 font-black text-sm">+{potentialYearlyReviews}</div>
             </div>
           </div>
        </div>
      </div>

      {/* 4. 12-Month Vision Roadmap (Change Factor) */}
      <div className="bg-slate-900 p-8 rounded-[3rem] border border-primary-500/20 shadow-inner relative overflow-hidden">
         <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl"></div>
         <div className="flex items-center gap-3 mb-8">
            <History className="text-primary-400" size={24} />
            <h3 className="text-white font-black text-xl uppercase tracking-tighter">{isRTL ? "تحول السمعة السوقية (12 شهراً)" : "12-Month Reputation Shift"}</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
               <div className="text-primary-500 font-black text-lg mb-2">Month 3</div>
               <p className="text-slate-400 text-xs leading-relaxed">{isRTL ? "اكتمال بناء درع حماية السمعة الرقمية وبدء ظهورك في المراكز الخمسة الأولى." : "Reputation shield completed; business starts appearing in top 5 results."}</p>
            </div>
            <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
               <div className="text-primary-500 font-black text-lg mb-2">Month 7</div>
               <p className="text-slate-400 text-xs leading-relaxed">{isRTL ? "تجاوز المنافسين التقليديين. جوجل يصنف نشاطك كـ 'الأكثر تفاعلاً' في منطقتك." : "Outpacing traditional competitors. Google ranks you as 'Most Engaged' in your area."}</p>
            </div>
            <div className="p-5 bg-primary-500/10 rounded-2xl border border-primary-500/30">
               <div className="text-primary-400 font-black text-lg mb-2">Month 12</div>
               <p className="text-white text-xs font-bold leading-relaxed">{isRTL ? "الهيمنة المطلقة. سمعتك تصبح المرجع الأول للعملاء، وتوقف الاعتماد على الإعلانات." : "Absolute dominance. Reputation becomes the #1 lead source; zero reliance on ads."}</p>
            </div>
         </div>
      </div>

      {/* 5. Protection & Revenue */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-orange-500/30 shrink-0"><Lock size={48} className="text-orange-400" /></div>
            <div className="text-center md:text-right flex-1">
                <h4 className="text-white font-bold text-2xl mb-3">{isRTL ? "حماية السمعة + زيادة التقييمات" : "Reputation Shield + Review Boost"}</h4>
                <p className="text-slate-300 text-lg leading-relaxed">
                    {isRTL 
                     ? "تركيزنا ليس مجرد أرقام، بل زيادة التقييمات الإيجابية التي تستحقها فعلياً من عملائك الراضين، مع حجب السلبيات وتحويلها لشكاوى سرية مباشرة للإدارة."
                     : "Our focus isn't just numbers; it's boosting the positive reviews you truly deserve while filtering negatives into private management complaints."}
                </p>
            </div>
      </div>

      {/* 6. Action Buttons */}
      <div className="space-y-6 pt-10 border-t border-slate-800">
          <p className="text-center text-slate-400 text-sm font-bold">
            {isRTL ? "شاهد كيف نقوم بتحويل عملائك إلى جيش من المروجين بذكاء:" : "Watch how we smartly turn your customers into a promotional army:"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full animate-bounce z-10 shadow-lg whitespace-nowrap">{isRTL ? "👁️ شاهد قوة النظام" : "👁️ Watch Power"}</div>
                <button onClick={onVisualExp} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"><Eye size={24} /> {isRTL ? "تجربة بصرية (Demo)" : "Visual Experience"}</button>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 animate-pulse shadow-[0_0_30px_rgba(22,163,74,0.4)]"><CheckCircle2 size={24} /> {isRTL ? "فعّل نظام الهيمنة الآن" : "Activate Dominance Now"}</a>
          </div>
          <button onClick={onReset} className="w-full py-4 text-slate-600 hover:text-slate-400 text-xs font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-[0.2em]"><RotateCw size={14} /> {isRTL ? "فحص مشروع آخر" : "Audit another business"}</button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
