import React, { useEffect, useState } from 'react';
import { Activity, Globe, Search, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { AuditData, Language } from '../types';

interface ScanningVisualizationProps {
  data: AuditData;
  language: Language;
  onComplete: () => void;
}

const ScanningVisualization: React.FC<ScanningVisualizationProps> = ({ data, language, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const isRTL = language === 'ar';

  // حساب الأرقام للعرض
  const reviewsPerWeek = data.weeklyGrowth || 0;
  // إذا لم يكن هناك نمو أسبوعي، نحسب اليومي بناءً على الشهري
  const reviewsPerDay = reviewsPerWeek > 0 
    ? (reviewsPerWeek / 7).toFixed(2) 
    : ((data.monthlyGrowth || 0) / 30).toFixed(2);

  // --- المنطق الصارم لتحديد الحالة (Strict SEO Status Logic) ---
  const getSEOStatus = () => {
    const daily = parseFloat(reviewsPerDay);
    
    // إذا كان المعدل أقل من 0.5 يومياً (يعني أقل من 3-4 بالأسبوع) -> شبح
    if (daily < 0.5) {
      return {
        text: isRTL ? "شبح رقمي (ضعيف جداً)" : "Digital Ghost (Critical)",
        color: "text-red-500",
        icon: AlertTriangle,
        borderColor: "border-red-500/50",
        bgGlow: "bg-red-500/10"
      };
    }
    // إذا كان أقل من 2 يومياً -> منافس
    if (daily < 2) {
      return {
        text: isRTL ? "منافس صاعد (متوسط)" : "Challenger (Average)",
        color: "text-yellow-400",
        icon: Activity,
        borderColor: "border-yellow-400/50",
        bgGlow: "bg-yellow-400/10"
      };
    }
    // أكثر من ذلك -> مسيطر
    return {
      text: isRTL ? "مسيطر على السوق (ممتاز)" : "Market Dominator",
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
          setTimeout(onComplete, 800); // انتظار بسيط قبل الانتقال
          return 100;
        }
        return prev + 2; // سرعة التقدم
      });
    }, 40);

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
               {isRTL ? "جاري تحليل وتيرة التقييمات..." : "Analyzing Review Velocity..."}
             </h3>
          </div>
          <span className="text-primary-400 font-mono text-xl font-bold">{progress}%</span>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Weekly Velocity */}
          <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors"></div>
            <span className="text-5xl font-black text-white mb-2 tracking-tighter">{reviewsPerWeek}</span>
            <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">
              {isRTL ? "تقييم / أسبوع" : "Reviews / Week"}
            </span>
          </div>

          {/* Card 2: Daily Velocity */}
          <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors"></div>
            <span className="text-5xl font-black text-white mb-2 tracking-tighter">{reviewsPerDay}</span>
            <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">
               {isRTL ? "تقييم / يوم" : "Reviews / Day"}
            </span>
          </div>

        </div>

        {/* SEO Status Bar (The Strict Logic Area) */}
        <div className={`relative p-8 rounded-3xl border ${status.borderColor} ${status.bgGlow} transition-all duration-500`}>
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-full bg-slate-900 ${status.color} border border-slate-800`}>
                    <Globe size={32} />
                 </div>
                 <div className="text-center md:text-right">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">
                      {isRTL ? "حالة ظهور الـ SEO" : "SEO Visibility Status"}
                    </span>
                    <span className={`text-2xl md:text-3xl font-black ${status.color}`}>
                      {status.text}
                    </span>
                 </div>
              </div>

              <div className="hidden md:block w-px h-12 bg-slate-700/50"></div>

              <div className="flex items-center gap-2">
                 <StatusIcon className={`${status.color} animate-bounce`} size={24} />
                 <span className="text-slate-500 text-xs">
                   {isRTL ? "يتم حساب سرعة النمو (آخر 30 يوم)..." : "Calculating growth velocity (Last 30 days)..."}
                 </span>
              </div>

           </div>
           
           {/* Progress Bar Line */}
           <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full rounded-b-3xl overflow-hidden">
              <div 
                className={`h-full ${status.color === 'text-red-500' ? 'bg-red-500' : status.color === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-green-500'} transition-all duration-300 ease-out`} 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ScanningVisualization;
