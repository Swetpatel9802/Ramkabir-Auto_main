import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/pages/Home';
import { Globe, Settings, Menu, X } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true, once: true });
      return () => window.removeEventListener('scroll', close);
    }
  }, [menuOpen]);

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
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

  const navBg = scrolled ? 'rgba(15,30,50,0.88)' : 'rgba(15,30,50,0.52)';

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: navBg,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid rgba(255,255,255,0.06)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-3">

          {/* Left: Logo + brand */}
          <a
            href="/"
            onClick={(e) => handleScrollTo(e, 'top')}
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/20 group-hover:ring-white/50 transition-all">
              <img src="/images/Logo.jpg" alt="Ramkabir Auto Logo" className="w-full h-full object-cover" />
            </div>
            <span
              className="text-white font-black text-base tracking-tight leading-none"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
            >
              Ramkabir Auto
            </span>
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.isHighlighted ? (
                <li key={link.label}>
                  <a
                    href={`#${link.targetId}`}
                    onClick={(e) => handleScrollTo(e, link.targetId)}
                    className="ml-2 inline-flex items-center px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105"
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

          {/* Right side: Language + Admin (desktop) + Hamburger (mobile) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                boxShadow: '0 2px 14px rgba(99,102,241,0.45)',
              }}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{t.langLabel}</span>
            </button>

            {/* Admin — desktop only inline, mobile inside menu */}
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 text-white/45 hover:text-white/90 text-xs font-medium transition-all duration-200 px-2.5 py-2 rounded-lg hover:bg-white/10"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className="fixed top-16 left-0 right-0 z-40 md:hidden transition-all duration-300 overflow-hidden"
        style={{
          maxHeight: menuOpen ? '320px' : '0px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(10,20,40,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="flex flex-col px-5 py-4 gap-1">
            {navLinks.map((link) =>
              link.isHighlighted ? (
                <a
                  key={link.label}
                  href={`#${link.targetId}`}
                  onClick={(e) => handleScrollTo(e, link.targetId)}
                  className="w-full text-center py-3 rounded-xl text-sm font-bold text-white mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #e85d04, #f4a444)',
                    boxShadow: '0 2px 14px rgba(232,93,4,0.35)',
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={`#${link.targetId}`}
                  onClick={(e) => handleScrollTo(e, link.targetId)}
                  className="py-3 px-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all duration-200 border-b border-white/5 last:border-0"
                >
                  {link.label}
                </a>
              )
            )}

            {/* Admin in mobile menu */}
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-3 px-2 text-sm font-medium text-white/40 hover:text-white/70 transition-all duration-200 mt-1 border-t border-white/10"
            >
              <Settings className="w-4 h-4" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
