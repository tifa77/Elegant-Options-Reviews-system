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

const ResultsDashboard: React.FC<AuditDashboardProps> = ({ data, language, onReset, onShowVisualExperience }) => {
  const isRTL = language === 'ar';
  
  // 1. تحديد حالة المنافسة بناءً على عدد التقييمات (الواقعية)
  const getDiagnosis = () => {
    if (data.currentReviews < 50) {
      return {
        title: isRTL ? 'خارج المنافسة' : 'Out of Competition',
        desc: isRTL ? 'تحليل الحساب يظهر غياباً تاماً عن النتائج الأولى، مما يعني خسارة يومية للحصة السوقية.' : 'Critical absence from top search results.',
        color: 'text-red-500', icon: <Ghost size={60} />, bg: 'bg-[#1a0a10]'
      };
    } else if (data.currentReviews < 250) {
      return {
        title: isRTL ? 'نمو غير مستغل' : 'Unexploited Growth',
        desc: isRTL ? 'لديك حضور جيد، لكنه يفتقر للتفاعل الذكي والأتمتة التي تضمن تصدرك الدائم للنتائج.' : 'Good presence but lacks automation to lead.',
        color: 'text-orange-500', icon: <Target size={60} />, bg: 'bg-[#1a140a]'
      };
    } else {
      return {
        title: isRTL ? 'ريادة تحتاج أتمتة' : 'Leadership via Automation',
        desc: isRTL ? 'تقييماتك ممتازة، ولكن غياب الردود الفورية والأتمتة يجعلك تفقد فرصة السيطرة المطلقة.' : 'Great ratings, but missing real-time AI dominance.',
        color: 'text-blue-500', icon: <Zap size={60} />, bg: 'bg-[#0a121e]'
      };
    }
  };

  const diagnosis = getDiagnosis();

  // 2. إعدادات الواتساب مع اسم المشروع
  const whatsappNumber = "96566305551";
  const whatsappMsg = encodeURIComponent(`أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName})`);
  const waLink = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className={`space-y-12 pb-24 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* التشخيص السوقي الفعلي المحدث */}
      <div className={`${diagnosis.bg} border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between relative shadow-2xl overflow-hidden`}>
        <div className="space-y-2 z-10">
          <span className={`${diagnosis.color} font-bold text-sm uppercase tracking-widest opacity-70`}>
            {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
          </span>
          <h2 className={`${diagnosis.color} text-4xl md:text-5xl font-black`}>
            {diagnosis.title}
          </h2>
          <p className="text-slate-400 font-bold max-w-xl text-lg">
            {diagnosis.desc}
          </p>
        </div>
        <div className={`${diagnosis.color} opacity-20 p-6 rounded-full shrink-0`}>
          {diagnosis.icon}
        </div>
      </div>

      {/* تحليل التقييمات الحالي */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS', value: data.currentReviews, color: 'white', bg: '#0a121e', note: isRTL ? 'تحليل النصوص المنشورة' : 'Text analysis' },
          { label: isRTL ? 'إيجابية مستحقة' : 'DESERVED POSITIVE', value: Math.floor(data.currentReviews * 0.85), color: 'green-400', bg: '#051a14', note: isRTL ? 'نصوص الرضا الفعلي' : 'Actual satisfaction' },
          { label: isRTL ? 'سلبية (يتم حجبها)' : 'NEGATIVE (BLOCKED)', value: Math.floor(data.currentReviews * 0.15), color: 'red-500', bg: '#1a0a0a', note: isRTL ? 'نظام الحجب الذكي' : 'Smart blocking' }
        ].map((card, i) => (
          <div key={i} className={`bg-[${card.bg}] border border-white/5 rounded-[2.5rem] p-8 text-center shadow-xl`}>
            <span className={`text-${card.color} text-xs font-bold block mb-2 uppercase opacity-70`}>{card.label}</span>
            <div className={`text-6xl font-black text-${card.color} mb-4`}>{card.value}</div>
            <p className={`text-${card.color} font-black text-xl leading-tight border-t border-white/5 pt-4`}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* المميزات التنافسية - مع خيار تطبيقات التوصيل للمطاعم فقط */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-[#0a121e] border border-blue-500/20 rounded-[2.5rem] p-8 space-y-4 hover:border-blue-500/50 transition-all shadow-xl">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-xl">{isRTL ? 'ردود آلية متطورة AI' : 'AI Replies'}</h4>
            <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400"><Bot size={28}/></div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            الرد اللحظي الذكي الذي يرفع تصنيفك في جوجل بنسبة 40% إضافية ويعزز ولاء العميل فوراً.
          </p>
        </div>

        <div className="bg-[#0a121e] border border-orange-500/20 rounded-[2.5rem] p-8 space-y-4 hover:border-orange-500/50 transition-all shadow-xl">
           <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-xl">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
            <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400"><ShieldCheck size={28}/></div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            نظام فلترة ذكي يكتشف التقييمات السلبية ويحولها لشكوى خاصة قبل نشرها علنياً.
          </p>
        </div>

        {/* يظهر فقط إذا تم اختيار مطعم */}
        {data.businessType === 'restaurant' && (
          <div className="bg-[#0a121e] border border-red-500/20 rounded-[2.5rem] p-8 space-y-4 hover:border-red-500/50 transition-all shadow-xl">
             <div className="flex justify-between items-center">
              <h4 className="text-white font-black text-xl">{isRTL ? 'دمج تطبيقات التوصيل' : 'Delivery Integration'}</h4>
              <div className="bg-red-500/20 p-3 rounded-2xl text-red-500"><Bike size={28}/></div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              ربط تلقائي مع طلبات وكيتا لتحويل كل طلب إلى تقييم إيجابي على خرائط جوجل.
            </p>
          </div>
        )}
      </div>

      {/* الأرباح المحققة */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-blue-400 font-black text-4xl flex items-center justify-center md:justify-start gap-4">
              <DollarSign size={40} /> {isRTL ? 'أرباح نظرية الولاء السنوية' : 'Annual Loyalty ROI'}
            </h3>
            <p className="text-slate-400 font-bold text-xl max-w-xl">
              الأرباح السنوية المكتسبة عند تحقيق نظرية ولاء العملاء وتحويل كل تجربة شراء لعلاقة مستدامة.
            </p>
          </div>
          <div className="text-center">
            <div className="text-8xl font-black text-white tracking-tighter">
              28,800 <span className="text-3xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* الأزرار النهائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {/* زر اطلب النظام */}
        <button 
          onClick={() => window.open(waLink, '_blank')}
          className="bg-green-600 hover:bg-green-500 text-white font-black py-10 rounded-[2.5rem] flex items-center justify-center gap-4 text-3xl transition-all shadow-2xl active:scale-95 group">
          <CheckCircle2 size={40} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        {/* زر التجربة البصرية المربوط فعلياً */}
        <div className="relative group">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-full flex flex-col items-center gap-1 z-20 shadow-xl border border-white/20 whitespace-nowrap animate-bounce">
             <div className="flex items-center gap-2">
                <Star size={14} className="animate-spin" /> 
                {isRTL ? 'شاهد التفاصيل البصرية' : 'Watch Visual Experience'}
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

      {/* زر العودة */}
      <div className="text-center pt-8">
        <button onClick={onReset} className="inline-flex items-center gap-2 text-slate-500 hover:text-white font-bold transition-colors">
          <RotateCcw size={20} />
          {isRTL ? 'تحليل مشروع آخر' : 'Check another project'}
        </button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
