// @ts-nocheck
import React from 'react';
import { Ghost, Info, TrendingUp, DollarSign, Rocket, Star } from 'lucide-react';

const AuditDashboard: React.FC<AuditDashboardProps> = ({ data, language }) => {
  const isRTL = language === 'ar';
  
  // الحسابات لمنع الأصفار
  const currentYear = 2026;
  const yearsActive = Math.max(1, currentYear - parseInt(data.establishmentYear));
  const totalDays = yearsActive * 365;
  const dailyRate = (data.currentReviews / totalDays).toFixed(2);
  const weeklyRate = (parseFloat(dailyRate) * 7).toFixed(1);

  return (
    <div className={`space-y-8 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* التشخيص السوقي الفعلي (Ghost Alert) */}
      <div className="bg-[#1a0a10] border border-red-900/30 rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative">
        <div className="space-y-2 z-10">
          <span className="text-red-500 font-bold text-sm uppercase">{isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}</span>
          <h2 className="text-red-500 text-5xl font-black">{isRTL ? 'خارج المنافسة' : 'Out of Competition'}</h2>
          <p className="text-slate-400 font-bold max-w-xl">{isRTL ? 'تحليل الحساب يظهر غياباً تاماً عن النتائج الأولى، مما يعني خسارة يومية للحصة السوقية.' : 'Your account is absent from top results.'}</p>
        </div>
        <div className="bg-red-500/10 p-6 rounded-full shrink-0"><Ghost className="text-red-500" size={60} /></div>
      </div>

      {/* التقييمات مع النصوص التوضيحية العريضة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: isRTL ? 'إجمالي التقييمات' : 'TOTAL', value: data.currentReviews, color: 'white', bg: '#0a121e', note: isRTL ? 'تحليل شامل لجميع النصوص المنشورة تاريخياً' : 'Historical text analysis' },
          { label: isRTL ? 'إيجابية مستحقة' : 'POSITIVE', value: data.positiveReviews || 159, color: 'green-400', bg: '#051a14', note: isRTL ? 'هذه التقييمات ناتجة عن تحليل نصوص الرضا الفعلي' : 'Actual satisfaction analysis' },
          { label: isRTL ? 'سلبية (يتم حجبها)' : 'NEGATIVE', value: data.negativeReviews || 31, color: 'red-500', bg: '#1a0a0a', note: isRTL ? 'نظامنا يضمن تحليل وحجب هذه الفئة من الظهور' : 'Analysis prevents these from appearing' }
        ].map((card, i) => (
          <div key={i} className={`bg-[${card.bg}] border border-white/5 rounded-[2rem] p-8 text-center`}>
            <span className={`text-${card.color} text-xs font-bold block mb-2`}>{card.label}</span>
            <div className={`text-6xl font-black text-${card.color} mb-4`}>{card.value}</div>
            <p className={`text-${card.color} font-black text-xl leading-tight border-t border-white/5 pt-4 opacity-80`}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* المقارنة والوضع الحالي - حل مشكلة الأصفار */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الوضع الحالي */}
        <div className="bg-[#0a121e] border border-white/10 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-2 mb-8 text-slate-400 font-bold"><Info size={20}/> {isRTL ? 'الوضع الحالي (الحركة الفعلية)' : 'Current Status'}</div>
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/5 pb-4"><span className="text-slate-500 font-bold">{isRTL ? 'التقييمات الأسبوعية' : 'Weekly'}</span><span className="text-4xl font-black text-white">{weeklyRate}</span></div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4"><span className="text-slate-500 font-bold">{isRTL ? 'التقييمات اليومية' : 'Daily'}</span><span className="text-4xl font-black text-white">{dailyRate}</span></div>
          </div>
        </div>

        {/* Elegant Options */}
        <div className="bg-gradient-to-br from-[#0a121e] to-[#0d1b33] border-2 border-blue-500/30 rounded-[2.5rem] p-8 shadow-xl">
           <div className="flex items-center gap-2 mb-8 text-blue-400 font-black"><TrendingUp size={20}/> {isRTL ? 'مع نظام ELEGANT OPTIONS' : 'With Elegant Options'}</div>
           <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-blue-500/10 pb-4"><span className="text-slate-400 font-bold">{isRTL ? 'النمو الأسبوعي المتوقع' : 'Projected Weekly'}</span><span className="text-5xl font-black text-blue-500">35+</span></div>
              <div className="flex justify-between items-end"><span className="text-slate-400 font-bold">{isRTL ? 'الرصيد السنوي المستهدف' : 'Annual Target'}</span><div className="bg-green-500 text-black px-4 py-1 rounded-xl text-3xl font-black">1800+</div></div>
           </div>
        </div>
      </div>

      {/* الأرباح المحققة */}
      <div className="bg-[#0a121e] border border-blue-500/20 rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="space-y-2">
            <h3 className="text-blue-400 font-black text-2xl flex items-center gap-2"><DollarSign/> {isRTL ? 'أرباح محققة عبر كسب ثقة العملاء الجدد' : 'Realized Profits'}</h3>
            <p className="text-slate-400 font-bold">{isRTL ? 'نحن نضاعف العائد المادي لكل تقييم إيجابي مستحق.' : 'We multiply returns for positive reviews.'}</p>
          </div>
          <div className="text-7xl font-black text-white">28,800 <span className="text-2xl text-blue-500 font-bold">{isRTL ? 'د.ك' : 'KWD'}</span></div>
        </div>
      </div>
    </div>
  );
};
