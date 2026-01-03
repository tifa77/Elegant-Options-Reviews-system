import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, 
  MessageCircle, RotateCw, Zap, Bike, 
  ShieldAlert, Star, TrendingDown, Eye, Quote, CheckCircle2, ThumbsUp
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

  // 1. إعدادات المنطقة والعملة (منطقي وواقعي)
  const getRegionalData = () => {
    const address = data.address?.toLowerCase() || "";
    const isKuwait = address.includes("kuwait") || address.includes("الكويت");
    
    // متوسط الفاتورة التقديري (Conservative Estimate)
    // الكويت: 3 دنانير (للطلبات السريعة/المقاهي) 
    // عالمي: 10 دولار
    if (isKuwait) {
      return { symbol: isRTL ? "د.ك" : "KWD", ticket: 3 }; 
    } else {
      return { symbol: isRTL ? "دولار" : "USD", ticket: 10 }; 
    }
  };

  const regional = getRegionalData();
  const currency = regional.symbol;

  // استخراج عدد العملاء اليومي (المدخل من قبل المستخدم أو الافتراضي)
  // ملاحظة: تأكد أن data.dailyCustomers يحتوي على الرقم الذي أدخله العميل
  const dailyCustomers = Number(data.dailyCustomers) || 50; // افتراضي 50 إذا لم يدخل رقم

  // 2. معادلة النمو (30% من العملاء يقيمون)
  const conversionRate = 0.30; // 30%
  const potentialDailyReviews = Math.floor(dailyCustomers * conversionRate);
  const potentialMonthlyReviews = potentialDailyReviews * 30;
  const potentialYearlyReviews = potentialMonthlyReviews * 12;

  // 3. معادلة الإيرادات الضائعة (الواقعية الجديدة)
  // المنطق: تخسر 30% من العملاء لصالح المنافس الأفضل سمعة
  const lossRate = 0.30;
  const lostCustomersDaily = Math.floor(dailyCustomers * lossRate);
  const dailyRevenueLoss = lostCustomersDaily * regional.ticket;
  const yearlyRevenueLoss = dailyRevenueLoss * 365;

  // 4. التصنيف السوقي الحالي
  const currentMonthly = data.monthlyGrowth || 0;
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
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `مرحباً، قمت بفحص مشروعي (${data.projectName}) ووجدت فرصة لاستعادة إيرادات بقيمة ${yearlyRevenueLoss} ${currency}. أريد تفاصيل النظام.` : `Hi, I audited (${data.projectName}) and found a recoverable revenue of ${yearlyRevenueLoss} ${currency}. I need details.`)}`;

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

      {/* 2. The Potential Growth Engine (The 30% Logic) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
            <Zap className="text-yellow-400 fill-yellow-400 animate-pulse" />
            <h3 className="text-xl font-bold text-white">
                {isRTL ? "ماذا لو حصلت على تقييم من 30% فقط من عملائك؟" : "What if only 30% of customers reviewed you?"}
            </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3 md:gap-6">
            {/* Daily */}
            <div className="bg-slate-900/60 border border-slate-700 p-6 rounded-3xl text-center">
                <span className="text-slate-500 text-xs font-bold block mb-1">{isRTL ? "يومياً" : "Daily"}</span>
                <div className="text-3xl font-black text-white">+{potentialDailyReviews}</div>
                <span className="text-[10px] text-green-400">{isRTL ? "تقييم جديد" : "New Reviews"}</span>
            </div>
            {/* Monthly */}
            <div className="bg-slate-900/80 border border-primary-500/30 p-6 rounded-3xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-500/5"></div>
                <span className="text-primary-300 text-xs font-bold block mb-1">{isRTL ? "شهرياً" : "Monthly"}</span>
                <div className="text-4xl font-black text-white">+{potentialMonthlyReviews}</div>
                <span className="text-[10px] text-primary-400">{isRTL ? "تقييم جديد" : "New Reviews"}</span>
            </div>
            {/* Yearly */}
            <div className="bg-gradient-to-br from-primary-900/40 to-slate-900 border border-primary-500/50 p-6 rounded-3xl text-center relative shadow-lg">
                <div className="absolute top-2 right-2"><Crown size={12} className="text-yellow-400 fill-yellow-400"/></div>
                <span className="text-slate-300 text-xs font-bold block mb-1">{isRTL ? "خلال عام" : "Yearly"}</span>
                <div className="text-3xl font-black text-white">+{potentialYearlyReviews}</div>
                <span className="text-[10px] text-green-400">{isRTL ? "سيطرة كاملة" : "Dominance"}</span>
            </div>
        </div>

        {/* AI Reply Value Prop */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-1">
                <MessageCircle size={24} />
            </div>
            <div>
                <h4 className="text-white font-bold text-sm mb-1">
                    {isRTL ? "قلق من كثرة التقييمات؟ دع الذكاء الاصطناعي يتولى الأمر!" : "Worried about volume? Let AI handle it!"}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                    {isRTL 
                     ? "لن تضيع وقتك في الكتابة. وكيلنا الذكي يرد على مئات التقييمات فوراً وبشكل لائق ومخصص لكل عميل. جوجل تعشق الشركات التي تتفاعل بسرعة (Response Speed)، مما يرفع ترتيبك تلقائياً."
                     : "Our AI replies to hundreds of reviews instantly and politely. Google loves fast response speeds, boosting your rank automatically."}
                </p>
            </div>
        </div>
      </div>

      {/* 3. Delivery Integration (Restaurant Specific) */}
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
                         ? "بمجرد ربط النظام، سيتم إرسال رسالة واتساب للعميل فور استلام طلبه من (طلبات/كيتا). هذا يحول كل طلب توصيل 'صامت' إلى صوت مسموع وتقييم 5 نجوم." 
                         : "Integration sends a WhatsApp msg immediately after Talabat/Keeta delivery. Turns silent orders into 5-star reviews."}
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* 4. Realistic Revenue Opportunity */}
      <div className="mt-8 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[2.5rem] opacity-20 blur-lg"></div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-red-500/30 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-right">
                    <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                        <TrendingDown className="text-red-500" />
                        <h4 className="text-red-400 font-bold text-lg">{isRTL ? "أرباحك المستردة (فرصة ضائعة)" : "Recoverable Revenue"}</h4>
                    </div>
                    <div className="text-5xl font-black text-white tracking-tighter mb-4">
                        {yearlyRevenueLoss.toLocaleString()} <span className="text-2xl text-slate-500">{currency}</span>
                    </div>
                    
                    {/* The Logic Explanation */}
                    <div className="bg-red-950/30 p-4 rounded-xl border border-red-500/10 text-xs text-slate-300 leading-relaxed text-center md:text-right">
                        {isRTL ? (
                            <>
                                <strong className="text-white block mb-1">منطق الحساب الواقعي:</strong>
                                في المتوسط، أنت تفقد <span className="text-red-400 font-bold">3 عملاء من كل 10</span> (30%) لصالح المنافس الأعلى تقييماً.
                                <br/>
                                <span className="opacity-70 mt-1 block">
                                    {lostCustomersDaily} عملاء يومياً × {regional.ticket} {currency} متوسط طلب × 365 يوم
                                </span>
                            </>
                        ) : (
                            <>
                                <strong className="text-white block mb-1">Realistic Logic:</strong>
                                You lose <span className="text-red-400 font-bold">3 out of 10 customers</span> (30%) to higher-rated competitors.
                                <br/>
                                <span className="opacity-70 mt-1 block">
                                    {lostCustomersDaily} customers/day × {regional.ticket} {currency} avg ticket × 365 days
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Negative Shield Value Prop */}
                <div className="w-full md:w-1/3 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 text-center">
                    <ShieldAlert size={40} className="mx-auto text-orange-400 mb-3" />
                    <h5 className="text-white font-bold text-sm mb-2">{isRTL ? "نظام شعلة للحماية" : "Fire Shield System"}</h5>
                    <p className="text-slate-400 text-xs">
                        {isRTL 
                         ? "نظامنا يوجه العميل الغاضب لمراسلة الإدارة مباشرة (Private Feedback)، مما يحميك من التقييمات السلبية الفاضحة على جوجل." 
                         : "Our system directs angry customers to private manager chat, shielding you from public negative reviews."}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* 5. Social Proof / Impact */}
      <div className="py-6 border-t border-b border-slate-800/50 my-6">
         <div className="flex items-start gap-4 opacity-80">
            <Quote className="text-slate-600 shrink-0" size={32} />
            <div>
                <p className="text-slate-300 text-sm italic mb-2">
                    {isRTL 
                     ? "\"زيادة نجمة واحدة في التقييم تؤدي إلى زيادة في الإيرادات تتراوح بين 5% إلى 9%.\"" 
                     : "\"A one-star increase in Yelp rating leads to a 5-9 percent increase in revenue.\""}
                </p>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    — Harvard Business School Study
                </span>
            </div>
         </div>
      </div>

      {/* 6. Call to Actions */}
      <div className="space-y-4 pt-2">
         
         {/* Pre-CTA Text */}
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
