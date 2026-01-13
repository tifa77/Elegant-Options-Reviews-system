// @ts-nocheck
import React from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Star, 
  ShieldCheck, Bot, Bike, Quote, 
  CheckCircle2, RotateCcw, LayoutDashboard, Target, Zap, AlertTriangle, TrendingDown
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

  // حسابات الـ 10% (بفرض متوسط 30 عميل يومياً إذا لم يتوفر الرقم، أو بناءً على معطيات النظام)
  const estimatedDailyCustomers = 30; // قيمة افتراضية للتحليل
  const projectedDailyReviews = estimatedDailyCustomers * 0.10; // تحويل 10% من العملاء
  const projectedAnnualReviews = Math.floor(projectedDailyReviews * 365);

  // --- منطق التشخيص السوقي الفعلي ---
  const getDiagnosis = () => {
    if (avgReviewsPerYear < 15) {
      return {
        title: isRTL ? 'خارج المنافسة' : 'Out of Competition',
        sub: isRTL ? 'نشاطك التجاري "شبح" في محركات البحث' : 'Your business is a "Ghost" in search results',
        desc: isRTL ? 'المنافسون يبتلعون حصتك السوقية بينما يظل حسابك صامتاً.' : 'Competitors are swallowing your market share while you stay silent.',
        color: 'text-red-500', bg: 'bg-[#1a0a10]', icon: <Ghost size={70} />
      };
    } else if (avgReviewsPerYear < 70) {
      return {
        title: isRTL ? 'حضور فاقد للسيطرة' : 'Uncontrolled Presence',
        sub: isRTL ? 'تمتلك الأساس.. لكنك تفتقد القيادة' : 'You have the foundation.. but lack leadership',
        desc: isRTL ? 'حسابك يتحرك ببطء شديد، نظامنا سيضاعف هذا النمو 10 مرات.' : 'Your account moves too slowly; our system will 10x this growth.',
        color: 'text-orange-500', bg: 'bg-[#1a140a]', icon: <Target size={70} />
      };
    } else {
      return {
        title: isRTL ? 'ريادة رقمية مهددة' : 'Threatened Leadership',
        sub: isRTL ? 'القمة صعبة.. والحفاظ عليها أصعب' : 'The top is hard.. staying there is harder',
        desc: isRTL ? 'أنت في الصدارة، لكن بدون أتمتة وذكاء اصطناعي، السقوط مسألة وقت.' : 'You lead now, but without AI automation, falling is just a matter of time.',
        color: 'text-blue-500', bg: 'bg-[#0a121e]', icon: <Zap size={70} />
      };
    }
  };

  const diag = getDiagnosis();

  const whatsappNumber = "96566305551";
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isRTL ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName})` : `Hello, interested in the system for (${data.projectName})`)}`;

  return (
    // زيادة الـ space-y لجعل التقرير أكثر طولاً وفخامة
    <div className={`space-y-24 pb-32 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. التشخيص السوقي الفعلي مع العنوان المشوق */}
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

      {/* 2. مقارنة الأداء (الوضع الحالي vs العملاق Elegant Options) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* البطاقة السلبية: الوضع الحالي */}
        <div className="bg-[#0a121e] border-2 border-red-500/10 rounded-[3.5rem] p-12 space-y-10 relative shadow-xl">
          <div className="flex items-center gap-4 text-slate-400 font-black text-3xl uppercase">
             <TrendingDown className="text-red-500" size={36} /> {isRTL ? 'نزيف الفرص الحالي' : 'Current Opportunity Leak'}
          </div>
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
               <span className="text-slate-500 text-lg font-bold">{isRTL ? 'معدل التقييم السنوي الحالي' : 'Current Annual Reviews'}</span>
               <span className="text-5xl font-black text-white">{avgReviewsPerYear}</span>
            </div>
            <p className="text-slate-400 font-bold text-xl leading-relaxed italic border-r-4 border-red-500 pr-4">
              {isRTL 
                ? 'أنت تحصل على تقييمات بالصدفة فقط. المنافسون يستغلون صمت عملائك رقمياً لبناء إمبراطوريتهم على حسابك.' 
                : 'You only get reviews by chance. Competitors exploit your customers digital silence.'}
            </p>
          </div>
        </div>

        {/* البطاقة الإيجابية: قوة النظام بنسبة 10% */}
        <div className="bg-gradient-to-br from-[#0d1b33] to-[#0a121e] border-2 border-blue-500/40 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative shadow-blue-900/30">
          <div className="flex items-center gap-4 text-blue-400 font-black text-3xl uppercase">
            <TrendingUp size={36} /> {isRTL ? 'مع نظام ELEGANT OPTIONS' : 'WITH OUR SYSTEM'}
          </div>
          <div className="space-y-8">
             <div className="flex justify-between items-end border-b border-blue-500/20 pb-4">
                <span className="text-slate-300 font-bold text-lg">{isRTL ? 'معدل التقييم السنوي المستهدف' : 'Target Annual Reviews'}</span>
                <span className="text-7xl font-black text-green-400">{projectedAnnualReviews}+</span>
             </div>
             <p className="text-blue-100 font-bold text-xl leading-relaxed">
               {isRTL 
                 ? `عبر تفعيل "قاعدة الـ 10%"، سيقوم النظام بتحويل كل 10 عملاء من أصل 100 إلى مقيمين نشطين يومياً، مما يمنحك نمواً انفجارياً في الثقة والمبيعات.` 
                 : `By activating the "10% Rule", the system converts 10 out of every 100 customers into active reviewers, granting you explosive growth.`}
             </p>
          </div>
        </div>
      </div>

      {/* 3. المميزات التنافسية (تصميم طولي، ضخم، ومرتب) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* ميزة الردود الآلية - طولي */}
        <div className="bg-[#0a121e] border-2 border-blue-500/20 rounded-[3.5rem] p-12 flex flex-col items-center text-center space-y-8 hover:border-blue-500/60 transition-all group shadow-2xl min-h-[500px]">
          <div className="bg-blue-500/10 p-8 rounded-[2.5rem] text-blue-400 group-hover:scale-110 transition-transform">
            <Bot size={60}/>
          </div>
          <h4 className="text-white font-black text-3xl leading-tight">{isRTL ? 'ردود ذكية بواسطة AI' : 'Smart AI Replies'}</h4>
          <p className="text-slate-400 text-xl leading-relaxed">
            {isRTL 
              ? 'موظف رقمي يعمل 24/7 للرد الفوري على كل تقييم بأسلوب احترافي يرفع ترتيبك في جوجل فوراً.' 
              : 'Digital employee working 24/7 to reply instantly to every review, boosting your ranking.'}
          </p>
        </div>

        {/* درع السمعة - طولي */}
        <div className="bg-[#0a121e] border-2 border-orange-500/20 rounded-[3.5rem] p-12 flex flex-col items-center text-center space-y-8 hover:border-orange-500/60 transition-all group shadow-2xl min-h-[500px]">
          <div className="bg-orange-500/10 p-8 rounded-[2.5rem] text-orange-400 group-hover:scale-110 transition-transform">
            <ShieldCheck size={60}/>
          </div>
          <h4 className="text-white font-black text-3xl leading-tight">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
          <p className="text-slate-400 text-xl leading-relaxed">
            {isRTL 
              ? 'حجب كامل للتقييمات السلبية (3 نجوم أو أقل) وتحويلها كشكوى خاصة للإدارة قبل أن يراها العالم.' 
              : 'Complete block of negative reviews, routing them as private complaints before the world sees them.'}
          </p>
        </div>

        {/* دمج التوصيل - شرطي كما كان سابقاً */}
        {data.businessType === 'restaurant' && (
          <div className="bg-[#0a121e] border-2 border-red-500/20 rounded-[3.5rem] p-12 flex flex-col items-center text-center space-y-8 hover:border-red-500/60 transition-all group shadow-2xl min-h-[500px]">
             <div className="bg-red-500/10 p-8 rounded-[2.5rem] text-red-500 group-hover:scale-110 transition-transform">
              <Bike size={60}/>
            </div>
            <h4 className="text-white font-black text-3xl leading-tight">{isRTL ? 'دمج تطبيقات التوصيل' : 'Delivery Sync'}</h4>
            <p className="text-slate-400 text-xl leading-relaxed">
              {isRTL 
                ? 'ربط مجاني ومؤتمت مع (طلبات/كيتا) لإرسال طلب تقييم فوري عبر الواتساب فور استلام العميل لوجبته.' 
                : 'Automated sync with Talabat/Kita to send review requests via WhatsApp upon delivery.'}
            </p>
          </div>
        )}
      </div>

      {/* 4. قسم الأرباح السنوية المحققة */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[4rem] p-16 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10 text-center md:text-right">
          <div className="space-y-6">
            <h3 className="text-blue-400 font-black text-5xl flex items-center justify-center md:justify-start gap-5">
              <DollarSign size={54} /> {isRTL ? 'أرباح نظرية الولاء السنوية' : 'Annual Loyalty ROI'}
            </h3>
            <p className="text-slate-400 font-bold text-2xl max-w-2xl leading-relaxed">
              {isRTL 
                ? 'هذه المبالغ تمثل الأرباح المحققة عند تحويل العميل العابر إلى عميل وفيّ يثق في علامتك التجارية بناءً على سمعتك الرقمية القوية.' 
                : 'Profits realized when turning a casual customer into a loyal fan based on your digital reputation.'}
            </p>
          </div>
          <div className="text-9xl font-black text-white tracking-tighter animate-pulse">
            28,800 <span className="text-4xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
          </div>
        </div>
      </div>

      {/* 5. الأزرار النهائية (الطلب والتجربة البصرية) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        {/* زر اطلب النظام */}
        <button 
          onClick={() => window.open(waLink, '_blank')}
          className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-12 rounded-[3.5rem] flex items-center justify-center gap-6 text-4xl transition-all shadow-2xl shadow-green-900/40 group active:scale-95">
          <CheckCircle2 size={48} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        {/* زر تجربة بصرية - مربوط بالدالة ومحفز بعبارة */}
        <div className="relative group">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-black px-8 py-3 rounded-full flex flex-col items-center gap-1 z-20 shadow-xl border border-white/30 animate-bounce whitespace-nowrap">
             <div className="flex items-center gap-2">
                <Star size={18} className="animate-spin" /> 
                {isRTL ? 'شاهد مستقبلك الرقمي' : 'See your future'}
             </div>
          </div>
          <button 
            onClick={onShowVisualExperience}
            className="w-full bg-[#0d1b33] border-4 border-blue-600 text-white font-black py-12 rounded-[3.5rem] flex items-center justify-center gap-6 text-4xl transition-all shadow-2xl active:scale-95">
            <LayoutDashboard size={48} />
            {isRTL ? 'تجربة بصرية' : 'VISUAL EXPERIENCE'}
          </button>
        </div>
      </div>

      {/* زر العودة */}
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
