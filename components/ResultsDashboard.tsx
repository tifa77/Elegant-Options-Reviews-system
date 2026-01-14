import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, ArrowUpRight,
  MessageCircle, RotateCw, Play, Zap, BarChart3,
  Utensils, Bike, Percent, Users, Award, CheckCircle, Eye
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

  // 1. نظام العملة (الكويت KWD / عالمي USD)
  const getRegionalData = () => {
    const address = data.address?.toLowerCase() || "";
    const isKuwait = address.includes("kuwait") || address.includes("الكويت");

    if (isKuwait) {
      return { 
        symbol: isRTL ? "د.ك" : "KWD", 
        ticket: 20 // متوسط القيمة 20 د.ك لتعظيم الخسارة
      };
    } else {
      return { 
        symbol: isRTL ? "دولار" : "USD", 
        ticket: 60 // 60 دولار للمشاريع العالمية
      };
    }
  };

  const regional = getRegionalData();
  const currency = regional.symbol;
  
  // 2. الحسابات الذكية والنمو
  const currentWeekly = data.weeklyGrowth || 0;
  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearlyReviews = currentMonthly * 12;

  const multiplier = isRestaurant ? 10 : 6; 
  // حسابات المستقبل (مع النظام)
  const projectedWeekly = Math.max(8, currentWeekly * multiplier);
  const projectedMonthly = Math.max(35, currentMonthly * multiplier);
  const projectedYearlyReviews = projectedMonthly * 12;

  const percentageIncrease = currentYearlyReviews > 0 
    ? Math.round(((projectedYearlyReviews - currentYearlyReviews) / currentYearlyReviews) * 100) 
    : 100;

  // 3. معادلة الخسارة "المضخمة" (لتعظيم الألم)
  const customerLossMultiplier = 4; // كل تقييم مفقود = خسارة 4 عملاء
  const lostCustomersCount = (projectedYearlyReviews - currentYearlyReviews) * customerLossMultiplier;
  const lostRevenue = lostCustomersCount * regional.ticket;

  // 4. التصنيف السوقي والشرح التفصيلي
  const getMarketStatus = () => {
    const incentive = isRTL 
      ? "⚠️ تنبيه: المنافسون في منطقتك يكثفون نشاطهم الآن لتجاوز تصنيفك."
      : "⚠️ Alert: Competitors are intensifying their activity to overtake you.";

    if (currentMonthly <= 30) {
      return { 
        title: isRTL ? "شبح رقمي - مخفي" : "Digital Ghost", 
        desc: isRTL 
          ? "أنت بعيد جداً عن المنافسين ولا تظهر للعملاء الجدد الباحثين عن خيارات جيدة. محركات البحث تتجاهل نشاطك بسبب ضعف التفاعل."
          : "You are far behind competitors and invisible to new customers looking for good options.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost, incentive 
      };
    } else if (currentMonthly <= 80) {
      return { 
        title: isRTL ? "تواجد متوسط" : "Average Presence", 
        desc: isRTL 
          ? "أنت موجود ولكنك مهدد. أي تراجع بسيط سيجعلك تختفي خلف المنافسين الأقوياء."
          : "You are present but at risk. Any decline will push you behind strong competitors.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target, incentive 
      };
    }
    return { 
      title: isRTL ? "متواجد بقوة" : "Strong Presence", 
      desc: isRTL 
          ? "أداء جيد، ولكن الحفاظ على القمة أصعب من الوصول إليها. المنافسون يتربصون بك."
          : "Good performance, but staying on top is harder than getting there.",
      color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown, incentive 
    };
  };

  const status = getMarketStatus();
  
  // رابط الواتساب المباشر
  const waNumber = "96550656365";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `أريد تفعيل نظام النمو وإيقاف خسارة العملاء لمشروعي (${data.projectName})` : `I want to activate growth and stop customer loss for (${data.projectName})`)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* الرأس */}
      <div className="flex items-center justify-between px-2 pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
        <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase">Growth Report</span>
      </div>

      {/* 1. بطاقة التصنيف (مع شرح الشبح الرقمي) */}
      <div className={`p-8 rounded-[2.5rem] border ${status.border} ${status.bg} backdrop-blur-sm relative overflow-hidden group shadow-2xl`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <status.icon size={150} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
          <div className={`p-6 rounded-full bg-slate-900 shadow-2xl ${status.color}`}>
            <status.icon size={48} />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">{isRTL ? "التشخيص السوقي الحالي" : "Current Market Diagnosis"}</h3>
            <div className={`text-4xl font-black ${status.color} mb-3`}>{status.title}</div>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed font-medium opacity-90">
                {status.desc}
            </p>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-orange-400 text-sm font-bold animate-pulse">
               {status.incentive}
            </div>
          </div>
        </div>
      </div>

      {/* 2. تحليل جودة التقييمات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <span className="text-slate-500 text-xs font-bold block mb-2">{isRTL ? "إجمالي التقييمات" : "Total Reviews"}</span>
          <div className="text-3xl font-black text-white">{data.currentReviews || 0}</div>
        </div>
        <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
          <span className="text-green-500 text-xs font-bold block mb-2">{isRTL ? "إيجابية (4-5 نجوم)" : "Positive"}</span>
          <div className="text-3xl font-black text-green-400">{data.positiveReviews || 0}</div>
        </div>
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20 relative">
          <span className="text-red-500 text-xs font-bold block mb-2">{isRTL ? "سلبية (1-3 نجوم)" : "Negative"}</span>
          <div className="text-3xl font-black text-red-500">{data.negativeReviews || 0}</div>
          <div className="mt-4 p-3 bg-red-500/10 rounded-xl text-[10px] text-red-300 leading-relaxed italic border border-red-500/10">
            {isRTL 
              ? `⚠️ لو كنت مشتركاً بنظامنا، لكانت هذه التقييمات السلبية (${data.negativeReviews}) قد حُلت داخلياً قبل أن تُنشر علناً.`
              : `⚠️ With our system, these (${data.negativeReviews}) negative reviews would have been resolved privately.`}
          </div>
        </div>
      </div>

      {/* 3. مقارنة الأداء التفصيلية (التصميم القديم المطلوب) */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* العمود الأول: الوضع الحالي */}
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
               <span className="text-xl font-bold text-slate-400">{currentYearlyReviews}</span>
             </div>
           </div>
        </div>

        {/* العمود الثاني: المستقبل مع النظام */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-primary-500/30 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-600"></div>
           <div className="flex items-center gap-3 mb-6 border-b border-primary-500/20 pb-4">
             <Zap className="text-primary-400 fill-primary-400" size={20} />
             <h3 className="text-white font-bold">{isRTL ? "مع Elegant Options" : "With Elegant Options"} <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-md">PRO</span></h3>
           </div>
           <div className="space-y-6">
             <div className="flex justify-between items-end">
               <span className="text-blue-100 text-sm font-medium">{isRTL ? "النمو الأسبوعي المتوقع" : "Projected Weekly"}</span>
               <span className="text-3xl font-black text-primary-400">+{projectedWeekly}</span>
             </div>
             <div className="flex justify-between items-end">
               <span className="text-blue-100 text-sm font-medium">{isRTL ? "النمو الشهري المتوقع" : "Projected Monthly"}</span>
               <span className="text-3xl font-black text-primary-400">+{projectedMonthly}</span>
             </div>
             <div className="flex justify-between items-center pt-2 border-t border-primary-500/20">
               <span className="text-blue-200 text-xs font-medium">{isRTL ? "رصيد التقييمات السنوي" : "Annual Asset"}</span>
               <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-green-400 font-black text-sm">+{percentageIncrease}%</div>
             </div>
           </div>
        </div>

      </div>

      {/* 4. ميزة طلبات وكيتا (شرح تفصيلي للآلية) */}
      {isRestaurant && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-orange-500/30 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff5a00] flex items-center justify-center border-4 border-slate-900 z-10 shadow-lg"><Bike className="text-white w-8 h-8" /></div>
                    <div className="w-16 h-16 rounded-2xl bg-[#fec400] flex items-center justify-center border-4 border-slate-900 shadow-lg"><Zap className="text-black w-8 h-8 fill-black" /></div>
                </div>
                <div className="flex-1 text-center md:text-right">
                    <h3 className="text-white font-black text-xl mb-2">{isRTL ? "مضاعفة النتائج عبر تطبيقات التوصيل" : "Talabat & Keeta Integration"}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {isRTL 
                         ? "نقوم بإرسال رسائل واتساب تلقائية لعملائك القادمين من (طلبات وكيتا) مباشرة بعد استلام الطلب، نطلب منهم تقييم تجربتهم فوراً. هذا يضمن تحويل كل طلب توصيل إلى فرصة تقييم حقيقية." 
                         : "We send automated WhatsApp messages to your customers from Talabat & Keeta immediately after delivery, requesting a review. This ensures every order is a potential 5-star review."}
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* 5. نزيف الإيرادات السنوي (الضربة القاضية) */}
      <div className="bg-gradient-to-br from-red-950 to-slate-900 p-8 rounded-[2.5rem] border border-red-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5"><AlertTriangle size={150} /></div>
        <div className="relative z-10 text-center md:text-right">
             <h4 className="text-red-400 font-black text-xl mb-2">{isRTL ? "نزيف الإيرادات السنوي (فرصة ضائعة)" : "Annual Revenue Leak"}</h4>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">
               {isRTL 
                 ? "بسبب ضعف تصنيفك الحالي، أنت تفقد حصة سوقية ضخمة لصالح المنافسين الذين يظهرون قبلك في النتائج."
                 : "Due to your current ranking, you are losing significant market share to competitors appearing before you."}
             </p>
             <div className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                {lostRevenue.toLocaleString()} <span className="text-2xl text-red-500">{currency}</span>
             </div>
        </div>
      </div>

      {/* 6. الأزرار السفلية (الترتيب الطبيعي الجديد) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          
          {/* زر التجربة البصرية (خذ فكرة) */}
          <button onClick={onVisualExp} className="py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1">
             <Eye size={22} />
             {isRTL ? "خذ فكرة (تجربة بصرية)" : "Visual Simulation"}
          </button>

          {/* زر الواتساب الأخضر الكبير */}
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-5 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 animate-pulse">
             <MessageCircle size={24} fill="white" /> 
             {isRTL ? "اطلب النظام الآن" : "Order System Now"}
          </a>

      </div>
      
      {/* زر تحليل جديد (أسفل الجميع) */}
      <div className="pt-2">
         <button onClick={onReset} className="w-full py-4 bg-slate-900 text-slate-500 hover:text-white rounded-2xl font-bold border border-slate-800 transition-all flex items-center justify-center gap-2">
            <RotateCw size={18} /> {isRTL ? "تحليل نشاط تجاري آخر" : "Analyze Another"}
         </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
