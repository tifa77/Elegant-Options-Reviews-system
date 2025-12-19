
import React, { useState } from 'react';
import { Language, AppStage, AuditData } from './types';
import LanguageSelector from './components/LanguageSelector';
import DataIntake from './components/DataIntake';
import ScanningVisualization from './components/ScanningVisualization';
import ResultsDashboard from './components/ResultsDashboard';
import VisualExperience from './components/VisualExperience';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en'); // Default, will be set immediately
  const [stage, setStage] = useState<AppStage>('language-selection');
  const [auditData, setAuditData] = useState<AuditData | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setStage('data-intake');
  };

  const handleDataSubmit = (data: AuditData) => {
    setAuditData(data);
    setStage('scanning');
  };

  const handleScanComplete = () => {
    setStage('results');
  };

  const handleReset = () => {
    setAuditData(null);
    setStage('data-intake'); // Go back to form, keep language
  };

  // Back Button Logic
  const handleBack = () => {
    if (stage === 'data-intake') {
      setStage('language-selection');
    } else if (stage === 'results' || stage === 'visual-experience') {
      // When going back from results or visual exp, we keep the data in the form so user can edit
      setStage('data-intake');
    }
  };

  const handleStartVisualExp = () => {
    setStage('visual-experience');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans selection:bg-primary-500 selection:text-white">
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto">
        {stage === 'language-selection' && (
          <LanguageSelector onSelect={handleLanguageSelect} />
        )}

        {stage === 'data-intake' && (
          <div className="animate-fade-in-up">
            <DataIntake 
              language={language} 
              onSubmit={handleDataSubmit} 
              onBack={handleBack}
            />
          </div>
        )}

        {stage === 'scanning' && auditData && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <ScanningVisualization 
              language={language} 
              data={auditData} 
              onComplete={handleScanComplete} 
            />
          </div>
        )}

        {stage === 'results' && auditData && (
          <ResultsDashboard 
            language={language} 
            data={auditData} 
            onReset={handleReset} 
            onBack={handleBack}
            onVisualExp={handleStartVisualExp}
          />
        )}

        {stage === 'visual-experience' && auditData && (
          <VisualExperience 
            language={language} 
            data={auditData} 
            onBack={handleBack}
          />
        )}
      </div>

      <footer className="relative z-10 text-center text-slate-600 mt-12 pb-4 text-sm">
        <p>&copy; {new Date().getFullYear()} Elegant Options. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
