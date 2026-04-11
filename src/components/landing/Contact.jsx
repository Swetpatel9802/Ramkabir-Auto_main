import React from 'react';
import { useLanguage } from '@/pages/Home';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, User, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const content = {
  en: {
    badge: "Get In Touch",
    headline: "Visit Our GoDown",
    subheadline: "We're conveniently located near APMC market, NH 48, Sayajipura, Ajwa Road, Vadodara 390019",
    contact: "Contact Person",
    phone: "Phone",
    address: "Address",
    hours: "Business Hours",
    hoursDetail: "Monday - Sunday: 10:00 AM - 6:00 PM",
    cta: "Call Now for Best Price",
    directions: "Get Directions",
    footerOpeningHours: "Opening Hours",
    footerContact: "Contact",
    footerGeneral: "General",
    footerLocation: "Location",
    footerHome: "Home",
    footerInventory: "Vehicles",
    footerAbout: "About us"
  },
  gu: {
    badge: "સંપર્કમાં રહો",
    headline: "અમારા ગોડાઉન ની મુલાકાત લો",
    subheadline: "અમે APMC માર્કેટ, NH 48, સયાજીપુરા, અજવા રોડ, વડોદરા 390019 નજીક અનુકૂળ રીતે સ્થિત છીએ",
    contact: "સંપર્ક વ્યક્તિ",
    phone: "ફોન",
    address: "સરનામું",
    hours: "વ્યવસાયનો સમય",
    hoursDetail: "સોમવાર - રવિવાર: સવારે 10:00 - સાંજે 6:00",
    cta: "શ્રેષ્ઠ ભાવ માટે હમણાં કૉલ કરો",
    directions: "દિશાઓ મેળવો",
    footerOpeningHours: "ખુલવાનો સમય",
    footerContact: "સંપર્ક",
    footerGeneral: "સામાન્ય",
    footerLocation: "સ્થળ",
    footerHome: "હોમ",
    footerInventory: "વાહનો",
    footerAbout: "અમારા વિશે"
  }
};

export default function Contact() {
  const { language } = useLanguage();
  const t = content[language];

  const contactDetails = [
    { icon: User, label: t.contact, value: { en: "Vimal Patel", gu: "વિમલભાઈ પટેલ" } },
    { icon: Phone, label: t.phone, value: { en: "+91 98255 33573", gu: "+૯૧ ૯૮૨૫૫૩૩૫૭૩" }, href: "tel:9825533573" },
    { icon: MapPin, label: t.address, value: { en: "Nr APMC Market, NH 48, Sayajipura, Ajwa Road, Vadodara 390019", gu: "APMC માર્કેટ નજીક, NH 48, સયાજીપુરા, અજવા રોડ, વડોદરા 390019" } },
    { icon: Clock, label: t.hours, value: { en: t.hoursDetail, gu: t.hoursDetail } }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Glassmorphism top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* Mesh Gradient Arc — smooth horizon shape */}
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '350px' }}
      >
        {/* Main arc — ellipse shape */}
        <div style={{
          position: 'absolute',
          bottom: '-60%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200vw',
          height: '600px',
          borderRadius: '50%',
          overflow: 'hidden',
        }}>
          {/* Gradient bands inside the arc */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 25% 70% at 10% 100%, rgba(34,197,94,0.35) 0%, transparent 100%),
              radial-gradient(ellipse 30% 80% at 30% 100%, rgba(96,165,250,0.4) 0%, transparent 100%),
              radial-gradient(ellipse 20% 60% at 50% 100%, rgba(239,68,68,0.3) 0%, transparent 100%),
              radial-gradient(ellipse 30% 80% at 70% 100%, rgba(232,93,4,0.4) 0%, transparent 100%),
              radial-gradient(ellipse 25% 70% at 90% 100%, rgba(234,179,8,0.35) 0%, transparent 100%)
            `,
            filter: 'blur(60px)',
            animation: 'meshShift 12s ease-in-out infinite alternate',
          }} />
          {/* Secondary animated layer for liquid feel */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 20% 50% at 20% 100%, rgba(96,165,250,0.25) 0%, transparent 100%),
              radial-gradient(ellipse 25% 60% at 45% 100%, rgba(34,197,94,0.2) 0%, transparent 100%),
              radial-gradient(ellipse 20% 55% at 65% 100%, rgba(234,179,8,0.25) 0%, transparent 100%),
              radial-gradient(ellipse 20% 50% at 85% 100%, rgba(239,68,68,0.2) 0%, transparent 100%)
            `,
            filter: 'blur(70px)',
            animation: 'meshShift2 15s ease-in-out infinite alternate',
          }} />
        </div>
        {/* Top fade to blend with page background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(248,250,252, 1) 0%, rgba(248,250,252,0.4) 40%, transparent 100%)',
        }} />
      </motion.div>
      {/* Animation keyframes */}
      <style>{`
        @keyframes meshShift {
          0% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-20px) scale(1.02); }
          100% { transform: translateX(20px) scale(0.98); }
        }
        @keyframes meshShift2 {
          0% { transform: translateX(10px) scale(1.01); }
          50% { transform: translateX(-15px) scale(0.99); }
          100% { transform: translateX(5px) scale(1.02); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#e85d04]/10 text-[#e85d04] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1e3a5f] mb-4">
            {t.headline}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t.subheadline}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactDetails.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex items-start gap-4"
              >
                <div className="w-14 h-14 bg-[#2d5a3d]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-7 h-7 text-[#2d5a3d]" />
                </div>
                <div>
                  <div className="text-slate-500 text-sm mb-1">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="text-[#1e3a5f] font-bold text-lg hover:text-[#e85d04] transition-colors">
                      {item.value[language]}
                    </a>
                  ) : (
                    <div className="text-[#1e3a5f] font-semibold">{item.value[language]}</div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="tel:9825533573"
                className="flex-1 inline-flex items-center justify-center gap-3 bg-[#e85d04] hover:bg-[#d14f00] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-[#e85d04]/30 hover:shadow-[#e85d04]/50 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                {t.cta}
              </a>
              <a
                href="https://maps.google.com/?q=Nr+APMC+Market+NH+48+Sayajipura+Vadodara+390019"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300"
              >
                <Navigation className="w-5 h-5" />
                {t.directions}
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl h-[450px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.5664254092294!2d73.2512899!3d22.3322316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fcf15fb2ecd23%3A0x70c70d2df68319aa!2sRamkabir%20Auto%20%7C%7C%20Best%20Tractor%20Dealer%20In%20Vadodara%20%7C%20Old%20Tractor%20Sale%20And%20Services%20In%20Vadodara!5e0!3m2!1sen!2sus!4v1770504835300!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ramkabir Auto Location"
            />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-16 border-t border-slate-200"
        >
          <div className="flex justify-end mb-16 px-4 md:px-0">
            <div className="w-full lg:w-3/4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-bold text-black mb-3">{t.footerOpeningHours}</h4>
                <p className="text-slate-500 text-sm whitespace-pre-wrap leading-snug">{language === 'en' ? 'Mon - Fri: 10 a.m. - 6 p.m.\nSat - Sun: 10 a.m. - 6 p.m.' : 'સોમ - શુક્ર: સવારે 10 - સાંજે 6\nશનિ - રવિ: સવારે 10 - સાંજે 6'}</p>
              </div>
              <div>
                <h4 className="font-bold text-black mb-3">{t.footerContact}</h4>
                <p className="text-slate-500 text-sm mb-1">{language === 'en' ? '+91 98255 33573' : '+૯૧ ૯૮૨૫૫૩૩૫૭૩'}</p>
                <p className="text-slate-500 text-sm">{language === 'en' ? 'Vimal Patel' : 'વિમલભાઈ પટેલ'}</p>
              </div>
              <div>
                <h4 className="font-bold text-black mb-3">{t.footerGeneral}</h4>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      to="/"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="text-slate-500 text-sm hover:text-black transition-colors"
                    >
                      {t.footerHome}
                    </Link>
                  </li>
                  <li>
                    <Link to="/inventory" className="text-slate-500 text-sm hover:text-black transition-colors">
                      {t.footerInventory}
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/#about"
                      onClick={(e) => {
                        const aboutElement = document.getElementById('about');
                        if (aboutElement) {
                          e.preventDefault();
                          aboutElement.scrollIntoView({ behavior: 'smooth' });
                          // Optionally push state to keep URL updated
                          window.history.pushState(null, '', '/#about');
                        }
                      }}
                      className="text-slate-500 text-sm hover:text-black transition-colors"
                    >
                      {t.footerAbout}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-black mb-3">{t.footerLocation}</h4>
                <p className="text-slate-500 text-sm leading-snug">
                  {language === 'en' ? 'Nr APMC Market, NH 48, Sayajipura, Ajwa Road, Vadodara 390019' : 'APMC માર્કેટ નજીક, NH 48, સયાજીપુરા, અજવા રોડ, વડોદરા 390019'}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full px-4 overflow-visible">
            <h1
              className="w-full font-black text-[#7BD88A] leading-none tracking-tight text-center whitespace-normal break-words"
              style={{ fontSize: "min(10vw, 9rem)" }}
            >
              Ramkabir Auto
            </h1>
          </div>
        </motion.div>
      </div>
    </section>
  );
}