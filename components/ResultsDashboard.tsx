import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, 
  Target, Ghost, Crown, Activity, ArrowUpRight,
  MessageCircle, RotateCw, Play, Zap, BarChart3,
  Utensils, Bike, Percent, Users, Award, CheckCircle // أضفنا CheckCircle
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

  // 1. نظام العملة الذكي
  const getCurrencyByLocation = () => {
    const address = data.address?.toLowerCase() || "";
    if (address.includes("saudi") || address.includes("السعودية") || address.includes(" rsa")) return isRTL ? "ر.س" : "SAR";
    if (address.includes("emirates") || address.includes("الإمارات") || address.includes(" uae")) return isRTL ? "د.إ" : "AED";
    if (address.includes("qatar") || address.includes("قطر")) return isRTL ? "ر.ق" : "QAR";
    if (address.includes("bahrain") || address.includes("البحرين")) return isRTL ? "د.ب" : "BHD";
    if (address.includes("oman") || address.includes("عمان")) return isRTL ? "ر.ع" : "OMR";
    if (address.includes("egypt") || address.includes("مصر")) return isRTL ? "ج.م" : "EGP";
    return isRTL ? "د.ك" : "KWD";
  };

  const currency = getCurrencyByLocation();

  // 2. الحسابات الذكية والنمو
  const currentWeekly = data.weeklyGrowth || 0;
  const currentMonthly = data.monthlyGrowth || 0;
  const currentYearlyReviews = currentMonthly * 12;

  const multiplier = isRestaurant ? 10 : 6; 
  const projectedWeekly = Math.max(5, currentWeekly * multiplier);
  const projectedMonthly = Math.max(20, currentMonthly * multiplier);
  const projectedYearlyReviews = projectedMonthly * 12;

  const influenceFactor = 20;
  const peopleInfluencedProjected = projectedYearlyReviews * influenceFactor;
  const percentageIncrease = currentYearlyReviews > 0 
    ? Math.round(((projectedYearlyReviews - currentYearlyReviews) / currentYearlyReviews) * 100) 
    : 100;

  const avgTicket = 15; 
  const lostCustomers = Math.round((peopleInfluencedProjected - (currentYearlyReviews * influenceFactor)) * 0.10);
  const lostRevenue = lostCustomers * avgTicket;

  // 3. نظام التصنيف الصارم
  const getMarketStatus = () => {
    const universalIncentive = isRTL 
      ? "⚠️ تنبيه: المنافسون في منطقتك يكثفون نشاطهم الرقمي الآن لتجاوز تصنيفك، بعضهم بدأ بالفعل بخطف حصتك السوقية."
      : "⚠️ Alert: Competitors in your area are intensifying their digital activity to surpass your ranking.";

    if (currentMonthly <= 30) {
      return {
        title: isRTL ? "شبح رقمي - مخفي تماماً" : "Digital Ghost - Hidden",
        desc: isRTL ? "نشاطك يعاني من ضعف حاد؛ العملاء لا يجدونك في نتائج البحث، مما يجعلك غير مرئي تماماً." : "Your business is invisible in search results.",
        color: "text-red-500", bg: "bg-red-900/20", border: "border-red-500/30", icon: Ghost, incentive: universalIncentive
      };
    } else if (currentMonthly <= 80) {
      return {
        title: isRTL ? "تواجد متوسط - وضع قلق" : "Average Presence - Risky",
        desc: isRTL ? "أنت موجود في السوق ولكنك في منطقة الخطر؛ أي تراجع سيؤدي لسقوط تصنيفك فوراً." : "You are in the danger zone; any decline will cause your ranking to drop.",
        color: "text-yellow-500", bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: Target, incentive: universalIncentive
      };
    } else {
      return {
        title: isRTL ? "متواجد بقوة - تحت الحصار" : "Strong Presence - Under Siege",
        desc: isRTL ? "أداء ممتاز، ولكن القمة مزدحمة؛ لديك منافسون أقوياء جداً يخططون لتجاوزك." : "Excellent performance, but strong competitors are planning to overtake you.",
        color: "text-green-500", bg: "bg-green-900/20", border: "border-green-500/30", icon: Crown, incentive: universalIncentive
      };
    }
  };

  const status = getMarketStatus();
  const waLink = `https://wa.me/96550656365?text=${encodeURIComponent(isRTL ? `مرحباً، اطلعت على تقرير (${data.projectName}) وأريد تفعيل النمو.` : `Hello, I saw the report for (${data.projectName}) and want to activate growth.`)}`;

  return (
    <div className={`max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 relative ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* الرأس */}
      <div className="flex items-center justify-between px-2 pt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span className="font-medium text-sm">{t.back}</span>
        </button>
        <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase">Growth Report</span>
      </div>

      {/* بطاقة الحالة */}
      <div className={`p-8 rounded-[2rem] border ${status.border} ${status.bg} backdrop-blur-sm relative overflow-hidden group shadow-2xl shadow-black/50`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className={`p-6 rounded-full bg-slate-900 shadow-2xl ${status.color}`}>
            <status.icon size={48} />
          </div>
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{isRTL ? "الوضع السوقي الحالي" : "Market Status"}</h3>
            <div className={`text-4xl font-black ${status.color} mb-3`}>{status.title}</div>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">{status.desc}</p>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-orange-400 text-sm font-bold animate-pulse">
               {status.incentive}
            </div>
          </div>
        </div>
      </div>

      {/* --- ✨ الميزة الجديدة: تحليل جودة التقييمات المستخرجة ✨ --- */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <BarChart3 className="text-primary-400" size={24} />
              <h3 className="text-xl font-bold text-white">{isRTL ? "تحليل جودة التقييمات الحالية" : "Current Review Quality Analysis"}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-3xl group hover:bg-green-500/10 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-green-400 font-bold text-xs uppercase tracking-widest">{isRTL ? "تقييمات إيجابية (4-5 نجوم)" : "Positive (4-5 Stars)"}</span>
                      <CheckCircle className="text-green-500" size={18} />
                  </div>
                  <div className="text-3xl font-black text-white">{data.positiveReviews?.toLocaleString() || 0}</div>
              </div>

              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl group hover:bg-red-500/10 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-red-400 font-bold text-xs uppercase tracking-widest">{isRTL ? "تقييمات سلبية (1-3 نجوم)" : "Negative (1-3 Stars)"}</span>
                      <AlertTriangle className="text-red-500" size={18} />
                  </div>
                  <div className="text-3xl font-black text-white">{data.negativeReviews?.toLocaleString() || 0}</div>
              </div>
          </div>

          <div className="p-4 bg-primary-900/10 border border-primary-500/20 rounded-2xl flex gap-3">
              <div className="text-primary-400 pt-1"><Target size={20} /></div>
              <p className="text-slate-300 text-xs leading-relaxed">
                  <span className="font-bold text-primary-400">{isRTL ? "ملاحظة إرشادية:" : "Strategic Note:"}</span>{" "}
                  {isRTL 
                    ? "نظامنا يعمل كمرشح ذكي؛ حيث يوجه العملاء الراضين لنشر تقييماتهم على خرائط جوجل فوراً، بينما يتم احتواء الشكاوى (1-3 نجوم) داخلياً لتعالجها قبل أن تضر بسمعتك علناً." 
                    : "Our system acts as a smart filter; directing satisfied customers to post 5-star reviews publicly, while containing negative feedback internally for you to resolve privately."}
              </p>
          </div>
      </div>

      {/* المقارنة */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 relative">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <Activity className="text-slate-500" size={20} />
            <h3 className="text-slate-400 font-bold">{isRTL ? "الوضع الحالي (بدون نظام)" : "Current Status"}</h3>
          </div>
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-end"><span className="text-slate-500">{isRTL ? "النمو الأسبوعي" : "Weekly"}</span><span className="text-xl font-black text-slate-300">{currentWeekly}</span></div>
            <div className="flex justify-between items-end"><span className="text-slate-500">{isRTL ? "النمو الشهري" : "Monthly"}</span><span className="text-xl font-black text-slate-300">{currentMonthly}</span></div>
            <div className="flex justify-between items-end pt-2 border-t border-slate-800/50"><span className="text-slate-500">{isRTL ? "رصيد التقييمات السنوي" : "Annual Asset"}</span><span className="text-xl font-bold text-slate-400">{currentYearlyReviews}</span></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-primary-500/30 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-indigo-600"></div>
          <div className="flex items-center gap-3 mb-6 border-b border-primary-500/20 pb-4">
            <Zap className="text-primary-400 fill-primary-400" size={20} />
            <h3 className="text-white font-bold">{isRTL ? "مع Elegant Options" : "With Elegant Options"} <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-md">PRO</span></h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end"><span className="text-blue-100">{isRTL ? "النمو الأسبوعي المتوقع" : "Projected Weekly"}</span><span className="text-3xl font-black text-primary-400">{projectedWeekly}+</span></div>
            <div className="flex justify-between items-end"><span className="text-blue-100">{isRTL ? "النمو الشهري المتوقع" : "Projected Monthly"}</span><span className="text-3xl font-black text-primary-400">{projectedMonthly}+</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-primary-500/20">
              <span className="text-blue-200 text-xs font-medium">{isRTL ? "رصيد التقييمات السنوي" : "Annual Asset"}</span>
              <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-green-400 font-black text-sm">+{percentageIncrease}%</div>
            </div>
            <div className="bg-primary-900/20 p-3 rounded-xl border border-primary-500/10 flex justify-between items-center">
              <span className="text-blue-200 text-[10px]">{isRTL ? "تأثير الوصول السنوي" : "Annual Reach Impact"}</span>
              <span className="text-lg font-black text-primary-300 flex items-center gap-1"><Users size={14}/> {peopleInfluencedProjected.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* تطبيقات التوصيل */}
      {isRestaurant && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-[2rem] border border-orange-500/30 relative overflow-hidden group hover:border-orange-500/50 transition-all">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex items-center -space-x-4 rtl:space-x-reverse">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff5a00] flex items-center justify-center border-4 border-slate-900 z-20 shadow-lg"><Bike className="text-white w-8 h-8" /></div>
                    <div className="w-16 h-16 rounded-2xl bg-[#fec400] flex items-center justify-center border-4 border-slate-900 z-10 shadow-lg"><Zap className="text-black w-8 h-8 fill-black" /></div>
                </div>
                <div className="flex-1 text-center md:text-right">
                    <h3 className="text-white font-black text-xl mb-2">{isRTL ? "مضاعفة نتائج طلبات وكيتا" : "Talabat & Keeta Boost"}</h3>
                    <p className="text-slate-400 text-sm">{isRTL ? "استهدف عملاء تطبيقات التوصيل وحولهم لزبائن دائمين لمطعمك." : "Target delivery app customers and convert them into regulars."}</p>
                </div>
            </div>
        </div>
      )}

      {/* الخسائر المالية */}
      <div className="bg-red-900/10 border border-red-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-6 z-10">
          <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 shadow-inner"><AlertTriangle size={32} /></div>
          <div>
            <h4 className="text-white font-black text-lg mb-1">{isRTL ? "فرصة الإيرادات الضائعة سنوياً" : "Annual Missed Revenue"}</h4>
            <p className="text-red-300/70 text-sm">{isRTL ? "بسبب ضعف التواجد الرقمي حالياً" : "Due to current low digital presence"}</p>
          </div>
        </div>
        <div className="text-5xl font-black text-white tracking-tighter z-10">
          {lostRevenue.toLocaleString()} <span className="text-lg text-slate-400 font-medium">{currency}</span>
        </div>
      </div>

      {/* أزرار الإجراء */}
      <div className="pt-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={onVisualExp} className="py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3"><Play size={20} fill="currentColor" /> {isRTL ? "تجربة بصرية" : "Visual Experience"}</button>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"><MessageCircle size={24} /> {isRTL ? "تفعيل النظام الآن" : "Activate Now"}</a>
        </div>
        <button onClick={onReset} className="w-full py-4 text-slate-500 hover:text-slate-300 text-sm font-medium flex items-center justify-center gap-2"><RotateCw size={14} /> {isRTL ? "تحليل نشاط آخر" : t.closing.btn2}</button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
