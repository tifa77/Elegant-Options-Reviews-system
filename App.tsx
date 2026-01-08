import React, { useState } from 'react';
import { Language, AppStage, AuditData } from './types';
import LanguageSelector from './components/LanguageSelector';
import DataIntake from './components/DataIntake';
import ScanningVisualization from './components/ScanningVisualization';
import ResultsDashboard from './components/ResultsDashboard';
import VisualExperience from './components/VisualExperience';

const App: React.FC = () => {
  // الحالة الافتراضية
  const [language, setLanguage] = useState<Language>('en'); 
  const [stage, setStage] = useState<AppStage>('language-selection');
  const [auditData, setAuditData] = useState<AuditData | null>(null);

  // --- منطق التنقل ---
  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setStage('data-intake');
  };

  const handleDataSubmit = (data: AuditData) => {
    setAuditData(data);
    setStage('scanning'); // الانتقال لشاشة الفحص
  };

  const handleScanComplete = () => {
    setStage('results'); // بعد انتهاء الفحص، الانتقال للنتائج
  };

  const handleReset = () => {
    setAuditData(null);
    setStage('data-intake');
  };

  const handleBack = () => {
    if (stage === 'data-intake') {
      setStage('language-selection');
    } else if (stage === 'results') {
      setStage('data-intake');
    } else if (stage === 'visual-experience') {
      setStage('results');
    }
  };

  const handleStartVisualExp = () => {
    setStage('visual-experience');
  };

  return (
    // --- الحاوية الرئيسية: تنسيق كامل للشاشة مع خلفية داكنة ثابتة ---
    <div className={`min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden flex flex-col ${language === 'ar' ? 'font-tajawal' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* 1. خلفية جمالية (Fixed Background) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* 2. منطقة المحتوى الوسطى (Centering Wrapper) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full max-w-7xl mx-auto min-h-[90vh]">
        
        <div className="w-full transition-all duration-500 ease-in-out">
          
          {/* مرحلة اختيار اللغة */}
          {stage === 'language-selection' && (
            <div className="flex justify-center items-center h-full min-h-[60vh]">
               <LanguageSelector onSelect={handleLanguageSelect} />
            </div>
          )}

          {/* مرحلة إدخال البيانات */}
          {stage === 'data-intake' && (
            <div className="animate-fade-in-up w-full">
              <DataIntake 
                language={language} 
                onSubmit={handleDataSubmit} 
                onBack={handleBack}
              />
            </div>
          )}

          {/* مرحلة جاري الفحص (الأنيميشن) */}
          {stage === 'scanning' && auditData && (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
              <ScanningVisualization 
                language={language} 
                data={auditData} 
                onComplete={handleScanComplete} 
              />
            </div>
          )}

          {/* مرحلة عرض النتائج */}
          {stage === 'results' && auditData && (
            <div className="animate-fade-in w-full">
              <ResultsDashboard 
                language={language} 
                data={auditData} 
                onReset={handleReset} 
                onBack={handleBack} 
                onVisualExp={handleStartVisualExp}
              />
            </div>
          )}

          {/* مرحلة التجربة البصرية (الآيفون) */}
          {stage === 'visual-experience' && auditData && (
            <div className="animate-fade-in w-full pt-4">
              <VisualExperience 
                language={language} 
                data={auditData} 
                onBack={handleBack} 
              />
            </div>
          )}

        </div>
      </main>

      {/* 3. تذييل الصفحة (Footer) */}
      <footer className="relative z-10 py-6 text-center text-slate-600 text-xs font-medium uppercase tracking-widest bg-gradient-to-t from-[#020617] to-transparent">
        <p>&copy; {new Date().getFullYear()} Elegant Options. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default App;
