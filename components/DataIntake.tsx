// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  Search, MapPin, Loader2, CheckCircle2, ArrowLeft, ArrowRight, 
  Stethoscope, Utensils, Coffee, ShoppingBag, Briefcase, 
  PenTool, Calendar, Star, Users 
} from 'lucide-react';

interface DataIntakeProps {
  language: Language;
  onSubmit: (data: AuditData) => void;
  onBack: () => void;
}

const DataIntake: React.FC<DataIntakeProps> = ({ language, onSubmit, onBack }) => {
  const t = TEXTS[language];
  const isRTL = language === 'ar';
  
  const [formData, setFormData] = useState<AuditData>({
    projectName: '',
    projectType: 'restaurant',
    customProjectType: '',
    establishedYear: new Date().getFullYear() - 1,
    currentReviews: 0,
    positiveReviews: 0,
    negativeReviews: 0,
    dailyCustomers: 0,
    searchRanking: 'Not Ranked',
    monthlyGrowth: 0,
    weeklyGrowth: 0,
    address: ''
  });

  const [mapUrl, setMapUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showMapDetails, setShowMapDetails] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);

  // تحديث الخريطة تلقائياً
  useEffect(() => {
    setIsLocationConfirmed(false);
    setExtractionComplete(false);
    
    if (!formData.projectName) {
      setShowMapDetails(false);
      return;
    }

    setIsSearching(true);
    setShowMapDetails(false);

    const timer = setTimeout(() => {
      const query = `${formData.projectName} ${formData.projectType}`;
      const encodedQuery = encodeURIComponent(query);
      // إصلاح الرابط وتنظيفه ليعمل مع اللغتين
      setMapUrl(`https://maps.google.com/maps?q=${encodedQuery}&hl=${isRTL ? 'ar' : 'en'}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
      
      setIsSearching(false);
      setShowMapDetails(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData.projectName, formData.projectType, isRTL]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      projectType: formData.projectType === 'other' ? formData.customProjectType : formData.projectType
    };
    onSubmit(finalData);
  };

  const handleConfirmLocation = () => {
    setIsLocationConfirmed(true);
    fetchRealReviewData();
  };

  const fetchRealReviewData = async () => {
    setIsExtracting(true);
    try {
        if (!window.google || !window.google.maps) throw new Error("API Not Loaded");
        const { Place } = await window.google.maps.importLibrary("places") as any;
        const { places } = await Place.searchByText({
            textQuery: `${formData.projectName} ${formData.projectType}`,
            fields: ['displayName', 'formattedAddress', 'rating', 'userRatingCount'],
        });

        if (places && places.length > 0) {
            const place = places[0];
            const total = place.userRatingCount || 0;
            const rating = place.rating || 0;
            const positiveRatio = Math.max(0, Math.min(1, (rating / 5))); 
            const positiveCount = Math.round(total * positiveRatio);

            setFormData(prev => ({
                ...prev,
                currentReviews: total,
                positiveReviews: positiveCount,
                negativeReviews: total - positiveCount,
                address: place.formattedAddress || "Address Found",
                monthlyGrowth: Math.round(total * 0.05),
                weeklyGrowth: Math.round(total * 0.01)
            }));
            setExtractionComplete(true);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
    setIsExtracting(false);
  };

  const categories = [
    { id: 'clinic', icon: Stethoscope, label: t.inputs.categories.clinic },
    { id: 'restaurant', icon: Utensils, label: t.inputs.categories.restaurant },
    { id: 'cafe', icon: Coffee, label: t.inputs.categories.cafe },
    { id: 'shop', icon: ShoppingBag, label: t.inputs.categories.shop },
    { id: 'other', icon: Briefcase, label: t.inputs.categories.other },
  ];

  // دالة لتغيير المثال (Placeholder) حسب نوع المشروع
  const getDynamicPlaceholder = () => {
    const mapping = {
      clinic: isRTL ? "مثال: عيادة تجميل، مركز طبي..." : "e.g. Dental Clinic, Medical Center...",
      restaurant: isRTL ? "مثال: مطعم فتوش، برجر هيروز..." : "e.g. Burger Palace, Italian Bistro...",
      cafe: isRTL ? "مثال: ستاربكس، كافيه بين..." : "e.g. Central Perk, Coffee Bean...",
      shop: isRTL ? "مثال: معرض الذهب، متجر ملابس..." : "e.g. Fashion Hub, Tech Store...",
      other: isRTL ? "مثال: صالون، مصنع، شركة مقاولات..." : "e.g. Salon, Factory, Law Firm..."
    };
    return mapping[formData.projectType] || mapping.other;
  };

  return (
    <div className={`max-w-4xl mx-auto relative ${isRTL ? 'text-right font-tajawal' : 'text-left font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <button onClick={onBack} className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20`}>
        {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        <span className="font-medium text-sm">{t.back}</span>
      </button>

      <div className="flex flex-col items-center justify-center mb-8 pt-8 text-center">
        <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-3xl shadow-2xl relative mb-4">
           <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Logo" className="w-16 h-16 object-contain" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase">ELEGANT <span className="text-primary-500">OPTIONS</span></h1>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/50 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-slate-500 font-bold px-1">{t.inputs.type}</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, projectType: cat.id})}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                    formData.projectType === cat.id ? 'bg-primary-500/10 border-primary-500 text-primary-400 scale-105 shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <cat.icon className="w-5 h-5 mb-2" />
                  <span className="text-[10px] font-bold text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>

            {formData.projectType === 'other' && (
              <div className="animate-fade-in-up mt-4 relative">
                <input 
                  type="text" 
                  required
                  autoFocus
                  placeholder={isRTL ? "ما هو نوع نشاطك؟ (مثال: صالون، مصنع...)" : "What is your business type? (e.g. Salon, Factory...)"}
                  className={`w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 outline-none ${isRTL ? 'pr-10' : 'pl-10'}`}
                  value={formData.customProjectType}
                  onChange={(e) => setFormData({...formData, customProjectType: e.target.value})}
                />
                <PenTool className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-slate-500`} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-green-400 px-1">
                <MapPin className="w-3.5 h-3.5" /> {t.inputs.mapPreview}
              </label>
              <div className="w-full h-56 bg-slate-900 rounded-2xl overflow-hidden border border-slate-600 relative shadow-inner">
                <iframe width="100%" height="100%" frameBorder="0" src={mapUrl} title="Map" className="grayscale opacity-60"></iframe>
                {showMapDetails && (
                  <button type="button" onClick={handleConfirmLocation} disabled={isLocationConfirmed || isExtracting} className={`absolute inset-x-2 bottom-2 p-3 rounded-xl shadow-2xl flex items-center justify-between transition-all duration-300 ${isLocationConfirmed ? 'bg-slate-900/95 border-2 border-green-500' : 'bg-slate-800/90 border border-white/10 hover:border-primary-500/50'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`rounded-full p-2 flex-shrink-0 ${isLocationConfirmed ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isExtracting ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <MapPin className="w-5 h-5 text-white" />}
                      </div>
                      <div className="text-left overflow-hidden">
                        <h4 className="text-white font-bold text-sm truncate">{formData.projectName || "Business Name"}</h4>
                        <p className="text-[10px] text-slate-300 truncate">{formData.address || t.inputs.addressSim}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-primary-400 uppercase whitespace-nowrap ml-4">
                      {isLocationConfirmed ? t.inputs.locationConfirmed : (isRTL ? "تأكيد الموقع" : "Confirm")}
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs uppercase tracking-wider text-slate-500 font-bold px-1">{t.inputs.name}</label>
               <div className="relative">
                 <input 
                    type="text" 
                    value={formData.projectName} 
                    required 
                    onChange={(e) => setFormData({...formData, projectName: e.target.value})} 
                    className={`w-full bg-slate-900 border border-slate-600 rounded-2xl px-4 py-4 text-white focus:ring-2 focus:ring-primary-500 outline-none text-lg font-medium transition-all ${isRTL ? 'pr-12' : 'pl-12'}`} 
                    placeholder={getDynamicPlaceholder()} 
                 />
                 <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} w-5 h-5 text-slate-500`} />
               </div>
            </div>
          </div>

          {/* الحقول الثلاثة مع إصلاح المحاذاة ومنع القيم السالبة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 flex flex-col group">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 min-h-[40px] flex items-end">
                 {isRTL ? "سنة التأسيس / الفرع" : "Establishment / Opening Year"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  required 
                  min="1900"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 px-3 text-white font-bold focus:ring-1 focus:ring-primary-500 outline-none" 
                  value={formData.establishedYear} 
                  onChange={(e) => setFormData({...formData, establishedYear: Math.max(0, parseInt(e.target.value) || 0)})} 
                />
                <Calendar className={`absolute top-3 w-4 h-4 text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`} />
              </div>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 flex flex-col group">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 min-h-[40px] flex items-end">
                 {isRTL ? "عدد التقييمات الحالي" : "Current Review Count"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  required 
                  min="0"
                  className={`w-full bg-slate-900 border rounded-xl py-3 px-3 text-white font-bold focus:ring-1 focus:ring-primary-500 outline-none ${extractionComplete ? 'border-green-500/50' : 'border-slate-600'}`} 
                  value={formData.currentReviews} 
                  onChange={(e) => setFormData({...formData, currentReviews: Math.max(0, parseInt(e.target.value) || 0)})} 
                />
                <Star className={`absolute top-3 w-4 h-4 text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`} />
              </div>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 flex flex-col group">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 min-h-[40px] flex items-end">
                 {isRTL ? "متوسط العملاء يومياً" : "Approx. Daily Customers"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  required 
                  min="0"
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 px-3 text-white font-bold focus:ring-1 focus:ring-primary-500 outline-none" 
                  value={formData.dailyCustomers} 
                  onChange={(e) => setFormData({...formData, dailyCustomers: Math.max(0, parseInt(e.target.value) || 0)})} 
                />
                <Users className={`absolute top-3 w-4 h-4 text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`} />
              </div>
            </div>

          </div>

          <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black text-xl py-5 rounded-2xl shadow-2xl transform transition active:scale-[0.98] uppercase tracking-[0.2em] mt-4">
            {t.inputs.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataIntake;
