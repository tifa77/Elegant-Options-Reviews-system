// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Smile, Zap, ShieldAlert, TrendingUp, UserCog, 
  Signal, Wifi, Battery, Sparkles, Timer, MoveRight, MoveLeft, Frown, Meh
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

  // --- محتوى الرسائل المحسن باللهجة الكويتية والإنجليزية ---
  const getCustomMessage = () => {
    if (isRTL) {
      return isRestaurant 
        ? `يعطيك العافية، مشكور على زيارتك لنا في **${data.projectName}**. عسى عجبك الأكل؟ عساك استمتعت معانا؟`
        : `يعطيك العافية، مشكور على ثقتك في **${data.projectName}**. إن شاء الله الخدمة جازت لك وما قصرنا معاك؟`;
    }
    return isRestaurant
      ? `Thank you for visiting **${data.projectName}**. Hope you enjoyed your meal! How was your experience with us?`
      : `Thank you for choosing **${data.projectName}**. We hope the service met your expectations!`;
  };

  const waLink = `https://wa.me/96566305551?text=${encodeURIComponent(isRTL ? `مرحباً، أريد تفعيل نظام Elegant Options لمشروعي.` : `Hello, I want to activate Elegant Options.`)}`;

  const SidebarGuide = ({ side, title, text, icon: Icon, color, visible }: any) => {
    if (!visible) return null;
    return (
      <div className={`absolute z-50 w-72 p-5 rounded-[2rem] border-2 backdrop-blur-2xl shadow-2xl animate-fade-in transition-all duration-700
        ${color === 'green' ? 'border-green-500/50 bg-green-950/40' : color === 'red' ? 'border-red-500/50 bg-red-950/40' : 'border-blue-500/40 bg-slate-900/90'}
        ${side === 'left' ? '-left-[20rem]' : '-right-[20rem]'} top-1/4 hidden lg:block`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
          <h4 className="text-white font-black text-xs uppercase tracking-tighter">{title}</h4>
        </div>
        <p className="text-slate-200 text-[11px] leading-relaxed font-bold mb-4">{text}</p>
        <div className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? '-right-10' : '-left-10'} text-white animate-pulse`}>
           {side === 'left' ? <MoveRight size={28} /> : <MoveLeft size={28} />}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-20 relative ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* لوجو Elegant Options الرسمي باللون الأزرق */}
      <div className="fixed bottom-6 left-6 z-[100] hidden md:block">
         <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="w-14 h-14 object-contain" />
      </div>

      <div className="space-y-4 w-full mb-10 px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{isRTL ? "نظام النمو الذكي وحماية السمعة" : "Smart Growth & Reputation Shield"}</h2>
        <p className="text-blue-400 text-lg md:text-xl font-black max-w-3xl mx-auto">{isRTL ? "حوّل كل عميل إلى مروج دائم لعلامتك التجارية" : "Turn every customer into a permanent promoter of your brand"}</p>
      </div>

      <div className="relative">
        <SidebarGuide side={isRTL ? 'right' : 'left'} visible={stage === 'chat'} title={isRTL ? "الأتمتة اللحظية ⚡" : "Live Automation ⚡"} color="blue" icon={Zap}
          text={isRTL ? "بمجرد انتهاء الخدمة، يرسل النظام هذه الرسالة آلياً. (ملاحظة: يمكنك تخصيص وتعديل محتوى هذه الرسالة بالكامل حسب نوع مشروعك)." : "Once the service ends, the system sends this automatically. (Note: You can fully customize this message to suit your business)."}
        />
        <SidebarGuide side={isRTL ? 'left' : 'right'} visible={stage === 'survey' && (rating === 'sad' || rating === 'neutral')} title={isRTL ? "درع الحماية الاحترازي 🛡️" : "Precautionary Shield 🛡️"} color="red" icon={ShieldAlert}
          text={isRTL ? "الذكاء الاصطناعي رصد تقييماً غير ممتاز! كإجراء احتياطي، سيتم توجيه العميل للمدير مباشرة لمعرفة السبب وحل المشكلة بدلاً من نشره في جوجل." : "AI detected a non-excellent rating! As a precaution, the customer is directed to the manager to resolve the issue instead of posting on Google."}
        />
        <SidebarGuide side={isRTL ? 'left' : 'right'} visible={stage === 'survey' && rating === 'happy'} title={isRTL ? "محرك الهيمنة 🚀" : "Dominance Engine 🚀"} color="green" icon={TrendingUp}
          text={isRTL ? "العميل سعيد! النظام سيظهر له صفحة تقييم مشروعك على جوجل ماب مباشرة بـ 5 نجوم، لضمان صدارتك للمنافسين." : "Customer is happy! The system will directly show your Google Maps review page with 5 stars to ensure you outrank competitors."}
        />

        {/* iPhone Mockup */}
        <div className="relative mx-auto w-[330px] md:w-[360px] h-[680px] md:h-[740px] bg-black rounded-[60px] shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10 border border-white/10">
          <div className="absolute top-0 inset-x-0 h-12 z-20 flex justify-between items-center px-10 pt-4 text-white text-[12px] font-bold">
             <span>1:21 PM</span> <div className="flex gap-2"><Signal size={14} /><Wifi size={14} /><Battery size={14} /></div>
          </div>
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[50px] m-2 border border-black/20">
             {stage === 'chat' ? (
                <div className="flex-1 flex flex-col bg-[#e5ddd5] h-full overflow-hidden">
                   <div className="bg-[#075e54] p-3 pt-12 flex items-center gap-3 text-white">
                      <div className="flex-1 flex items-center justify-end gap-3">
                        <div className="text-right">
                           <h3 className="text-sm font-black truncate">{data.projectName}</h3>
                           <p className="text-[9px] opacity-80 uppercase font-bold">Official Business Account</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[#075e54] font-black text-lg shadow-inner">{data.projectName.charAt(0)}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 opacity-70" />
                   </div>
                   <div className="flex-1 p-4 space-y-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
                      {msgVisible && (
                        <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-xl max-w-[92%] animate-fade-in-up border border-slate-100 float-right">
                           <p className="text-[13px] text-slate-800 leading-relaxed font-bold text-right" dir="rtl">{getCustomMessage()}</p>
                           <button onClick={() => setStage('survey')} className="w-full mt-4 bg-blue-600 py-3 rounded-xl text-white font-black text-sm shadow-lg shadow-blue-100 uppercase tracking-tighter transition-transform active:scale-95">{isRTL ? "تقييم التجربة الآن" : "Rate Experience Now"}</button>
                           <div className="flex justify-end mt-1 items-center gap-0.5 text-[#53bdeb]"><span className="text-[10px] text-slate-400 font-bold">1:21 PM</span> <CheckCheck size={14} /></div>
                        </div>
                      )}
                   </div>
                </div>
             ) : stage === 'survey' ? (
                <div className="flex-1 flex flex-col bg-white h-full overflow-hidden p-6 items-center text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-6">
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">LOGO</span>
                   </div>
                   <h3 className="font-black text-slate-800 text-lg mb-8">{isRTL ? "كيف كانت تجربتك معانا؟" : "How was your experience?"}</h3>
                   <div className="flex justify-between w-full mb-10 px-2" dir={isRTL ? "rtl" : "ltr"}>
                      <button onClick={() => setRating('happy')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'happy' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center border-2 border-green-200 shadow-xl group-hover:border-green-500"><Smile size={48} className="text-green-500" /></div>
                         <span className="text-xs font-black text-green-600">{isRTL ? "ممتازة" : "Great"}</span>
                      </button>
                      <button onClick={() => setRating('neutral')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'neutral' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-yellow-50 rounded-3xl flex items-center justify-center border-2 border-yellow-200 shadow-xl group-hover:border-yellow-500"><Meh size={48} className="text-yellow-500" /></div>
                         <span className="text-xs font-black text-yellow-600">{isRTL ? "متوسطة" : "Neutral"}</span>
                      </button>
                      <button onClick={() => setRating('sad')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'sad' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center border-2 border-red-200 shadow-xl group-hover:border-red-500"><Frown size={48} className="text-red-500" /></div>
                         <span className="text-xs font-black text-red-600">{isRTL ? "سيئة" : "Bad"}</span>
                      </button>
                   </div>
                   {rating && (
                      <div className="w-full animate-fade-in-up space-y-4">
                         <textarea placeholder={isRTL ? "أخبرنا بالمزيد عن تجربتك..." : "Tell us more..."} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none h-24 resize-none"></textarea>
                         {rating === 'happy' ? (
                            <button onClick={() => setStage('post-demo')} className="w-full py-4 bg-[#4285F4] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl">
                               <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" className="w-4 h-4 bg-white rounded-full p-0.5" />
                               {isRTL ? "نشر تقييم 5 نجوم على جوجل" : "Post 5-Stars on Google"}
                            </button>
                         ) : (
                            <button onClick={() => setStage('post-demo')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3">
                               <UserCog size={18} /> {isRTL ? "إرسال شكوى خاصة للإدارة" : "Send Private Complaint"}
                            </button>
                         )}
                      </div>
                   )}
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white h-full text-center">
                   <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100 shadow-inner"><CheckCheck size={40} className="text-green-600 animate-bounce" /></div>
                   <h2 className="text-xl font-black text-slate-900 mb-4">{isRTL ? "هكذا نحمي عملك 24/7" : "Protected 24/7"}</h2>
                   <p className="text-slate-500 text-xs font-bold leading-relaxed">{isRTL ? "النظام يعمل آلياً بالكامل لضمان صدارة مشروعك على جوجل ماب وحماية سمعتك الرقمية." : "The system works 24/7 to ensure your ranking and protect your digital reputation."}</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-[420px] space-y-6 mt-12 px-4">
          <div className="relative group">
             <div className="absolute -top-6 z-20 bg-yellow-400 text-black font-black text-[11px] px-4 py-2 rounded-xl shadow-xl animate-bounce border-2 border-black rotate-2 right-0">{isRTL ? "🔥 خصم الـ 70% متاح الآن" : "🔥 70% OFF Available"}</div>
             <a href={waLink} target="_blank" className="relative block w-full py-5 bg-green-600 text-white font-black text-xl rounded-[2rem] shadow-2xl text-center transform hover:-translate-y-1 transition-all border-b-4 border-green-800">
                <span className="flex items-center justify-center gap-3"><Zap className="fill-yellow-300 text-yellow-300 w-6 h-6" /> {isRTL ? "اطلب نظام الهيمنة الآن" : "Order System Now"}</span>
             </a>
          </div>
          <div className="bg-red-600/10 border border-red-500/50 backdrop-blur-md text-white py-3 px-8 rounded-full inline-flex items-center gap-3 animate-pulse mx-auto">
              <Timer className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-black">{isRTL ? "ينتهي الخصم خلال:" : "Discount ends in:"} {formatTime(timeLeft)}</span>
          </div>
          <button onClick={onBack} className="w-full py-4 bg-slate-900 border border-slate-700 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest">
            {isRTL ? "العودة للتقرير الاستراتيجي" : "Back to Strategic Report"} {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
