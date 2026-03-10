import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MessageSquare, ChevronLeft, ChevronRight, X, Share2, Share, AlertCircle } from 'lucide-react';
import { fetchProductById } from '@/api/tractors';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import LanguageToggle from '@/components/landing/LanguageToggle';
import { LanguageContext } from '@/pages/Home';

const pageContent = {
    en: {
        backToInventory: "Back to Inventory",
        loading: "Loading product details...",
        error: "Product not found or unavailable.",
        specifications: "Specifications",
        modelYear: "Model Year",
        engineHours: "Engine Hours",
        horsepower: "Horsepower (HP)",
        status: "Status",
        available: "Available",
        conditionReport: "Condition Report",
        overall: "Overall",
        tyres: "Tyres",
        engine: "Engine",
        keyFeatures: "Key Features",
        additionalInfo: "Additional Info",
        requestQuoteWA: "Request Quote on WhatsApp",
        callNow: "Call Now",
        linkCopied: "Link copied!",
        shareBtn: "Share"
    },
    gu: {
        backToInventory: "ઇન્વેન્ટરી પર પાછા જાઓ",
        loading: "ઉત્પાદન વિગતો લોડ થઈ રહી છે...",
        error: "ઉત્પાદન મળ્યું નથી અથવા ઉપલબ્ધ નથી.",
        specifications: "વિશિષ્ટતાઓ",
        modelYear: "મોડેલ વર્ષ",
        engineHours: "એન્જિન કલાકો",
        horsepower: "હોર્સપાવર",
        status: "સ્થિતિ",
        available: "ઉપલબ્ધ",
        conditionReport: "સ્થિતિ રિપોર્ટ",
        overall: "એકંદર",
        tyres: "ટાયર",
        engine: "એન્જિન",
        keyFeatures: "મુખ્ય લક્ષણો",
        additionalInfo: "વધારાની માહિતી",
        requestQuoteWA: "WhatsApp પર ભાવ માંગો",
        callNow: "હમણાં કૉલ કરો",
        linkCopied: "લિંક કૉપી!",
        shareBtn: "શેર કરો"
    }
};

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

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [language, setLanguage] = useState('gu');
    const t = pageContent[language];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fullscreenImage, setFullscreenImage] = useState(false);
    const [showCopied, setShowCopied] = useState(false);

    const { data: tractor, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
        retry: 1
    });

    // Handle history pushstate for browser back button explicitly going to inventory
    // when clicking the built-in back button, but intercepting it for fullscreen image
    useEffect(() => {
        // We can replace the current history state if they landed here directly
        // so that if they hit the actual browser back button, we could theoretically go somewhere else,
        // but it's simpler to just provide an explicit on-screen button.
        const handlePopState = () => {
            if (fullscreenImage) {
                setFullscreenImage(false);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [fullscreenImage]);

    const openFullscreen = useCallback(() => {
        setFullscreenImage(true);
        window.history.pushState({ fullscreen: true }, '');
    }, []);

    const closeFullscreenWithHistory = useCallback(() => {
        window.history.back();
    }, []);

    const nextImage = useCallback(() => {
        if (!tractor) return;
        setCurrentImageIndex((prev) => (prev + 1) % tractor.images.length);
    }, [tractor]);

    const prevImage = useCallback(() => {
        if (!tractor) return;
        setCurrentImageIndex((prev) => (prev - 1 + tractor.images.length) % tractor.images.length);
    }, [tractor]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextImage, prevImage]);

    const handleQuote = () => {
        if (!tractor) return;
        const modelName = tractor.model?.[language] || tractor.model?.en || '';
        const message = language === 'en'
            ? `Hello! I'm interested in ${tractor.brand} ${modelName}. Please share the best price and availability.`
            : `નમસ્તે! મને ${tractor.brand} ${modelName} માં રસ છે. કૃપા કરીને શ્રેષ્ઠ ભાવ અને ઉપલબ્ધતા શેર કરો.`;
        window.open(`https://wa.me/919825533573?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleShare = async () => {
        if (!tractor) return;
        const modelName = tractor.model?.[language] || tractor.model?.en || '';
        const shareUrl = window.location.href;
        const shareText = `Check out this ${tractor.brand} ${modelName} at Ramkabir Auto! 🚜`;

        if (navigator.share) {
            try {
                await navigator.share({ title: `${tractor.brand} ${modelName}`, text: shareText, url: shareUrl });
            } catch (err) { }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
            } catch {
                window.prompt('Copy this link:', shareUrl);
            }
        }
    };

    const getLabel = (value, labels) => labels[language]?.[value] || value;

    if (isLoading) {
        return (
            <LanguageContext.Provider value={{ language, setLanguage }}>
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                    <div className="text-xl text-slate-500 animate-pulse">{t.loading}</div>
                </div>
            </LanguageContext.Provider>
        );
    }

    if (error || !tractor) {
        return (
            <LanguageContext.Provider value={{ language, setLanguage }}>
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                    <LanguageToggle />
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <div className="text-xl text-slate-700 mb-6 font-semibold">{t.error}</div>
                    <button
                        onClick={() => navigate('/inventory')}
                        className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-full hover:bg-[#1e3a5f]/90 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t.backToInventory}
                    </button>
                </div>
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            <div className="min-h-screen bg-slate-50 font-sans pb-20">
                <LanguageToggle />
                <WhatsAppButton />

                {/* Header Navbar */}
                <div className="bg-[#1e3a5f] text-white sticky top-0 z-30 shadow-md">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                        <button
                            onClick={() => navigate('/inventory')}
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">{t.backToInventory}</span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                title={t.shareBtn}
                            >
                                <Share2 className="w-5 h-5 text-white" />
                            </button>
                            {showCopied && (
                                <div className="absolute top-12 right-0 bg-white text-[#1e3a5f] text-xs px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg font-bold">
                                    {t.linkCopied}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content (similar to Modal) */}
                <div className="max-w-4xl mx-auto bg-white shadow-xl min-h-screen sm:min-h-0 sm:mt-6 sm:mb-12 sm:rounded-3xl overflow-hidden">
                    {/* Title Area */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="text-sm font-semibold text-[#e85d04] mb-1">{tractor.brand}</div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl font-black text-[#1e3a5f]">{tractor.model[language]}</h1>
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-full bg-[#e85d04]/10 hover:bg-[#e85d04]/20 text-[#e85d04] transition-colors relative"
                                title={t.shareBtn}
                            >
                                <Share className="w-6 h-6" strokeWidth={2.5} />
                                {showCopied && (
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1e3a5f] text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg z-50">
                                        {t.linkCopied}
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="relative h-72 sm:h-96 bg-slate-100 overflow-hidden">
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
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
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

                    {/* Specs & Details */}
                    <div className="p-6 sm:p-8 space-y-8">
                        {/* Specifications */}
                        <div>
                            <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{t.specifications}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-slate-500 text-sm mb-1">{t.modelYear}</div>
                                    <div className="text-2xl font-bold text-[#2d5a3d]">{tractor.specs.manufacturing_date}</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-slate-500 text-sm mb-1">{t.engineHours}</div>
                                    <div className="text-lg font-bold text-[#1e3a5f]">{tractor.specs.engine_hours}</div>
                                </div>
                                {tractor.productDetails?.hp && (
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-slate-500 text-sm mb-1">{t.horsepower}</div>
                                        <div className="text-lg font-bold text-[#1e3a5f]">{tractor.productDetails.hp} HP</div>
                                    </div>
                                )}
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <div className="text-slate-500 text-sm mb-1">{t.status}</div>
                                    <div className="text-lg font-bold text-[#1e3a5f]">{t.available}</div>
                                </div>
                            </div>
                        </div>

                        {/* Condition Details */}
                        {(tractor.productDetails?.condition || tractor.productDetails?.tyre_condition || tractor.productDetails?.engine_condition) && (
                            <div>
                                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{t.conditionReport}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {tractor.productDetails.condition && (
                                        <div className="bg-[#2d5a3d]/5 border border-[#2d5a3d]/15 rounded-xl p-4">
                                            <div className="text-slate-500 text-xs mb-1">{t.overall}</div>
                                            <div className="text-[#2d5a3d] font-bold capitalize">{getLabel(tractor.productDetails.condition, conditionLabels)}</div>
                                        </div>
                                    )}
                                    {tractor.productDetails.tyre_condition && (
                                        <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/15 rounded-xl p-4">
                                            <div className="text-slate-500 text-xs mb-1">{t.tyres}</div>
                                            <div className="text-[#1e3a5f] font-bold">{getLabel(tractor.productDetails.tyre_condition, tyreLabels)}</div>
                                        </div>
                                    )}
                                    {tractor.productDetails.engine_condition && (
                                        <div className="bg-[#e85d04]/5 border border-[#e85d04]/15 rounded-xl p-4">
                                            <div className="text-slate-500 text-xs mb-1">{t.engine}</div>
                                            <div className="text-[#e85d04] font-bold capitalize">{getLabel(tractor.productDetails.engine_condition, engineLabels)}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Key Features */}
                        <div>
                            <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{t.keyFeatures}</h3>
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

                        {/* Custom Notes */}
                        {tractor.productDetails?.custom_notes && (
                            <div>
                                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{t.additionalInfo}</h3>
                                <p className="text-slate-600 bg-slate-50 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line">
                                    {tractor.productDetails.custom_notes}
                                </p>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                            <button
                                onClick={handleQuote}
                                className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <MessageSquare className="w-5 h-5" />
                                {t.requestQuoteWA}
                            </button>
                            <a
                                href="tel:9825533573"
                                className="flex-1 bg-[#e85d04] hover:bg-[#d14f00] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <Phone className="w-5 h-5" />
                                {t.callNow}
                            </a>
                        </div>
                    </div>
                </div>

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
                            <button
                                onClick={closeFullscreenWithHistory}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            {tractor.images.length > 1 && (
                                <div className="absolute top-4 left-4 z-10 bg-white/15 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full font-medium">
                                    {currentImageIndex + 1} / {tractor.images.length}
                                </div>
                            )}

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
            </div>
        </LanguageContext.Provider>
    );
}
