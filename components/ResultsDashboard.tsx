// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowRight, ArrowLeft, Target, Ghost, Crown, Activity, Zap, Bike, 
  ShieldAlert, TrendingDown, Eye, Quote, CheckCircle2, Sparkles, Lock, 
  AlertOctagon, Loader2, RotateCw, TrendingUp, History, UserCheck, BarChart3, Heart
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
        <p>جاري تحميل التقرير الاستراتيجي...</p>
      </div>
    );
  }

  const t = TEXTS[language];
  const isRTL = language === 'ar';
  const projectType = data.projectType?.toLowerCase() || 'other';
  const isRestaurant = projectType === 'restaurant' || projectType === 'مطعم' || projectType === 'cafe' || projectType === 'مقهى';

  const getRegionalData = () => {
    const address = data.address?.toLowerCase() || "";
    const isKuwait = address.includes("kuwait") || address.includes("الكويت");
    return isKuwait ? { symbol: isRTL ? "د.ك" : "KWD", profitFactor: 2 } : { symbol: isRTL ? "دولار" : "USD", profitFactor: 6 };
  };

  const regional = getRegionalData();
  const currency = regional.symbol;
  const dailyCustomers = Number(data.dailyCustomers) || 50; 

  // --- منطق النمو الواقعي (3-5 تقييمات يومياً) ---
  const potentialDailyReviews = Math.max(3, Math.min(5, Math.floor(dailyCustomers * 0.08))); 
  const potentialMonthlyReviews = potentialDailyReviews * 30;
  const potentialYearlyReviews = potentialMonthlyReviews * 12;

  // --- أرباح كسب الثقة (منطق الضرب في 2) ---
  const yearlyPotentialProfit = potentialYearlyReviews * regional.profitFactor * 10; 

  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearly = currentMonthly * 12;
  const currentWeekly = data.weeklyGrowth || 0;

  const getMarketStatus = () => {
    if (currentMonthly <= 5) {
      return { 
        title: isRTL ? "خارج المنافسة (غير مرئي)" : "Out of Competition", 
        desc: isRTL ? "تحليل الحساب يظهر غياباً عن النتائج الأولى، مما يفقدك حصتك السوقية يومياً." : "Analysis shows absence from top results, losing daily market share.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost 
      };
    } else if (currentMonthly <= 30) {
      return { 
        title: isRTL ? "تواجد ضعيف (مهدد)" : "Weak Presence", 
        desc: isRTL ? "أداؤك التاريخي يضعك كخيار ثانوي؛ المنافسون يسيطرون على المساحة الرقمية حولك." : "Historical performance shows you as secondary; competitors dominate your space.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target 
      };
    }
    return { title: isRTL ? "منافس قوي" : "Strong Contender", desc: isRTL ? "أداء جيد، ولكن الصدارة المستدامة تتطلب أتمتة لصد هجمات المنافسين." : "Good performance, but sustainable dominance requires automation.", color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown };
  };

  const status = getMarketStatus();
  const waNumber = "96566305551"; 
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `مرحباً، قمت بفحص مشروعي (${data.projectName}) وأرغب في تفعيل نظام الهيمنة وتغيير سمعتي السوقية.` : `Hi, I audited my project (${data.projectName}) and want to activate the dominance system.`)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-12 animate-fade-in pb-24 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. Header & Navigation */}
      <div className="flex items-center justify-between px-2 pt-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
        <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          STRATEGIC AUDIT REPORT 2026
        </span>
      </div>

      {/* 2. Market Diagnosis Card */}
      <div className={`p-8 rounded-[2.5rem] border ${status.border} ${status.bg} backdrop-blur-sm relative overflow-hidden group shadow-2xl`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <status.icon size={150} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
          <div className={`p-6 rounded-full bg-slate-900 shadow-2xl ${status.color}`}>
            <status.icon size={48} />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">{isRTL ? "التشخيص السوقي الفعلي" : "Actual Market Diagnosis"}</h3>
            <div className={`text-4xl font-black ${status.color} mb-4`}>{status.title}</div>
            <p className="text-slate-200 text-xl font-medium leading-relaxed">{status.desc}</p>
          </div>
        </div>
      </div>

      {/* 3. Review Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <span className="text-slate-500 text-xs font-bold block mb-2">{isRTL ? "إجمالي التقييمات المسجلة" : "Total Recorded Reviews"}</span>
          <div className="text-3xl font-black text-white">{data.currentReviews || 0}</div>
        </div>
        <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
          <span className="text-green-500 text-xs font-bold block mb-2">{isRTL ? "إيجابية مستحقة" : "Deserved Positives"}</span>
          <div className="text-3xl font-black text-green-400">{data.positiveReviews || 0}</div>
        </div>
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20 relative overflow-hidden">
          <span className="text-red-500 text-xs font-bold block mb-2">{isRTL ? "سلبية (يتم حجبها)" : "Negatives (Filtered)"}</span>
          <div className="text-3xl font-black text-red-500 relative z-10">{data.negativeReviews || 0}</div>
        </div>
      </div>

      {/* 4. Comparison Section - Enhanced with Strategic Explanations */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Organic Section */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 relative group transition-all">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
             <History className="text-slate-500" size={20} />
             <h3 className="text-slate-400 font-bold">{isRTL ? "الوضع الحالي (بدون نظام)" : "Current Status (Organic)"}</h3>
           </div>
           <div className="space-y-6">
             <div className="flex justify-between items-end"><span className="text-slate-500 text-sm font-medium">{isRTL ? "النمو الأسبوعي" : "Weekly"}</span><span className="text-2xl font-black text-slate-300">{currentWeekly}</span></div>
             <div className="flex justify-between items-end"><span className="text-slate-500 text-sm font-medium">{isRTL ? "النمو الشهري" : "Monthly"}</span><span className="text-2xl font-black text-slate-300">{currentMonthly}</span></div>
             <div className="flex justify-between items-end pt-2 border-t border-slate-800/50"><span className="text-slate-500 text-xs font-medium">{isRTL ? "الرصيد السنوي" : "Annual Total"}</span><span className="text-xl font-bold text-slate-400">{currentYearly}</span></div>
           </div>
           <div className="mt-6 p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-[10px] text-slate-500 italic font-bold">
              {isRTL ? "* هذا التحليل مبني على أداء حسابك الفعلي خلال فترة عمله السابقة." : "* Analysis based on your account's historical performance data."}
           </div>
        </div>

        {/* Elegant Options PRO Section */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-primary-500/30 relative overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.1)]">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-600"></div>
           <div className="flex items-center gap-3 mb-6 border-b border-primary-500/20 pb-4">
             <Zap className="text-primary-400 fill-primary-400" size={20} />
             <h3 className="text-white font-bold">{isRTL ? "مع نظام Elegant Options" : "With Elegant Options"}</h3>
           </div>
           <div className="space-y-6">
             <div className="flex justify-between items-end">
                <span className="text-blue-100 text-sm font-medium">{isRTL ? "النمو الأسبوعي المتوقع" : "Projected Weekly"}</span>
                <span className="text-3xl font-black text-primary-400">+{potentialDailyReviews * 7}</span>
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
           <div className="mt-6 p-3 bg-primary-950/30 rounded-xl border border-primary-500/10 text-[10px] text-blue-300 italic font-bold leading-relaxed">
              {isRTL 
                ? "تطور تصاعدي مستمر خلال العام ناتج عن التواصل الدائم مع العملاء فور استلام الخدمة/الطلب." 
                : "Continuous progressive development through the year via constant post-service customer contact."}
           </div>
        </div>
      </div>

      {/* 5. Revenue Potential - The X2 Logic Update */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-blue-500/30 relative shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 blur-[100px] rounded-full group-hover:bg-primary-500/10 transition-colors"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex-1 text-center md:text-right">
                  <div className="flex items-center gap-2 mb-2 justify-center md:justify-start text-primary-400">
                      <BarChart3 size={24} />
                      <h4 className="font-black text-lg uppercase tracking-tight">{isRTL ? "أرباح محققة عبر كسب ثقة العملاء الجدد" : "Profits via New Customer Trust"}</h4>
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter mb-4 animate-fade-in">
                      {yearlyPotentialProfit.toLocaleString()} <span className="text-2xl text-slate-500">{currency}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-blue-950/30 p-4 rounded-2xl border border-blue-500/10 text-xs text-slate-300 leading-relaxed font-bold">
                        {isRTL ? (
                            <>نحن لا نحسب التقييم كنجمة فقط، بل كعميل محتمل سيكرر تجربته معك ويجلب غيره، مما يضاعف العائد المادي لكل تقييم إيجابي.</>
                        ) : (
                            <>We don't count a review as just a star, but as a potential customer who will repeat their experience and bring others, doubling the ROI per positive review.</>
                        )}
                    </div>
                    {/* التنبيه السيكولوجي المطلوب */}
                    <div className="flex items-start gap-2 text-yellow-500/90 bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10">
                       <Heart size={16} className="shrink-0 mt-0.5" />
                       <p className="text-[11px] font-black italic">
                          {isRTL 
                            ? "تنبيه استراتيجي: تدل بياناتنا أن أغلب العملاء الذين يقيمون بـ 5 نجوم يعودون إليك لتجربة الخدمة مرة أخرى."
                            : "Strategic Alert: Our data shows that most customers who rate 5 stars return to experience your service again."}
                       </p>
                    </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 6. Protection & AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
           <Lock size={32} className="text-orange-400" />
           <h4 className="text-white font-bold text-lg">{isRTL ? "درع حماية السمعة" : "Reputation Shield"}</h4>
           <p className="text-slate-400 text-xs font-bold leading-relaxed">
             {isRTL ? "فلترة ذكية تحجب التقييمات السلبية وتوجهها كرسالة سرية للإدارة لحل المشكلة فوراً." : "Smart filtering that blocks negative reviews and directs them privately to management."}
           </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
           <Sparkles size={32} className="text-blue-400" />
           <h4 className="text-white font-bold text-lg">{isRTL ? "ردود الذكاء الاصطناعي" : "AI Powered Replies"}</h4>
           <p className="text-slate-400 text-xs font-bold leading-relaxed">
             {isRTL ? "وكيل ذكي يرد على كافة التقييمات آلياً بلهجة مشروعك، مما يرفع تصنيفك في جوجل ماب." : "A smart agent replies to all reviews automatically in your brand tone, boosting your ranking."}
           </p>
        </div>
      </div>

      {/* 7. Harvard Quote */}
      <div className="text-center max-w-2xl mx-auto py-8">
          <Quote className="text-yellow-500/50 mx-auto mb-4" size={32} />
          <h3 className="text-xl font-serif text-slate-300 italic mb-4">
              {isRTL ? "\"زيادة نجمة واحدة في التقييم تؤدي لزيادة في الإيرادات بنسبة 5% إلى 9%.\"" : "\"A one-star increase in rating leads to a 5-9% increase in revenue.\""}
          </h3>
          <span className="text-[10px] font-black text-yellow-500 tracking-widest uppercase">HARVARD BUSINESS SCHOOL</span>
      </div>

      {/* 8. Final Recommendation */}
      <div className="bg-primary-500/5 border border-primary-500/20 p-8 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
        <h4 className="text-white font-black text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary-400" />
            {isRTL ? "التوصية الاستراتيجية النهائية" : "Final Strategic Recommendation"}
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed font-medium">
            {isRTL 
              ? `بناءً على تحليل بيانات (${data.projectName})، ننصح ببدء خطة الهيمنة لـ 12 شهراً القادمة. ستنتقل من التواجد الحالي المحدود إلى السيطرة المطلقة على منطقتك وتصدر نتائج البحث.`
              : `Based on (${data.projectName}) data analysis, we recommend the 12-month dominance plan to move from limited presence to absolute market control.`}
        </p>
      </div>

      {/* 9. CTAs */}
      <div className="space-y-6 pt-10 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-bounce z-10 shadow-lg">👁️ {isRTL ? "شاهد قوة النظام" : "See System Power"}</div>
                <button onClick={onVisualExp} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"><Eye size={24} /> {isRTL ? "تجربة بصرية (Demo)" : "Visual Experience"}</button>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 animate-pulse shadow-[0_0_30px_rgba(22,163,74,0.4)]"><CheckCircle2 size={24} /> {isRTL ? "اطلب نظام الهيمنة الآن" : "Order System Now"}</a>
          </div>
          <button onClick={onReset} className="w-full py-4 text-slate-600 hover:text-slate-400 text-xs font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-[0.2em]"><RotateCw size={14} /> {isRTL ? "فحص مشروع آخر" : "Audit another business"}</button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
