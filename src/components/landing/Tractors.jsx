import React from 'react';
import { useLanguage } from '@/pages/Home';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, Truck, ShoppingCart, Wrench } from 'lucide-react';
import { fetchBrandsByCategory, fetchTractors } from '@/api/tractors';

const content = {
  en: {
    badge: "Our Inventory",
    headline: "Browse Our Products",
    subheadline: "Explore our wide range of vehicles and equipment from top brands",
    sections: {
      Tractor: "Premium Tractor Models",
      Trolley: "Trolley Models",
      Other: "Other Products"
    },
    sectionSub: {
      Tractor: "Select a brand to view its available tractors",
      Trolley: "Select a brand to view its available trolleys",
      Other: "Select a brand to view available equipment"
    },
    noBrands: "No brands available right now.",
    loading: "Loading...",
    cta: "Can't find what you're looking for? We have more in stock!",
    ctaButton: "Call for Full Inventory",
    viewInventory: "View Full Inventory",
    bannerTitle: "Explore Our Complete Collection",
    bannerSub: "Tractors, Trolleys & More — All in One Place",
    productsAvailable: "Products Available",
    browseAll: "Browse All Products",
    or: "OR",
    orSub: "Browse by brand"
  },
  gu: {
    badge: "અમારી ઈન્વેન્ટરી",
    headline: "અમારા ઉત્પાદનો જુઓ",
    subheadline: "ટોચની બ્રાન્ડ્સમાંથી અમારા વાહનો અને સાધનોની વિશાળ શ્રેણી જુઓ",
    sections: {
      Tractor: "પ્રીમિયમ ટ્રેક્ટર મોડલ્સ",
      Trolley: "ટ્રોલી મોડલ્સ",
      Other: "અન્ય ઉત્પાદનો"
    },
    sectionSub: {
      Tractor: "ટ્રેક્ટર જોવા માટે બ્રાન્ડ પસંદ કરો",
      Trolley: "ટ્રોલી જોવા માટે બ્રાન્ડ પસંદ કરો",
      Other: "સાધનો જોવા માટે બ્રાન્ડ પસંદ કરો"
    },
    noBrands: "હાલમાં કોઈ બ્રાન્ડ ઉપલબ્ધ નથી.",
    loading: "લોડ થઈ રહ્યું છે...",
    cta: "તમે જે શોધી રહ્યા છો તે મળ્યું નથી? અમારી પાસે સ્ટોકમાં વધુ છે!",
    ctaButton: "સંપૂર્ણ ઈન્વેન્ટરી માટે કૉલ કરો",
    viewInventory: "સંપૂર્ણ ઈન્વેન્ટરી જુઓ",
    bannerTitle: "અમારો સંપૂર્ણ સંગ્રહ જુઓ",
    bannerSub: "ટ્રેક્ટર, ટ્રોલી અને વધુ — બધું એક જગ્યાએ",
    productsAvailable: "ઉત્પાદનો ઉપલબ્ધ",
    browseAll: "બધા ઉત્પાદનો જુઓ",
    or: "અથવા",
    orSub: "પસંદીદા બ્રાન્ડ પ્રમાણે જુઓ"
  }
};

const CATEGORIES = ['Tractor', 'Trolley', 'Other'];

const CATEGORY_COLORS = {
  Tractor: '#e10202',
  Trolley: '#22c55e',
  Other: '#8B4513',
};

const BRAND_LOGOS = {
  'Mahindra': '/images/brands/Mahindra.png',
  'John Deere': '/images/brands/John deere.jpeg',
  'Massey Ferguson': '/images/brands/Massey.png',
  'Massey': 'public/images/brands/Massey.png',
  'New Holland': '/images/brands/New Holland.png',
  'Sonalika': '/images/brands/Sonalika.png',
  'Swaraj': '/images/brands/Swaraj.jpg',
  'Eicher': '/images/brands/eicher.png',
  'Farmtrac': '/images/brands/Farmtrac.png',
  'Kubota': '/images/brands/Kubota.png',
};

function BrandCard({ brand, vehicleType, index }) {
  const navigate = useNavigate();
  const color = CATEGORY_COLORS[vehicleType] || '#e10202ff';
  const logo = BRAND_LOGOS[brand];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/inventory/${vehicleType}/${encodeURIComponent(brand)}`)}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 cursor-pointer group"
      style={{ borderColor: undefined }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = `${color}4d`}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
    >
      <div className="flex items-center justify-center h-24 mb-4">
        {logo ? (
          <img src={logo} alt={brand} className="max-h-20 max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <span className="text-2xl md:text-3xl font-black text-[#1e3a5f] transition-colors duration-300 text-center">
            {brand}
          </span>
        )}
      </div>
      <div className="text-center">
        {logo && <p className="text-lg font-bold text-[#1e3a5f] mb-2">{brand}</p>}
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
          style={{ backgroundColor: `${color}1a`, color: color }}
        >
          View Models →
        </span>
      </div>
    </motion.div>
  );
}

function CategorySection({ vehicleType, language }) {
  const t = content[language];

  const { data: brands, isLoading } = useQuery({
    queryKey: ['brands', vehicleType],
    queryFn: () => fetchBrandsByCategory(vehicleType),
  });

  // Don't render the section at all if there are no brands (after loading)
  if (!isLoading && (!brands || brands.length === 0)) {
    return null;
  }

  return (
    <div className="mb-16">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 text-center"
      >
        <h3 className="text-2xl md:text-3xl font-black mb-2" style={{ color: CATEGORY_COLORS[vehicleType] }}>
          {t.sections[vehicleType]}
        </h3>
        <p className="text-slate-500">
          {t.sectionSub[vehicleType]}
        </p>
        <div className="w-16 h-1 rounded-full mt-3 mx-auto" style={{ backgroundColor: CATEGORY_COLORS[vehicleType] }} />
      </motion.div>

      {/* Brand Cards */}
      {isLoading ? (
        <div className="text-slate-400 animate-pulse py-8">{t.loading}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand, idx) => (
            <BrandCard key={brand} brand={brand} vehicleType={vehicleType} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function InventoryBanner({ language }) {
  const navigate = useNavigate();
  const t = content[language];

  const { data: allProducts } = useQuery({
    queryKey: ['allProductsCount'],
    queryFn: fetchTractors,
  });

  const totalCount = allProducts?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-14"
    >
      <div
        onClick={() => navigate('/inventory')}
        className="relative overflow-hidden rounded-2xl cursor-pointer group"
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a3d 50%, #e85d04 100%)',
        }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />

        {/* Floating background icons */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <Truck className="absolute w-24 h-24 text-white -top-2 -left-4 rotate-12" />
          <ShoppingCart className="absolute w-16 h-16 text-white bottom-2 left-1/3 -rotate-6" />
          <Wrench className="absolute w-20 h-20 text-white -top-3 right-8 rotate-45" />
        </div>

        <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Text content */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
              {t.bannerTitle}
            </h3>
            <p className="text-white/70 text-sm md:text-base">
              {t.bannerSub}
            </p>
          </div>

          {/* Right: Count + CTA */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            {/* Live count badge */}
            {totalCount > 0 && (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                <span className="text-white font-bold text-lg">{totalCount}+</span>
                <span className="text-white/70 text-sm">{t.productsAvailable}</span>
              </div>
            )}

            {/* CTA button */}
            <button className="bg-white text-[#1e3a5f] hover:bg-[#e85d04] hover:text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {t.browseAll}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.div>
  );
}

export default function Tractors() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = content[language];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6">
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

        {/* View Full Inventory — Animated Banner */}
        <InventoryBanner language={language} />

        {/* OR Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-slate-200" />
          <div className="text-center">
            <span className="bg-[#1e3a5f] text-white px-5 py-1.5 rounded-full text-sm font-bold">
              {t.or}
            </span>
            <p className="text-slate-400 text-xs mt-2">{t.orSub}</p>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* All Categories Stacked */}
        {CATEGORIES.map((cat) => (
          <CategorySection key={cat} vehicleType={cat} language={language} />
        ))}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-slate-600 mb-6">{t.cta}</p>
          <a
            href="tel:9825533573"
            className="inline-flex items-center gap-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl transition-all duration-300 hover:scale-105"
          >
            {t.ctaButton}
          </a>
        </motion.div>
      </div>
    </section>
  );
}