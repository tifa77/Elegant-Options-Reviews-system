// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Utensils, Coffee, ShoppingBag, Stethoscope, 
  Globe, Calendar, Star, Users, Zap, Loader2, Radar, 
  MapPin, Hotel, Activity, ArrowRight, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { AuditData, Language } from '../types';

interface DataIntakeProps {
  language: Language;
  onSubmit: (data: AuditData) => void;
  onBack: () => void;
}

const DataIntake: React.FC<DataIntakeProps> = ({ language, onSubmit, onBack }) => {
  const isRTL = language === 'ar';
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [projectType, setProjectType] = useState('restaurant');

  const [formData, setFormData] = useState({
    projectName: '',
    establishmentYear: '2026',
    currentReviews: 0,
    dailyCustomers: 50,
    address: '',
    positiveReviews: 0,
    negativeReviews: 0
  });

  // --- الربط مع Google Maps Autocomplete ---
  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['establishment'],
          fields: ['name', 'formatted_address', 'rating', 'user_ratings_total']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.name) {
            handleAutoFill(place);
          }
        });
      }
    };

    if (window.google) initAutocomplete();
    else {
      const interval = setInterval(() => {
        if (window.google) { clearInterval(interval); initAutocomplete(); }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const handleAutoFill = (place: any) => {
    setIsExtracting(true);
    // محاكاة استخراج البيانات من جوجل
    setTimeout(() => {
      const totalReviews = place.user_ratings_total || Math.floor(Math.random() * 200) + 50;
      const pos = Math.floor(totalReviews * 0.88);
      const neg = totalReviews - pos;

      setFormData(prev => ({
        ...prev,
        projectName: place.name,
        address: place.formatted_address || '',
        currentReviews: totalReviews,
        positiveReviews: pos,
        negativeReviews: neg
      }));
      setIsExtracting(false);
    }, 1200);
  };

  const types = [
    { id: 'medical', icon: Stethoscope, label: isRTL ? 'عيادة طبية' : 'Medical Clinic' },
    { id: 'commercial', icon: ShoppingBag, label: isRTL ? 'تجاري' : 'Commercial' },
    { id: 'cafe', icon: Coffee, label: isRTL ? 'كافيه' : 'Café' },
    { id: 'restaurant', icon: Utensils, label: isRTL ? 'مطعم' : 'Restaurant' },
    { id: 'hotel', icon: Hotel, label: isRTL ? 'فندق' : 'Hotel' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmit({ ...formData, projectType });
    }, 800);
  };

  return (
    <div className={`max-w-4xl mx-auto animate-fade-in pb-16 px-4 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. العنوان المشوق الاستراتيجي */}
      <div className="text-center mb-12">
         <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full animate-pulse"></div>
            <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="relative w-24 h-24 object-contain mx-auto" />
         </div>
         <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
            {isRTL ? 'اكتشف حصتك السوقية الآن' : 'Discover Your Market Share Now'}
         </h1>
         <p className="text-blue-400 font-black text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {isRTL 
              ? 'أدخل بيانات مشروعك بدقة للحصول على تقرير احترافي يحلل وضعك التنافسي ويحدد فرص الهيمنة في منطقتك.' 
              : 'Enter your project data accurately for a professional report analyzing your competitive position.'}
         </p>
      </div>

      <div className="bg-[#050a12] border-4 border-solid border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          
          {/* اختيار نوع المشروع - خط عريض وصلب */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[13px] font-black text-blue-400 uppercase tracking-widest">
               <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
               {isRTL ? 'اختر تخصص مشروعك' : 'SELECT PROJECT TYPE'}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {types.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setProjectType(type.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border-4 border-solid transition-all duration-300 ${
                    projectType === type.id 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105' 
                    : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  <type.icon size={28} className={`mb-2 ${projectType === type.id ? 'text-blue-400' : 'text-slate-600'}`} />
                  <span className="text-[12px] font-black">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* الخريطة (أبيض وأسود Grayscale) */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[13px] font-black text-blue-400 uppercase tracking-widest">
               <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
               {isRTL ? 'تحديد الموقع الرقمي (بانتظار الاسم)' : 'DIGITAL LOCATION (AWAITING NAME)'}
            </div>
            <div className={`h-52 rounded-[2.5rem] border-4 border-solid border-white/10 relative flex items-center justify-center overflow-hidden transition-all duration-1000 ${formData.address ? 'grayscale-0' : 'grayscale bg-slate-900'}`}>
               <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/47.9774,29.3759,12,0/600x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAAbzlueG9qN3dqMHFyc2oifQ.kd9y_9l4c6h07U5C8j5gZA')] bg-cover bg-center opacity-30"></div>
               <div className="relative z-10 flex flex-col items-center gap-3">
                  {isExtracting ? <Loader2 size={48} className="text-blue-500 animate-spin" /> : <MapPin size={56} className="text-blue-500 animate-bounce" />}
                  <span className="text-[12px] font-black text-white uppercase tracking-tighter bg-black/60 px-6 py-2 rounded-full backdrop-blur-md border-2 border-white/10">
                    {formData.address ? formData.address : (isRTL ? 'سيتم تحديد مشروعك بمجرد كتابة الاسم' : 'PROJECT WILL BE LOCATED UPON NAMING')}
                  </span>
               </div>
            </div>
          </div>

          {/* مدخل اسم المشروع */}
          <div className="space-y-4">
            <label className="text-[13px] font-black text-blue-400 uppercase tracking-widest block">{isRTL ? 'اسم المشروع كاملاً' : 'FULL PROJECT NAME'}</label>
            <div className="relative">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={28} />
              <input
                ref={inputRef}
                type="text"
                required
                placeholder={isRTL ? "مثال: مطعم إليجانت السالمية، كافيه الرواد..." : "Ex: Elegant Restaurant Salmiya..."}
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                className="w-full bg-[#0a121e] border-4 border-solid border-white/10 rounded-3xl py-6 pr-16 pl-8 text-white text-xl font-black placeholder:text-slate-700 focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all"
              />
            </div>
          </div>

          {/* شبكة البيانات مع الشروحات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-3">
                <div className="bg-[#0a121e] border-4 border-solid border-white/5 p-6 rounded-[2.5rem] transition-colors hover:border-blue-500/30">
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3"><Calendar size={18} className="text-blue-500"/> {isRTL ? 'سنة التأسيس' : 'EST. YEAR'}</span>
                   <input type="number" value={formData.establishmentYear} onChange={(e) => setFormData({...formData, establishmentYear: e.target.value})} className="bg-transparent text-4xl font-black text-white w-full outline-none" />
                </div>
                <p className="text-[11px] text-slate-500 font-black px-3 leading-tight">{isRTL ? 'يجب وضع هذه البيانات لتحليل عمر مشروعك في السوق بشكل صحيح.' : 'Provide this data to analyze your market lifespan correctly.'}</p>
             </div>
             
             <div className="space-y-3">
                <div className={`bg-[#0a121e] border-4 border-solid p-6 rounded-[2.5rem] transition-all ${isExtracting ? 'border-blue-500 animate-pulse' : 'border-white/5'}`}>
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3"><Star size={18} className="text-blue-500"/> {isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS'}</span>
                   <div className="text-4xl font-black text-white w-full flex items-center gap-2">
                      {isExtracting ? <Loader2 className="animate-spin" size={24} /> : formData.currentReviews}
                      {!isExtracting && formData.currentReviews > 0 && <CheckCircle2 size={20} className="text-green-500" />}
                   </div>
                </div>
                <p className="text-[11px] text-slate-500 font-black px-3 leading-tight">{isRTL ? 'يتم استخراج هذه البيانات لتقييم مصداقيتك الحالية في جوجل بشكل صحيح.' : 'Extracted to evaluate your current Google credibility.'}</p>
             </div>

             <div className="space-y-3">
                <div className="bg-[#0a121e] border-4 border-solid border-white/5 p-6 rounded-[2.5rem] transition-colors hover:border-blue-500/30">
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3"><Users size={18} className="text-blue-500"/> {isRTL ? 'العملاء يومياً' : 'DAILY CUSTOMERS'}</span>
                   <input type="number" value={formData.dailyCustomers} onChange={(e) => setFormData({...formData, dailyCustomers: e.target.value})} className="bg-transparent text-4xl font-black text-white w-full outline-none" />
                </div>
                <p className="text-[11px] text-slate-500 font-black px-3 leading-tight">{isRTL ? 'يجب وضع هذه البيانات لتحليل فرص النمو الضائعة يومياً بشكل صحيح.' : 'Provide this to analyze daily missed growth correctly.'}</p>
             </div>
          </div>

          {/* زر الفحص العميق */}
          <button
            type="submit"
            disabled={loading || isExtracting}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 py-8 rounded-[3rem] shadow-[0_30px_60px_rgba(37,99,235,0.4)] hover:shadow-blue-500/60 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-[1.2s] -translate-x-full skew-x-12"></div>
            <span className="relative flex items-center justify-center gap-4 text-white font-black text-2xl tracking-tighter uppercase">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={32} />
                  {isRTL ? 'جاري التحليل الاستراتيجي...' : 'STRATEGIC ANALYSIS...'}
                </>
              ) : (
                <>
                  {isRTL ? 'تشغيل الفحص العميق للهيمنة' : 'START DEEP DOMINANCE AUDIT'}
                  <Zap className="fill-yellow-400 text-yellow-400 animate-pulse" size={32} />
                </>
              )}
            </span>
          </button>
        </form>
      </div>

      <div className="text-center mt-12 text-[12px] font-black text-slate-600 uppercase tracking-[0.5em] opacity-50">
         .ELEGANT OPTIONS. ALL RIGHTS RESERVED 2026 ©
      </div>
    </div>
  );
};

export default DataIntake;
