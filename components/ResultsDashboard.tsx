// @ts-nocheck
import React from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Star, 
  ShieldCheck, Bot, Bike, Quote, 
  CheckCircle2, RotateCcw, LayoutDashboard, Target, Zap, AlertTriangle
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
  
  // 1. الحسابات الأساسية (الوضع الحالي)
  const currentYear = new Date().getFullYear();
  const establishedYear = parseInt(data.establishedYear) || currentYear;
  const yearsActive = Math.max(1, currentYear - establishedYear);
  const avgReviewsPerYear = parseFloat((data.currentReviews / yearsActive).toFixed(1));

  // 2. منطق التشخيص السوقي المطور
  const getDiagnosis = () => {
    if (avgReviewsPerYear < 10) {
      return {
        status: 'weak',
        title: isRTL ? 'نشاط غير مرئي رقمياً' : 'Digitally Invisible',
        desc: isRTL 
          ? 'الحساب لا يظهر بالشكل الكافي للعملاء المحتملين، والمنافسون يزداد حضورهم ويستغلون هذا الضعف لرفع مبيعاتهم.' 
          : 'Your account is nearly invisible to potential customers. Competitors are seizing this gap to grow their market share.',
        color: 'text-red-500',
        bg: 'bg-[#1a0a10]',
        border: 'border-red-900/30',
        icon: <Ghost size={60} />
      };
    } else if (avgReviewsPerYear < 50) {
      return {
        status: 'medium',
        title: isRTL ? 'حضور موجود ولكن غير مستغل' : 'Existing but Unexploited',
        desc: isRTL 
          ? 'الحساب موجود في السوق لكنه غير مستغل بالشكل الأمثل. يمكن لنظامنا تحويل هذا التواجد إلى قيادة حقيقية للسوق.' 
          : 'Your presence exists but is not optimized. Our system can turn this presence into absolute market leadership.',
        color: 'text-orange-500',
        bg: 'bg-[#1a140a]',
        border: 'border-orange-900/30',
        icon: <Target size={60} />
      };
    } else {
      return {
        status: 'strong',
        title: isRTL ? 'ريادة تحتاج إلى أتمتة' : 'Leadership via Automation',
        desc: isRTL 
          ? 'أنت رائد في مجالك حالياً، لكنك تحتاج للأتمتة والذكاء الاصطناعي للحفاظ على هذه الريادة وتوسيع الفارق مع المنافسين.' 
          : 'You are currently a leader, but you need AI automation to maintain this lead and widen the gap with competitors.',
        color: 'text-blue-500',
        bg: 'bg-[#0a121e]',
        border: 'border-blue-900/30',
        icon: <Zap size={60} />
      };
    }
  };

  const diag = getDiagnosis();

  // 3. إعداد رابط الواتساب الديناميكي
  const whatsappNumber = "96566305551";
  const whatsappMsg = encodeURIComponent(
    isRTL 
      ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName})` 
      : `Hello Elegant Options, I am interested in the system for my project (${data.projectName})`
  );
  const waLink = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className={`space-y-12 pb-24 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* قسم التشخيص السوقي العلوي */}
      <div className={`${diag.bg} border ${diag.border} rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative shadow-2xl`}>
        <div className="space-y-4 z-10 flex-1">
          <div className="flex items-center gap-2">
            <span className={`${diag.color} font-bold text-sm uppercase tracking-widest opacity-80`}>
              {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
            </span>
          </div>
          <h2 className={`${diag.color} text-4xl md:text-6xl font-black leading-tight`}>
            {diag.title}
          </h2>
          <p className="text-slate-300 font-bold text-xl md:text-2xl leading-relaxed max-w-3xl">
            {diag.desc}
          </p>
        </div>
        <div className={`${diag.color} bg-current/10 p-8 rounded-full shrink-0 animate-pulse`}>
          {diag.icon}
        </div>
      </div>

      {/* قسم المقارنة الحقيقية (الوضع الحالي vs نظام Elegant Options) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* بطاقة الوضع الحالي */}
        <div className="bg-[#0a121e] border border-white/10 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
          <div className="flex items-center gap-3 text-slate-400 font-black text-2xl uppercase">
            <AlertTriangle size={28} /> {isRTL ? 'الوضع الحالي (بدون النظام)' : 'Current Status'}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-slate-500 text-sm font-bold block">{isRTL ? 'إجمالي التقييمات' : 'Total Reviews'}</span>
              <span className="text-4xl font-black text-white">{data.currentReviews}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 text-sm font-bold block">{isRTL ? 'سنوات العمل' : 'Years Active'}</span>
              <span className="text-4xl font-black text-white">{yearsActive}</span>
            </div>
            <div className="col-span-2 pt-4 border-t border-white/5">
              <span className="text-slate-500 text-sm font-bold block">{isRTL ? 'معدل التقييم السنوي' : 'Avg. Reviews / Year'}</span>
              <span className="text-6xl font-black text-red-500">{avgReviewsPerYear}</span>
            </div>
          </div>

          <p className="text-slate-400 font-bold text-lg leading-relaxed bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
            {isRTL 
              ? 'المنافسون يستغلون ضعف هذا التواجد الرقمي ويستفيدون من هذه الفرص الضائعة لزيادة أرباحهم على حساب مشروعك.' 
              : 'Competitors are exploiting this weak digital presence, taking advantage of missed opportunities to grow their profits at your expense.'}
          </p>
        </div>

        {/* بطاقة نظام Elegant Options */}
        <div className="bg-gradient-to-br from-[#0d1b33] to-[#0a121e] border-2 border-blue-500/40 rounded-[3rem] p-10 space-y-8 relative shadow-blue-900/20 shadow-2xl">
          <div className="flex items-center gap-3 text-blue-400 font-black text-2xl uppercase">
            <TrendingUp size={28} /> {isRTL ? 'مع نظام ELEGANT OPTIONS' : 'WITH OUR SYSTEM'}
          </div>

          <div className="grid grid-cols-1 gap-6">
             <div className="flex justify-between items-end border-b border-blue-500/10 pb-4">
                <span className="text-slate-400 font-bold text-lg">{isRTL ? 'الزيادة المتوقعة في التقييمات' : 'Projected Growth'}</span>
                <span className="text-6xl font-black text-blue-500">3X</span>
             </div>
             <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold text-lg">{isRTL ? 'معدل التقييم السنوي المستهدف' : 'Target Reviews / Year'}</span>
                <span className="text-6xl font-black text-green-400">{Math.floor(avgReviewsPerYear * 3)}</span>
             </div>
          </div>

          <p className="text-blue-100 font-bold text-lg leading-relaxed bg-blue-500/10 p-4 rounded-2xl">
            {isRTL 
              ? 'عبر أتمتة الردود الذكية، وتفعيل درع حماية السمعة، ودمج تطبيقات التوصيل؛ نضمن لك تحويل كل عميل إلى تقييم إيجابي دائم.' 
              : 'Through smart automated replies, reputation shielding, and delivery integration, we guarantee every customer turns into a permanent positive review.'}
          </p>
        </div>
      </div>

      {/* قسم المميزات التنافسية (AI, Shield, Delivery) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* ميزة الردود الآلية AI */}
        <div className="bg-[#0a121e] border border-blue-500/20 rounded-[3rem] p-10 space-y-6 hover:border-blue-500/50 transition-all shadow-xl group">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-2xl leading-tight">{isRTL ? 'ردود آلية ذكية (24/7)' : '24/7 AI Replies'}</h4>
            <div className="bg-blue-500/20 p-4 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Bot size={36}/></div>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed">
            {isRTL 
              ? 'نظام ذكاء اصطناعي يقوم بالرد الفوري على كل تقييم في Google Maps لحظة نشره، مما يرفع تصنيف نشاطك في محركات البحث بشكل آلي.' 
              : 'An AI system that instantly replies to every Google Maps review the moment it is posted, automatically boosting your SEO ranking.'}
          </p>
        </div>

        {/* ميزة درع حماية السمعة */}
        <div className="bg-[#0a121e] border border-orange-500/20 rounded-[3rem] p-10 space-y-6 hover:border-orange-500/50 transition-all shadow-xl group">
           <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-2xl leading-tight">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
            <div className="bg-orange-500/20 p-4 rounded-2xl text-orange-400 group-hover:scale-110 transition-transform"><ShieldCheck size={36}/></div>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed">
            {isRTL 
              ? 'أي تقييم (3 نجوم أو أقل) لا يظهر علناً! يتم تحويله فوراً كرسالة خاصة للإدارة لمعالجة مشكلة العميل داخلياً قبل أن يشوه صورتك العامة.' 
              : 'Any review (3 stars or less) is hidden! It is instantly routed to management to resolve the issue privately before it affects your public image.'}
          </p>
        </div>

        {/* ميزة تطبيقات التوصيل (شرطية للمطاعم) */}
        {data.businessType === 'restaurant' && (
          <div className="bg-[#0a121e] border border-red-500/20 rounded-[3rem] p-10 space-y-6 hover:border-red-500/50 transition-all shadow-xl group">
             <div className="flex justify-between items-center">
              <h4 className="text-white font-black text-2xl leading-tight">{isRTL ? 'أتمتة تطبيقات التوصيل' : 'Delivery Automation'}</h4>
              <div className="bg-red-500/20 p-4 rounded-2xl text-red-500 group-hover:scale-110 transition-transform"><Bike size={36}/></div>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed">
              {isRTL 
                ? 'ربط مجاني وآلي مع (طلبات/كيتا) لإرسال رسائل طلب تقييم عبر الواتساب فور استلام الطلب، مما يضاعف عدد تقييماتك دون أي تكلفة إضافية.' 
                : 'Free automated sync with Talabat/Kita to send WhatsApp review requests upon delivery, doubling your ratings with zero extra cost.'}
            </p>
          </div>
        )}
      </div>

      {/* قسم الأرباح السنوية الضائعة/المحتملة */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-blue-400 font-black text-4xl flex items-center justify-center md:justify-start gap-4">
              <DollarSign size={44} /> {isRTL ? 'أرباح نظرية الولاء السنوية' : 'Annual Loyalty ROI'}
            </h3>
            <p className="text-slate-400 font-bold text-xl max-w-xl">
              {isRTL 
                ? 'هذه المبالغ تمثل الأرباح السنوية التي يمكن اكتسابها عند تحقيق نظرية ولاء العملاء وتحويل كل تجربة شراء إلى علاقة مستدامة.' 
                : 'Estimated annual profits achievable by applying Customer Loyalty Theory and turning every purchase into a sustainable relationship.'}
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-8xl font-black text-white tracking-tighter">
              28,800 <span className="text-3xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* الأزرار النهائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {/* زر الطلب */}
        <button 
          onClick={() => window.open(waLink, '_blank')}
          className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-12 rounded-[3rem] flex items-center justify-center gap-6 text-4xl transition-all shadow-2xl shadow-green-900/40 group active:scale-95">
          <CheckCircle2 size={48} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        {/* زر التجربة البصرية */}
        <div className="relative group">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-black px-8 py-3 rounded-full flex flex-col items-center gap-1 z-20 shadow-xl border border-white/20 whitespace-nowrap animate-bounce">
             <div className="flex items-center gap-2">
                <Star size={18} className="animate-spin" /> 
                {isRTL ? 'اكتشف القوة الكامنة خلف الأرقام' : 'Discover the hidden power'}
             </div>
          </div>
          <button 
            onClick={onShowVisualExperience}
            className="w-full bg-[#0d1b33] hover:bg-blue-800 border-4 border-blue-600 text-white font-black py-12 rounded-[3rem] flex items-center justify-center gap-6 text-4xl transition-all shadow-2xl active:scale-95">
            <LayoutDashboard size={48} />
            {isRTL ? 'تجربة بصرية' : 'VISUAL EXPERIENCE'}
          </button>
        </div>
      </div>

      {/* زر العودة */}
      <div className="text-center pt-8">
        <button onClick={onReset} className="inline-flex items-center gap-3 text-slate-500 hover:text-white font-bold text-xl transition-colors">
          <RotateCcw size={24} />
          {isRTL ? 'فحص مشروع آخر' : 'Check another project'}
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
