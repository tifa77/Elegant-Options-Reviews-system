// @ts-nocheck
import React from 'react';
import { TrendingUp, Star, ShieldAlert, CheckCircle2, Info, Rocket, DollarSign } from 'lucide-react';
import { AuditData, Language } from '../types';

interface AuditDashboardProps {
  data: AuditData;
  language: Language;
}

const AuditDashboard: React.FC<AuditDashboardProps> = ({ data, language }) => {
  const isRTL = language === 'ar';

  // --- 1. محرك الحسابات (حل مشكلة الأصفار) --- 
  // يتم الحساب بناءً على تاريخ اليوم 11 يناير 2026 وسنة التأسيس المدخلة
  const calculateCurrentStatus = () => {
    const currentYear = 2026;
    const yearsActive = Math.max(1, currentYear - parseInt(data.establishmentYear));
    const totalDays = yearsActive * 365;
    
    // حساب المعدلات الفعلية بناءً على 190 تقييم (مثال) وعمر المشروع
    const dailyRate = (data.currentReviews / totalDays).toFixed(2);
    const weeklyRate = (parseFloat(dailyRate) * 7).toFixed(1);

    return { dailyRate, weeklyRate, yearsActive };
  };

  const status = calculateCurrentStatus();

  return (
    <div className={`space-y-8 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 2. البطاقات العلوية مع التحليل النصي العريض */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* إجمالي التقييمات */}
        <div className="bg-[#0a121e] border border-white/5 rounded-[2rem] p-8 text-center relative overflow-hidden group">
          <span className="text-slate-500 text-sm font-bold block mb-2">{isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS'}</span>
          <div className="text-6xl font-black text-white mb-4">{data.currentReviews}</div>
          {/* النص العريض المطلوب */}
          <p className="text-slate-400 font-black text-xl leading-tight border-t border-white/5 pt-4">
            {isRTL ? 'تحليل شامل لجميع النصوص المنشورة تاريخياً' : 'Comprehensive analysis of all historical texts'}
          </p>
        </div>

        {/* إيجابية مستحقة */}
        <div className="bg-[#051a14] border border-green-500/20 rounded-[2rem] p-8 text-center relative overflow-hidden">
          <span className="text-green-500 text-sm font-bold block mb-2">{isRTL ? 'إيجابية مستحقة' : 'DESERVED POSITIVE'}</span>
          <div className="text-6xl font-black text-green-400 mb-4">{data.positiveReviews}</div>
          {/* النص العريض المطلوب */}
          <p className="text-green-300 font-black text-xl leading-tight border-t border-green-500/10 pt-4">
            {isRTL ? 'هذه التقييمات ناتجة عن تحليل نصوص الرضا الفعلي' : 'Calculated based on actual satisfaction text analysis'}
          </p>
        </div>

        {/* سلبية (يتم حجبها) */}
        <div className="bg-[#1a0a0a] border border-red-500/20 rounded-[2rem] p-8 text-center relative overflow-hidden">
          <span className="text-red-500 text-sm font-bold block mb-2">{isRTL ? 'سلبية (يتم حجبها)' : 'NEGATIVE (BLOCKED)'}</span>
          <div className="text-6xl font-black text-red-500 mb-4">{data.negativeReviews}</div>
          {/* النص العريض المطلوب */}
          <p className="text-red-400 font-black text-xl leading-tight border-t border-red-500/10 pt-4">
            {isRTL ? 'نظامنا يضمن تحليل وحجب هذه الفئة من الظهور' : 'Our system analyzes and prevents these from appearing'}
          </p>
        </div>
      </div>

      {/* 3. مقارنة الأداء (الوضع الحالي الفعلي) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* الكارت الذي كان يظهر أصفاراً */}
        <div className="bg-[#0a121e] border border-white/10 rounded-[2.5rem] p-8 relative">
          <div className="flex items-center gap-3 mb-8 text-slate-400 font-bold text-xl">
             <Info size={24} /> {isRTL ? 'الوضع الحالي (الحركة الفعلية)' : 'Current Status (Actual Motion)'}
          </div>
          
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-slate-500 font-bold">{isRTL ? 'التقييمات الأسبوعية' : 'Weekly Reviews'}</span>
              <span className="text-4xl font-black text-white">{status.weeklyRate}</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-slate-500 font-bold">{isRTL ? 'التقييمات اليومية' : 'Daily Reviews'}</span>
              <span className="text-4xl font-black text-white">{status.dailyRate}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-slate-500 font-bold">{isRTL ? 'إجمالي التقييمات' : 'Total Reviews'}</span>
              <span className="text-4xl font-black text-white">{data.currentReviews}</span>
            </div>
          </div>
        </div>

        {/* كارت نظام ELEGANT OPTIONS */}
        <div className="bg-gradient-to-br from-[#0a121e] to-[#0d1b33] border-4 border-blue-500/30 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          <div className="flex items-center gap-3 mb-8 text-blue-400 font-black text-xl uppercase tracking-tighter">
             <TrendingUp size={24} /> مع نظام ELEGANT OPTIONS
          </div>
          
          <div className="space-y-8">
            <div className="flex justify-between items-end border-b border-blue-500/10 pb-4">
              <span className="text-slate-400 font-bold">{isRTL ? 'النمو الأسبوعي المتوقع' : 'Projected Weekly Growth'}</span>
              <span className="text-5xl font-black text-blue-500">35+</span>
            </div>
            <div className="flex justify-between items-end border-b border-blue-500/10 pb-4">
              <span className="text-slate-400 font-bold">{isRTL ? 'النمو الشهري المتوقع' : 'Projected Monthly Growth'}</span>
              <span className="text-5xl font-black text-blue-500">150+</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-slate-400 font-bold">{isRTL ? 'الرصيد السنوي المستهدف' : 'Target Annual Balance'}</span>
              <div className="bg-green-500 text-black px-4 py-1 rounded-xl text-3xl font-black">1800+</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. كارت الأرباح المحققة السفلي */}
      <div className="bg-[#0a121e] border border-blue-500/20 rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h3 className="text-blue-400 font-black text-2xl flex items-center gap-2">
              <DollarSign /> {isRTL ? 'أرباح محققة عبر كسب ثقة العملاء الجدد' : 'Realized Profits through New Customer Trust'}
            </h3>
            <p className="text-slate-400 font-bold">
              {isRTL ? 'نحن نضاعف العائد المادي لكل تقييم إيجابي؛ لأن العميل الراضي يكرر تجربة الشراء.' : 'We multiply the return for every positive review.'}
            </p>
          </div>
          <div className="text-7xl font-black text-white">
            28,800 <span className="text-2xl text-blue-500 font-bold">{isRTL ? 'د.ك' : 'KWD'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;
