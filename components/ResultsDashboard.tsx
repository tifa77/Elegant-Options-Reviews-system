// @ts-nocheck
import React from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Star, 
  ShieldCheck, Bot, Bike, Quote, 
  CheckCircle2, RotateCcw, LayoutDashboard, Target, Zap, TrendingDown
} from 'lucide-react';
import { AuditData, Language } from '../types';

interface AuditDashboardProps {
  data: AuditData;
  language: Language;
  onReset: () => void;
  onShowVisualExperience: () => void; 
}

const ResultsDashboard: React.FC<AuditDashboardProps> = ({ data, language, onReset, onShowVisualExperience }) => {
  const isRTL = language === 'ar';
  
  // --- محرك الحسابات الذكي الديناميكي ---
  const currentYear = 2026; 
  const establishedYear = parseInt(data.establishmentYear) || 2024;
  const yearsActive = Math.max(1, currentYear - establishedYear);
  const avgReviewsPerYear = parseFloat((data.currentReviews / yearsActive).toFixed(1));

  // حسابات الـ 10% بناءً على عدد العملاء في الفورم
  const monthlyCustomers = parseInt(data.monthlyCustomers) || 1000; 
  const dailyCustomers = Math.floor(monthlyCustomers / 30);
  const projectedDailyReviews = dailyCustomers * 0.10; // قاعدة الـ 10% الذهبية
  const annualAdditionalReviews = Math.floor(projectedDailyReviews * 365);
  
  // الأرباح الديناميكية: (كل تقييم إضافي يساهم بـ 15 د.ك في القيمة التسويقية السنوية)
  const dynamicProfit = (annualAdditionalReviews * 15).toLocaleString();

  // --- منطق التشخيص السوقي المتكيف (الواقعي) ---
  const getDiagnosis = () => {
    if (avgReviewsPerYear < 20) {
      return {
        title: isRTL ? 'خارج المنافسة الرقمية' : 'Out of Competition',
        sub: isRTL ? 'نشاطك التجاري "شبح" في محركات البحث' : 'Your business is a "Ghost" in search results',
        desc: isRTL ? 'المنافسون يبتلعون حصتك السوقية لأن تقييماتك الحالية لا تعكس حجم عملك الحقيقي.' : 'Competitors are seizing your market share because your ratings don\'t reflect your true scale.',
        color: 'text-red-500', bg: 'bg-[#1a0a10]', icon: <Ghost size={80} />
      };
    } else if (avgReviewsPerYear < 100) {
      return {
        title: isRTL ? 'نمو يحتاج إلى أتمتة' : 'Growth Needs Automation',
        sub: isRTL ? 'أداؤك جيد.. لكن اليدوي لن يهزم الآلي' : 'Good performance.. but manual won\'t beat automated',
        desc: isRTL ? 'تمتلك تقييمات جيدة، ولكن بالأتمتة ستتضاعف هذه الأرقام وتسيطر على منطقتك الجغرافية بالكامل.' : 'You have good ratings, but with automation, you will multiply these numbers and dominate.',
        color: 'text-orange-500', bg: 'bg-[#1a140a]', icon: <Target size={80} />
      };
    } else {
      return {
        title: isRTL ? 'سيادة سوقية مهددة' : 'Market Dominance at Risk',
        sub: isRTL ? 'أنت في القمة.. والذكاء الاصطناعي سيجعلك تسود' : 'You are at the top.. AI will make you rule',
        desc: isRTL ? 'تقييماتك ممتازة، وبالاستمرار بالأتمتة ستسود وتسيطر على المنافسة وتغلق الباب أمام أي منافس جديد.' : 'Excellent ratings; with automation, you will rule the competition and block any challengers.',
        color: 'text-blue-500', bg: 'bg-[#0a121e]', icon: <Zap size={80} />
      };
    }
  };

  const diag = getDiagnosis();

  // رابط الواتساب الديناميكي الصحيح
  const whatsappNumber = "96566305551";
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isRTL ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName})` : `Hello Elegant Options, interested in the system for (${data.projectName})`)}`;

  return (
    // توسيع التقرير عبر زيادة المسافات العمودية space-y-32
    <div className={`space-y-32 pb-40 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. التشخيص السوقي الفعلي مع الوصف المشوق */}
      <div className={`${diag.bg} border-2 border-white/5 rounded-[4rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative shadow-2xl overflow-hidden`}>
        <div className="space-y-6 z-10 flex-1">
          <span className={`${diag.color} font-bold text-sm uppercase tracking-[0.4em] opacity-80`}>
            {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
          </span>
          <h2 className={`${diag.color} text-5xl md:text-8xl font-black italic`}>
            {diag.title}
          </h2>
          <h3 className="text-white text-3xl md:text-4xl font-bold border-b-2 border-white/10 pb-4 inline-block">
            {diag.sub}
          </h3>
          <p className="text-slate-400 font-bold text-2xl md:text-3xl leading-relaxed max-w-4xl">
            {diag.desc}
          </p>
        </div>
        <div className={`${diag.color} opacity-20 p-12 rounded-full shrink-0 animate-pulse`}>
          {diag.icon}
        </div>
      </div>

      {/* 2. مقارنة الأداء والزيادة المتوقعة (قاعدة الـ 10%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* بطاقة النزيف الحالي */}
        <div className="bg-[#0a121e] border-2 border-red-500/10 rounded-[4rem] p-12 space-y-12 relative shadow-xl">
          <div className="flex items-center gap-4 text-slate-400 font-black text-3xl uppercase">
             <TrendingDown className="text-red-500" size={40} /> {isRTL ? 'نزيف الفرص الحالي' : 'Current Leak'}
          </div>
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <span className="text-slate-500 text-xl font-bold">{isRTL ? 'معدل التقييم السنوي الحالي' : 'Annual Rate'}</span>
               <span className="text-6xl font-black text-white">{avgReviewsPerYear}</span>
            </div>
            <p className="text-slate-400 font-bold text-2xl italic border-r-4 border-red-500 pr-6 leading-relaxed">
              {isRTL 
                ? 'الحصول على التقييمات يتم بجهد يدوي، مما يضيع عليك مئات العملاء شهرياً بسبب صمتهم الرقمي.' 
                : 'Ratings are manual and inconsistent, costing you hundreds of customers monthly.'}
            </p>
          </div>
        </div>

        {/* بطاقة النمو مع النظام بناءً على عدد العملاء */}
        <div className="bg-gradient-to-br from-[#0d1b33] to-[#0a121e] border-2 border-blue-500/40 rounded-[4rem] p-12 space-y-12 shadow-2xl relative shadow-blue-900/40">
          <div className="flex items-center gap-4 text-blue-400 font-black text-3xl uppercase">
            <TrendingUp size={40} /> {isRTL ? 'مع نظام ELEGANT OPTIONS' : 'WITH ELEGANT OPTIONS'}
          </div>
          <div className="space-y-10">
             <div className="flex justify-between items-end border-b border-blue-500/20 pb-4">
                <span className="text-slate-300 font-bold text-xl">{isRTL ? 'المعدل السنوي الإضافي' : 'Additional Annual'}</span>
                <span className="text-8xl font-black text-green-400">+{annualAdditionalReviews}</span>
             </div>
             <div className="text-blue-100 font-bold text-2xl leading-relaxed bg-blue-500/10 p-6 rounded-[2rem]">
               {isRTL 
                 ? `عبر تحويل 10% من عملائك الـ (${dailyCustomers}) يومياً، سيقوم النظام آلياً بتحصيل ${annualAdditionalReviews} تقييم إيجابي سنوياً، مما يمنحك سيادة كاملة.` 
                 : `By converting 10% of your (${dailyCustomers}) daily customers, the system collects ${annualAdditionalReviews} reviews annually.`}
             </div>
          </div>
        </div>
      </div>

      {/* 3. المميزات التنافسية (تصميم طولي، ضخم، ومرتب) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        
        {/* ميزة الردود الآلية - طولي ضخم */}
        <div className="bg-[#0a121e] border-2 border-blue-500/20 rounded-[4rem] p-12 flex flex-col items-center text-center space-y-10 hover:border-blue-500/60 transition-all group shadow-2xl min-h-[600px]">
          <div className="bg-blue-500/10 p-10 rounded-[3rem] text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
            <Bot size={70}/>
          </div>
          <h4 className="text-white font-black text-4xl leading-tight">{isRTL ? 'ردود ذكية بواسطة AI' : 'Smart AI Replies'}</h4>
          <p className="text-slate-400 text-2xl leading-relaxed">
            {isRTL 
              ? 'موظف رقمي يعمل 24/7 للرد الفوري على كل تقييم في جوجل بأسلوب احترافي يضمن بقاءك في الصدارة دائماً.' 
              : 'Digital AI employee working 24/7 to reply to every Google review professionally.'}
          </p>
        </div>

        {/* درع السمعة - طولي ضخم */}
        <div className="bg-[#0a121e] border-2 border-orange-500/20 rounded-[4rem] p-12 flex flex-col items-center text-center space-y-10 hover:border-orange-500/60 transition-all group shadow-2xl min-h-[600px]">
          <div className="bg-orange-500/10 p-10 rounded-[3rem] text-orange-400 group-hover:scale-110 transition-transform shadow-inner">
            <ShieldCheck size={70}/>
          </div>
          <h4 className="text-white font-black text-4xl leading-tight">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
          <p className="text-slate-400 text-2xl leading-relaxed">
            {isRTL 
              ? 'حجب كامل لأي تقييم سلبي (3 نجوم أو أقل) وتحويله كرسالة واتساب خاصة للإدارة قبل أن يراه العالم ويشوه سمعتك.' 
              : 'Complete block of negative reviews, routing them privately to management via WhatsApp.'}
          </p>
        </div>

        {/* دمج التوصيل (طلبات/كيتا) - مستعاد بالكامل */}
        {data.businessType === 'restaurant' && (
          <div className="bg-[#0a121e] border-2 border-red-500/20 rounded-[4rem] p-12 flex flex-col items-center text-center space-y-10 hover:border-red-500/60 transition-all group shadow-2xl min-h-[600px]">
             <div className="bg-red-500/10 p-10 rounded-[3rem] text-red-500 group-hover:scale-110 transition-transform shadow-inner">
              <Bike size={70}/>
            </div>
            <h4 className="text-white font-black text-4xl leading-tight">{isRTL ? 'دمج طلبات وكيتا' : 'Delivery Sync'}</h4>
            <p className="text-slate-400 text-2xl leading-relaxed">
              {isRTL 
                ? 'ربط مباشر ومجاني؛ بمجرد استلام الطلب، يرسل النظام رسالة واتساب للعميل تطلب تقييمه بذكاء لتسهيل العملية وضمان أعلى معدل تحويل.' 
                : 'Automated free sync with delivery apps; the system sends a WhatsApp review request upon delivery.'}
            </p>
          </div>
        )}
      </div>

      {/* 4. الأرباح السنوية الديناميكية */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[5rem] p-20 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16 relative z-10 text-center md:text-right">
          <div className="space-y-8">
            <h3 className="text-blue-400 font-black text-6xl flex items-center justify-center md:justify-start gap-6">
              <DollarSign size={64} /> {isRTL ? 'أرباح نظرية الولاء السنوية' : 'Annual Loyalty ROI'}
            </h3>
            <p className="text-slate-400 font-bold text-3xl max-w-3xl leading-relaxed">
              {isRTL 
                ? 'هذه المبالغ تمثل العائد المادي المتوقع بناءً على تحويل التقييمات الجديدة إلى ثقة عمياء تجذب تدفقاً مستمراً من العملاء الجدد.' 
                : 'Projected financial return based on turning reviews into trust that drives consistent new customer growth.'}
            </p>
          </div>
          <div className="text-9xl font-black text-white tracking-tighter animate-pulse">
            {dynamicProfit} <span className="text-5xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
          </div>
        </div>
      </div>

      {/* 5. الأزرار النهائية (الطلب والمحاكي) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
        <button 
          onClick={() => window.open(waLink, '_blank')}
          className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-14 rounded-[4rem] flex items-center justify-center gap-8 text-5xl transition-all shadow-2xl group active:scale-95">
          <CheckCircle2 size={56} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        <div className="relative group">
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-md font-black px-10 py-4 rounded-full flex flex-col items-center gap-1 z-20 shadow-xl border border-white/30 animate-bounce">
             <Star size={24} className="animate-spin" /> {isRTL ? 'شاهد مستقبلك الرقمي' : 'Watch Simulator'}
          </div>
          {/* تم ربط الدالة هنا ليعمل المحاكي فوراً */}
          <button 
            onClick={onShowVisualExperience}
            className="w-full bg-[#0d1b33] border-4 border-blue-600 text-white font-black py-14 rounded-[4rem] flex items-center justify-center gap-8 text-5xl transition-all shadow-2xl active:scale-95">
            <LayoutDashboard size={56} />
            {isRTL ? 'تجربة بصرية' : 'VISUAL EXPERIENCE'}
          </button>
        </div>
      </div>

      <div className="text-center pt-10">
        <button onClick={onReset} className="inline-flex items-center gap-4 text-slate-500 hover:text-white font-bold text-3xl transition-colors opacity-50 hover:opacity-100">
          <RotateCcw size={32} />
          {isRTL ? 'فحص مشروع آخر' : 'Check another project'}
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
