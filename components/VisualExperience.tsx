// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, Camera, Mic, Star, 
  MapPin, MessageCircle, BadgeCheck, Zap, 
  ShieldAlert, TrendingUp, Lock, UserCog, Signal, Wifi, Battery, Sparkles, Timer,
  MoveRight, MoveLeft, Info, Frown, Meh, Languages
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
  const [rating, setRating] = useState<null | 'happy' | 'neutral' | 'sad'>(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (stage === 'chat') {
      const timer = setTimeout(() => setMsgVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleCtaClick = () => setStage('survey');
  
  const waNumber = "96566305551"; 
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(isRTL ? `مرحباً، أريد تفعيل نظام Elegant Options لمشروعي (${data.projectName}).` : `Hi, I want to activate Elegant Options for (${data.projectName}).`)}`;

  // --- مكون الملاحظات الإرشادية الخارجية ---
  const SidebarGuide = ({ side, title, text, icon: Icon, color, visible }: any) => {
    if (!visible) return null;
    return (
      <div className={`absolute z-50 w-64 p-5 rounded-[2rem] border-2 backdrop-blur-xl shadow-2xl animate-fade-in transition-all duration-700
        ${color === 'green' ? 'border-green-500/50 bg-green-950/20' : color === 'red' ? 'border-red-500/50 bg-red-950/20' : 'border-blue-500/30 bg-slate-900/80'}
        ${side === 'left' ? '-left-72' : '-right-72'} top-1/4`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-5 h-5 ${color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
          <h4 className="text-white font-black text-xs uppercase tracking-tighter">{title}</h4>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed font-bold">{text}</p>
        <div className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? '-right-10' : '-left-10'} text-white/50 animate-bounce-x`}>
           {side === 'left' ? <MoveRight size={32} /> : <MoveLeft size={32} />}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-10 ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header */}
      <div className="space-y-4 w-full mb-12 px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            {isRTL ? "محاكي تجربة العميل الذكية" : "Smart Customer Experience Demo"}
        </h2>
        <p className="text-blue-400 text-lg md:text-xl font-bold italic">
            {isRTL ? "« حوّل كل عملية بيع إلى جيش من التقييمات الإيجابية وسدّ الباب أمام السلبيات تلقائياً »" 
                   : "« Turn every sale into a positive review army & block negatives automatically »"}
        </p>
      </div>

      {/* iPhone Mockup Container */}
      <div className="relative">
        
        {/* 1. إرشاد البداية: توضيح متى ترسل الرسالة */}
        <SidebarGuide 
          side={isRTL ? 'right' : 'left'} 
          visible={stage === 'chat'} 
          title={isRTL ? "الأتمتة الذكية" : "Smart Automation"}
          color="blue"
          icon={Zap}
          text={isRTL ? "بمجرد استلام العميل لطلبه أو انتهاء الخدمة، يرسل النظام هذه الرسالة تلقائياً (قابلة للتخصيص بالكامل حسب مشروعك)." : "As soon as the customer receives their order, the system sends this message automatically (Fully customizable)."}
        />

        {/* 2. إرشاد الدرع: عند التقييم السلبي */}
        <SidebarGuide 
          side={isRTL ? 'left' : 'right'} 
          visible={stage === 'survey' && (rating === 'sad' || rating === 'neutral')} 
          title={isRTL ? "درع حماية السمعة 🛡️" : "Reputation Shield"}
          color="red"
          icon={ShieldAlert}
          text={isRTL ? "النظام اكتشف عدم رضا! سيتم حجب هذا التقييم عن جوجل وتوجيه العميل لرسالة خاصة للمدير لحل المشكلة فوراً." : "Dissatisfaction detected! The system blocks this from Google and directs the customer to a private manager message."}
        />

        {/* 3. إرشاد النمو: عند التقييم الإيجابي */}
        <SidebarGuide 
          side={isRTL ? 'left' : 'right'} 
          visible={stage === 'survey' && rating === 'happy'} 
          title={isRTL ? "محرك النمو السريع 🚀" : "Growth Engine"}
          color="green"
          icon={TrendingUp}
          text={isRTL ? "عميل سعيد! النظام سيحفزه الآن للذهاب لخرائط جوجل لوضع تقييم 5 نجوم لرفع ترتيبك أمام المنافسين." : "Happy customer! The system motivates them to go to Google Maps and leave a 5-star review to boost your ranking."}
        />

        <div className="relative mx-auto w-[360px] h-[740px] bg-black rounded-[64px] shadow-[0_0_0_8px_#1a1a1a,0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10">
          <div className="absolute top-0 inset-x-0 h-14 z-20 flex justify-between items-center px-9 pt-4 text-white text-[13px] font-semibold tracking-widest">
             <span>9:41</span> <div className="flex gap-1.5"><Signal size={16} /><Wifi size={16} /><Battery size={16} /></div>
          </div>
          
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[58px] mt-2 mb-2 ml-2 mr-2 border border-black/10">
             {stage === 'chat' ? (
                <div className="flex-1 flex flex-col bg-[#e5ddd5] h-full overflow-hidden">
                   <div className="bg-[#075e54] p-3 pt-12 flex items-center gap-3 text-white">
                      <ArrowLeft className="w-5 h-5" onClick={onBack} />
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-800 font-bold">{data.projectName.charAt(0)}</div>
                      <div className="flex-1"><h3 className="text-sm font-bold truncate">{data.projectName}</h3><p className="text-[10px] opacity-80 italic">Official Business Account</p></div>
                   </div>
                   <div className="flex-1 p-4 space-y-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
                      {msgVisible && (
                        <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[90%] animate-fade-in-up">
                           <p className="text-xs text-slate-800 leading-relaxed">
                              {isRTL ? `أهلاً بك! نأمل أن تكون قد استمتعت بخدمتنا في ${data.projectName}. رأيك يهمنا جداً لتطوير خدماتنا، هل يمكنك مشاركتنا تجربتك؟` 
                                     : `Hello! We hope you enjoyed our service at ${data.projectName}. Your feedback matters, could you share your experience?`}
                           </p>
                           <button onClick={handleCtaClick} className="w-full mt-4 bg-blue-50 py-2 rounded-lg text-blue-600 font-bold text-xs border border-blue-100 uppercase">{isRTL ? "تقييم التجربة الآن" : "Rate Experience Now"}</button>
                           <div className="flex justify-end mt-1"><CheckCheck size={14} className="text-blue-400" /></div>
                        </div>
                      )}
                   </div>
                </div>
             ) : stage === 'survey' ? (
                <div className="flex-1 flex flex-col bg-white h-full overflow-hidden p-6 items-center text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-2xl font-black mb-4">{data.projectName.charAt(0)}</div>
                   <h3 className="font-black text-slate-800 mb-6">{isRTL ? "كيف كانت تجربتك؟" : "How was your experience?"}</h3>
                   
                   {/* استبدال النجوم بالإيموجي */}
                   <div className="flex gap-4 mb-8">
                      <button onClick={() => setRating('sad')} className={`group flex flex-col items-center gap-2 transition-all ${rating === 'sad' ? 'scale-110' : 'opacity-40 grayscale'}`}>
                         <div className="p-3 bg-red-50 rounded-2xl border-2 border-red-100 group-hover:border-red-400"><Frown size={40} className="text-red-500" /></div>
                         <span className="text-[10px] font-bold text-red-600">{isRTL ? "سيئة" : "Bad"}</span>
                      </button>
                      <button onClick={() => setRating('neutral')} className={`group flex flex-col items-center gap-2 transition-all ${rating === 'neutral' ? 'scale-110' : 'opacity-40 grayscale'}`}>
                         <div className="p-3 bg-yellow-50 rounded-2xl border-2 border-yellow-100 group-hover:border-yellow-400"><Meh size={40} className="text-yellow-500" /></div>
                         <span className="text-[10px] font-bold text-yellow-600">{isRTL ? "متوسطة" : "Neutral"}</span>
                      </button>
                      <button onClick={() => setRating('happy')} className={`group flex flex-col items-center gap-2 transition-all ${rating === 'happy' ? 'scale-110' : 'opacity-40 grayscale'}`}>
                         <div className="p-3 bg-green-50 rounded-2xl border-2 border-green-100 group-hover:border-green-400"><Smile size={40} className="text-green-500" /></div>
                         <span className="text-[10px] font-bold text-green-600">{isRTL ? "ممتازة" : "Great"}</span>
                      </button>
                   </div>

                   {rating && (
                      <div className="w-full animate-fade-in-up space-y-4">
                         <textarea placeholder={isRTL ? "اكتب ملاحظاتك هنا..." : "Write your feedback..."} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-blue-500 h-24 resize-none"></textarea>
                         {rating === 'happy' ? (
                            <button onClick={() => setStage('post-demo')} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                               <MapPin size={16} /> {isRTL ? "نشر تقييم 5 نجوم على جوجل" : "Post 5-Stars on Google"}
                            </button>
                         ) : (
                            <button onClick={() => setStage('post-demo')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2">
                               <UserCog size={16} /> {isRTL ? "إرسال شكوى خاصة للإدارة" : "Send Private Complaint"}
                            </button>
                         )}
                      </div>
                   )}
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full text-center">
                   <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100"><CheckCheck size={40} className="text-green-600" /></div>
                   <h2 className="text-xl font-black text-slate-900 mb-4">{isRTL ? "هكذا نحمي عملك 24/7" : "This is how we protect you"}</h2>
                   <p className="text-slate-500 text-xs leading-relaxed mb-6">{isRTL ? "النظام يعمل آلياً بالكامل لضمان صدارة مشروعك وحماية سمعتك الرقمية دون تدخل منك." : "The system is fully automated to ensure your business stays on top and your reputation stays protected."}</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full max-w-[420px] space-y-4 mt-12 px-4">
          <div className="relative group">
             <div className="absolute -top-5 z-20 bg-yellow-400 text-black font-black text-xs px-3 py-1.5 rounded-lg shadow-lg animate-bounce border-2 border-black rotate-2 right-0">🔥 {isRTL ? "خصم 70% لفترة محدودة" : "70% OFF Limited Offer"}</div>
             <a href={waLink} target="_blank" className="relative block w-full py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xl rounded-2xl shadow-xl text-center transform hover:-translate-y-1 transition-all">
                <span className="flex items-center justify-center gap-2"><Zap className="fill-yellow-300 text-yellow-300" /> {isRTL ? "اطلب نظام الهيمنة الآن" : "Order System Now"}</span>
             </a>
          </div>
          <button onClick={onBack} className="w-full py-3 text-slate-500 font-bold hover:text-white transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest italic opacity-70">
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {isRTL ? "العودة للتقرير الاستراتيجي" : "Back to Strategic Report"}
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
