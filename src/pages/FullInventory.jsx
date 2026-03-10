import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Package } from 'lucide-react';
import { fetchAllInventory } from '@/api/tractors';
import TractorCard from '@/components/landing/TractorCard';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import LanguageToggle from '@/components/landing/LanguageToggle';
import { LanguageContext } from '@/pages/Home';

const pageContent = {
    en: {
        backToHome: "Back to Home",
        title: "Our Full Inventory",
        subtitle: "Browse all our available vehicles and equipment",
        loading: "Loading products...",
        error: "Error loading products. Please try again later.",
        noProducts: "No products currently available. Check back soon!",
        ctaText: "Want to know more? Contact us directly!",
        callNow: "Call Now",
        allTab: "All",
        categories: {
            Tractor: "Tractors",
            Trolley: "Trolleys",
            Other: "Other Products",
        },
    },
    gu: {
        backToHome: "હોમ પર પાછા જાઓ",
        title: "અમારી સંપૂર્ણ ઈન્વેન્ટરી",
        subtitle: "અમારા બધા ઉપલબ્ધ વાહનો અને સાધનો જુઓ",
        loading: "ઉત્પાદનો લોડ થઈ રહ્યા છે...",
        error: "ઉત્પાદનો લોડ કરવામાં ભૂલ. કૃપા કરીને પછી ફરી પ્રયાસ કરો.",
        noProducts: "હાલમાં કોઈ ઉત્પાદનો ઉપલબ્ધ નથી. ટૂંક સમયમાં ફરી તપાસો!",
        ctaText: "વધુ જાણવા માંગો છો? અમારો સીધો સંપર્ક કરો!",
        callNow: "હમણાં કૉલ કરો",
        allTab: "બધા",
        categories: {
            Tractor: "ટ્રેક્ટર",
            Trolley: "ટ્રોલી",
            Other: "અન્ય ઉત્પાદનો",
        },
    },
};

const CATEGORY_COLORS = {
    Tractor: '#e10202',
    Trolley: '#22c55e',
    Other: '#8B4513',
};

const CATEGORIES = ['Tractor', 'Trolley', 'Other'];

export default function FullInventory() {
    const navigate = useNavigate();
    const [language, setLanguage] = useState('gu');
    const [activeTab, setActiveTab] = useState('All');
    const t = pageContent[language];

    const { data: inventory, isLoading, error } = useQuery({
        queryKey: ['fullInventory'],
        queryFn: fetchAllInventory,
    });

    // Flatten all products or filter by category
    const getProducts = () => {
        if (!inventory) return [];
        if (activeTab === 'All') {
            return CATEGORIES.flatMap(cat => inventory[cat] || []);
        }
        return inventory[activeTab] || [];
    };

    const products = getProducts();

    // Count per category for tab badges
    const getCategoryCount = (cat) => {
        if (!inventory) return 0;
        if (cat === 'All') return CATEGORIES.reduce((sum, c) => sum + (inventory[c]?.length || 0), 0);
        return inventory[cat]?.length || 0;
    };

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
                            <div className="flex items-center gap-3 mb-3">
                                <Package className="w-8 h-8 text-[#e85d04]" />
                                <h1 className="text-3xl md:text-4xl font-black">
                                    {t.title}
                                </h1>
                            </div>
                            <p className="text-white/70">
                                {t.subtitle}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex gap-1 overflow-x-auto py-3 -mb-px">
                            {/* All tab */}
                            <button
                                onClick={() => setActiveTab('All')}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeTab === 'All'
                                    ? 'bg-[#1e3a5f] text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {t.allTab}
                                {!isLoading && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'All' ? 'bg-white/20' : 'bg-slate-200'}`}>
                                        {getCategoryCount('All')}
                                    </span>
                                )}
                            </button>

                            {CATEGORIES.map(cat => {
                                const count = getCategoryCount(cat);
                                if (!isLoading && count === 0) return null;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveTab(cat)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeTab === cat
                                            ? 'text-white shadow-lg'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        style={activeTab === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : {}}
                                    >
                                        {t.categories[cat]}
                                        {!isLoading && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === cat ? 'bg-white/20' : 'bg-slate-200'}`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
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

                    {!isLoading && !error && products.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-xl text-slate-500">{t.noProducts}</div>
                        </div>
                    )}

                    {!isLoading && !error && products.length > 0 && (
                        <>
                            {activeTab === 'All' ? (
                                // Grouped view when "All" is selected
                                CATEGORIES.map(cat => {
                                    const catProducts = inventory[cat] || [];
                                    if (catProducts.length === 0) return null;
                                    return (
                                        <div key={cat} className="mb-14">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="mb-6"
                                            >
                                                <h2 className="text-2xl md:text-3xl font-black mb-1" style={{ color: CATEGORY_COLORS[cat] }}>
                                                    {t.categories[cat]}
                                                </h2>
                                                <div className="w-16 h-1 rounded-full mt-2" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                                            </motion.div>
                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {catProducts.map((product) => (
                                                    <TractorCard key={product.id} tractor={product} />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                // Flat grid when a specific category is selected
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <TractorCard key={product.id} tractor={product} />
                                    ))}
                                </div>
                            )}
                        </>
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
