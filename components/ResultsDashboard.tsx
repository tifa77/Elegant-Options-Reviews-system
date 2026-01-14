// @ts-nocheck
import React from 'react';
import { Language, AuditData } from '../types';
import { TEXTS } from '../constants';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  Ghost, 
  Crown, 
  Activity, 
  ArrowUpRight,
  MessageCircle, 
  RotateCw, 
  Play, 
  Zap, 
  BarChart3,
  Utensils, 
  Bike, 
  Percent, 
  Users, 
  Award, 
  CheckCircle, 
  Eye, 
  ShieldCheck, 
  DollarSign, 
  Star, 
  HelpCircle, 
  Quote, 
  Share2, 
  Globe,
  Bot,
  Rocket
} from 'lucide-react';

interface ResultsDashboardProps {
  language: Language;
  data: AuditData;
  onReset: () => void;
  onBack: () => void;
  onVisualExp: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ language, data, onReset, onBack, onVisualExp }) => {
  const t = TEXTS[language] ?? TEXTS['ar'];
  const isRTL = language === 'ar';
  const isRestaurant =
    data.projectType === 'restaurant' ||
    data.projectType === 'مطعم' ||
    data.projectType === 'cafe';

  // --- محرك الأمان الرقمي والحسابات (Anti-NaN Engine) ---

  const currentYear = new Date().getFullYear();

  // ✅ القراءة الصحيحة لسنة التأسيس مع دعم الاسمين: establishmentYear / establishedYear
  const rawEstablishedYear = Number(
    (data as any).establishmentYear ?? (data as any).establishedYear
  );

  const ageYears =
    Number.isFinite(rawEstablishedYear) &&
    rawEstablishedYear > 1900 &&
    rawEstablishedYear <= currentYear
      ? Math.max(1, currentYear - rawEstablishedYear)
      : 1; // fallback = سنة واحدة فقط إذا لم تتوافر بيانات صحيحة

  const totalReviews = Number(data.currentReviews) || 0;
  const dailyCustomers = Number(data.dailyCustomers) || 0;

  // ✅ الآن هذا فعلاً "معدل التقييمات خلال فترة النشاط"
  const avgReviewsPerYear = Number((totalReviews / ageYears).toFixed(1)) || 0;

  const getRegionalData = () => {
    const address = (data.address || '').toLowerCase();
    const isKuwait = address.includes('kuwait') || address.includes('الكويت');
    return isKuwait
      ? { symbol: isRTL ? 'د.ك' : 'KWD', ticket: 20 }
      : { symbol: isRTL ? 'دولار' : 'USD', ticket: 60 };
  };

  const regional = getRegionalData();
  const currency = regional.symbol;

  const currentWeekly = Number(data.weeklyGrowth) || 0;
  const currentMonthly = Number(data.monthlyGrowth) || 0;
  const multiplier = isRestaurant ? 10 : 6;

  const projectedWeekly = Math.max(8, currentWeekly * multiplier || 8);
  const projectedMonthly = Math.max(35, currentMonthly * multiplier || 35);
  const projectedYearlyReviews = projectedMonthly * 12;
  const baseYearlyReviews = currentMonthly * 12;

  const percentageIncrease =
    baseYearlyReviews > 0
      ? Math.round(
          ((projectedYearlyReviews - baseYearlyReviews) / baseYearlyReviews) * 100
        )
      : 100;

  const systemDailyPotential = Math.round(dailyCustomers * 0.1);
  const annualAdditionalReviews = systemDailyPotential * 365;
  const customerLossMultiplier = 4;
  const lostCustomersCount = Math.max(
    0,
    (projectedYearlyReviews - baseYearlyReviews) * customerLossMultiplier
  );
  const lostRevenue = lostCustomersCount * regional.ticket;
  const dynamicProfitValue = annualAdditionalReviews * regional.ticket * 5;
  const dynamicProfit = Number.isFinite(dynamicProfitValue)
    ? dynamicProfitValue.toLocaleString()
    : '0';

  // --- منطق التشخيص السوقي المدمج (كما هو) ---
  const getMarketStatus = () => {
    const incentive = isRTL
      ? '⚠️ تنبيه: المنافسون في منطقتك يكثفون نشاطهم الآن لتجاوز تصنيفك.'
      : '⚠️ Alert: Competitors are intensifying their activity to overtake you.';

    if (avgReviewsPerYear < 15) {
      return {
        title: isRTL ? 'شبح رقمي - مخفي' : 'Digital Ghost',
        desc: isRTL
          ? 'أنت غير مرئي للعملاء الجدد. محركات البحث تتجاهل نشاطك بسبب ضعف التفاعل الحقيقي.'
          : 'Invisible to new customers. Search engines ignore you due to low engagement.',
        color: 'text-red-500',
        bg: 'bg-red-900/20',
        border: 'border-red-500/30',
        icon: Ghost,
        incentive,
      };
    } else if (avgReviewsPerYear < 80) {
      return {
        title: isRTL ? 'تواجد متوسط - مهدد' : 'Average Presence',
        desc: isRTL
          ? 'أنت موجود ولكنك مهدد. المنافسون يبتلعون حصتك السوقية تدريجياً لأنهم أكثر نشاطاً منك.'
          : 'You are present but at risk. Competitors are eating your market share.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-900/20',
        border: 'border-yellow-500/30',
        icon: Target,
        incentive,
      };
    }
    return {
      title: isRTL ? 'متواجد بقوة' : 'Strong Presence',
      desc: isRTL
        ? 'أداء ممتاز، ولكن الحفاظ على القمة أصعب من الوصول إليها. المنافسون يتربصون بك.'
        : 'Good performance, but staying on top is harder. Competitors are watching.',
      color: 'text-green-500',
      bg: 'bg-green-900/20',
      border: 'border-green-500/30',
      icon: Crown,
      incentive,
    };
  };

  const status = getMarketStatus();
  const dashboard = t.dashboard ?? {};

  const waNumber = '96566305551';
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    isRTL
      ? `أريد تفعيل نظام النمو وإيقاف خسارة العملاء لمشروعي (${data.projectName})`
      : `I want to activate growth for (${data.projectName})`
  )}`;

  /* 🔽 بقية الكود (الـ JSX كله) يبقى كما أرسلته تماماً
     لأنه أصلاً يستخدم avgReviewsPerYear و ageYears الآن بشكل صحيح.
     انسخ نفس الـ JSX السابق بدون تغيير.
  */

  // ... ضع هنا نفس JSX من ردّي السابق كما هو بدون تعديل

  return (
    // JSX الكامل الذي أرسلته في الرسالة الماضية
    // (يمكنك إبقاءه كما هو وسيعمل الآن مع حساب السنوات بشكل صحيح)
    <div
      className={`max-w-5xl mx-auto space-y-16 animate-fade-in pb-32 ${
        isRTL ? 'font-tajawal text-right' : 'font-sans text-left'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* كل الـ Sections كما في الكود السابق */}
      {/* Hero, Metrics, Comparison, Features, Profit, Buttons ... */}
    </div>
  );
};

export default ResultsDashboard;
