import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, Camera, Mic, Star, 
  MapPin, MessageCircle, BadgeCheck, Zap, Clock, Timer
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

  // --- إضافة المؤقت (5 دقائق) ---
  const [timeLeft, setTimeLeft] = useState(300); // 300 ثانية = 5 دقائق

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // دالة تنسيق الوقت MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  // ---------------------------

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
  
  // رقم الواتساب المحدث ورسالة الخصم
  const waNumber = "96566305551"; 
  const customWAMessage = isRTL 
    ? `مرحباً، أريد حجز خصم الـ 70% (المتبقي ${formatTime(timeLeft)}) وتفعيل نظام Elegant Options لمشروعي (${data.projectName})` 
    : `Hello, I want to claim the 70% discount (Time left: ${formatTime(timeLeft)}) and activate Elegant Options for my project (${data.projectName})`;
    
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  // --- مكون شاشة الاستبيان ---
  const SurveyView = () => (
    <div className="flex-1 flex flex-col bg-white animate-fade-in overflow-hidden relative">
      {/* Survey Header */}
      <div className="pt-10 pb-6 px-6 flex flex-col items-center text-center bg-slate-50 border-b border-slate-100">
        <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center p-2 border border-slate-100 mb-3">
          <span className="text-3xl font-bold text-slate-800">{data.projectName.charAt(0)}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-lg font-black text-slate-800">{data.projectName || "Business Name"}</h3>
            <BadgeCheck className="w-5 h-5 text-green-500 fill-green-100" />
        </div>
      </div>

      {/* Survey Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!submitted ? (
            <div className="w-full space-y-6 pb-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-black text-slate-900 leading-tight">{t.survey.title}</h2>
                <p className="text-slate-400 text-xs font-bold">{t.survey.subtitle}</p>
              </div>

              <div className="space-y-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                <p className="text-sm font-bold text-slate-500 leading-relaxed text-center">
                  {isRTL ? `يرجى تقييم زيارتك لـ ${data.projectName}` : t.survey.ratePrompt.replace('{projectName}', data.projectName)}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRatingClick(star)}
                      className="transition-all transform hover:scale-110 active:scale-90 focus:outline-none"
                    >
                      <Star 
                        className={`w-9 h-9 ${
                          star <= (hoverRating || rating) 
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                            : 'text-slate-200 fill-slate-50'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {rating > 0 && (
                <div className="space-y-4 animate-fade-in-up w-full">
                  <div className={`p-4 rounded-2xl border shadow-sm transition-all transform ${rating >= 4 ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                    <h4 className={`text-base font-black mb-1 uppercase tracking-tight ${rating >= 4 ? 'text-green-600' : 'text-red-500'}`}>
                      {rating >= 4 ? t.survey.highStarsTitle : t.survey.lowStarsTitle}
                    </h4>
                    <p className={`text-[11px] leading-relaxed font-bold ${rating >= 4 ? 'text-green-600/70' : 'text-red-500/70'}`}>
                      {rating >= 4 ? t.survey.highStarsDesc : t.survey.lowStarsDesc}
                    </p>
                  </div>

                  <textarea
                    placeholder={t.survey.placeholder}
                    className="w-full h-20 p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm outline-none focus:border-blue-500 resize-none transition-all placeholder:text-slate-300"
                  ></textarea>

                  {rating >= 4 ? (
                    <button 
                      onClick={handleSubmit}
                      className="w-full py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <MapPin className="w-5 h-5" /> {isRTL ? "نشر على خرائط جوجل" : t.survey.submitGoogle}
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      className="w-full py-3 bg-slate-800 hover:bg-black text-white font-black text-base rounded-xl shadow-md transition-all transform active:scale-95"
                    >
                      {t.survey.submitPrivate}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-10 animate-fade-in h-full">
               <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <CheckCheck className="w-8 h-8 text-green-500" />
               </div>
               <h2 className="text-xl font-black text-slate-900">{t.visualExp.postDemoTitle}</h2>
               <p className="text-slate-500 text-xs font-bold px-8 text-center">{t.visualExp.postDemoDesc}</p>
            </div>
          )}
      </div>
      
       {/* Footer Branding */}
       <div className="p-3 flex flex-col items-center justify-center bg-slate-50 border-t border-slate-100 absolute bottom-0 w-full">
           <span className="text-[8px] text-slate-400 font-black tracking-[0.2em] uppercase">{t.survey.poweredBy}</span>
       </div>
    </div>
  );

  // --- مكون شاشة المحادثة ---
  const ChatView = () => (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#e5ddd5]">
      {/* Chat Header */}
      <div className="bg-[#075e54] p-3 pt-10 flex items-center justify-between text-white shadow-sm z-10 relative">
        <div className="flex items-center gap-2 overflow-hidden">
          <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={onBack} />
          <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 p-0.5 flex items-center justify-center">
             <span className="text-slate-800 font-bold text-sm">{data.projectName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
             <div className="flex items-center gap-1">
                <h3 className="text-[13px] font-bold truncate leading-tight">{data.projectName || "Business"}</h3>
                <BadgeCheck className="w-3 h-3 text-green-400 fill-white" />
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-90">
          <Video className="w-4 h-4" />
          <Phone className="w-4 h-4" />
          <MoreVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Chat Body - Scrollable */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar relative z-0" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
        <div className="flex justify-center mb-4">
          <span className="bg-[#dcf8c6]/80 backdrop-blur-sm text-[10px] text-slate-600 px-2 py-0.5 rounded-lg shadow-sm font-medium uppercase tracking-wide">
             {t.visualExp.status}
          </span>
        </div>

        {msgVisible && (
          <div className="animate-fade-in-up flex flex-col items-start max-w-[90%]">
            <div className="bg-white p-2.5 rounded-lg rounded-tl-none shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative group">
              {/* Triangle Tail */}
              <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" className="absolute top-0 -left-[8px] fill-white"><path opacity=".13" fill="#00000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path><path fill="currentColor" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path></svg>
              
              <p className="text-[12.5px] text-[#111b21] leading-[1.4] whitespace-pre-wrap">
                {messageTemplate}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100/50">
                 <button onClick={handleCtaClick} className="w-full bg-[#f0f2f5] hover:bg-[#e4e6eb] active:bg-[#d8dadf] p-2 rounded-[4px] text-center transition-colors">
                    <span className="text-[#0084ff] font-medium text-[13px]">{t.visualExp.cta}</span>
                 </button>
              </div>
              <div className="flex justify-end items-center gap-0.5 mt-1">
                 <span className="text-[9px] text-[#667781]">12:45 PM</span>
                 <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Footer (Input) */}
      <div className="bg-[#f0f2f5] px-2 py-1.5 flex items-end gap-2 relative z-10">
        <div className="bg-white flex-1 rounded-[18px] px-3 py-2 flex items-end gap-2 shadow-sm border border-slate-200/50">
            <Smile className="w-5 h-5 text-[#8696a0] mb-0.5 cursor-pointer hover:text-[#54656f]" />
            <div className="flex-1 text-[14px] text-[#54656f] leading-[1.4] max-h-[100px] overflow-y-auto py-0.5">Type a message</div>
            <Paperclip className="w-5 h-5 text-[#8696a0] mb-0.5 cursor-pointer hover:text-[#54656f] rotate-[-45deg]" />
            <Camera className="w-5 h-5 text-[#8696a0] mb-0.5 cursor-pointer hover:text-[#54656f]" />
        </div>
        <div className="bg-[#00a884] w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-[#008f70] transition-colors shrink-0">
            <Mic className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto flex flex-col items-center animate-fade-in pb-10 ${isRTL ? 'font-tajawal' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header Section with Timer */}
      <div className="text-center space-y-4 w-full mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{isRTL ? "تجربة بصرية تفاعلية" : t.visualExp.header}</h2>
        
        {/* Countdown Timer Banner */}
        <div className="bg-red-600/90 backdrop-blur-sm text-white py-2 px-6 rounded-full inline-flex items-center gap-3 shadow-lg animate-pulse border border-red-400/50 mx-auto">
            <Timer className="w-5 h-5 text-yellow-300" />
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                <span className="text-xs font-bold opacity-90">{isRTL ? "ينتهي خصم الـ 70% خلال:" : "70% Discount ends in:"}</span>
                <span className="text-lg font-black text-yellow-300 font-mono tracking-widest">
                    {formatTime(timeLeft)}
                </span>
            </div>
        </div>
      </div>

      {/* Phone Mockup Container - Fixed Aspect Ratio */}
      <div className="relative w-full flex flex-col items-center">
        <div className="relative mx-auto w-full max-w-[350px] aspect-[9/18.5] bg-black rounded-[3rem] border-[10px] border-black shadow-2xl overflow-hidden flex flex-col z-10 ring-4 ring-slate-900/50">
          {/* Phone Notch/StatusBar Placeholder */}
          <div className="absolute top-0 inset-x-0 h-7 bg-black z-20 pointer-events-none"></div>
          
          {/* Main Content Area */}
          <div className="flex-1 relative flex flex-col overflow-hidden bg-slate-100">
             {stage === 'chat' ? <ChatView /> : <SurveyView />}
          </div>

          {/* Phone Bottom Indicator Bar */}
          <div className="absolute bottom-0 inset-x-0 h-5 bg-black z-20 pointer-events-none flex items-center justify-center">
             <div className="w-1/3 h-1 bg-slate-700 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* New Exciting CTA Section */}
        <div className="w-full max-w-[350px] space-y-4 mt-8 px-2">
           <div className="relative group">
             {/* Animated Discount Badge */}
             <div className="absolute -top-4 right-4 z-20 bg-yellow-400 text-slate-900 font-black text-xs px-4 py-1.5 rounded-full shadow-lg animate-bounce border-2 border-slate-900 whitespace-nowrap">
                💰 {isRTL ? "خصم 70%!" : "70% OFF!"}
             </div>
             
             {/* Main Compound Button */}
             <a 
               href={waLink} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="relative w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 overflow-hidden group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1"
             >
               {/* Shine Effect */}
               <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
               <MessageCircle className="w-6 h-6 fill-white/20" />
               <span className="relative z-10">{isRTL ? "اطلب النظام الآن" : "Order System Now"}</span>
             </a>
           </div>

           <button 
             onClick={onBack} 
             className="w-full py-3 bg-transparent text-slate-400 font-bold rounded-xl border-2 border-slate-700 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
           >
             {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
             {t.back}
           </button>
        </div>
      </div>
    </div>
  );
};

export default VisualExperience;
