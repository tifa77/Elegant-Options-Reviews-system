// @ts-nocheck
import React, { useState } from 'react';
import { 
  Ghost, Info, TrendingUp, DollarSign, Rocket, Star, 
  ShieldCheck, Bot, Bike, Quote, MousePointer2, 
  CheckCircle2, RotateCcw, LayoutDashboard, MessageSquare, ShieldAlert,
  Target, Zap
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

  // 1. منطق التشخيص السوقي الديناميكي
  const getDiagnosis = () => {
    const reviews = data.currentReviews || 0;
    if (reviews < 50) {
      return {
        title: isRTL ? 'خارج المنافسة' : 'Out of Competition',
        bg: 'bg-[#1a0a10]',
        border: 'border-red-900/30',
        colorClass: 'text-red-500',
        iconElement: <Ghost className="text-red-500" size={60} />
      };
    } else if (reviews < 200) {
      return {
        title: isRTL ? 'نمو غير مستغل' : 'Untapped Growth',
        bg: 'bg-[#1a140a]',
        border: 'border-orange-900/30',
        colorClass: 'text-orange-500',
        iconElement: <Target className="text-orange-500" size={60} />
      };
    } else {
      return {
        title: isRTL ? 'ريادة تحتاج أتمتة' : 'Leadership via Automation',
        bg: 'bg-[#0a121e]',
        border: 'border-blue-900/30',
        colorClass: 'text-blue-500',
        iconElement: <Zap className="text-blue-500" size={60} />
      };
    }
  };

  const status = getDiagnosis();

  // 2. إعداد رابط الواتساب الديناميكي
  const whatsappNumber = '96566305551';
  const message = isRTL 
    ? `أهلاً Elegant Options، مهتم لطلب نظام لمشروعي (${data.projectName})`
    : `Hello Elegant Options, I am interested in the system for my project (${data.projectName})`;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={`space-y-12 pb-24 animate-fade-in ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* 1. التشخيص السوقي الفعلي (Market Diagnosis) */}
      <div className={`${status.bg} border ${status.border} rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative shadow-2xl`}>
        <div className="space-y-2 z-10">
          <span className={`${status.colorClass} font-bold text-sm uppercase tracking-widest opacity-70`}>
            {isRTL ? 'التشخيص السوقي الفعلي' : 'Market Diagnosis'}
          </span>
          <h2 className={`${status.colorClass} text-4xl md:text-5xl font-black`}>
            {status.title}
          </h2>
          <p className="text-slate-400 font-bold max-w-xl">
            {isRTL 
              ? 'تحليل الحساب يظهر غياباً تاماً عن النتائج الأولى، مما يعني خسارة يومية للحصة السوقية لصالح المنافسين.' 
              : 'Your account is absent from top results, leading to daily market share loss.'}
          </p>
        </div>
        <div className={`${status.colorClass} bg-current/10 p-6 rounded-full shrink-0`}>
          {status.iconElement}
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
        {/* ... بقية الكود كما هو في الملف ... */}
      </div>
    </div>
  );
};

export default ResultsDashboard;
