import { useLanguage } from '@/pages/Home';
import { motion } from 'framer-motion';
import { Shield, Users, Award, MapPin } from 'lucide-react';

const content = {
  en: {
    badge: "About Us",
    headline: "Your Trusted Tractor Partner in Vadodara",
    body: "Welcome to Ramkabir Auto, Vadodara's multi-brand tractor hub. Conveniently located on NH 48 near the APMC Market, we offer a wide range of reliable machinery from top manufacturers like Swaraj, Mahindra, John Deere, and more. Led by Vimal Patel, our team is dedicated to helping local farmers choose the right products to maximize their crop productivity. Visit our place today to explore the best tractors and agricultural equipment at competitive prices.",
    stats: [
      { icon: Shield, label: "Old Tractors Dealer", value: "Trusted" },
      { icon: Users, label: "Happy Customers", value: "1000+" },
      { icon: Award, label: "Years of Trust", value: "20+" },
      { icon: MapPin, label: "Location", value: "APMC Market, NH 48, Ajwa Road, Vadodara" }
    ]
  },
  gu: {
    badge: "અમારા વિશે",
    headline: "વડોદરા ના વિશ્વાસુ જુના ટ્રેક્ટર્સ ના વેપારી",
    body: "રામકબીર ઓટોમાં આપનું સ્વાગત છે, વડોદરાનું મલ્ટી-બ્રાન્ડ ટ્રેક્ટર હબ. APMC માર્કેટ નજીક NH 48, આજવા રોડ, વડોદરા પર અનુકૂળ રીતે સ્થિત, અમે સ્વરાજ, મહિન્દ્રા, હોલેન્ડ, આઇશર અને વધુ જેવા ટોચના ટ્રેક્ટર રાખીએ છીએ. અમરી પસે નવી અને જુની ટ્રોલી, ટેન્કર, કલ્ટી વેટર અને બીજ ગણ ખેતી ના સાધનો ઉપલબ્ધ છેએ. વિમલ પટેલના નેતૃત્વમાં, અમારી ટીમ ખેડૂતોને તેમની જરૂરિયાત યોગ્ય સાધનો પસંદ કરવામાં મદદ કરવા માટે સમર્પિત છે. સ્પર્ધાત્મક ભાવે ઉદ્યોગના શ્રેષ્ઠ ટ્રેક્ટર જોવા આજે જ અમારા શોરૂમની મુલાકાત લો.",
    stats: [
      { icon: Shield, label: "જૂના ટ્રેક્ટર ડીલર", value: "વિશ્વાસુ" },
      { icon: Users, label: "ખુશ ગ્રાહકો", value: "1000+" },
      { icon: Award, label: "વિશ્વાસના વર્ષો", value: "20+" },
      { icon: MapPin, label: "સ્થાન", value: "APMC માર્કેટ નજીક NH 48, આજવા રોડ, વડોદરા" }
    ]
  }
};

export default function About() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2d5a3d]/5 -skew-x-12 transform origin-top-right" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/About us .jpg"
                alt="Tractor showroom"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/60 to-transparent" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-[200px]">
              <div className="text-4xl font-black text-[#2d5a3d]">20+</div>
              <div className="text-slate-600 text-sm font-medium">
                {language === 'en' ? 'Years Serving Farmers' : 'વર્ષોથી ખેડૂતોની સેવા'}
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-[#2d5a3d]/10 text-[#2d5a3d] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {t.badge}
            </span>

            <h2 className="text-3xl md:text-4xl font-black text-[#1e3a5f] mb-6 leading-tight">
              {t.headline}
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              {t.body}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {t.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-slate-50 rounded-2xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-[#e85d04] mb-3" />
                  <div className="text-2xl font-bold text-[#1e3a5f]">{stat.value}</div>
                  <div className="text-slate-500 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}