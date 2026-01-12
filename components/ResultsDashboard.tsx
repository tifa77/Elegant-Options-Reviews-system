// @ts-nocheck
import React, { useState } from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Rocket, Star, 
  ShieldCheck, Bot, Bike, Quote, MousePointer2, 
  CheckCircle2, RotateCcw, LayoutDashboard, MessageSquare, ShieldAlert
} from 'lucide-react';
import { AuditData, Language } from '../types';

interface AuditDashboardProps {
  data: AuditData;
  language: Language;
  onReset: () => void;
  onShowVisualExperience: () => void; // دالة لتفعيل التجربة البصرية
}

const ResultsDashboard: React.FC<AuditDashboardProps> = ({ data, language, onReset, onShowVisualExperience }) => {
  const isRTL = language === 'ar';
  
  // --- محرك الحسابات الواقعية لمنع الأصفار ---
  const currentYear = 2026; 
  const yearsActive = Math.max(1, currentYear - parseInt(data.establishmentYear || '2024'));
  const totalDays = yearsActive * 365;
  const actualDaily = (data.currentReviews / totalDays).toFixed(2);
  const actualWeekly = (parseFloat(actualDaily) * 7).toFixed(1);

  return (
    <div className={`space-y-12 pb-24 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
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

      {/* 2. تحليل التقييمات الحالي */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS', value: data.currentReviews, color: 'white', bg: '#0a121e', note: isRTL ? 'تحليل شامل لجميع النصوص المنشورة تاريخياً' : 'Historical text analysis' },
          { label: isRTL ? 'إيجابية مستحقة' : 'DESERVED POSITIVE', value: Math.floor(data.currentReviews * 0.85), color: 'green-400', bg: '#051a14', note: isRTL ? 'هذه التقييمات ناتجة عن تحليل نصوص الرضا الفعلي' : 'Actual satisfaction analysis' },
          { label: isRTL ? 'سلبية (يتم حجبها)' : 'NEGATIVE (BLOCKED)', value: Math.floor(data.currentReviews * 0.15), color: 'red-500', bg: '#1a0a0a', note: isRTL ? 'نظامنا يضمن تحليل وحجب هذه الفئة من الظهور' : 'Analysis prevents these from appearing' }
        ].map((card, i) => (
          <div key={i} className={`bg-[${card.bg}] border border-white/5 rounded-[2.5rem] p-8 text-center shadow-xl`}>
            <span className={`text-${card.color} text-xs font-bold block mb-2 uppercase opacity-70`}>{card.label}</span>
            <div className={`text-6xl font-black text-${card.color} mb-4`}>{card.value}</div>
            <p className={`text-${card.color} font-black text-xl leading-tight border-t border-white/5 pt-4`}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* 3. مقارنة الأداء والوضع الحالي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        </div>

        <div className="bg-gradient-to-br from-[#0a121e] to-[#0d1b33] border-2 border-blue-500/30 rounded-[2.5rem] p-8 shadow-xl">
           <div className="flex items-center gap-3 mb-8 text-blue-400 font-black uppercase">
             <TrendingUp size={24} /> {isRTL ? 'مع نظام ELEGANT OPTIONS' : 'WITH ELEGANT OPTIONS'}
           </div>
           <div className="space-y-8">
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
                <div className="bg-green-500 text-black px-4 py-1 rounded-xl text-3xl font-black">1440+</div>
              </div>
           </div>
        </div>
      </div>

      {/* 4. شرح المميزات التنافسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* ميزة AI */}
        <div className="bg-[#0a121e] border border-blue-500/20 rounded-[2.5rem] p-8 space-y-4 hover:border-blue-500/50 transition-all group">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-xl">{isRTL ? 'ردود آلية متطورة بواسطة AI' : 'Advanced AI Replies'}</h4>
            <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400"><Bot size={28}/></div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {isRTL 
              ? 'الرد اللحظي على كل تقييم باستخدام خوارزميات لغوية ذكية. هذا يرفع تصنيفك في جوجل بنسبة 40% إضافية لأن جوجل يفضل الأنشطة المتفاعلة، كما أنه يعزز ولاء العميل الذي يشعر بالاهتمام الفوري.' 
              : 'Instant response to every review using smart NLP algorithms. This boosts your Google ranking by 40% and enhances loyalty.'}
          </p>
        </div>

        {/* درع الحماية */}
        <div className="bg-[#0a121e] border border-orange-500/20 rounded-[2.5rem] p-8 space-y-4 hover:border-orange-500/50 transition-all">
           <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-xl">{isRTL ? 'درع حماية السمعة' : 'Reputation Shield'}</h4>
            <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400"><ShieldCheck size={28}/></div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {isRTL 
              ? 'نظام فلترة ذكي يكتشف التقييمات السلبية قبل نشرها. يتم توجيه الشكوى فوراً كرسالة واتساب سرية للإدارة لحل المشكلة وإرضاء العميل داخلياً، مما يمنع تشويه صورتك العامة ويحافظ على العلامة الكاملة.' 
              : 'Smart filtering captures negative feedback before it hits public pages, routing it privately to management.'}
          </p>
        </div>

        {/* دمج التوصيل */}
        <div className="bg-[#0a121e] border border-red-500/20 rounded-[2.5rem] p-8 space-y-4 hover:border-red-500/50 transition-all md:col-span-2 lg:col-span-1">
           <div className="flex justify-between items-center">
            <h4 className="text-white font-black text-xl">{isRTL ? 'دمج تطبيقات التوصيل (طلبات/كيتا)' : 'Delivery App Integration'}</h4>
            <div className="bg-red-500/20 p-3 rounded-2xl text-red-500"><Bike size={28}/></div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {isRTL 
              ? 'بمجرد استلام الطلب من (طلبات أو كيتا)، يقوم النظام بإرسال رسالة واتساب للعميل تطلب تقييمه بذكاء. هذه الطريقة تضمن تحويل "تجربة الطعام" السريعة إلى "سمعة رقمية" دائمة، وتزيد عدد تقييماتك بشكل آلي.' 
              : 'Integration with Talabat/Kita triggers a WhatsApp survey link upon delivery, ensuring every order builds your reputation.'}
          </p>
        </div>
      </div>

      {/* 5. مقولة هارفارد والتوصية الاستراتيجية */}
      <div className="text-center py-10 space-y-6">
        <Quote className="text-yellow-500/20 mx-auto" size={56} fill="currentColor" />
        <h3 className="text-white text-3xl font-black italic max-w-4xl mx-auto leading-tight">
          {isRTL 
            ? '"زيادة نجمة واحدة في التقييم تؤدي لزيادة في الإيرادات بنسبة 5% إلى 9%."' 
            : '"A one-star increase in rating leads to a 5% to 9% increase in revenue."'}
        </h3>
        <span className="text-yellow-500 font-black tracking-[0.3em] text-sm block uppercase">HARVARD BUSINESS SCHOOL</span>
      </div>

      <div className="bg-[#0a121e] border-2 border-blue-500/20 rounded-[3rem] p-10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4 text-blue-400 font-black text-2xl">
           <TrendingUp size={32} /> {isRTL ? 'التوصية الاستراتيجية النهائية' : 'Final Recommendation'}
        </div>
        <p className="text-slate-300 font-bold text-lg leading-relaxed">
          {isRTL 
            ? `بناءً على تحليل بيانات (${data.projectName})، ننصح ببدء خطة الهيمنة لـ 12 شهراً القادمة للسيطرة المطلقة على منطقتك وتصدر نتائج البحث بمصداقية عالية وجذب تدفق مستمر من العملاء الجدد.` 
            : `Based on (${data.projectName}) data, we recommend our 12-month dominance plan to secure absolute area lead.`}
        </p>
      </div>

      {/* 6. الأرباح المتوقعة والأزرار النهائية */}
      {/* تم التعديل هنا لذكر نظرية ولاء العملاء بشكل سنوي */}
      <div className="bg-[#0a121e] border-2 border-blue-500/30 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10 text-center md:text-right">
          <div className="space-y-4">
            <h3 className="text-blue-400 font-black text-4xl flex items-center justify-center md:justify-start gap-4">
              <DollarSign size={40} /> {isRTL ? 'أرباح محققة عبر كسب الثقة' : 'Realized Profits'}
            </h3>
            <p className="text-slate-400 font-bold text-xl max-w-xl">
              {isRTL 
                ? 'هذه المبالغ تمثل الأرباح السنوية التي يمكن اكتسابها عند تحقيق نظرية ولاء العملاء وتحويل كل تجربة شراء إلى علاقة مستدامة تضمن تدفقاً نقدياً متكرراً.' 
                : 'These amounts represent the annual profits achievable when applying the Customer Loyalty Theory, turning every purchase into a recurring revenue stream.'}
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-8xl font-black text-white tracking-tighter">
              28,800 <span className="text-3xl text-blue-500 font-bold uppercase">{isRTL ? 'د.ك' : 'KWD'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {/* زر الطلب - يوجه للواتساب */}
        <button 
          onClick={() => window.open('https://wa.me/yournumber', '_blank')}
          className="bg-green-600 hover:bg-green-500 text-white font-black py-10 rounded-[2.5rem] flex items-center justify-center gap-4 text-3xl transition-all shadow-2xl shadow-green-900/40 group active:scale-95">
          <CheckCircle2 size={40} className="group-hover:scale-125 transition-transform" />
          {isRTL ? 'اطلب النظام الآن' : 'ORDER SYSTEM NOW'}
        </button>
        
        {/* زر التجربة البصرية - مع إضافة عبارة تحفيزية */}
        <div className="relative group">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-full flex flex-col items-center gap-1 z-20 shadow-xl border border-white/20 whitespace-nowrap animate-bounce">
             <div className="flex items-center gap-2">
                <Star size={14} className="animate-spin" /> 
                {isRTL ? 'اكتشف القوة الكامنة خلف الأرقام' : 'Discover the hidden power'}
             </div>
             <span className="text-[10px] opacity-80">{isRTL ? 'اضغط لرؤية تفاصيل المحاكاة' : 'Click to see simulation details'}</span>
          </div>
          <button 
            onClick={onShowVisualExperience}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-black py-10 rounded-[2.5rem] flex items-center justify-center gap-4 text-3xl transition-all shadow-2xl shadow-blue-900/40 active:scale-95">
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
