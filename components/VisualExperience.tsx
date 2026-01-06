import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, Camera, Mic, Star, 
  MapPin, MessageCircle, BadgeCheck, Zap, 
  ShieldAlert, TrendingUp, Lock, UserCog, Signal, Wifi, Battery
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
  
  // --- رسالة الواتساب الرسمية (بدون خصم) ---
  const waNumber = "96566305551"; 
  const customWAMessage = isRTL 
    ? `مرحباً، أريد تفعيل نظام Elegant Options لمشروعي (${data.projectName}) للبدء في حماية السمعة وزيادة المبيعات.` 
    : `Hello, I want to activate the Elegant Options system for my project (${data.projectName}) to start protecting reputation and boosting sales.`;
    
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  // --- مكون: شرح منطق النظام ---
  const SystemLogicExplainer = () => {
    if (rating === 0) return null;
    const isPositive = rating >= 4;

    return (
      <div className={`mt-4 mx-4 p-3 rounded-xl border-l-4 transition-all duration-500 animate-fade-in-up ${isPositive ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
        <div className="flex items-center gap-2 mb-2">
           {isPositive ? <TrendingUp className="text-green-600 w-5 h-5" /> : <ShieldAlert className="text-red-600 w-5 h-5" />}
           <h4 className={`font-bold text-sm ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
             {isPositive 
               ? (isRTL ? "محرك النمو الذكي: تفعيل النشر" : "Growth Engine: Public Boost") 
               : (isRTL ? "درع الحماية الذكي: تفعيل الخصوصية" : "Protection Shield: Privacy Mode")}
           </h4>
        </div>
        
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{isRTL ? "1. تحليل التقييم:" : "1. Analyze Rating:"} <strong>{rating}/5</strong></span>
           </div>
           <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{isRTL ? "2. الإجراء المتخذ:" : "2. System Action:"} 
                <strong>
                  {isPositive 
                    ? (isRTL ? " توجيه لخرائط جوجل (SEO)" : " Redirect to Google Maps") 
                    : (isRTL ? " منع النشر + تحويل للمدير" : " Block Public Post + Alert Manager")}
                </strong>
              </span>
           </div>
           {!isPositive && (
             <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold bg-red-100/50 p-1 rounded">
                <Lock className="w-3 h-3" />
                {isRTL ? "تم حماية سمعتك من تقييم سلبي علني" : "Your reputation is shielded"}
             </div>
           )}
        </div>
      </div>
    );
  };

  // --- مكون: شاشة الإغلاق البيعي ---
  const PostDemoView = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 text-center animate-fade-in h-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 w-full max-w-xs">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm animate-bounce-slow">
                <CheckCheck className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">
                {isRTL ? "هل أنت جاهز لأتمتة نمو مشروعك؟" : "Ready to Automate Your Growth?"}
            </h2>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 text-sm leading-relaxed text-slate-600 shadow-inner">
                <p className="mb-2 font-bold text-slate-800">
                    {isRTL ? "ما رأيته الآن هو محركنا الذكي لزيادة التقييمات." : "What you saw is our intelligent review engine."}
                </p>
                <p>
                    {isRTL 
                     ? "يمكننا تفعيل هذا النظام المتكامل لمشروعك لضمان تصدر نتائج البحث وحماية سمعتك من التقييمات السلبية بشكل أوتوماتيكي بالكامل."
                     : "We can activate this integrated system for your project to ensure top search rankings and fully automated protection from negative reviews."}
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 justify-center">
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                    <span>{isRTL ? "حماية أوتوماتيكية 24/7" : "24/7 Auto Protection"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 justify-center">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>{isRTL ? "زيادة ظهور جوجل" : "Boost Google Ranking"}</span>
                </div>
            </div>
        </div>
    </div>
  );

  // --- مكون: شاشة الاستبيان ---
  const SurveyView = () => (
    <div className="flex-1 flex flex-col bg-white animate-fade-in relative h-full">
      <div className="pt-12 pb-2 px-6 flex flex-col items-center text-center bg-slate-50 border-b border-slate-100">
        <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center p-2 border border-slate-100 mb-2">
          <span className="text-3xl font-bold text-slate-800">{data.projectName.charAt(0)}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-lg font-black text-slate-800">{data.projectName || "Business Name"}</h3>
            <BadgeCheck className="w-5 h-5 text-green-500 fill-green-100" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="w-full space-y-4 pt-4">
            <div className="bg-white px-4">
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
                    className="transition-all transform hover:scale-110 active:scale-95 focus:outline-none"
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating) 
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                          : 'text-slate-200 fill-slate-50'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <SystemLogicExplainer />

            {rating > 0 && (
              <div className="px-4 pb-4 animate-fade-in-up w-full space-y-3">
                <textarea
                  placeholder={t.survey.placeholder}
                  className="w-full h-20 p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm outline-none focus:border-blue-500 resize-none"
                ></textarea>

                {rating >= 4 ? (
                  <button 
                    onClick={handleSubmit}
                    className="w-full py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" /> {isRTL ? "نشر على جوجل" : t.survey.submitGoogle}
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
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

  // --- مكون: شاشة المحادثة ---
  const ChatView = () => (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#e5ddd5] h-full">
      <div className="bg-[#075e54] p-3 pt-12 flex items-center justify-between text-white shadow-sm z-10 relative">
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

      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar relative z-0" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
        <div className="flex justify-center mb-4">
          <span className="bg-[#dcf8c6]/90 backdrop-blur-sm text-[10px] text-slate-600 px-2 py-0.5 rounded-lg shadow-sm font-medium uppercase tracking-wide">
             {t.visualExp.status}
          </span>
        </div>

        {msgVisible && (
          <div className="animate-fade-in-up flex flex-col items-start max-w-[92%]">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative group">
              <svg viewBox="0 0 8 13" height="13" width="8" className={`absolute top-0 ${isRTL ? '-right-[8px] rotate-y-180' : '-left-[8px]'} fill-white`}><path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path></svg>
              <p className="text-[13.5px] text-[#111b21] leading-[1.4] whitespace-pre-wrap">
                {messageTemplate}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100">
                 <button onClick={handleCtaClick} className="w-full bg-[#f0f2f5] hover:bg-[#e4e6eb] active:bg-[#d8dadf] p-2.5 rounded-[6px] text-center transition-colors">
                    <span className="text-[#0084ff] font-semibold text-[13px]">{t.visualExp.cta}</span>
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

      <div className="bg-[#f0f2f5] px-2 py-2 flex items-end gap-2 relative z-10 pb-5">
        <div className="bg-white flex-1 rounded-[20px] px-3 py-2 flex items-end gap-2 shadow-sm border border-slate-200/50">
            <Smile className="w-6 h-6 text-[#8696a0] mb-0.5 cursor-pointer" />
            <div className="flex-1 text-[15px] text-[#54656f] leading-[1.4] py-0.5">Message</div>
            <Paperclip className="w-5 h-5 text-[#8696a0] mb-0.5 rotate-[-45deg]" />
            <Camera className="w-5 h-5 text-[#8696a0] mb-0.5" />
        </div>
        <div className="bg-[#00a884] w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-[#008f70] transition-colors shrink-0">
            <Mic className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto flex flex-col items-center animate-fade-in pb-10 ${isRTL ? 'font-tajawal' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. Header (Clean & Professional) */}
      <div className={`space-y-4 w-full mb-8 ${isRTL ? 'text-center' : 'text-left pl-4 md:pl-0'}`}>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
            {isRTL ? "نظام النمو الذكي وحماية السمعة" : "Smart Growth & Reputation Protection System"}
        </h2>
        <p className="text-slate-400 text-sm font-medium">
            {isRTL 
             ? "نظام أوتوماتيكي: يحفز الإيجابي، ويحتوي السلبي قبل أن ينتشر." 
             : "Automated System: Boosts positive reviews, contains negative ones before they spread."}
        </p>
      </div>

      {/* 2. iPhone Mockup */}
      <div className="relative w-full flex flex-col items-center">
        <div className="relative mx-auto w-[370px] h-[750px] bg-black rounded-[50px] shadow-[0_0_0_12px_#1a1a1a,0_0_0_14px_#333,0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col z-10">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-30 flex items-center justify-center gap-3 px-3">
             <div className="w-2 h-2 rounded-full bg-[#1a1a1a]/50"></div>
             <div className="w-16 h-20 bg-transparent"></div>
          </div>
          {/* Status Bar */}
          <div className="absolute top-0 inset-x-0 h-12 z-20 flex justify-between items-center px-8 pt-2 text-white text-[12px] font-medium">
             <span>9:41</span>
             <div className="flex gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
             </div>
          </div>
          {/* Content */}
          <div className="flex-1 relative flex flex-col overflow-hidden bg-slate-100 rounded-[40px]">
             {stage === 'chat' ? <ChatView /> : (stage === 'survey' ? <SurveyView /> : <PostDemoView />)}
          </div>
          {/* Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white rounded-full z-30 opacity-40"></div>
        </div>

        {/* 3. CTA Button (Clean) */}
        <div className="w-full max-w-[370px] space-y-4 mt-8 px-2">
           <div className="relative group cursor-pointer">
             <a 
               href={waLink} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="relative block w-full py-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] text-center transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden"
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
