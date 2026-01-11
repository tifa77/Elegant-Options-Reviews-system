// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Utensils, Coffee, ShoppingBag, Stethoscope, 
  Globe, Star, Users, Loader2, MapPin, Hotel, 
  Calculator, TrendingUp, DollarSign, Calendar
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
  
  const [loading, setLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [projectType, setProjectType] = useState('restaurant');

  const [formData, setFormData] = useState({
    projectName: '',
    establishmentYear: '2024', // سنة التأسيس (أساسية للحساب)
    currentReviews: 0,
    googleRating: 0.0,
    dailyCustomers: 50,
    averageCheck: 15,
    address: '',
    positiveReviews: 0,
    negativeReviews: 0
  });

  // --- تهيئة الخريطة والبحث ---
  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 29.3759, lng: 47.9774 }, // الكويت
        zoom: 12,
        styles: [ { "elementType": "geometry", "stylers": [ { "color": "#121212" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] } ],
        disableDefaultUI: true
      });

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
        types: ['establishment'],
        fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          map.setCenter(place.geometry.location);
          map.setZoom(16);
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
      const rating = place.rating || 0;
      
      // معادلة السلبيات الديناميكية بناءً على التقييم
      const negFactor = rating > 0 ? (5 - rating) / 5 : 0.2;
      const negs = Math.floor(totalReviews * negFactor);

      setFormData(prev => ({
        ...prev,
        projectName: place.name,
        address: place.formatted_address || '',
        currentReviews: totalReviews,
        googleRating: rating,
        positiveReviews: totalReviews - negs,
        negativeReviews: negs,
      }));
      setIsExtracting(false);
    }, 1000);
  };

  const types = [
    { id: 'restaurant', icon: Utensils, label: isRTL ? 'مطعم' : 'Restaurant' },
    { id: 'cafe', icon: Coffee, label: isRTL ? 'كافيه' : 'Café' },
    { id: 'hotel', icon: Hotel, label: isRTL ? 'فندق' : 'Hotel' },
    { id: 'shop', icon: ShoppingBag, label: isRTL ? 'متجر' : 'Shop' },
    { id: 'clinic', icon: Stethoscope, label: isRTL ? 'عيادة' : 'Clinic' },
    { id: 'other', icon: Globe, label: isRTL ? 'أخرى' : 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- الحسابات المنطقية للوحة البيانات (Dashboard Logic) ---
    const currentYear = 2026;
    const yearsActive = Math.max(1, currentYear - parseInt(formData.establishmentYear));
    const totalDays = yearsActive * 365;

    // 1. المعدلات الحالية (التي كانت تظهر 0)
    const actualDailyRate = (formData.currentReviews / totalDays).toFixed(2);
    const actualWeeklyRate = (parseFloat(actualDailyRate) * 7).toFixed(1);

    // 2. أهداف Elegant Options (بناءً على عدد الزبائن اليومي)
    // نفترض أن النظام يحول 10% من الزبائن اليوميين لمقيمين
    const potentialWeekly = Math.max(35, Math.floor(formData.dailyCustomers * 7 * 0.1));
    const potentialMonthly = potentialWeekly * 4;
    const annualTarget = 1800; // الهدف الطموح لـ Elegant Options

    setTimeout(() => {
      onSubmit({ 
        ...formData, 
        projectType,
        stats: {
            actualDaily: actualDailyRate,
            actualWeekly: actualWeeklyRate,
            projectedWeekly: potentialWeekly,
            projectedMonthly: potentialMonthly,
            annualTarget: annualTarget,
            yearsActive: yearsActive
        }
      });
    }, 1200);
  };

  return (
    <div className={`max-w-5xl mx-auto animate-fade-in pb-16 px-4 ${isRTL ? 'text-right font-tajawal' : 'text-left font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Container الرئيسي - مطابق لصورة image_4ce1ac */}
      <div className="bg-[#050a12] border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* حقل البحث العلوي */}
          <div className="space-y-3">
             <label className="text-blue-500 font-bold text-sm px-2 flex items-center gap-2">
                <Search size={16} /> {isRTL ? 'ابحث عن نشاطك التجاري في جوجل' : 'Search your business on Google'}
             </label>
             <input ref={inputRef} type="text" required 
                placeholder={isRTL ? "اكتب اسم المطعم/النشاط هنا..." : "Type business name here..."}
                className="w-full bg-[#0e1623] border-2 border-[#1f2937] rounded-2xl py-6 px-6 text-white text-xl font-bold focus:border-blue-500 outline-none transition-all shadow-inner" />
          </div>

          {/* منطقة الخريطة والفئات (المنتصف) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
             {/* الفئات - 2 أعمدة */}
             <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {types.map((type) => (
                    <button key={type.id} type="button" onClick={() => setProjectType(type.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${projectType === type.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-[#0e1623] border-[#1f2937] text-slate-400 hover:border-slate-600'}`}>
                        <type.icon size={24} className="mb-2" />
                        <span className="text-xs font-bold">{type.label}</span>
                    </button>
                ))}
             </div>
             {/* الخريطة */}
             <div className="lg:col-span-7 h-[280px] rounded-3xl overflow-hidden border-2 border-[#1f2937] bg-[#0e1623]">
                <div ref={mapRef} className="w-full h-full opacity-70" />
             </div>
          </div>

          {/* حاسبة العوائد (الأسفل) - مطابق تماماً لصورة image_4ce1ac */}
          <div className="pt-4 border-t border-white/5">
             <div className="flex items-center gap-2 mb-6">
                <Calculator className="text-green-500" size={20} />
                <h3 className="text-white font-bold text-lg">{isRTL ? 'حاسبة العوائد المفقودة' : 'Lost Revenue Calculator'}</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* تقييم جوجل */}
                <div className="bg-[#0e1623] border border-[#1f2937] rounded-3xl p-6">
                    <label className="text-[11px] font-bold text-slate-400 uppercase mb-4 block">{isRTL ? 'تقييم جوجل الحالي' : 'CURRENT GOOGLE RATING'}</label>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="text-3xl font-black text-white">{formData.googleRating || '-'}</span>
                           <Star className="text-yellow-400 fill-yellow-400" size={20} />
                        </div>
                        <span className="text-[10px] text-slate-500">{isRTL ? `من ${formData.currentReviews} عميل` : `from ${formData.currentReviews} reviews`}</span>
                    </div>
                </div>

                {/* متوسط العملاء */}
                <div className="bg-[#0e1623] border border-[#1f2937] rounded-3xl p-6">
                    <label className="text-[11px] font-bold text-slate-400 uppercase mb-4 block">{isRTL ? 'متوسط العملاء (يومياً)' : 'DAILY CUSTOMERS'}</label>
                    <div className="flex items-center justify-between">
                        <input type="number" value={formData.dailyCustomers} onChange={(e) => setFormData({...formData, dailyCustomers: parseInt(e.target.value)})} className="bg-transparent text-3xl font-black text-white w-20 outline-none" />
                        <span className="text-slate-500 text-sm">Client</span>
                    </div>
                </div>

                {/* متوسط الفاتورة + سنة التأسيس (مدمجين للإقناع) */}
                <div className="bg-[#0b121e] border border-green-500/30 rounded-3xl p-6 relative">
                    <label className="text-[11px] font-bold text-green-500 uppercase flex items-center gap-1 mb-2">
                        <DollarSign size={12}/> {isRTL ? 'متوسط الفاتورة' : 'AVG CHECK'}
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">KWD</span>
                        <input type="number" value={formData.averageCheck} onChange={(e) => setFormData({...formData, averageCheck: parseInt(e.target.value)})} className="bg-transparent text-3xl font-black text-white w-full outline-none" />
                    </div>
                    {/* إضافة حقل السنة هنا لضمان دقة الحسابات */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 flex items-center gap-1"><Calendar size={10}/> {isRTL ? 'سنة الافتتاح:' : 'Opened in:'}</span>
                        <input type="number" value={formData.establishmentYear} onChange={(e) => setFormData({...formData, establishmentYear: e.target.value})} className="bg-transparent text-white font-bold w-12 outline-none" />
                    </div>
                </div>
             </div>
          </div>

          <button type="submit" disabled={loading || isExtracting}
            className="w-full bg-[#1f1f1f] hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 py-6 rounded-3xl text-slate-300 hover:text-white font-black text-xl transition-all duration-500 border border-white/10 group">
            <span className="flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : <>{isRTL ? 'كشف الأرباح الضائعة وتفعيل النظام' : 'REVEAL LOST REVENUE & ACTIVATE'} <TrendingUp className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/></>}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataIntake;
