import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { Layout, Save, Eye, Check } from 'lucide-react';

export const HomepageBuilder: React.FC = () => {
  const [heroTitle, setHeroTitle] = useState('Heritage Redefined');
  const [heroSubtitle, setHeroSubtitle] = useState('Explore the luxury digital jewellery showroom of Chandrakala Jewellers.');
  const [featuredCollectionOrder, setFeaturedCollectionOrder] = useState('1, 2, 3');
  const [showTestimonials, setShowTestimonials] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate saving settings (would save to metadata table in Supabase)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      alert("Homepage configuration published successfully!");
    }, 1000);
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-primary/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
              <Layout className="w-8 h-8 text-gold-primary" /> Visual Homepage Builder
            </h1>
            <p className="text-xs text-obsidian/50 dark:text-pearl/40 mt-1.5 leading-relaxed">
              Configure featured slideshows, custom headings, collection orders, and promotional sections.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Configuration Form */}
          <div className="lg:col-span-8">
            <GlassCard className="p-6 border-gold-primary/20" hoverEffect={false}>
              <form onSubmit={handleSaveConfig} className="flex flex-col gap-6">
                
                {/* Hero Config Section */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-gold-primary font-bold border-b border-gold-primary/5 pb-2">
                    Hero Landing Showcase
                  </h3>

                  <div className="flex flex-col gap-4">
                    <LuxuryInput
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      label="Main Hero Title"
                      required
                    />
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-1">
                        Hero Description Subtitle
                      </label>
                      <textarea
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        rows={3}
                        className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                        placeholder="Write dynamic tagline descriptions..."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Collections showcase settings */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-xs uppercase tracking-widest text-gold-primary font-bold border-b border-gold-primary/5 pb-2">
                    Featured Collection Indexes
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LuxuryInput
                      value={featuredCollectionOrder}
                      onChange={(e) => setFeaturedCollectionOrder(e.target.value)}
                      label="Display Order (Collection IDs)"
                      required
                    />
                    
                    <div className="flex flex-col justify-end gap-2 text-xs text-obsidian/60 dark:text-pearl/50 pb-2">
                      <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">Testimonials Section</label>
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={showTestimonials}
                          onChange={(e) => setShowTestimonials(e.target.checked)}
                          className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4 cursor-pointer"
                        />
                        Display featured client reviews carousel
                      </label>
                    </div>
                  </div>
                </div>

                {success && (
                  <div className="p-3 bg-emerald/10 border border-emerald/20 text-emerald-400 text-xs rounded-luxury-sm flex items-center gap-2">
                    <Check className="w-4 h-4" /> Published adjustments to production landing page.
                  </div>
                )}

                {/* Submits */}
                <div className="flex justify-end gap-3 border-t border-gold-primary/10 pt-6 mt-4">
                  <LuxuryButton
                    type="submit"
                    variant="gold"
                    size="sm"
                    icon={Save}
                    loading={loading}
                  >
                    Publish Changes
                  </LuxuryButton>
                </div>

              </form>
            </GlassCard>
          </div>

          {/* Quick Preview Card */}
          <div className="lg:col-span-4">
            <GlassCard className="p-6 border-gold-primary/15" hoverEffect={false}>
              <h3 className="font-serif text-base text-gold-primary mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" /> Live Layout Preview
              </h3>

              {/* Simulated mini hero display */}
              <div className="bg-obsidian text-pearl rounded p-4 border border-gold-primary/10 aspect-[4/3] flex flex-col justify-between overflow-hidden relative">
                {/* Background effect */}
                <div className="absolute inset-0 bg-radial-gradient from-gold-primary/10 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between border-b border-gold-primary/10 pb-2 z-10">
                  <span className="font-serif text-[8px] tracking-wider text-gold-primary uppercase">CHANDRAKALA</span>
                  <span className="text-[6px] tracking-widest text-pearl/40">GUEST VIEW</span>
                </div>

                <div className="my-auto z-10 text-center flex flex-col gap-1.5">
                  <h4 className="font-serif text-lg text-gold-primary font-light leading-tight">{heroTitle}</h4>
                  <p className="text-[8px] text-pearl/60 line-clamp-3 px-2 font-sans font-light">
                    {heroSubtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gold-primary/5 pt-2 z-10">
                  <span className="text-[6px] text-gold-primary/70 uppercase">Featured collections: [{featuredCollectionOrder}]</span>
                  <span className="text-[6px] text-pearl/40">Reviews: {showTestimonials ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </div>
  );
};
