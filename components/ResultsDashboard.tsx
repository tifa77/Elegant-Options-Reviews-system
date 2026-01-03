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
    
    // قيمة الولاء المفقودة (Loyalty Value) = 1 وحدة عملة (تقدير متحفظ جداً لزيادة المصداقية)
    if (isKuwait) {
      return { symbol: isRTL ? "د.ك" : "KWD", loyaltyVal: 1 }; 
    } else {
      return { symbol: isRTL ? "دولار" : "USD", loyaltyVal: 3 }; 
    }
  };

  const regional = getRegionalData();
  const currency = regional.symbol;

  // استخراج عدد العملاء اليومي (المدخل أو الافتراضي)
  const dailyCustomers = Number(data.dailyCustomers) || 50; 

  // 2. معادلة النمو (30% من العملاء يقيمون)
  const conversionRate = 0.30; // 30%
  const potentialDailyReviews = Math.floor(dailyCustomers * conversionRate);
  const potentialMonthlyReviews = potentialDailyReviews * 30;
  const potentialYearlyReviews = potentialMonthlyReviews * 12;

  // 3. معادلة "الأرباح الضائعة من الولاء" 
  // المنطق: 30% عملاء × 365 يوم × 1 دينار قيمة ولاء متكررة
  // هذا يحسب القيمة السنوية للفرصة الضائعة
  const yearlyLoyaltyOpportunity = potentialYearlyReviews * regional.loyaltyVal;
  const monthlyLoyaltyOpportunity = potentialMonthlyReviews * regional.loyaltyVal;

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
  // رابط الواتساب مع رسالة الديناميكية بناءً على الفرصة الضائعة
  const waNumber = "96550656365";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `مرحباً، قمت بفحص مشروعي (${data.projectName}) ووجدت فرصة لزيادة ولاء العملاء بقيمة ${yearlyLoyaltyOpportunity} ${currency} سنوياً. أريد تفعيل النظام.` : `Hi, I audited (${data.projectName}) and found a loyalty opportunity of ${yearlyLoyaltyOpportunity} ${currency}/year. I need details.`)}`;

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

      {/* 2. Review Breakdown (Showing Positive & Negative) */}
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
        {/* Negative with Protection Warning */}
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

      {/* 3. Comparison Section (Current vs Pro) */}
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
             <h3 className="text-white font-bold">{isRTL ? "مع نظام Elegant Options" : "With Elegant Options"} <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-md">PRO</span></h3>
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
               <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-green-400 font-black text-sm">+{potentialYearlyReviews}</div>
             </div>
           </div>
        </div>
      </div>

      {/* 4. Realistic Revenue Opportunity (New Loyalty Logic) */}
      <div className="mt-8 relative">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-red-500/30 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-right">
                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                        <TrendingDown className="text-red-500" />
                        <h4 className="text-red-400 font-bold text-lg">{isRTL ? "فرصة ولاء ضائعة (سنوياً)" : "Missed Loyalty Value"}</h4>
                    </div>
                    
                    {/* The Big Number (Yearly) */}
                    <div className="text-5xl font-black text-white tracking-tighter mb-4">
                        {yearlyLoyaltyOpportunity.toLocaleString()} <span className="text-2xl text-slate-500">{currency}</span>
                    </div>
                    
                    {/* The Logic Explanation */}
                    <div className="bg-red-950/30 p-4 rounded-xl border border-red-500/10 text-xs text-slate-300 leading-relaxed text-center md:text-right">
                        {isRTL ? (
                            <>
                                <strong className="text-white block mb-2">منطق الحساب الواقعي:</strong>
                                لو حصلت على تقييمات من <span className="text-white font-bold">30%</span> فقط من عملائك وكسبت ولائهم، واعتبرنا أنك كسبت منهم <span className="text-white font-bold underline">1 {currency}</span> فقط كعائد إضافي (وهذا أقل التوقعات)، فإنك تحقق عائداً سنوياً إضافياً قدره {yearlyLoyaltyOpportunity.toLocaleString()} {currency}.
                            </>
                        ) : (
                            <>
                                <strong className="text-white block mb-2">Realistic Logic:</strong>
                                If you get reviews from just <span className="text-white font-bold">30%</span> of customers and win their loyalty, assuming a return of only <span className="text-white font-bold underline">1 {currency}</span> (lowest estimate), you would generate an additional {yearlyLoyaltyOpportunity.toLocaleString()} {currency} annually.
                            </>
                        )}
                    </div>
                </div>
                
                {/* Protection System (Previously Sho'ala) */}
                <div className="w-full md:w-1/3 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center">
                    <Lock size={40} className="mx-auto text-orange-400 mb-3" />
                    <h5 className="text-white font-bold text-sm mb-2">{isRTL ? "نظام حماية السمعة" : "Reputation Protection"}</h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        {isRTL 
                         ? "يقوم نظامنا بتوجيه العميل غير الراضي لإرسال رسالة مباشرة للإدارة، مما يمنع التقييمات السلبية العلنية ويمنحك فرصة للإصلاح." 
                         : "Our system directs unhappy customers to message management directly, preventing public negative reviews."}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* 5. Worried about Volume? (Glassmorphism AI Card) */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg">
            <div className="relative shrink-0">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                <div className="relative bg-slate-900 border-2 border-blue-500 p-4 rounded-2xl">
                    <Sparkles className="text-blue-400 w-8 h-8" />
                </div>
            </div>
            <div className="text-center md:text-right flex-1">
                <h4 className="text-white font-bold text-lg mb-2">
                    {isRTL ? "لن تتعب في الرد على كل هذه التقييمات!" : "You won't get tired replying!"}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                    {isRTL 
                     ? "يقوم وكيل الذكاء الاصطناعي (AI Agent) بالرد على عملائك فوراً وبشكل لائق. جوجل تفضل الشركات التي تتفاعل بسرعة مع العملاء، مما يرفع ترتيبك في البحث تلقائياً. أنت تكسب التقييم والولاء، ونحن نتولى الرد."
                     : "Our AI Agent replies to your customers instantly and politely. Google favors businesses that engage quickly, boosting your SEO automatically. You earn loyalty, we handle the replies."}
                </p>
            </div>
      </div>

      {/* 6. Delivery Integration (Restaurant Only) */}
      {isRestaurant && (
        <div className="bg-gradient-to-r from-orange-900/20 to-slate-900 p-6 rounded-[2rem] border border-orange-500/30 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                    <div className="w-14 h-14 rounded-2xl bg-[#ff5a00] flex items-center justify-center border-4 border-slate-900 z-10 shadow-lg"><Bike className="text-white w-7 h-7" /></div>
                    <div className="w-14 h-14 rounded-2xl bg-[#fec400] flex items-center justify-center border-4 border-slate-900 shadow-lg"><Zap className="text-black w-7 h-7 fill-black" /></div>
                </div>
                <div className="flex-1 text-center md:text-right">
                    <h3 className="text-white font-black text-lg mb-2">{isRTL ? "نقلة نوعية مع تطبيقات التوصيل" : "Game Changer for Delivery"}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {isRTL 
                         ? "هذه الميزة ستنقل عملك لمستوى آخر: بمجرد ربط النظام، سيتم إرسال رسالة واتساب للعميل فور استلام طلبه من (طلبات/كيتا). هذا يحول طلبات التوصيل إلى مصدر دائم للتقييمات." 
                         : "This feature takes your business to the next level: WhatsApp messages are sent instantly after Talabat/Keeta delivery. Turning delivery orders into review sources."}
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* 7. The Harvard Quote (Gold Design) */}
      <div className="relative py-8 px-4">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
         
         <div className="text-center max-w-2xl mx-auto">
            <Quote className="text-yellow-500 mx-auto mb-4 opacity-80" size={40} />
            <h3 className="text-xl md:text-2xl font-serif text-slate-200 italic mb-4 leading-relaxed">
                {isRTL 
                 ? "\"زيادة نجمة واحدة في التقييم تؤدي إلى زيادة في الإيرادات تتراوح بين 5% إلى 9%.\"" 
                 : "\"A one-star increase in Yelp rating leads to a 5-9 percent increase in revenue.\""}
            </h3>
            <div className="inline-block bg-yellow-500/10 text-yellow-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest border border-yellow-500/20">
                HARVARD BUSINESS SCHOOL
            </div>
         </div>
      </div>

      {/* 8. Call to Actions */}
      <div className="space-y-4 pt-2">
         <p className="text-center text-slate-400 text-sm">
            {isRTL 
             ? "شاهد كيف يقوم النظام بطلب التقييم بذكاء وتصفية العملاء الغاضبين:" 
             : "See how the system smartly requests reviews and filters unhappy customers:"}
         </p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Visual Demo Button */}
             <button onClick={onVisualExp} className="py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1">
                <Eye size={20} />
                {isRTL ? "تجربة بصرية (Demo)" : "Visual Experience"}
             </button>

             {/* Order Now Button */}
             <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black text-lg shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 animate-pulse">
                <CheckCircle2 size={20} />
                {isRTL ? "اطلب النظام الآن" : "Order System Now"}
             </a>
         </div>

         {/* Reset */}
         <button onClick={onReset} className="w-full py-4 text-slate-600 hover:text-slate-400 text-xs font-medium transition-colors flex items-center justify-center gap-2">
            <RotateCw size={14} /> {isRTL ? "فحص مشروع آخر" : "Audit another business"}
         </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
