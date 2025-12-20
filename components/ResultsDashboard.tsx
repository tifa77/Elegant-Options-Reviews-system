import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, ArrowUpRight,
  MessageCircle, RotateCw, Play, Zap, BarChart3,
  Utensils, Bike, Percent, Users, Award
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
  
  // التحقق من نوع النشاط (مطعم أم لا)
  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'مطعم' || data.projectType === 'cafe';

  // --- 1. الحسابات الذكية ---
  const currentWeekly = data.weeklyGrowth || 0;
  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearlyReviews = currentMonthly * 12; // مجموع التقييمات السنوي

  // مضاعف التوقعات (للمطاعم أعلى بسبب التوصيل)
  const multiplier = isRestaurant ? 10 : 6; 
  
  const projectedWeekly = Math.max(5, currentWeekly * multiplier);
  const projectedMonthly = Math.max(20, currentMonthly * multiplier);
  const projectedYearlyReviews = projectedMonthly * 12; // مجموع التقييمات المتوقع

  // --- معادلة التأثير (Social Proof Impact) ---
  const influenceFactor = 20;
  const peopleInfluencedCurrent = currentYearlyReviews * influenceFactor;
  const peopleInfluencedProjected = projectedYearlyReviews * influenceFactor;

  // نسبة التحسن
  const percentageIncrease = currentYearlyReviews > 0 
    ? Math.round(((projectedYearlyReviews - currentYearlyReviews) / currentYearlyReviews) * 100) 
    : 100;

  // حساب الإيرادات الضائعة (تقريبي)
  const avgTicket = 15; 
  const lostCustomers = Math.round((peopleInfluencedProjected - peopleInfluencedCurrent) * 0.10);
  const lostRevenue = lostCustomers * avgTicket;

  // تحديد التصنيف
 // 1. تحديد العملة حسب اللغة (أو المتصفح)
  const currency = isRTL ? "د.ك" : "KWD"; // يمكنك تغييرها حسب الدولة

  // 2. حسابات النمو (الموجودة لديك مسبقاً)
  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearlyReviews = currentMonthly * 12;
  
  // 3. المنطق الصارم الجديد للتصنيف (Strict Market Status)
  const getMarketStatus = () => {
    // الجملة التحفيزية التي تظهر للجميع
    const universalIncentive = isRTL 
      ? "⚠️ تنبيه: المنافسون في منطقتك يكثفون نشاطهم الرقمي الآن لتجاوز تصنيفك، بعضهم بدأ بالفعل بخطف حصتك السوقية."
      : "⚠️ Alert: Competitors in your area are intensifying their digital activity to surpass your ranking; some have already started taking your market share.";

    if (currentMonthly <= 30) {
      return {
        title: isRTL ? "شبح رقمي - مخفي تماماً" : "Digital Ghost - Hidden",
        desc: isRTL ? "نشاطك يعاني من ضعف حاد؛ العملاء لا يجدونك في نتائج البحث، مما يجعلك غير مرئي تماماً." : "Your business is invisible; customers can't find you in search results.",
        color: "text-red-500",
        bg: "bg-red-900/20",
        border: "border-red-500/30",
        icon: Ghost,
        incentive: universalIncentive
      };
    } else if (currentMonthly <= 80) {
      return {
        title: isRTL ? "تواجد متوسط - وضع قلق" : "Average Presence - Risky",
        desc: isRTL ? "أنت موجود في السوق ولكنك في منطقة الخطر؛ أي تراجع سيؤدي لسقوط تصنيفك فوراً." : "You are in the danger zone; any decline will cause your ranking to drop immediately.",
        color: "text-yellow-500",
        bg: "bg-yellow-900/20",
        border: "border-yellow-500/30",
        icon: Target,
        incentive: universalIncentive
      };
    } else {
      return {
        title: isRTL ? "متواجد بقوة - تحت الحصار" : "Strong Presence - Under Siege",
        desc: isRTL ? "أداء ممتاز، ولكن القمة مزدحمة؛ لديك منافسون أقوياء جداً يخططون لتجاوزك." : "Excellent performance, but the top is crowded; strong competitors are planning to overtake you.",
        color: "text-green-500",
        bg: "bg-green-900/20",
        border: "border-green-500/30",
        icon: Crown,
        incentive: universalIncentive
      };
    };
  };

  const status = getMarketStatus();
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
        <p className="text-slate-400 text-lg">
          {isRTL ? "تحليل خاص بـ:" : "Analysis for:"} <span className="text-primary-400 font-bold">{data.projectName}</span>
        </p>
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
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
              {isRTL ? "تصنيف قوة الحساب حالياً" : "Current Account Strength"}
            </h3>
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
            <h3 className="text-slate-400 font-bold">
              {isRTL ? "الوضع الحالي (بدون نظام)" : "Current Status (No System)"}
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm font-medium">
                {isRTL ? "النمو الأسبوعي" : "Weekly Growth"}
              </span>
              <span className="text-2xl font-black text-slate-300">
                {currentWeekly} <span className="text-xs font-normal text-slate-500">{isRTL ? "تقييم" : "reviews"}</span>
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm font-medium">
                {isRTL ? "النمو الشهري" : "Monthly Growth"}
              </span>
              <span className="text-2xl font-black text-slate-300">
                {currentMonthly} <span className="text-xs font-normal text-slate-500">{isRTL ? "تقييم" : "reviews"}</span>
              </span>
            </div>
             <div className="flex justify-between items-end pt-2 border-t border-slate-800/50">
              <span className="text-slate-500 text-xs font-medium">
                {isRTL ? "رصيد التقييمات السنوي" : "Annual Reviews Asset"}
              </span>
              <span className="text-xl font-bold text-slate-400">{currentYearlyReviews}</span>
            </div>
            {/* زبائن متأثرين حالياً */}
            <div className="flex justify-between items-end">
              <span className="text-slate-600 text-[10px] font-medium max-w-[150px] leading-tight">
                {isRTL ? "عملاء يقرأون تقييماتك سنوياً (تقديري)" : "Customers reading your reviews annually (Est.)"}
              </span>
              <span className="text-sm font-bold text-slate-500">{peopleInfluencedCurrent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 2. المستقبل */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-primary-500/30 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-600"></div>
          <div className="flex items-center gap-3 mb-6 border-b border-primary-500/20 pb-4">
            <Zap className="text-primary-400 fill-primary-400" size={20} />
            <h3 className="text-white font-bold flex items-center gap-2">
              {isRTL ? "مع Elegant Options" : "With Elegant Options"}
              <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-md">PRO</span>
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-blue-100 text-sm font-medium">
                {isRTL ? "النمو الأسبوعي المتوقع" : "Projected Weekly Growth"}
              </span>
              <div className="text-right">
                <span className="text-3xl font-black text-primary-400">{projectedWeekly}+</span>
                <div className="text-[10px] text-green-400 flex items-center justify-end gap-1">
                  +{projectedWeekly - currentWeekly} {isRTL ? "زيادة" : "Boost"} <ArrowUpRight size={10} />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-blue-100 text-sm font-medium">
                {isRTL ? "النمو الشهري المتوقع" : "Projected Monthly Growth"}
              </span>
              <span className="text-3xl font-black text-primary-400">{projectedMonthly}+</span>
            </div>
             
             {/* رصيد التقييمات السنوي المتوقع */}
             <div className="flex justify-between items-center pt-2 border-t border-primary-500/20">
              <div className="flex flex-col">
                <span className="text-blue-200 text-xs font-medium">
                  {isRTL ? "رصيد التقييمات السنوي" : "Annual Reviews Asset"}
                </span>
                <span className="text-xl font-bold text-white">{projectedYearlyReviews}</span>
              </div>
              <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg">
                <Percent size={14} className="text-green-400" />
                <span className="text-green-400 font-black text-sm">+{percentageIncrease}%</span>
              </div>
            </div>

            {/* قوة التأثير (Influence) */}
             <div className="flex justify-between items-end bg-primary-900/20 p-3 rounded-xl border border-primary-500/10">
              <span className="text-blue-200 text-[10px] font-medium max-w-[150px] leading-tight">
                {isRTL 
                  ? "عملاء جدد يتأثرون إيجابياً بقرائهم للتقييمات سنوياً" 
                  : "New customers positively influenced by reviews annually"}
              </span>
              <span className="text-lg font-black text-primary-300 flex items-center gap-1">
                <Users size={14} />
                {peopleInfluencedProjected.toLocaleString()}
              </span>
            </div>

          </div>
        </div>
      </div>

     {/* --- ✨ ميزة خاصة للمطاعم (بتصميم يحاكي طلبات وكيتا) ✨ --- */}
      {isRestaurant && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-orange-500/30 relative overflow-hidden group hover:border-orange-500/50 transition-all mt-6">
            
            {/* الخلفية الجمالية */}
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <Utensils size={120} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                
                {/* قسم الأيقونات (The Logos Area) */}
                <div className="flex items-center -space-x-4 rtl:space-x-reverse">
                    
                    {/* محاكاة شعار طلبات (Talabat Style) */}
                    <div className="w-16 h-16 rounded-2xl bg-[#ff5a00] flex items-center justify-center shadow-lg shadow-orange-900/40 z-20 border-4 border-slate-900 transform group-hover:scale-110 transition-transform">
                        <Bike className="text-white w-8 h-8" strokeWidth={2.5} />
                    </div>

                    {/* محاكاة شعار كيتا (Keeta Style) */}
                    <div className="w-16 h-16 rounded-2xl bg-[#fec400] flex items-center justify-center shadow-lg shadow-yellow-900/40 z-10 border-4 border-slate-900 transform group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform">
                        <Zap className="text-black w-8 h-8 fill-black" />
                    </div>

                </div>

                <div className="flex-1 text-center md:text-right">
                    <h3 className="text-white font-black text-xl mb-2 flex items-center justify-center md:justify-start gap-2">
                        {isRTL ? "مضاعفة النتائج عبر تطبيقات التوصيل" : "Maximize Delivery Orders"}
                        {/* شارة صغيرة */}
                        <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-full border border-slate-600">
                           Delivery Apps
                        </span>
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        {isRTL 
                          ? "مطعمك لا يعتمد على الصالة فقط. نظامنا يتكامل ذهنياً مع عملاء (طلبات وكيتا) عبر استهدافهم برسائل ذكية بعد الطلب، مما يحول عملاء التطبيقات المجهولين إلى قاعدة بيانات وزبائن دائمين لك."
                          : "Your restaurant isn't just dine-in. Our system mentally integrates with Talabat & Keeta customers by targeting them with smart messages post-order, converting anonymous app users into your loyal database."}
                    </p>
                </div>
                
            </div>
        </div>
      )}

      {/* --- بطاقة الخيار المفضل --- */}
      <div className="bg-gradient-to-br from-violet-900/40 to-slate-900 p-6 rounded-[2rem] border border-violet-500/30 relative overflow-hidden group hover:border-violet-500/50 transition-colors">
            <div className="absolute top-0 left-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Award size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                 <div className="p-4 bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30">
                    <Crown size={32} />
                 </div>
                 <div className="flex-1 text-center md:text-right">
                    <h3 className="text-white font-black text-lg mb-2">
                        {isRTL ? "كن الخيار المفضل للعملاء الجدد دائماً" : "Be The #1 Choice Always"}
                    </h3>
                    <p className="text-violet-200/80 text-sm leading-relaxed font-medium">
                        {isRTL 
                         ? "استمرارك في تصدر التصنيف وامتلاكك لعدد تقييمات إيجابية يفوق منافسيك، يرسخ في عقل العميل أنك (الأفضل والأكثر أماناً)، مما يجعلك الخيار التلقائي لأي عميل جديد يبحث عن الخدمة."
                         : "Continuously outranking competitors with positive reviews establishes you as the 'Safe & Best' option, making you the automatic choice for any new customer."}
                    </p>
                 </div>
            </div>
      </div>

      {/* --- بطاقة الخسائر --- */}
      <div className="bg-red-900/10 border border-red-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -left-10 top-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 shadow-inner">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h4 className="text-white font-black text-lg mb-1">
              {isRTL ? "فرصة الإيرادات الضائعة سنوياً" : "Annual Missed Revenue"}
            </h4>
            <p className="text-red-300/70 text-sm">
              {isRTL ? "بسبب عدم تحويل الزوار إلى زبائن دائمين" : "Due to low conversion from visitors to customers"}
            </p>
          </div>
        </div>
        <div className="text-center md:text-left relative z-10">
          <div className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
            {lostRevenue.toLocaleString()} <span className="text-lg text-slate-400 font-medium">{isRTL ? "د.ك" : "KWD"}</span>
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
