import React, { createContext, useContext, useState } from 'react';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Brands from '@/components/landing/Brand';
import Tractors from '@/components/landing/Tractors';
import Testimonials from '@/components/landing/Testimonials';
import Contact from '@/components/landing/Contact';
import WhatsAppButton from '@/components/landing/WhatsAppButton';

import Navbar from '@/components/landing/Navbar';

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
        {/* Transparent Navbar */}
        <Navbar />

        {/* Main Sections */}
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <Brands />
        <section id="tractors">
          <Tractors />
        </section>
        <Testimonials />
        <section id="contact">
          <Contact />
        </section>

        {/* Floating WhatsApp Button */}
        <WhatsAppButton />
      </div>
    </LanguageContext.Provider>
  );
}
