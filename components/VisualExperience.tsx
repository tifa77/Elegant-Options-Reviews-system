import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, Camera, Mic, Star, 
  MapPin, MessageCircle, BadgeCheck, Zap, Clock
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
  
  // رقم الواتساب المحدث (ثابت كما طلبت)
  const waNumber = "96566305551"; 
  const customWAMessage = isRTL 
    ? `مرحباً، أريد الاستفادة من خصم الـ 70% (المتبقي ${formatTime(timeLeft)}) وتفعيل نظام Elegant Options لمشروعي (${data.projectName})` 
    : `Hello, I want to claim the 70% discount (Time left: ${formatTime(timeLeft)}) and activate Elegant Options for my project (${data.projectName})`;
    
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(customWAMessage)}`;

  const SurveyView = () => (
    <div className="flex-1 p-6 flex flex-col items-center text-center space-y-6 bg-white animate-fade-in overflow-y-auto">
      <div className="pt-2">
        <div className="w-20 h-20 mx-auto bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-center p-3 border border-slate-50">
          <span className="text-4xl font-bold text-slate-800">{data.projectName.charAt(0)}</span>
        </div>
        
        {/* اسم المشروع مع التوثيق */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
            <h3 className="text-xl font-black text-slate-800">{data.projectName || "Business Name"}</h3>
            <BadgeCheck className="w-6 h-6 text-green-500 fill-green-100" />
        </div>
      </div>

      {!submitted ? (
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{t.survey.title}</h2>
            <p className="text-slate-400 text-xs font-bold">{t.survey.subtitle}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-400 leading-relaxed px-4">
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

          {rating > 0 && (
            <div className="space-y-4 animate-fade-in w-full pb-4">
              <div className={`p-6 rounded-[2rem] border shadow-sm transition-all transform ${rating >= 4 ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
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
                  className="w-full h-24 p-4 bg-white border-2 border-slate-100 rounded-[1.5rem] text-slate-800 text-sm outline-none shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all placeholder:text-slate-300"
                ></textarea>
              </div>

              {rating >= 4 ? (
                <button 
                  onClick={handleSubmit}
                  className="w-full py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 transform active:scale-95"
                >
                  <MapPin className="w-5 h-5" /> {isRTL ? "نشر على خرائط جوجل" : t.survey.submitGoogle}
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black text-lg rounded-2xl shadow-lg transition-all transform active:scale-95"
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
      <div className="bg-[#075e54] p-4 pt-8 flex items-center justify-between text-white shadow-md z-10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 p-1 flex items-center justify-center">
             <span className="text-slate-800 font-bold text-lg">{data.projectName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
             <div className="
