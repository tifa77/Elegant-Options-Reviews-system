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
  
  // --- محرك الحسابات الذكي (Elegant Options Engine) ---
  const currentYear = 2026; 
  const establishedYear = parseInt(data.establishmentYear) || 2024;
  const yearsActive = Math.max(1, currentYear - establishedYear);
  const avgReviewsPerYear = parseFloat((data.currentReviews / yearsActive).toFixed(1));

  // حسابات الـ 10% بناءً على عدد العملاء المذكور في الفورم
  // نستخدم عدد العملاء الشهري (إن وجد) أو نفرض متوسطاً منطقياً للتحليل
  const monthlyCustomers = data.monthlyCustomers || 1000; 
  const dailyCustomers = Math.floor(monthlyCustomers / 30);
  const projectedDailyReviews = dailyCustomers * 0.10; // قاعدة الـ 10%
  const annualAdditionalReviews = Math.floor(projectedDailyReviews * 365);
  const totalProjectedAnnual = Math.floor(avgReviewsPerYear + annualAdditionalReviews);

  // حساب الأرباح الديناميكي: نفترض أن كل تقييم إيجابي إضافي يرفع القيمة السوقية بمتوسط 20 د.ك سنوياً
  const dynamicProfit = (annualAdditionalReviews * 20).toLocaleString();

  // --- منطق التشخيص السوقي المتكيف ---
  const getDiagnosis = () => {
    if (avgReviewsPerYear < 20) {
      return {
        title: isRTL ? 'خارج المنافسة الرقمية' : 'Out of Competition',
        sub: isRTL ? 'نشاطك التجاري "صامت" تقنياً' : 'Your business is digitally silent',
        desc: isRTL ? 'المنافسون يبتلعون حصتك السوقية لأن تقييماتك لا تعكس حجم عملك الحقيقي.' : 'Competitors are seizing your market share because your ratings don\'t reflect your true scale.',
        color: 'text-red-500', bg: 'bg-[#1a0a10]', icon: <Ghost size={70} />
      };
    } else if (avgReviewsPerYear < 100) {
      return {
        title: isRTL ? 'نمو يحتاج إلى أتمتة' : 'Growth Needs Automation',
        sub: isRTL ? 'أداؤك جيد.. لكن اليدوي لن يهزم الآلي' : 'Good performance.. but manual won\'t beat automated',
        desc: isRTL ? 'تمتلك تقييمات جيدة، ولكن بالأتمتة ستتضاعف هذه الأرقام وتسيطر على منطقتك الجغرافية.' : 'You have good ratings, but with automation, you will dominate your local area.',
        color: 'text-orange-500', bg: 'bg-[#1a140a]', icon: <Target size={70} />
      };
    } else {
      return {
        title: isRTL ? 'سيادة سوقية مهددة' : 'Market Dominance at Risk',
        sub: isRTL ? 'أنت في القمة.. استعد للسيطرة المطلقة' : 'You are at the top.. Prepare for absolute control',
        desc: isRTL ? 'تقييماتك ممتازة، وبالاستمرار بالأتمتة ستسود وتسيطر على المنافسة وتغلق الباب أمام أي منافس جديد.' : 'Excellent ratings; by continuing with automation, you will rule the competition and block any new challengers.',
        color: 'text-blue-500', bg: 'bg-[#0a121e]', icon: <Zap size={70} />
      };
    }
  };

  const diag = getDiagnosis();

  const whatsappNumber = "96566305551";
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isRTL ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName})` : `Hello, interested in the system for (${data.projectName})`)}`;

  return (
    <div className={`space-y-24 pb-32 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. التشخيص السوقي الفعلي */}
      <div className={`${diag.bg} border-2 border-white/5 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative shadow-2xl overflow-hidden`}>
        <div className="space-y-4 z-10 flex-1">
          <span className={`${diag.color} font-bold text-sm uppercase tracking-[0.3em] opacity-80`}>
            {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
          </span>
          <h2 className={`${diag.color} text-5xl md:text-7xl font-black italic`}>
            {diag.title}
          </h2>
          <h3 className="text-white text-2xl md:text-3xl font-bold opacity-90 border-b border-white/10 pb-4 inline-block">
            {diag.sub}
          </h3>
          <p className="text-slate-400 font-bold text-xl md:text-2xl leading-relaxed max-w-3xl">
            {diag.desc}
          </p>
        </div>
        <div className={`${diag.color} opacity-20 p-10 rounded-full shrink-0 animate-pulse`}>
          {diag.icon}
        </div>
      </div>

      {/* 2. مقارنة الأداء والزيادة المتوقعة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-[#0a121e] border-2 border-red-500/10 rounded-[3.5rem] p-12 space-y-10 relative shadow-xl">
          <div className="flex items-center gap-4 text-slate-400 font-black text-3xl uppercase">
             <TrendingDown className="text-red-500" size={36} /> {isRTL ? 'نزيف الفرص الحالي' : 'Current Leak'}
          </div>
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <span className="text-slate-500 text-lg font-bold">{isRTL ? 'معدل التقييم السنوي الحالي' : 'Current Annual Rate'}</span>
               <span className="text-5xl font-black text-white">{avgReviewsPerYear}</span>
            </div>
            <p className="text-slate-400 font-bold text-xl italic border-r-4 border-red-500 pr-4">
              {isRTL 
                ? 'الحصول على التقييمات يتم حالياً بجهد يدوي عشوائي، مما يضيع عليك مئات العملاء شهرياً.' 
                : 'Current ratings are manual and inconsistent, costing you hundreds of customers monthly.'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0d1b33] to-[#0a121e] border-2 border-blue-500/40 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative shadow-blue-900/30">
          <div className="flex items-center gap-4 text-blue-400 font-black text-3xl uppercase">
            <TrendingUp size={36} /> {isRTL ? 'مع نظام ELEGANT OPTIONS' : 'WITH ELEGANT OPTIONS'}
          </div>
          <div className="space-y-8">
             <div className="flex justify-between items-end border-b border-blue-500/20 pb-4">
                <span className="text-slate-300 font-bold text-lg">{isRTL ? 'المعدل السنوي الإضافي المتوقع' : 'Projected Additional Annual'}</span>
                <span className="text-7xl font-black text-green-400">+{annualAdditionalReviews}</span>
             </div>
             <p className="text-blue-100 font-bold text-xl leading-relaxed">
               {isRTL 
                 ? `عبر أتمتة "قاعدة الـ 10%" لـ ${dailyCustomers} عملاء يومياً، سيقوم النظام بتحويل صمتهم إلى ${annualAdditionalReviews} تقييم إيجابي سنوياً بشكل آلي.` 
                 : `By automating the "10% rule" for ${dailyCustomers} daily customers, the system converts their silence into ${annualAdditionalReviews} annual positive reviews.`}
             </p>
          </div>
        </div>
      </div>

      {/* 3. المميزات التنافسية (توصيل طلبات/كيتا المستعاد) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="bg-[#0a121e] border-2 border-blue-500/20 rounded-[3.5rem] p-12 flex flex-col items-center text-center space-y-8 hover:border-blue-500/60 transition-all group shadow-2xl min-h-[500px]">
          <div className="bg-blue-500/10 p-8 rounded-[2.5rem] text-blue-400 group-hover:scale-110 transition-transform">
            <Bot size={60}/>
          </div>
          <h4 className="text-white font-black text-3xl leading-tight">{isRTL ? 'ردود ذكية بواسطة AI' : 'Smart AI Replies'}</h4>
          <p className="text-slate-400 text-xl leading-relaxed">
            {isRTL 
              ? 'الرد اللحظي على كل تقييم يرفع تصنيفك في جوجل بنسبة 40% إضافية ويشعر العميل بالاهتمام الفوري.' 
              : 'Instant AI replies boost your Google ranking by 40% and ensure customer satisfaction.'}
          </p>
        </div>

        <div className="bg-[#0a121e] border-2 border-orange-500/20 rounded-[3.5rem] p-12 flex flex-col items-center text-center space-y-8 hover:border-orange-500/60 transition-all group shadow-2xl min-h-[500px]">
          <div className="bg-orange-500/10 p-8 rounded-[2.5rem] text-orange-400 group-hover:scale-110 transition-transform">
            <ShieldCheck size={60}/>
          </div>
          <h4 className="text-white font-black text-3xl leading-tight">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
          <p className="text-slate-400 text-xl leading-relaxed">
            {isRTL 
              ? 'نظام فلترة ذكي يكتشف التقييمات السلبية ويحولها لشكاوى خاصة للإدارة قبل نشرها علنياً.' 
              : 'Smart filtering captures negative reviews and routes them to management before public posting.'}
          </p>
        </div>

        {data.businessType === 'restaurant' && (
          <div className="bg-[#0a121e] border-2 border-red-500/20 rounded-[3.5rem] p-12 flex flex-col items-center text-center space-y-8 hover:border-red-500/60 transition-all group shadow-2xl min-h-[500px]">
             <div className="bg-red-500/10 p-8 rounded-[2.5rem] text-red-500 group-hover:scale-110 transition-transform">
              <Bike size={60}/>
            </div>
            <h4 className="text-white font-black text-3xl leading-tight">{isRTL ? 'دمج طلبات وكيتا' : 'Delivery Sync'}</h4>
            <p className="text-slate-400 text-xl leading-relaxed">
              {isRTL 
                ? 'ربط مباشر ومجاني مع تطبيقات التوصيل؛ بمجرد استلام الطلب، يرسل النظام رسالة واتساب للعميل تطلب تقييمه بذكاء لتسهيل العملية وضمان أعلى معدل تحويل.' 
                : 'Automated free sync with delivery apps; the system sends a WhatsApp review request upon delivery to ensure maximum conversion.'}
            </p>
          </div>
        )}
      </div>

      {/* 4. الأرباح السنوية المحققة (رقم ديناميكي) */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[4rem] p-16 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10 text-center md:text-right">
          <div className="space-y-6">
            <h3 className="text-blue-400 font-black text-5xl flex items-center justify-center md:justify-start gap-5">
              <DollarSign size={54} /> {isRTL ? 'أرباح نظرية الولاء السنوية' : 'Annual Loyalty ROI'}
            </h3>
            <p className="text-slate-400 font-bold text-2xl max-w-2xl leading-relaxed">
              {isRTL 
                ? 'هذه المبالغ تمثل العائد المادي المتوقع بناءً على تحويل التقييمات الجديدة إلى ثقة عمياء تجذب تدفقاً مستمراً من العملاء الجدد.' 
                : 'Projected financial return based on turning new reviews into absolute trust that drives consistent growth.'}
            </p>
          </div>
          <div className="text-9xl font-black text-white tracking-tighter animate-pulse">
            {dynamicProfit} <span className="text-4xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
          </div>
        </div>
      </div>

      {/* 5. الأزرار النهائية (مع تفعيل المحاكي) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        <button 
          onClick={() => window.open(waLink, '_blank')}
          className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-12 rounded-[3.5rem] flex items-center justify-center gap-6 text-4xl transition-all shadow-2xl group active:scale-95">
          <CheckCircle2 size={48} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        <div className="relative group">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-black px-8 py-3 rounded-full flex flex-col items-center gap-1 z-20 shadow-xl border border-white/30 animate-bounce">
             <Star size={18} className="animate-spin" /> {isRTL ? 'شاهد المحاكي الآن' : 'Watch Simulator'}
          </div>
          <button 
            onClick={onShowVisualExperience}
            className="w-full bg-[#0d1b33] border-4 border-blue-600 text-white font-black py-12 rounded-[3.5rem] flex items-center justify-center gap-6 text-4xl transition-all shadow-2xl active:scale-95">
            <LayoutDashboard size={48} />
            {isRTL ? 'تجربة بصرية' : 'VISUAL EXPERIENCE'}
          </button>
        </div>
      </div>

      <div className="text-center pt-10">
        <button onClick={onReset} className="inline-flex items-center gap-3 text-slate-500 hover:text-white font-bold text-2xl transition-colors">
          <RotateCcw size={28} />
          {isRTL ? 'فحص مشروع آخر' : 'Check another project'}
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
