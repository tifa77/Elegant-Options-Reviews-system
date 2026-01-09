// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Zap, ShieldAlert, TrendingUp, UserCog, 
  Signal, Wifi, Battery, Sparkles, Timer, MoveRight, MoveLeft, 
  Frown, Meh, Smile, BadgeCheck, Image as ImageIcon
} from 'lucide-react';

interface VisualExperienceProps {
  language: Language;
  data: AuditData;
  onBack: () => void;
}

const VisualExperience: React.FC<VisualExperienceProps> = ({ language, data, onBack }) => {
  // حماية ضد الشاشة الفارغة
  if (!data) return null;

  const isRTL = language === 'ar';
  const [stage, setStage] = useState<'chat' | 'survey' | 'post-demo'>('chat');
  const [msgVisible, setMsgVisible] = useState(false);
  const [rating, setRating] = useState<null | 'happy' | 'neutral' | 'sad'>(null);
  const [feedbackText, setFeedbackText] = useState("");
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

  // صياغة الرسائل باللهجة الكويتية / الإنجليزية
  const getCustomMessage = () => {
    if (isRTL) {
      return isRestaurant 
        ? `يعطيك العافية، مشكور على زيارتك لنا في **${data.projectName}**. عسى عجبك الأكل؟ عساك استمتعت معانا؟`
        : `يعطيك العافية، مشكور على ثقتك في **${data.projectName}**. إن شاء الله الخدمة جازت لك وما قصرنا معاك؟`;
    }
    return isRestaurant
      ? `Thank you for visiting **${data.projectName}**. Hope you enjoyed the meal! How was your experience?`
      : `Thank you for choosing **${data.projectName}**. We hope the service met your expectations!`;
  };

  const SidebarGuide = ({ side, title, text, icon: Icon, color, visible }: any) => {
    if (!visible) return null;
    const colorClasses = {
      green: 'border-green-500/50 bg-green-950/40 text-green-400',
      red: 'border-red-500/50 bg-red-950/40 text-red-400',
      blue: 'border-blue-500/40 bg-slate-900/90 text-blue-400',
      orange: 'border-orange-500/50 bg-orange-950/40 text-orange-400'
    };
    
    return (
      <div className={`absolute z-50 w-72 p-5 rounded-[2rem] border-2 backdrop-blur-2xl shadow-2xl animate-fade-in transition-all duration-700
        ${colorClasses[color]} ${side === 'left' ? '-left-[20rem]' : '-right-[20rem]'} top-1/4 hidden lg:block`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-6 h-6" />
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
    <div className={`max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-10 relative ${isRTL ? 'font-tajawal text-right' : 'font-sans text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* لوجو Elegant Options الأزرق في الأسفل */}
      <div className="fixed bottom-6 left-6 z-[100] hidden md:block">
         <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="w-14 h-14 object-contain" />
      </div>

      {/* العد التنازلي الضخم */}
      <div className="mb-10 w-full max-w-md">
          <div className="bg-slate-900 border-2 border-red-500/50 p-4 rounded-[2rem] flex flex-col items-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
              <span className="text-red-500 text-[10px] font-black tracking-[0.3em] mb-1 uppercase">
                {isRTL ? "العرض الحصري ينتهي خلال" : "Exclusive Offer Ends In"}
              </span>
              <div className="flex items-center gap-3">
                  <Timer className="w-6 h-6 text-red-500 animate-pulse" />
                  <span className="text-4xl font-mono font-black text-white tracking-widest">{formatTime(timeLeft)}</span>
              </div>
          </div>
      </div>

      <div className="space-y-4 w-full mb-12 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">نظام النمو الذكي وحماية السمعة</h2>
        <p className="text-blue-400 text-lg md:text-xl font-black max-w-3xl mx-auto">
            {isRTL ? "« حوّل كل عملية بيع إلى جيش من التقييمات الإيجابية وسدّ الباب أمام السلبيات تلقائياً »" : "« Scale your positive reviews and block negative feedback automatically »"}
        </p>
      </div>

      <div className="relative">
        {/* إرشادات النظام */}
        <SidebarGuide side={isRTL ? 'right' : 'left'} visible={stage === 'chat'} title={isRTL ? "الأتمتة اللحظية ⚡" : "Live Automation ⚡"} color="blue" icon={Zap}
          text={isRTL ? `بمجرد انتهاء الخدمة ${isRestaurant ? 'أو استلام الطلب من (طلبات/كيتا)' : ''}، يرسل النظام هذه الرسالة آلياً. (يمكنك تخصيص محتواها بالكامل حسب مشروعك).` : "Once service ends, the system sends this auto-message. Fully customizable to suit your brand."}
        />
        <SidebarGuide side={isRTL ? 'left' : 'right'} visible={stage === 'survey' && rating === 'sad'} title={isRTL ? "درع الحماية النشط 🛡️" : "Reputation Shield 🛡️"} color="red" icon={ShieldAlert}
          text={isRTL ? "النظام رصد استياءً! سيتم حجب هذا التقييم عن جوجل تماماً، وتوجيه العميل لرسالة خاصة للمدير لحل المشكلة فوراً." : "Dissatisfaction detected! The system blocks it from Google and opens a private channel with management."}
        />
        <SidebarGuide side={isRTL ? 'left' : 'right'} visible={stage === 'survey' && rating === 'neutral'} title={isRTL ? "إجراء وقائي ⚠️" : "Precautionary Step ⚠️"} color="orange" icon={Info}
          text={isRTL ? "تقييم متوسط؟ كإجراء احتياطي لحماية معدل النجوم، يتم تحويل العميل للمدير لمعرفة السبب بدلاً من نشره علنياً." : "Average rating? As a precaution, we direct the customer to the manager to resolve the gap privately."}
        />
        <SidebarGuide side={isRTL ? 'left' : 'right'} visible={stage === 'survey' && rating === 'happy'} title={isRTL ? "محرك الهيمنة 🚀" : "Dominance Engine 🚀"} color="green" icon={TrendingUp}
          text={isRTL ? "العميل راضٍ! النظام سيقوم بإظهار صفحة تقييم مشروعك على جوجل مباشرة بـ 5 نجوم جاهزة، ليضمن لك الصدارة." : "Happy customer! The system directly opens your Google Maps review page with 5 stars selected."}
        />

        {/* iPhone Design */}
        <div className="relative mx-auto w-[330px] md:w-[360px] h-[680px] md:h-[740px] bg-black rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 border border-white/10">
          <div className="absolute top-0 inset-x-0 h-12 z-20 flex justify-between items-center px-10 pt-4 text-white text-[12px] font-bold">
             <span>9:41</span> <div className="flex gap-2"><Signal size={14} /><Wifi size={14} /><Battery size={14} /></div>
          </div>
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[50px] m-2 border border-black/20 mt-10 mb-4">
             {stage === 'chat' ? (
                <div className="flex-1 flex flex-col bg-[#e5ddd5] h-full overflow-hidden">
                   <div className="bg-[#075e54] p-3 pt-6 flex items-center gap-3 text-white">
                      <div className="flex-1 flex items-center justify-end gap-3">
                        <div className="text-right">
                           <h3 className="text-sm font-black truncate">{data.projectName}</h3>
                           <p className="text-[9px] opacity-80 uppercase font-bold">Official Business Account</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[#075e54] font-black text-lg shadow-inner">{data.projectName?.charAt(0)}</div>
                      </div>
                   </div>
                   <div className="flex-1 p-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
                      {msgVisible && (
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-xl max-w-[90%] animate-fade-in-up border border-slate-100 float-right">
                           <p className="text-[13px] text-slate-800 leading-relaxed font-bold text-right" dir="rtl">{getCustomMessage()}</p>
                           <button onClick={() => setStage('survey')} className="w-full mt-4 bg-blue-600 py-3 rounded-xl text-white font-black text-sm shadow-lg">تقييم التجربة الآن</button>
                           <div className="flex justify-end mt-1 items-center gap-0.5 text-[#53bdeb]"><span className="text-[10px] text-slate-400 font-bold">1:21 PM</span> <CheckCheck size={14} /></div>
                        </div>
                      )}
                   </div>
                </div>
             ) : stage === 'survey' ? (
                <div className="flex-1 flex flex-col bg-white h-full overflow-hidden p-6 items-center text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-4 text-slate-400">
                      <ImageIcon size={20} />
                      <span className="text-[8px] font-black tracking-widest">LOGO</span>
                   </div>
                   <h3 className="font-black text-slate-800 text-lg mb-6">{isRTL ? "كيف كانت تجربتك معانا؟" : "How was your experience?"}</h3>
                   
                   {/* الرموز التعبيرية الملونة والمحسنة */}
                   <div className="flex justify-between w-full mb-8 px-2" dir={isRTL ? "rtl" : "ltr"}>
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
                         <textarea 
                           value={feedbackText}
                           onChange={(e) => setFeedbackText(e.target.value)}
                           placeholder={isRTL ? "اكتب تجربتك هنا بكل صراحة..." : "Write your feedback..."} 
                           className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none h-24 resize-none focus:border-blue-500 transition-colors"
                         ></textarea>
                         {rating === 'happy' ? (
                            <button onClick={() => setStage('post-demo')} className="w-full py-4 bg-[#4285F4] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl">
                               <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" className="w-5 h-5 bg-white rounded-full p-0.5" />
                               {isRTL ? "نشر تقييم 5 نجوم على جوجل" : "Post 5-Stars on Google"}
                            </button>
                         ) : (
                            <button onClick={() => setStage('post-demo')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3">
                               <UserCog size={18} /> {isRTL ? "إرسال شكوى خاصة للمدير" : "Send Private Complaint"}
                            </button>
                         )}
                      </div>
                   )}
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white h-full text-center">
                   <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100 shadow-inner"><CheckCheck size={40} className="text-green-600 animate-bounce" /></div>
                   <h2 className="text-xl font-black text-slate-900 mb-4">{isRTL ? "Elegant Options رفيقك للنجاح" : "Your Success Partner"}</h2>
                   <p className="text-slate-500 text-sm font-bold leading-relaxed">
                     {isRTL ? "نظامنا يضمن لك صدارة نتائج البحث وحماية سمعتك الرقمية لتركز أنت على تطوير مشروعك." : "We ensure you dominate search results and protect your reputation while you focus on growth."}
                   </p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-[420px] space-y-6 mt-12 px-4">
          <div className="relative group">
             <div className="absolute -top-6 z-20 bg-yellow-400 text-black font-black text-[11px] px-4 py-2 rounded-xl shadow-xl animate-bounce border-2 border-black rotate-2 right-0 tracking-widest uppercase">🔥 استلم العرض الآن</div>
             <a href={waLink} target="_blank" className="relative block w-full py-5 bg-green-600 text-white font-black text-xl rounded-[2rem] shadow-2xl text-center transform hover:-translate-y-1 transition-all border-b-4 border-green-800">
                <span className="flex items-center justify-center gap-3"><Zap className="fill-yellow-300 text-yellow-300 w-6 h-6" /> {isRTL ? "اطلب نظام الهيمنة الآن" : "Order System Now"}</span>
             </a>
          </div>
          <button onClick={onBack} className="w-full py-4 bg-slate-900 border border-slate-700 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
            {isRTL ? "العودة للتقرير الاستراتيجي" : "Back to Strategic Report"} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
