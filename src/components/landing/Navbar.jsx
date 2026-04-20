import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/pages/Home';
import { Globe, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const content = {
  en: {
    home: 'Home',
    about: 'About Us',
    vehicles: 'Vehicles',
    contact: 'Get in Touch',
    langLabel: 'ગુજરાતી',
  },
  gu: {
    home: 'હોમ',
    about: 'અમારા વિશે',
    vehicles: 'વાહનો',
    contact: 'સંપર્ક',
    langLabel: 'English',
  },
};

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = content[language];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: t.home, targetId: 'top' },
    { label: t.about, targetId: 'about' },
    { label: t.vehicles, targetId: 'tractors' },
    { label: t.contact, targetId: 'contact', isHighlighted: true },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(15,30,50,0.82)' : 'rgba(15,30,50,0.48)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.12)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Left: Logo + brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/"
            onClick={(e) => handleScrollTo(e, 'top')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/20 group-hover:ring-white/50 transition-all">
              <img src="/images/Logo.jpg" alt="Ramkabir Auto Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-black text-base tracking-tight leading-none" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
              Ramkabir Auto
            </span>
          </a>
        </div>

        {/* Center/Right: Nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.isHighlighted ? (
              <li key={link.label}>
                <a
                  href={`#${link.targetId}`}
                  onClick={(e) => handleScrollTo(e, link.targetId)}
                  className="ml-2 inline-flex items-center px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #e85d04, #f4a444)',
                    boxShadow: '0 2px 14px rgba(232,93,4,0.4)',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ) : (
              <li key={link.label}>
                <a
                  href={`#${link.targetId}`}
                  onClick={(e) => handleScrollTo(e, link.targetId)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {link.label}
                </a>
              </li>
            )
          )}
        </ul>

        {/* Right: Language toggle + Admin */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              boxShadow: '0 2px 16px rgba(99,102,241,0.45)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.65)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(99,102,241,0.45)'; }}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{t.langLabel}</span>
          </button>

          {/* Admin — rightmost */}
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-white/45 hover:text-white/90 text-xs font-medium transition-all duration-200 px-2.5 py-2 rounded-lg hover:bg-white/10"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>

      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-center gap-1 pb-2 px-4">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={`#${link.targetId}`}
            onClick={(e) => handleScrollTo(e, link.targetId)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              link.isHighlighted ? 'text-white' : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
            style={
              link.isHighlighted
                ? { background: 'linear-gradient(135deg, #e85d04, #f4a444)', borderRadius: '20px', padding: '5px 12px' }
                : {}
            }
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
