import React, { useState } from 'react';
import { 
  Search, MapPin, Calendar, Users, Star, 
  Store, Coffee, Stethoscope, ShoppingBag, Briefcase,
  Loader2, CheckCircle2, AlertCircle, PenTool
} from 'lucide-react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';

interface AuditFormProps {
  language: Language;
  onSubmit: (data: AuditData) => void;
}

const AuditForm: React.FC<AuditFormProps> = ({ language, onSubmit }) => {
  const t = TEXTS[language];
  const isRTL = language === 'ar';

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuditData>({
    projectName: '',
    projectType: 'restaurant',
    customProjectType: '',
    address: '',
    dailyCustomers: '',
    openingYear: new Date().getFullYear().toString(),
    currentReviews: '0', 
    monthlyGrowth: 0,
    weeklyGrowth: 0,
    positiveReviews: 0,
    negativeReviews: 0
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  const handleDetectLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setLocationDetected(true);
      setFormData(prev => ({ ...prev, address: isRTL ? 'السالمية، الكويت' : 'Salmiya, Kuwait' }));
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const finalType = formData.projectType === 'other' && formData.customProjectType 
        ? formData.customProjectType 
        : formData.projectType;
        
      onSubmit({ ...formData, projectType: finalType });
      setIsLoading(false);
    }, 1000);
  };

  const projectTypes = [
    { id: 'clinic', icon: Stethoscope, label: isRTL ? 'عيادة / طبي' : 'Clinic / Medical' },
    { id: 'restaurant', icon: Store, label: isRTL ? 'مطعم' : 'Restaurant' },
    { id: 'cafe', icon: Coffee, label: isRTL ? 'مقهى' : 'Cafe' },
    { id: 'retail', icon: ShoppingBag, label: isRTL ? 'متجر تجزئة' : 'Retail / Shop' },
    { id: 'other', icon: Briefcase, label: isRTL ? 'أخرى' : 'Other' },
  ];

  // رابط الخريطة المصحح ليعمل على اللغتين
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d111244.60537048701!2d47.9643571!3d29.3441584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1s${isRTL ? 'ar' : 'en'}!2skw!4v1700000000000!5m2!1s${isRTL ? 'ar' : 'en'}!2skw`;

  return (
    <div className={`w-full max-w-4xl mx-auto ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
        
        {/* 1. Project Type Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            {t.form.projectType}
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {projectTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, projectType: type.id })}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  formData.projectType === type.id
                    ? 'bg-[#0ea5e9]/10 border-[#0ea5e9] text-[#0ea5e9]'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <type.icon className="w-6 h-6" />
                <span className="text-[10px] font-bold text-center leading-tight">{type.label}</span>
              </button>
            ))}
          </div>

          {formData.projectType === 'other' && (
            <div className="animate-fade-in-up mt-2">
                <div className="relative">
                    <input
                        type="text"
                        autoFocus
                        value={formData.customProjectType}
                        onChange={(e) => setFormData({ ...formData, customProjectType: e.target.value })}
                        className={`block w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3 focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all text-sm font-medium ${isRTL ? 'pr-10' : 'pl-10'}`}
                        placeholder={isRTL ? "اكتب نوع نشاطك هنا (مثال: صالون، جيم...)" : "Type your activity (e.g. Salon, Gym...)"}
                    />
                    <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                        <PenTool className="h-4 w-4 text-slate-400" />
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* 2. Live Location Map */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-green-500 uppercase tracking-wider flex items-center gap-2 px-1">
            <MapPin className="w-4 h-4 animate-pulse" />
            {isRTL ? 'الكشف المباشر عن الموقع' : 'LIVE LOCATION DETECTION'}
          </label>
          
          <div className="relative w-full h-48 rounded-3xl overflow-hidden border-2 border-slate-800 group">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              title="map"
              className="opacity-70 grayscale group-hover:grayscale-0 transition-all"
              src={mapUrl}
            ></iframe>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 bg-slate-800/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 flex items-center justify-between shadow-lg">
               <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${locationDetected ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : (locationDetected ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />)}
                 </div>
                 <div className="min-w-0">
                    <h4 className="text-white text-sm font-bold truncate">{formData.projectName || (isRTL ? "اسم المشروع..." : "Project Name...")}</h4>
                    <p className="text-xs text-slate-400 truncate">{locationDetected ? (isRTL ? "تم تحديد الموقع" : "Detected") : (isRTL ? "اضغط للتأكيد" : "Tap to confirm")}</p>
                 </div>
               </div>
               {!locationDetected && (
                   <button type="button" onClick={handleDetectLocation} className="text-[10px] font-bold bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 rounded-lg">
                     {isRTL ? "تأكيد" : "CONFIRM"}
                   </button>
               )}
            </div>
          </div>
        </div>

        {/* 3. Project Name */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            {t.form.projectName}
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className={`block w-full bg-slate-900 border-2 border-slate-800 text-white placeholder-slate-500 rounded-2xl py-4 focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all text-lg font-medium ${isRTL ? 'pr-12' : 'pl-12'}`}
              placeholder={isRTL ? "مثال: مطعم فتوش السالمية" : "Ex: The Golden Spoon"}
            />
            <Search className={`absolute top-4.5 w-5 h-5 text-slate-500 ${isRTL ? 'right-4' : 'left-4'}`} />
          </div>
        </div>

        {/* 4. Bottom Grid (Fixed Alignment) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Opening Year */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 min-h-[40px] flex items-end">
                    {isRTL ? "سنة التأسيس / الفرع" : "ESTABLISHMENT / OPENING YEAR"}
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={formData.openingYear}
                        onChange={(e) => setFormData({ ...formData, openingYear: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-3 text-lg font-bold outline-none"
                    />
                    <Calendar className={`absolute top-3.5 w-5 h-5 text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`} />
                </div>
            </div>

            {/* Current Review Count */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 min-h-[40px] flex items-end">
                    {isRTL ? "عدد التقييمات الحالي" : "CURRENT REVIEW COUNT"}
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={formData.currentReviews}
                        onChange={(e) => setFormData({ ...formData, currentReviews: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-3 text-lg font-bold outline-none"
                    />
                    <Star className={`absolute top-3.5 w-5 h-5 text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`} />
                </div>
            </div>

            {/* Daily Customers */}
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 min-h-[40px] flex items-end">
                    {isRTL ? "متوسط العملاء يومياً" : "APPROX. DAILY CUSTOMERS"}
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={formData.dailyCustomers}
                        onChange={(e) => setFormData({ ...formData, dailyCustomers: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-3 text-lg font-bold outline-none"
                    />
                    <Users className={`absolute top-3.5 w-5 h-5 text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`} />
                </div>
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-2xl font-black text-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
        >
          {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : t.form.submit}
        </button>

      </form>
    </div>
  );
};

export default AuditForm;
