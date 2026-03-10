import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/pages/Home';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, X, PenLine, Mic, MicOff } from 'lucide-react';
import { fetchReviews, submitReview } from '@/api/reviews';

const content = {
  en: {
    badge: "Testimonials",
    headline: "What Our Customers Say",
    subheadline: "Trusted by thousands of farmers across Gujarat",
    writeReview: "Write a Review",
    formTitle: "Share Your Experience",
    nameLabel: "Your Name",
    locationLabel: "Village / City",
    ratingLabel: "Rating",
    reviewLabel: "Your Review",
    submitButton: "Submit Review",
    submitting: "Submitting...",
    successMessage: "Thank you! Your review has been posted.",
    errorMessage: "Something went wrong. Please try again.",
    close: "Close",
    micTooltip: "Tap to speak",
    micListening: "Listening...",
    micNotSupported: "Voice input is not supported in this browser."
  },
  gu: {
    badge: "પ્રશંસાપત્રો",
    headline: "અમારા ખેડૂતો શું કહે છે",
    subheadline: "સમગ્ર ગુજરાતના હજારો ખેડૂતો દ્વારા વિશ્વાસુ",
    writeReview: "તમારો અભિપ્રાય આપો",
    formTitle: "તમારો અનુભવ શેર કરો",
    nameLabel: "તમારું નામ",
    locationLabel: "ગામ / શહેર",
    ratingLabel: "રેટિંગ",
    reviewLabel: "તમારો અભિપ્રાય",
    submitButton: "સબમિટ કરો",
    submitting: "સબમિટ થઈ રહ્યું છે...",
    successMessage: "આભાર! તમારો અભિપ્રાય પોસ્ટ કરવામાં આવ્યો છે.",
    errorMessage: "કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.",
    close: "બંધ કરો",
    micTooltip: "બોલવા માટે ટેપ કરો",
    micListening: "સાંભળી રહ્યું છે...",
    micNotSupported: "આ બ્રાઉઝરમાં વૉઇસ ઇનપુટ સપોર્ટેડ નથી."
  }
};

const staticTestimonials = {
  en: [
    { name: "Ramesh Patel", location: "Padra", text: "Bought my first Swaraj from Ramkabir Auto. Vimal bhai gave excellent guidance and the best price in the market. Highly recommended!", rating: 5, created_at: "2023-11-15" },
    { name: "Bharat Singh", location: "Dabhoi", text: "The service quality is outstanding. They helped me choose the right John Deere model for my farm size. Very professional team.", rating: 5, created_at: "2023-12-10" },
    { name: "Kishan Desai", location: "Sankheda", text: "I have been buying tractors from Ramkabir Auto for 15 years. Their after-sales service is the best in Vadodara.", rating: 5, created_at: "2024-01-05" },
    { name: "Mukesh Chaudhary", location: "Karjan", text: "Great experience buying Mahindra tractor. Fair pricing and excellent support throughout the process.", rating: 5, created_at: "2024-01-20" },
    { name: "Prakash Solanki", location: "Savli", text: "Vimal bhai understands farmers' needs. He suggested the perfect Sonalika model within my budget. Very satisfied!", rating: 4, created_at: "2024-02-01" },
    { name: "Jayesh Parmar", location: "Chhota Udaipur", text: "Trusted dealership with genuine spare parts. My New Holland tractor runs perfectly thanks to their maintenance support.", rating: 5, created_at: "2024-02-15" }
  ],
  gu: [
    { name: "રમેશ પટેલ", location: "પાદરા", text: "રામકબીર ઓટોમાંથી મારું પહેલું સ્વરાજ ખરીદ્યું. વિમલભાઈએ ઉત્તમ માર્ગદર્શન અને બજારમાં શ્રેષ્ઠ ભાવ આપ્યો. ખૂબ ભલામણ!", rating: 5, created_at: "2023-11-15" },
    { name: "ભરત સિંહ", location: "ડભોઈ", text: "સેવાની ગુણવત્તા ઉત્કૃષ્ટ છે. તેમણે મારા ખેતરના કદ માટે યોગ્ય જ્હોન ડીયર મોડેલ પસંદ કરવામાં મદદ કરી. ખૂબ જ વ્યાવસાયિક ટીમ.", rating: 5, created_at: "2023-12-10" },
    { name: "કિશન દેસાઈ", location: "સાંખેડા", text: "હું 15 વર્ષથી રામકબીર ઓટોમાંથી ટ્રેક્ટર ખરીદું છું. તેમની વેચાણ પછીની સેવા વડોદરામાં શ્રેષ્ઠ છે.", rating: 5, created_at: "2024-01-05" },
    { name: "મુકેશ ચૌધરી", location: "કરજણ", text: "મહિન્દ્રા ટ્રેક્ટર ખરીદવાનો સરસ અનુભવ. વાજબી ભાવ અને સમગ્ર પ્રક્રિયા દરમિયાન ઉત્તમ સપોર્ટ.", rating: 5, created_at: "2024-01-20" },
    { name: "પ્રકાશ સોલંકી", location: "સાવલી", text: "વિમલભાઈ ખેડૂતોની જરૂરિયાતો સમજે છે. તેમણે મારા બજેટમાં સંપૂર્ણ સોનાલીકા મોડેલ સૂચવ્યું. ખૂબ સંતુષ્ટ!", rating: 4, created_at: "2024-02-01" },
    { name: "જયેશ પરમાર", location: "છોટા ઉદેપુર", text: "અસલી સ્પેર પાર્ટ્સ સાથે વિશ્વાસુ ડીલરશીપ. તેમના જાળવણી સપોર્ટને કારણે મારું ન્યૂ હોલેન્ડ ટ્રેક્ટર સંપૂર્ણ ચાલે છે.", rating: 5, created_at: "2024-02-15" }
  ]
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function Testimonials() {
  const { language } = useLanguage();
  const t = content[language];
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', location: '', rating: 5, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [listeningField, setListeningField] = useState(null); // 'name' | 'location' | 'text' | null
  const recognitionRef = React.useRef(null);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListeningField(null);
  };

  const toggleListening = (field) => {
    // If already listening on this field, stop
    if (listeningField === field) {
      stopListening();
      return;
    }
    // If listening on another field, stop first
    if (listeningField) {
      stopListening();
    }

    const SpeechRecognition = /** @type {any} */ (window).SpeechRecognition || /** @type {any} */ (window).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.micNotSupported);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'gu' ? 'gu-IN' : 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognitionRef.current = recognition;
    setListeningField(field);

    recognition.onresult = (event) => {
      // Collect only new results
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' ';
        }
      }
      if (transcript.trim()) {
        setFormState(prev => ({ ...prev, [field]: prev[field] ? prev[field] + ' ' + transcript.trim() : transcript.trim() }));
      }
    };

    recognition.onerror = () => {
      recognitionRef.current = null;
      setListeningField(null);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListeningField(null);
    };

    recognition.start();
  };


  // Load reviews on mount
  useEffect(() => {
    loadReviews();
  }, [language]);

  const loadReviews = async () => {
    try {
      const dbReviews = await fetchReviews();
      // Combine API reviews with static ones
      const combined = [...dbReviews, ...staticTestimonials[language]];
      setReviews(combined);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      // Fallback to static reviews if DB fails
      setReviews(staticTestimonials[language]);
    }
  };

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [reviews.length]); // Re-run when reviews change

  const getVisibleReviews = () => {
    if (reviews.length === 0) return [];
    const visible = [];
    for (let i = 0; i < itemsPerView; i++) {
      visible.push(reviews[(currentIndex + i) % reviews.length]);
    }
    return visible;
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await submitReview(formState);
      setSubmitStatus('success');
      setFormState({ name: '', location: '', rating: 5, text: '' });
      await loadReviews(); // Refresh list to show new review
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#1e3a5f] to-[#152a45] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#e85d04]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#2d5a3d]/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {t.headline}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            {t.subheadline}
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#e85d04] hover:bg-[#d04b00] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/20"
          >
            <PenLine className="w-5 h-5" />
            {t.writeReview}
          </button>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {getVisibleReviews().map((review, index) => (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col h-full"
                >
                  <Quote className="w-10 h-10 text-[#e85d04]/50 mb-4 shrink-0" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                      />
                    ))}
                  </div>

                  <p className="text-white/90 mb-6 leading-relaxed grow">"{review.text}"</p>

                  <div className="flex items-center gap-3 shrink-0 mt-auto">
                    <div className="w-10 h-10 bg-[#e85d04] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{review.name}</div>
                      <div className="text-white/50 text-sm">{review.location}</div>
                      {review.created_at && (
                        <div className="text-white/30 text-xs mt-1">
                          {formatDate(review.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-[#e85d04] w-6' : 'bg-white/30'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                title={t.close}
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-black text-[#1e3a5f] mb-6">{t.formTitle}</h3>

              {submitStatus === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 fill-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-green-700 mb-2">Success!</h4>
                  <p className="text-slate-600">{t.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleCreateReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t.nameLabel}</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 focus:border-[#e85d04] focus:ring-1 focus:ring-[#e85d04] outline-none transition-all"
                        value={formState.name}
                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => toggleListening('name')}
                        title={listeningField === 'name' ? t.micListening : t.micTooltip}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${listeningField === 'name' ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-[#e85d04] hover:bg-orange-50'}`}
                      >
                        {listeningField === 'name' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t.locationLabel}</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 focus:border-[#e85d04] focus:ring-1 focus:ring-[#e85d04] outline-none transition-all"
                        value={formState.location}
                        onChange={e => setFormState({ ...formState, location: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => toggleListening('location')}
                        title={listeningField === 'location' ? t.micListening : t.micTooltip}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${listeningField === 'location' ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-[#e85d04] hover:bg-orange-50'}`}
                      >
                        {listeningField === 'location' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t.ratingLabel}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormState({ ...formState, rating: star })}
                          className={`p-1 transition-transform hover:scale-110 ${formState.rating >= star ? 'text-yellow-400' : 'text-slate-200'
                            }`}
                        >
                          <Star className={`w-8 h-8 ${formState.rating >= star ? 'fill-yellow-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">{t.reviewLabel}</label>
                    <div className="relative">
                      <textarea
                        required
                        rows={4}
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 focus:border-[#e85d04] focus:ring-1 focus:ring-[#e85d04] outline-none transition-all resize-none"
                        value={formState.text}
                        onChange={e => setFormState({ ...formState, text: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => toggleListening('text')}
                        title={listeningField === 'text' ? t.micListening : t.micTooltip}
                        className={`absolute right-2 top-3 p-2 rounded-full transition-all ${listeningField === 'text' ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-[#e85d04] hover:bg-orange-50'}`}
                      >
                        {listeningField === 'text' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center">{t.errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? t.submitting : t.submitButton}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}