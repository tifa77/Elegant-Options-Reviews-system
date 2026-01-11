// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Utensils, Coffee, ShoppingBag, Stethoscope, 
  Globe, Calendar, Star, Users, Zap, Loader2, 
  MapPin, Hotel, CheckCircle2, DollarSign, TrendingUp, Calculator
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
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [projectType, setProjectType] = useState('restaurant');

  const [formData, setFormData] = useState({
    projectName: '',
    establishmentYear: '2024',
    currentReviews: 0,
    googleRating: 0.0, // التقييم الحقيقي من جوجل
    dailyCustomers: 50,
    averageCheck: 15, // متوسط قيمة الفاتورة (مهم جداً للأرباح)
    address: '',
    positiveReviews: 0,
    negativeReviews: 0, // السلبيات المحتملة بناءً على التقييم
    projectedRevenue: 0 // الأرباح المتوقعة
  });

  // --- تهيئة الخريطة ---
  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 29.3759, lng: 47.9774 },
        zoom: 13,
        styles: [ { "elementType": "geometry", "stylers": [ { "color": "#212121" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] } ], 
        disableDefaultUI: true
      });
      setGoogleMap(map);
      setPlacesService(new window.google.maps.places.PlacesService(map));

      // تحديد الموقع الحالي
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          map.setCenter(pos);
          new window.google.maps.Marker({ position: pos, map: map });
        });
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
        types: ['establishment'],
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total']
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

  // --- الخوارزمية الذكية لاستخراج البيانات الواقعية ---
  const handleAutoFill = (place: any) => {
    setIsExtracting(true);
    
    // محاكاة بسيطة للوقت لجعل العميل يشعر أن النظام "يحلل"
    setTimeout(() => {
      const totalReviews = place.user_ratings_total || 0;
      const rating = place.rating || 0; // سحب التقييم الحقيقي (مثلاً 3.8)
      
      // معادلة حساب "السلبيات المحجوبة" (The Blocked Negatives Algorithm)
      // كلما قل التقييم عن 5، زادت نسبة السلبيات التي يمكن لنظامنا حجبها
      // المعادلة: (5 - التقييم) / 5 * عدد الريفيوهات * معامل تصحيح
      let negativeFactor = 0;
      if (rating > 0) {
        negativeFactor = (5 - rating) / 5; // مثال: تقييم 4.0 يعني 20% سلبيات محتملة
      } else {
        negativeFactor = 0.1; // افتراضي للمشاريع الجديدة
      }

      // تصحيح النسبة لتكون واقعية (ليست كل التقييمات غير الـ 5 نجوم هي سلبية كارثية)
      const calculatedNegatives = Math.floor(totalReviews * negativeFactor); 
      const calculatedPositives = totalReviews - calculatedNegatives;

      setFormData(prev => ({
        ...prev,
        projectName: place.name,
        address: place.formatted_address || '',
        currentReviews: totalReviews,
        googleRating: rating,
        positiveReviews: calculatedPositives,
        negativeReviews: calculatedNegatives,
        // نعيد تعيين الأرباح لتتم إعادة حسابها عند الضغط على زر الفحص
      }));
      setIsExtracting(false);
    }, 1500);
  };

  const types = [
    { id: 'restaurant', icon: Utensils, label: isRTL ? 'مطعم' : 'Restaurant' },
    { id: 'cafe', icon: Coffee, label: isRTL ? 'كافيه' : 'Café' },
    { id: 'clinic', icon: Stethoscope, label: isRTL ? 'عيادة' : 'Clinic' },
    { id: 'shop', icon: ShoppingBag, label: isRTL ? 'متجر' : 'Shop' },
    { id: 'hotel', icon: Hotel, label: isRTL ? 'فندق' : 'Hotel' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- معادلة التوقع المالي (The Financial Projection) ---
    // الافتراض: النظام سيقوم بزيادة التقييمات بنسبة 300% سنوياً على الأقل بناءً على عدد الزبائن اليومي
    // الزبائن السعداء الذين لا يكتبون تقييم عادة نسبتهم 90%
    const annualPotentialReviews = formData.dailyCustomers * 365 * 0.1; // نفترض أننا سنقنع 10% فقط
    const projectedAdditionalRevenue = annualPotentialReviews * formData.averageCheck;

    setTimeout(() => {
      onSubmit({ 
        ...formData, 
        projectType,
        // نمرر البيانات المالية المحسوبة بدقة
        financialData: {
            projectedRevenue: projectedAdditionalRevenue, // الأرباح المتوقعة خلال سنة
            missedRevenue: formData.negativeReviews * formData.averageCheck * 10 // الخسارة بسبب السمعة (كل تقييم سيء يطرد 10 عملاء)
        }
      });
    }, 1500);
  };

  return (
    <div className={`max-w-4xl mx-auto animate-fade-in pb-16 px-4 ${isRTL ? 'text-right font-tajawal' : 'text-left font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      <div className="text-center mb-8">
         <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {isRTL ? 'تحليل الهيمنة السوقية' : 'Market Dominance Audit'}
         </h1>
         <p className="text-blue-400 font-bold text-lg max-w-2xl mx-auto">
            {isRTL ? 'دع الأرقام الحقيقية تخبرك بما تخسره وكيف يمكن لـ Elegant Options مضاعفة أرباحك.' : 'Let real numbers show you lost revenue and potential growth.'}
         </p>
      </div>

      <div className="bg-[#050a12] border-4 border-white/10 rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* 1. البحث الذكي */}
          <div className="space-y-2">
            <label className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Search size={14} /> {isRTL ? 'ابحث عن نشاطك التجاري في جوجل' : 'FIND YOUR BUSINESS ON GOOGLE'}
            </label>
            <div className="relative group">
              <input ref={inputRef} type="text" required 
                placeholder={isRTL ? "اكتب اسم المطعم/النشاط هنا..." : "Type business name..."}
                defaultValue={formData.projectName}
                className="w-full bg-[#0a121e] border-4 border-white/10 rounded-2xl py-5 px-6 text-white text-lg font-bold focus:border-blue-500 outline-none transition-all group-hover:border-white/20" />
                {isExtracting && <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2`}><Loader2 className="animate-spin text-blue-500"/></div>}
            </div>
          </div>

          {/* 2. الخريطة ونوع النشاط */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="h-48 rounded-3xl border-4 border-white/10 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
                <div ref={mapRef} className="w-full h-full bg-slate-800" />
             </div>
             
             <div className="grid grid-cols-3 gap-3 content-start">
                {types.map((type) => (
                    <button key={type.id} type="button" onClick={() => setProjectType(type.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${projectType === type.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'}`}>
                    <type.icon size={20} className="mb-1" />
                    <span className="text-[10px] font-bold">{type.label}</span>
                    </button>
                ))}
             </div>
          </div>

          <hr className="border-white/5" />

          {/* 3. البيانات المالية والتشغيلية (السر هنا) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
                <Calculator className="text-green-400" size={20} />
                <h3 className="text-white font-bold text-lg">{isRTL ? 'حاسبة العوائد المفقودة' : 'Revenue Opportunity Calculator'}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* عدد التقييمات (مسحوب آلياً) */}
                <div className="bg-[#0a121e] p-5 rounded-3xl border-2 border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-black block mb-2">{isRTL ? 'تقييم جوجل الحالي' : 'GOOGLE RATING'}</span>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-white">{formData.googleRating || '-'}</span>
                        <Star className="text-yellow-400 fill-yellow-400 mb-1" size={18} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                        {isRTL ? `من ${formData.currentReviews} عميل` : `From ${formData.currentReviews} reviews`}
                    </div>
                </div>

                {/* العملاء يومياً */}
                <div className="bg-[#0a121e] p-5 rounded-3xl border-2 border-white/5 relative group focus-within:border-blue-500 transition-colors">
                    <span className="text-[10px] text-slate-500 uppercase font-black block mb-2 flex items-center gap-1"><Users size={12}/> {isRTL ? 'متوسط العملاء (يومياً)' : 'DAILY CUSTOMERS'}</span>
                    <input type="number" 
                        value={formData.dailyCustomers} 
                        onChange={(e) => setFormData({...formData, dailyCustomers: parseInt(e.target.value) || 0})}
                        className="w-full bg-transparent text-3xl font-black text-white outline-none" />
                     <span className="absolute bottom-5 right-5 text-slate-600 text-xs">Client</span>
                </div>

                {/* متوسط الفاتورة (الحقل الجديد الأهم) */}
                <div className="bg-[#0a121e] p-5 rounded-3xl border-2 border-green-500/20 focus-within:border-green-500 transition-colors relative">
                    <span className="text-[10px] text-green-400 uppercase font-black block mb-2 flex items-center gap-1"><DollarSign size={12}/> {isRTL ? 'متوسط قيمة الفاتورة' : 'AVG. TICKET VALUE'}</span>
                    <div className="flex items-center">
                        <input type="number" 
                            value={formData.averageCheck} 
                            onChange={(e) => setFormData({...formData, averageCheck: parseFloat(e.target.value) || 0})}
                            className="w-full bg-transparent text-3xl font-black text-white outline-none" />
                        <span className="text-green-500 font-bold text-sm">KWD</span>
                    </div>
                </div>
            </div>
          </div>

          <button type="submit" disabled={loading || isExtracting || formData.currentReviews === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-6 rounded-3xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:grayscale">
            <span className="flex items-center justify-center gap-3 text-white font-black text-xl tracking-tight">
              {loading ? <Loader2 className="animate-spin" /> : 
              <>
                {isRTL ? 'كشف الأرباح الضائعة وتفعيل النظام' : 'REVEAL LOST REVENUE & ACTIVATE'} 
                <TrendingUp size={24} className="text-green-300" />
              </>}
            </span>
          </button>

        </form>
      </div>
    </div>
  );
};

export default DataIntake;
