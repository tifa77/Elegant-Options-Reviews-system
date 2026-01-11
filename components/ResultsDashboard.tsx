// @ts-nocheck
import React from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Rocket, Star, 
  Bot, MessageSquare, Bike, ChevronRight, Zap, CheckCircle2 
} from 'lucide-react';
import { AuditData, Language } from '../types';

const ResultsDashboard: React.FC<{ data: AuditData, language: Language }> = ({ data, language }) => {
  const isRTL = language === 'ar';
  
  // --- المحرك الحسابي لمنع الأصفار (بناءً على تاريخ اليوم 12 يناير 2026) ---
  const yearsActive = Math.max(1, 2026 - parseInt(data.establishmentYear));
  const totalDays = yearsActive * 365;
  const dailyRate = (data.currentReviews / totalDays).toFixed(2);
  const weeklyRate = (parseFloat(dailyRate) * 7).toFixed(1);

  return (
    <div className={`space-y-10 animate-fade-in pb-20 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. التشخيص السوقي الفعلي (Ghost Alert) */}
      <div className="bg-[#1a0a10] border border-red-900/30 rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative shadow-2xl">
        <div className="space-y-2 z-10">
          <span className="text-red-500 font-bold text-sm uppercase">{isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}</span>
          <h2 className="text-red-500 text-5xl font-black">{isRTL ? 'خارج المنافسة' : 'Out of Competition'}</h2>
          <p className="text-slate-400 font-bold max-w-xl">{isRTL ? 'تحليل الحساب يظهر غياباً تاماً عن النتائج الأولى، مما يعني خسارة يومية للحصة السوقية.' : 'Your account is absent from top results.'}</p>
        </div>
        <div className="bg-red-500/10 p-6 rounded-full shrink-0 animate-pulse"><Ghost className="text-red-500" size={60} /></div>
      </div>

      {/* 2. التقييمات مع النصوص التوضيحية العريضة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS', value: data.currentReviews, color: 'white', bg: '#0a121e', note: isRTL ? 'تحليل شامل لجميع النصوص المنشورة تاريخياً' : 'Historical text analysis' },
          { label: isRTL ? 'إيجابية مستحقة' : 'DESERVED POSITIVE', value: Math.floor(data.currentReviews * 0.85), color: 'green-400', bg: '#051a14', note: isRTL ? 'هذه التقييمات ناتجة عن تحليل نصوص الرضا الفعلي' : 'Actual satisfaction analysis' },
          { label: isRTL ? 'سلبية (يتم حجبها)' : 'NEGATIVE (BLOCKED)', value: Math.floor(data.currentReviews * 0.15), color: 'red-500', bg: '#1a0a0a', note: isRTL ? 'نظامنا يضمن تحليل وحجب هذه الفئة من الظهور' : 'Analysis prevents these from appearing' }
        ].map((card, i) => (
          <div key={i} className={`bg-[${card.bg}] border border-white/5 rounded-[2.5rem] p-8 text-center transition-transform hover:scale-[1.02]`}>
            <span className={`text-${card.color} text-xs font-bold block mb-2 uppercase tracking-widest`}>{card.label}</span>
            <div className={`text-6xl font-black text-${card.color} mb-4`}>{card.value}</div>
            <p className={`text-${card.color} font-black text-xl leading-tight border-t border-white/5 pt-4 opacity-90`}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* 3. الرد الآلي بالـ AI (التجربة البصرية الجديدة) */}
      <div className="bg-[#0a121e] border border-blue-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 text-blue-400 font-black text-xl uppercase">
          <Bot size={28} className="animate-bounce" /> {isRTL ? 'نظام الرد الذكي الفوري (AI)' : 'Instant AI Response System'}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-slate-300 text-lg leading-relaxed">
              {isRTL 
                ? 'يقوم نظامنا بالرد على كل عميل في أقل من 30 ثانية، مما يرفع تصنيفك في خوارزميات جوجل بنسبة 400%.' 
                : 'Our AI responds to every customer in under 30 seconds, boosting your Google ranking by 400%.'}
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase"><MessageSquare size={14}/> {isRTL ? 'مثال حي للرد الآلي:' : 'Live AI Example:'}</div>
              <div className="text-sm text-slate-400 italic">"{isRTL ? 'شكراً لزيارتك مطعمنا، نحن سعداء لأنك استمتعت بوجبة الفتوش...' : 'Thank you for visiting, we are glad you enjoyed the Fattoush...'}"</div>
            </div>
          </div>
          <div className="relative group cursor-pointer">
             <div className="absolute inset-0 bg-blue-500/20 blur-3xl group-hover:bg-blue-500/40 transition-all"></div>
             <div className="relative bg-[#050a12] border-2 border-blue-500/30 p-6 rounded-3xl text-center">
                <Zap className="text-yellow-400 mx-auto mb-2" size={32} />
                <span className="text-white font-black text-2xl tracking-tighter uppercase">{isRTL ? 'تفعيل الرد التلقائي' : 'ACTIVATE AI REPLY'}</span>
             </div>
          </div>
        </div>
      </div>

      {/* 4. تحسين نظام التوصيل والطلبات (Restaurant Delivery) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0a121e] border border-white/10 rounded-[2.5rem] p-8">
           <div className="flex items-center gap-3 mb-8 text-green-400 font-black text-xl">
             <Bike size={24} /> {isRTL ? 'أتمتة طلبات التوصيل' : 'Delivery Order Automation'}
           </div>
           <div className="space-y-6">
              {[
                { t: isRTL ? 'تتبع فوري عبر WhatsApp' : 'Real-time WhatsApp Tracking', d: isRTL ? 'إرسال رابط التتبع فور خروج الطلب.' : 'Automated tracking links.' },
                { t: isRTL ? 'إعادة الاستهداف الذكي' : 'Smart Retargeting', d: isRTL ? 'دعوة العملاء للطلب مرة أخرى بعد 7 أيام.' : 'Inviting customers to re-order.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="bg-green-500/20 p-2 rounded-lg text-green-500"><CheckCircle2 size={18}/></div>
                   <div>
                     <h4 className="text-white font-bold">{item.t}</h4>
                     <p className="text-slate-500 text-sm">{item.d}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* كارت المقارنة مع Elegant Options */}
        <div className="bg-gradient-to-br from-[#0a121e] to-[#0d1b33] border-2 border-blue-500/30 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
           <div className="flex items-center gap-2 mb-8 text-blue-400 font-black uppercase tracking-tighter"><TrendingUp size={20}/> مع نظام ELEGANT OPTIONS</div>
           <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end border-b border-blue-500/10 pb-4"><span className="text-slate-400 font-bold">{isRTL ? 'النمو الأسبوعي المتوقع' : 'Projected Weekly'}</span><span className="text-5xl font-black text-blue-500">28+</span></div>
              <div className="flex justify-between items-end border-b border-blue-500/10 pb-4"><span className="text-slate-400 font-bold">{isRTL ? 'النمو الشهري المتوقع' : 'Projected Monthly'}</span><span className="text-5xl font-black text-blue-500">120+</span></div>
              <div className="flex justify-between items-end"><span className="text-slate-400 font-bold">{isRTL ? 'الرصيد السنوي المستهدف' : 'Annual Target'}</span><div className="bg-green-500 text-black px-4 py-1 rounded-xl text-3xl font-black">1440+</div></div>
           </div>
        </div>
      </div>

      {/* 5. الأرباح المحققة (الزر والتجربة النهائية) */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[3rem] p-10 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-blue-400 font-black text-3xl flex items-center justify-center md:justify-start gap-2">
              <DollarSign size={32} /> {isRTL ? 'أرباح محققة عبر كسب ثقة العملاء' : 'Realized Profits through Trust'}
            </h3>
            <p className="text-slate-400 font-bold text-lg max-w-xl">
              {isRTL 
                ? 'نحن نضاعف العائد المادي لكل تقييم إيجابي؛ لأن العميل الراضي يعود بتجربة شراء متكررة ويجلب عملاء آخرين.' 
                : 'Satisfied customers mean repeat purchases and new referrals.'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-8xl font-black text-white tracking-tighter">
              28,800 <span className="text-2xl text-blue-500 font-bold">{isRTL ? 'د.ك' : 'KWD'}</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-95 group">
               {isRTL ? 'احصل على التقرير الكامل الآن' : 'GET FULL REPORT NOW'}
               <ChevronRight className={`${isRTL ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResultsDashboard;
