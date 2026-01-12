// @ts-nocheck
import React from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Star, 
  ShieldCheck, Bot, Bike, Quote, 
  CheckCircle2, RotateCcw, LayoutDashboard, Target, Zap
} from 'lucide-react';
import { AuditData, Language } from '../types';

interface AuditDashboardProps {
  data: AuditData;
  language: Language;
  onReset: () => void;
  onShowVisualExperience: () => void; 
}

/**
 * ResultsDashboard component displays dynamic market diagnosis and competitive features based on
 * the provided audit data. It uses Tailwind CSS for styling and ensures that all formatting
 * specifications (e.g., rounded corners, padding) remain consistent with existing conventions.
 */
const ResultsDashboard: React.FC<AuditDashboardProps> = ({ data, language, onReset, onShowVisualExperience }) => {
  const isRTL = language === 'ar';
  
  // Generate market diagnosis status based on the number of reviews
  const getDiagnosis = () => {
    const reviews = data.currentReviews || 0;
    if (reviews < 50) {
      return {
        title: isRTL ? 'خارج المنافسة' : 'Out of Competition',
        color: 'text-red-500',
        bg: 'bg-[#1a0a10]',
        border: 'border-red-900/30',
        icon: <Ghost size={60} />
      };
    } else if (reviews < 200) {
      return {
        title: isRTL ? 'نمو غير مستغل' : 'Untapped Growth',
        color: 'text-orange-500',
        bg: 'bg-[#1a140a]',
        border: 'border-orange-900/30',
        icon: <Target size={60} />
      };
    } else {
      return {
        title: isRTL ? 'ريادة تحتاج أتمتة' : 'Leadership via Automation',
        color: 'text-blue-500',
        bg: 'bg-[#0a121e]',
        border: 'border-blue-900/30',
        icon: <Zap size={60} />
      };
    }
  };

  const status = getDiagnosis();

  // Create a dynamic WhatsApp link with encoded message
  const whatsappNumber = "96566305551";
  const message = isRTL 
    ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName})`
    : `Hello Elegant Options, I am interested in the system for my project (${data.projectName})`;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={`space-y-12 pb-24 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dynamic market diagnosis section */}
      <div className={`${status.bg} border ${status.border} rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative shadow-2xl`}>
        <div className="space-y-2 z-10">
          <span className={`${status.color} font-bold text-sm uppercase tracking-widest opacity-70`}>
            {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
          </span>
          <h2 className={`${status.color} text-4xl md:text-5xl font-black`}>
            {status.title}
          </h2>
          <p className="text-slate-400 font-bold max-w-xl">
            {isRTL 
              ? `تحليل الحساب يظهر وضعك الحالي بناءً على ${data.currentReviews} تقييم، مما يتطلب تدخلًا استراتيجيًا فوريًا.` 
              : `Analysis of ${data.currentReviews} reviews shows your current standing requires immediate strategic action.`}
          </p>
        </div>
        <div className={`${status.color} bg-current/10 p-6 rounded-full shrink-0`}>
          {status.icon}
        </div>
      </div>

      {/* Review analysis cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS', value: data.currentReviews, color: 'white', bg: '#0a121e' },
          { label: isRTL ? 'إيجابية مستحقة' : 'POSSITIVE', value: Math.floor(data.currentReviews * 0.85), color: 'green-400', bg: '#051a14' },
          { label: isRTL ? 'سلبية (تحت المعالجة)' : 'NEGATIVE', value: Math.floor(data.currentReviews * 0.15), color: 'red-500', bg: '#1a0a0a' }
        ].map((card, i) => (
          <div key={i} className={`bg-[${card.bg}] border border-white/5 rounded-[2.5rem] p-8 text-center shadow-xl`}>
            <span className={`text-${card.color} text-xs font-bold block mb-2 opacity-70`}>{card.label}</span>
            <div className={`text-6xl font-black text-${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Competitive features section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
        {/* AI Feature */}
        <div className="bg-[#0a121e] border border-blue-500/20 rounded-[3rem] p-10 space-y-6 hover:border-blue-500/50 transition-all shadow-2xl group">
          <div className="flex justify-between items-center">
            <h4 className="font-black text-2xl leading-tight">{isRTL ? 'ردود آلية ذكية بواسطة AI' : 'Smart AI Replies'}</h4>
            <div className="bg-blue-500/20 p-4 rounded-2xl text-blue-400"><Bot size={36}/></div>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed">
            ردود فورية تعزز ثقة العميل وترفع ترتيبك في جوجل بشكل آلي 24/7.
          </p>
        </div>

        {/* Reputation Shield Feature */}
        <div className="bg-[#0a121e] border border-orange-500/20 rounded-[3rem] p-10 space-y-6 hover:border-orange-500/50 transition-all shadow-2xl">
           <div className="flex justify-between items-center">
            <h4 className="font-black text-2xl leading-tight">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
            <div className="bg-orange-500/20 p-4 rounded-2xl text-orange-400"><ShieldCheck size={36}/></div>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed">
            نظام ذكي يكتشف الاستياء ويعالجه سراً قبل أن يتحول لتقييم علني سلبي.
          </p>
        </div>

        {/* Delivery Integration Feature: visible only for restaurants */}
        {data.businessType === 'restaurant' && (
          <div className="bg-[#0a121e] border border-red-500/20 rounded-[3rem] p-10 space-y-6 hover:border-red-500/50 transition-all shadow-2xl">
             <div className="flex justify-between items-center">
              <h4 className="font-black text-2xl leading-tight">{isRTL ? 'دمج تطبيقات التوصيل' : 'Delivery Integration'}</h4>
              <div className="bg-red-500/20 p-4 rounded-2xl text-red-500"><Bike size={36}/></div>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed">
              ربط مباشر مع (طلبات/كيتا) لتحويل كل طلب إلى تقييم إيجابي تلقائي.
            </p>
          </div>
        )}
      </div>

      {/* Annual profits section */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 z-10 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-blue-400 font-black text-4xl flex items-center justify-center md:justify-start gap-4">
              <DollarSign size={44} /> {isRTL ? 'أرباح نظرية الولاء السنوية' : 'Annual Loyalty ROI'}
            </h3>
            <p className="text-slate-400 font-bold text-xl max-w-xl">
              هذا المبلغ يمثل العائد المحقق عند تحويل العملاء لـ "مسوقين دائمين" عبر التقييمات الإيجابية المستمرة.
            </p>
          </div>
          <div className="text-8xl font-black text-white tracking-tighter">
            28,800 <span className="text-3xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
          </div>
        </div>
      </div>

      {/* Final action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <button 
          onClick={() => window.open(waLink, '_blank')}
          className="bg-green-600 hover:bg-green-500 text-white font-black py-10 rounded-[2.5rem] flex items-center justify-center gap-4 text-3xl transition-all shadow-2xl active:scale-95 group">
          <CheckCircle2 size={40} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        <div className="relative group">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-full flex flex-col items-center gap-1 z-20 shadow-xl border border-white/20 whitespace-nowrap animate-bounce">
             <div className="flex items-center gap-2">
                <Star size={14} className="animate-spin" /> {isRTL ? 'شاهد المحاكاة البصرية' : 'Watch Simulation'}
             </div>
          </div>
          <button 
            onClick={onShowVisualExperience}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-black py-10 rounded-[2.5rem] flex items-center justify-center gap-4 text-3xl transition-all shadow-2xl active:scale-95">
            <LayoutDashboard size={40} />
            {isRTL ? 'تجربة بصرية' : 'VISUAL EXPERIENCE'}
          </button>
        </div>
      </div>

      {/* Reset button */}
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
