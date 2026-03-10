import React, { createContext, useContext, useState } from 'react';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Brands from '@/components/landing/Brand';
import Tractors from '@/components/landing/Tractors';
import Testimonials from '@/components/landing/Testimonials';
import Contact from '@/components/landing/Contact';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import LanguageToggle from '@/components/landing/LanguageToggle';

export const LanguageContext = createContext({ language: 'en', setLanguage: (_lang) => { } });

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageContext.Provider');
  }
  return context;
};

export default function Home() {
  const [language, setLanguage] = useState('gu');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-white font-sans">
        {/* Language Toggle */}
        <LanguageToggle />

        {/* Main Sections */}
        <Hero />
        <About />
        <Brands />
        <Tractors />
        <Testimonials />
        <Contact />

        {/* Floating WhatsApp Button */}
        <WhatsAppButton />
      </div>
    </LanguageContext.Provider>
  );
}