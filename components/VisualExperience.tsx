// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Star, BadgeCheck, Zap, 
  ShieldAlert, TrendingUp, UserCog, Signal, Wifi, Battery, Sparkles, Timer,
  MoveRight, MoveLeft, Frown, Meh, Image as ImageIcon
} from 'lucide-react';

interface VisualExperienceProps {
  language: Language;
  data: AuditData;
  onBack: () => void;
}

const VisualExperience: React.FC<VisualExperienceProps> = ({ language, data, onBack }) => {
  const isRTL = language === 'ar';
  const [stage, setStage] = useState<'chat' | 'survey' | 'post-demo'>('chat');
  const [msgVisible, setMsgVisible] = useState(false);
  const [rating, setRating] = useState<null | 'happy' | 'neutral' | 'sad'>(null);
  const [timeLeft, setTimeLeft] = useState(300);

  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'cafe';

  useEffect(() => {
    const timerId = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (stage === 'chat') {
      const timer = setTimeout(() => setMsgVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- صياغة الرسائل باللهجة الكويتية ---
  const getKuwaitiMessage = () => {
    if (isRestaurant) {
      return `يعطيك العافية، مشكور على زيارتك لنا في ${data.projectName}. عسى عجبك الأكل؟ يهمنا نعرف تجربتك معانا..`;
    }
    return `يعطيك العافية، مشكور على زيارتك لنا في ${data.projectName}. إن شاء الله الخدمة جازت لك وما قصرنا معاك؟`;
  };

  const waLink = `https://wa.me/96566305551?text=${encodeURIComponent(`مرحباً، أريد تفعيل نظام Elegant Options لمشروعي (${data.projectName}).`)}`;

  const SidebarGuide = ({ side, title, text, icon: Icon, color, visible }: any) => {
    if (!visible) return null;
    return (
      <div className={`absolute z-50 w-80 p-6 rounded-[2.5rem] border-2 backdrop-blur-2xl shadow-2xl animate-fade-in transition-all duration-700
        ${color === 'green' ? 'border-green-500/50 bg-green-950/40' : color === 'red' ? 'border-red-500/50 bg-red-950/40' : 'border-blue-500/40 bg-slate-900/90'}
        ${side === 'left' ? '-left-[24rem]' : '-right-[24rem]'} top-1/4`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-6 h-6 ${color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
          <h4 className="text-white font-black text-sm uppercase tracking-tighter">{title}</h4>
        </div>
        <p className="text-slate-200 text-xs leading-relaxed font-bold mb-4">{text}</p>
        <div className={`absolute top-1/2 -translate-y-1/2 flex gap-1 ${side === 'left' ? '-right-14' : '-left-14'} text-white animate-pulse`}>
           {side === 'left' ? <><MoveRight size={24} /><MoveRight size={24} className="opacity-50" /></> : <><MoveLeft size={24} className="opacity-50" /><MoveLeft size={24} /></>}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-20 relative ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* اللوجو الرسمي باللون الأزرق */}
      <div className="fixed bottom-6 left-6 z-[100]">
         <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="w-14 h-14 object-contain" />
      </div>

      <div className="space-y-6 w-full mb-12 px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">نظام النمو الذكي وحماية السمعة</h2>
        <p className="text-blue-400 text-xl md:text-2xl font-black max-w-3xl mx-auto leading-tight italic">
            "حوّل كل عميل إلى مروج دائم لعلامتك التجارية عبر أتمتة الذكاء الاصطناعي"
        </p>
      </div>

      <div className="relative">
        <SidebarGuide 
          side={isRTL ? 'right' : 'left'} visible={stage === 'chat'} title="الأتمتة اللحظية ⚡" color="blue" icon={Zap}
          text={isRestaurant 
            ? "بمجرد استلام العميل لطلبه من (طلبات أو كيتا) أو انتهاء وجبته، يرسل النظام هذه الرسالة المخصصة لضمان أعلى معدل استجابة."
            : "بمجرد انتهاء تسليم الخدمة للعميل، يرسل النظام هذه الرسالة المخصصة آلياً لتقييم الجودة وبناء الولاء."}
        />
        <SidebarGuide 
          side={isRTL ? 'left' : 'right'} visible={stage === 'survey' && (rating === 'sad' || rating === 'neutral')} 
          title="درع الحماية النشط 🛡️" color="red" icon={ShieldAlert}
          text="النظام رصد عدم رضا! سيقوم الآن بحجب هذا التقييم عن جوجل تماماً، ويوجه العميل لفتح قناة تواصل سرية مع الإدارة لحل المشكلة."
        />
        <SidebarGuide 
          side={isRTL ? 'left' : 'right'} visible={stage === 'survey' && rating === 'happy'} 
          title="محرك الهيمنة الرقمية 🚀" color="green" icon={TrendingUp}
          text="العميل سعيد! النظام سيقوم بإظهار صفحة تقييم مشروعك على جوجل مباشرة بـ 5 نجوم جاهزة، ليضمن لك الصدارة في نتائج البحث."
        />

        <div className="relative mx-auto w-[360px] h-[740px] bg-black rounded-[64px] shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10 border border-white/10">
          <div className="absolute top-0 inset-x-0 h-12 z-20 flex justify-between items-center px-10 pt-4 text-white text-[12px] font-bold">
             <span>1:21 PM</span> <div className="flex gap-2"><Signal size={14} /><Wifi size={14} /><Battery size={14} /></div>
          </div>
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[55px] m-2.5 border border-black/20">
             {stage === 'chat' ? (
                <div className="flex-1 flex flex-col bg-[#e5ddd5] h-full overflow-hidden text-left">
                   <div className="bg-[#075e54] p-3 pt-12 flex items-center gap-3 text-white">
                      <ArrowLeft className="w-5 h-5" onClick={onBack} />
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#075e54] font-black text-lg shadow-inner">{data.projectName.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black truncate">{data.projectName}</h3>
                        <p className="text-[9px] font-bold opacity-90 uppercase">Official Business Account</p>
                      </div>
                   </div>
                   <div className="flex-1 p-4 space-y-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
                      {msgVisible && (
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-xl max-w-[92%] animate-fade-in-up border border-slate-100">
                           <p className="text-[13px] text-slate-800 leading-relaxed font-bold text-right" dir="rtl">{getKuwaitiMessage()}</p>
                           <button onClick={() => setStage('survey')} className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 py-3 rounded-xl text-white font-black text-sm shadow-lg">تقييم التجربة الآن</button>
                           <div className="flex justify-end mt-1 items-center gap-0.5 text-[#53bdeb]"><span className="text-[10px] text-slate-400">1:21 PM</span> <CheckCheck size={14} /></div>
                        </div>
                      )}
                   </div>
                </div>
             ) : stage === 'survey' ? (
                <div className="flex-1 flex flex-col bg-white h-full overflow-hidden p-8 items-center text-center">
                   <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-6">
                      <span className="text-[12px] font-black text-slate-400 tracking-widest uppercase">LOGO</span>
                   </div>
                   <h3 className="font-black text-slate-800 text-xl mb-10">كيف كانت تجربتك معانا؟</h3>
                   <div className="flex justify-between w-full mb-12 px-2" dir="rtl">
                      <button onClick={() => setRating('happy')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'happy' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-18 h-18 bg-green-50 rounded-3xl flex items-center justify-center border-2 border-green-200 shadow-xl group-hover:border-green-500"><Smile size={54} className="text-green-500" /></div>
                         <span className="text-sm font-black text-green-600">ممتازة</span>
                      </button>
                      <button onClick={() => setRating('neutral')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'neutral' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-18 h-18 bg-yellow-50 rounded-3xl flex items-center justify-center border-2 border-yellow-200 shadow-xl group-hover:border-yellow-500"><Meh size={54} className="text-yellow-500" /></div>
                         <span className="text-sm font-black text-yellow-600">متوسطة</span>
                      </button>
                      <button onClick={() => setRating('sad')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'sad' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-18 h-18 bg-red-50 rounded-3xl flex items-center justify-center border-2 border-red-200 shadow-xl group-hover:border-red-500"><Frown size={54} className="text-red-500" /></div>
                         <span className="text-sm font-black text-red-600">سيئة</span>
                      </button>
                   </div>
                   {rating && (
                      <div className="w-full animate-fade-in-up space-y-4">
                         <textarea placeholder="أخبرنا بالمزيد عن تجربتك..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none h-28 resize-none"></textarea>
                         {rating === 'happy' ? (
                            <button onClick={() => setStage('post-demo')} className="w-full py-5 bg-[#4285F4] text-white rounded-[1.5rem] font-black text-base flex items-center justify-center gap-3 shadow-xl">
                               <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" className="w-5 h-5 bg-white rounded-full p-0.5" />
                               نشر تقييم 5 نجوم على جوجل
                            </button>
                         ) : (
                            <button onClick={() => setStage('post-demo')} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-base flex items-center justify-center gap-3 shadow-xl">
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
                   <p className="text-slate-500 text-sm leading-relaxed font-bold">النظام يعمل آلياً بالكامل لضمان صدارة مشروعك على جوجل ماب وحماية سمعتك الرقمية.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[450px] space-y-6 mt-16 px-4">
          <div className="relative group">
             <div className="absolute -top-6 z-20 bg-yellow-400 text-black font-black text-[11px] px-4 py-2 rounded-xl shadow-xl animate-bounce border-2 border-black rotate-2 right-0 tracking-widest uppercase">🔥 خصم الـ 70% ينتهي قريباً</div>
             <a href={waLink} target="_blank" className="relative block w-full py-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-2xl rounded-[2rem] shadow-2xl text-center transform hover:-translate-y-1 transition-all border-b-4 border-green-800">
                <span className="flex items-center justify-center gap-3"><Zap className="fill-yellow-300 text-yellow-300 w-7 h-7" /> اطلب نظام الهيمنة الآن</span>
             </a>
          </div>
          <div className="bg-red-600/10 border border-red-500/50 backdrop-blur-md text-white py-3 px-8 rounded-full inline-flex items-center gap-3 animate-pulse mx-auto">
              <Timer className="w-5 h-5 text-yellow-400" />
              <span className="text-base font-bold tracking-wide">ينتهي الخصم خلال: {formatTime(timeLeft)}</span>
          </div>
          <button onClick={onBack} className="w-full py-4 text-slate-400 font-black hover:text-white transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-[0.3em] opacity-50 hover:opacity-100">
            {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />} العودة للتقرير الاستراتيجي
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
