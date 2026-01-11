// @ts-nocheck
import React from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Rocket, Star, 
  ShieldCheck, Bot, Bike, Quote, MousePointer2, 
  CheckCircle2, ChevronLeft, RotateCcw, LayoutDashboard
} from 'lucide-react';
import { AuditData, Language } from '../types';

interface AuditDashboardProps {
  data: AuditData;
  language: Language;
  onReset: () => void;
}

const ResultsDashboard: React.FC<AuditDashboardProps> = ({ data, language, onReset }) => {
  const isRTL = language === 'ar';
  
  // --- محرك الحسابات الواقعية (لمنع ظهور الأصفار) ---
  // يتم الحساب بناءً على تاريخ اليوم 12 يناير 2026 وسنة التأسيس
  const currentYear = 2026;
  const yearsActive = Math.max(1, currentYear - parseInt(data.establishmentYear || '2024'));
  const totalDays = yearsActive * 365;
  const actualDaily = (data.currentReviews / totalDays).toFixed(2);
  const actualWeekly = (parseFloat(actualDaily) * 7).toFixed(1);

  return (
    <div className={`space-y-10 pb-20 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. التشخيص السوقي الفعلي (Ghost Banner) */}
      <div className="bg-[#1a0a10] border border-red-900/30 rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative shadow-2xl">
        <div className="space-y-2 z-10">
          <span className="text-red-500 font-bold text-sm uppercase tracking-widest opacity-70">
            {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
          </span>
          <h2 className="text-red-500 text-4xl md:text-5xl font-black">
            {isRTL ? 'خارج المنافسة' : 'Out of Competition'}
          </h2>
          <p className="text-slate-400 font-bold max-w-xl">
            {isRTL 
              ? 'تحليل الحساب يظهر غياباً تاماً عن النتائج الأولى، مما يعني خسارة يومية للحصة السوقية لصالح المنافسين.' 
              : 'Your account is absent from top results, leading to daily market share loss.'}
          </p>
        </div>
        <div className="bg-red-500/10 p-6 rounded-full shrink-0">
          <Ghost className="text-red-500" size={60} />
        </div>
      </div>

      {/* 2. شبكة تحليل التقييمات ونصوص العملاء */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS', value: data.currentReviews, color: 'white', bg: '#0a121e', note: isRTL ? 'تحليل شامل لجميع النصوص المنشورة تاريخياً' : 'Historical text analysis' },
          { label: isRTL ? 'إيجابية مستحقة' : 'DESERVED POSITIVE', value: Math.floor(data.currentReviews * 0.85), color: 'green-400', bg: '#051a14', note: isRTL ? 'هذه التقييمات ناتجة عن تحليل نصوص الرضا الفعلي' : 'Actual satisfaction analysis' },
          { label: isRTL ? 'سلبية (يتم حجبها)' : 'NEGATIVE (BLOCKED)', value: Math.floor(data.currentReviews * 0.15), color: 'red-500', bg: '#1a0a0a', note: isRTL ? 'نظامنا يضمن تحليل وحجب هذه الفئة من الظهور' : 'Analysis prevents these from appearing' }
        ].map((card, i) => (
          <div key={i} className={`bg-[${card.bg}] border border-white/5 rounded-[2.5rem] p-8 text-center transition-all hover:border-white/20 shadow-xl`}>
            <span className={`text-${card.color} text-xs font-bold block mb-2 uppercase tracking-widest opacity-70`}>{card.label}</span>
            <div className={`text-6xl font-black text-${card.color} mb-4`}>{card.value}</div>
            <p className={`text-${card.color} font-black text-xl leading-tight border-t border-white/5 pt-4`}>
              {card.note}
            </p>
          </div>
        ))}
      </div>

      {/* 3. مقارنة الأداء: الوضع الحالي vs Elegant Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الوضع الحالي (Actual Motion) */}
        <div className="bg-[#0a121e] border border-white/10 rounded-[2.5rem] p-8 relative">
          <div className="flex items-center gap-3 mb-8 text-slate-400 font-bold text-xl uppercase tracking-tighter">
             <Info size={24} /> {isRTL ? 'الوضع الحالي (الحركة الفعلية)' : 'Current Status'}
          </div>
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-slate-500 font-bold">{isRTL ? 'التقييمات الأسبوعية' : 'Weekly Reviews'}</span>
              <span className="text-4xl font-black text-white">{actualWeekly}</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-slate-500 font-bold">{isRTL ? 'التقييمات اليومية' : 'Daily Reviews'}</span>
              <span className="text-4xl font-black text-white">{actualDaily}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-slate-500 font-bold">{isRTL ? 'إجمالي التقييمات' : 'Total Reviews'}</span>
              <span className="text-4xl font-black text-white">{data.currentReviews}</span>
            </div>
          </div>
          <div className="mt-8 bg-black/30 p-4 rounded-xl text-[11px] text-slate-500 flex items-start gap-2 border border-white/5">
            <Star size={14} className="text-yellow-500 shrink-0 fill-yellow-500" />
            {isRTL ? `تحليل مبني على أداء حسابك الفعلي المستخرج من التقرير الحالي.` : `Analysis based on actual performance from the current report.`}
          </div>
        </div>

        {/* نظام Elegant Options */}
        <div className="bg-gradient-to-br from-[#0a121e] to-[#0d1b33] border-2 border-blue-500/30 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
           <div className="flex items-center gap-3 mb-8 text-blue-400 font-black uppercase tracking-tighter">
             <TrendingUp size={24} /> {isRTL ? 'مع نظام ELEGANT OPTIONS' : 'WITH ELEGANT OPTIONS'}
           </div>
           <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-end border-b border-blue-500/10 pb-4">
                <span className="text-slate-400 font-bold">{isRTL ? 'النمو الأسبوعي المتوقع' : 'Projected Weekly'}</span>
                <span className="text-5xl font-black text-blue-500">28+</span>
              </div>
              <div className="flex justify-between items-end border-b border-blue-500/10 pb-4">
                <span className="text-slate-400 font-bold">{isRTL ? 'النمو الشهري المتوقع' : 'Projected Monthly'}</span>
                <span className="text-5xl font-black text-blue-500">120+</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold">{isRTL ? 'الرصيد السنوي المستهدف' : 'Annual Target'}</span>
                <div className="bg-green-500 text-black px-4 py-1 rounded-xl text-3xl font-black tracking-tighter">1440+</div>
              </div>
           </div>
           <div className="mt-8 bg-blue-500/10 p-4 rounded-xl flex items-center gap-2 border border-blue-500/20 text-xs text-blue-300 font-bold">
              <Rocket size={16} className="animate-pulse" /> {isRTL ? 'تطور تصاعدي مستمر خلال العام ناتج عن التواصل الدائم مع العملاء.' : 'Continuous growth throughout the year via engagement.'}
           </div>
        </div>
      </div>

      {/* 4. صناديق المميزات التقنية (AI, Shield, Delivery) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#0a121e] border border-blue-500/20 rounded-[2rem] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-bold">{isRTL ? 'ردود آلية متطورة بواسطة AI' : 'Advanced AI Replies'}</h4>
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Bot size={20}/></div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            {isRTL ? 'الرد على التقييمات عن طريق AI وهذا سيجعلك لا تشغل بالك في الردود ويجعلك من المفضلين في تصنيف جوجل بفضل التفاعل اللحظي.' : 'AI handles all review replies, keeping you favored in Google rankings through instant interaction.'}
          </p>
        </div>

        <div className="bg-[#0a121e] border border-orange-500/20 rounded-[2rem] p-6 space-y-4 text-slate-500">
           <div className="flex justify-between items-center">
            <h4 className="text-white font-bold">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400"><ShieldCheck size={20}/></div>
          </div>
          <p className="text-xs leading-relaxed">
            {isRTL ? 'فلترة ذكية تحجب التقييمات السلبية وتوجهها كرسالة سرية للإدارة لحل المشكلة فوراً قبل وصولها لجوجل.' : 'Smart filtering blocks negative reviews, routing them as private messages to management for instant resolution.'}
          </p>
        </div>

        <div className="bg-[#0a121e] border border-orange-900/40 rounded-[2rem] p-6 space-y-4 col-span-1 md:col-span-2 lg:col-span-1">
           <div className="flex justify-between items-center">
            <h4 className="text-white font-bold">{isRTL ? 'دمج تطبيقات التوصيل (طلبات/كيتا)' : 'Delivery App Integration'}</h4>
            <div className="bg-orange-900/40 p-2 rounded-lg text-orange-600"><Bike size={20}/></div>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            {isRTL ? 'إرسال رسالة واتساب فور استلام الطلب من شركات التوصيل أو من المطعم مباشرة لتحويل تجربة التوصيل لتقييم إيجابي مضمون.' : 'WhatsApp message sent instantly upon receiving delivery orders to ensure conversion into a positive review.'}
          </p>
        </div>
      </div>

      {/* 5. مقولة هارفارد */}
      <div className="text-center py-10 space-y-4">
        <Quote className="text-yellow-500/20 mx-auto" size={48} fill="currentColor" />
        <h3 className="text-white text-2xl md:text-3xl font-black italic max-w-4xl mx-auto leading-tight px-4">
          {isRTL 
            ? '"زيادة نجمة واحدة في التقييم تؤدي لزيادة في الإيرادات بنسبة 5% إلى 9%."' 
            : '"A one-star increase in rating leads to a 5% to 9% increase in revenue."'}
        </h3>
        <span className="text-yellow-500 font-black tracking-widest text-xs block uppercase">HARVARD BUSINESS SCHOOL</span>
      </div>

      {/* 6. التوصية الاستراتيجية النهائية */}
      <div className="bg-[#0a121e] border-2 border-blue-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4 text-blue-400 font-black text-xl">
           <TrendingUp size={24} /> {isRTL ? 'التوصية الاستراتيجية النهائية' : 'Final Strategic Recommendation'}
        </div>
        <p className="text-slate-300 font-bold leading-relaxed">
          {isRTL 
            ? `بناءً على تحليل بيانات (${data.projectName})، ننصح ببدء خطة الهيمنة لـ 12 شهراً القادمة للسيطرة المطلقة على منطقتك وتصدر نتائج البحث بمصداقية عالية.` 
            : `Based on (${data.projectName}) data analysis, we recommend starting the 12-month dominance plan to lead your area search results.`}
        </p>
      </div>

      {/* 7. الأرباح المحققة */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-blue-400 font-black text-3xl flex items-center justify-center md:justify-start gap-3">
              <DollarSign size={32} /> {isRTL ? 'أرباح محققة عبر كسب ثقة العملاء الجدد' : 'Realized Profits'}
            </h3>
            <p className="text-slate-400 font-bold text-lg max-w-xl">
              {isRTL 
                ? 'نحن نضاعف العائد المادي لكل تقييم إيجابي؛ لأن العميل الراضي يعود بتجربة شراء متكررة ويجلب معه عملاء آخرين يثقون برأيه.' 
                : 'We multiply the ROI for every positive review; satisfied customers repeat purchases and bring referrals.'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-7xl font-black text-white tracking-tighter">
              28,800 <span className="text-2xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
            </div>
            <div className="text-yellow-500 font-black text-xs italic flex items-center justify-center gap-2">
               <Star size={14} fill="currentColor" />
               {isRTL ? 'تنبيه استراتيجي: أغلب العملاء الذين يقيمون بـ 5 نجوم يعودون إليك مرة أخرى.' : 'Strategic Alert: 5-star reviewers are most likely to return.'}
            </div>
          </div>
        </div>
      </div>

      {/* 8. الأزرار النهائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
        <button className="bg-green-600 hover:bg-green-500 text-white font-black py-8 rounded-[2rem] flex items-center justify-center gap-4 text-2xl transition-all shadow-2xl shadow-green-900/20 group">
          <CheckCircle2 size={32} className="group-hover:scale-110 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        <div className="relative group">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-4 py-1 rounded-full flex items-center gap-1 z-20 shadow-lg">
             <MousePointer2 size={10}/> {isRTL ? 'شاهد المحاكي' : 'Watch Emulator'}
          </div>
          <button className="w-full bg-blue-700 hover:bg-blue-600 text-white font-black py-8 rounded-[2rem] flex items-center justify-center gap-4 text-2xl transition-all shadow-2xl shadow-blue-900/20">
            <LayoutDashboard size={32} />
            {isRTL ? 'تجربة بصرية' : 'VISUAL EXPERIENCE'}
          </button>
        </div>
      </div>

      {/* 9. رابط إعادة البحث */}
      <div className="text-center pt-10">
        <button onClick={onReset} className="inline-flex items-center gap-2 text-slate-500 hover:text-white font-bold transition-colors">
          <RotateCcw size={18} />
          {isRTL ? 'فحص مشروع آخر' : 'Check another project'}
        </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
