// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Search, Utensils, Coffee, ShoppingBag, Stethoscope, Globe, Hotel, Calendar, Users, DollarSign, Star, Zap, Loader2, TrendingUp } from 'lucide-react';

const DataIntake = ({ language, onSubmit }) => {
  const isRTL = language === 'ar';
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [projectType, setProjectType] = useState('restaurant');
  const [formData, setFormData] = useState({
    projectName: '', establishmentYear: '2024', currentReviews: 0,
    googleRating: 0, dailyCustomers: 50, averageCheck: 15, address: ''
  });

  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 29.3759, lng: 47.9774 }, zoom: 12,
        styles: [{ "elementType": "geometry", "stylers": [{ "color": "#0a121e" }] }],
        disableDefaultUI: true
      });
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setFormData(prev => ({
          ...prev, projectName: place.name, currentReviews: place.user_ratings_total || 0,
          googleRating: place.rating || 0, address: place.formatted_address || ''
        }));
      });
    }
  }, []);

  const types = [
    { id: 'restaurant', icon: Utensils, label: isRTL ? 'مطعم' : 'Restaurant' },
    { id: 'cafe', icon: Coffee, label: isRTL ? 'كافيه' : 'Café' },
    { id: 'hotel', icon: Hotel, label: isRTL ? 'فندق' : 'Hotel' },
    { id: 'shop', icon: ShoppingBag, label: isRTL ? 'متجر' : 'Shop' },
    { id: 'clinic', icon: Stethoscope, label: isRTL ? 'عيادة' : 'Clinic' },
    { id: 'other', icon: Globe, label: isRTL ? 'أخرى' : 'Other' },
  ];

  return (
    <div className={`max-w-6xl mx-auto pb-16 px-4 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-[#050a12] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
        <form onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => onSubmit(formData), 1000); }} className="space-y-8">
          
          <div className="space-y-3">
             <label className="text-blue-500 font-bold text-sm px-2 flex items-center gap-2"><Search size={16}/> {isRTL ? 'ابحث عن نشاطك التجاري في جوجل' : 'Search your business'}</label>
             <input ref={inputRef} type="text" placeholder={isRTL ? "اكتب اسم المطعم/النشاط هنا..." : "Type business name..."} className="w-full bg-[#0e1623] border border-[#1f2937] rounded-2xl py-6 px-6 text-white text-xl font-bold focus:border-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[300px]">
             <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {types.map((type) => (
                    <button key={type.id} type="button" onClick={() => setProjectType(type.id)} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${projectType === type.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-[#0e1623] border-[#1f2937] text-slate-400'}`}>
                        <type.icon size={22} className="mb-2" /><span className="text-xs font-bold">{type.label}</span>
                    </button>
                ))}
             </div>
             <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#1f2937] bg-[#0e1623]">
                <div ref={mapRef} className="w-full h-full opacity-70" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-white/5 pt-6">
            <div className="bg-[#0b121e] border border-green-500/30 rounded-3xl p-6">
                <label className="text-[11px] font-bold text-green-500 flex items-center gap-1 mb-2"><DollarSign size={12}/> {isRTL ? 'متوسط الفاتورة' : 'AVG TICKET'}</label>
                <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">KWD</span>
                    <input type="number" value={formData.averageCheck} onChange={(e) => setFormData({...formData, averageCheck: e.target.value})} className="bg-transparent text-3xl font-black text-white w-full outline-none" />
                </div>
                <div className="mt-3 flex justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2">
                    <span>{isRTL ? 'سنة الافتتاح:' : 'Opened:'}</span>
                    <input type="number" value={formData.establishmentYear} onChange={(e) => setFormData({...formData, establishmentYear: e.target.value})} className="bg-transparent text-white font-bold w-12 text-right outline-none" />
                </div>
            </div>
            {/* بطاقات البيانات الأخرى */}
            <div className="bg-[#0e1623] border border-[#1f2937] rounded-3xl p-6 flex flex-col justify-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 block">{isRTL ? 'متوسط العملاء (يومياً)' : 'DAILY CUSTOMERS'}</label>
                <input type="number" value={formData.dailyCustomers} onChange={(e) => setFormData({...formData, dailyCustomers: e.target.value})} className="bg-transparent text-3xl font-black text-white outline-none" />
            </div>
            <div className="bg-[#0e1623] border border-[#1f2937] rounded-3xl p-6 flex flex-col justify-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 block">{isRTL ? 'تقييم جوجل الحالي' : 'RATING'}</label>
                <div className="flex items-center gap-2 text-3xl font-black text-white">
                  {formData.googleRating} <Star className="text-yellow-400 fill-yellow-400" size={20} />
                </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#1c1c1c] hover:bg-blue-600 py-6 rounded-3xl text-white font-black text-xl border border-white/10 transition-all shadow-xl">
             {loading ? <Loader2 className="animate-spin mx-auto"/> : isRTL ? 'كشف الأرباح الضائعة وتفعيل النظام' : 'ACTIVATE SYSTEM'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataIntake;
