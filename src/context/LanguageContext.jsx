import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LanguageContext = createContext({ language: 'gu', setLanguage: (_lang) => { } });

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageContext.Provider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('gu'); // Default to Gujarati if bypassed
  const [showModal, setShowModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedLang = sessionStorage.getItem('ramkabir_language');
    if (storedLang) {
      setLanguageState(storedLang);
    } else {
      // First visit in this session: show modal
      setShowModal(true);
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    sessionStorage.setItem('ramkabir_language', lang);
    setShowModal(false);
  };

  const handleBypass = () => {
    // If they close without selecting, default to Gujarati for this session
    setLanguage('gu');
  };

  if (!isInitialized) return null; // Prevent hydration mismatch / flashing

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
      
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e85d04]/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1e3a5f]/10 rounded-full blur-2xl -ml-10 -mb-10" />
              
              <div className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-[#1e3a5f]/5 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🌐</span>
                </div>
                
                <h2 className="text-2xl font-black text-[#1e3a5f] mb-2">
                  Welcome / સ્વાગત છે
                </h2>
                <p className="text-slate-500 mb-8 font-medium">
                  Please select your preferred language
                  <br />
                  કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setLanguage('gu')}
                    className="w-full bg-[#1e3a5f] hover:bg-[#152a45] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    ગુજરાતી
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className="w-full bg-white hover:bg-slate-50 text-[#1e3a5f] border-2 border-[#1e3a5f] py-4 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    English
                  </button>
                </div>

                <button 
                  onClick={handleBypass}
                  className="mt-6 text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </LanguageContext.Provider>
  );
};
