// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, ArrowUpRight,
  MessageCircle, RotateCw, Play, Zap, BarChart3,
  Utensils, Bike, Percent, Users, Award, CheckCircle, 
  Eye, ShieldCheck, DollarSign, Star, HelpCircle, Quote, Share2, Globe
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

  // --- 1. محرك الأمان الرقمي والحسابات (Anti-NaN Engine) ---
  const currentYear = new Date().getFullYear();
  const rawEstablishedYear = Number(data.establishedYear);
  const ageYears = (Number.isFinite(rawEstablishedYear) && rawEstablishedYear > 1900)
    ? Math.max(1, currentYear - rawEstablishedYear)
    : 1;

  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;
  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;

  // منطق العملة والإقليم
  const getRegionalData = () => {
    const address = data.address?.toLowerCase() || "";
    const isKuwait = address.includes("kuwait") || address.includes("الكويت");
    return isKuwait 
      ? { symbol: isRTL ? "د.ك" : "KWD", ticket: 20 }
      : { symbol: isRTL ? "دولار" : "USD", ticket: 60 };
  };
  const regional = getRegionalData();

  // حسابات النمو (المستقبل مع النظام)
  const systemDailyPotential = Math.round(dailyCustomers * 0.10); // قاعدة الـ 10%
  const annualAdditionalReviews = systemDailyPotential * 365;
  const projectedWeekly = Math.max(8, (avgReviewsPerYear / 52) * (isRestaurant ? 8 : 5));
  const projectedMonthly = Math.max(35, (avgReviewsPerYear / 12) * (isRestaurant ? 8 : 5));
  
  // معادلة الخسارة (من الكود الأول)
  const customerLossMultiplier = 4;
  const lostCustomersCount = Math.max(50, annualAdditionalReviews * customerLossMultiplier);
  const lostRevenue = lostCustomersCount * regional.ticket;

  // الأرباح الديناميكية (من الكود الثاني)
  const dynamicProfit = (annualAdditionalReviews * regional.ticket * 0.5).toLocaleString();

  // --- 2. التصنيف السوقي المدمج ---
  const getMarketStatus = () => {
    const incentive = isRTL 
      ? "⚠️ تنبيه: المنافسون في منطقتك يكثفون نشاطهم الآن لتجاوز تصنيفك."
      : "⚠️ Alert: Competitors are intensifying their activity to overtake you.";

    if (avgReviewsPerYear < 15) {
      return { 
        title: isRTL ? "شبح رقمي - مخفي" : "Digital Ghost", 
        desc: isRTL ? "أنت غير مرئي للعملاء الجدد. محركات البحث تتجاهل نشاطك بسبب ضعف التفاعل الحقيقي مقارنة بعمر المشروع." : "Invisible to new customers. Search engines ignore you due to low engagement relative to business age.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost, incentive 
      };
    } else if (avgReviewsPerYear < 80) {
      return { 
        title: isRTL ? "تواجد متوسط - مهدد" : "Average Presence", 
        desc: isRTL ? "أنت موجود ولكنك مهدد. المنافسون يستغلون فجوة الأتمتة لديك لسحب حصتك السوقية تدريجياً." : "You are present but at risk. Competitors are using automation to pull your market share.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target, incentive 
      };
    }
    return { 
      title: isRTL ? "رائد يحتاج أتمتة" : "Market Leader", 
      desc: isRTL ? "أداء ممتاز، ولكن الحفاظ على القمة يحتاج ذكاءً اصطناعياً لمنع أي ثغرة يستغلها المنافسون المتربصون." : "Great performance, but staying on top requires AI to prevent competitor breakthroughs.",
      color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown, incentive 
    };
  };

  const status = getMarketStatus();
  const tDash = t.dashboard || {};

  // روابط الواتساب
  const waNumber = "96566305551";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `أريد تفعيل نظام النمو وإيقاف خسارة العملاء لمشروعي (${data.projectName})` : `I want to activate growth and stop customer loss for (${data.projectName})`)}`;

  return (
    <div className={`max-w-5xl mx-auto space-y-12 animate-fade-in pb-24 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-2 pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          <span className="font-bold text-sm uppercase tracking-wider">{t.back}</span>
        </button>
        <span className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Growth Intelligence Report</span>
      </div>

      {/* 1. HERO SECTION: MARKET DIAGNOSIS */}
      <div className={`p-10 md:p-14 rounded-[3rem] border ${status.border} ${status.bg} backdrop-blur-md relative overflow-hidden group shadow-2xl`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <status.icon size={280} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className={`p-8 rounded-3xl bg-slate-950 shadow-2xl ${status.color} border border-white/5`}>
            <status.icon size={64} />
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">{isRTL ? "التشخيص السوقي الفعلي" : "Real Market Diagnosis"}</h3>
            <div className={`text-5xl md:text-7xl font-black ${status.color} tracking-tighter italic`}>{status.title}</div>
            <p className="text-slate-200 text-lg md:text-xl font-bold leading-relaxed opacity-90">
                {status.desc}
            </p>
            <div className="inline-flex p-4 bg-black/60 rounded-2xl border border-orange-500/20 text-orange-400 text-md font-black animate-pulse">
               {status.incentive}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: tDash.age, value: ageYears, sub: tDash.years, icon: Globe },
          { label: isRTL ? "إجمالي التقييمات" : "Total Reviews", value: totalReviews.toLocaleString(), sub: isRTL ? "تقييم" : "Reviews", icon: BarChart3 },
          { label: isRTL ? "المعدل السنوي" : "Annual Avg", value: avgReviewsPerYear, sub: isRTL ? "تقييم / سنة" : "per year", icon: Activity, color: "text-indigo-400" },
          { label: isRTL ? "المعدل الشهري" : "Monthly Avg", value: (avgReviewsPerYear / 12).toFixed(1), sub: isRTL ? "تقييم / شهر" : "per month", icon: Zap }
        ].map((m, i) => (
          <div key={i} className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 text-center hover:border-slate-700 transition-all group">
             <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest block mb-4">{m.label}</span>
             <div className="flex flex-col items-center">
                <span className={`text-4xl font-black text-white ${m.color || ''}`}>{m.value}</span>
                <span className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">{m.sub}</span>
             </div>
          </div>
        ))}
      </div>

      {/* 3. PERFORMANCE COMPARISON */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Status */}
        <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-slate-800 relative group overflow-hidden">
           <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
             <TrendingDown className="text-red-500" size={28} />
             <h3 className="text-slate-300 font-black text-xl uppercase tracking-tighter">{isRTL ? "الوضع الحالي (بدون نظام)" : "Manual Status"}</h3>
           </div>
           <div className="space-y-8 text-white">
             <div className="flex justify-between items-end">
               <span className="text-slate-500 font-bold">{isRTL ? "النمو الأسبوعي" : "Weekly Growth"}</span>
               <span className="text-3xl font-black">{(avgReviewsPerYear/52).toFixed(1)}</span>
             </div>
             <div className="flex justify-between items-end">
               <span className="text-slate-500 font-bold">{isRTL ? "النمو الشهري" : "Monthly Growth"}</span>
               <span className="text-3xl font-black">{(avgReviewsPerYear/12).toFixed(1)}</span>
             </div>
             <div className="pt-6 border-t border-slate-800/50">
               <p className="text-red-400/80 text-sm font-bold italic leading-relaxed">
                 {isRTL ? "⚠️ المنافسون يستغلون ضعف الوجود الرقمي ويزيدون أرباحهم على حسابك." : "⚠️ Competitors are exploiting this weak presence to steal your leads."}
               </p>
             </div>
           </div>
        </div>

        {/* Future with System */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 p-10 rounded-[3rem] border-2 border-indigo-500/30 relative overflow-hidden shadow-indigo-500/10 shadow-2xl">
           <div className="absolute top-0 right-0 p-6 text-indigo-500/10"><Rocket size={120} /></div>
           <div className="flex items-center gap-4 mb-8 border-b border-indigo-500/20 pb-6">
             <Zap className="text-indigo-400 fill-indigo-400" size={28} />
             <h3 className="text-white font-black text-xl uppercase tracking-tighter">{isRTL ? "مع Elegant Options" : "With Elegant Options"}</h3>
           </div>
           <div className="space-y-8">
             <div className="flex justify-between items-end">
               <span className="text-indigo-200 font-bold">{isRTL ? "النمو الأسبوعي المتوقع" : "Projected Weekly"}</span>
               <span className="text-4xl font-black text-indigo-400">+{projectedWeekly.toFixed(0)}</span>
             </div>
             <div className="flex justify-between items-end">
               <span className="text-indigo-200 font-bold">{isRTL ? "النمو الشهري المتوقع" : "Projected Monthly"}</span>
               <span className="text-4xl font-black text-indigo-400">+{projectedMonthly.toFixed(0)}</span>
             </div>
             <div className="flex justify-between items-center pt-6 border-t border-indigo-500/20">
               <span className="text-indigo-300 text-xs font-black uppercase tracking-widest">{isRTL ? "تغطية العملاء اليومية" : "Daily Conversion"}</span>
               <div className="bg-green-500 text-black px-4 py-1 rounded-full font-black text-xs">10% RULE</div>
             </div>
           </div>
        </div>
      </div>

      {/* 4. REVIEW QUALITY ANALYSIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 text-center">
          <span className="text-slate-500 text-xs font-black block mb-4 uppercase">{isRTL ? "إجمالي التقييمات" : "Total Reviews"}</span>
          <div className="text-5xl font-black text-white tracking-tighter">{totalReviews}</div>
        </div>
        <div className="bg-green-500/5 p-8 rounded-[2.5rem] border border-green-500/20 text-center group hover:bg-green-500/10 transition-all">
          <div className="flex justify-center mb-4 text-green-500"><CheckCircle size={32} /></div>
          <span className="text-green-500 text-xs font-black block mb-2 uppercase">{isRTL ? "إيجابية مستحقة" : "Positive"}</span>
          <div className="text-4xl font-black text-green-400 tracking-tighter">%{data.positiveReviews || 85}</div>
        </div>
        <div className="bg-red-500/5 p-8 rounded-[2.5rem] border border-red-500/20 text-center relative group overflow-hidden">
          <div className="flex justify-center mb-4 text-red-500"><AlertTriangle size={32} /></div>
          <span className="text-red-500 text-xs font-black block mb-2 uppercase">{isRTL ? "سلبية عامة" : "Negative"}</span>
          <div className="text-4xl font-black text-red-500 tracking-tighter">%{data.negativeReviews || 15}</div>
          <div className="mt-6 p-4 bg-red-950/40 rounded-2xl border border-red-500/20 text-[11px] text-red-300 leading-relaxed font-bold italic">
            {isRTL 
              ? `⚠️ لو كان نظامنا مفعلاً، لكانت هذه التقييمات السلبية قد حُلت داخلياً مع الإدارة قبل أن تُنشر علناً وتؤثر على قرار العملاء الجدد.`
              : `⚠️ With our system, these negative reviews would have been intercepted and resolved privately before they damaged your public reputation.`}
          </div>
        </div>
      </div>

      {/* 5. SYSTEM FEATURES (VERTICAL CARDS) */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6 hover:border-indigo-500/30 transition-all">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400"><Bot size={36} /></div>
          <h4 className="text-2xl font-black text-white italic">AI Smart Replies</h4>
          <p className="text-slate-400 leading-relaxed font-medium">الرد الآلي والذكي على كافة التقييمات في Google Maps على مدار 24 ساعة، مما يحسن ظهورك في محركات البحث ويُشعر العميل بالاهتمام الفوري.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6 hover:border-orange-500/30 transition-all">
          <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400"><ShieldCheck size={36} /></div>
          <h4 className="text-2xl font-black text-white italic">Reputation Shield</h4>
          <p className="text-slate-400 leading-relaxed font-medium">فلترة ذكية تمنع ظهور أي تقييم (3 نجوم أو أقل) علناً، حيث يتم تحويله فوراً كرسالة خاصة للمدير لمعالجة المشكلة وضمان رضا العميل داخلياً.</p>
        </div>
        <div className={`bg-slate-900 border border-slate-800 p-10 rounded-[3rem] space-y-6 hover:border-green-500/30 transition-all ${!isRestaurant && 'opacity-50'}`}>
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400"><Bike size={36} /></div>
          <h4 className="text-2xl font-black text-white italic">Delivery Integration</h4>
          <p className="text-slate-400 leading-relaxed font-medium">ربط مباشر مع طلبات وكيتا؛ نقوم بإرسال رسائل طلب تقييم تلقائية عبر واتساب فور استلام الطلب، مما يحول كل عملية توصيل إلى فرصة نمو حقيقية.</p>
        </div>
      </div>

      {/* 6. REVENUE LEAK (THE KNOCKOUT) */}
      <div className="bg-gradient-to-br from-red-950 to-slate-950 p-12 md:p-16 rounded-[4rem] border border-red-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5"><AlertTriangle size={250} /></div>
        <div className="relative z-10 text-center md:text-right space-y-6">
             <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-red-500/20">
               <TrendingDown size={14} /> {isRTL ? "نزيف الإيرادات السنوي" : "Annual Revenue Leak"}
             </div>
             <p className="text-slate-300 text-xl md:text-2xl font-bold leading-relaxed max-w-3xl">
               {isRTL 
                 ? "بسبب ضعف تصنيفك الحالي وعدم تفعيل أدوات النمو، أنت تفقد حصة سوقية ضخمة تذهب مباشرة للمنافسين."
                 : "Due to your current ranking, you are losing significant market share to competitors appearing before you."}
             </p>
             <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                <div className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
                  {lostRevenue.toLocaleString()}
                </div>
                <div className="text-3xl md:text-5xl font-black text-red-500 uppercase">{currency}</div>
             </div>
             <p className="text-slate-500 font-black text-sm uppercase tracking-[0.3em]">{isRTL ? "خسارة سنوية تقديرية" : "Estimated Annual Loss"}</p>
        </div>
      </div>

      {/* 7. GROWTH OPPORTUNITY (DYNAMIC PROFIT) */}
      <div className="bg-slate-900 border-2 border-indigo-500/20 rounded-[4rem] p-12 md:p-16 relative overflow-hidden shadow-3xl group">
          <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px]"></div>
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-3 bg-indigo-500/10 text-indigo-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20">
                     <Rocket className="w-4 h-4 animate-bounce" /> {isRTL ? "فرصة نمو استثنائية" : "Growth Opportunity"}
                  </div>
                  <h4 className="text-4xl font-black text-white leading-tight italic">{isRTL ? "أرباح إضافية بانتظار تفعيلها" : "Hidden Profits Waiting"}</h4>
                  <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-indigo-500/30 pl-6">
                    {t.dashboard?.marketing?.persuasive || "Elegant Options protects your loyalty and prevents silent churn."}
                  </p>
              </div>

              <div className="bg-slate-800/50 p-12 rounded-[3.5rem] border border-indigo-500/30 text-center shadow-3xl min-w-[320px] transform hover:scale-105 transition-transform backdrop-blur-xl">
                  <Zap className="absolute -top-6 -right-6 w-14 h-14 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]" />
                  <span className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] block mb-6">{isRTL ? "أرباح سنوية إضافية محتملة" : "Potential Annual Profit"}</span>
                  <div className="flex flex-col items-center">
                      <span className="text-7xl font-black text-white leading-none tracking-tighter drop-shadow-xl">{dynamicProfit}</span>
                      <span className="text-xl text-indigo-400 font-black uppercase tracking-[0.4em] mt-6">{currency}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* 8. QUOTE & STRATEGIC RECOMMENDATION */}
      <div className="space-y-10 py-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto px-4">
             <Quote className="text-indigo-500/20" size={64} fill="currentColor" />
             <p className="text-slate-200 text-2xl md:text-3xl font-black italic leading-tight">
               "{t.dashboard?.quote?.text || "A one-star increase leads to 5-9% revenue growth."}"
             </p>
             <span className="text-indigo-500 font-black tracking-[0.3em] text-xs uppercase">Harvard Business School</span>
          </div>

          <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
             <div className="absolute -top-12 -right-12 p-8 text-indigo-500/5 rotate-12 transition-transform group-hover:scale-110">
                <Award size={200} />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4 text-indigo-400 mb-2">
                   <ShieldCheck size={32} />
                   <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic">{t.dashboard?.strategicRecommendation?.title || "Strategic Recommendation"}</h3>
                </div>
                <p className="text-slate-300 text-xl md:text-2xl leading-relaxed font-bold">
                   {(t.dashboard?.strategicRecommendation?.text || "").replace('{name}', data.projectName || (isRTL ? 'مشروعكم' : 'Your Project'))}
                </p>
             </div>
          </div>
      </div>

      {/* 9. FINAL CTA SECTION */}
      <div className="text-center space-y-12 pt-10 border-t border-slate-800">
         <div className="space-y-4">
            <h2 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase italic">{isRTL ? "لا تكن خفياً" : "Don't Be Invisible"}.</h2>
            <p className="text-indigo-400 text-2xl md:text-3xl font-black animate-pulse uppercase tracking-widest">
              {t.dashboard?.marketing?.motivational || "Every unmanaged review is a lost customer."}
            </p>
         </div>

         <div className="flex flex-col gap-6 justify-center items-center">
            {/* Visual Exp Button */}
            <button onClick={onVisualExp} className="w-full md:w-auto px-16 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl transform hover:-translate-y-2 transition-all flex items-center justify-center gap-4 group">
                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                {isRTL ? "تجربة بصرية (كيف يعمل النظام)" : "Visual Simulation"}
            </button>

            {/* WhatsApp & Reset Buttons */}
            <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-14 py-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-3xl rounded-[2.5rem] shadow-2xl shadow-green-500/40 transform hover:-translate-y-2 transition-all flex items-center justify-center gap-4 group">
                   <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                   {isRTL ? "اطلب النظام الآن" : "Order System"}
                </a>
                <button onClick={onReset} className="w-full md:w-auto px-10 py-8 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black text-xl rounded-[2.5rem] border border-slate-700 transition-all flex items-center justify-center gap-4 group">
                   <RotateCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                   {isRTL ? "تحليل نشاط آخر" : "Analyze Another"}
                </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default ResultsDashboard;
