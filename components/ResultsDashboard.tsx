import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, ArrowUpRight,
  MessageCircle, RotateCw, Play, Zap, BarChart3,
  Utensils, Bike, Percent, Users, Award, CheckCircle
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

  // 1. نظام العملة والقدرة الشرائية الذكي (كويتي vs عالمي)
  const getRegionalData = () => {
    const address = data.address?.toLowerCase() || "";
    
    // فحص إذا كان المشروع داخل الكويت
    const isKuwait = address.includes("kuwait") || address.includes("الكويت");

    if (isKuwait) {
      return { 
        symbol: isRTL ? "د.ك" : "KWD", 
        ticket: 15, // متوسط طلب 15 دينار كويتي
        label: isRTL ? "سعر الشراء المحلي" : "Local Ticket Size"
      };
    } else {
      // أي دولة خارج الكويت تتحول للدولار الأمريكي لضمان العالمية
      return { 
        symbol: isRTL ? "دولار" : "USD", 
        ticket: 55, // رفع السعر لـ 55 دولار ليعطي أرقام خسائر ضخمة ومقنعة
        label: isRTL ? "سعر الشراء العالمي" : "Global Ticket Size"
      };
    }
  };

  const regional = getRegionalData();
  const currency = regional.symbol;
  const avgTicket = regional.ticket;

  // 2. حسابات النمو والتحليل الصارم (Strict Logic)
  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearlyReviews = currentMonthly * 12;
  const totalReviews = data.currentReviews || 0;
  const multiplier = isRestaurant ? 10 : 6; 
  const projectedMonthly = Math.max(20, currentMonthly * multiplier);
  const projectedYearlyReviews = projectedMonthly * 12;

  // معادلة نزيف الإيرادات (Pain Point Calculation)
  const influenceFactor = 20; 
  const lostPotentialCustomers = (projectedYearlyReviews - currentYearlyReviews) * 0.15; 
  const lostRevenue = Math.round(lostPotentialCustomers * avgTicket);

  // 3. تحديد الوضع السوقي (30-80 تقييم)
  const getMarketStatus = () => {
    const incentive = isRTL 
      ? "⚠️ تنبيه: المنافسون في منطقتك يكثفون نشاطهم الآن لتجاوز تصنيفك، بعضهم بدأ بالفعل بخطف حصتك السوقية."
      : "⚠️ Alert: Competitors are intensifying their activity to overtake your market share.";

    if (currentMonthly <= 30) {
      return { 
        title: isRTL ? "شبح رقمي - مخفي تماماً" : "Digital Ghost - Hidden", 
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost, incentive 
      };
    } else if (currentMonthly <= 80) {
      return { 
        title: isRTL ? "تواجد متوسط - وضع قلق" : "Average Presence - Risky", 
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target, incentive 
      };
    }
    return { 
      title: isRTL ? "متواجد بقوة - تحت الحصار" : "Strong Presence - Under Siege", 
      color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown, incentive 
    };
  };

  const status = getMarketStatus();
  const waLink = `https://wa.me/96550656365?text=${encodeURIComponent(isRTL ? `أريد إيقاف نزيف الإيرادات وحل مشكلة التقييمات السلبية لـ (${data.projectName})` : `I want to stop revenue leak and solve negative reviews for (${data.projectName})`)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. بطاقة التصنيف الصادم */}
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
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-orange-400 text-sm font-bold animate-pulse">
               {status.incentive}
            </div>
          </div>
        </div>
      </div>

      {/* 2. تحليل جودة التقييمات (مخاطبة الألم) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
          <span className="text-slate-500 text-xs font-bold block mb-2">{isRTL ? "إجمالي التقييمات" : "Total Reviews"}</span>
          <div className="text-3xl font-black text-white">{totalReviews}</div>
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
              : `⚠️ If you were with us, these (${data.negativeReviews}) negative reviews would have been resolved privately.`}
          </div>
        </div>
      </div>

      {/* 3. نزيف الإيرادات السنوي (الضربة القاضية) */}
      <div className="bg-gradient-to-br from-red-950 to-slate-900 p-8 rounded-[2.5rem] border border-red-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5"><AlertTriangle size={150} /></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right">
          <div className="flex-1">
             <h4 className="text-red-400 font-black text-xl mb-2">{isRTL ? "نزيف الإيرادات السنوي (فرصة ضائعة)" : "Annual Revenue Leak"}</h4>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">
               {isRTL 
                 ? `بناءً على ${regional.label} (${avgTicket} ${currency})، أنت تفقد مبالغ ضخمة بسبب تجاهل العملاء لمشروعك لصالح المنافسين.`
                 : `Based on ${regional.label} (${avgTicket} ${currency}), you are losing significant revenue to competitors.`}
             </p>
             <div className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
                {lostRevenue.toLocaleString()} <span className="text-xl text-red-500">{currency}</span>
             </div>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-10 py-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xl transition-all animate-pulse shadow-xl shadow-red-600/20">
            {isRTL ? "أوقف النزيف الآن" : "Stop The Bleed"}
          </a>
        </div>
      </div>

      {/* 4. تطبيقات التوصيل (للمطاعم) */}
      {isRestaurant && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-orange-500/30 flex flex-col md:flex-row items-center gap-6">
           <div className="flex -space-x-4 rtl:space-x-reverse">
              <div className="w-14 h-14 rounded-xl bg-[#ff5a00] flex items-center justify-center border-4 border-slate-900 z-10 shadow-lg"><Bike className="text-white" /></div>
              <div className="w-14 h-14 rounded-xl bg-[#fec400] flex items-center justify-center border-4 border-slate-900 shadow-lg"><Zap className="text-black fill-black" /></div>
           </div>
           <div className="flex-1 text-center md:text-right">
              <h4 className="text-white font-bold">{isRTL ? "مضاعفة نتائج طلبات وكيتا" : "Talabat & Keeta Boost"}</h4>
              <p className="text-slate-400 text-xs mt-1">{isRTL ? "حوّل عملاء التوصيل المجهولين إلى تقييمات حقيقية وقاعدة بيانات دائمة." : "Convert anonymous delivery users into real reviews."}</p>
           </div>
        </div>
      )}

      {/* 5. أزرار القرار */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 text-sm">
        <button onClick={onVisualExp} className="py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1">
          <Play size={20} fill="currentColor" /> {isRTL ? "شاهد الحل الذكي (Simulation)" : "Visual Simulation"}
        </button>
        <button onClick={onReset} className="py-5 bg-slate-900 text-slate-500 hover:text-white rounded-2xl font-bold border border-slate-800 transition-all flex items-center justify-center gap-2">
          <RotateCw size={18} /> {isRTL ? "تحليل نشاط تجاري آخر" : "Analyze Another"}
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
