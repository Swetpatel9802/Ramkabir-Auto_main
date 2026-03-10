import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone } from 'lucide-react';
import { fetchProductsByBrand } from '@/api/tractors';
import TractorCard from '@/components/landing/TractorCard';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import LanguageToggle from '@/components/landing/LanguageToggle';
import { LanguageContext } from '@/pages/Home';

const pageContent = {
    en: {
        backToHome: "Back to Home",
        productsBy: "Products by",
        loading: "Loading products...",
        error: "Error loading products. Please try again later.",
        noProducts: "No products currently available for this brand. Check back soon!",
        ctaText: "Want to know more? Contact us directly!",
        callNow: "Call Now",
    },
    gu: {
        backToHome: "હોમ પર પાછા જાઓ",
        productsBy: "ના ઉત્પાદનો",
        loading: "ઉત્પાદનો લોડ થઈ રહ્યા છે...",
        error: "ઉત્પાદનો લોડ કરવામાં ભૂલ. કૃપા કરીને પછી ફરી પ્રયાસ કરો.",
        noProducts: "આ બ્રાન્ડ માટે હાલમાં કોઈ ઉત્પાદનો ઉપલબ્ધ નથી. ટૂંક સમયમાં ફરી તપાસો!",
        ctaText: "વધુ જાણવા માંગો છો? અમારો સીધો સંપર્ક કરો!",
        callNow: "હમણાં કૉલ કરો",
    }
};

const categoryLabels = {
    en: { Tractor: 'Tractors', Trolley: 'Trolleys', Other: 'Other Products' },
    gu: { Tractor: 'ટ્રેક્ટર', Trolley: 'ટ્રોલી', Other: 'અન્ય ઉત્પાદનો' }
};

export default function BrandInventory() {
    const { vehicleType, brand } = useParams();
    const navigate = useNavigate();
    const [language, setLanguage] = useState('en');
    const t = pageContent[language];
    const decodedBrand = decodeURIComponent(brand);

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products', vehicleType, decodedBrand],
        queryFn: () => fetchProductsByBrand(vehicleType, decodedBrand),
    });

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans">
                <LanguageToggle />

                {/* Header */}
                <div className="bg-[#1e3a5f] text-white">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">{t.backToHome}</span>
                        </button>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-block bg-white/15 text-white/90 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                                {categoryLabels[language]?.[vehicleType] || vehicleType}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-black">
                                {decodedBrand}
                            </h1>
                            <p className="text-white/70 mt-2">
                                {language === 'en'
                                    ? `Browse all available ${decodedBrand} ${(vehicleType || '').toLowerCase()}s`
                                    : `${decodedBrand} ના બધા ઉપલબ્ધ સાધનો જુઓ`}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {isLoading && (
                        <div className="text-center py-20">
                            <div className="text-xl text-slate-500 animate-pulse">{t.loading}</div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20">
                            <div className="text-xl text-red-500">{t.error}</div>
                        </div>
                    )}

                    {!isLoading && !error && products?.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-xl text-slate-500">{t.noProducts}</div>
                        </div>
                    )}

                    {!isLoading && !error && products?.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <TractorCard key={product.id} tractor={product} />
                            ))}
                        </div>
                    )}

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                    >
                        <p className="text-slate-600 mb-6">{t.ctaText}</p>
                        <a
                            href="tel:9825533573"
                            className="inline-flex items-center gap-3 bg-[#e85d04] hover:bg-[#d14f00] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <Phone className="w-5 h-5" />
                            {t.callNow}
                        </a>
                    </motion.div>
                </div>

                <WhatsAppButton />
            </div>
        </LanguageContext.Provider>
    );
}
