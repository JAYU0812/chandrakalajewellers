import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Settings, Percent, Phone, ShieldCheck, HelpCircle } from 'lucide-react';

export const GlobalSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rates' | 'contact' | 'seo' | 'ops'>('rates');

  // Local settings states simulating database backups
  const [rateGold24K, setRateGold24K] = useState(7420);
  const [rateGold22K, setRateGold22K] = useState(6830);
  const [rateGold18K, setRateGold18K] = useState(5590);
  const [rateSilver, setRateSilver] = useState(89);

  const [helpline, setHelpline] = useState('+91 94270 80359');
  const [whatsapp, setWhatsapp] = useState('+91 94270 80359');
  const [marqueeSpeed, setMarqueeSpeed] = useState(30);

  const [seoTitle, setSeoTitle] = useState('Chandrakala Jewellers | Heritage Bridal Gold Ornaments');
  const [seoDesc, setSeoDesc] = useState('Certified temple jewellery, uncut Kundan necklaces, and geometric design gold cuffs stackable profiles in Chennai.');

  const [auditLogsActive, setAuditLogsActive] = useState(true);
  const [liveBookingSync, setLiveBookingSync] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Global system settings overrides updated successfully.");
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans text-obsidian dark:text-pearl bg-pearl dark:bg-obsidian transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="border-b border-gold-primary/10 pb-6">
          <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
            <Settings className="w-8 h-8 text-gold-primary animate-spin" style={{ animationDuration: '6s' }} /> Global System Settings
          </h1>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 mt-1.5 leading-relaxed">
            Manage commodity rates indices, concierge numbers, WhatsApp templates, and default metadata configurations.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex border-b border-gold-primary/10 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'rates' 
                ? 'border-gold-primary text-gold-primary' 
                : 'border-transparent text-obsidian/50 dark:text-pearl/40 hover:text-gold-primary'
            }`}
          >
            Precious Metal Rates
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'contact' 
                ? 'border-gold-primary text-gold-primary' 
                : 'border-transparent text-obsidian/50 dark:text-pearl/40 hover:text-gold-primary'
            }`}
          >
            Concierge & Contact
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'seo' 
                ? 'border-gold-primary text-gold-primary' 
                : 'border-transparent text-obsidian/50 dark:text-pearl/40 hover:text-gold-primary'
            }`}
          >
            Branding & SEO
          </button>
          <button
            onClick={() => setActiveTab('ops')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ops' 
                ? 'border-gold-primary text-gold-primary' 
                : 'border-transparent text-obsidian/50 dark:text-pearl/40 hover:text-gold-primary'
            }`}
          >
            Operation Controls
          </button>
        </div>

        {/* Form Workspace */}
        <GlassCard className="p-8 border-gold-primary/20" hoverEffect={false}>
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            
            {/* TAB 1: Precious Metal Rates */}
            {activeTab === 'rates' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs text-gold-primary font-bold uppercase tracking-wider">
                  <Percent className="w-4.5 h-4.5" /> Commodity Indices Override (Price per Gram)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Gold 24K Index (₹)</label>
                    <input
                      type="number"
                      value={rateGold24K}
                      onChange={(e) => setRateGold24K(Number(e.target.value))}
                      className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Gold 22K Index (₹)</label>
                    <input
                      type="number"
                      value={rateGold22K}
                      onChange={(e) => setRateGold22K(Number(e.target.value))}
                      className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Gold 18K Index (₹)</label>
                    <input
                      type="number"
                      value={rateGold18K}
                      onChange={(e) => setRateGold18K(Number(e.target.value))}
                      className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Sterling Silver Index (₹)</label>
                    <input
                      type="number"
                      value={rateSilver}
                      onChange={(e) => setRateSilver(Number(e.target.value))}
                      className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Concierge & Contact */}
            {activeTab === 'contact' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs text-gold-primary font-bold uppercase tracking-wider">
                  <Phone className="w-4.5 h-4.5" /> Customer Helplines & Marquees Settings
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Showroom Voice Helpline</label>
                    <input
                      type="text"
                      value={helpline}
                      onChange={(e) => setHelpline(e.target.value)}
                      className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Concierge WhatsApp Number</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">
                    Live Rates Banner Marquee Scrolling Speed (seconds loop)
                  </label>
                  <input
                    type="number"
                    value={marqueeSpeed}
                    onChange={(e) => setMarqueeSpeed(Number(e.target.value))}
                    className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-24 font-mono"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Branding & SEO */}
            {activeTab === 'seo' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs text-gold-primary font-bold uppercase tracking-wider">
                  <HelpCircle className="w-4.5 h-4.5" /> Branding Details & Search Engines Fallbacks
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Default Document Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-obsidian/50 dark:text-pearl/40">Default Meta Description</label>
                  <textarea
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    rows={3}
                    className="bg-transparent border border-gold-primary/20 rounded p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Operation Controls */}
            {activeTab === 'ops' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs text-gold-primary font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4.5 h-4.5" /> Core Security & Audit Logs Flags
                </div>

                <div className="flex flex-col gap-4 font-sans text-xs text-obsidian/75 dark:text-pearl/70">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={auditLogsActive}
                      onChange={(e) => setAuditLogsActive(e.target.checked)}
                      className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4"
                    />
                    Enable dynamic monitoring audit logs (capturing routing latencies and error logs)
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={liveBookingSync}
                      onChange={(e) => setLiveBookingSync(e.target.checked)}
                      className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4"
                    />
                    Verify and email-notify store consultants on new showroom viewings booking confirmations
                  </label>
                </div>
              </div>
            )}

            {/* Save Buttons */}
            <div className="flex justify-end border-t border-gold-primary/10 pt-6 mt-4">
              <LuxuryButton
                type="submit"
                variant="gold"
                size="sm"
              >
                Save Settings
              </LuxuryButton>
            </div>

          </form>
        </GlassCard>
      </div>
    </div>
  );
};
