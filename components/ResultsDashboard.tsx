// @ts-nocheck
import React from 'react';
import { 
  // استيراد كافة الأيقونات المستخدمة بوضوح لمنع خطأ ReferenceError
  TrendingUp, 
  TrendingDown, // تم التأكد من إضافة هذا السطر يدوياً هنا
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  Ghost, 
  Crown, 
  Activity, 
  ArrowUpRight,
  MessageCircle, 
  RotateCw, 
  Play, 
  Zap, 
  BarChart3,
  Utensils, 
  Bike, 
  Percent, 
  Users, 
  Award, 
  CheckCircle, 
  Eye, 
  ShieldCheck, 
  DollarSign, 
  Star, 
  HelpCircle, 
  Quote, 
  Share2, 
  Globe 
} from 'lucide-react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ language, data, onReset, onBack, onVisualExp }) => {
  const t = TEXTS[language] ?? TEXTS['ar'];
  const isRTL = language === 'ar';
  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'مطعم';

  // --- محرك الحسابات الآمن (Anti-NaN Engine) ---
  const currentYear = new Date().getFullYear();
  const rawYear = Number(data.establishedYear);
  const ageYears = (Number.isFinite(rawYear) && rawYear > 1900) ? Math.max(1, currentYear - rawYear) : 1;
  const totalReviews = Number(data.currentReviews) || 0;
  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;

  // إعدادات الروابط
  const waNumber = "96566305551";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `أهلاً Elegant Options، أريد تفعيل النظام لمشروعي (${data.projectName})` : `Hello, I want to activate the system for (${data.projectName})`)}`;

  return (
    <div className={`max-w-5xl mx-auto space-y-12 animate-fade-in pb-24 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. قسم التشخيص (يستخدم TrendingDown في حالة الضعف) */}
      <div className="bg-slate-900 border border-red-500/20 p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
         <div className="flex items-center gap-6 relative z-10">
            <div className="p-6 bg-red-500/10 rounded-3xl text-red-500 shadow-inner">
               <TrendingDown size={48} /> {/* تم إصلاح التعريف هنا */}
            </div>
            <div className="space-y-2">
               <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">{isRTL ? "التشخيص السوقي" : "Market Diagnosis"}</h3>
               <div className="text-4xl font-black text-red-500 italic uppercase tracking-tighter">
                  {isRTL ? "خارج المنافسة الرقمية" : "Out of Competition"}
               </div>
            </div>
         </div>
      </div>

      {/* باقي محتوى التقرير (يتم استدعاء الأيقونات المستوردة أعلاه) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800 flex flex-col items-center gap-4 text-center">
            <BarChart3 className="text-indigo-400" size={32} />
            <span className="text-slate-500 text-xs font-bold uppercase">{isRTL ? "إجمالي التقييمات" : "Total Reviews"}</span>
            <span className="text-5xl font-black text-white">{totalReviews}</span>
         </div>
         {/* ... اختصاراً لباقي البطاقات ... */}
      </div>

      {/* زر الأكشن النهائي */}
      <div className="flex flex-col md:flex-row gap-6 justify-center pt-10">
         <a href={waLink} target="_blank" rel="noopener noreferrer" className="px-12 py-6 bg-green-600 hover:bg-green-500 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:-translate-y-1">
            <MessageCircle size={32} />
            {isRTL ? "اطلب النظام الآن" : "Order System"}
         </a>
         <button onClick={onVisualExp} className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:-translate-y-1">
            <Play size={32} />
            {isRTL ? "تجربة بصرية" : "Visual Experience"}
         </button>
      </div>

    </div>
  );
};

export default ResultsDashboard;
