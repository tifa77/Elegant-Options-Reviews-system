import React, { useEffect, useState } from 'react';
import { Activity, Globe, Search, AlertTriangle, CheckCircle, BarChart3, Loader2 } from 'lucide-react';
import { AuditData, Language } from '../types';
import { TEXTS } from '../constants'; // استيراد النصوص المحدثة

interface ScanningVisualizationProps {
  data: AuditData;
  language: Language;
  onComplete: () => void;
}

const ScanningVisualization: React.FC<ScanningVisualizationProps> = ({ data, language, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const isRTL = language === 'ar';
  const t = TEXTS[language]; // متغير لسهولة الوصول للنصوص

  // حساب الأرقام للعرض
  const reviewsPerWeek = data.weeklyGrowth || 0;
  const reviewsPerDay = reviewsPerWeek > 0 
    ? (reviewsPerWeek / 7).toFixed(2) 
    : ((data.monthlyGrowth || 0) / 30).toFixed(2);

  // --- المنطق الصارم لتحديد الحالة (Strict SEO Status Logic) ---
  const getSEOStatus = () => {
    const daily = parseFloat(reviewsPerDay);
    
    if (daily < 0.5) {
      return {
        text: t.dashboard.statusLabels.invisible, // "شبح رقمي" من constants
        color: "text-red-500",
        icon: AlertTriangle,
        borderColor: "border-red-500/50",
        bgGlow: "bg-red-500/10"
      };
    }
    if (daily < 2) {
      return {
        text: t.dashboard.statusLabels.weak,
        color: "text-yellow-400",
        icon: Activity,
        borderColor: "border-yellow-400/50",
        bgGlow: "bg-yellow-400/10"
      };
    }
    return {
      text: t.dashboard.statusLabels.strong,
      color: "text-green-500",
      icon: CheckCircle,
      borderColor: "border-green-500/50",
      bgGlow: "bg-green-500/10"
    };
  };

  const status = getSEOStatus();
  const StatusIcon = status.icon;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1200); // زيادة التأثير الدرامي قبل الانتقال للنتائج
          return 100;
        }
        return prev + 1;
      });
    }, 60); // وتيرة تحميل تعطي وقتاً كافياً لقراءة الرسائل
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`w-full max-w-4xl mx-auto p-8 relative overflow-hidden ${isRTL ? 'font-tajawal' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 space-y-12">
        
        {/* Header Text */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Activity className="text-primary-400 animate-pulse" />
             <h3 className="text-slate-300 font-bold text-lg">
               {progress < 100 ? t.scanning.analyzing : t.inputs.analysisComplete}
             </h3>
          </div>
          <div className="flex items-center gap-3">
            {progress < 100 && <Loader2 className="animate-spin text-primary-400" size={20} />}
            <span className="text-primary-400 font-mono text-xl font-bold">{progress}%</span>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Weekly Velocity */}
          <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-700">
            <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors"></div>
            <span className="text-5xl font-black text-white mb-2 tracking-tighter">
              {progress < 40 ? "---" : reviewsPerWeek}
            </span>
            <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">
              {t.scanning.weeklyLabel}
            </span>
          </div>

          {/* Card 2: Daily Velocity */}
          <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-700">
             <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors"></div>
            <span className="text-5xl font-black text-white mb-2 tracking-tighter">
              {progress < 70 ? "---" : reviewsPerDay}
            </span>
            <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">
               {t.scanning.dailyLabel}
            </span>
          </div>

        </div>

        {/* SEO Status Bar (Condition Logic Applied Here) */}
        <div className={`relative p-8 rounded-3xl border transition-all duration-700 ease-in-out ${progress < 100 ? 'border-primary-500/30 bg-primary-500/5' : `${status.borderColor} ${status.bgGlow}`}`}>
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-full bg-slate-900 border border-slate-800 transition-colors duration-500 ${progress < 100 ? 'text-primary-400' : status.color}`}>
                    <Globe size={32} className={progress < 100 ? "animate-spin-slow" : ""} />
                 </div>
                 <div className="text-center md:text-right">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">
                      {t.scanning.rankLabel}
                    </span>
                    <span className={`text-2xl md:text-3xl font-black transition-all duration-500 ${progress < 100 ? 'text-slate-300' : status.color}`}>
                      {/* عرض "جاري استخراج دراسة حالة المشروع..." بدلاً من التشخيص أثناء التحميل */}
                      {progress < 100 ? (
                        <span className="animate-pulse">{t.scanning.extractingStudy}</span>
                      ) : (
                        status.text
                      )}
                    </span>
                 </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-slate-700/50"></div>

              <div className="flex items-center gap-2">
                 {progress < 100 ? (
                   <Search className="text-primary-400 animate-pulse" size={24} />
                 ) : (
                   <StatusIcon className={`${status.color} animate-bounce`} size={24} />
                 )}
                 <span className="text-slate-500 text-xs italic">
                   {progress < 100 ? t.scanning.velocity : t.scanning.match}
                 </span>
              </div>

           </div>
           
           {/* Progress Bar Line */}
           <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full rounded-b-3xl overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ease-out ${progress < 100 ? 'bg-primary-500' : (status.color === 'text-red-500' ? 'bg-red-500' : status.color === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-green-500')}`} 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ScanningVisualization;
