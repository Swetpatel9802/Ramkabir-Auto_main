import React from 'react';
import { useLanguage } from '@/pages/Home';
import { Phone, ChevronDown, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const content = {
  en: {
    headline: "Vadodara's Trusted Seller Of Old Tractors and Agricultural Equipment",
    subheadline: "Seller of Swaraj, Mahindra, Sonalika, and more.",
    cta: "Call for Best Price",
    scroll: "Explore More"
  },
  gu: {
    headline: "વડોદરા ના જાનીતા અને વિશ્વસુ જુના ટ્રેક્ટર અને ખેતી ના સધાનો ના વેપારી",
    subheadline: "સ્વરાજ, મહિન્દ્રા, સોનાલીકા, અને વધુ માટે અધિકૃત ડીલર.",
    cta: "શ્રેષ્ઠ ભાવ માટે કૉલ કરો",
    scroll: "વધુ જુઓ"
  }
};

export default function Hero() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/tractor-hero.png"
          alt="Tractor in field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/95 via-[#1e3a5f]/80 to-[#2d5a3d]/70" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e85d04]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2d5a3d]/20 rounded-full blur-3xl" />
      </div>

      {/* Admin Link — top left */}
      <Link
        to="/admin"
        className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/70 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      >
        <Settings className="w-3.5 h-3.5" />
        Admin Login
      </Link>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Logo Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-2xl mb-6 overflow-hidden">
            <img src="/images/Logo.jpg" alt="Ramkabir Auto Logo" className="w-full h-full object-cover" />
          </div>
          <p className="text-white/80 text-sm tracking-[0.3em] uppercase font-medium">
            Ramkabir Auto
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 max-w-4xl mx-auto"
        >
          {t.headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium"
        >
          {t.subheadline}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="tel:9825533573"
            className="inline-flex items-center gap-3 bg-[#e85d04] hover:bg-[#d14f00] text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl shadow-[#e85d04]/30 hover:shadow-[#e85d04]/50 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Phone className="w-6 h-6" />
            {t.cta}
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>20+ Years Experience</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>7+ Premium Brands</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>1000+ Happy Farmers</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-wider uppercase">{t.scroll}</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  );
}