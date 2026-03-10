import React from 'react';
import { useLanguage } from '@/pages/Home';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
        className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group"
      >
        <Globe className="w-4 h-4 text-[#1e3a5f] group-hover:rotate-180 transition-transform duration-500" />
        <span className="text-sm font-semibold text-[#1e3a5f]">
          {language === 'en' ? 'ગુજરાતી' : 'English'}
        </span>
      </button>
    </div>
  );
}