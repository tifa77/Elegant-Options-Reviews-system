// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Paperclip, Camera, Mic, Star, 
  MapPin, MessageCircle, BadgeCheck, Zap, 
  ShieldAlert, TrendingUp, Lock, UserCog, Signal, Wifi, Battery, Sparkles, Timer,
  MoveRight, MoveLeft, Info, Frown, Meh, Image as ImageIcon
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

  // --- مكون الإرشادات الخارجية مع الأسهم المتعددة ---
  const SidebarGuide = ({ side, title, text, icon: Icon, color, visible }: any) => {
    if (!visible) return null;
    return (
      <div className={`absolute z-50 w-72 p-6 rounded-[2.5rem] border-2 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-fade-in transition-all duration-700
        ${color === 'green' ? 'border-green-500/50 bg-green-950/40' : color === 'red' ? 'border-red-500/50 bg-red-950/40' : 'border-blue-500/40 bg-slate-900/90'}
        ${side === 'left' ? '-left-[22rem]' : '-right-[22rem]'} top-1/4`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-6 h-6 ${color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
          <h4 className="text-white font-black text-sm uppercase tracking-tighter">{title}</h4>
        </div>
        <p className="text-slate-200 text-xs leading-relaxed font-bold mb-4">{text}</p>
        
        {/* أسهم توضيحية متعددة للدلالة على الربط المباشر */}
        <div className={`absolute top-1/2 -translate-y-1/2 flex gap-1 ${side === 'left' ? '-right-14' : '-left-14'} text-white animate-pulse`}>
           {side === 'left' ? <><MoveRight size={24} /><MoveRight size={24} className="opacity-50" /></> : <><MoveLeft size={24} className="opacity-50" /><MoveLeft size={24} /></>}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-20 relative ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ثابت: لوجو Elegant Options في الاسفل يسار */}
      <div className="fixed bottom-6 left-6 z-[100] opacity-60 hover:opacity-100 transition-opacity">
         <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="w-12 h-12 object-contain filter grayscale brightness-200" />
      </div>

      {/* Header Section */}
      <div className="space-y-6 w-full mb-12 px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
            نظام النمو الذكي وحماية السمعة
        </h2>
        <p className="text-blue-400 text-xl md:text-2xl font-black max-w-3xl mx-auto leading-tight">
            الاستثمار الأمثل لتحويل كل عميل عابر إلى مروج دائم لعلامتك التجارية عبر أتمتة الذكاء الاصطناعي [cite: 118, 121]
        </p>
      </div>

      {/* iPhone Container */}
      <div className="relative">
        
        {/* إرشاد 1: الأتمتة اللحظية */}
        <SidebarGuide 
          side={isRTL ? 'right' : 'left'} 
          visible={stage === 'chat'} 
          title="الأتمتة اللحظية ⚡"
          color="blue"
          icon={Zap}
          text="بمجرد استلام العميل لطلبه (طلبات/كيتا) أو انتهاء خدمته، يرسل النظام هذه الرسالة المخصصة باسم مشروعك لضمان أعلى معدل استجابة[cite: 72, 107]."
        />

        {/* إرشاد 2: درع الحماية */}
        <SidebarGuide 
          side={isRTL ? 'left' : 'right'} 
          visible={stage === 'survey' && (rating === 'sad' || rating === 'neutral')} 
          title="درع الحماية النشط 🛡️"
          color="red"
          icon={ShieldAlert}
          text="الذكاء الاصطناعي رصد استياء العميل! سيقوم الآن بحجب هذا التقييم عن جوجل تماماً، وفتح قناة تواصل سرية فورية مع الإدارة لحل المشكلة قبل تفاقمها[cite: 78, 123]."
        />

        {/* إرشاد 3: محرك الهيمنة */}
        <SidebarGuide 
          side={isRTL ? 'left' : 'right'} 
          visible={stage === 'survey' && rating === 'happy'} 
          title="محرك الهيمنة الرقمية 🚀"
          color="green"
          icon={TrendingUp}
          text="العميل سعيد! النظام سيفهم ذلك ويقوم بإظهار صفحة تقييم مشروعك على جوجل مباشرة بـ 5 نجوم جاهزة، ليضمن لك الصدارة في نتائج البحث[cite: 79, 80]."
        />

        <div className="relative mx-auto w-[360px] h-[740px] bg-black rounded-[64px] shadow-[0_0_0_10px_#1a1a1a,0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10 border border-white/10">
          {/* Status Bar */}
          <div className="absolute top-0 inset-x-0 h-12 z-20 flex justify-between items-center px-10 pt-4 text-white text-[12px] font-bold">
             <span>1:21 PM</span> <div className="flex gap-2"><Signal size={14} /><Wifi size={14} /><Battery size={14} /></div>
          </div>
          
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[55px] m-2.5 border border-black/20">
             {stage === 'chat' ? (
                <div className="flex-1 flex flex-col bg-[#e5ddd5] h-full overflow-hidden">
                   <div className="bg-[#075e54] p-3 pt-12 flex items-center gap-3 text-white shadow-lg">
                      <ArrowLeft className="w-5 h-5" onClick={onBack} />
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#075e54] font-black text-lg shadow-inner">
                        {data.projectName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                           <h3 className="text-sm font-black truncate">{data.projectName}</h3>
                           <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400" />
                        </div>
                        <p className="text-[9px] font-bold opacity-90 tracking-wide uppercase">Official Business Account</p>
                      </div>
                   </div>
                   <div className="flex-1 p-4 space-y-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
                      {msgVisible && (
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-xl max-w-[92%] animate-fade-in-up border border-slate-100">
                           <p className="text-[13px] text-slate-800 leading-relaxed font-medium">
                              أهلاً بك! نأمل أن تكون قد استمتعت بخدمتنا في **{data.projectName}**. 
                              رأيك هو سر نجاحنا، هل يمكنك تقييم تجربتك معنا خلال ثوانٍ؟
                           </p>
                           <button onClick={handleCtaClick} className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 py-3 rounded-xl text-white font-black text-sm shadow-lg shadow-blue-200">تقييم التجربة الآن</button>
                           <div className="flex justify-end mt-1 items-center gap-0.5 text-[#53bdeb]"><span className="text-[10px] text-slate-400">1:21 PM</span> <CheckCheck size={14} /></div>
                        </div>
                      )}
                   </div>
                </div>
             ) : stage === 'survey' ? (
                <div className="flex-1 flex flex-col bg-white h-full overflow-hidden p-8 items-center text-center">
                   {/* مكان لوجو المشروع */}
                   <div className="w-20 h-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-6">
                      <ImageIcon className="text-slate-300 w-6 h-6 mb-1" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LOGO</span>
                   </div>
                   
                   <h3 className="font-black text-slate-800 text-xl mb-8">كيف كانت تجربتك معنا؟</h3>
                   
                   {/* الإيموجي الملونة والمحسنة */}
                   <div className="flex justify-between w-full mb-10 px-2">
                      <button onClick={() => setRating('sad')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'sad' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center border-2 border-red-100 shadow-lg group-hover:border-red-500"><Frown size={48} className="text-red-500" /></div>
                         <span className="text-xs font-black text-red-600">سيئة</span>
                      </button>
                      <button onClick={() => setRating('neutral')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'neutral' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-yellow-50 rounded-3xl flex items-center justify-center border-2 border-yellow-100 shadow-lg group-hover:border-yellow-500"><Meh size={48} className="text-yellow-500" /></div>
                         <span className="text-xs font-black text-yellow-600">متوسطة</span>
                      </button>
                      <button onClick={() => setRating('happy')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'happy' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center border-2 border-green-100 shadow-lg group-hover:border-green-500"><Smile size={48} className="text-green-500" /></div>
                         <span className="text-xs font-black text-green-600">ممتازة</span>
                      </button>
                   </div>

                   {rating && (
                      <div className="w-full animate-fade-in-up space-y-4">
                         <textarea placeholder="أخبرنا بالمزيد عن تجربتك لتحسين خدمتنا..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 h-28 resize-none"></textarea>
                         {rating === 'happy' ? (
                            <button onClick={() => setStage('post-demo')} className="w-full py-5 bg-[#4285F4] text-white rounded-[1.5rem] font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transform active:scale-95 transition-all">
                               <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" className="w-5 h-5 bg-white rounded-full p-0.5" />
                               نشر تقييم 5 نجوم على جوجل
                            </button>
                         ) : (
                            <button onClick={() => setStage('post-demo')} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-base flex items-center justify-center gap-3 transform active:scale-95 transition-all">
                               <UserCog size={20} /> إرسال شكوى خاصة للإدارة
                            </button>
                         )}
                      </div>
                   )}
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white h-full text-center">
                   <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-inner"><CheckCheck size={50} className="text-green-600 animate-bounce" /></div>
                   <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">هكذا يحمي Elegant Options عملك 24/7</h2>
                   <p className="text-slate-500 text-sm leading-relaxed font-bold">النظام يعمل آلياً بالكامل لضمان صدارة مشروعك على جوجل ماب وحماية سمعتك من أي عثرات قد تؤثر على مبيعاتك[cite: 76, 78, 125].</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Main CTA Area */}
      <div className="w-full max-w-[450px] space-y-6 mt-16 px-4">
          <div className="relative group">
             <div className="absolute -top-6 z-20 bg-yellow-400 text-black font-black text-[11px] px-4 py-2 rounded-xl shadow-xl animate-bounce border-2 border-black rotate-2 right-0 tracking-widest uppercase">🔥 خصم الـ 70% ينتهي قريباً</div>
             <a href={waLink} target="_blank" className="relative block w-full py-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-2xl rounded-[2rem] shadow-2xl text-center transform hover:-translate-y-1 transition-all border-b-4 border-green-800">
                <span className="flex items-center justify-center gap-3"><Zap className="fill-yellow-300 text-yellow-300 w-7 h-7" /> اطلب نظام الهيمنة الآن</span>
             </a>
          </div>
          <button onClick={onBack} className="w-full py-4 text-slate-400 font-black hover:text-white transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-[0.3em] opacity-50 hover:opacity-100">
            {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />} العودة للتقرير الاستراتيجي
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
