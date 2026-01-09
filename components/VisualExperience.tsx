// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, Camera, Mic, Star, 
  MapPin, MessageCircle, BadgeCheck, Zap, 
  ShieldAlert, TrendingUp, Lock, UserCog, Signal, Wifi, Battery, Sparkles, Timer,
  ArrowBigRight, ArrowBigLeft, MoveRight, MoveLeft, Info
} from 'lucide-react';

interface VisualExperienceProps {
  language: Language;
  data: AuditData;
  onBack: () => void;
}

const VisualExperience: React.FC<VisualExperienceProps> = ({ language, data, onBack }) => {
  const t = TEXTS[language];
  const isRTL = language === 'ar';
  
  const [stage, setStage] = useState<'chat' | 'survey' | 'post-demo'>('chat');
  const [msgVisible, setMsgVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (stage === 'chat') {
      const timer = setTimeout(() => setMsgVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleCtaClick = () => setStage('survey');
  const handleRatingClick = (r: number) => setRating(r);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setStage('post-demo'), 500);
  };

  const getCategorizedMessage = () => {
    const type = data.projectType as keyof typeof t.visualExp.messages;
    const baseMsg = t.visualExp.messages[type] || t.visualExp.messages.other;
    return baseMsg.replace('{projectName}', data.projectName || "Business");
  };

  const messageTemplate = getCategorizedMessage();
  const waNumber = "96566305551"; 
  const customWAMessage = isRTL 
    ? `مرحباً، أريد الاستفادة من خصم الـ 70% وتفعيل نظام Elegant Options لمشروعي (${data.projectName}).` 
    : `Hello, I want to claim the 70% discount and activate Elegant Options for my project (${data.projectName}).`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  // --- مكون الملاحظات الاستراتيجية الخارجية ---
  const LogicNote = ({ type }: { type: 'positive' | 'negative' }) => {
    const isPos = type === 'positive';
    return (
      <div className={`absolute z-50 w-72 p-5 rounded-[2rem] border-2 backdrop-blur-xl shadow-2xl transition-all duration-700 animate-fade-in
        ${isPos ? 'border-green-500/50 bg-green-950/20' : 'border-red-500/50 bg-red-950/20'}
        ${isRTL ? (isPos ? '-right-80' : '-left-80') : (isPos ? '-right-80' : '-left-80')}
        top-1/4`}
      >
        <div className="flex items-center gap-3 mb-3">
          {isPos ? <Sparkles className="text-green-400" /> : <ShieldAlert className="text-red-400" />}
          <h4 className={`font-black text-sm uppercase tracking-tighter ${isPos ? 'text-green-400' : 'text-red-400'}`}>
            {isPos ? (isRTL ? "منطق محرك النمو 🚀" : "Growth Engine Logic") : (isRTL ? "منطق درع الحماية 🛡️" : "Safety Shield Logic")}
          </h4>
        </div>
        <p className="text-white text-xs leading-relaxed font-bold opacity-90">
          {isPos 
            ? (isRTL ? "بما أن التقييم إيجابي، سيقوم النظام فوراً بتوجيه العميل لخرائط جوجل لتحويل رضاه إلى صدارة في البحث." : "Since the rating is positive, the system instantly directs the customer to Google Maps to convert satisfaction into SEO ranking.")
            : (isRTL ? "بما أن التقييم سلبي، سيقوم النظام بحجبه عن جوجل وفتح قناة اتصال سرية معك لحل المشكلة داخلياً." : "Since the rating is negative, the system blocks it from Google and opens a private channel with you to resolve it internally.")
          }
        </p>
        {/* الأسهم التوضيحية */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? (isPos ? '-left-12' : '-right-12') : (isPos ? '-left-12' : '-right-12')} text-white animate-pulse`}>
            {isPos ? (isRTL ? <MoveRight size={40} /> : <MoveLeft size={40} />) : (isRTL ? <MoveLeft size={40} /> : <MoveRight size={40} />)}
        </div>
      </div>
    );
  };

  const ChatView = () => (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#e5ddd5] h-full">
      {/* (نفس كود ChatView الأصلي بدون تغيير) */}
      <div className="bg-[#075e54]/95 p-3 pt-12 flex items-center justify-between text-white shadow-sm z-10 relative backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={onBack} />
          <div className="w-9 h-9 rounded-full bg-white flex-shrink-0 p-0.5 flex items-center justify-center">
             <span className="text-slate-800 font-bold text-sm">{data.projectName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
             <div className="flex items-center gap-1">
                <h3 className="text-[14px] font-bold truncate leading-tight">{data.projectName || "Business"}</h3>
                <BadgeCheck className="w-3.5 h-3.5 text-green-400 fill-white" />
             </div>
             <p className="text-[10px] opacity-80">Official Business Account</p>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-90">
          <Video className="w-5 h-5" /> <Phone className="w-5 h-5" /> <MoreVertical className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-hidden relative z-0" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
        <div className="flex justify-center mb-4">
          <span className="bg-[#dcf8c6]/90 backdrop-blur-sm text-[10px] text-slate-600 px-2 py-0.5 rounded-lg shadow-sm font-medium uppercase tracking-wide">
             {t.visualExp.status}
          </span>
        </div>
        {msgVisible && (
          <div className="animate-fade-in-up flex flex-col items-start max-w-[92%]">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm relative group">
              <svg viewBox="0 0 8 13" height="13" width="8" className={`absolute top-0 ${isRTL ? '-right-[8px] rotate-y-180' : '-left-[8px]'} fill-white`}><path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path></svg>
              <p className="text-[14px] text-[#111b21] leading-[1.5] whitespace-pre-wrap">{messageTemplate}</p>
              <div className="mt-3 pt-2 border-t border-slate-100">
                 <button onClick={handleCtaClick} className="w-full bg-[#f0f2f5] hover:bg-[#e4e6eb] active:bg-[#d8dadf] p-2.5 rounded-lg text-center transition-colors">
                    <span className="text-[#0084ff] font-semibold text-[14px]">{t.visualExp.cta}</span>
                 </button>
              </div>
              <div className="flex justify-end items-center gap-0.5 mt-1">
                 <span className="text-[10px] text-[#667781]">12:45 PM</span> <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-[#f0f2f5] px-2 py-2 flex items-end gap-2 relative z-10 pb-6 pt-3 shrink-0">
        <div className="bg-white flex-1 rounded-[24px] px-4 py-2.5 flex items-end gap-3 shadow-sm border border-slate-200/50">
            <Smile className="w-6 h-6 text-[#8696a0] mb-0.5" />
            <div className="flex-1 text-[16px] text-[#54656f] leading-[1.4] py-0.5">Message</div>
            <Paperclip className="w-5 h-5 text-[#8696a0] mb-0.5 rotate-[-45deg]" />
            <Camera className="w-5 h-5 text-[#8696a0] mb-0.5" />
        </div>
        <div className="bg-[#00a884] w-12 h-12 rounded-full flex items-center justify-center shadow-md shrink-0"><Mic className="w-6 h-6 text-white" /></div>
      </div>
    </div>
  );

  const SurveyView = () => (
    <div className="flex-1 flex flex-col bg-white animate-fade-in relative h-full overflow-hidden">
      <div className="pt-12 pb-3 px-4 flex flex-col items-center text-center bg-slate-50/80 border-b border-slate-100/80 backdrop-blur-md z-10 shrink-0">
        <div className="w-14 h-14 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center p-2 border border-slate-100 mb-2">
          <span className="text-2xl font-bold text-slate-800">{data.projectName.charAt(0)}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-base font-black text-slate-800 truncate max-w-[200px]">{data.projectName}</h3>
            <BadgeCheck className="w-4 h-4 text-green-500 fill-green-100" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between py-4 px-4 overflow-hidden bg-white">
          <div className="w-full space-y-4">
            <div className="px-2">
              <p className="text-sm font-bold text-slate-600 mb-3 text-center">{isRTL ? `كيف كانت تجربتك معنا؟` : t.survey.ratePrompt}</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRatingClick(star)} className="transition-all transform hover:scale-110 active:scale-90">
                    <Star className={`w-10 h-10 ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' : 'text-slate-200 fill-slate-50'}`} />
                  </button>
                ))}
              </div>
            </div>
            {rating > 0 && (
              <div className="px-2 animate-fade-in-up w-full space-y-3">
                <textarea placeholder={t.survey.placeholder} className="w-full min-h-[80px] p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none resize-none"></textarea>
                {rating >= 4 ? (
                  <button onClick={handleSubmit} className="w-full py-4 bg-[#0ea5e9] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" /> {isRTL ? "نشر على جوجل ماب" : t.survey.submitGoogle}
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="w-full py-4 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2">
                    <UserCog className="w-4 h-4" /> {t.survey.submitPrivate}
                  </button>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  );

  const PostDemoView = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 text-center animate-fade-in h-full">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100"><CheckCheck className="w-10 h-10 text-green-600" /></div>
        <h2 className="text-xl font-black text-slate-900 mb-4">{isRTL ? "هل أنت جاهز لأتمتة هذه العملية؟" : "Ready to Automate This?"}</h2>
        <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600">
            <p>{isRTL ? "النظام سيعمل في مشروعك 24 ساعة يومياً، يجمع الإيجابيات ويصد السلبيات تلقائياً." : "The system works 24/7, collecting positives and blocking negatives automatically."}</p>
        </div>
    </div>
  );

  return (
    <div className={`max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-10 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="space-y-4 w-full mb-8 px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            {isRTL ? "نظام النمو الذكي وحماية السمعة" : "Smart Growth & Reputation Shield"}
        </h2>
        <div className="bg-red-600/10 border border-red-500/50 backdrop-blur-md text-white py-2 px-6 rounded-full inline-flex items-center gap-3 animate-pulse">
            <Timer className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold">{isRTL ? "ينتهي خصم الـ 70% خلال:" : "70% Discount ends in:"} {formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* iPhone Simulation Container */}
      <div className="relative">
        
        {/* --- الملاحظات التوضيحية الخارجية --- */}
        {rating > 0 && rating <= 3 && <LogicNote type="negative" />}
        {rating >= 4 && <LogicNote type="positive" />}

        <div className="relative mx-auto w-[360px] h-[740px] bg-black rounded-[64px] shadow-[0_0_0_8px_#1a1a1a,0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10">
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-full z-30"></div>

          {/* Status Bar */}
          <div className="absolute top-0 inset-x-0 h-14 z-20 flex justify-between items-center px-9 pt-4 text-white text-[13px] font-semibold">
             <span>9:41</span> <div className="flex gap-1.5"><Signal size={16} /><Wifi size={16} /><Battery size={16} /></div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[58px] mt-2 mb-2 ml-2 mr-2 border border-black/10">
             {stage === 'chat' ? <ChatView /> : (stage === 'survey' ? <SurveyView /> : <PostDemoView />)}
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/20 rounded-full z-30"></div>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="w-full max-w-[400px] space-y-4 mt-12 px-4">
          <div className="relative group">
             <div className="absolute -top-5 z-20 bg-yellow-400 text-black font-black text-xs px-3 py-1.5 rounded-lg shadow-lg animate-bounce border-2 border-black rotate-3 right-0">
                🔥 {isRTL ? "خصم 70% متاح الآن" : "70% OFF Available Now"}
             </div>
             <a href={waLink} target="_blank" className="relative block w-full py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xl rounded-2xl shadow-xl text-center transform hover:-translate-y-1 transition-all">
                <span className="flex items-center justify-center gap-2"><Zap className="fill-yellow-300 text-yellow-300" /> {isRTL ? "اطلب النظام الآن" : "Order System Now"}</span>
             </a>
          </div>
          <button onClick={onBack} className="w-full py-3 text-slate-500 font-bold hover:text-white transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {t.back}
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
