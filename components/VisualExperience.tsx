// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Zap, ShieldAlert, TrendingUp, UserCog, 
  Signal, Wifi, Battery, Sparkles, Timer, MoveRight, MoveLeft, MoveDown,
  Frown, Meh, Smile, BadgeCheck, Info, Image as ImageIcon
} from 'lucide-react';

interface VisualExperienceProps {
  language: Language;
  data: AuditData;
  onBack: () => void;
}

const VisualExperience: React.FC<VisualExperienceProps> = ({ language, data, onBack }) => {
  if (!data || !data.projectName) return null;

  const isRTL = language === 'ar';
  const [stage, setStage] = useState<'chat' | 'survey' | 'post-demo'>('chat');
  const [msgVisible, setMsgVisible] = useState(false);
  const [rating, setRating] = useState<null | 'happy' | 'neutral' | 'sad'>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSent, setIsSent] = useState(false);

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

  const getKuwaitiMessage = () => {
    if (isRTL) {
      return isRestaurant 
        ? `يعطيك العافية، مشكور على زيارتك لنا في **${data.projectName}**. عسى عجبك الأكل؟ يهمنا نعرف تجربتك معانا..`
        : `يعطيك العافية، مشكور على ثقتك في **${data.projectName}**. إن شاء الله الخدمة جازت لك وما قصرنا معاك؟ يهمنا رأيك..`;
    }
    return `Thanks for visiting **${data.projectName}**! We value your feedback..`;
  };

  const waLink = `https://wa.me/96566305551?text=${encodeURIComponent(`مرحباً، قمت بتجربة المحاكي وأريد تفعيل نظام Elegant Options لمشروعي (${data.projectName}) والاستفادة من خصم الـ 70%.`)}`;

  // --- مكون الإرشادات البيعية المدمج ---
  const InternalGuide = ({ title, text, icon: Icon, color, visible }: any) => {
    if (!visible) return null;
    const colorClasses = {
      green: 'bg-green-600 border-green-400 shadow-green-900/20',
      red: 'bg-red-600 border-red-400 shadow-red-900/20',
      blue: 'bg-blue-600 border-blue-400 shadow-blue-900/20',
      orange: 'bg-orange-600 border-orange-400 shadow-orange-900/20'
    };
    
    return (
      <div className={`absolute top-28 left-4 right-4 z-[60] p-4 rounded-2xl border-2 shadow-2xl animate-fade-in-up text-white ${colorClasses[color]}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className="w-5 h-5" />
          <h4 className="font-black text-xs uppercase tracking-tighter">{title}</h4>
        </div>
        <p className="text-[10px] leading-relaxed font-bold opacity-95">{text}</p>
        <div className="flex justify-center mt-2 animate-bounce">
           <MoveDown size={18} />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-10 relative font-tajawal text-right px-4" dir="rtl">
      
      {/* لوجو Elegant Options الأزرق - ثابت أسفل يسار */}
      <div className="fixed bottom-6 left-6 z-[100] hidden md:block">
         <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="w-14 h-14 object-contain" />
      </div>

      <div className="space-y-4 w-full mb-8 lg:mb-12 text-center">
        <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">نظام النمو الذكي وحماية السمعة</h2>
        <p className="text-blue-400 text-sm md:text-xl font-bold opacity-80 italic">« حوّل كل عملية بيع إلى جيش من التقييمات الإيجابية وسدّ الباب أمام السلبيات تلقائياً »</p>
      </div>

      <div className="relative w-full flex flex-col items-center">
        {/* iPhone Simulation Container */}
        <div className="relative mx-auto w-full max-w-[330px] md:max-w-[360px] h-[680px] md:h-[740px] bg-black rounded-[50px] lg:rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 border border-white/10">
          
          <div className="absolute top-0 inset-x-0 h-12 z-20 flex justify-between items-center px-10 pt-4 text-white text-[12px] font-bold" dir="ltr">
             <span>9:41</span> <div className="flex gap-2"><Signal size={14} /><Wifi size={14} /><Battery size={14} /></div>
          </div>
          
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[40px] lg:rounded-[50px] m-1.5 lg:m-2 border border-black/20 mt-10 mb-4">
             
             {/* إرشادات النظام المقنعة (داخل الشاشة) */}
             <InternalGuide visible={stage === 'chat'} title="الأتمتة اللحظية ⚡" color="blue" icon={Zap}
               text={`تخيل النظام يرسل هالرسالة تلقائياً لعملائك الراضين.. هالسرعة تخلي العميل يقيمك وهو مستانس، وهالشي يضمن لك تصدر نتائج البحث بمجهود صفر.`}
             />
             <InternalGuide visible={stage === 'survey' && rating === 'sad'} title="درع الحماية النشط 🛡️" color="red" icon={ShieldAlert}
               text="الذكاء الاصطناعي رصد زعل العميل! بدال ما يروح يحط نجمة وحدة بجوجل ويهدم سمعتك، النظام بيمتص غضبه ويحول شكواه لرسالة سرية خاصة لك.. جذي إنت تحمي مشروعك من التقييمات اللي تكسر البيزنس."
             />
             <InternalGuide visible={stage === 'survey' && rating === 'neutral'} title="إجراء وقائي ذكي ⚠️" color="orange" icon={Info}
               text="تقييم متوسط؟ هذا يعني فيه قصور بالخدمة.. النظام بيحول العميل للإدارة عشان تعرف الخلل وتصلحه، وبنفس الوقت نحمي معدل النجوم بمشروعك من الانخفاض."
             />
             <InternalGuide visible={stage === 'survey' && rating === 'happy'} title="محرك الهيمنة الرقمية 🚀" color="green" icon={TrendingUp}
               text="العميل مستانس! النظام بيفهم هالشي ويفتح له صفحة تقييمك بجوجل ماب والـ 5 نجوم مختارة جاهزة.. تخيل كم تقييم ممتاز بتحصل يومياً بدون أي مجهود؟ اطلب النظام الحين وشوف الفرق."
             />

             {stage === 'chat' ? (
                <div className="flex-1 flex flex-col bg-[#e5ddd5] h-full overflow-hidden">
                   <div className="bg-[#075e54] p-3 pt-6 flex items-center justify-between text-white shadow-md" dir="rtl">
                      <div className="flex items-center justify-start gap-2 flex-1">
                        <ArrowRight size={22} className="cursor-pointer opacity-90" onClick={onBack} />
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-[#075e54] font-black text-base shadow-inner shrink-0">
                            {data.projectName?.charAt(0)}
                        </div>
                        <div className="text-right overflow-hidden">
                           <div className="flex items-center justify-start gap-1">
                              <h3 className="text-xs font-black truncate max-w-[100px]">{data.projectName}</h3>
                              <BadgeCheck size={14} className="text-blue-400 fill-blue-400 shrink-0" />
                           </div>
                           <p className="text-[8px] opacity-80 font-bold truncate text-right">نشط الآن • حساب تجاري</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-70 shrink-0">
                        <Video size={18} /> <Phone size={18} /> <MoreVertical size={18} />
                      </div>
                   </div>

                   <div className="flex-1 p-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
                      {msgVisible && (
                        <div className="bg-white p-3 lg:p-4 rounded-2xl rounded-tl-none shadow-xl max-w-[92%] animate-fade-in-up border border-slate-100 float-right relative mt-32" dir="rtl">
                           <div className="absolute -top-0 -right-2 w-4 h-4 bg-white border-t border-r border-slate-100 transform rotate-45"></div>
                           <p className="text-[12px] lg:text-[13px] text-slate-800 leading-relaxed font-bold text-right relative z-10">{getKuwaitiMessage()}</p>
                           <button onClick={() => setStage('survey')} className="w-full mt-3 bg-blue-600 py-2.5 rounded-xl text-white font-black text-xs lg:text-sm shadow-lg shadow-blue-100 relative z-10">تقييم التجربة الآن</button>
                           <div className="flex justify-end mt-1 items-center gap-0.5 text-[#53bdeb] relative z-10"><span className="text-[9px] text-slate-400 font-bold">1:21 PM</span> <CheckCheck size={12} /></div>
                        </div>
                      )}
                   </div>
                </div>
             ) : stage === 'survey' ? (
                <div className="flex-1 flex flex-col bg-white h-full overflow-hidden p-4 lg:p-6 items-center text-center mt-32" dir="rtl">
                   <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-4 text-slate-400">
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-black tracking-widest mt-1 uppercase">Your Logo</span>
                   </div>
                   <div className="mb-6 px-2">
                      <h3 className="font-black text-slate-800 text-base lg:text-lg mb-1">كيف كانت تجربتك معانا؟</h3>
                      <p className="text-[9px] text-slate-500 font-bold leading-tight">مشروع **{data.projectName}** يطلب مشاركة تجربتك بكل شفافية</p>
                   </div>
                   
                   {/* Emoji Selection */}
                   <div className="flex justify-between w-full mb-8 px-2">
                      <button onClick={() => setRating('happy')} className={`group flex flex-col items-center gap-2 transition-all ${rating === 'happy' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-14 h-14 lg:w-16 lg:h-16 bg-green-50 rounded-2xl flex items-center justify-center border-2 border-green-200 shadow-lg group-hover:border-green-500"><Smile size={40} className="text-green-500" /></div>
                         <span className="text-[10px] font-black text-green-600">ممتازة</span>
                      </button>
                      <button onClick={() => setRating('neutral')} className={`group flex flex-col items-center gap-2 transition-all ${rating === 'neutral' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-14 h-14 lg:w-16 lg:h-16 bg-yellow-50 rounded-2xl flex items-center justify-center border-2 border-yellow-200 shadow-lg group-hover:border-yellow-500"><Meh size={40} className="text-yellow-500" /></div>
                         <span className="text-[10px] font-black text-yellow-600">متوسطة</span>
                      </button>
                      <button onClick={() => setRating('sad')} className={`group flex flex-col items-center gap-2 transition-all ${rating === 'sad' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-14 h-14 lg:w-16 lg:h-16 bg-red-50 rounded-2xl flex items-center justify-center border-2 border-red-200 shadow-lg group-hover:border-red-500"><Frown size={40} className="text-red-500" /></div>
                         <span className="text-[10px] font-black text-red-600">سيئة</span>
                      </button>
                   </div>

                   {rating && !isSent && (
                      <div className="w-full animate-fade-in-up space-y-3">
                         <textarea 
                           value={feedbackText} 
                           onChange={(e) => setFeedbackText(e.target.value)} 
                           placeholder="اكتب ملاحظاتك هنا.. خلك صريح!" 
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none h-20 resize-none focus:border-blue-500"
                         ></textarea>
                         <button onClick={() => setIsSent(true)} className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl ${rating === 'happy' ? 'bg-[#4285F4] text-white' : 'bg-slate-900 text-white'}`}>
                            {rating === 'happy' ? (
                               <>
                                 <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" className="w-4 h-4 bg-white rounded-full p-0.5" />
                                 ارسال ونشر على جوجل ماب
                               </>
                            ) : "إرسال ملاحظة خاصة للمدير"}
                         </button>
                      </div>
                   )}

                   {isSent && (
                      <div className="w-full animate-fade-in-up p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex flex-col items-center">
                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2"><CheckCheck size={20} className="text-green-600" /></div>
                         {rating === 'happy' ? (
                            <>
                               <h4 className="text-xs font-black text-slate-800 mb-1">سيتم التوجيه لجوجل الآن</h4>
                               <p className="text-[8px] text-green-600 font-bold leading-tight">ستظهر الآن للعميل شاشة تقييمات جوجل لوضع تقييم 5 نجوم مباشرة</p>
                            </>
                         ) : (
                            <>
                               <h4 className="text-xs font-black text-slate-800 mb-1">تم الإرسال بنجاح</h4>
                               <p className="text-[8px] text-red-500 font-bold leading-tight">تم تحويل شكواك للإدارة ولن تظهر للعامة في جوجل</p>
                            </>
                         )}
                         <button onClick={() => setStage('post-demo')} className="mt-3 text-[9px] font-black text-blue-500 uppercase tracking-widest underline">إنهاء العرض</button>
                      </div>
                   )}
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full text-center mt-32" dir="rtl">
                   <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100 shadow-inner"><CheckCheck size={32} className="text-green-600 animate-bounce" /></div>
                   <h2 className="text-lg font-black text-slate-900 mb-2 leading-tight uppercase">نظام Elegant Options: حماية مستمرة لا تتوقف</h2>
                   <p className="text-slate-600 text-[10px] font-bold leading-relaxed px-2">يضمن لك صدارة البحث وحماية سمعتك الرقمية تلقائياً وبشكل مستمر.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-[420px] space-y-4 mt-8 lg:mt-12 px-4 flex flex-col items-center">
          <div className="bg-red-600/10 border border-red-500/30 py-2 px-6 rounded-full inline-flex items-center gap-3 animate-pulse">
              <Timer className="w-4 h-4 text-red-500" />
              <span className="text-[10px] lg:text-[11px] font-black text-white tracking-widest uppercase">
                 احجز الخصم الخاص بك: <span className="font-mono text-base ml-1">{formatTime(timeLeft)}</span>
              </span>
          </div>
          <div className="relative group w-full">
             <div className="absolute -top-4 z-20 bg-yellow-400 text-black font-black text-[10px] px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse border-2 border-black rotate-2 right-0">🔥 خصم 70% متاح الآن</div>
             <a href={waLink} target="_blank" className="relative block w-full py-4 lg:py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xl lg:text-2xl rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl text-center transform hover:-translate-y-1 transition-all border-b-4 border-green-800">
                <span className="flex items-center justify-center gap-2 lg:gap-3"><Zap className="fill-yellow-300 text-yellow-300 w-5 h-5 lg:w-7 lg:h-7" /> احصل على النظام الآن</span>
             </a>
          </div>
          <button onClick={onBack} className="w-full py-2 text-slate-500 font-bold hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
            العودة للتقرير الاستراتيجي <ArrowLeft size={14} />
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
