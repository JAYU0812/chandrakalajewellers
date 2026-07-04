import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Plus, Edit3, Trash2, MapPin, ShieldCheck } from 'lucide-react';

interface Showroom {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  opening_hours: Record<string, string>;
  is_active: boolean;
}

const MOCK_SHOWROOMS: Showroom[] = [
  {
    id: 's1',
    name: 'Chennai Flagship Boutique',
    address: '101 Cathedral Road, Alwarpet, Chennai - 600086',
    phone: '+91 44 2811 4040',
    email: 'chennai@chandrakalajewellers.com',
    opening_hours: { Mon_Sat: '10:30 AM - 8:30 PM', Sun: '11:00 AM - 6:00 PM' },
    is_active: true,
  },
  {
    id: 's2',
    name: 'Bengaluru Boutique',
    address: '45 Lavelle Road, Richmond Town, Bengaluru - 560001',
    phone: '+91 80 4122 3030',
    email: 'blr@chandrakalajewellers.com',
    opening_hours: { Mon_Sat: '10:30 AM - 8:30 PM', Sun: 'Closed' },
    is_active: true,
  },
];

export const StoreList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dbShowrooms, isLoading } = useQuery({
    queryKey: ['admin-showrooms'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('store_locations')
          .select('*')
          .order('name', { ascending: true });
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_SHOWROOMS;
      }
    },
  });

  const showrooms = (dbShowrooms && dbShowrooms.length > 0 ? dbShowrooms : MOCK_SHOWROOMS) as Showroom[];
  const isSandbox = !dbShowrooms || dbShowrooms.length === MOCK_SHOWROOMS.length;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('store_locations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-showrooms'] });
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this boutique showroom location?")) return;
    if (isSandbox) {
      alert("Sandbox Mode: Showroom delete bypassed.");
      return;
    }
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans text-obsidian dark:text-pearl bg-pearl dark:bg-obsidian transition-colors duration-300">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-primary/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
              <MapPin className="w-8 h-8 text-gold-primary" /> Boutique Showroom Locations
            </h1>
            <p className="text-xs text-obsidian/50 dark:text-pearl/40 mt-1.5 leading-relaxed">
              Configure boutique showroom details, map staff teams, and holiday dates parameters.
            </p>
          </div>
          <div>
            <LuxuryButton 
              variant="gold" 
              size="md" 
              icon={Plus}
              onClick={() => navigate('/admin/stores/new')}
            >
              Add Showroom
            </LuxuryButton>
          </div>
        </div>

        {isSandbox && (
          <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-luxury-sm p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-primary font-bold">Showrooms Sandbox View</h4>
              <p className="text-xs text-obsidian/70 dark:text-pearl/60 mt-1">
                You are viewing local sandbox showroom details. Changes to operational parameters run in local states.
              </p>
            </div>
          </div>
        )}

        {/* Showrooms Cards Grid */}
        {isLoading ? (
          <div className="p-12 text-center">
            <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showrooms.map((showroom) => (
              <GlassCard key={showroom.id} className="p-6 border-gold-primary/10 flex flex-col justify-between" hoverEffect={true}>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-gold-primary">{showroom.name}</h3>
                    <div className="w-8 h-[1px] bg-gold-primary/30 mt-2" />
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs font-light text-obsidian/70 dark:text-pearl/70">
                    <p><strong>Address:</strong> {showroom.address}</p>
                    <p><strong>Helpline:</strong> {showroom.phone}</p>
                    <p><strong>Email:</strong> {showroom.email}</p>
                    <p><strong>Hours:</strong> Mon-Sat: {showroom.opening_hours.Mon_Sat} | Sun: {showroom.opening_hours.Sun || 'Closed'}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gold-primary/5 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-semibold border ${
                    showroom.is_active 
                      ? 'bg-emerald/10 text-emerald-400 border-emerald/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {showroom.is_active ? 'Active' : 'Inactive'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/stores/${showroom.id}/edit`)}
                      className="p-1.5 text-gold-primary hover:text-gold-light border border-gold-primary/20 hover:border-gold-primary rounded transition-all cursor-pointer"
                      aria-label="Edit showroom"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(showroom.id)}
                      className="p-1.5 text-obsidian/40 dark:text-pearl/40 hover:text-rose-500 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 rounded transition-all cursor-pointer"
                      aria-label="Delete showroom"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
