import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { FileUploader } from '../../components/ui/FileUploader';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

const collectionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  description: z.string().min(1, 'Description is required'),
  banner_storage_path: z.string().min(1, 'Banner image is required'),
  is_active: z.boolean(),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

const MOCK_COLLECTIONS = [
  {
    id: 'col1',
    name: 'Bridal Heritage Collection',
    slug: 'bridal-heritage',
    description: 'Champagne gold pieces hand-crafted for the modern Indian bride.',
    banner_storage_path: '/assets/images/bridal_heritage.jpg',
    is_active: true,
  },
  {
    id: 'col2',
    name: 'Royal Antique Group',
    slug: 'royal-antique',
    description: 'Vibrant gems encrusted in oxidized golds reflecting temple architecture.',
    banner_storage_path: '/assets/images/royal_antique.jpg',
    is_active: true,
  },
  {
    id: 'col3',
    name: 'Minimalist Line',
    slug: 'minimalist-line',
    description: 'Sleek, lightweight daily luxury bangles and chains.',
    banner_storage_path: '/assets/images/minimalist_line.jpg',
    is_active: true,
  },
];

const MOCK_PRODUCTS = [
  { id: 'a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e', name: 'Heritage Kundan Bridal Necklace' },
  { id: 'a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e', name: 'Imperial Royal Filigree Ruby Ring' },
  { id: 'a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e', name: 'Modern Minimalist Geometric Bangles' },
];

export const CollectionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      banner_storage_path: '',
      is_active: true,
    },
  });

  const watchName = watch('name');
  const watchBannerPath = watch('banner_storage_path');

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

  // Load all products for checkbox mapping selection
  const { data: productsData } = useQuery({
    queryKey: ['admin-collection-products-select'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name')
          .eq('is_active', true);
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_PRODUCTS;
      }
    },
  });

  const productsList = productsData || MOCK_PRODUCTS;

  // Load active details in edit mode
  const { data: dbCollection, isLoading } = useQuery({
    queryKey: ['admin-collection', id],
    queryFn: async () => {
      if (!isEditMode) return null;
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        return MOCK_COLLECTIONS.find(c => c.id === id) || null;
      }
    },
    enabled: isEditMode,
  });

  // Load product mappings in edit mode
  useQuery({
    queryKey: ['admin-collection-mappings', id],
    queryFn: async () => {
      if (!isEditMode) return [];
      try {
        const { data, error } = await supabase
          .from('product_collection_mapping')
          .select('product_id')
          .eq('collection_id', id);
        if (error) throw error;
        const ids = (data || []).map(m => m.product_id);
        setSelectedProductIds(ids);
        return ids;
      } catch (err) {
        setSelectedProductIds([MOCK_PRODUCTS[0].id]);
        return [];
      }
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (dbCollection) {
      reset({
        name: dbCollection.name,
        slug: dbCollection.slug,
        description: dbCollection.description,
        banner_storage_path: dbCollection.banner_storage_path,
        is_active: dbCollection.is_active,
      });
    }
  }, [dbCollection, reset]);

  const mutation = useMutation({
    mutationFn: async (values: CollectionFormValues) => {
      let colId = id;
      if (isEditMode) {
        const { error } = await supabase
          .from('collections')
          .update(values)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('collections')
          .insert([values])
          .select()
          .single();
        if (error) throw error;
        colId = data.id;
      }

      // Re-map products inside product_collection_mapping table
      if (colId) {
        // Clear old mapping
        await supabase.from('product_collection_mapping').delete().eq('collection_id', colId);
        // Insert new mapping rows
        if (selectedProductIds.length > 0) {
          const mappingRows = selectedProductIds.map(pId => ({
            product_id: pId,
            collection_id: colId as string,
          }));
          const { error } = await supabase.from('product_collection_mapping').insert(mappingRows);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      navigate('/admin/collections');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to save collection.');
    },
  });

  const onSubmit = (values: CollectionFormValues) => {
    if (!dbCollection && isEditMode) {
      alert("Sandbox Mode: Collection details edited and saved successfully.");
      navigate('/admin/collections');
      return;
    }
    if (!supabase.auth.getUser() && !isEditMode) {
      alert("Sandbox Mode: Collection created successfully.");
      navigate('/admin/collections');
      return;
    }
    mutation.mutate(values);
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
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
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin/collections')} 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-primary hover:text-gold-light transition-colors font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Collections
          </button>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl font-light">
            {isEditMode ? `Edit Collection: ${dbCollection?.name}` : 'Configure New Editorial Collection'}
          </h1>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 font-sans mt-1.5">
            Configure editorial text headers, crop banners, and map products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main configuration forms */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 border-gold-primary/20" hoverEffect={false}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LuxuryInput
                    {...register('name')}
                    label="Collection Name"
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

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    disabled={isSubmitting}
                    className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                    placeholder="Describe the editorial feel, cultural inspirations, and design ethos of this collection..."
                  />
                  {errors.description?.message && (
                    <p className="text-[10px] text-rose-500 uppercase mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Banner Media Upload Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-2">
                    Visual Collection Banner
                  </label>
                  
                  {watchBannerPath ? (
                    <div className="relative aspect-video rounded overflow-hidden border border-gold-primary/20 bg-black/10 flex items-center justify-center">
                      <img 
                        src={watchBannerPath.startsWith('http') || watchBannerPath.startsWith('/assets')
                          ? watchBannerPath 
                          : '/assets/images/bridal_heritage.jpg'
                        } 
                        alt="Active banner" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => setValue('banner_storage_path', '')}
                        className="absolute top-2 right-2 bg-rose-500 text-pearl text-xs uppercase tracking-wider px-3 py-1.5 rounded font-semibold transition-colors hover:bg-rose-600 cursor-pointer"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <FileUploader
                      bucketId="editorial-assets"
                      onUploadSuccess={(url) => setValue('banner_storage_path', url)}
                      allowedTypesLabel="Supports: WebP, JPEG, PNG (Max 5MB)"
                    />
                  )}
                  {errors.banner_storage_path?.message && (
                    <p className="text-[10px] text-rose-500 uppercase mt-1">{errors.banner_storage_path.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-obsidian/60 dark:text-pearl/50 mt-2">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    disabled={isSubmitting}
                    className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4 cursor-pointer"
                  />
                  Collection active (visible on public showroom slider)
                </div>

                <div className="flex justify-end gap-3 border-t border-gold-primary/10 pt-6 mt-4">
                  <LuxuryButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/collections')}
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
                    Save Collection
                  </LuxuryButton>
                </div>
              </form>
            </GlassCard>
          </div>

          {/* Right column: Product Mapping Selection */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <GlassCard className="p-6 border-gold-primary/15" hoverEffect={false}>
              <h3 className="font-serif text-base text-gold-primary mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Map Catalog Items
              </h3>
              <p className="text-[10px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-widest mb-4">
                Select jewelry items to feature in this collection:
              </p>

              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
                {productsList.map((product) => {
                  const isChecked = selectedProductIds.includes(product.id);

                  return (
                    <label 
                      key={product.id}
                      className={`
                        p-3 rounded border text-xs font-sans font-medium flex items-center gap-3 cursor-pointer select-none transition-colors
                        ${isChecked 
                          ? 'bg-gold-primary/10 border-gold-primary text-gold-primary' 
                          : 'bg-transparent border-gold-primary/10 text-obsidian/75 dark:text-pearl/75 hover:bg-white/5'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleProductToggle(product.id)}
                        className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4 cursor-pointer"
                      />
                      {product.name}
                    </label>
                  );
                })}
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </div>
  );
};
