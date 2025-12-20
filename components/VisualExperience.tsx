import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, Camera, Mic, Star, 
  MapPin, MessageCircle, BadgeCheck // ✅ أضفنا أيقونة التوثيق
} from 'lucide-react';

interface VisualExperienceProps {
  language: Language;
  data: AuditData;
  onBack: () => void;
}

const VisualExperience: React.FC<VisualExperienceProps> = ({ language, data, onBack }) => {
  const t = TEXTS[language];
  const isRTL = language === 'ar';
  
  const [stage, setStage] = useState<'chat' | 'survey'>('chat');
  const [msgVisible, setMsgVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (stage === 'chat') {
      const timer = setTimeout(() => setMsgVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleCtaClick = () => {
    setStage('survey');
  };

  const handleRatingClick = (r: number) => {
    setRating(r);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getCategorizedMessage = () => {
    const type = data.projectType as keyof typeof t.visualExp.messages;
    const baseMsg = t.visualExp.messages[type] || t.visualExp.messages.other;
    return baseMsg.replace('{projectName}', data.projectName || "Business");
  };

  const messageTemplate = getCategorizedMessage();
  
  const waNumber = "96550656365"; 
  const customWAMessage = isRTL 
    ? `مرحباً، أنا مهتم بنظام التقييمات Elegant Options لمشروعي (${data.projectName})` 
    : `Hello, I am interested in the Elegant Options reputation system for my project (${data.projectName})`;
    
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  const SurveyView = () => (
    <div className="flex-1 p-6 flex flex-col items-center text-center space-y-6 bg-white animate-fade-in overflow-y-auto">
      <div className="pt-2">
        <div className="w-20 h-20 mx-auto bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-center p-3 border border-slate-50">
          <span className="text-4xl font-bold text-slate-800">{data.projectName.charAt(0)}</span>
        </div>
        
        {/* اسم المشروع مع التوثيق في صفحة الاستبيان أيضاً */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
            <h3 className="text-xl font-black text-slate-800">{data.projectName || "Business Name"}</h3>
            <BadgeCheck className="w-5 h-5 text-green-500 fill-white" />
        </div>
      </div>

      {!submitted ? (
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{t.survey.title}</h2>
            <p className="text-slate-400 text-xs font-bold">{t.survey.subtitle}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-300 leading-relaxed px-4">
              {isRTL ? `يرجى تقييم زيارتك لـ ${data.projectName}` : t.survey.ratePrompt.replace('{projectName}', data.projectName)}
            </p>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(star)}
                  className="transition-all transform hover:scale-110 active:scale-90"
                >
                  <Star 
                    className={`w-12 h-12 ${
                      star <= (hoverRating || rating) 
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' 
                        : 'text-slate-100 fill-slate-100'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {rating > 0 && (
            <div className="space-y-4 animate-fade-in w-full pb-4">
              <div className={`p-6 rounded-[2rem] border shadow-sm transition-all transform ${rating >= 4 ? 'bg-green-50/40 border-green-100' : 'bg-red-50/40 border-red-100'}`}>
                <h4 className={`text-lg font-black mb-2 uppercase tracking-tight ${rating >= 4 ? 'text-green-600' : 'text-red-500'}`}>
                  {rating >= 4 ? t.survey.highStarsTitle : t.survey.lowStarsTitle}
                </h4>
                <p className={`text-xs leading-relaxed font-bold ${rating >= 4 ? 'text-green-600/70' : 'text-red-500/70'}`}>
                  {rating >= 4 ? t.survey.highStarsDesc : t.survey.lowStarsDesc}
                </p>
              </div>

              <div className="relative">
                <textarea
                  placeholder={t.survey.placeholder}
                  className="w-full h-24 p-4 bg-white border-2 border-slate-50 rounded-[1.5rem] text-slate-800 text-sm outline-none shadow-inner resize-none transition-all placeholder:text-slate-200"
                ></textarea>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-100 font-bold opacity-30">||</div>
              </div>

              {rating >= 4 ? (
                <button 
                  onClick={handleSubmit}
                  className="w-full py-5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-lg rounded-full shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95"
                >
                  <MapPin className="w-6 h-6" /> {isRTL ? "نشر على خرائط جوجل" : t.survey.submitGoogle}
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="w-full py-5 bg-slate-900 hover:bg-black text-white font-black text-lg rounded-full shadow-xl transition-all"
                >
                  {t.survey.submitPrivate}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-10 animate-fade-in">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <CheckCheck className="w-10 h-10 text-green-500" />
           </div>
           <h2 className="text-2xl font-black text-slate-900">{t.visualExp.postDemoTitle}</h2>
           <p className="text-slate-500 text-sm font-bold px-4">{t.visualExp.postDemoDesc}</p>
        </div>
      )}
    </div>
  );

  const ChatView = () => (
    <>
      <div className="bg-[#075e54] p-4 pt-10 flex items-center justify-between text-white">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 p-1 flex items-center justify-center">
             <span className="text-slate-800 font-bold text-lg">{data.projectName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
             {/* ✅ هنا أضفنا شارة التوثيق بجانب الاسم */}
            <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold truncate">{data.projectName || "Your Business"}</h3>
                <BadgeCheck className="w-4 h-4 text-green-400 fill-white" />
            </div>
            <p className="text-[10px] opacity-80">{t.visualExp.online}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 opacity-90">
          <Video className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 bg-[#e5ddd5] p-4 space-y-4 overflow-y-auto relative" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
        <div className="flex justify-center mb-6">
          <span className="bg-[#dcf8c6] text-[10px] text-slate-700 px-3 py-1 rounded-lg shadow-sm font-bold">
             {t.visualExp.status}
          </span>
        </div>

        {msgVisible && (
          <div className="animate-fade-in-up flex flex-col items-start max-w-[85%]">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm relative group">
              {/* مثلث المحادثة */}
              <div className={`absolute top-0 ${isRTL ? '-right-2 border-l-8 border-t-8 border-l-white border-t-transparent' : '-left-2 border-r-8 border-t-8 border-r-white border-t-transparent'}`}></div>
              
              <p className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                {messageTemplate}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100">
                 <button onClick={handleCtaClick} className="w-full bg-[#f0f2f5] p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-100 transition-colors">
                    <span className="text-blue-600 font-bold text-xs">{t.visualExp.cta}</span>
                 </button>
              </div>
              <div className="flex justify-end items-center gap-1 mt-1">
                 <span className="text-[9px] text-slate-400">12:45 PM</span>
                 <CheckCheck className="w-3 h-3 text-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#f0f2f5] p-3 flex items-center gap-2">
        <Smile className="w-6 h-6 text-slate-500" />
        <div className="flex-1 bg-white rounded-full px-4 py-2 text-[13px] text-slate-400">Type a message</div>
        <Paperclip className="w-6 h-6 text-slate-500" />
        <Camera className="w-6 h-6 text-slate-500" />
        <div className="bg-[#075e54] p-2 rounded-full text-white"><Mic className="w-5 h-5" /></div>
      </div>
    </>
  );

  return (
    <div className={`max-w-4xl mx-auto flex flex-col items-center gap-8 animate-fade-in pb-10 ${isRTL ? 'font-tajawal' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">{isRTL ? "شاشة واتساب تجريبية معتمدة" : t.visualExp.header}</h2>
        <p className="text-slate-400 text-sm">{t.visualExp.disclaimer}</p>
      </div>

      <div className="relative w-full flex flex-col items-center">
        {/* Mobile Device Mockup */}
        <div className="mx-auto w-[330px] md:w-[360px] h-[650px] md:h-[720px] bg-slate-900 rounded-[3rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
          {stage === 'chat' ? <ChatView /> : <SurveyView />}
          
          {stage === 'survey' && (
            <div className="p-4 flex flex-col items-center justify-center bg-slate-50 border-t border-slate-100">
               <span className="text-[10px] text-slate-300 font-black tracking-[0.2em] uppercase">{t.survey.poweredBy}</span>
            </div>
          )}
        </div>

        {/* PERMANENT WHATSAPP CTA - DYNAMIC */}
        <div className="w-full max-w-sm space-y-4 mt-10 px-4">
           <a 
             href={waLink} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-2xl shadow-2xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
           >
             <MessageCircle className="w-6 h-6" />
             {isRTL ? "اطلب النظام لمشروعك الآن" : "Order the system for your business"}
           </a>

           <button 
             onClick={onBack} 
             className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-3"
           >
             {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
             {t.back}
           </button>
        </div>
      </div>
    </div>
  );
};

export default VisualExperience;
