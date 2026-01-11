// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Utensils, Coffee, ShoppingBag, Stethoscope, 
  Globe, Calendar, Star, Users, Zap, Loader2, Radar, 
  MapPin, Hotel, Activity
} from 'lucide-react';
import { AuditData, Language } from '../types';

interface DataIntakeProps {
  onStart: (data: AuditData) => void;
  language: Language;
}

const DataIntake: React.FC<DataIntakeProps> = ({ onStart, language }) => {
  const isRTL = language === 'ar';
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState('restaurant');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    projectName: '',
    establishmentYear: '2026',
    currentReviews: '0',
    dailyCustomers: '50',
    address: ''
  });

  // منطق الربط مع Google Maps Autocomplete لمنع خطأ T is not a function
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'],
        fields: ['name', 'formatted_address', 'geometry']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.name) {
          setFormData(prev => ({ 
            ...prev, 
            projectName: place.name,
            address: place.formatted_address || '' 
          }));
        }
      });
    }
  }, []);

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
    
    // محاكاة سريعة (800ms) تضمن الانتقال الفوري للتقرير الاستراتيجي
    setTimeout(() => {
      onStart({ ...formData, projectType });
    }, 800);
  };

  return (
    <div className={`max-w-3xl mx-auto animate-fade-in pb-12 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* العنوان الاستراتيجي */}
      <div className="text-center mb-10">
         <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="w-20 h-20 object-contain mx-auto mb-6" />
         <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
            {isRTL ? 'اكتشف حصتك السوقية الآن' : 'Discover Your Market Share Now'}
         </h1>
         <p className="text-blue-400 font-black text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            {isRTL 
              ? 'أدخل بيانات مشروعك بدقة للحصول على تقرير احترافي يحلل وضعك التنافسي ويحدد فرص الهيمنة في منطقتك.' 
              : 'Enter your project data accurately to get a professional report analyzing your competitive position.'}
         </p>
      </div>

      <div className="bg-[#050a12] border-2 border-solid border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative">
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          
          {/* نوع المشروع - خط صلب وعريض */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[12px] font-black text-blue-400 uppercase tracking-widest">
               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
               {isRTL ? 'اختر تخصص مشروعك' : 'SELECT PROJECT TYPE'}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {types.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setProjectType(type.id)}
                  className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 border-solid transition-all duration-300 group ${
                    projectType === type.id 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  <type.icon size={24} className={`mb-2 ${projectType === type.id ? 'text-blue-400' : 'text-slate-600'}`} />
                  <span className="text-[12px] font-black">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* الخريطة (ظاهرة Grayscale لضمان استقرار العرض) */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[12px] font-black text-blue-400 uppercase tracking-widest">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
               {isRTL ? 'تحديد الموقع الرقمي (بانتظار الاسم)' : 'DIGITAL LOCATION (AWAITING NAME)'}
            </div>
            <div className="h-44 bg-slate-900 rounded-[2.5rem] border-2 border-solid border-white/5 relative flex items-center justify-center overflow-hidden grayscale">
               <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/47.9774,29.3759,12,0/600x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAAbzlueG9qN3dqMHFyc2oifQ.kd9y_9l4c6h07U5C8j5gZA')] bg-cover bg-center opacity-20"></div>
               <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
                  <MapPin size={48} className="text-blue-500 animate-bounce" />
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter bg-black/60 px-5 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
                    {isRTL ? 'سيتم تحديد مشروعك بمجرد كتابة الاسم' : 'PROJECT WILL BE LOCATED UPON NAMING'}
                  </span>
               </div>
            </div>
          </div>

          {/* مدخل اسم المشروع (المرتبط بجوجل) */}
          <div className="space-y-4">
            <label className="text-[12px] font-black text-blue-400 uppercase tracking-widest block">{isRTL ? 'اسم المشروع كاملاً' : 'FULL PROJECT NAME'}</label>
            <div className="relative group">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={24} />
              <input
                ref={inputRef}
                type="text"
                required
                placeholder={isRTL ? "مثال: مطعم إليجانت السالمية، عيادة دنتال كير..." : "Ex: Elegant Restaurant Salmiya..."}
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                className="w-full bg-[#0a121e] border-2 border-solid border-white/10 rounded-2xl py-5 pr-14 pl-6 text-white text-lg font-black placeholder:text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* شبكة البيانات مع أسطر الشرح */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-3">
                <div className="bg-[#0a121e] border-2 border-solid border-white/5 p-6 rounded-[2rem] transition-colors hover:border-blue-500/30">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Calendar size={14} className="text-blue-500"/> {isRTL ? 'سنة التأسيس' : 'EST. YEAR'}</span>
                   <input type="number" value={formData.establishmentYear} onChange={(e) => setFormData({...formData, establishmentYear: e.target.value})} className="bg-transparent text-3xl font-black text-white w-full outline-none" />
                </div>
                <p className="text-[10px] text-slate-500 font-black px-2 leading-tight">{isRTL ? 'يجب وضع هذه البيانات لتحليل عمر مشروعك في السوق بشكل صحيح.' : 'Provide this to analyze your market lifespan correctly.'}</p>
             </div>
             
             <div className="space-y-3">
                <div className="bg-[#0a121e] border-2 border-solid border-white/5 p-6 rounded-[2rem] transition-colors hover:border-blue-500/30">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Star size={14} className="text-blue-500"/> {isRTL ? 'إجمالي التقييمات' : 'TOTAL REVIEWS'}</span>
                   <input type="number" value={formData.currentReviews} onChange={(e) => setFormData({...formData, currentReviews: e.target.value})} className="bg-transparent text-3xl font-black text-white w-full outline-none" />
                </div>
                <p className="text-[10px] text-slate-500 font-black px-2 leading-tight">{isRTL ? 'يجب وضع هذه البيانات لتقييم مصداقيتك الحالية في جوجل بشكل صحيح.' : 'Provide this to evaluate your Google credibility correctly.'}</p>
             </div>

             <div className="space-y-3">
                <div className="bg-[#0a121e] border-2 border-solid border-white/5 p-6 rounded-[2rem] transition-colors hover:border-blue-500/30">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Users size={14} className="text-blue-500"/> {isRTL ? 'العملاء يومياً' : 'DAILY CUSTOMERS'}</span>
                   <input type="number" value={formData.dailyCustomers} onChange={(e) => setFormData({...formData, dailyCustomers: e.target.value})} className="bg-transparent text-3xl font-black text-white w-full outline-none" />
                </div>
                <p className="text-[10px] text-slate-500 font-black px-2 leading-tight">{isRTL ? 'يجب وضع هذه البيانات لتحليل فرص النمو الضائعة يومياً بشكل صحيح.' : 'Provide this to analyze daily missed growth correctly.'}</p>
             </div>
          </div>

          {/* زر التشغيل (مضمون الربط والانتقال) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 py-7 rounded-[2.5rem] shadow-[0_25px_50px_rgba(37,99,235,0.4)] hover:shadow-blue-500/60 transition-all active:scale-[0.98] disabled:opacity-90"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-[1s] -translate-x-full skew-x-12"></div>
            <span className="relative flex items-center justify-center gap-3 text-white font-black text-2xl tracking-tighter uppercase">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={28} />
                  {isRTL ? 'جاري التحليل الاستراتيجي...' : 'STRATEGIC ANALYSIS...'}
                </>
              ) : (
                <>
                  {isRTL ? 'تشغيل الفحص العميق للهيمنة' : 'START DEEP DOMINANCE AUDIT'}
                  <Zap className="fill-yellow-400 text-yellow-400 animate-pulse" size={24} />
                </>
              )}
            </span>
          </button>
        </form>
      </div>

      <div className="text-center mt-12 text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] opacity-50">
         .ELEGANT OPTIONS. ALL RIGHTS RESERVED 2026 ©
      </div>
    </div>
  );
};

export default DataIntake;
