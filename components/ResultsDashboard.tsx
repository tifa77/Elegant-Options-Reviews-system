// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowRight, ArrowLeft, Target, Ghost, Crown, Activity, Zap, Bike, 
  ShieldAlert, TrendingDown, Eye, Quote, CheckCircle2, Sparkles, Lock, 
  AlertOctagon, Loader2, RotateCw, TrendingUp, History, UserCheck
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
    return isKuwait ? { symbol: isRTL ? "د.ك" : "KWD", loyaltyVal: 1 } : { symbol: isRTL ? "دولار" : "USD", loyaltyVal: 3 };
  };

  const regional = getRegionalData();
  const currency = regional.symbol;
  const dailyCustomers = Number(data.dailyCustomers) || 50; 

  // --- منطق النمو الواقعي (3-5 تقييمات يومياً) ---
  const potentialDailyReviews = Math.max(3, Math.min(5, Math.floor(dailyCustomers * 0.08))); 
  const potentialMonthlyReviews = potentialDailyReviews * 30;
  const potentialYearlyReviews = potentialMonthlyReviews * 12;

  // --- أرباح الولاء الضائعة ---
  const yearlyLoyaltyOpportunity = potentialYearlyReviews * regional.loyaltyVal * 10; // بافتراض قيمة متوسطة

  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearly = currentMonthly * 12;
  const currentWeekly = data.weeklyGrowth || 0;

  const getMarketStatus = () => {
    if (currentMonthly <= 5) {
      return { 
        title: isRTL ? "خارج المنافسة (غير مرئي)" : "Out of Competition (Invisible)", 
        desc: isRTL ? "أنت لا تظهر في النتائج الأولى المقترحة، مما يدفع العملاء للذهاب للمنافسين." : "You don't appear in top results. Customers go to competitors.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost 
      };
    } else if (currentMonthly <= 30) {
      return { 
        title: isRTL ? "تواجد ضعيف (مهدد)" : "Weak Presence (At Risk)", 
        desc: isRTL ? "أنت تظهر ولكن كخيار ثانوي، المنافسون الأقوى يخطفون انتباه العميل قبل وصوله إليك." : "You appear as a secondary option. Stronger competitors grab attention.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target 
      };
    }
    return { title: isRTL ? "منافس قوي" : "Strong Contender", desc: isRTL ? "أداء جيد، ولكن الحفاظ على القمة يتطلب أتمتة لصد هجمات المنافسين." : "Good performance, but staying on top requires automation.", color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown };
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
          STRATEGIC AUDIT REPORT
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
            <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">{isRTL ? "التشخيص السوقي" : "Market Diagnosis"}</h3>
            <div className={`text-4xl font-black ${status.color} mb-4`}>{status.title}</div>
            <p className="text-slate-200 text-xl font-medium leading-relaxed">{status.desc}</p>
          </div>
        </div>
      </div>

      {/* 3. Review Breakdown (Real Data) */}
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
                  {isRTL ? "تحذير: جوجل لا يحذف السلبيات، ونحن نضمن لك تقليلها لأدنى مستوى وحجبها." : "Warning: Google doesn't delete negatives; we ensure they stay at a minimum."}
              </p>
          </div>
        </div>
      </div>

      {/* 4. Comparison Section (Organic vs Elegant Options) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
             <Activity className="text-slate-500" size={20} />
             <h3 className="text-slate-400 font-bold">{isRTL ? "الوضع الحالي (بدون نظام)" : "Organic Growth"}</h3>
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
             <h3 className="text-white font-bold">{isRTL ? "مع نظام Elegant Options" : "Elegant Options PRO"}</h3>
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
        </div>
      </div>

      {/* 5. Realistic Revenue Opportunity (Missed Profits) */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-red-500/30 relative shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex-1 text-center md:text-right">
                  <div className="flex items-center gap-2 mb-2 justify-center md:justify-start text-red-500">
                      <TrendingDown />
                      <h4 className="font-bold text-lg">{isRTL ? "أرباح ولاء ضائعة (سنوياً)" : "Missed Loyalty Profits"}</h4>
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter mb-4">
                      {yearlyLoyaltyOpportunity.toLocaleString()} <span className="text-2xl text-slate-500">{currency}</span>
                  </div>
                  <div className="bg-red-950/30 p-4 rounded-xl border border-red-500/10 text-xs text-slate-300 leading-relaxed">
                      {isRTL ? (
                          <>لو كسبت ولاء <span className="text-white font-bold">30%</span> فقط من عملائك عبر التقييمات المستحقة، بافتراض عائد متكرر بسيط، فإنك تحقق هذا المبلغ الإضافي سنوياً.</>
                      ) : (
                          <>If you secure the loyalty of just <span className="text-white font-bold">30%</span> of customers through reviews, you generate this additional revenue annually.</>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* 6. Protection & AI Features */}
      <div className="grid grid-cols-1 gap-6">
        {/* Shield */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-orange-500/30 shrink-0"><Lock size={48} className="text-orange-400" /></div>
              <div className="text-center md:text-right flex-1">
                  <h4 className="text-white font-bold text-2xl mb-3">{isRTL ? "درع حماية السمعة الذكي" : "Smart Reputation Shield"}</h4>
                  <p className="text-slate-300 text-lg leading-relaxed">
                      {isRTL ? "نظامنا يمتص صدمة العملاء غير الراضين ويوجههم لإرسال رسالة سرية للإدارة، مما يمنع التقييم السلبي في جوجل." : "Our system absorbs unhappy customers' shocks, directing them to management privately to prevent public negative reviews."}
                  </p>
              </div>
        </div>

        {/* AI Reply */}
        <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-blue-500/30 shrink-0"><Sparkles size={48} className="text-blue-400" /></div>
              <div className="text-center md:text-right flex-1">
                  <h4 className="text-white font-bold text-2xl mb-3">{isRTL ? "لن تتعب في الرد على كل هذه التقييمات!" : "Automated AI Replies"}</h4>
                  <p className="text-slate-300 text-lg leading-relaxed">
                      {isRTL ? "وكيل الذكاء الاصطناعي (AI Agent) يرد فوراً وبشكل لائق، مما يرفع تصنيفك في البحث ويزيد ثقة العملاء بك." : "Our AI Agent replies instantly and professionally, boosting your search ranking and customer trust."}
                  </p>
              </div>
        </div>

        {/* Delivery Apps */}
        {isRestaurant && (
          <div className="bg-gradient-to-r from-orange-900/20 to-slate-900 p-8 rounded-[2rem] border border-orange-500/30 flex flex-col md:flex-row items-center gap-8">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-orange-500/30 shrink-0"><Bike size={48} className="text-orange-500" /></div>
              <div className="text-center md:text-right flex-1">
                  <h4 className="text-white font-bold text-2xl mb-3">{isRTL ? "نقلة نوعية مع تطبيقات التوصيل" : "Delivery Integration"}</h4>
                  <p className="text-slate-300 text-lg leading-relaxed">
                      {isRTL ? "بمجرد ربط النظام، سيتم إرسال رسالة واتساب للعميل فور استلام طلبه من (طلبات/كيتا)، مما يحول التوصيل لمصدر دائم للتقييمات." : "Once linked, a WhatsApp message is sent instantly after Talabat/Keeta delivery, turning orders into constant review sources."}
                  </p>
              </div>
          </div>
        )}
      </div>

      {/* 7. The Harvard Business School Quote */}
      <div className="relative py-12 border-y border-slate-800 my-12">
           <div className="text-center max-w-2xl mx-auto">
              <Quote className="text-yellow-500 mx-auto mb-6 opacity-80" size={48} />
              <h3 className="text-2xl font-serif text-slate-200 italic mb-6 leading-relaxed">
                  {isRTL ? "\"زيادة نجمة واحدة في التقييم تؤدي إلى زيادة في الإيرادات تتراوح بين 5% إلى 9%.\"" : "\"A one-star increase in rating leads to a 5-9 percent increase in revenue.\""}
              </h3>
              <div className="inline-block bg-yellow-500/10 text-yellow-400 px-6 py-2 rounded-full text-xs font-bold tracking-[0.2em] border border-yellow-500/20 uppercase">
                  HARVARD BUSINESS SCHOOL
              </div>
           </div>
      </div>

      {/* 8. Final Recommendation (The 12-Month Vision) */}
      <div className="bg-primary-500/5 border border-primary-500/20 p-8 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
        <h4 className="text-white font-black text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary-400" />
            {isRTL ? "توصية استراتيجية لتحول السمعة" : "Strategic Reputation Recommendation"}
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {isRTL 
              ? "بناءً على هذا الفحص، ننصح ببدء خطة الهيمنة لـ 12 شهراً القادمة. ستنتقل من التواجد الضعيف إلى السيطرة المطلقة على منطقتك، حيث يصبح مشروعك الرقم (1) في جوجل بمصداقية لا تقبل المنافسة."
              : "Based on this audit, we recommend starting the 12-month dominance plan. You will move from weak presence to absolute market control, making your business #1 on Google with unbeatable credibility."}
        </p>
      </div>

      {/* 9. CTAs */}
      <div className="space-y-6 pt-10 border-t border-slate-800">
          <p className="text-center text-slate-400 text-sm font-bold flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-500" size={16} />
            {isRTL ? "يمكنك مشاهدة كيف يعمل النظام فعلياً بالضغط على تجربة بصرية:" : "You can see exactly how the system works by clicking on Visual Experience:"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full animate-bounce z-10 shadow-lg whitespace-nowrap">{isRTL ? "👁️ شاهد قوة النظام" : "👁️ Watch Power"}</div>
                <button onClick={onVisualExp} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-900/20"><Eye size={24} /> {isRTL ? "تجربة بصرية (Demo)" : "Visual Experience"}</button>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 animate-pulse shadow-[0_0_30px_rgba(22,163,74,0.4)]"><CheckCircle2 size={24} /> {isRTL ? "اطلب نظام الهيمنة الآن" : "Order Dominance System"}</a>
          </div>
          <button onClick={onReset} className="w-full py-4 text-slate-600 hover:text-slate-400 text-xs font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-[0.2em]"><RotateCw size={14} /> {isRTL ? "فحص مشروع آخر" : "Audit another business"}</button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
