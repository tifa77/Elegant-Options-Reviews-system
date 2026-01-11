// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowRight, ArrowLeft, Target, Ghost, Crown, Activity, Zap, Bike, 
  ShieldAlert, TrendingDown, Eye, Quote, CheckCircle2, Sparkles, Lock, 
  AlertOctagon, Loader2, RotateCw, TrendingUp, History, UserCheck, BarChart3, Heart, SearchCheck, MessageSquareText, MoveDown
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ language, data, onReset, onBack, onVisualExp }) => {
  if (!data) return <div className="p-20 text-center text-white"><Loader2 className="animate-spin mx-auto" /></div>;

  const isRTL = language === 'ar';
  const projectType = data.projectType?.toLowerCase() || 'other';
  const isRestaurant = projectType === 'restaurant' || projectType === 'مطعم' || projectType === 'cafe' || projectType === 'مقهى';

  const getRegionalData = () => {
    const address = data.address?.toLowerCase() || "";
    const isKuwait = address.includes("kuwait") || address.includes("الكويت");
    return isKuwait ? { symbol: isRTL ? "د.ك" : "KWD", factor: 2 } : { symbol: isRTL ? "دولار" : "USD", factor: 6 };
  };

  const regional = getRegionalData();
  const dailyCustomers = Number(data.dailyCustomers) || 50; 
  const potDaily = Math.max(3, Math.min(5, Math.floor(dailyCustomers * 0.08)));
  const potWeekly = potDaily * 7;
  const potMonthly = potDaily * 30;
  const potYearly = potMonthly * 12;

  const yearlyPotentialProfit = potYearly * regional.factor * 10; 

  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearly = currentMonthly * 12;
  const currentWeekly = data.weeklyGrowth || 0;

  const getMarketStatus = () => {
    if (currentMonthly <= 5) return { 
        title: isRTL ? "خارج المنافسة" : "Out of Competition", 
        desc: isRTL ? "تحليل الحساب يظهر غياباً تاماً عن النتائج الأولى، مما يعني خسارة يومية للحصة السوقية لصالح المنافسين." : "Account analysis shows complete absence from top results, meaning daily market share loss to competitors.",
        color: "text-red-500", bg: "bg-red-900/20", icon: Ghost 
    };
    if (currentMonthly <= 30) return { 
        title: isRTL ? "تواجد ضعيف" : "Weak Presence", 
        desc: isRTL ? "أداؤك التاريخي يضعك كخيار ثانوي؛ المنافسون الأقوى يسيطرون على المساحة الرقمية ويخطفون انتباه العميل." : "Historical performance places you as a secondary option; stronger competitors dominate the digital space.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", icon: Target 
    };
    return { 
        title: isRTL ? "منافس قوي" : "Strong Contender", 
        desc: isRTL ? "أداء جيد حالياً، ولكن الحفاظ على الصدارة المستدامة يتطلب أتمتة لصد هجمات المنافسين المتصاعدة." : "Good performance now, but sustainable leadership requires automation to fend off rising competitor attacks.",
        color: "text-green-500", bg: "bg-green-900/20", icon: Crown 
    };
  };

  const status = getMarketStatus();
  const waLink = `https://wa.me/96566305551?text=${encodeURIComponent(isRTL ? `مرحباً، قمت بفحص مشروعي (${data.projectName}) وأرغب في تفعيل نظام الهيمنة.` : `Hi, I audited (${data.projectName}) and want to activate the system.`)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-10 animate-fade-in pb-24 px-4 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. Header */}
      <div className="flex items-center justify-between pt-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          {isRTL ? <ArrowRight className="group-hover:translate-x-1" /> : <ArrowLeft className="group-hover:-translate-x-1" />}
          <span className="text-sm font-bold">{isRTL ? "رجوع" : "Back"}</span>
        </button>
        <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest uppercase">
          STRATEGIC AUDIT REPORT 2026
        </span>
      </div>

      {/* 2. Diagnosis (تم استرجاع الوصف هنا) */}
      <div className={`p-8 rounded-[2.5rem] border border-white/5 ${status.bg} relative overflow-hidden shadow-2xl`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className={`p-5 rounded-full bg-slate-950 shadow-2xl ${status.color}`}><status.icon size={40} /></div>
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-slate-400 text-xs font-black uppercase mb-2">{isRTL ? "التشخيص السوقي الفعلي" : "ACTUAL MARKET DIAGNOSIS"}</h3>
            <div className={`text-4xl font-black ${status.color} tracking-tighter mb-4`}>{status.title}</div>
            {/* استرجاع وصف الحالة هنا */}
            <p className="text-slate-200 text-lg font-medium leading-relaxed">{status.desc}</p>
          </div>
        </div>
      </div>

      {/* 3. Review Stats & Smart Filter Logic */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
            <span className="text-slate-500 text-[10px] font-black uppercase block mb-1">{isRTL ? "إجمالي التقييمات" : "TOTAL REVIEWS"}</span>
            <div className="text-3xl font-black text-white">{data.currentReviews || 0}</div>
          </div>
          <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
            <span className="text-green-500 text-[10px] font-black uppercase block mb-1">{isRTL ? "إيجابية مستحقة" : "DESERVED POSITIVE"}</span>
            <div className="text-3xl font-black text-green-400">{data.positiveReviews || 0}</div>
          </div>
          <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20 relative overflow-hidden">
            <span className="text-red-500 text-[10px] font-black uppercase block mb-1">{isRTL ? "سلبية (يتم حجبها)" : "NEGATIVES (FILTERED)"}</span>
            <div className="text-3xl font-black text-red-500">{data.negativeReviews || 0}</div>
            <div className="mt-2 flex items-start gap-1.5"><ShieldAlert size={12} className="text-red-400 shrink-0 mt-0.5" /><p className="text-[9px] text-red-300 font-bold leading-tight">{isRTL ? "تنبيه: جوجل لا يحذف السلبيات؛ نظامنا يضمن حجبها ومنع وصولها للعامة." : "Note: Google doesn't delete negatives; our system ensures they are blocked from public view."}</p></div>
          </div>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-2xl flex items-center gap-3">
           <SearchCheck size={18} className="text-blue-400 shrink-0" />
           <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              {isRTL 
                ? "هذا الفرز يعتمد على التقييمات والنصوص المذكورة؛ حيث يقوم النظام بتحليل الملاحظات والشكاوى الضمنية لضمان دقة التشخيص."
                : "This analysis is based on ratings and text context; the system detects implicit complaints for maximum accuracy."}
           </p>
        </div>
      </div>

      {/* 4. Horizontal Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800">
           <div className="flex items-center gap-3 mb-8 opacity-60">
              <History size={18} /> <h3 className="text-sm font-black uppercase tracking-widest">{isRTL ? "الوضع الحالي (بدون نظام)" : "CURRENT STATUS"}</h3>
           </div>
           <div className="space-y-6">
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm font-bold">{isRTL ? "النمو الأسبوعي" : "Weekly Growth"}</span><span className="text-2xl font-black text-slate-300">{currentWeekly}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 text-sm font-bold">{isRTL ? "النمو الشهري" : "Monthly Growth"}</span><span className="text-2xl font-black text-slate-300">{currentMonthly}</span></div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800/50"><span className="text-slate-500 text-xs font-bold">{isRTL ? "الرصيد السنوي" : "Annual Total"}</span><span className="text-xl font-bold text-slate-400">{currentYearly}</span></div>
           </div>
           {/* تم تعديل هذا الجزء لشكل مستطيل واضح */}
           <div className="mt-8 p-4 bg-slate-950/50 rounded-2xl border border-slate-700/50 shadow-inner">
              <p className="text-xs text-slate-400 font-black leading-relaxed text-center">
                 {isRTL ? "💡 تحليل مبني على أداء حسابك الفعلي خلال فترة عمله السابقة." : "💡 Analysis based on your actual historical performance."}
              </p>
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-950 p-8 rounded-[2rem] border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-blue-400 to-indigo-600"></div>
           <div className="flex items-center gap-3 mb-8">
              <Zap className="text-blue-400 fill-blue-400" size={18} /> <h3 className="text-blue-100 text-sm font-black uppercase tracking-widest">{isRTL ? "مع نظام Elegant Options" : "WITH ELEGANT OPTIONS"}</h3>
           </div>
           <div className="space-y-6">
              <div className="flex justify-between items-center"><span className="text-blue-100/70 text-sm font-bold">{isRTL ? "النمو الأسبوعي المتوقع" : "Projected Weekly"}</span><span className="text-3xl font-black text-blue-400">+{potWeekly}</span></div>
              <div className="flex justify-between items-center"><span className="text-blue-100/70 text-sm font-bold">{isRTL ? "النمو الشهري المتوقع" : "Projected Monthly"}</span><span className="text-3xl font-black text-blue-400">+{potMonthly}</span></div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-500/20"><span className="text-blue-200 text-xs font-bold">{isRTL ? "الرصيد السنوي المستهدف" : "Target Annual"}</span><div className="bg-green-400/20 text-green-400 px-3 py-1 rounded-lg font-black">+{potYearly}</div></div>
           </div>
           {/* تم تعديل هذا الجزء لشكل مستطيل واضح */}
           <div className="mt-8 p-4 bg-blue-950/30 rounded-2xl border border-blue-500/20 shadow-inner">
               <p className="text-xs text-blue-300 font-black leading-relaxed text-center">
                  {isRTL ? "🚀 تطور تصاعدي مستمر خلال العام ناتج عن التواصل الدائم مع العملاء فور استلام الخدمة/الطلب." : "🚀 Continuous progressive growth throughout the year resulting from instant customer contact immediately after service/order."}
               </p>
           </div>
        </div>
      </div>

      {/* 5. Profits via New Customer Trust */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-blue-500/30 relative shadow-2xl group overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex-1 text-center md:text-right">
                  <div className="flex items-center gap-2 mb-2 justify-center md:justify-start text-blue-400">
                      <BarChart3 size={24} />
                      <h4 className="font-black text-lg uppercase tracking-tight">{isRTL ? "أرباح محققة عبر كسب ثقة العملاء الجدد" : "PROFITS VIA CUSTOMER TRUST"}</h4>
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter mb-4">{yearlyPotentialProfit.toLocaleString()} <span className="text-2xl text-slate-500">{regional.symbol}</span></div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-blue-950/40 p-4 rounded-2xl border border-blue-500/10 text-xs text-slate-300 font-bold leading-relaxed">
                        {isRTL 
                          ? "نحن نضاعف العائد المادي لكل تقييم إيجابي؛ لأن العميل الراضي لا يكتفي بمنحك نجمة، بل يعود بتجربة شراء متكررة ويجلب معه عملاء آخرين يثقون برأيه." 
                          : "We double the ROI per positive review; a satisfied customer doesn't just leave a star, they return for repeat business and bring other customers who trust their recommendation."}
                    </div>
                    <div className="flex items-start gap-2 text-yellow-500/90 bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10">
                        <Heart size={14} className="shrink-0 mt-0.5" />
                        <p className="text-[10px] font-black italic">{isRTL ? "تنبيه استراتيجي: تدل بياناتنا أن أغلب العملاء الذين يقيمون بـ 5 نجوم يعودون إليك لتجربة الخدمة مرة أخرى." : "Strategic Alert: Data shows that most 5-star reviewers return to experience your service again."}</p>
                    </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 6. Protection & AI Interaction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex items-start gap-4">
           <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500"><Lock size={24} /></div>
           <div><h4 className="text-white font-bold text-sm mb-1">{isRTL ? "درع حماية السمعة" : "Reputation Shield"}</h4><p className="text-slate-400 text-[11px] font-bold leading-relaxed">{isRTL ? "فلترة ذكية تحجب التقييمات السلبية وتوجهها كرسالة سرية للإدارة لحل المشكلة فوراً قبل وصولها لجوجل." : "Smart filtering blocks negative reviews and directs them privately to management before they hit Google."}</p></div>
        </div>
        <div className="bg-slate-900/50 border border-blue-500/20 rounded-3xl p-6 flex items-start gap-4">
           <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Sparkles size={24} /></div>
           <div>
              <h4 className="text-white font-bold text-sm mb-1">{isRTL ? "ردود آلية متطورة بواسطة AI" : "Advanced AI Auto-Replies"}</h4>
              <p className="text-slate-400 text-[11px] font-bold leading-relaxed">
                  {isRTL 
                    ? "الرد على التقييمات عن طريق AI وهذا سيجعلك لا تشغل بالك في الردود ويجعلك من المفضلين في تصنيف جوجل بفضل التفاعل اللحظي." 
                    : "Replies to reviews via AI, saving you time and effort while making you a favorite in Google rankings through instant interaction."}
              </p>
           </div>
        </div>
        {isRestaurant && (
          <div className="bg-slate-900/50 border border-orange-500/20 rounded-3xl p-6 flex items-start gap-4 md:col-span-2">
             <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500"><Bike size={24} /></div>
             <div><h4 className="text-white font-bold text-sm mb-1">{isRTL ? "دمج تطبيقات التوصيل (طلبات/كيتا)" : "Delivery Integration (Talabat/Keeta)"}</h4><p className="text-slate-400 text-[11px] font-bold leading-relaxed">{isRTL ? "إرسال رسالة واتساب فور استلام الطلب من شركات التوصيل أو من المطعم مباشرة لتحويل تجربة التوصيل لتقييم إيجابي مضمون." : "Send auto-WhatsApp after delivery orders to turn delivery experiences into guaranteed positive reviews."}</p></div>
          </div>
        )}
      </div>

      {/* 7. Harvard Business Quote */}
      <div className="text-center py-6">
          <Quote className="text-yellow-500/30 mx-auto mb-4" size={32} />
          <h3 className="text-xl font-serif text-slate-200 italic mb-4">{isRTL ? "\"زيادة نجمة واحدة في التقييم تؤدي لزيادة في الإيرادات بنسبة 5% إلى 9%.\"" : "\"A one-star increase in rating leads to a 5-9% increase in revenue.\""}</h3>
          <div className="text-[9px] font-black text-yellow-500 tracking-[0.3em] uppercase">HARVARD BUSINESS SCHOOL</div>
      </div>

      {/* 8. Recommendation */}
      <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[2.5rem] relative">
        <h4 className="text-white font-black text-lg mb-3 flex items-center gap-2"><TrendingUp className="text-blue-400" /> {isRTL ? "التوصية الاستراتيجية النهائية" : "FINAL RECOMMENDATION"}</h4>
        <p className="text-slate-300 text-sm font-bold leading-relaxed">{isRTL ? `بناءً على تحليل بيانات (${data.projectName})، ننصح ببدء خطة الهيمنة لـ 12 شهراً القادمة للسيطرة المطلقة على منطقتك وتصدر نتائج البحث بمصداقية عالية.` : `Based on (${data.projectName}) data, we recommend starting the 12-month dominance plan to dominate your area and top Google results.`}</p>
      </div>

      {/* 9. CTAs */}
      <div className="space-y-6 pt-10 border-t border-slate-800">
          {/* تمت إضافة العبارة التشجيعية هنا */}
          <p className="text-center text-slate-400 text-sm font-black flex items-center justify-center gap-2 animate-pulse">
             <Sparkles className="text-yellow-500" size={16} />
             {isRTL ? "اضغط بالأسفل لمشاهدة كيف يعمل النظام واقعياً:" : "Click below to see exactly how the system works in real-time:"}
             <MoveDown className="text-yellow-500" size={16} />
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-bounce z-10 shadow-lg whitespace-nowrap uppercase tracking-tighter">👁️ {isRTL ? "شاهد المحاكي" : "See Simulator"}</div>
                <button onClick={onVisualExp} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-900/20"><Eye size={24} /> {isRTL ? "تجربة بصرية" : "Visual Experience"}</button>
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 animate-pulse shadow-[0_0_30px_rgba(22,163,74,0.4)]"><CheckCircle2 size={24} /> {isRTL ? "اطلب النظام الآن" : "Order System Now"}</a>
          </div>
          <button onClick={onReset} className="w-full py-4 text-slate-600 hover:text-slate-400 text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest"><RotateCw size={14} /> {isRTL ? "فحص مشروع آخر" : "Audit Another Project"}</button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
