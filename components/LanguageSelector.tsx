
import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] animate-fade-in w-full">
      <div className="relative group w-full max-w-lg">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700/50 text-center">
          
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800 p-2 rounded-2xl shadow-inner ring-1 ring-white/10 overflow-hidden">
              <img 
                src="https://storage.googleapis.com/msgsndr/vX7gQQOe9PXtkGes2GOJ/media/6944362aa49c0a6975236470.png" 
                alt="Elegant Options Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Elegant Options</h1>
          <p className="text-slate-400 mb-10 text-sm uppercase tracking-widest font-semibold">Reputation & SEO Growth Engine</p>

          <div className="space-y-4">
            <p className="text-lg text-slate-200 font-medium leading-relaxed">
              Please select your preferred language <br />
              <span className="font-tajawal text-slate-300">يرجى اختيار لغتك المفضلة</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => onSelect('ar')}
                className="group/btn relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all duration-300"
              >
                <div className="absolute inset-0 w-0 bg-primary-600 transition-all duration-[250ms] ease-out group-hover/btn:w-full opacity-10"></div>
                <span className="text-2xl">🇸🇦</span>
                <span className="font-tajawal font-bold text-lg text-white">العربية</span>
              </button>

              <button
                onClick={() => onSelect('en')}
                className="group/btn relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all duration-300"
              >
                <div className="absolute inset-0 w-0 bg-blue-600 transition-all duration-[250ms] ease-out group-hover/btn:w-full opacity-10"></div>
                <span className="text-2xl">🇺🇸</span>
                <span className="font-sans font-bold text-lg text-white">English</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
