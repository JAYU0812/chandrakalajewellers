import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { ArrowLeft } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  description: z.string().min(1, 'Description is required'),
  parent_category_id: z.string().nullable(),
  is_active: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const MOCK_CATEGORIES = [
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

export const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      parent_category_id: null,
      is_active: true,
    },
  });

  const watchName = watch('name');

  // Auto slug generation
  useEffect(() => {
    if (!isEditMode && watchName) {
      const generatedSlug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setValue('slug', generatedSlug);
    }
  }, [watchName, isEditMode, setValue]);

  // Load all categories for parent selection dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories-select'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true);
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_CATEGORIES;
      }
    },
  });

  const parentsList = (categoriesData || []).filter(c => c.id !== id);

  // Load active details in edit mode
  const { data: dbCategory, isLoading } = useQuery({
    queryKey: ['admin-category', id],
    queryFn: async () => {
      if (!isEditMode) return null;
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        return MOCK_CATEGORIES.find(c => c.id === id) || null;
      }
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (dbCategory) {
      reset({
        name: dbCategory.name,
        slug: dbCategory.slug,
        description: dbCategory.description,
        parent_category_id: dbCategory.parent_category_id,
        is_active: dbCategory.is_active,
      });
    }
  }, [dbCategory, reset]);

  const mutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      if (isEditMode) {
        const { error } = await supabase
          .from('categories')
          .update(values)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([values]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      navigate('/admin/categories');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to save category.');
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    if (!dbCategory && isEditMode) {
      alert("Sandbox Mode: Simulated category edits saved.");
      navigate('/admin/categories');
      return;
    }
    if (!supabase.auth.getUser() && !isEditMode) {
      alert("Sandbox Mode: Simulated category creation success.");
      navigate('/admin/categories');
      return;
    }
    mutation.mutate(values);
  };

  if (isEditMode && isLoading) {
    return (
      <div className="p-12 text-center">
        <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 w-full font-sans">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin/categories')} 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-primary hover:text-gold-light transition-colors font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Categories
          </button>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl font-light">
            {isEditMode ? `Edit Category: ${dbCategory?.name}` : 'Create Taxonomy Category'}
          </h1>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 font-sans mt-1.5">
            Configure category properties and parent nodes.
          </p>
        </div>

        <GlassCard className="p-6 border-gold-primary/20" hoverEffect={false}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LuxuryInput
                {...register('name')}
                label="Category Name"
                error={errors.name?.message}
                disabled={isSubmitting}
              />
              <LuxuryInput
                {...register('slug')}
                label="URL Slug (lowercase & dashes)"
                error={errors.slug?.message}
                disabled={isSubmitting}
              />
            </div>

            {/* Parent Category Selection */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">
                Parent Category Node (Optional)
              </label>
              <select
                {...register('parent_category_id')}
                disabled={isSubmitting}
                className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                onChange={(e) => {
                  const val = e.target.value === '' ? null : e.target.value;
                  setValue('parent_category_id', val);
                }}
              >
                <option value="">None (Top-Level Category)</option>
                {parentsList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-1">
                Category Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                disabled={isSubmitting}
                className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                placeholder="Briefly describe what this jewelry category showcases..."
              />
              {errors.description?.message && (
                <p className="text-[10px] text-rose-500 uppercase mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2 text-xs text-obsidian/60 dark:text-pearl/50 mt-2">
              <input
                type="checkbox"
                {...register('is_active')}
                disabled={isSubmitting}
                className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4 cursor-pointer"
              />
              Category active (visible in public showroom filters)
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 border-t border-gold-primary/10 pt-6 mt-4">
              <LuxuryButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/categories')}
                disabled={isSubmitting}
              >
                Cancel
              </LuxuryButton>
              <LuxuryButton
                type="submit"
                variant="gold"
                size="sm"
                loading={isSubmitting}
              >
                Save Category
              </LuxuryButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
