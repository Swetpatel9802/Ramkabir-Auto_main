import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/pages/Home';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Phone, MessageSquare, Share2, Share } from 'lucide-react';

export default function TractorCard({ tractor }) {
  const { language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Fullscreen image handlers
  const openFullscreen = useCallback(() => {
    setFullscreenImage(true);
    window.history.pushState({ fullscreen: true }, '');
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenImage(false);
  }, []);

  // Only go back in history — popstate handler will close the view
  const closeFullscreenWithHistory = useCallback(() => {
    window.history.back();
  }, []);

  // Open modal and push history state so back button closes it
  const openModal = useCallback(() => {
    setShowModal(true);
    window.history.pushState({ modal: true }, '');
  }, []);

  // Only go back in history — popstate handler will close the modal
  const closeModalWithHistory = useCallback(() => {
    window.history.back();
  }, []);

  // Close modal — called by popstate (back button already handled navigation)
  const closeModal = useCallback(() => {
    setShowModal(false);
    setCurrentImageIndex(0);
  }, []);

  // Listen for browser back button to close modal or fullscreen
  useEffect(() => {
    const handlePopState = () => {
      if (fullscreenImage) {
        closeFullscreen();
      } else if (showModal) {
        closeModal();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showModal, fullscreenImage, closeModal, closeFullscreen]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % tractor.images.length);
  }, [tractor.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + tractor.images.length) % tractor.images.length);
  }, [tractor.images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showModal && !fullscreenImage) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, fullscreenImage, nextImage, prevImage]);

  const handleQuote = () => {
    const modelName = tractor.model?.[language] || tractor.model?.en || '';
    const plate = tractor.numberPlate ? ` (${tractor.numberPlate})` : '';
    const message = language === 'en'
      ? `Hello! I'm interested in ${tractor.brand} ${modelName}. Please share the best price and availability.`
      : `નમસ્તે! મને ${tractor.brand} ${modelName} માં રસ છે. કૃપા કરીને શ્રેષ્ઠ ભાવ અને ઉપલબ્ધતા શેર કરો.`;
    window.open(`https://wa.me/919825533573?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const modelName = tractor.model?.[language] || tractor.model?.en || '';
    const shareUrl = `${window.location.origin}/product/${tractor.id}`;
    const shareText = `Check out this ${tractor.brand} ${modelName} at Ramkabir Auto! 🚜`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${tractor.brand} ${modelName}`, text: shareText, url: shareUrl });
      } catch (err) {
        // User cancelled or share failed — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch {
        // Fallback for older browsers
        window.prompt('Copy this link:', shareUrl);
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        onClick={openModal}
      >
        {/* Image */}
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

        {/* Content */}
        <div className="p-6">
          {/* Specs */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#2d5a3d]/10 px-3 py-1.5 rounded-lg">
              <span className="text-[#2d5a3d] text-sm font-bold">{tractor.specs.manufacturing_date} {language === 'en' ? 'Model' : 'મોડેલ'}</span>
            </div>
            <div className="bg-[#1e3a5f]/10 px-3 py-1.5 rounded-lg">
              <span className="text-[#1e3a5f] text-sm font-semibold">{tractor.specs.engine_hours} {language === 'en' ? 'Hours' : 'કલાક'}</span>
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

          {/* Features Preview */}
          <ul className="space-y-2 mb-4">
            {tractor.features[language].slice(0, 2).map((feature, idx) => (
              <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                <span className="text-[#e85d04] mt-0.5">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuote();
            }}
            className="w-full bg-[#e85d04] hover:bg-[#d14f00] text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {language === 'en' ? 'Request Quote' : 'ભાવ માંગો'}
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeModalWithHistory}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-start z-10">
                <div>
                  <div className="text-sm font-semibold text-[#e85d04] mb-1">{tractor.brand}</div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black text-[#1e3a5f]">{tractor.model[language]}</h2>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-[#e85d04]/10 hover:bg-[#e85d04]/20 text-[#e85d04] transition-colors relative"
                      title={language === 'en' ? 'Share' : 'શેર કરો'}
                    >
                      <Share className="w-6 h-6" strokeWidth={2.5} />
                      {showCopied && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1e3a5f] text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg z-50">
                          {language === 'en' ? 'Link copied!' : 'લિંક કૉપી!'}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={closeModalWithHistory}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Gallery */}
              <div className="relative h-96 bg-slate-100 overflow-hidden">
                <motion.img
                  key={currentImageIndex}
                  src={tractor.images[currentImageIndex]}
                  alt={tractor.model[language]}
                  className="w-full h-full object-cover cursor-zoom-in touch-pan-y"
                  onClick={openFullscreen}
                  drag={tractor.images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -50) nextImage();
                    else if (offset.x > 50) prevImage();
                  }}
                />
                {tractor.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {tractor.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Specifications */}
                <div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">
                    {language === 'en' ? 'Specifications' : 'વિશિષ્ટતાઓ'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-slate-500 text-sm mb-1">
                        {language === 'en' ? 'Model Year' : 'મોડેલ વર્ષ'}
                      </div>
                      <div className="text-2xl font-bold text-[#2d5a3d]">{tractor.specs.manufacturing_date}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-slate-500 text-sm mb-1">
                        {language === 'en' ? 'Engine Hours' : 'એન્જિન કલાકો'}
                      </div>
                      <div className="text-lg font-bold text-[#1e3a5f]">{tractor.specs.engine_hours}</div>
                    </div>
                    {tractor.productDetails?.hp && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-slate-500 text-sm mb-1">
                          {language === 'en' ? 'Horsepower (HP)' : 'હોર્સપાવર'}
                        </div>
                        <div className="text-lg font-bold text-[#1e3a5f]">{tractor.productDetails.hp} HP</div>
                      </div>
                    )}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-slate-500 text-sm mb-1">
                        {language === 'en' ? 'Status' : 'સ્થિતિ'}
                      </div>
                      <div className="text-lg font-bold text-[#1e3a5f]">{language === 'en' ? 'Available' : 'ઉપલબ્ધ'}</div>
                    </div>
                  </div>
                </div>

                {/* Condition Details — only if product_details has condition data */}
                {(tractor.productDetails?.condition || tractor.productDetails?.tyre_condition || tractor.productDetails?.engine_condition) && (() => {
                  const conditionLabels = {
                    en: { excellent: 'Excellent', good: 'Good', fair: 'Fair', needs_repair: 'Needs Repair' },
                    gu: { excellent: 'ઉત્તમ', good: 'સારી', fair: 'ઠીક', needs_repair: 'મરામત જરૂરી' },
                  };
                  const tyreLabels = {
                    en: { 'new': 'New', '80+': '80%+', '50-80': '50-80%', 'below_50': 'Below 50%', 'remould': 'Remould' },
                    gu: { 'new': 'નવા', '80+': '૮૦%+', '50-80': '૫૦-૮૦%', 'below_50': '૫૦% થી ઓછા', 'remould': 'રીમોલ્ડ' },
                  };
                  const engineLabels = {
                    en: { excellent: 'Excellent', good: 'Good', average: 'Average', needs_repairing: 'Needs Repairing' },
                    gu: { excellent: 'ઉત્તમ', good: 'સારી', average: 'સામાન્ય', needs_repairing: 'કામ જરૂરી' },
                  };
                  const getLabel = (value, labels) => labels[language]?.[value] || value;
                  return (
                    <div>
                      <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">
                        {language === 'en' ? 'Condition Report' : 'સ્થિતિ રિપોર્ટ'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {tractor.productDetails.condition && (
                          <div className="bg-[#2d5a3d]/5 border border-[#2d5a3d]/15 rounded-xl p-4">
                            <div className="text-slate-500 text-xs mb-1">{language === 'en' ? 'Overall' : 'એકંદર'}</div>
                            <div className="text-[#2d5a3d] font-bold capitalize">{getLabel(tractor.productDetails.condition, conditionLabels)}</div>
                          </div>
                        )}
                        {tractor.productDetails.tyre_condition && (
                          <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/15 rounded-xl p-4">
                            <div className="text-slate-500 text-xs mb-1">{language === 'en' ? 'Tyres' : 'ટાયર'}</div>
                            <div className="text-[#1e3a5f] font-bold">{getLabel(tractor.productDetails.tyre_condition, tyreLabels)}</div>
                          </div>
                        )}
                        {tractor.productDetails.engine_condition && (
                          <div className="bg-[#e85d04]/5 border border-[#e85d04]/15 rounded-xl p-4">
                            <div className="text-slate-500 text-xs mb-1">{language === 'en' ? 'Engine' : 'એન્જિન'}</div>
                            <div className="text-[#e85d04] font-bold capitalize">{getLabel(tractor.productDetails.engine_condition, engineLabels)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Key Features */}
                <div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">
                    {language === 'en' ? 'Key Features' : 'મુખ્ય લક્ષણો'}
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {tractor.features[language].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#2d5a3d]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#2d5a3d] text-sm">✓</span>
                        </div>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Custom Notes — only if available */}
                {tractor.productDetails?.custom_notes && (
                  <div>
                    <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">
                      {language === 'en' ? 'Additional Info' : 'વધારાની માહિતી'}
                    </h3>
                    <p className="text-slate-600 bg-slate-50 rounded-xl p-4 text-sm leading-relaxed">
                      {tractor.productDetails.custom_notes}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleQuote}
                    className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {language === 'en' ? 'Request Quote on WhatsApp' : 'WhatsApp પર ભાવ માંગો'}
                  </button>
                  <a
                    href="tel:9825533573"
                    className="flex-1 bg-[#e85d04] hover:bg-[#d14f00] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    {language === 'en' ? 'Call Now' : 'હમણાં કૉલ કરો'}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
            onClick={closeFullscreenWithHistory}
          >
            {/* Close Button */}
            <button
              onClick={closeFullscreenWithHistory}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Image Counter */}
            {tractor.images.length > 1 && (
              <div className="absolute top-4 left-4 z-10 bg-white/15 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full font-medium">
                {currentImageIndex + 1} / {tractor.images.length}
              </div>
            )}

            {/* Full Image */}
            <motion.img
              key={currentImageIndex}
              src={tractor.images[currentImageIndex]}
              alt={tractor.model?.[language] || ''}
              className="max-w-full max-h-full object-contain touch-pan-y"
              onClick={(e) => e.stopPropagation()}
              drag={tractor.images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -50) nextImage();
                else if (offset.x > 50) prevImage();
              }}
            />

            {/* Navigation Arrows */}
            {tractor.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}