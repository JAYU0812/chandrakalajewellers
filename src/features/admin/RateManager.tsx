import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Coins, LineChart, ShieldCheck, TrendingUp, Save } from 'lucide-react';
import { ENV } from '../../lib/env';

interface MetalRate {
  id: string;
  metal_type: 'gold' | 'silver';
  purity: '24k' | '22k' | '18k' | 'fine_silver';
  rate_per_g: number;
  rate_date: string;
}

const MOCK_RATES: MetalRate[] = [
  { id: 'r1', metal_type: 'gold', purity: '24k', rate_per_g: 7450.00, rate_date: '2026-07-04' },
  { id: 'r2', metal_type: 'gold', purity: '22k', rate_per_g: 6830.00, rate_date: '2026-07-04' },
  { id: 'r3', metal_type: 'gold', purity: '18k', rate_per_g: 5588.00, rate_date: '2026-07-04' },
  { id: 'r4', metal_type: 'silver', purity: 'fine_silver', rate_per_g: 92.50, rate_date: '2026-07-04' },
];

export const RateManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedMetal, setSelectedMetal] = useState<'gold' | 'silver'>('gold');
  const [selectedPurity, setSelectedPurity] = useState<'24k' | '22k' | '18k' | 'fine_silver'>('22k');
  const [rateInput, setRateInput] = useState('');
  const [localRates, setLocalRates] = useState<MetalRate[]>(MOCK_RATES);

  // Load latest metal rates
  const { data: dbRates, isLoading } = useQuery({
    queryKey: ['admin-metal-rates'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('metal_rates')
          .select('*')
          .order('rate_date', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn("Using sandbox rate index fallbacks:");
        return MOCK_RATES;
      }
    },
  });

  const isSandbox = ENV.VITE_SUPABASE_URL.includes('placeholder-project');
  const ratesList = isSandbox ? localRates : (dbRates || []) as MetalRate[];

  // Get active rates (latest entry per metal + purity combination)
  const getActiveRate = (metal: string, purity: string) => {
    const match = ratesList.find(r => r.metal_type === metal && r.purity === purity);
    return match ? Number(match.rate_per_g) : 0;
  };

  const rateMutation = useMutation({
    mutationFn: async (newRate: { metal_type: 'gold' | 'silver'; purity: string; rate_per_g: number }) => {
      const { error } = await supabase.from('metal_rates').insert([newRate]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-metal-rates'] });
      queryClient.invalidateQueries({ queryKey: ['metal-rates'] }); // Invalidate product price cache too
      setRateInput('');
      alert("Daily commodity index updated successfully!");
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update rates.');
    },
  });

  const handleUpdateRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rateVal = parseFloat(rateInput);
    if (isNaN(rateVal) || rateVal <= 0) {
      alert("Please enter a valid rate greater than 0.");
      return;
    }

    const payload = {
      metal_type: selectedMetal,
      purity: selectedPurity,
      rate_per_g: rateVal,
      rate_date: new Date().toISOString().split('T')[0],
    };

    if (isSandbox) {
      // Update local sandbox states
      const newRate: MetalRate = {
        id: Math.random().toString(),
        ...payload,
      };
      setLocalRates(prev => [newRate, ...prev.filter(r => !(r.metal_type === selectedMetal && r.purity === selectedPurity))]);
      setRateInput('');
      alert("Sandbox Mode: Daily commodity rate updated in local memory!");
      return;
    }

    rateMutation.mutate(payload);
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-primary/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
              <Coins className="w-8 h-8 text-gold-primary" /> Daily Commodity Rate Manager
            </h1>
            <p className="text-xs text-obsidian/50 dark:text-pearl/40 mt-1.5 leading-relaxed">
              Configure current precious metal prices. Updates automatically recalculate price estimates across the customer catalog.
            </p>
          </div>
        </div>

        {isSandbox && (
          <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-luxury-sm p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-primary font-bold">Daily Rates Sandbox View</h4>
              <p className="text-xs text-obsidian/70 dark:text-pearl/60 mt-1">
                You are viewing local sandbox market rates. Inserting new rates immediately affects local pricing estimates on product cards.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Active Commodity Rate Index Cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="font-serif text-lg text-gold-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Current Active Indices
            </h2>

            {isLoading ? (
              <div className="p-12 text-center">
                <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gold 24K */}
                <GlassCard className="p-6 border-gold-primary/10" hoverEffect={false}>
                  <p className="text-[10px] uppercase tracking-widest text-gold-primary font-mono font-bold">Gold 24K Index</p>
                  <p className="text-3xl font-serif font-light text-obsidian dark:text-pearl mt-2">
                    ₹{getActiveRate('gold', '24k').toLocaleString('en-IN')}<span className="text-xs text-obsidian/40 dark:text-pearl/40">/gram</span>
                  </p>
                  <p className="text-[9px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-widest mt-2">Purity: 99.9% Pure Gold</p>
                </GlassCard>

                {/* Gold 22K */}
                <GlassCard className="p-6 border-gold-primary/10" hoverEffect={false}>
                  <p className="text-[10px] uppercase tracking-widest text-gold-primary font-mono font-bold">Gold 22K (916 Hallmarked)</p>
                  <p className="text-3xl font-serif font-light text-obsidian dark:text-pearl mt-2">
                    ₹{getActiveRate('gold', '22k').toLocaleString('en-IN')}<span className="text-xs text-obsidian/40 dark:text-pearl/40">/gram</span>
                  </p>
                  <p className="text-[9px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-widest mt-2">Purity: Standard Bridal Jewellery</p>
                </GlassCard>

                {/* Gold 18K */}
                <GlassCard className="p-6 border-gold-primary/10" hoverEffect={false}>
                  <p className="text-[10px] uppercase tracking-widest text-gold-primary font-mono font-bold">Gold 18K Index</p>
                  <p className="text-3xl font-serif font-light text-obsidian dark:text-pearl mt-2">
                    ₹{getActiveRate('gold', '18k').toLocaleString('en-IN')}<span className="text-xs text-obsidian/40 dark:text-pearl/40">/gram</span>
                  </p>
                  <p className="text-[9px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-widest mt-2">Purity: Diamond Studded Base</p>
                </GlassCard>

                {/* Silver */}
                <GlassCard className="p-6 border-gold-primary/10" hoverEffect={false}>
                  <p className="text-[10px] uppercase tracking-widest text-gold-primary font-mono font-bold">Silver (999 Fine Silver)</p>
                  <p className="text-3xl font-serif font-light text-obsidian dark:text-pearl mt-2">
                    ₹{getActiveRate('silver', 'fine_silver').toLocaleString('en-IN')}<span className="text-xs text-obsidian/40 dark:text-pearl/40">/gram</span>
                  </p>
                  <p className="text-[9px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-widest mt-2">Purity: Fine Sterling Silver</p>
                </GlassCard>
              </div>
            )}
          </div>

          {/* Right: Fast Update Card */}
          <div className="lg:col-span-4">
            <GlassCard className="p-6 border-gold-primary/20" hoverEffect={false}>
              <h2 className="font-serif text-base text-gold-primary mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5" /> Insert New Override
              </h2>

              <form onSubmit={handleUpdateRate} className="flex flex-col gap-6">
                
                {/* Select Metal type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">Precious Metal</label>
                  <select
                    value={selectedMetal}
                    onChange={(e) => {
                      const val = e.target.value as 'gold' | 'silver';
                      setSelectedMetal(val);
                      if (val === 'silver') setSelectedPurity('fine_silver');
                      else setSelectedPurity('22k');
                    }}
                    className="bg-transparent border border-gold-primary/25 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian"
                  >
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>

                {/* Select purity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">Purity Target</label>
                  <select
                    value={selectedPurity}
                    onChange={(e) => setSelectedPurity(e.target.value as any)}
                    className="bg-transparent border border-gold-primary/25 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian"
                  >
                    {selectedMetal === 'gold' ? (
                      <>
                        <option value="24k">24K Index</option>
                        <option value="22k">22K Standard</option>
                        <option value="18k">18K Studded</option>
                      </>
                    ) : (
                      <option value="fine_silver">Fine Silver</option>
                    )}
                  </select>
                </div>

                {/* Rate input field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">Rate per Gram (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 7450.00"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    className="bg-transparent border border-gold-primary/25 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian"
                    required
                  />
                </div>

                <LuxuryButton
                  type="submit"
                  variant="gold"
                  size="md"
                  icon={Save}
                  loading={rateMutation.isPending}
                >
                  Apply Override
                </LuxuryButton>

              </form>
            </GlassCard>
          </div>

        </div>

      </div>
    </div>
  );
};
