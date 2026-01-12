// @ts-nocheck
import React from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Star, 
  ShieldCheck, Bot, Bike, Quote, 
  CheckCircle2, RotateCcw, LayoutDashboard
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
  
  // إعدادات الواتساب الجديدة
  const whatsappNumber = "96566305551";
  const whatsappMsg = encodeURIComponent("مهتم لطلب نظام لمشروعي");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  const currentYear = 2026; 
  const yearsActive = Math.max(1, currentYear - parseInt(data.establishmentYear || '2024'));
  const totalDays = yearsActive * 365;
  const actualDaily = (data.currentReviews / totalDays).toFixed(2);
  const actualWeekly = (parseFloat(actualDaily) * 7).toFixed(1);

  return (
    <div className={`space-y-16 pb-24 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. التشخيص السوقي الفعلي */}
      <div className="bg-gradient-to-r from-[#1a0a10] to-[#2d0f16] border border-red-900/40 rounded-[3rem] p-10 flex items-center justify-between relative shadow-2xl">
        <div className="space-y-4 z-10">
          <span className="text-red-500 font-bold text-base uppercase tracking-[0.3em] opacity-80">
            {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
          </span>
          <h2 className="text-red-500 text-5xl md:text-6xl font-black italic">
            {isRTL ? 'خارج المنافسة' : 'Out of Competition'}
          </h2>
          <p className="text-slate-300 font-bold text-xl max-w-2xl leading-relaxed">
            {isRTL 
              ? 'تحليل الحساب يظهر فجوة رقمية حرجة تؤدي لخسارة يومية في حصتك السوقية لصالح المنافسين الأكثر تفاعلاً.' 
              : 'Your account analysis shows a critical digital gap leading to daily market share loss.'}
          </p>
        </div>
        <div className="bg-red-500/10 p-8 rounded-full hidden md:block animate-pulse">
          <Ghost className="text-red-500" size={80} />
        </div>
      </div>

      {/* 2. الأقسام الثلاثة المحدثة (تصميم أنيق وكبير) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ردود آلية AI */}
        <div className="bg-[#0a121e] border-2 border-blue-500/20 rounded-[3rem] p-12 space-y-6 hover:border-blue-500/60 transition-all group relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="bg-blue-500/10 p-5 rounded-3xl text-blue-400 group-hover:scale-110 transition-transform">
              <Bot size={44}/>
            </div>
            <div className="text-blue-500/20 font-black text-7xl select-none">01</div>
          </div>
          <h4 className="text-white font-black text-3xl leading-tight">
            {isRTL ? 'ردود آلية متطورة بواسطة AI' : 'Advanced AI Replies'}
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed">
            {isRTL 
              ? 'الرد اللحظي الذكي الذي يرفع تصنيفك في جوجل بنسبة 40%[cite: 74, 80]. نحن لا نرد فقط، نحن نبني علاقة ولاء فورية مع كل عميل يترك أثراً.' 
              : 'Smart instant replies that boost Google ranking by 40% while building immediate customer loyalty.'}
          </p>
        </div>

        {/* درع حماية السمعة */}
        <div className="bg-[#0a121e] border-2 border-orange-500/20 rounded-[3rem] p-12 space-y-6 hover:border-orange-500/60 transition-all group relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="bg-orange-500/10 p-5 rounded-3xl text-orange-400 group-hover:scale-110 transition-transform">
              <ShieldCheck size={44}/>
            </div>
            <div className="text-orange-500/20 font-black text-7xl select-none">02</div>
          </div>
          <h4 className="text-white font-black text-3xl leading-tight">
            {isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed">
            {isRTL 
              ? 'نظام فلترة ذكي (نظام شعلة) يعالج الاستياء سراً عبر الواتساب قبل أن يتحول لتقييم علني يشوه صورتك.' 
              : 'Smart filtering (Shoala System) that resolves dissatisfaction privately via WhatsApp before it hits your public reputation.'}
          </p>
        </div>

        {/* دمج تطبيقات التوصيل */}
        <div className="bg-[#0a121e] border-2 border-red-500/20 rounded-[3rem] p-12 space-y-6 hover:border-red-500/60 transition-all group relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="bg-red-500/10 p-5 rounded-3xl text-red-500 group-hover:scale-110 transition-transform">
              <Bike size={44}/>
            </div>
            <div className="text-red-500/20 font-black text-7xl select-none">03</div>
          </div>
          <h4 className="text-white font-black text-3xl leading-tight">
            {isRTL ? 'أتمتة تطبيقات التوصيل' : 'Delivery Automation'}
          </h4>
          <p className="text-slate-400 text-lg leading-relaxed">
            {isRTL 
              ? 'ربط مباشر مع (طلبات/كيتا) لتحويل كل طلب ناجح إلى تقييم إيجابي تلقائي. ضاعف أرقامك دون جهد بشري.' 
              : 'Direct integration with Talabat/Kita to convert every order into a positive review automatically.'}
          </p>
        </div>
      </div>

      {/* 3. الأرباح السنوية المحققة */}
      <div className="bg-gradient-to-br from-[#0a121e] to-[#0d1b33] border-2 border-blue-500/30 rounded-[4rem] p-16 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)]">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
          <div className="space-y-6 text-center lg:text-right">
            <h3 className="text-blue-400 font-black text-5xl flex items-center justify-center lg:justify-start gap-5">
              <DollarSign size={54} /> {isRTL ? 'أرباح نظرية الولاء السنوية' : 'Annual Loyalty ROI'}
            </h3>
            <p className="text-slate-400 font-bold text-2xl max-w-2xl leading-relaxed">
              {isRTL 
                ? 'هذه المبالغ تمثل العائد المادي السنوي المحتمل من خلال الحفاظ على العملاء الحاليين وجذب عملاء جدد عبر الثقة الرقمية المطلقة[cite: 121, 125].' 
                : 'Potential annual revenue generated by maximizing customer retention and digital trust.'}
            </p>
          </div>
          <div className="bg-blue-500/5 p-10 rounded-[3rem] border border-blue-500/20">
            <div className="text-9xl font-black text-white tracking-tighter animate-pulse">
              28,800 <span className="text-4xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. الأزرار النهائية (التجربة والطلب) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        {/* زر التجربة البصرية */}
        <div className="relative group">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-black px-8 py-3 rounded-full flex flex-col items-center gap-1 z-20 shadow-2xl border border-white/30 animate-bounce whitespace-nowrap">
             <div className="flex items-center gap-2 italic">
                <Star size={18} className="animate-spin" /> 
                {isRTL ? 'شاهد مستقبلك الرقمي الآن' : 'See your digital future'}
             </div>
          </div>
          <button 
            onClick={onShowVisualExperience}
            className="w-full bg-[#0d1b33] hover:bg-blue-800 border-4 border-blue-600/50 text-white font-black py-12 rounded-[3.5rem] flex items-center justify-center gap-6 text-4xl transition-all shadow-2xl active:scale-95 group">
            <LayoutDashboard size={48} className="group-hover:rotate-12 transition-transform" />
            {isRTL ? 'تجربة بصرية' : 'VISUAL EXPERIENCE'}
          </button>
        </div>

        {/* زر الطلب - موجه للواتساب بالرقم المطلوب */}
        <button 
          onClick={() => window.open(whatsappLink, '_blank')}
          className="bg-[#10b981] hover:bg-[#059669] text-white font-black py-12 rounded-[3.5rem] flex items-center justify-center gap-6 text-4xl transition-all shadow-2xl shadow-green-900/40 group active:scale-95">
          <CheckCircle2 size={48} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
      </div>

      {/* زر العودة */}
      <div className="text-center pt-10">
        <button onClick={onReset} className="inline-flex items-center gap-3 text-slate-500 hover:text-white font-bold text-xl transition-colors opacity-60 hover:opacity-100">
          <RotateCcw size={24} />
          {isRTL ? 'تحليل مشروع جديد' : 'Analyze new project'}
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
