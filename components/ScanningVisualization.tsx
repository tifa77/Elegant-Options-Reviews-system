import React, { useEffect, useMemo, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import {
  Loader2,
  Activity,
  Globe,
  Zap,
  FileText,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Users,
  MapPin,
  Building2,
} from 'lucide-react';

interface ScanningVisualizationProps {
  language: Language;
  data: AuditData;
  onComplete: () => void;
}

const ScanningVisualization: React.FC<ScanningVisualizationProps> = ({
  language,
  data,
  onComplete,
}) => {
  const t = TEXTS[language];
  const isRTL = language === 'ar';

  // ==========================
  // Derived values (safe)
  // ==========================
  const actualMonthly = Number((data as any).monthlyGrowth) || 0;
  const actualWeekly = Number((data as any).weeklyGrowth) || 0;
  const reviewsPerDay = useMemo(() => {
    const v = actualMonthly / 30;
    return Number.isFinite(v) ? v.toFixed(2) : '0.00';
  }, [actualMonthly]);

  const totalReviews = Number((data as any).currentReviews) || 0;
  const dailyCustomers = Number((data as any).dailyCustomers) || 0;

  const projectName = (data as any).projectName || (isRTL ? 'مشروعك' : 'Your Project');
  const projectType = (data as any).projectType || (isRTL ? 'غير محدد' : 'Unspecified');
  const address = (data as any).address || '';

  // ==========================
  // SEO descriptive mapping (existing logic preserved)
  // ==========================
  const getRankDescription = () => {
    if (actualMonthly === 0) return t.dashboard.statusLabels.zero;
    const rawRank = (data as any).searchRanking || '';
    const num = parseInt(String(rawRank).replace(/[^0-9]/g, ''), 10);
    if (isNaN(num)) return t.dashboard.statusLabels.invisible;
    if (num <= 3) return t.dashboard.statusLabels.strong;
    if (num <= 10) return t.dashboard.statusLabels.average;
    return t.dashboard.statusLabels.weak;
  };

  // ==========================
  // New: realistic scanning timeline
  // ==========================
  const [phase, setPhase] = useState(0); // 0..4
  const [progress, setProgress] = useState(0); // 0..100

  const phases = useMemo(
    () => [
      {
        title: isRTL ? 'تهيئة الفحص' : 'Initializing Scan',
        sub: isRTL ? 'تجهيز بيانات مشروعك للتحليل…' : 'Preparing your project data…',
        icon: Activity,
      },
      {
        title: isRTL ? 'قراءة إشارات التقييمات' : 'Reading Review Signals',
        sub: isRTL ? 'تحليل تكرار التقييمات واتجاه النمو…' : 'Analyzing review frequency & growth…',
        icon: BarChart3,
      },
      {
        title: isRTL ? 'فحص ظهور SEO' : 'Checking SEO Visibility',
        sub: isRTL ? 'محاكاة تقييم الظهور من مؤشرات النشاط…' : 'Estimating visibility from activity signals…',
        icon: Globe,
      },
      {
        title: isRTL ? 'تجميع التقرير' : 'Compiling Report',
        sub: isRTL ? 'تجهيز الملخص النهائي والنتائج…' : 'Preparing final summary and insights…',
        icon: FileText,
      },
      {
        title: isRTL ? 'اكتمل' : 'Completed',
        sub: isRTL ? 'تم تجهيز التقرير…' : 'Report is ready…',
        icon: CheckCircle2,
      },
    ],
    [isRTL]
  );

  // Keep the original total duration ~13s, but make it feel richer.
  useEffect(() => {
    // Phase switches (similar to your old step timings)
    const timers: any[] = [];
    timers.push(setTimeout(() => setPhase(1), 1800));
    timers.push(setTimeout(() => setPhase(2), 4500));
    timers.push(setTimeout(() => setPhase(3), 8200));
    timers.push(setTimeout(() => setPhase(4), 11200));
    timers.push(setTimeout(() => onComplete(), 13000));

    // Smooth progress (doesn't affect other pages)
    const start = Date.now();
    const duration = 12500;
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);
      if (p >= 100) clearInterval(progressTimer);
    }, 120);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  // SEO label during scan
  const seoLabel = useMemo(() => {
    if (phase < 2) return isRTL ? 'جارٍ التحضير…' : 'Preparing…';
    if (phase === 2) return isRTL ? 'جارٍ الفحص…' : 'Checking…';
    if (phase >= 3) return getRankDescription();
    return 'N/A';
  }, [phase, isRTL, actualMonthly]);

  const currentPhase = phases[Math.min(phase, phases.length - 1)];
  const PhaseIcon = currentPhase.icon;

  return (
    <div
      className={`max-w-3xl mx-auto w-full ${
        isRTL ? 'font-tajawal text-right' : 'font-sans text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-primary-500/10 overflow-hidden shadow-2xl relative">
        {/* Grid Background Animation */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* soft glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-500/10 blur-[90px] rounded-full z-0" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 blur-[90px] rounded-full z-0" />

        <div className="p-10 space-y-8 relative z-10 min-h-[560px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <PhaseIcon className="w-5 h-5 text-primary-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-300 uppercase tracking-widest">
                  {isRTL ? 'تحضير التقرير' : 'Preparing Report'}
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {currentPhase.sub}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
                {progress}%
              </span>
              <Loader2
                className={`w-5 h-5 text-primary-500 animate-spin ${
                  phase >= 4 ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-primary-400 uppercase font-black tracking-widest">
                {isRTL ? 'مراحل المعالجة' : 'Processing Stages'}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {phase >= 4 ? (isRTL ? 'جاهز' : 'READY') : (isRTL ? 'قيد العمل' : 'IN PROGRESS')}
              </span>
            </div>

            <div className="h-3 rounded-full bg-slate-900/60 border border-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500/80 to-indigo-500/80 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Phase chips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {phases.slice(0, 4).map((p, idx) => {
                const done = phase > idx;
                const active = phase === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl px-3 py-2 border text-[11px] font-black ${
                      done
                        ? 'bg-green-500/10 border-green-500/20 text-green-300'
                        : active
                        ? 'bg-primary-500/10 border-primary-500/25 text-primary-200'
                        : 'bg-slate-900/40 border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : active ? (
                        <Sparkles className="w-4 h-4 text-primary-300" />
                      ) : (
                        <Zap className="w-4 h-4 text-slate-600" />
                      )}
                      <span className="truncate">{p.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary (NEW) */}
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-transparent" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-primary-400 uppercase font-black tracking-widest">
                  {isRTL ? 'ملخص البيانات' : 'Data Summary'}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {isRTL ? 'يستخدم للتقرير' : 'Used for report'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
                    <Building2 className="w-4 h-4 text-primary-400" />
                    <span>{isRTL ? 'اسم المشروع' : 'Project Name'}</span>
                  </div>
                  <div className="text-white font-black text-xl mt-2 truncate">
                    {projectName}
                  </div>
                  <div className="text-slate-500 text-[11px] font-bold mt-1">
                    {isRTL ? 'النوع:' : 'Type:'} {String(projectType)}
                  </div>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
                    <MapPin className="w-4 h-4 text-primary-400" />
                    <span>{isRTL ? 'الموقع' : 'Location'}</span>
                  </div>
                  <div className="text-slate-200 font-bold text-sm mt-2 line-clamp-2">
                    {address || (isRTL ? '—' : '—')}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
                      <div className="text-white font-black text-lg">{totalReviews.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        {isRTL ? 'التقييمات' : 'REVIEWS'}
                      </div>
                    </div>
                    <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-center">
                      <div className="text-white font-black text-lg">{dailyCustomers.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        {isRTL ? 'عملاء/يوم' : 'CUSTOMERS/DAY'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-[12px] font-semibold leading-relaxed">
                {isRTL
                  ? 'جارٍ تحويل بياناتك إلى تقرير واضح يساعدك على فهم وضعك واتخاذ قرار سريع.'
                  : 'We’re converting your inputs into a clear report to help you understand your position and act fast.'}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 text-center shadow-inner group transition-all duration-500 hover:border-primary-500/30">
              <div className="text-5xl font-black text-white mb-2 transition-transform group-hover:scale-110 duration-500">
                {phase >= 1 ? reviewsPerDay : '0.00'}
              </div>
              <span className="text-xs text-slate-500 uppercase font-black tracking-widest">
                {t.scanning.dailyLabel}
              </span>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 text-center shadow-inner group transition-all duration-500 hover:border-primary-500/30">
              <div className="text-5xl font-black text-white mb-2 transition-transform group-hover:scale-110 duration-500">
                {phase >= 1 ? actualWeekly : '0'}
              </div>
              <span className="text-xs text-slate-500 uppercase font-black tracking-widest">
                {t.scanning.weeklyLabel}
              </span>
            </div>
          </div>

          {/* SEO Status */}
          <div className="animate-fade-in-up bg-slate-900/80 p-6 rounded-3xl border border-primary-500/20 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-500"></div>

            <div className="flex items-center justify-between">
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                <Globe className="w-6 h-6 text-primary-400" />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-primary-400 block uppercase font-black tracking-widest mb-1">
                  {t.scanning.rankLabel}
                </span>

                <span className="text-2xl font-black text-white transition-all duration-700">
                  {seoLabel}
                </span>

                <div className="text-[11px] text-slate-500 font-bold mt-1">
                  {isRTL
                    ? 'يعتمد على إشارات النشاط والتقييمات.'
                    : 'Based on activity & review signals.'}
                </div>
              </div>

              <div className="bg-primary-500/10 p-3 rounded-2xl">
                <Globe className="w-6 h-6 text-primary-400 opacity-30" />
              </div>
            </div>
          </div>

          {/* Footer hint */}
          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">
              {isRTL ? 'جاري إعداد تقريرك… لحظات.' : 'Generating your report… just a moment.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanningVisualization;
