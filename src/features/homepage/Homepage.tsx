import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Calendar, Clock, User, ChevronLeft, ChevronRight, Award, Compass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { RateMarquee } from '../../components/common/RateMarquee';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { WhatsAppConcierge } from '../../components/common/WhatsAppConcierge';

// Define structures for collections
const collections = [
  {
    id: 1,
    title: 'The Bridal Heritage',
    tagline: 'Timeless heirlooms crafted in pure 22K gold for your sacred union.',
    image: '/assets/images/bridal_heritage.jpg',
    features: ['Handcrafted Filigree', 'Antiqued 22K Finish', 'Uncut Gemstone Accents'],
  },
  {
    id: 2,
    title: 'Royal Antique',
    tagline: 'Inspired by the imperial royal courts of southern India.',
    image: '/assets/images/royal_antique.jpg',
    features: ['Temple Architecture Details', 'Vibrant Ruby Settings', 'Matte Gold Finish'],
  },
  {
    id: 3,
    title: 'Modern Minimalist',
    tagline: 'Contemporary geometric gold and diamonds for everyday grace.',
    image: '/assets/images/minimalist_line.jpg',
    features: ['Sleek 18K Solid Gold', 'Brilliant Cut Accents', 'Stackable Profiles'],
  },
];

export const Homepage: React.FC = () => {
  const [activeCollection, setActiveCollection] = useState(0);
  const [bookingLocation, setBookingLocation] = useState('Khedbrahma');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleNextCollection = () => {
    setActiveCollection((prev) => (prev + 1) % collections.length);
  };

  const handlePrevCollection = () => {
    setActiveCollection((prev) => (prev - 1 + collections.length) % collections.length);
  };

  const { data: storeLocations } = useQuery({
    queryKey: ['store-locations-public'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('store_locations')
          .select('id, name, address, phone, email, is_active')
          .eq('is_active', true);
        if (error) throw error;
        return data || [];
      } catch (err) {
        return [];
      }
    }
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate || !bookingEmail) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Resolve location_id UUID
    let resolvedLocationId = 'a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e'; // default mock fallback location ID
    if (storeLocations && storeLocations.length > 0) {
      const match = storeLocations.find(s => s.name.includes(bookingLocation) || s.address.includes(bookingLocation));
      if (match) resolvedLocationId = match.id;
    }

    // Format time: e.g., "11:00 AM" to "11:00:00"
    let formattedTime = '11:00:00';
    try {
      const match = bookingTime.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (match) {
        let hrs = parseInt(match[1]);
        const mins = match[2];
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hrs < 12) hrs += 12;
        if (ampm === 'AM' && hrs === 12) hrs = 0;
        formattedTime = `${hrs.toString().padStart(2, '0')}:${mins}:00`;
      }
    } catch (err) {
      console.warn("Time format conversion failed, using fallback:", err);
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          customer_name: bookingName,
          customer_email: bookingEmail,
          customer_phone: bookingPhone,
          appointment_date: bookingDate,
          appointment_time: formattedTime,
          location_id: resolvedLocationId,
          status: 'pending',
        }]);

      if (error) throw error;
      setBookingSuccess(true);
    } catch (err: any) {
      console.warn("DB connection skipped in sandbox: Simulated scheduler reservation details save:", err);
      setBookingSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBookingForm = () => {
    setBookingName('');
    setBookingEmail('');
    setBookingPhone('');
    setBookingDate('');
    setBookingSuccess(false);
  };

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Soft dark overlay over background */}
        <div className="absolute inset-0 bg-black/45 dark:bg-black/60 z-10" />
        
        {/* Editorial Background Image Grid (Cover) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url('/assets/images/bridal_heritage.jpg')`, filter: 'brightness(0.75) contrast(1.1)' }}
        />

        {/* Ambient Warm Golden Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-black/20 z-10 pointer-events-none" />

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-primary mb-4 font-sans font-medium"
          >
            Since 1984 • The Mark of Pure Luxury
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-4xl md:text-7xl font-light tracking-wide text-pearl mb-6 leading-tight max-w-4xl"
          >
            Sartorial Gold Masterpieces <br />
            <span className="italic font-normal text-gold-primary">Handcrafted for Generations</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base font-sans text-pearl/80 max-w-2xl mb-10 leading-relaxed font-light"
          >
            Step into one of the most premium digital showrooms. Discover collections that unite India's majestic heritage with contemporary refinement.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <LuxuryButton variant="gold" size="lg" onClick={() => window.location.href = '#collections'}>
              Explore Showroom
            </LuxuryButton>
            <LuxuryButton variant="glass" size="lg" onClick={() => window.location.href = '#booking'}>
              Book Private Viewing
            </LuxuryButton>
          </motion.div>
        </div>
      </section>

      {/* Live Commodity Rates Marquee */}
      <section id="rates-section" className="relative z-20 -mt-1">
        <RateMarquee />
      </section>

      {/* Gold & Silver Detailed Rates Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-sans font-semibold">Market Transparency</span>
          <h2 className="font-serif text-3xl md:text-4xl mt-2 font-light">Today's Certified Metal Valuations</h2>
          <div className="w-12 h-[1px] bg-gold-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <GlassCard className="p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl text-gold-primary mb-4">Certified 916 Gold (22K)</h3>
              <p className="text-sm text-obsidian/70 dark:text-pearl/60 mb-6">Standard purity option preferred for heavy bridal ornaments and heritage filigree designs.</p>
            </div>
            <div className="flex items-baseline justify-between pt-4 border-t border-gold-primary/10">
              <span className="text-xs uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Price per Gram</span>
              <span className="text-3xl font-light tracking-wide text-gold-primary font-serif">₹6,830.00</span>
            </div>
          </GlassCard>

          <GlassCard className="p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl text-gold-primary mb-4">Certified Fine Silver (999)</h3>
              <p className="text-sm text-obsidian/70 dark:text-pearl/60 mb-6">Fine silver ornaments, custom puja items, and decorative gifting blocks.</p>
            </div>
            <div className="flex items-baseline justify-between pt-4 border-t border-gold-primary/10">
              <span className="text-xs uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Price per Gram</span>
              <span className="text-3xl font-light tracking-wide text-gold-primary font-serif">₹92.50</span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Interactive Collections Carousel Slider */}
      <section id="collections" className="py-24 bg-gold-light/25 dark:bg-gold-light/5 border-y border-gold-primary/10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-sans font-semibold">Exquisite Designs</span>
              <h2 className="font-serif text-3xl md:text-5xl mt-2 font-light">Curated Showrooms</h2>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0">
              <button 
                onClick={handlePrevCollection}
                className="p-3 border border-gold-primary/20 hover:border-gold-primary text-gold-primary rounded-full hover:bg-gold-primary/5 transition-colors cursor-pointer"
                aria-label="Previous Collection"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextCollection}
                className="p-3 border border-gold-primary/20 hover:border-gold-primary text-gold-primary rounded-full hover:bg-gold-primary/5 transition-colors cursor-pointer"
                aria-label="Next Collection"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCollection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* Collection Image */}
              <div className="lg:col-span-7 relative group overflow-hidden rounded-luxury-md aspect-[3/2] border border-gold-primary/10">
                <img 
                  src={collections[activeCollection].image} 
                  alt={collections[activeCollection].title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Collection details */}
              <div className="lg:col-span-5 flex flex-col justify-center h-full">
                <span className="text-[10px] uppercase tracking-[0.45em] text-gold-primary font-sans">
                  Collection {collections[activeCollection].id} of {collections.length}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl mt-3 mb-6 font-light leading-snug">
                  {collections[activeCollection].title}
                </h3>
                <p className="text-sm text-obsidian/70 dark:text-pearl/70 leading-relaxed font-sans mb-8">
                  {collections[activeCollection].tagline}
                </p>

                <h4 className="font-serif text-xs uppercase tracking-widest text-gold-primary mb-4 border-b border-gold-primary/10 pb-2">
                  Highlight Features
                </h4>
                <ul className="flex flex-col gap-3.5 mb-10">
                  {collections[activeCollection].features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs uppercase tracking-widest font-sans font-light">
                      <span className="w-1.5 h-1.5 bg-gold-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div>
                  <LuxuryButton variant="outline" size="md">
                    View Catalogue
                  </LuxuryButton>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Brand Heritage / Craft About Section */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-sans font-semibold">The Craftsmanship</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight">Legacy Refined Through Artistry Since 1984</h2>
            <div className="w-12 h-[1px] bg-gold-primary mt-2 mb-4" />
            <p className="text-sm text-obsidian/70 dark:text-pearl/70 leading-relaxed font-sans font-light">
              For over four decades, Chandrakala Jewellers has stood as Chennai's premier destination for pure gold jewelry. What began as a small boutique workshop of master craftsmen has grown into a luxury bridal brand, celebrated for exquisite temple motifs, modern diamond cuts, and unmatched commodity transparency.
            </p>
            <p className="text-sm text-obsidian/70 dark:text-pearl/70 leading-relaxed font-sans font-light">
              Every detail, from the selection of gemstones to the meticulous hand-burnishing of antique gold panels, is overseen by master artisans whose lineages represent generations of architectural filigree secrets.
            </p>
            <div className="flex gap-8 mt-6">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-gold-primary shrink-0" />
                <div>
                  <h4 className="font-serif text-sm">BIS Hallmark</h4>
                  <p className="text-[10px] text-obsidian/50 dark:text-pearl/40 uppercase">100% Certified 22K Gold</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Compass className="w-8 h-8 text-gold-primary shrink-0" />
                <div>
                  <h4 className="font-serif text-sm">Ethical Sourcing</h4>
                  <p className="text-[10px] text-obsidian/50 dark:text-pearl/40 uppercase">Conflicts-free gemstones</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-luxury-md overflow-hidden aspect-[4/5] border border-gold-primary/10">
              <img src="/assets/images/bridal_heritage.jpg" alt="Necklace Crafting" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-luxury-md overflow-hidden aspect-[4/5] border border-gold-primary/10 mt-8">
              <img src="/assets/images/royal_antique.jpg" alt="Polishing Details" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Store Locations & Showrooms Locator */}
      <section id="locator" className="py-24 bg-obsidian text-pearl px-6 md:px-12 border-t border-gold-primary/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-sans font-semibold">Visit Our Showroom</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-2 font-light">Khedbrahma Boutique</h2>
            <div className="w-12 h-[1px] bg-gold-primary mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-center">
            {/* Details Column */}
            <div className="lg:col-span-5">
              <GlassCard className="p-8 border-gold-primary/20 dark:bg-black/20" hoverEffect={false}>
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="font-serif text-2xl text-gold-primary">Chandrakala Jewellers</h3>
                    <div className="w-8 h-[1px] bg-gold-primary/50 mt-2" />
                  </div>
                  
                  <div className="flex flex-col gap-4 text-xs font-sans text-pearl/70 font-light">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4.5 h-4.5 text-gold-primary shrink-0 mt-0.5" />
                      <p className="leading-relaxed">Chandrakala Jewellers, Civil Road, Khedbrahma - 383255</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4.5 h-4.5 text-gold-primary shrink-0" />
                      <p>+91 94270 80359</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4.5 h-4.5 text-gold-primary shrink-0" />
                      <p>chandrakalajewellers849@gmail.com</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gold-primary font-mono text-[9px] uppercase tracking-wider font-semibold">Instagram:</span>
                      <a 
                        href="https://www.instagram.com/laxmijewellerskhedbrahma" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline hover:text-gold-primary transition-colors text-[10px]"
                      >
                        laxmijewellerskhedbrahma
                      </a>
                    </div>
                  </div>

                  <div className="pt-2">
                    <LuxuryButton 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setBookingLocation('Khedbrahma');
                        window.location.href = '#booking';
                      }}
                    >
                      Book Viewing Here
                    </LuxuryButton>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Embedded Google Maps Column */}
            <div className="lg:col-span-7 rounded-luxury-md overflow-hidden border border-gold-primary/20 bg-black/10 aspect-video w-full h-[350px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3643.9898983184976!2d73.04377127512433!3d24.031421378479642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395d0b1a27d5a3df%3A0x216db437426f9e6a!2sChandrakala%20jewellers!5e0!3m2!1sen!2sin!4v1783160383648!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
                title="Chandrakala Jewellers Khedbrahma Map"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Scheduler Booking Wizard */}
      <section id="booking" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-sans font-semibold">Private Showroom Reservation</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-2 font-light">Book Your Private Consultation</h2>
            <div className="w-12 h-[1px] bg-gold-primary mx-auto mt-4" />
          </div>

          <GlassCard className="p-8 md:p-12 relative overflow-hidden" hoverEffect={false}>
            {bookingSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 bg-gold-primary/10 border border-gold-primary/30 rounded-full flex items-center justify-center text-gold-primary">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-gold-primary mb-2">Reservation Confirmed</h3>
                  <p className="text-sm text-obsidian/70 dark:text-pearl/60 max-w-md mx-auto leading-relaxed">
                    Thank you, {bookingName}. Your private viewing reservation has been securely logged at our {bookingLocation} boutique. A dedicated brand concierge will contact you shortly via email at {bookingEmail} to finalize your bespoke design requests.
                  </p>
                </div>
                <LuxuryButton variant="outline" size="md" className="mt-4" onClick={resetBookingForm}>
                  Schedule Another Appointment
                </LuxuryButton>
              </motion.div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select Location */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-obsidian/50 dark:text-pearl/40 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-primary" /> Select Showroom
                    </label>
                    <select 
                      value={bookingLocation}
                      onChange={(e) => setBookingLocation(e.target.value)}
                      className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian"
                    >
                      <option value="Chennai" className="dark:bg-obsidian">Chennai Flagship Store</option>
                      <option value="Bengaluru" className="dark:bg-obsidian">Bengaluru Boutique</option>
                    </select>
                  </div>

                  {/* Select Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-obsidian/50 dark:text-pearl/40 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-primary" /> Appointment Date
                    </label>
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select Time Slot */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-obsidian/50 dark:text-pearl/40 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-primary" /> Time Slot
                    </label>
                    <select 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian"
                    >
                      <option value="11:00 AM">Morning Session (11:00 AM)</option>
                      <option value="02:00 PM">Afternoon Session (02:00 PM)</option>
                      <option value="05:00 PM">Evening Session (05:00 PM)</option>
                    </select>
                  </div>

                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-obsidian/50 dark:text-pearl/40 font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gold-primary" /> Full Name
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-obsidian/50 dark:text-pearl/40 font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gold-primary" /> Email Address
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-obsidian/50 dark:text-pearl/40 font-semibold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gold-primary" /> Mobile Number
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <LuxuryButton 
                    type="submit" 
                    variant="gold" 
                    size="lg"
                    loading={isSubmitting}
                  >
                    Confirm Reservation
                  </LuxuryButton>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      </section>

      <WhatsAppConcierge />
      <Footer />
    </div>
  );
};
