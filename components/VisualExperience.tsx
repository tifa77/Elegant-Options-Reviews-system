// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  ArrowLeft, ArrowRight, MoreVertical, Phone, Video, 
  CheckCheck, Zap, ShieldAlert, TrendingUp, UserCog, 
  Signal, Wifi, Battery, Sparkles, Timer, MoveRight, MoveLeft, 
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
    if (isRestaurant) return `يعطيك العافية، مشكور على زيارتك لنا في **${data.projectName}**. عسى عجبك الأكل؟ يهمنا نعرف تجربتك معانا..`;
    return `يعطيك العافية، مشكور على ثقتك في **${data.projectName}**. إن شاء الله الخدمة جازت لك وما قصرنا معاك؟ يهمنا رأيك..`;
  };

  const waLink = `https://wa.me/96566305551?text=${encodeURIComponent(`مرحباً، أريد الاستفادة من خصم الـ 70% وتفعيل نظام Elegant Options لمشروعي (${data.projectName}).`)}`;

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center animate-fade-in pb-10 relative font-tajawal text-right" dir="rtl">
      
      {/* لوجو Elegant Options الأزرق - ثابت أسفل يسار */}
      <div className="fixed bottom-6 left-6 z-[100] hidden md:block">
         <img src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" alt="Elegant Options" className="w-14 h-14 object-contain" />
      </div>

      {/* Header */}
      <div className="space-y-4 w-full mb-10 px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">نظام النمو الذكي وحماية السمعة</h2>
        <p className="text-blue-400 text-lg md:text-xl font-bold opacity-80 italic">« حوّل كل عملية بيع إلى جيش من التقييمات الإيجابية وسدّ الباب أمام السلبيات تلقائياً »</p>
      </div>

      <div className="relative">
        {/* iPhone Simulation */}
        <div className="relative mx-auto w-[330px] md:w-[360px] h-[680px] md:h-[740px] bg-black rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 border border-white/10">
          <div className="absolute top-0 inset-x-0 h-12 z-20 flex justify-between items-center px-10 pt-4 text-white text-[12px] font-bold">
             <span>9:41</span> <div className="flex gap-2"><Signal size={14} /><Wifi size={14} /><Battery size={14} /></div>
          </div>
          <div className="flex-1 relative flex flex-col overflow-hidden bg-white rounded-[50px] m-2 border border-black/20 mt-10 mb-4">
             {stage === 'chat' ? (
                <div className="flex-1 flex flex-col bg-[#e5ddd5] h-full overflow-hidden">
                   {/* WhatsApp Header - Realistic RTL */}
                   <div className="bg-[#075e54] p-3 pt-6 flex items-center justify-between text-white shadow-md">
                      <div className="flex items-center gap-3">
                        <MoreVertical size={20} className="opacity-70" />
                        <Phone size={18} className="opacity-70" />
                        <Video size={18} className="opacity-70" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                           <div className="flex items-center justify-end gap-1">
                              <h3 className="text-sm font-black truncate max-w-[120px]">{data.projectName}</h3>
                              <BadgeCheck size={16} className="text-blue-400 fill-blue-400" />
                           </div>
                           <p className="text-[9px] opacity-80 font-bold">نشط الآن</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[#075e54] font-black text-lg shadow-inner">{data.projectName?.charAt(0)}</div>
                        <ArrowRight size={20} className="opacity-70" onClick={onBack} />
                      </div>
                   </div>
                   <div className="flex-1 p-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}>
                      {msgVisible && (
                        <div className="bg-white p-4 rounded-2xl rounded-tr-none shadow-xl max-w-[90%] animate-fade-in-up border border-slate-100 float-right">
                           <p className="text-[13px] text-slate-800 leading-relaxed font-bold text-right" dir="rtl">{getKuwaitiMessage()}</p>
                           <button onClick={() => setStage('survey')} className="w-full mt-4 bg-blue-600 py-3 rounded-xl text-white font-black text-sm shadow-lg">تقييم التجربة الآن</button>
                           <div className="flex justify-end mt-1 items-center gap-0.5 text-[#53bdeb]"><span className="text-[10px] text-slate-400 font-bold">1:21 PM</span> <CheckCheck size={14} /></div>
                        </div>
                      )}
                   </div>
                </div>
             ) : stage === 'survey' ? (
                <div className="flex-1 flex flex-col bg-white h-full overflow-hidden p-6 items-center text-center">
                   {/* YOUR LOGO - Enlarged */}
                   <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-4 text-slate-400 shadow-inner">
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-black tracking-widest mt-1">YOUR LOGO</span>
                   </div>
                   <div className="mb-6 px-2">
                      <h3 className="font-black text-slate-800 text-lg mb-1">كيف كانت تجربتك معانا؟</h3>
                      <p className="text-[10px] text-slate-500 font-bold">مشروع **{data.projectName}** يطلب مشاركة تجربتك بكل شفافية</p>
                   </div>
                   
                   <div className="flex justify-between w-full mb-8 px-2" dir="rtl">
                      <button onClick={() => setRating('happy')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'happy' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center border-2 border-green-200 shadow-xl group-hover:border-green-500"><Smile size={48} className="text-green-500" /></div>
                         <span className="text-xs font-black text-green-600">ممتازة</span>
                      </button>
                      <button onClick={() => setRating('neutral')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'neutral' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-yellow-50 rounded-3xl flex items-center justify-center border-2 border-yellow-200 shadow-xl group-hover:border-yellow-500"><Meh size={48} className="text-yellow-500" /></div>
                         <span className="text-xs font-black text-yellow-600">متوسطة</span>
                      </button>
                      <button onClick={() => setRating('sad')} className={`group flex flex-col items-center gap-3 transition-all duration-500 ${rating === 'sad' ? 'scale-110' : 'opacity-30 grayscale'}`}>
                         <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center border-2 border-red-200 shadow-xl group-hover:border-red-500"><Frown size={48} className="text-red-500" /></div>
                         <span className="text-xs font-black text-red-600">سيئة</span>
                      </button>
                   </div>

                   {rating && !isSent && (
                      <div className="w-full animate-fade-in-up space-y-4">
                         <textarea 
                           value={feedbackText}
                           onChange={(e) => setFeedbackText(e.target.value)}
                           placeholder="اكتب ملاحظاتك هنا بكل صراحة..." 
                           className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none h-24 resize-none focus:border-blue-500 transition-colors"
                         ></textarea>
                         <button onClick={() => setIsSent(true)} className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${rating === 'happy' ? 'bg-[#4285F4] text-white' : 'bg-slate-900 text-white'}`}>
                            {rating === 'happy' ? "إرسال ونشر على جوجل ماب" : "إرسال ملاحظة خاصة للمدير"}
                         </button>
                      </div>
                   )}

                   {isSent && (
                      <div className="w-full animate-fade-in-up p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3"><CheckCheck className="text-green-600" /></div>
                         {rating === 'happy' ? (
                            <>
                               <h4 className="text-sm font-black text-slate-800 mb-1">سيتم التوجيه لجوجل الآن</h4>
                               <p className="text-[10px] text-green-600 font-bold text-center leading-relaxed">ستظهر الآن للعميل شاشة تقييمات جوجل لوضع تقييم 5 نجوم بشكل مباشر</p>
                            </>
                         ) : (
                            <>
                               <h4 className="text-sm font-black text-slate-800 mb-1">تم إرسال ملاحظتك بنجاح</h4>
                               <p className="text-[10px] text-red-500 font-bold text-center leading-relaxed">تم تحويل الرسالة للإدارة لمعالجة شكواك ولن تظهر للعامة في جوجل</p>
                            </>
                         )}
                         <button onClick={() => setStage('post-demo')} className="mt-4 text-[10px] font-black text-blue-500 uppercase tracking-widest underline">إنهاء العرض</button>
                      </div>
                   )}
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white h-full text-center">
                   <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-inner"><CheckCheck size={50} className="text-green-600 animate-bounce" /></div>
                   <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Elegant Options حماية كاملة 24/7</h2>
                   <p className="text-slate-600 text-[11px] font-bold leading-relaxed px-4">هذا النظام يضمن لك صدارة نتائج البحث وحماية سمعتك الرقمية من أي عثرات قد تؤثر على مبيعاتك.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* CTA Section - Re-engineered */}
      <div className="w-full max-w-[420px] space-y-5 mt-12 px-4 flex flex-col items-center">
          
          {/* احجز الخصم الخاص بك - Small & Bottom */}
          <div className="bg-red-600/10 border border-red-500/30 py-2 px-6 rounded-full inline-flex items-center gap-3 animate-pulse">
              <Timer className="w-4 h-4 text-red-500" />
              <span className="text-[11px] font-black text-white tracking-widest uppercase">
                 احجز الخصم الخاص بك: <span className="font-mono text-base ml-1">{formatTime(timeLeft)}</span>
              </span>
          </div>

          <div className="relative group w-full">
             {/* Discount Badge */}
             <div className="absolute -top-5 z-20 bg-yellow-400 text-black font-black text-[12px] px-4 py-1.5 rounded-xl shadow-xl border-2 border-black rotate-2 right-0 tracking-tighter">🔥 خصم 70% متاح الآن</div>
             
             <a href={waLink} target="_blank" className="relative block w-full py-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-2xl rounded-[2rem] shadow-2xl text-center transform hover:-translate-y-1 transition-all border-b-4 border-green-800">
                <span className="flex items-center justify-center gap-3"><Zap className="fill-yellow-300 text-yellow-300 w-6 h-6" /> خصم 70%</span>
             </a>
          </div>

          <button onClick={onBack} className="w-full py-3 text-slate-500 font-bold hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] opacity-60">
            العودة للتقرير الاستراتيجي <ArrowLeft size={16} />
          </button>
      </div>
    </div>
  );
};

export default VisualExperience;
