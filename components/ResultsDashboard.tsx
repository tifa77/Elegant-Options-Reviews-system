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
  
  // --- محرك الحسابات الواقعية ---
  const currentYear = 2026; 
  const establishedYear = parseInt(data.establishmentYear) || 2024;
  const yearsActive = Math.max(1, currentYear - establishedYear);
  const avgReviewsPerYear = parseFloat((data.currentReviews / yearsActive).toFixed(1));

  // --- منطق التشخيص السوقي بناءً على المعدل السنوي ---
  const getDiagnosis = () => {
    if (avgReviewsPerYear < 15) {
      return {
        type: 'poor',
        title: isRTL ? 'حساب غير مرئي سوقياً' : 'Digitally Invisible',
        desc: isRTL 
          ? 'الحساب لا يظهر بالشكل الكافي للعملاء المحتملين، والمنافسون يستغلون هذا الضعف لرفع مبيعاتهم.' 
          : 'Your account is nearly invisible. Competitors are exploiting this gap to capture your potential customers.',
        color: 'text-red-500', bg: 'bg-[#1a0a10]', icon: <Ghost size={60} />
      };
    } else if (avgReviewsPerYear < 80) {
      return {
        type: 'average',
        title: isRTL ? 'حضور موجود ولكن غير مستغل' : 'Present but Unexploited',
        desc: isRTL 
          ? 'الحساب موجود لكنه غير مستغل، ويمكن للنظام تحويل هذا الوجود إلى قيادة حقيقية للسوق.' 
          : 'Your presence exists but is not optimized. Our system can turn this into market leadership.',
        color: 'text-orange-500', bg: 'bg-[#1a140a]', icon: <Target size={60} />
      };
    } else {
      return {
        type: 'strong',
        title: isRTL ? 'ريادة تحتاج إلى أتمتة' : 'Leadership via Automation',
        desc: isRTL 
          ? 'الحساب رائد في مجاله حالياً، لكنه يحتاج أتمتة وذكاء اصطناعي للحفاظ على هذه الريادة وتوسيعها.' 
          : 'You are a market leader, but you need AI automation to maintain and scale this dominance.',
        color: 'text-blue-500', bg: 'bg-[#0a121e]', icon: <Zap size={60} />
      };
    }
  };

  const diagnosis = getDiagnosis();

  // --- إعداد رابط الواتساب الديناميكي ---
  const whatsappNumber = "96566305551";
  const message = isRTL 
    ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName})` 
    : `Hello Elegant Options, interested in the system for my project (${data.projectName})`;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={`space-y-12 pb-24 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. التشخيص السوقي الفعلي (Banner) */}
      <div className={`${diagnosis.bg} border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-2xl`}>
        <div className="space-y-3 z-10 flex-1">
          <span className={`${diagnosis.color} font-bold text-sm uppercase tracking-widest opacity-70`}>
            {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
          </span>
          <h2 className={`${diagnosis.color} text-4xl md:text-5xl font-black italic`}>
            {diagnosis.title}
          </h2>
          <p className="text-slate-300 font-bold text-xl leading-relaxed">
            {diagnosis.desc}
          </p>
        </div>
        <div className={`${diagnosis.color} opacity-20 p-6 rounded-full shrink-0`}>
          {diagnosis.icon}
        </div>
      </div>

      {/* 2. مقارنة الأداء (الوضع الحالي vs نظام Elegant Options) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* بطاقة الوضع الحالي */}
        <div className="bg-[#0a121e] border border-white/5 rounded-[3rem] p-10 space-y-6 shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-3 text-slate-400 font-black text-2xl">
             <AlertTriangle className="text-red-500" /> {isRTL ? 'الوضع الحالي (بدون النظام)' : 'Current Status'}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <span className="text-slate-500 text-xs block mb-1 uppercase tracking-tighter">{isRTL ? 'إجمالي التقييمات' : 'Total Reviews'}</span>
              <span className="text-4xl font-black text-white">{data.currentReviews}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block mb-1 uppercase tracking-tighter">{isRTL ? 'سنوات التأسيس' : 'Years Active'}</span>
              <span className="text-4xl font-black text-white">{yearsActive}</span>
            </div>
            <div className="col-span-2 pt-4">
               <span className="text-slate-500 text-xs block mb-1 uppercase tracking-tighter">{isRTL ? 'معدل التقييم السنوي الحالي' : 'Avg. Reviews / Year'}</span>
               <span className="text-6xl font-black text-red-500">{avgReviewsPerYear}</span>
            </div>
          </div>
          <p className="text-slate-400 font-bold text-lg bg-red-500/5 p-4 rounded-2xl border border-red-900/20">
            {isRTL 
              ? 'المنافسون يستغلون هذا الضعف في وجودك الرقمي لجذب عملائك المحتملين وزيادة حصتهم السوقية.' 
              : 'Competitors are exploiting your weak digital presence to steal your potential leads.'}
          </p>
        </div>

        {/* بطاقة مع النظام */}
        <div className="bg-gradient-to-br from-[#0d1b33] to-[#0a121e] border-2 border-blue-500/30 rounded-[3rem] p-10 space-y-6 shadow-2xl relative overflow-hidden shadow-blue-900/20">
           <div className="flex items-center gap-3 text-blue-400 font-black text-2xl uppercase">
             <TrendingUp /> {isRTL ? 'مع نظام ELEGANT OPTIONS' : 'WITH ELEGANT OPTIONS'}
           </div>
           <div className="grid grid-cols-1 gap-6 pt-4 border-t border-white/5">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-slate-400 font-bold">{isRTL ? 'النمو السنوي المتوقع' : 'Projected Growth'}</span>
                <span className="text-5xl font-black text-blue-500">3X</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold">{isRTL ? 'معدل التقييم السنوي المستهدف' : 'Target Reviews / Year'}</span>
                <span className="text-6xl font-black text-green-400">{Math.floor(avgReviewsPerYear * 3)}</span>
              </div>
           </div>
           <p className="text-blue-100 font-bold text-lg bg-blue-500/10 p-4 rounded-2xl">
             {isRTL 
               ? 'بفضل الأتمتة الشاملة ودرع الحماية، نضمن لك تصدر نتائج البحث وتحويل كل عميل لقصة نجاح رقمية.' 
               : 'With full automation and reputation shielding, we secure your top ranking and turn customers into digital fans.'}
           </p>
        </div>
      </div>

      {/* 3. شرح المميزات التنافسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* ميزة AI */}
        <div className="bg-[#0a121e] border border-blue-500/20 rounded-[3rem] p-10 space-y-4 hover:border-blue-500/50 transition-all group shadow-xl">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-2xl leading-tight">{isRTL ? 'ردود آلية ذكية بواسطة AI' : 'Smart AI Replies'}</h4>
            <div className="bg-blue-500/20 p-4 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Bot size={32}/></div>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed">
            {isRTL 
              ? 'نظام ذكاء اصطناعي يقوم بالرد الفوري على كل التقييمات في Google Maps (24/7)، مما يعزز ثقة العملاء ويرفع تصنيفك الرقمي فوراً.' 
              : 'AI system providing instant 24/7 replies to Google Maps reviews, boosting customer trust and SEO ranking.'}
          </p>
        </div>

        {/* درع الحماية */}
        <div className="bg-[#0a121e] border border-orange-500/20 rounded-[3rem] p-10 space-y-4 hover:border-orange-500/50 transition-all group shadow-xl">
           <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-2xl leading-tight">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
            <div className="bg-orange-500/20 p-4 rounded-2xl text-orange-400 group-hover:scale-110 transition-transform"><ShieldCheck size={32}/></div>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed">
            {isRTL 
              ? 'أي تقييم (3 نجوم أو أقل) لا يظهر علناً! يتم تحويله كرسالة داخلية خاصة عبر النظام للإدارة لمعالجة المشكلة بعيداً عن أعين المنافسين.' 
              : 'Any review (3 stars or less) is hidden! It is routed privately to management to resolve the issue away from public eyes.'}
          </p>
        </div>

        {/* دمج التوصيل (مطاعم فقط) */}
        {data.businessType === 'restaurant' && (
          <div className="bg-[#0a121e] border border-red-500/20 rounded-[3rem] p-10 space-y-4 hover:border-red-500/50 transition-all group shadow-xl">
             <div className="flex justify-between items-center">
              <h4 className="text-white font-black text-2xl leading-tight">{isRTL ? 'أتمتة تطبيقات التوصيل' : 'Delivery Automation'}</h4>
              <div className="bg-red-500/20 p-4 rounded-2xl text-red-500 group-hover:scale-110 transition-transform"><Bike size={32}/></div>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed">
              {isRTL 
                ? 'ربط مجاني مع (طلبات/كيتا) لإرسال طلب تقييم آلي عبر واتساب بعد كل طلب، مما يضاعف تقييماتك دون مجهود بشري أو تكلفة إضافية.' 
                : 'Free sync with Talabat/Kita to send automated WhatsApp review requests after every order, doubling reviews with zero effort.'}
            </p>
          </div>
        )}
      </div>

      {/* 4. مقولة هارفارد والتوصية */}
      <div className="text-center py-10 space-y-6">
        <Quote className="text-yellow-500/20 mx-auto" size={56} fill="currentColor" />
        <h3 className="text-white text-3xl font-black italic max-w-4xl mx-auto leading-tight">
          {isRTL ? '"زيادة نجمة واحدة في التقييم تؤدي لزيادة في الإيرادات بنسبة 5% إلى 9%."' : '"A one-star increase in rating leads to a 5% to 9% increase in revenue."'}
        </h3>
        <span className="text-yellow-500 font-black tracking-[0.3em] text-sm block uppercase">HARVARD BUSINESS SCHOOL</span>
      </div>

      {/* 5. الأرباح السنوية المستهدفة */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-blue-400 font-black text-4xl flex items-center justify-center md:justify-start gap-4">
              <DollarSign size={44} /> {isRTL ? 'أرباح نظرية الولاء السنوية' : 'Annual Loyalty ROI'}
            </h3>
            <p className="text-slate-400 font-bold text-xl max-w-xl">
              {isRTL 
                ? 'هذه المبالغ تمثل الأرباح التي يمكن اكتسابها عند تحقيق نظرية ولاء العملاء وتحويل كل تجربة شراء لتدفق نقدي مستدام.' 
                : 'Profits achievable by applying Customer Loyalty Theory, turning every purchase into sustainable cash flow.'}
            </p>
          </div>
          <div className="text-8xl font-black text-white tracking-tighter">
            28,800 <span className="text-3xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
          </div>
        </div>
      </div>

      {/* 6. الأزرار النهائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <button 
          onClick={() => window.open(waLink, '_blank')}
          className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-12 rounded-[3rem] flex items-center justify-center gap-4 text-3xl transition-all shadow-2xl shadow-green-900/40 group active:scale-95">
          <CheckCircle2 size={40} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        <div className="relative group">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-full flex flex-col items-center gap-1 z-20 shadow-xl border border-white/20 whitespace-nowrap animate-bounce">
             <div className="flex items-center gap-2">
                <Star size={14} className="animate-spin" /> 
                {isRTL ? 'اكتشف القوة الكامنة خلف الأرقام' : 'Discover the hidden power'}
             </div>
          </div>
          <button 
            onClick={onShowVisualExperience}
            className="w-full bg-[#0d1b33] border-4 border-blue-600 text-white font-black py-12 rounded-[3rem] flex items-center justify-center gap-4 text-3xl transition-all shadow-2xl active:scale-95">
            <LayoutDashboard size={40} />
            {isRTL ? 'تجربة بصرية' : 'VISUAL EXPERIENCE'}
          </button>
        </div>
      </div>

      {/* زر العودة */}
      <div className="text-center pt-8">
        <button onClick={onReset} className="inline-flex items-center gap-2 text-slate-500 hover:text-white font-bold transition-colors">
          <RotateCcw size={20} />
          {isRTL ? 'فحص مشروع آخر' : 'Check another project'}
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
