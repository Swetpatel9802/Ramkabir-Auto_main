import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Navigation, Send, ChevronDown } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const content = {
  en: {
    badge: "Get In Touch",
    headline: "Visit Our GoDown",
    subheadline: "We're conveniently located near APMC market, NH 48, Sayajipura, Ajwa Road, Vadodara 390019",
    sweetMessage: "You're Not Just a Customer; You're Family.",
    sweetMessageSub: "At Ramkabir Auto, your journey is our priority. Please share your details below, and our dedicated team will reach out to you personally. We are here to help you find the perfect vehicle with the care and trust you deserve.",
    formName: "Full Name",
    formPhone: "Phone Number",
    formVehicle: "Vehicle of Interest",
    vehicleOptions: [
      { value: "Tractor", label: "Tractor" },
      { value: "Trolley", label: "Trolley" },
      { value: "Other", label: "Other Items" }
    ],
    formCity: "City or Village Name",
    submitBtn: "Request a Callback",
    directions: "Get Directions",
    footerOpeningHours: "Opening Hours",
    footerContact: "Contact",
    footerLocation: "Location",
  },
  gu: {
    badge: "સંપર્કમાં રહો",
    headline: "અમારા ગોડાઉન ની મુલાકાત લો",
    subheadline: "અમે APMC માર્કેટ, NH 48, સયાજીપુરા, અજવા રોડ, વડોદરા 390019 નજીક અનુકૂળ રીતે સ્થિત છીએ",
    sweetMessage: "તમે માત્ર ગ્રાહક નથી; તમે પરિવાર છો.",
    sweetMessageSub: "રામકબીર ઓટો ખાતે, તમારી સફર અમારી પ્રાથમિકતા છે. કૃપા કરીને નીચે તમારી વિગતો શેર કરો, અને અમારી સમર્પિત ટીમ તમારો વ્યક્તિગત રીતે સંપર્ક કરશે. તમે જે કાળજી અને વિશ્વાસને લાયક છો તેની સાથે સંપૂર્ણ વાહન શોધવામાં તમારી સહાય કરવા માટે અમે અહીં છીએ.",
    formName: "પૂરું નામ",
    formPhone: "ફોન નંબર",
    formVehicle: "વાહન પ્રકાર",
    vehicleOptions: [
      { value: "Tractor", label: "ટ્રેક્ટર" },
      { value: "Trolley", label: "ટ્રોલી" },
      { value: "Other", label: "અન્ય વસ્તુઓ" }
    ],
    formCity: "શહેર અથવા ગામનું નામ",
    submitBtn: "કૉલબૅકની વિનંતી કરો",
    directions: "દિશાઓ મેળવો",
    footerOpeningHours: "ખુલવાનો સમય",
    footerContact: "સંપર્ક",
    footerLocation: "સ્થળ",
  }
};

export default function Contact() {
  const { language } = useLanguage();
  const t = content[language];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: 'Tractor',
    city: ''
  });

  // 'idle' | 'sliding_in' | 'folding' | 'flying'
  const [animationState, setAnimationState] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error(language === 'en' ? "Name and phone are required." : "નામ અને ફોન નંબર જરૂરી છે.");
      return;
    }

    setAnimationState('sliding_in');

    /*
    try {
      console.warn("EmailJS is not fully configured. Please add YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, and YOUR_PUBLIC_KEY.");
      // emailjs.send(...) logic can go here
    } catch (error) {
      console.error("Error with EmailJS:", error);
    }
    */

    setTimeout(() => {
      setAnimationState('folding');
      setTimeout(() => {
        setAnimationState('flying');
        setTimeout(() => {
          const waMessage = `Hello Ramkabir Auto,%0A%0AI am interested in your vehicles. Please call me back.%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Interested In:* ${formData.vehicle}%0A*City/Village:* ${formData.city}`;
          const waUrl = `https://wa.me/919825533573?text=${waMessage}`;
          window.open(waUrl, '_blank');

          toast.success(language === 'en' ? "Request sent successfully!" : "વિનંતી સફળતાપૂર્વક મોકલવામાં આવી!");

          setTimeout(() => {
            setAnimationState('idle');
            setFormData({ name: '', phone: '', vehicle: 'Tractor', city: '' });
          }, 1000);
        }, 800);
      }, 600);
    }, 600);
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Glassmorphism top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* Mesh Gradient Arc */}
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '350px' }}
      >
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

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
            style={{ minHeight: '520px' }}
          >
            <motion.div
              animate={{ opacity: animationState === 'idle' ? 1 : 0, scale: animationState === 'idle' ? 1 : 0.95 }}
              style={{ pointerEvents: animationState === 'idle' ? 'auto' : 'none' }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-black text-[#1e3a5f] mb-2">{t.sweetMessage}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{t.sweetMessageSub}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.formName} *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/20 outline-none transition-all"
                    placeholder={language === 'en' ? "Ramanbhai Rathwa" : "નામ"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.formPhone} *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/20 outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.formVehicle}</label>
                    <div className="relative">
                      <select
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/20 outline-none transition-all appearance-none bg-white pr-10"
                      >
                        {t.vehicleOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t.formCity}</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/20 outline-none transition-all"
                      placeholder={language === 'en' ? "Vadodara" : "વડોદરા"}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={animationState !== 'idle'}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#e85d04] hover:bg-[#d14f00] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-[#e85d04]/30 hover:shadow-[#e85d04]/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {animationState !== 'idle' ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t.submitBtn}
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Envelope Animation Overlay */}
            {animationState !== 'idle' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-white/95 z-50 rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                  animate={
                    animationState === 'flying'
                      ? { x: [0, 150, 500], y: [0, -50, -500], opacity: [1, 1, 0], scale: 0.6, rotate: 25 }
                      : { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <div className="relative w-56 h-40 mx-auto drop-shadow-2xl">
                    {/* Back of envelope */}
                    <div className="absolute inset-0 bg-[#e69a3a] rounded-md" />

                    {/* Letter sliding down */}
                    <motion.div
                      className="absolute bottom-4 left-4 right-4 bg-white rounded-t-md border border-slate-200 flex flex-col items-center p-4 shadow-sm"
                      initial={{ y: -150, opacity: 0 }}
                      animate={{ y: 15, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      style={{ zIndex: 1, height: '140px' }}
                    >
                      <div className="w-1/3 h-2 bg-slate-200 rounded-full mb-4 self-start" />
                      <div className="w-full h-2 bg-slate-100 rounded-full mb-3" />
                      <div className="w-5/6 h-2 bg-slate-100 rounded-full mb-3 self-start" />
                      <div className="w-4/6 h-2 bg-slate-100 rounded-full self-start" />
                    </motion.div>

                    {/* Envelope body (Front) using SVG */}
                    <svg className="absolute inset-0 w-full h-full rounded-md overflow-hidden" style={{ zIndex: 2 }} viewBox="0 0 200 120" preserveAspectRatio="none">
                      <path d="M 0 120 L 100 65 L 200 120 Z" fill="#e85d04" />
                      <path d="M 0 0 L 100 65 L 0 120 Z" fill="#d14f00" />
                      <path d="M 200 0 L 100 65 L 200 120 Z" fill="#d14f00" />
                    </svg>

                    {/* Top Flap */}
                    <motion.svg
                      className="absolute top-0 left-0 w-full h-[65px]"
                      style={{ zIndex: 3, transformOrigin: 'top' }}
                      viewBox="0 0 200 65"
                      preserveAspectRatio="none"
                      initial={{ rotateX: -180 }}
                      animate={{ rotateX: (animationState === 'folding' || animationState === 'flying') ? 0 : -180 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <path d="M 0 0 L 100 65 L 200 0 Z" fill="#f4a444" stroke="#e85d04" strokeWidth="0.5" />
                    </motion.svg>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Map & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full gap-6"
          >
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 flex-1 min-h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.5664254092294!2d73.2512899!3d22.3322316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fcf15fb2ecd23%3A0x70c70d2df68319aa!2sRamkabir%20Auto%20%7C%7C%20Best%20Tractor%20Dealer%20In%20Vadodara%20%7C%20Old%20Tractor%20Sale%20And%20Services%20In%20Vadodara!5e0!3m2!1sen!2sus!4v1770504835300!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ramkabir Auto Location"
              />
            </div>
            <a
              href="https://maps.google.com/?q=Nr+APMC+Market+NH+48+Sayajipura+Vadodara+390019"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 w-full"
            >
              <Navigation className="w-5 h-5" />
              {t.directions}
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-16 border-t border-slate-200"
        >
          {/* Footer columns — logo on left, info columns grouped on right */}
          <div className="mb-12 px-4 md:px-0 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">

            {/* Logo + Brand Name */}
            <div className=" flex justify-center items-center flex-col items-start gap-3 flex-shrink-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shadow-md ring-1 ring-slate-200">
                <img src="/images/Logo.jpg" alt="Ramkabir Auto Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-[#1e3a5f] text-xl leading-tight">
                Ramkabir Auto
              </span>
            </div>

            {/* Three info columns — grouped tightly on the right */}
            <div className="flex flex-wrap gap-x-10 gap-y-6 lg:justify-end">

              {/* Opening Hours */}
              <div className="min-w-[130px]">
                <h4 className="font-bold text-black mb-2 text-lg">{t.footerOpeningHours}</h4>
                <p className="text-slate-500 text-xs whitespace-pre-wrap leading-snug">{language === 'en' ? 'Mon - Fri: 10 a.m. - 6 p.m.\nSat - Sun: 9 a.m. - 6 p.m.' : 'સોમ - શુક્ર: સવારે 10 - સાંજે 6\nશનિ - રવિ: સવારે 10 - સાંજે 6'}</p>
              </div>

              {/* Contact */}
              <div className="min-w-[110px]">
                <h4 className="font-bold text-black mb-2 text-lg">{t.footerContact}</h4>
                <p className="text-slate-500 text-xs mb-1">{language === 'en' ? '+91 98255 33573' : '+૯૧ ૯૮૨૫૫૩૩૫૭૩'}</p>
                <p className="text-slate-500 text-xs">{language === 'en' ? 'Vimal Patel' : 'વિમલભાઈ પટેલ'}</p>
              </div>

              {/* Location */}
              <div className="min-w-[160px] max-w-[200px]">
                <h4 className="font-bold text-black mb-2 text-lg">{t.footerLocation}</h4>
                <p className="text-slate-500 text-xs leading-snug">
                  {language === 'en' ? 'Nr APMC Market, NH 48, Sayajipura, Ajwa Road, Vadodara 390019' : 'APMC માર્કેટ નજીક, NH 48, સયાજીપુરા, અજવા રોડ, વડોદરા 390019'}
                </p>
              </div>

            </div>
          </div>

          {/* Big brand wordmark */}
          <div className="w-full px-4 overflow-visible">
            <h1
              className="w-full font-black text-[#7BD88A] leading-none tracking-tight text-center whitespace-normal break-words"
              style={{ fontSize: "min(10vw, 9rem)" }}
            >
              Ramkabir Auto
            </h1>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-slate-400 text-xs px-4 md:px-0">
            &copy; {new Date().getFullYear()} Ramkabir Auto. All rights reserved.
          </div>
        </motion.div>
      </div>
    </section>
  );
}