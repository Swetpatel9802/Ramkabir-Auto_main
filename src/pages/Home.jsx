import React from 'react';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Brands from '@/components/landing/Brand';
import Tractors from '@/components/landing/Tractors';
import Testimonials from '@/components/landing/Testimonials';
import Contact from '@/components/landing/Contact';
import WhatsAppButton from '@/components/landing/WhatsAppButton';

import Navbar from '@/components/landing/Navbar';

export default function Home() {

  return (
    <div className="min-h-screen bg-white font-sans">
        {/* Transparent Navbar */}
        <Navbar />

        {/* Main Sections */}
        <section id="home">
          <Hero />
        </section>
        <section id="tractors">
          <Tractors />
        </section>
        <Brands />
        <section id="about">
          <About />
        </section>
        <Testimonials />
        <section id="contact">
          <Contact />
        </section>

        {/* Floating WhatsApp Button */}
        <WhatsAppButton />
      </div>
  );
}
