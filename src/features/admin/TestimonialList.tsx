import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/ui/GlassCard';
import { ShieldCheck, Star, Trash2 } from 'lucide-react';
import { ENV } from '../../lib/env';

interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    customer_name: 'Ananya S.',
    rating: 5,
    review_text: 'The bespoke service we received for my bridal gold jewelry was unmatched. A true luxury consultation.',
    is_featured: true,
    is_active: true,
    created_at: '2026-07-04T12:00:00Z',
  },
  {
    id: 't2',
    customer_name: 'Vikram K.',
    rating: 5,
    review_text: 'Transparent pricing matrices and authentic dynamic gold karat estimations. Excellent showroom experience.',
    is_featured: true,
    is_active: true,
    created_at: '2026-07-04T12:00:00Z',
  },
];

export const TestimonialList: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: dbTestimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_TESTIMONIALS;
      }
    },
  });

  const isSandbox = ENV.VITE_SUPABASE_URL.includes('placeholder-project');
  const testimonials = (isSandbox ? MOCK_TESTIMONIALS : (dbTestimonials || [])) as Testimonial[];

  const toggleMutation = useMutation({
    mutationFn: async ({ id, fields }: { id: string; fields: Partial<Testimonial> }) => {
      const { error } = await supabase.from('testimonials').update(fields).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
  });

  const handleToggle = (id: string, fields: Partial<Testimonial>) => {
    if (isSandbox) {
      alert("Sandbox Mode: Review status toggled successfully.");
      return;
    }
    toggleMutation.mutate({ id, fields });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    if (isSandbox) {
      alert("Sandbox Mode: Testimonial delete bypassed.");
      return;
    }
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans text-obsidian dark:text-pearl bg-pearl dark:bg-obsidian transition-colors duration-300">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="border-b border-gold-primary/10 pb-6">
          <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
            <Star className="w-8 h-8 text-gold-primary" /> Testimonials Manager
          </h1>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 mt-1.5 leading-relaxed">
            Moderate guest review testimonials, manage featured displays on homepage reels, and verify purchasers.
          </p>
        </div>

        {isSandbox && (
          <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-luxury-sm p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-primary font-bold">Testimonials Sandbox View</h4>
              <p className="text-xs text-obsidian/70 dark:text-pearl/60 mt-1">
                Operating in simulation mode. Status updates are saved locally.
              </p>
            </div>
          </div>
        )}

        {/* Listings */}
        {isLoading ? (
          <div className="p-12 text-center">
            <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <GlassCard key={t.id} className="p-6 border-gold-primary/10 flex flex-col justify-between" hoverEffect={false}>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-base font-semibold">{t.customer_name}</h4>
                      <p className="text-[9px] text-obsidian/45 dark:text-pearl/40 font-mono mt-0.5">
                        Logged: {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Stars */}
                    <div className="flex text-gold-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-current' : 'opacity-25'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-obsidian/85 dark:text-pearl/80 italic font-sans font-light leading-relaxed">
                    "{t.review_text}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gold-primary/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    {/* Active/Approved status toggler */}
                    <button
                      onClick={() => handleToggle(t.id, { is_active: !t.is_active })}
                      className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded border transition-all cursor-pointer ${
                        t.is_active
                          ? 'bg-emerald/10 text-emerald-400 border-emerald/25'
                          : 'bg-obsidian/30 text-pearl/50 border-pearl/20 hover:border-pearl/40'
                      }`}
                    >
                      {t.is_active ? 'Approved' : 'Pending Approve'}
                    </button>

                    {/* Featured status toggler */}
                    <button
                      onClick={() => handleToggle(t.id, { is_featured: !t.is_featured })}
                      className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded border transition-all cursor-pointer ${
                        t.is_featured
                          ? 'bg-gold-primary/10 text-gold-primary border-gold-primary/25'
                          : 'bg-obsidian/30 text-pearl/50 border-pearl/20 hover:border-gold-primary/30'
                      }`}
                    >
                      {t.is_featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-obsidian/40 dark:text-pearl/40 hover:text-rose-500 rounded border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 transition-all cursor-pointer"
                    aria-label="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default TestimonialList;
