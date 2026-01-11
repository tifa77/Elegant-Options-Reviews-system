// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Utensils, Coffee, ShoppingBag, Stethoscope, 
  Globe, Calendar, Star, Users, Zap, Loader2, Radar, 
  MapPin, Hotel, CheckCircle2, Activity, PenTool, TrendingUp, Clock
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [projectType, setProjectType] = useState('restaurant');

  const [formData, setFormData] = useState({
    projectName: '',
    customType: '',
    establishmentYear: '2024', // القيمة الافتراضية للبدء
    currentReviews: 0,
    dailyCustomers: 50,
    address: '',
    positiveReviews: 0,
    negativeReviews: 0
  });

  // --- 1. تهيئة الخريطة وتحديد موقع العميل ---
  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 29.3759, lng: 47.9774 }, // إحداثيات الكويت
        zoom: 13,
        styles: [ { "elementType": "geometry", "stylers": [ { "color": "#212121" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] } ], 
        disableDefaultUI: true
      });
      setGoogleMap(map);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          map.setCenter(pos);
          new window.google.maps.Marker({ position: pos, map: map });
        });
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
        types: ['establishment'],
        fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'geometry']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
          new window.google.maps.Marker({ position: place.geometry.location, map: map });
          handleAutoFill(place);
        }
      });
    }
  }, []);

  const handleAutoFill = (place: any) => {
    setIsExtracting(true);
    setTimeout(() => {
      const totalReviews = place.user_ratings_total || 0;
      setFormData(prev => ({
        ...prev,
        projectName: place.name,
        address: place.formatted_address || '',
        currentReviews: totalReviews,
        positiveReviews: Math.floor(totalReviews * 0.85),
        negativeReviews: totalReviews - Math.floor(totalReviews * 0.85)
      }));
      setIsExtracting(false);
    }, 1000);
  };

  const types = [
    { id: 'clinic', icon: Stethoscope, label: isRTL ? 'عيادة طبية' : 'Clinic' },
    { id: 'cafe', icon: Coffee, label: isRTL ? 'كافيه' : 'Café' },
    { id: 'restaurant', icon: Utensils, label: isRTL ? 'مطعم' : 'Restaurant' },
    { id: 'hotel', icon: Hotel, label: isRTL ? 'فندق' : 'Hotel' },
    { id: 'other', icon: Globe, label: isRTL ? 'أخرى' : 'Other' },
  ];

  // --- 2. المحرك الحسابي للتحليل الفني ---
  const calculateAuditMetrics = () => {
    const currentYear = 2026;
    const yearsActive = Math.max(1, currentYear - parseInt(formData.establishmentYear));
    const totalDays = yearsActive * 365;
    const totalWeeks = yearsActive * 52;

    // معدل التقييمات الفعلي
    const dailyRate = (formData.currentReviews / totalDays).toFixed(2);
    const weeklyRate = (formData.currentReviews / totalWeeks).toFixed(2);

    // الشروحات التفسيرية للتقرير
    const explanations = {
      dailyRateDesc: isRTL 
        ? `هذا الرقم يمثل وتيرة نمو سمعتك الرقمية يومياً منذ عام ${formData.establishmentYear}.` 
        : `This represents the growth velocity of your digital reputation daily since ${formData.establishmentYear}.`,
      weeklyRateDesc: isRTL 
        ? `المعدل الأسبوعي الحالي يعكس مدى تفاعل العملاء الفعلي مع علامتك التجارية.` 
        : `The current weekly rate reflects actual customer engagement with your brand.`,
      marketDominance: isRTL
        ? `بناءً على التقييمات، أنت تغطي فقط ${(parseFloat(dailyRate) * 100 / formData.dailyCustomers).toFixed(1)}% من عملائك المحتملين.`
        : `Based on reviews, you are capturing only ${(parseFloat(dailyRate) * 100 / formData.dailyCustomers).toFixed(1)}% of your potential customers.`
    };

    return { dailyRate, weeklyRate, ...explanations };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const metrics = calculateAuditMetrics();

    setTimeout(() => {
      onSubmit({ 
        ...formData, 
        projectType: projectType === 'other' ? formData.customType : projectType,
        analysis: metrics // إرسال التحليلات والشروحات للتقرير
      });
    }, 1200);
  };

  return (
    <div className={`max-w-4xl mx-auto animate-fade-in pb-16 px-4 ${isRTL ? 'text-right font-tajawal' : 'text-left font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      <div className="text-center mb-10">
         <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {isRTL ? 'اكتشف حصتك السوقية الآن' : 'Discover Your Market Share'}
         </h1>
         <p className="text-blue-400 font-black text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {isRTL ? 'أدخل بيانات مشروعك بدقة للحصول على تقرير يحلل وضعك التنافسي.' : 'Enter project data for a competitive market report.'}
         </p>
      </div>

      <div className="bg-[#050a12] border-4 border-solid border-white/10 rounded-[3rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          
          {/* اختيار النوع */}
          <div className="space-y-4">
            <div className="text-[13px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
               <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
               {isRTL ? 'نوع المشروع' : 'PROJECT TYPE'}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {types.map((type) => (
                <button key={type.id} type="button" onClick={() => setProjectType(type.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-3xl border-4 border-solid transition-all ${projectType === type.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/20'}`}>
                  <type.icon size={24} className="mb-2" />
                  <span className="text-[11px] font-black">{type.label}</span>
                </button>
              ))}
            </div>
            {projectType === 'other' && (
              <div className="animate-fade-in-up mt-4 relative">
                <PenTool className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                <input type="text" required placeholder={isRTL ? "اكتب تخصص مشروعك هنا..." : "Enter custom type..."}
                  value={formData.customType} onChange={(e) => setFormData({...formData, customType: e.target.value})}
                  className="w-full bg-[#0a121e] border-2 border-solid border-blue-500/50 rounded-2xl py-4 pr-12 pl-4 text-white font-bold outline-none" />
              </div>
            )}
          </div>

          {/* الخريطة الحية */}
          <div className="space-y-4">
             <div className="text-[13px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
               <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
               {isRTL ? 'تحديد الموقع الجغرافي' : 'GEOGRAPHIC LOCATION'}
            </div>
            <div ref={mapRef} className="h-64 rounded-[2.5rem] border-4 border-solid border-white/10 shadow-inner bg-slate-900 overflow-hidden relative">
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  {!googleMap && <Loader2 className="animate-spin text-blue-500" size={32} />}
               </div>
            </div>
          </div>

          {/* مدخل اسم المشروع */}
          <div className="space-y-4">
            <label className="text-[13px] font-black text-blue-400 uppercase tracking-widest block">{isRTL ? 'اسم المشروع (كما يظهر في جوجل)' : 'PROJECT NAME'}</label>
            <div className="relative">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={28} />
              <input ref={inputRef} type="text" required placeholder={isRTL ? "ابدأ بكتابة الاسم واشترِ الموقع من القائمة..." : "Type and select from list..."}
                value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                className="w-full bg-[#0a121e] border-4 border-solid border-white/10 rounded-3xl py-6 pr-16 pl-8 text-white text-xl font-black focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          {/* شبكة البيانات (سنة التأسيس - التقييمات - العملاء) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#0a121e] border-4 border-solid border-white/5 p-6 rounded-[2.5rem]">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Clock size={16} className="text-blue-500"/> {isRTL ? 'سنة التأسيس' : 'EST. YEAR'}</span>
                <input type="number" min="1990" max="2026" value={formData.establishmentYear} onChange={(e) => setFormData({...formData, establishmentYear: e.target.value})} className="bg-transparent text-3xl font-black text-white w-full outline-none" />
             </div>
             
             <div className={`bg-[#0a121e] border-4 border-solid p-6 rounded-[2.5rem] transition-all ${isExtracting ? 'border-blue-500 animate-pulse' : 'border-white/5'}`}>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Star size={16} className="text-blue-500"/> {isRTL ? 'إجمالي التقييمات' : 'REVIEWS'}</span>
                <div className="text-4xl font-black text-white flex items-center gap-2">
                   {isExtracting ? <Loader2 className="animate-spin" size={24} /> : formData.currentReviews}
                   {!isExtracting && formData.currentReviews > 0 && <CheckCircle2 size={20} className="text-green-500" />}
                </div>
             </div>

             <div className="bg-[#0a121e] border-4 border-solid border-white/5 p-6 rounded-[2.5rem]">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2"><Users size={16} className="text-blue-500"/> {isRTL ? 'العملاء يومياً' : 'CUSTOMERS'}</span>
                <input type="number" value={formData.dailyCustomers} onChange={(e) => setFormData({...formData, dailyCustomers: parseInt(e.target.value)})} className="bg-transparent text-3xl font-black text-white w-full outline-none" />
             </div>
          </div>

          <button type="submit" disabled={loading || isExtracting}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 py-8 rounded-[3rem] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50">
            <span className="relative flex items-center justify-center gap-4 text-white font-black text-2xl tracking-tighter uppercase">
              {loading ? <Loader2 className="animate-spin" size={32} /> : (
                <>
                  {isRTL ? 'تشغيل الفحص العميق للهيمنة' : 'START DEEP AUDIT'} 
                  <Zap className="fill-yellow-400 text-yellow-400 animate-pulse" size={32} />
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataIntake;
