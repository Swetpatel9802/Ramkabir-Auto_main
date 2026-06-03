import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
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

  const navStyle = {
    background: scrolled ? 'rgba(15,30,50,0.90)' : 'rgba(15,30,50,0.52)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderBottom: scrolled
      ? '1px solid rgba(255,255,255,0.12)'
      : '1px solid rgba(255,255,255,0.06)',
    boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.25)' : 'none',
  };

  const langBtnStyle = {
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    boxShadow: '0 2px 12px rgba(99,102,241,0.45)',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={navStyle}>

      {/* ── DESKTOP layout (md+) ── */}
      <div className="hidden md:flex max-w-7xl mx-auto px-5 h-16 items-center justify-between gap-3">

        {/* Logo + Brand */}
        <a
          href="/"
          onClick={(e) => handleScrollTo(e, 'top')}
          className="flex items-center gap-2.5 group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/20 group-hover:ring-white/50 transition-all">
            <img src="/images/Logo.jpg" alt="Ramkabir Auto Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-black text-base tracking-tight leading-none" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            Ramkabir Auto
          </span>
        </a>

        {/* Nav links */}
        <ul className="flex items-center gap-1">
          {navLinks.map((link) =>
            link.isHighlighted ? (
              <li key={link.label}>
                <a
                  href={`#${link.targetId}`}
                  onClick={(e) => handleScrollTo(e, link.targetId)}
                  className="ml-2 inline-flex items-center px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #e85d04, #f4a444)', boxShadow: '0 2px 14px rgba(232,93,4,0.4)' }}
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

        {/* Language + Admin */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors duration-200"
            style={langBtnStyle}
          >
            <Globe className="w-4 h-4" />
            {t.langLabel}
          </button>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-white/40 hover:text-white/85 text-xs font-medium px-2.5 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            <Settings className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>
      </div>

      {/* ── MOBILE layout (<md) — no logo, all links + language in one row ── */}
      <div className="flex md:hidden items-center justify-between px-3 h-14 gap-1.5">

        {/* Nav links */}
        <div className="flex items-center gap-0.5 flex-1">
          {navLinks.map((link) =>
            link.isHighlighted ? (
              <a
                key={link.label}
                href={`#${link.targetId}`}
                onClick={(e) => handleScrollTo(e, link.targetId)}
                className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #e85d04, #f4a444)', boxShadow: '0 1px 8px rgba(232,93,4,0.4)' }}
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={`#${link.targetId}`}
                onClick={(e) => handleScrollTo(e, link.targetId)}
                className="px-2 py-1.5 rounded-lg text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Language toggle — with text on mobile */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white flex-shrink-0 transition-colors duration-200"
          style={langBtnStyle}
        >
          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{t.langLabel}</span>
        </button>

        {/* Admin — mobile */}
        <Link
          to="/admin"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all duration-200 flex-shrink-0"
          aria-label="Admin Login"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>

    </nav>
  );
}
