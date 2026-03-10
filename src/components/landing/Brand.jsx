import React from 'react';
import { useLanguage } from '@/pages/Home';
import { motion } from 'framer-motion';

const content = {
  en: {
    headline: "Brands We Offer",
    subheadline: "We offer tractors from India's most trusted manufacturers",
  },
  gu: {
    headline: "અમે ઓફર કરીએ છીએ તે બ્રાન્ડ્સ",
    subheadline: "અમે ભારતના સૌથી વિશ્વસનીય ઉત્પાદકોના ટ્રેક્ટર રાખીએ છીએ",
  }
};

const brands = [
  {
    name: { en: "Swaraj", gu: "સ્વરાજ" },
    color: "#2f8bfc",
    description: { en: "Mera Swaraj", gu: "મેરા સ્વરાજ" },
    logo: "/images/brands/Swaraj.jpg"
  },
  {
    name: { en: "Mahindra", gu: "મહિન્દ્રા" },
    color: "#E31837",
    description: { en: "Rise Together", gu: "સાથે ઊઠો" },
    logo: "/images/brands/Mahindra.png"
  },
  {
    name: { en: "Massey Ferguson", gu: "મેસી ફર્ગ્યુસન" },
    color: "#E31837",
    description: { en: "AGCO Corporation", gu: "AGCO કોર્પોરેશન" },
    logo: "/images/brands/Massey.png"
  },
  {
    name: { en: "Sonalika", gu: "સોનાલિકા" },
    color: "#131d8d",
    description: { en: "International Tractors", gu: "ઇન્ટરનેશનલ ટ્રેક્ટર્સ" },
    logo: "/images/brands/Sonalika.png"
  },
  {
    name: { en: "New Holland", gu: "ન્યૂ હોલેન્ડ" },
    color: "#005EB8",
    description: { en: "CNH Industrial", gu: "CNH ઇન્ડસ્ટ્રીયલ" },
    logo: "/images/brands/New Holland.png"
  },
  {
    name: { en: "John Deere", gu: "જ્હોન ડીયર" },
    color: "#1a5310",
    description: { en: "Nothing Runs Like a Deere", gu: "ડીયર જેવું કોઈ ચાલતું નથી" },
    logo: "/images/brands/John deere.jpeg"
  },
  {
    name: { en: "Eicher", gu: "આઇશર" },
    color: "#E31837",
    description: { en: "TAFE Motors", gu: "TAFE મોટર્સ" },
    logo: "/images/brands/eicher.png"
  },
  {
    name: { en: "Farmtrac", gu: "ફાર્મટ્રેક" },
    color: "#020582ff",
    description: { en: "Farmtrac", gu: "ફાર્મટ્રેક" },
    logo: "/images/brands/Farmtrac.png"
  }
];

export default function Brands() {
  const { language } = useLanguage();
  const t = content[language];

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a5f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#1e3a5f] mb-4">
            {t.headline}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t.subheadline}
          </p>
        </motion.div>
      </div>

      {/* Infinite Carousel */}
      <div
        className="group relative"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <div
          className="flex w-max"
          style={{
            animation: 'scroll-brands 30s linear infinite'
          }}
          onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
          onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
        >
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.name.en}-${index}`}
              className="flex-shrink-0 w-52 mx-4 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-slate-100 hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden p-2">
                <img src={brand.logo} alt={brand.name.en} className="w-full h-full object-contain" />
              </div>
              <h3
                className="font-bold text-lg mb-1"
                style={{ color: brand.color }}
              >
                {brand.name[language]}
              </h3>
              <p className="text-slate-400 text-xs">{brand.description[language]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Note */}
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 mt-12 text-sm"
        >
          {language === 'en'
            ? '* All brand logos are trademarks of their respective owners'
            : '* તમામ બ્રાન્ડ લોગો તેમના સંબંધિત માલિકોના ટ્રેડમાર્ક છે'}
        </motion.p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes scroll-brands {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}