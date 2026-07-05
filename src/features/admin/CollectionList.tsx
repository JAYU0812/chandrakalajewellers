import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Plus, Edit3, Trash2, FolderHeart, ShieldCheck } from 'lucide-react';
import { ENV } from '../../lib/env';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner_storage_path: string;
  is_active: boolean;
}

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col1',
    name: 'The Bridal Heritage',
    slug: 'bridal-heritage',
    description: 'Timeless temple ornaments handcrafted in deep vintage red gold profiles.',
    banner_storage_path: '/assets/images/bridal_heritage.jpg',
    is_active: true,
  },
  {
    id: 'col2',
    name: 'Royal Antique Collection',
    slug: 'royal-antique',
    description: 'South Indian temple motifs and filigree work featuring exquisite ruby trims.',
    banner_storage_path: '/assets/images/royal_antique.jpg',
    is_active: true,
  },
  {
    id: 'col3',
    name: 'Modern Minimalist Line',
    slug: 'modern-minimalist',
    description: 'Sleek modular gold cuffs stackable to form modern geometric outlines.',
    banner_storage_path: '/assets/images/minimalist_line.jpg',
    is_active: true,
  },
];

export const CollectionList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dbCollections, isLoading } = useQuery({
    queryKey: ['admin-collections'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn("Offline dev mode: Loading local mock collections:");
        return MOCK_COLLECTIONS;
      }
    },
  });

  const isSandbox = ENV.VITE_SUPABASE_URL.includes('placeholder-project');
  const collections = (isSandbox ? MOCK_COLLECTIONS : (dbCollections || [])) as Collection[];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('collections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to securely delete this seasonal collection?")) return;
    if (isSandbox) {
      alert("Sandbox Mode: Collection delete bypassed.");
      return;
    }
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-primary/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
              <FolderHeart className="w-8 h-8 text-gold-primary" /> Editorial Collections
            </h1>
            <p className="text-xs text-obsidian/50 dark:text-pearl/40 mt-1.5 leading-relaxed">
              Manage seasonal layouts, collections visual banners, and highlight catalog groupings.
            </p>
          </div>
          <div>
            <LuxuryButton 
              variant="gold" 
              size="md" 
              icon={Plus}
              onClick={() => navigate('/admin/collections/new')}
            >
              New Collection
            </LuxuryButton>
          </div>
        </div>

        {isSandbox && (
          <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-luxury-sm p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-primary font-bold">Collections Sandbox View</h4>
              <p className="text-xs text-obsidian/70 dark:text-pearl/60 mt-1">
                You are viewing local sandbox collections. Changes to banner layouts run in local memory.
              </p>
            </div>
          </div>
        )}

        {/* Collections Visual Grid */}
        {isLoading ? (
          <div className="p-12 text-center">
            <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col) => (
              <GlassCard key={col.id} className="p-4 flex flex-col justify-between border-gold-primary/10" hoverEffect={true}>
                <div>
                  <div className="aspect-[16/9] rounded overflow-hidden bg-black/10 border border-gold-primary/5">
                    <img 
                      src={col.banner_storage_path.startsWith('http') || col.banner_storage_path.startsWith('/assets')
                        ? col.banner_storage_path 
                        : `/assets/images/bridal_heritage.jpg`
                      } 
                      alt={col.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="mt-4">
                    <span className="text-[9px] font-mono tracking-widest text-gold-primary uppercase">/{col.slug}</span>
                    <h3 className="font-serif text-lg text-obsidian dark:text-pearl mt-1">{col.name}</h3>
                    <p className="text-xs text-obsidian/60 dark:text-pearl/60 mt-2 leading-relaxed line-clamp-2">
                      {col.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-gold-primary/5 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-semibold border ${
                    col.is_active 
                      ? 'bg-emerald/10 text-emerald-400 border-emerald/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {col.is_active ? 'Active' : 'Inactive'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/collections/${col.id}/edit`)}
                      className="p-1.5 text-gold-primary hover:text-gold-light border border-gold-primary/20 hover:border-gold-primary rounded transition-all cursor-pointer"
                      aria-label="Edit collection"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id)}
                      className="p-1.5 text-obsidian/40 dark:text-pearl/40 hover:text-rose-500 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 rounded transition-all cursor-pointer"
                      aria-label="Delete collection"
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
