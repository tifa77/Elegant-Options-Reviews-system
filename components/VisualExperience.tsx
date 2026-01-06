import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, Camera, Mic, Star, 
  MapPin, MessageCircle, BadgeCheck, Zap, 
  ShieldAlert, TrendingUp, Lock, UserCog, Signal, Wifi, Battery, Sparkles, Timer
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

  // --- المؤقت التنازلي (5 دقائق) ---
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

  const handleCtaClick = () => {
    setStage('survey');
  };

  const handleRatingClick = (r: number) => {
    setRating(r);
  };

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
  
  // --- رسالة الواتساب (مع الخصم) ---
  const waNumber = "96566305551"; 
  const customWAMessage = isRTL 
    ? `مرحباً، أريد الاستفادة من خصم الـ 70% وتفعيل نظام Elegant Options لمشروعي (${data.projectName}).` 
    : `Hello, I want to claim the 70% discount and activate Elegant Options for my project (${data.projectName}).`;
    
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  // --- مكون: شرح منطق النظام ---
  const SystemLogicExplainer = () => {
    if (rating === 0) return null;
    const isPositive = rating >= 4;

    return (
      <div className={`mt-4 mx-4 p-3 rounded-2xl border transition-all duration-500 animate-fade-in-up shadow-sm ${isPositive ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'}`}>
        <div className="flex items-center gap-2 mb-2">
           {isPositive 
             ? <div className="p-1 bg-green-500 rounded-full text-white shadow-sm"><Sparkles className="w-3.5 h-3.5" /></div> 
             : <div className="p-1 bg-red-500 rounded-full text-white shadow-sm"><ShieldAlert className="w-3.5 h-3.5" /></div>
           }
           <h4 className={`font-black text-xs ${isPositive ? 'text-green-800' : 'text-red-800'}`}>
             {isPositive 
               ? (isRTL ? "تم تفعيل محرك النمو! 🚀" : "Growth Engine Activated! 🚀") 
               : (isRTL ? "تم تفعيل درع الحماية! 🛡️" : "Safety Shield Activated! 🛡️")}
           </h4>
        </div>
        
        <div className="space-y-2">
           <div className="flex items-start gap-2">
              <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${isPositive ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></div>
              <div className="text-[11px] text-slate-700 leading-snug">
                  <span className="font-bold block mb-0.5">{isRTL ? "تحليل الذكاء الاصطناعي:" : "AI Analysis:"}</span>
                  {isPositive 
                    ? (isRTL ? "العميل سعيد جداً (فرصة ذهبية للترويج)." : "Customer is happy (Golden opportunity).") 
                    : (isRTL ? "العميل غير راضٍ (خطر على السمعة)." : "Customer unhappy (Reputation risk).")}
              </div>
           </div>

           <div className="flex items-start gap-2">
              <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="text-[11px] text-slate-700 leading-snug">
                  <span className="font-bold block mb-0.5">{isRTL ? "الإجراء الذكي المتخذ:" : "Smart Action Taken:"}</span>
                  {isPositive 
                    ? (isRTL ? "✅ توجيه العميل فوراً لخرائط جوجل لرفع الترتيب." : "✅ Redirecting to Google Maps to boost SEO.") 
                    : (isRTL ? "⛔ منع النشر العلني + فتح قناة اتصال سرية للإرضاء." : "⛔ Block public post + Open private support channel.")}
              </div>
           </div>
        </div>
      </div>
    );
  };

  // --- مكون: شاشة الإغلاق البيعي ---
  const PostDemoView = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 text-center animate-fade-in h-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-blue-500"></div>
        <div className="relative z-10 w-full max-w-xs flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                <CheckCheck className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-4 leading-tight">
                {isRTL ? "هل أنت جاهز لأتمتة هذه العملية؟" : "Ready to Automate This?"}
            </h2>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 text-sm leading-relaxed text-slate-600">
                <p>
                    {isRTL 
                     ? "النظام الذي جربته للتو سيعمل في مشروعك 24 ساعة يومياً، يجمع التقييمات الإيجابية ويصد السلبية تلقائياً."
                     : "The system you just tested will work for your business 24/7, collecting positive reviews and blocking negative ones automatically."}
                </p>
            </div>
        </div>
    </div>
  );

  // --- مكون: شاشة الاستبيان (بدون سكرول) ---
  const SurveyView = () => (
    <div className="flex-1 flex flex-col bg-white animate-fade-in relative h-full overflow-hidden">
      <div className="pt-12 pb-3 px-4 flex flex-col items-center text-center bg-slate-50/80 border-b border-slate-100/80 backdrop-blur-md z-10 shrink-0">
        <div className="w-14 h-14 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center p-2 border border-slate-100 mb-2">
          <span className="text-2xl font-bold text-slate-800">{data.projectName.charAt(0)}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-base font-black text-slate-800 truncate max-w-[200px]">{data.projectName || "Business Name"}</h3>
            <BadgeCheck className="w-4 h-4 text-green-500 fill-green-100" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-4 px-4 overflow-hidden bg-white">
          <div className="w-full space-y-4">
            <div className="px-2">
              <p className="text-sm font-bold text-slate-600 mb-3 text-center">
                {isRTL ? `كيف كانت تجربتك معنا؟` : t.survey.ratePrompt.replace('{projectName}', data.projectName)}
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
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating) 
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' 
                          : 'text-slate-200 fill-slate-50'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <SystemLogicExplainer />

            {rating > 0 && (
              <div className="px-2 animate-fade-in-up w-full space-y-3">
                <textarea
                  placeholder={t.survey.placeholder}
                  className="w-full h-auto flex-1 min-h-[80px] p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all placeholder:text-slate-400"
                ></textarea>

                {rating >= 4 ? (
                  <button 
                    onClick={handleSubmit}
                    className="w-full py-3.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 transform active:scale-95 shrink-0"
                  >
                    <MapPin className="w-4 h-4" /> {isRTL ? "نشر على جوجل ماب" : t.survey.submitGoogle}
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 shrink-0"
                  >
                    <UserCog className="w-4 h-4" />
                    {t.survey.submitPrivate}
                  </button>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  );

  // --- مكون: شاشة المحادثة (بدون سكرول) ---
  const ChatView = () => (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#e5ddd5] h-full">
      <div className="bg-[#075e54]/95 p-3 pt-12 flex items-center justify-between text-white shadow-sm z-10 relative backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={onBack} />
          <div className="w-9 h-9 rounded-full bg-white flex-shrink-0 p-0.5 flex items-center justify-center">
             <span className="text-slate-800 font-bold text-sm">{data.projectName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
             <div className="flex items-center gap-1">
                <h3 className="text-[14px] font-bold truncate leading-tight">{data.projectName || "Business"}</h3>
                <BadgeCheck className="w-3.5 h-3.5 text-green-400 fill-white" />
             </div>
             <p className="text-[10px] opacity-80 text-left">Official Business Account</p>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-90">
          <Video className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
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
              <p className="text-[14px] text-[#111b21] leading-[1.5] whitespace-pre-wrap">
                {messageTemplate}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100">
                 <button onClick={handleCtaClick} className="w-full bg-[#f0f2f5] hover:bg-[#e4e6eb] active:bg-[#d8dadf] p-2.5 rounded-lg text-center transition-colors">
                    <span className="text-[#0084ff] font-semibold text-[14px]">{t.visualExp.cta}</span>
                 </button>
              </div>
              <div className="flex justify-end items-center gap-0.5 mt-1">
                 <span className="text-[10px] text-[#667781]">12:45 PM</span>
                 <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#f0f2f5] px-2 py-2 flex items-end gap-2 relative z-10 pb-6 pt-3 shrink-0">
        <div className="bg-white flex-1 rounded-[24px] px-4 py-2.5 flex items-end gap-3 shadow-sm border border-slate-200/50">
            <Smile className="w-6 h-6 text-[#8696a0] mb-0.5 cursor-pointer" />
            <div className="flex-1 text-[16px] text-[#54656f] leading-[1.4] py-0.5">Message</div>
            <Paperclip className="w-5 h-5 text-[#8696a0] mb-0.5 rotate-[-45deg]" />
            <Camera className="w-5 h-5 text-[#8696a0] mb-0.5" />
        </div>
        <div className="bg-[#00a884] w-12 h-12 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-[#008f70] transition-colors shrink-0">
            <Mic className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto flex flex-col items-center animate-fade-in pb-10 ${isRTL ? 'font-tajawal' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. Header (Centered for both languages) */}
      <div className="space-y-4 w-full mb-8 px-4 text-center mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
            {isRTL ? "نظام النمو الذكي وحماية السمعة" : "Smart Growth & Reputation Protection System"}
        </h2>
        <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            {isRTL 
             ? "نظام أوتوماتيكي متكامل: يحفز العملاء السعداء للنشر، ويحتوي العملاء الغاضبين قبل أن يكتبوا." 
             : "Automated System: Boosts positive reviews from happy customers, and intercepts negative feedback before it goes public."}
        </p>

        {/* --- بانر المؤقت (Centered) --- */}
        <div className="bg-red-600/10 border border-red-500/50 backdrop-blur-md text-white py-2 px-6 rounded-full inline-flex items-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse mx-auto">
            <Timer className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold tracking-wide">
                {isRTL ? "ينتهي خصم الـ 70% خلال:" : "70% Discount ends in:"}
            </span>
            <span className="text-xl font-black text-red-400 font-mono tracking-widest bg-slate-900/50 px-2 rounded-md">
                {formatTime(timeLeft)}
            </span>
        </div>
      </div>

      {/* 2. iPhone 17 Pro Max Titanium Mockup (Thinner Bezels, No Scrolling) */}
      <div className="relative w-full flex flex-col items-center">
        <div className="relative mx-auto w-[360px] h-[740px] bg-black rounded-[64px] shadow-[0_0_0_2px_#3a3a3a,0_0_0_4px_#1a1a1a,0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-10 ring-[3px] ring-[#5a5a5a]/50">
          
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-full z-30 flex items-center justify-center gap-3 px-3">
             <div className="w-2 h-2 rounded-full bg-[#1a1a1a]/80"></div>
             <div className="w-16 h-20 bg-transparent"></div>
          </div>

          {/* Status Bar */}
          <div className="absolute top-0 inset-x-0 h-14 z-20 flex justify-between items-center px-9 pt-4 text-white text-[13px] font-semibold tracking-wide">
             <span>9:41</span>
             <div className="flex gap-1.5 items-center">
                <Signal className="w-4 h-4" />
                <Wifi className="w-4 h-4" />
                <Battery className="w-5 h-5" />
             </div>
          </div>
          
          {/* Content Area (Fixed, No Scrolling) */}
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[58px] mt-2 mb-2 ml-2 mr-2 border border-black/10">
             {stage === 'chat' ? <ChatView /> : (stage === 'survey' ? <SurveyView /> : <PostDemoView />)}
          </div>

          {/* Bottom Swipe Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/20 rounded-full z-30 backdrop-blur-md"></div>
        </div>

        {/* 3. CTA Button (With Badge) */}
        <div className="w-full max-w-[370px] space-y-4 mt-10 px-2">
           <div className="relative group cursor-pointer">
             {/* --- شارة الخصم --- */}
             <div className={`absolute -top-5 z-20 bg-yellow-400 text-black font-black text-xs px-3 py-1.5 rounded-lg shadow-lg animate-bounce border-2 border-black rotate-3 right-0`}>
                🔥 {isRTL ? "خصم 70% لفترة محدودة" : "70% OFF Limited Time"}
             </div>

             <a 
               href={waLink} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="relative block w-full py-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] text-center transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden border border-green-400/30"
             >
               <span className="relative z-10 flex items-center justify-center gap-2">
                  <Zap className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                  {isRTL ? "اطلب النظام الآن" : "Order System Now"}
               </span>
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
             </a>
           </div>

           <button 
             onClick={onBack} 
             className="w-full py-3 text-slate-500 font-bold hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
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
