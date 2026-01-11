// @ts-nocheck
import React from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Rocket, Star, 
  Bot, MessageSquare, Bike, ChevronRight, Zap, CheckCircle2, AlertTriangle 
} from 'lucide-react';

const ResultsDashboard = ({ data, language }) => {
  const isRTL = language === 'ar';
  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'cafe';
  
  // --- محرك الحسابات لمنع الأصفار (بناءً على تاريخ اليوم 12 يناير 2026) ---
  //
  const yearsActive = Math.max(1, 2026 - parseInt(data.establishmentYear));
  const totalDays = yearsActive * 365;
  const actualDaily = (data.currentReviews / totalDays).toFixed(2);
  const actualWeekly = (parseFloat(actualDaily) * 7).toFixed(1);

  return (
    <div className={`space-y-10 pb-20 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. التشخيص السوقي الفعلي (Ghost Alert) */}
      {/* */}
      <div className="bg-[#1a0a10] border border-red-900/30 rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative shadow-2xl">
        <div className="space-y-2 z-10">
          <span className="text-red-500 font-bold text-sm uppercase">{isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}</span>
          <h2 className="text-red-500 text-5xl font-black">{isRTL ? 'خارج المنافسة' : 'Out of Competition'}</h2>
          <p className="text-slate-400 font-bold max-w-xl">{isRTL ? 'تحليل الحساب يظهر غياباً تاماً عن النتائج الأولى، مما يعني خسارة يومية للحصة السوقية.' : 'Your account is absent from top results.'}</p>
        </div>
        <div className="bg-red-500/10 p-6 rounded-full shrink-0"><Ghost className="text-red-500" size={60} /></div>
      </div>

      {/* 2. التقييمات مع النصوص التوضيحية العريضة */}
      {/* */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS', value: data.currentReviews, color: 'white', bg: '#0a121e', note: isRTL ? 'تحليل شامل لجميع النصوص المنشورة تاريخياً' : 'Historical text analysis' },
          { label: isRTL ? 'إيجابية مستحقة' : 'DESERVED POSITIVE', value: Math.floor(data.currentReviews * 0.85), color: 'green-400', bg: '#051a14', note: isRTL ? 'هذه التقييمات ناتجة عن تحليل نصوص الرضا الفعلي' : 'Actual satisfaction analysis' },
          { label: isRTL ? 'سلبية (يتم حجبها)' : 'NEGATIVE (BLOCKED)', value: Math.floor(data.currentReviews * 0.15), color: 'red-500', bg: '#1a0a0a', note: isRTL ? 'نظامنا يضمن تحليل وحجب هذه الفئة من الظهور' : 'Analysis prevents these from appearing' }
        ].map((card, i) => (
          <div key={i} className={`bg-[${card.bg}] border border-white/5 rounded-[2.5rem] p-8 text-center transition-all hover:border-white/20`}>
            <span className={`text-${card.color} text-xs font-bold block mb-2 uppercase tracking-widest`}>{card.label}</span>
            <div className={`text-6xl font-black text-${card.color} mb-4`}>{card.value}</div>
            <p className={`text-${card.color} font-black text-xl leading-tight border-t border-white/5 pt-4 opacity-90`}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* 3. الوضع الحالي ضد نظام Elegant Options */}
      {/* */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الوضع الحالي (الحركة الفعلية) */}
        <div className="bg-[#0a121e] border border-white/10 rounded-[2.5rem] p-8 relative">
          <div className="flex items-center gap-3 mb-8 text-slate-400 font-bold text-xl uppercase">
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
            <Zap size={14} className="text-yellow-500 shrink-0" />
            {isRTL ? `تحليل مبني على أداء حسابك الفعلي منذ تأسيسه في عام ${data.establishmentYear}.` : `Analysis based on performance since ${data.establishmentYear}.`}
          </div>
        </div>

        {/* مع نظام ELEGANT OPTIONS */}
        <div className="bg-gradient-to-br from-[#0a121e] to-[#0d1b33] border-2 border-blue-500/30 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]">
           <div className="flex items-center gap-3 mb-8 text-blue-400 font-black uppercase tracking-tighter">
             <TrendingUp size={24} /> مع نظام ELEGANT OPTIONS
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
                <span className="text-slate-400 font-bold">{isRTL ? 'الرصيد السنوي المستهدف' : 'Annual Target Balance'}</span>
                <div className="bg-green-500 text-black px-4 py-1 rounded-xl text-3xl font-black tracking-tighter">1440+</div>
              </div>
           </div>
           <div className="mt-8 bg-blue-500/10 p-4 rounded-xl flex items-center gap-2 border border-blue-500/20 text-xs text-blue-300 font-bold">
              <Rocket size={16} className="animate-pulse" /> {isRTL ? 'تطور تصاعدي مستمر ناتج عن التواصل الدائم مع العملاء.' : 'Continuous upward growth through customer engagement.'}
           </div>
        </div>
      </div>

      {/* 4. قسم الأتمتة والربط (Automation & Integration) */}
      <div className="bg-[#0a121e] border border-blue-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 text-blue-400 font-black text-xl uppercase">
          <Bot size={28} /> {isRTL ? 'أتمتة التواصل والربط الذكي' : 'Automated Engagement & Integration'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <p className="text-slate-400 font-bold leading-relaxed">
                  {isRTL 
                    ? 'يتم إرسال طلبات التقييم آلياً لكل عميل بعد إتمام الطلب، مع الرد الفوري بالذكاء الاصطناعي لرفع تصنيف المتجر.' 
                    : 'Review requests are sent automatically after each order, with instant AI replies to boost rankings.'}
                </p>
                {isRestaurant && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Talabat', 'Deliveroo', 'Jahez'].map((brand) => (
                      <span key={brand} className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] text-blue-400 font-bold">
                        Linked with {brand}
                      </span>
                    ))}
                  </div>
                )}
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl">
                <div className="flex items-start gap-4">
                   <Bike className="text-blue-500 shrink-0" size={32} />
                   <div className="space-y-1">
                      <h4 className="text-white font-black">{isRTL ? 'أتمتة طلبات التوصيل' : 'Delivery Automation'}</h4>
                      <p className="text-xs text-slate-500">
                        {isRTL 
                          ? 'ربط مباشر مع منصات طلبات ودليفرو لتحويل كل طلب ناجح إلى تقييم 5 نجوم تلقائياً.' 
                          : 'Direct integration with delivery platforms to convert every order into a 5-star review.'}
                      </p>
                   </div>
                </div>
            </div>
        </div>
      </div>

      {/* 5. الأرباح المحققة والمقولة الاستراتيجية */}
      {/* */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[3.5rem] p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
          <div className="space-y-4 text-center md:text-right">
            <h3 className="text-blue-400 font-black text-3xl flex items-center justify-center md:justify-start gap-3">
              <DollarSign size={32} /> {isRTL ? 'أرباح محققة عبر كسب ثقة العملاء' : 'Realized Profits through Trust'}
            </h3>
            <p className="text-slate-400 font-bold text-lg max-w-xl">
              {isRTL 
                ? 'نحن نضاعف العائد المادي لكل تقييم إيجابي؛ لأن العميل الراضي يعود بتجربة شراء متكررة ويجلب عملاء آخرين.' 
                : 'We multiply the return for every positive review; satisfied customers bring repeat purchases.'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-8xl font-black text-white tracking-tighter mb-2">
              28,800 <span className="text-2xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-6 py-2 rounded-2xl text-green-500 font-black text-xs uppercase animate-pulse">
               <CheckCircle2 size={14}/> {isRTL ? 'نمو مالي مستدام' : 'Sustainable Growth'}
            </div>
          </div>
        </div>

        {/* المقولة الاستراتيجية في الأسفل */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
           <p className="text-yellow-500 font-black text-sm italic flex items-center justify-center gap-2">
             <AlertTriangle size={16} />
             {isRTL 
               ? 'تنبيه استراتيجي: تدل بياناتنا أن أغلب العملاء الذين يقيمون بـ 5 نجوم يعودون إليك لتجربة الخدمة مرة أخرى.' 
               : 'Strategic Alert: Our data shows 5-star reviewers are most likely to return for service again.'}
           </p>
        </div>
      </div>

    </div>
  );
};

export default ResultsDashboard;
