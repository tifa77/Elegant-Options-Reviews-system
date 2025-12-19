import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, ArrowUpRight,
  MessageCircle, RotateCw, Play, Zap, BarChart3,
  Utensils, Bike // أضفنا أيقونة الدراجة للتوصيل
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
  
  // التحقق هل النشاط مطعم أم لا؟
  // (نتأكد من القيمة المخزنة سواء كانت بالعربي أو الإنجليزي)
  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'مطعم' || data.projectType === 'cafe';

  // --- 1. الحسابات الذكية ---
  const currentWeekly = data.weeklyGrowth || 0;
  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearly = currentMonthly * 12;

  // للمطاعم: التوقعات تكون أعلى بسب حجم طلبات التوصيل
  const multiplier = isRestaurant ? 10 : 6; 
  
  const projectedWeekly = Math.max(5, currentWeekly * multiplier);
  const projectedMonthly = Math.max(20, currentMonthly * multiplier);
  const projectedYearly = projectedMonthly * 12;

  const avgTicket = 15; 
  const lostCustomers = projectedYearly - currentYearly;
  const lostRevenue = lostCustomers * avgTicket;

  // تحديد التصنيف
  const getRankData = () => {
    const rank = data.searchRanking || "Ghost";
    if (rank.includes("Ghost") || rank.includes("Invisible") || currentMonthly < 5) {
      return { 
        icon: Ghost, 
        color: "text-gray-400", 
        bg: "bg-gray-800/50", 
        border: "border-gray-700",
        title: isRTL ? "شبح رقمي (Ghost)" : "Digital Ghost",
        desc: isRTL ? "نشاطك مخفي تقريباً عن عملاء جدد مقارنة بالمنافسين." : "Your business is invisible to new customers compared to competitors."
      };
    }
    if (rank.includes("Challenger")) {
      return { 
        icon: Target, 
        color: "text-blue-400", 
        bg: "bg-blue-900/20", 
        border: "border-blue-700",
        title: isRTL ? "منافس صاعد" : "Challenger",
        desc: isRTL ? "أداؤك جيد لكنك تخسر الحصة الأكبر لصالح المتصدرين." : "Good performance, but losing market share to leaders."
      };
    }
    return { 
      icon: Crown, 
      color: "text-yellow-400", 
      bg: "bg-yellow-900/20", 
      border: "border-yellow-700",
      title: isRTL ? "مسيطر على السوق" : "Market Dominator",
      desc: isRTL ? "أنت تقود السوق، حافظ على الصدارة." : "You are leading the market."
    };
  };

  const rankData = getRankData();
  const RankIcon = rankData.icon;

  const waNumber = "96550656365"; 
  const customWAMessage = isRTL 
    ? `مرحباً، اطلعت على التقرير وأريد تفعيل النمو لمشروعي (${data.projectName})` 
    : `Hello, I saw the report and want to activate growth for (${data.projectName})`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 relative ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* زر واتساب العائم للموبايل */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-sm animate-bounce">
         <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-lg">
            <MessageCircle className="w-6 h-6" />
            {isRTL ? "تفعيل النمو الآن" : "Activate Growth"}
         </a>
      </div>

      {/* --- الرأس --- */}
      <div className="flex items-center justify-between px-2 pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
        <div className="flex items-center gap-2">
           <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Report</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-white">{t.dashboard.title}</h2>
        <p className="text-slate-400 text-lg">تحليل خاص بـ: <span className="text-primary-400 font-bold">{data.projectName}</span></p>
      </div>

      {/* --- بطاقة التشخيص --- */}
      <div className={`p-8 rounded-[2rem] border ${rankData.border} ${rankData.bg} backdrop-blur-sm relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <RankIcon size={150} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className={`p-6 rounded-full bg-slate-900 shadow-2xl ${rankData.color}`}>
            <RankIcon size={48} />
          </div>
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">تصنيف قوة الحساب حالياً</h3>
            <div className={`text-4xl font-black ${rankData.color} mb-3`}>
              {rankData.title}
            </div>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              {rankData.desc}
            </p>
          </div>
        </div>
      </div>

      {/* --- المقارنة الحاسمة --- */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 1. الواقع الحالي */}
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <Activity className="text-slate-500" size={20} />
            <h3 className="text-slate-400 font-bold">الوضع الحالي (بدون نظام)</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm font-medium">النمو الأسبوعي</span>
              <span className="text-2xl font-black text-slate-300">{currentWeekly} <span className="text-xs font-normal text-slate-500">تقييم</span></span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm font-medium">النمو الشهري</span>
              <span className="text-2xl font-black text-slate-300">{currentMonthly} <span className="text-xs font-normal text-slate-500">تقييم</span></span>
            </div>
             <div className="flex justify-between items-end pt-2 border-t border-slate-800/50">
              <span className="text-slate-500 text-xs font-medium">الزبائن المتأثرين سنوياً</span>
              <span className="text-xl font-bold text-slate-400">{currentYearly}</span>
            </div>
          </div>
        </div>

        {/* 2. المستقبل */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-primary-500/30 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-600"></div>
          <div className="flex items-center gap-3 mb-6 border-b border-primary-500/20 pb-4">
            <Zap className="text-primary-400 fill-primary-400" size={20} />
            <h3 className="text-white font-bold flex items-center gap-2">
              مع Elegant Options
              <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-md">PRO</span>
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-blue-100 text-sm font-medium">النمو الأسبوعي المتوقع</span>
              <div className="text-right">
                <span className="text-3xl font-black text-primary-400">{projectedWeekly}+</span>
                <div className="text-[10px] text-green-400 flex items-center justify-end gap-1">
                  +{projectedWeekly - currentWeekly} زيادة <ArrowUpRight size={10} />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-blue-100 text-sm font-medium">النمو الشهري المتوقع</span>
              <span className="text-3xl font-black text-primary-400">{projectedMonthly}+</span>
            </div>
             <div className="flex justify-between items-end pt-2 border-t border-primary-500/20">
              <span className="text-blue-200 text-xs font-medium">الزبائن المتأثرين سنوياً</span>
              <span className="text-xl font-bold text-white">{projectedYearly}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- ✨ ميزة خاصة للمطاعم فقط (New Feature) ✨ --- */}
      {isRestaurant && (
        <div className="bg-gradient-to-r from-orange-900/40 to-slate-900 p-6 rounded-[2rem] border border-orange-500/30 relative overflow-hidden animate-pulse-slow">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Utensils size={100} />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="p-4 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20 text-white">
                    <Bike size={32} />
                </div>
                <div className="flex-1 text-center md:text-right">
                    <h3 className="text-white font-black text-xl mb-2 flex items-center justify-center md:justify-start gap-2">
                        {isRTL ? "مضاعفة النتائج عبر تطبيقات التوصيل" : "Maximize Delivery Orders"}
                        <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded shadow-sm">Talabat & Keeta</span>
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {isRTL 
                          ? "بما أن نشاطك مطعم، فإن اعتمادك لا يقتصر على الصالة فقط. نظامنا يستهدف عملاء (طلبات وكيتا) برسائل تلقائية بعد كل طلب، مما يعني أضعافاً مضاعفة من التقييمات اليومية مقارنة بما تراه في الجدول أعلاه."
                          : "Since you run a restaurant, you don't just rely on dine-in. Our system targets Delivery App customers (Talabat, Keeta) with automated messages, meaning multiples of daily reviews compared to the chart above."}
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* --- بطاقة الخسائر --- */}
      <div className="bg-red-900/10 border border-red-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -left-10 top-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 shadow-inner">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h4 className="text-white font-black text-lg mb-1">فرصة الإيرادات الضائعة سنوياً</h4>
            <p className="text-red-300/70 text-sm">بسبب عدم استخدام نظام التقييم التلقائي</p>
          </div>
        </div>
        <div className="text-center md:text-left relative z-10">
          <div className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
            {lostRevenue.toLocaleString()} <span className="text-lg text-slate-400 font-medium">د.ك</span>
          </div>
        </div>
      </div>

      {/* --- أزرار اتخاذ القرار --- */}
      <div className="pt-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={onVisualExp} className="py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-3 group">
            <Play className="fill-current w-5 h-5 group-hover:scale-110 transition-transform" />
            {isRTL ? "تجربة بصرية (Simulation)" : "Visual Simulation"}
          </button>
          
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-3 group">
             <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
             {isRTL ? "تفعيل النظام الآن" : "Activate Now"}
          </a>
        </div>
        
        <button onClick={onReset} className="w-full py-4 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <RotateCw size={14} />
          {t.closing.btn2}
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
