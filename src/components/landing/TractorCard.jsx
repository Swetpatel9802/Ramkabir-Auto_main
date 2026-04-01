import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/pages/Home';
import { motion } from 'framer-motion';
import { MessageSquare, Share2 } from 'lucide-react';

export default function TractorCard({ tractor }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCopied, setShowCopied] = useState(false);

  const openProductPage = () => {
    navigate(`/product/${tractor.id}`, {
      state: {
        from: `${location.pathname}${location.search}${location.hash}`,
      },
    });
  };

  const handleQuote = () => {
    const modelName = tractor.model?.[language] || tractor.model?.en || '';
    const message = language === 'en'
      ? `Hello! I'm interested in ${tractor.brand} ${modelName}. Please share the best price and availability.`
      : `નમસ્તે! મને ${tractor.brand} ${modelName} માં રસ છે. કૃપા કરીને શ્રેષ્ઠ ભાવ અને ઉપલબ્ધતા શેર કરો.`;

    window.open(`https://wa.me/919825533573?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async (event) => {
    event.stopPropagation();

    const modelName = tractor.model?.[language] || tractor.model?.en || '';
    const shareUrl = `${window.location.origin}/product/${tractor.id}`;
    const shareText = `Check out this ${tractor.brand} ${modelName} at Ramkabir Auto! 🚜`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tractor.brand} ${modelName}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // Ignore share cancellations.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', shareUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={openProductPage}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={tractor.images[0]}
          alt={tractor.model[language]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-[#1e3a5f]">
          {tractor.brand}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-black">{tractor.model[language]}</h3>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#2d5a3d]/10 px-3 py-1.5 rounded-lg">
            <span className="text-[#2d5a3d] text-sm font-bold">
              {tractor.specs.manufacturing_date} {language === 'en' ? 'Model' : 'મોડેલ'}
            </span>
          </div>
          <div className="bg-[#1e3a5f]/10 px-3 py-1.5 rounded-lg">
            <span className="text-[#1e3a5f] text-sm font-semibold">
              {tractor.specs.engine_hours} {language === 'en' ? 'Hours' : 'કલાક'}
            </span>
          </div>
          <div className="ml-auto relative">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-[#1e3a5f]/10 hover:bg-[#1e3a5f]/20 flex items-center justify-center transition-colors"
              title={language === 'en' ? 'Share' : 'શેર કરો'}
            >
              <Share2 className="w-4 h-4 text-[#1e3a5f]" />
            </button>
            {showCopied && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1e3a5f] text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                {language === 'en' ? 'Link copied!' : 'લિંક કૉપી!'}
              </div>
            )}
          </div>
        </div>

        <ul className="space-y-2 mb-4">
          {tractor.features[language].slice(0, 2).map((feature, idx) => (
            <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
              <span className="text-[#e85d04] mt-0.5">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={(event) => {
            event.stopPropagation();
            handleQuote();
          }}
          className="w-full bg-[#e85d04] hover:bg-[#d14f00] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          {language === 'en' ? 'Request Quote' : 'ભાવ માંગો'}
        </button>
      </div>
    </motion.div>
  );
}
