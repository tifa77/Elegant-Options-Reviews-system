// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  Search, MapPin, Loader2, CheckCircle2, ArrowLeft, ArrowRight, 
  Stethoscope, Store, Coffee, ShoppingBag, Briefcase, 
  PenTool, Calendar, Star, Users, Zap 
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
    establishedYear: 2025,
    currentReviews: 0,
    dailyCustomers: 0,
    address: '',
    searchRanking: 'Analyzing...',
    monthlyGrowth: 0,
    weeklyGrowth: 0,
    positiveReviews: 0,
    negativeReviews: 0
  });

  const [mapUrl, setMapUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // تحديث الخريطة بناءً على الاسم المكتوب
  useEffect(() => {
    if (!formData.projectName) {
      setMapUrl(`https://maps.google.com/maps?q=Kuwait&hl=${isRTL ? 'ar' : 'en'}&t=&z=10&ie=UTF8&iwloc=&output=embed`);
      return;
    }

    const timer = setTimeout(() => {
      const query = encodeURIComponent(`${formData.projectName} ${formData.projectType}`);
      setMapUrl(`https://maps.google.com/maps?q=${query}&hl=${isRTL ? 'ar' : 'en'}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.projectName, formData.projectType, isRTL]);

  const handleConfirmLocation = () => {
    setIsExtracting(true);
    // محاكاة استخراج البيانات الحقيقية
    setTimeout(() => {
      setIsLocationConfirmed(true);
      setIsExtracting(false);
      if (formData.currentReviews === 0) {
        setFormData(prev => ({ ...prev, currentReviews: 12, address: "Verified Location" }));
      }
    }, 1500);
  };

  const categories = [
    { id: 'clinic', icon: Stethoscope, label: isRTL ? 'عيادة / طبي' : 'Clinic / Medical' },
    { id: 'restaurant', icon: Store, label: isRTL ? 'مطعم' : 'Restaurant' },
    { id: 'cafe', icon: Coffee, label: isRTL ? 'مقهى' : 'Cafe' },
    { id: 'shop', icon: ShoppingBag, label: isRTL ? 'محل تجاري' : 'Retail / Shop' },
    { id: 'other', icon: Briefcase, label: isRTL ? 'أخرى' : 'Other' },
  ];

  const getDynamicPlaceholder = () => {
    const placeholders = {
      clinic: isRTL ? "مثال: مستشفى السيف، عيادة رويال..." : "e.g. Al Seef Hospital, Royal Clinic...",
      restaurant: isRTL ? "مثال: مطعم فتوش، ميس الغانم..." : "e.g. Fatoush Restaurant, Mais Alghanim...",
      cafe: isRTL ? "مثال: كافيه بين، ستاربكس..." : "e.g. Coffee Bean, Starbucks...",
      shop: isRTL ? "مثال: إكسايت الغانم، متجر زارا..." : "e.g. Xcite Alghanim, Zara Store...",
      other: isRTL ? "أدخل اسم مشروعك هنا..." : "Enter your business name..."
    };
    return placeholders[formData.projectType] || placeholders.other;
  };

  return (
    <div className={`max-w-4xl mx-auto animate-fade-in pb-10 ${isRTL ? 'text-right font-tajawal' : 'text-left font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header Section */}
      <div className="text-center mb-10 pt-6">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
          ELEGANT <span className="text-primary-500">OPTIONS</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">AI Business Audit Tool</p>
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-6 md:p-10 shadow-2xl">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-10">
          
          {/* 1. Project Type Selector */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">{t.inputs.type}</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, projectType: cat.id})}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                    formData.projectType === cat.id ? 'bg-primary-500/10 border-primary-500 text-primary-400' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'
                  }`}
                >
                  <cat.icon size={24} className="mb-2" />
                  <span className="text-[10px] font-bold text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Map Section (Fixed Integration) */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <MapPin size={14} className="animate-pulse" /> {isRTL ? "الكشف المباشر عن الموقع" : "Live Location Detection"}
            </label>
            <div className="relative w-full h-64 bg-slate-900 rounded-[2rem] overflow-hidden border-2 border-slate-800 shadow-inner group">
              <iframe width="100%" height="100%" frameBorder="0" src={mapUrl} title="Location Map" className="grayscale opacity-50 group-hover:opacity-80 transition-all duration-700"></iframe>
              
              <div className="absolute inset-x-4 bottom-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLocationConfirmed ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isExtracting ? <Loader2 className="animate-spin text-white" /> : <MapPin className="text-white" size={20} />}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{formData.projectName || "..."}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{isLocationConfirmed ? "Location Verified" : "Detecting Address..."}</p>
                  </div>
                </div>
                <button type="button" onClick={handleConfirmLocation} className="text-[10px] font-black text-primary-400 uppercase hover:text-primary-300 transition-colors">
                  {isLocationConfirmed ? "✓ Confirmed" : "Confirm & Audit"}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Project Name */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">{t.inputs.name}</label>
            <div className="relative">
              <input 
                type="text" 
                required 
                className={`w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-5 text-white focus:border-primary-500 outline-none text-xl font-bold transition-all ${isRTL ? 'pr-14' : 'pl-14'}`}
                placeholder={getDynamicPlaceholder()}
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
              />
              <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-700 ${isRTL ? 'right-5' : 'left-5'}`} />
            </div>
          </div>

          {/* 4. The Three Aligned Input Boxes (Fixed Alignment) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Box 1 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col group hover:border-slate-700 transition-all">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 min-h-[30px] flex items-end">
                {isRTL ? "سنة التأسيس / افتتاح الفرع" : "Establishment / Branch Opening Year"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full bg-transparent text-white text-2xl font-black outline-none" 
                  value={formData.establishedYear} 
                  onChange={(e) => setFormData({...formData, establishedYear: parseInt(e.target.value) || 0})}
                />
                <Calendar className={`absolute top-1 text-slate-800 ${isRTL ? 'left-0' : 'right-0'}`} size={18} />
              </div>
            </div>

            {/* Box 2 (Aligned perfectly) */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col group hover:border-slate-700 transition-all">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 min-h-[30px] flex items-end">
                {isRTL ? "عدد التقييمات الحالي" : "Current Review Count"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full bg-transparent text-white text-2xl font-black outline-none" 
                  value={formData.currentReviews} 
                  onChange={(e) => setFormData({...formData, currentReviews: parseInt(e.target.value) || 0})}
                />
                <Star className={`absolute top-1 text-slate-800 ${isRTL ? 'left-0' : 'right-0'}`} size={18} />
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col group hover:border-slate-700 transition-all">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 min-h-[30px] flex items-end">
                {isRTL ? "متوسط العملاء يومياً" : "Approx. Daily Customers"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full bg-transparent text-white text-2xl font-black outline-none" 
                  value={formData.dailyCustomers} 
                  onChange={(e) => setFormData({...formData, dailyCustomers: parseInt(e.target.value) || 0})}
                />
                <Users className={`absolute top-1 text-slate-800 ${isRTL ? 'left-0' : 'right-0'}`} size={18} />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-black text-2xl py-6 rounded-[2rem] shadow-2xl shadow-primary-900/20 transform transition hover:-translate-y-1 active:scale-[0.98] uppercase tracking-[0.2em] flex items-center justify-center gap-3"
          >
            <Zap size={24} fill="white" /> {isRTL ? "بدء الفحص العميق" : "Run Deep Scan"}
          </button>
        </form>
      </div>

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <button onClick={onBack} className="text-slate-500 font-bold hover:text-white transition-colors text-sm uppercase tracking-widest">
          {isRTL ? "← العودة للرئيسية" : "← Back to Home"}
        </button>
      </div>
    </div>
  );
};

export default DataIntake;
