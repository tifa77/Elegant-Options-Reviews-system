// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Zap, ShieldAlert, TrendingUp, UserCog, 
  Signal, Wifi, Battery, Sparkles, Timer, MoveDown,
  Frown, Meh, Smile, BadgeCheck, Info, Image as ImageIcon, ExternalLink
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

  const isRestaurant = data.projectType === 'restaurant' || data.projectType === 'cafe' || data.projectType === 'مطعم';

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

  const waLink = `https://wa.me/96566305551?text=${encodeURIComponent(`مرحباً، قمت بتجربة المحاكي وأريد تفعيل نظام Elegant Options لمشروعي (${data.projectName}).`)}`;

  // --- مكون الإرشادات المنسق (مع مؤثر حركي وبدون حجب الاسم) ---
  const InternalGuide = ({ title, text, icon: Icon, color, visible }: any) => {
    if (!visible) return null;
    const colorClasses = {
      green: 'bg-green-400 border-green-500 shadow-green-900/10',
      red: 'bg-red-400 border-red-500 shadow-red-900/10',
      blue: 'bg-blue-400 border-blue-500 shadow-blue-900/10',
      orange: 'bg-orange-400 border-orange-500 shadow-orange-900/10'
    };
    
    return (
      <div className={`absolute top-24 left-3 right-3 z-[70] p-3.5 rounded-[1.2rem] border-2 shadow-xl animate-bounce-subtle text-black ${colorClasses[color]} backdrop-blur-md transition-all duration-500`}>
        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
          <Icon className="w-4 h-4 text-black" />
          <h4 className="font-black text-[10px] uppercase tracking-tighter">{title}</h4>
        </div>
        <p className="text-[9px] leading-relaxed font-bold">{text}</p>
        <div className="flex justify-center mt-1 animate-pulse">
           <MoveDown size={14} className="text-black" />
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-10 relative font-tajawal ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* لوجو Elegant Options الأزرق */}
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-[100] hidden md:block`}>
         <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="w-16 h-16 object-contain" />
      </div>

      <div className="space-y-4 w-full mb-12 px-4 text-center">
        <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">نظام النمو الذكي وحماية السمعة</h2>
        <p className="text-blue-400 text-sm md:text-xl font-bold opacity-80 italic">« حوّل كل عملية بيع إلى جيش من التقييمات الإيجابية وسدّ الباب أمام السلبيات تلقائياً »</p>
      </div>

      <div className="relative w-full flex flex-col items-center">
        <div className="relative mx-auto w-full max-w-[330px] md:max-w-[360px] h-[680px] md:h-[740px] bg-black rounded-[50px] lg:rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 border border-white/10">
          
          <div className="absolute top-0 inset-x-0 h-12 z-20 flex justify-between items-center px-10 pt-4 text-white text-[12px] font-bold" dir="ltr">
             <span>9:41</span> <div className="flex gap-2"><Signal size={14} /><Wifi size={14} /><Battery size={14} /></div>
          </div>
          
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[40px] lg:rounded-[50px] m-1.5 lg:m-2 border border-black/20 mt-10 mb-4">
             
             {/* التنبيهات المنسقة حسب القطاع والقرار */}
             <InternalGuide visible={stage === 'chat'} title={isRTL ? "الأتمتة اللحظية ⚡" : "Instant Automation ⚡"} color="blue" icon={Zap}
               text={isRTL 
                 ? (isRestaurant ? "عند استلام طلب الأكل من شركات التوصيل أو المطعم مباشرة، يرسل النظام هذه الرسالة المخصصة فوراً لضمان الحصول على التقييم في ذروة رضا العميل." : "يقوم النظام بإرسال رسالة مخصصة آلياً فور انتهاء الخدمة لضمان الحصول على التقييم في ذروة رضا العميل.")
                 : "System sends an automated custom message instantly to capture the review at peak satisfaction."}
             />
             <InternalGuide visible={stage === 'survey' && rating === 'sad'} title={isRTL ? "درع الحماية النشط 🛡️" : "Active Protection 🛡️"} color="red" icon={ShieldAlert}
               text={isRTL ? "تم رصد استياء العميل! سيتم توجيه ملاحظته للادارة فوراً للتواصل معه والحرص على رضاء جميع العملاء، بدلاً من نشرها علنياً." : "Dissatisfaction caught! We direct feedback to management to ensure customer happiness privately."}
             />
             <InternalGuide visible={stage === 'survey' && rating === 'neutral'} title={isRTL ? "إجراء وقائي ذكي ⚠️" : "Precautionary Step ⚠️"} color="orange" icon={Info}
               text={isRTL ? "تقييم متوسط؟ يتم تحويل الملاحظة للإدارة داخلياً لمعالجة القصور، لضمان بقاء صدارتك في جوجل ماب دون أي تأثير سلبي." : "Average rating handled internally to maintain your top position on Google Maps."}
             />
             <InternalGuide visible={stage === 'survey' && rating === 'happy'} title={isRTL ? "محرك الهيمنة الرقمية 🚀" : "Digital Dominance 🚀"} color="green" icon={TrendingUp}
               text={isRTL ? "ستظهر الآن صفحة التقييمات للعميل.. وهذا هو الوقت المناسب وأقوى تحفيز لتقييمك بـ 5 نجوم لتعزيز صدارتك الرقمية." : "The review page appears now—this is the perfect time and strongest motivator for a 5-star rating."}
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
                           <p className="text-[8px] opacity-80 font-bold">نشط الآن • حساب تجاري</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-70 shrink-0">
                        <Video size={18} /> <Phone size={18} /> <MoreVertical size={18} />
                      </div>
                   </div>

                   <div className="flex-1 p-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
                      {msgVisible && (
                        <div className="bg-white p-3 lg:p-4 rounded-2xl rounded-tl-none shadow-xl max-w-[92%] animate-fade-in-up border border-slate-100 float-right relative mt-52" dir="rtl">
                           <div className="absolute -top-0 -right-2 w-4 h-4 bg-white border-t border-r border-slate-100 transform rotate-45"></div>
                           <p className="text-[12px] lg:text-[13px] text-slate-800 leading-relaxed font-bold text-right relative z-10">{getKuwaitiMessage()}</p>
                           <button onClick={() => setStage('survey')} className="w-full mt-3 bg-blue-600 py-2.5 rounded-xl text-white font-black text-xs lg:text-sm shadow-lg shadow-blue-100 relative z-10">تقييم التجربة الآن</button>
                           <div className="flex justify-end mt-1 items-center gap-0.5 text-[#53bdeb] relative z-10"><span className="text-[9px] text-slate-400 font-bold">1:21 PM</span> <CheckCheck size={12} /></div>
                        </div>
                      )}
                   </div>
                </div>
             ) : stage === 'survey' ? (
                <div className="flex-1 flex flex-col bg-white h-full overflow-hidden p-4 lg:p-6 items-center text-center mt-36" dir="rtl">
                   <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-4 text-slate-400">
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-black tracking-widest mt-1 uppercase">Your Logo</span>
                   </div>
                   <div className="mb-6 px-2">
                      <h3 className="font-black text-slate-800 text-base lg:text-lg mb-1">كيف كانت تجربتك معانا؟</h3>
                      <p className="text-[9px] text-slate-500 font-bold leading-tight">مشروع **{data.projectName}** يطلب مشاركة تجربتك بكل شفافية</p>
                   </div>
                   
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
                           placeholder={isRTL ? "أخبرنا بتجربتك لتحسين خدمتنا..." : "Share your experience..."} 
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none h-20 resize-none focus:border-blue-500 transition-all text-black"
                         ></textarea>
                         <button onClick={() => setIsSent(true)} className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transform active:scale-95 transition-transform ${rating === 'happy' ? 'bg-[#4285F4] text-white' : 'bg-slate-900 text-white'}`}>
                            {rating === 'happy' ? (
                               <>
                                 <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" className="w-4 h-4 bg-white rounded-full p-0.5" alt="Google" />
                                 {isRTL ? "ارسال ونشر على جوجل ماب" : "Send & Post on Google Maps"}
                               </>
                            ) : (isRTL ? "إرسال ملاحظة خاصة للمدير" : "Send Private Feedback")}
                         </button>
                      </div>
                   )}

                   {isSent && (
                      <div className="w-full animate-fade-in-up p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex flex-col items-center">
                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2"><CheckCheck size={20} className="text-green-600" /></div>
                         {rating === 'happy' ? (
                            <>
                               <h4 className="text-xs font-black text-slate-800 mb-1">ستظهر صفحة التقييمات الآن</h4>
                               <p className="text-[8px] text-green-600 font-bold leading-tight">هذا هو أقوى تحفيز والوقت المناسب للعميل لتقييمك بـ 5 نجوم لتعزيز صدارتك الرقمية.</p>
                            </>
                         ) : (
                            <>
                               <h4 className="text-xs font-black text-slate-800 mb-1">تم توجيه ملاحظتك للادارة</h4>
                               <p className="text-[8px] text-red-500 font-bold leading-tight">سيتم التواصل معك والحرص على رضاء جميع العملاء، ولن تظهر هذه الرسالة للعامة.</p>
                            </>
                         )}
                         <button onClick={() => setStage('post-demo')} className="mt-4 text-[9px] font-black text-blue-500 uppercase tracking-widest underline decoration-2 underline-offset-4">{isRTL ? "إنهاء العرض" : "Finish Demo"}</button>
                      </div>
                   )}
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full text-center mt-32" dir="rtl">
                   <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100 shadow-inner"><CheckCheck size={32} className="text-green-600 animate-bounce" /></div>
                   <h2 className="text-lg font-black text-slate-900 mb-2 leading-tight uppercase tracking-tighter">نظام ELEGANT OPTIONS: حماية مستمرة لا تتوقف</h2>
                   <p className="text-slate-600 text-[10px] font-bold leading-relaxed px-2 mb-6">يضمن لك صدارة البحث وحماية سمعتك الرقمية تلقائياً وبشكل مستمر على مدار الساعة.</p>
                   
                   {/* دعوة لاخذ اجراء في نهاية المحاكي */}
                   <a href={waLink} target="_blank" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-black shadow-lg animate-pulse">
                      احصل على العرض المميز الآن <ExternalLink size={12} />
                   </a>
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
                 {isRTL ? "احجز الخصم الخاص بك:" : "Claim Your Discount:"} <span className="font-mono text-base ml-1">{formatTime(timeLeft)}</span>
              </span>
          </div>
          <div className="relative group w-full">
             <div className="absolute -top-4 z-20 bg-yellow-400 text-black font-black text-[10px] px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse border-2 border-black rotate-2 right-0">🔥 خصم 70% متاح الآن</div>
             <a href={waLink} target="_blank" rel="noopener noreferrer" className="relative block w-full py-4 lg:py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xl lg:text-2xl rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl text-center transform hover:-translate-y-1 transition-all border-b-4 border-green-800">
                <span className="flex items-center justify-center gap-2 lg:gap-3 uppercase tracking-tighter"><Zap className="fill-yellow-300 text-yellow-300 w-5 h-5 lg:w-7 lg:h-7" /> احصل على النظام الآن</span>
             </a>
          </div>
          <button onClick={onBack} className="w-full py-2 text-slate-500 font-bold hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
            {isRTL ? "العودة للتقرير الاستراتيجي" : "Back to Strategic Report"} <ArrowLeft size={14} />
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
