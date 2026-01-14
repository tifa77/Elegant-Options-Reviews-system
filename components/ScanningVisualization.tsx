
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { Map, CheckCircle2, Loader2, Activity, Globe, Zap } from 'lucide-react';

interface ScanningVisualizationProps {
  language: Language;
  data: AuditData;
  onComplete: () => void;
}

const ScanningVisualization: React.FC<ScanningVisualizationProps> = ({ language, data, onComplete }) => {
  const t = TEXTS[language];
  const isRTL = language === 'ar';
  
  const [step, setStep] = useState(0);

  // Logic: Use actual extracted data
  const actualMonthly = data.monthlyGrowth || 0;
  const actualWeekly = data.weeklyGrowth || 0;
  const reviewsPerDay = (actualMonthly / 30).toFixed(2);

  // SEO Rank Descriptive Mapping
  const getRankDescription = () => {
    if (actualMonthly === 0) return t.dashboard.statusLabels.zero;
    const rawRank = data.searchRanking || "";
    const num = parseInt(rawRank.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return t.dashboard.statusLabels.invisible;
    if (num <= 3) return t.dashboard.statusLabels.strong;
    if (num <= 10) return t.dashboard.statusLabels.average;
    return t.dashboard.statusLabels.weak;
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 2000); 
    const timer2 = setTimeout(() => setStep(2), 5000); 
    const timer3 = setTimeout(() => setStep(3), 9000); 
    const timer4 = setTimeout(() => onComplete(), 13000); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className={`max-w-2xl mx-auto w-full ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-primary-500/10 overflow-hidden shadow-2xl relative">
        
        {/* Grid Background Animation */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="p-10 space-y-8 relative z-10 min-h-[500px]">
          
          {/* Header Animation */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
             <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary-500 animate-pulse" />
                <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{t.scanning.analyzing}</span>
             </div>
             <Loader2 className={`w-5 h-5 text-primary-500 animate-spin ${step >= 3 ? 'opacity-0' : 'opacity-100'}`} />
          </div>

          {/* Review Stats Row (Matches Screenshot) */}
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 text-center shadow-inner group transition-all duration-500 hover:border-primary-500/30">
                <div className="text-5xl font-black text-white mb-2 transition-transform group-hover:scale-110 duration-500">{step >= 2 ? reviewsPerDay : "0.00"}</div>
                <span className="text-xs text-slate-500 uppercase font-black tracking-widest">{t.scanning.dailyLabel}</span>
             </div>
             <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 text-center shadow-inner group transition-all duration-500 hover:border-primary-500/30">
                <div className="text-5xl font-black text-white mb-2 transition-transform group-hover:scale-110 duration-500">{step >= 2 ? actualWeekly : "0"}</div>
                <span className="text-xs text-slate-500 uppercase font-black tracking-widest">{t.scanning.weeklyLabel}</span>
             </div>
          </div>

          {/* SEO Rank Status (Descriptive, matches screenshot layout) */}
          {step >= 1 && (
            <div className="animate-fade-in-up bg-slate-900/80 p-6 rounded-3xl border border-primary-500/20 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-500"></div>
               <div className="flex items-center justify-between">
                  <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                     <Globe className="w-6 h-6 text-primary-400" />
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] text-primary-400 block uppercase font-black tracking-widest mb-1">{t.scanning.rankLabel}</span>
                     <span className="text-2xl font-black text-white transition-all duration-700">{step >= 3 ? getRankDescription() : "N/A"}</span>
                  </div>
                  <div className="bg-primary-500/10 p-3 rounded-2xl">
                     <Globe className="w-6 h-6 text-primary-400 opacity-30" />
                  </div>
               </div>
            </div>
          )}
          
          <div className="text-center pt-4">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">
                {isRTL ? "حساب سرعة النمو (آخر 30 يوم)..." : t.scanning.velocity}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScanningVisualization;
