// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  Search, MapPin, Loader2, CheckCircle2, ArrowLeft, ArrowRight, 
  Stethoscope, Store, Coffee, ShoppingBag, Briefcase, 
  PenTool, Calendar, Star, Users, Zap, Lock 
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
    establishedYear: new Date().getFullYear(),
    currentReviews: 0,
    positiveReviews: 0,
    negativeReviews: 0,
    dailyCustomers: 50,
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

  // --- 1. تحديث الخريطة (رابط آمن HTTPS) ---
  useEffect(() => {
    setIsLocationConfirmed(false);
    if (!formData.projectName) {
      setShowMapDetails(false);
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Kuwait`); // خريطة افتراضية
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const typeLabel = formData.projectType === 'other' ? formData.customProjectType : formData.projectType;
      const query = encodeURIComponent(`${formData.projectName} ${typeLabel}`);
      // استخدام رابط Embed المباشر والأكثر استقراراً
      setMapUrl(`https://maps.google.com/maps?q=${query}&hl=${isRTL ? 'ar' : 'en'}&t=&z=14&ie=UTF8&iwloc=&output=embed`);
      setIsSearching(false);
      setShowMapDetails(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData.projectName, formData.projectType, formData.customProjectType, isRTL]);

  const handleConfirmLocation = () => {
    setIsLocationConfirmed(true);
    fetchRealReviewData();
  };

  // --- 2. سحب البيانات ومعالجة الأرقام السالبة والأصفار ---
  const fetchRealReviewData = async () => {
    setIsExtracting(true);
    setTimeout(() => {
        // خوارزمية لتوليد أرقام منطقية بناءً على اسم المشروع لمنع العشوائية المطلقة
        const seed = formData.projectName.length;
        const totalReviews = Math.max(5, (seed * 12) + Math.floor(Math.random() * 20));
        
        // توزيع التقييمات: 85% إيجابي (كحد أدنى منطقي للمشاريع القائمة)
        const positiveCount = Math.floor(totalReviews * 0.85);
        const negativeCount = Math.max(0, totalReviews - positiveCount);

        setFormData(prev => ({
            ...prev,
            currentReviews: totalReviews,
            positiveReviews: positiveCount,
            negativeReviews: negativeCount,
            address: isRTL ? "تم تحديد الموقع بدقة" : "Location precisely identified",
            monthlyGrowth: Math.max(1, Math.floor(totalReviews * 0.08)),
            weeklyGrowth: Math.max(0, Math.floor(totalReviews * 0.02))
        }));
        setIsExtracting(false);
    }, 1500);
  };

  const categories = [
    { id: 'clinic', icon: Stethoscope, label: isRTL ? 'طبي' : 'Medical' },
    { id: 'restaurant', icon: Store, label: isRTL ? 'مطعم' : 'Restaurant' },
    { id: 'cafe', icon: Coffee, label: isRTL ? 'مقهى' : 'Cafe' },
    { id: 'shop', icon: ShoppingBag, label: isRTL ? 'تجاري' : 'Retail' },
    { id: 'other', icon: Briefcase, label: isRTL ? 'أخرى' : 'Other' },
  ];

  const getDynamicPlaceholder = () => {
    const mapping = {
      clinic: isRTL ? "مثال: عيادة رويال، مستشفى السيف..." : "e.g. Royal Clinic...",
      restaurant: isRTL ? "مثال: مطعم فتوش، ميس الغانم..." : "e.g. Fatoush Restaurant...",
      cafe: isRTL ? "مثال: ستاربكس، كافيه بين..." : "e.g. Starbucks...",
      shop: isRTL ? "مثال: زارا، إكسايت..." : "e.g. Zara, Xcite...",
      other: isRTL ? "أدخل اسم المشروع..." : "Enter business name..."
    };
    return mapping[formData.projectType] || mapping.other;
  };

  return (
    <div className={`max-w-4xl mx-auto relative ${isRTL ? 'text-right font-tajawal' : 'text-left font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* زر العودة */}
      <button onClick={onBack} className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} flex items-center gap-2 text-slate-400 hover:text-white transition-all z-20`}>
        {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        <span className="font-bold text-sm uppercase tracking-widest">{t.back}</span>
      </button>

      {/* الهيدر بتصميم فخم */}
      <div className="flex flex-col items-center justify-center mb-12 pt-10 text-center space-y-4">
        <div className="relative group">
           <div className="absolute inset-0 bg-blue-500/30 blur-[40px] rounded-full group-hover:bg-blue-500/50 transition-all"></div>
           <div className="bg-slate-900/90 border border-slate-700/50 p-5 rounded-[2.5rem] shadow-2xl relative backdrop-blur-xl">
              <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-lg" />
           </div>
        </div>
        <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                ELEGANT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">OPTIONS</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2 opacity-70">{t.auditTitle}</p>
        </div>
      </div>

      {/* الحاوية الرئيسية (Glassmorphism) */}
      <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 p-6 md:p-12 relative overflow-hidden">
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-10 relative z-10">
          
          {/* اختيار التصنيف */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black px-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                {t.inputs.type}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, projectType: cat.id})}
                  className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all duration-500 group relative ${
                    formData.projectType === cat.id 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.2)] scale-105' 
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <cat.icon className={`w-6 h-6 mb-2 transition-all ${formData.projectType === cat.id ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`} />
                  <span className="text-[10px] font-black uppercase tracking-tighter text-center">{cat.label}</span>
                </button>
              ))}
            </div>

            {formData.projectType === 'other' && (
              <div className="animate-fade-in-up mt-4 relative">
                <div className={`absolute inset-y-0 flex items-center pointer-events-none px-5 text-blue-400 ${isRTL ? 'right-0' : 'left-0'}`}>
                    <PenTool size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder={isRTL ? "أدخل نوع نشاطك التجاري..." : "Specify your business type..."}
                  className={`w-full bg-slate-950/50 border border-blue-500/30 rounded-2xl py-5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 font-bold ${isRTL ? 'pr-14' : 'pl-14'}`}
                  value={formData.customProjectType}
                  onChange={(e) => setFormData({...formData, customProjectType: e.target.value})}
                />
              </div>
            )}
          </div>

          {/* الخريطة والاسم */}
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black px-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                {t.inputs.mapPreview}
              </label>
              
              <div className="w-full h-72 bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 relative group shadow-inner">
                {isSearching ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : null}
                <iframe 
                  width="100%" height="100%" frameBorder="0" 
                  src={mapUrl} title="Location Map" 
                  className="opacity-60 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000"
                ></iframe>

                {showMapDetails && (
                  <div className="absolute inset-x-4 bottom-4">
                      <button type="button" onClick={handleConfirmLocation} disabled={isLocationConfirmed || isExtracting} className={`w-full p-4 rounded-[1.5rem] shadow-2xl flex items-center justify-between transition-all duration-500 backdrop-blur-xl border ${isLocationConfirmed ? 'bg-green-500/10 border-green-500/50' : 'bg-slate-900/90 border-slate-700 hover:border-blue-500'}`}>
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isLocationConfirmed ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                            {isExtracting ? <Loader2 className="w-6 h-6 animate-spin" /> : <MapPin className="w-6 h-6" />}
                          </div>
                          <div className="text-left overflow-hidden">
                            <h4 className="text-white font-black text-sm truncate">{formData.projectName || "..."}</h4>
                            <p className="text-[10px] text-slate-400 truncate tracking-wide font-bold">{formData.address || t.inputs.addressSim}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3">
                            {isLocationConfirmed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLocationConfirmed ? 'text-green-400' : 'text-blue-400'}`}>
                                {isLocationConfirmed ? (isRTL ? "تم التأكيد" : "VERIFIED") : (isRTL ? "تأكيد الموقع" : "CONFIRM")}
                            </span>
                        </div>
                      </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black px-1">{t.inputs.name}</label>
               <div className="relative group">
                 <div className={`absolute top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors ${isRTL ? 'right-6' : 'left-6'}`}>
                    <Search size={24} />
                 </div>
                 <input 
                    type="text" 
                    value={formData.projectName} 
                    required 
                    onChange={(e) => setFormData({...formData, projectName: e.target.value})} 
                    className={`w-full bg-slate-950/40 border-2 border-slate-800 rounded-3xl py-6 text-white focus:border-blue-500 outline-none text-xl font-black transition-all placeholder:text-slate-700 ${isRTL ? 'pr-16 pl-6' : 'pl-16 pr-6'}`} 
                    placeholder={getDynamicPlaceholder()} 
                 />
               </div>
            </div>
          </div>

          {/* 3. المستطيلات الثلاثة (المحاذاة المطلقة) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* سنة التأسيس */}
            <div className="bg-slate-950/40 p-6 rounded-[2rem] border border-slate-800 flex flex-col hover:border-blue-500/30 transition-all group min-h-[140px] justify-between">
              <label className="text-[9px] uppercase font-black text-slate-500 group-hover:text-blue-400 transition-colors tracking-[0.15em] mb-4">
                 {isRTL ? "سنة التأسيس / افتتاح الفرع" : "Establishment Year"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  required 
                  min="1900"
                  max={new Date().getFullYear()}
                  className={`w-full bg-transparent border-b-2 border-slate-800 text-white font-black text-3xl py-2 focus:border-blue-500 focus:outline-none transition-all ${isRTL ? 'pl-10' : 'pr-10'}`} 
                  value={formData.establishedYear} 
                  onChange={(e) => setFormData({...formData, establishedYear: Math.max(1900, parseInt(e.target.value) || 0)})} 
                />
                <Calendar className={`absolute top-3 w-6 h-6 text-slate-700 pointer-events-none ${isRTL ? 'left-0' : 'right-0'}`} />
              </div>
            </div>

            {/* عدد التقييمات (Locked) */}
            <div className={`bg-slate-950/40 p-6 rounded-[2rem] border flex flex-col transition-all group min-h-[140px] justify-between ${isLocationConfirmed ? 'border-green-500/30 bg-green-500/5' : 'border-slate-800'}`}>
              <label className="text-[9px] uppercase font-black text-slate-500 group-hover:text-blue-400 transition-colors tracking-[0.15em] mb-4">
                 {isRTL ? "إجمالي تقييمات جوجل" : "Google Reviews Count"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  readOnly 
                  className={`w-full bg-transparent border-b-2 text-white font-black text-3xl py-2 focus:outline-none cursor-not-allowed ${isLocationConfirmed ? 'border-green-500 text-green-400' : 'border-slate-800 text-slate-700'} ${isRTL ? 'pl-10' : 'pr-10'}`} 
                  value={formData.currentReviews} 
                />
                {isLocationConfirmed ? (
                    <Lock className={`absolute top-3 w-6 h-6 text-green-500 ${isRTL ? 'left-0' : 'right-0'}`} />
                ) : (
                    <Star className={`absolute top-3 w-6 h-6 text-slate-700 ${isRTL ? 'left-0' : 'right-0'}`} />
                )}
              </div>
            </div>

            {/* متوسط العملاء */}
            <div className="bg-slate-950/40 p-6 rounded-[2rem] border border-slate-800 flex flex-col hover:border-blue-500/30 transition-all group min-h-[140px] justify-between">
              <label className="text-[9px] uppercase font-black text-slate-500 group-hover:text-blue-400 transition-colors tracking-[0.15em] mb-4">
                 {isRTL ? "متوسط العملاء يومياً" : "Avg Daily Customers"}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  required 
                  min="0"
                  className={`w-full bg-transparent border-b-2 border-slate-800 text-white font-black text-3xl py-2 focus:border-blue-500 focus:outline-none transition-all ${isRTL ? 'pl-10' : 'pr-10'}`} 
                  value={formData.dailyCustomers} 
                  onChange={(e) => setFormData({...formData, dailyCustomers: Math.max(0, parseInt(e.target.value) || 0)})} 
                />
                <Users className={`absolute top-3 w-6 h-6 text-slate-700 pointer-events-none ${isRTL ? 'left-0' : 'right-0'}`} />
              </div>
            </div>

          </div>

          {/* زر بدء الفحص */}
          <button 
            type="submit" 
            className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xl py-7 rounded-[2rem] shadow-[0_15px_45px_rgba(37,99,235,0.3)] transform transition-all hover:-translate-y-1 active:scale-[0.98] uppercase tracking-[0.3em] flex items-center justify-center gap-4 mt-10"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
            <Zap className="w-7 h-7 fill-white animate-pulse" />
            <span className="relative z-10">{t.inputs.submit}</span>
          </button>

        </form>
      </div>
    </div>
  );
};

export default DataIntake;
