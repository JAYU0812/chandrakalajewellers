import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Plus, Edit3, Trash2, FolderTree, ShieldCheck } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_category_id: string | null;
  is_active: boolean;
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: 'c1',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Champagne gold necklaces and bridal chokers.',
    parent_category_id: null,
    is_active: true,
  },
  {
    id: 'c2',
    name: 'Chokers',
    slug: 'chokers',
    description: 'Traditional close-fitting bridal chokers.',
    parent_category_id: 'c1',
    is_active: true,
  },
  {
    id: 'c3',
    name: 'Rings',
    slug: 'rings',
    description: 'Imperial cocktail rings and wedding bands.',
    parent_category_id: null,
    is_active: true,
  },
  {
    id: 'c4',
    name: 'Bangles',
    slug: 'bangles',
    description: 'Gold bangles and cuffs.',
    parent_category_id: null,
    is_active: true,
  },
];

export const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dbCategories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn("Using sandbox category fallbacks:");
        return MOCK_CATEGORIES;
      }
    },
  });

  const categories = (dbCategories && dbCategories.length > 0 ? dbCategories : MOCK_CATEGORIES) as Category[];
  const isSandbox = !dbCategories || dbCategories.length === MOCK_CATEGORIES.length;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this category? It will remove its parent links.")) return;
    if (isSandbox) {
      alert("Sandbox Mode: Category deletion bypassed.");
      return;
    }
    deleteMutation.mutate(id);
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return 'None';
    const match = categories.find(c => c.id === parentId);
    return match ? match.name : 'None';
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-primary/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
              <FolderTree className="w-8 h-8 text-gold-primary" /> Catalog Categories
            </h1>
            <p className="text-xs text-obsidian/50 dark:text-pearl/40 mt-1.5 leading-relaxed">
              Organize jewelry items into hierarchical parent-child category groupings.
            </p>
          </div>
          <div>
            <LuxuryButton 
              variant="gold" 
              size="md" 
              icon={Plus}
              onClick={() => navigate('/admin/categories/new')}
            >
              Add Category
            </LuxuryButton>
          </div>
        </div>

        {isSandbox && (
          <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-luxury-sm p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-primary font-bold">Category Sandbox View</h4>
              <p className="text-xs text-obsidian/70 dark:text-pearl/60 mt-1">
                You are viewing local sandbox taxonomies. Category maps and recursions run in client state.
              </p>
            </div>
          </div>
        )}

        {/* Categories Table Grid */}
        <GlassCard className="border-gold-primary/15 overflow-hidden" hoverEffect={false}>
          {isLoading ? (
            <div className="p-12 text-center">
              <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-obsidian text-pearl border-b border-gold-primary/20 text-[10px] uppercase tracking-widest font-semibold">
                    <th className="py-4 px-4">Slug</th>
                    <th className="py-4 px-4">Category Name</th>
                    <th className="py-4 px-4">Parent Category</th>
                    <th className="py-4 px-4">Description</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gold-primary/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs text-gold-primary">/{category.slug}</td>
                      <td className="py-4 px-4 font-serif text-sm font-medium">{category.name}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-gold-primary/75">
                        {getParentName(category.parent_category_id)}
                      </td>
                      <td className="py-4 px-4 text-xs text-obsidian/70 dark:text-pearl/70 max-w-xs truncate">
                        {category.description}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-semibold border ${
                          category.is_active 
                            ? 'bg-emerald/10 text-emerald-400 border-emerald/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex gap-2 justify-end">
                        <button
                          onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                          className="p-1.5 text-gold-primary hover:text-gold-light border border-gold-primary/20 hover:border-gold-primary rounded transition-all cursor-pointer"
                          aria-label="Edit category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 text-obsidian/40 dark:text-pearl/40 hover:text-rose-500 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 rounded transition-all cursor-pointer"
                          aria-label="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
