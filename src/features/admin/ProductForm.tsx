import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useProductPrice } from '../../hooks/useProductPrice';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { Save, ArrowLeft, Database, Info } from 'lucide-react';

const productSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  name: z.string().min(1, 'Product title is required'),
  description: z.string().min(1, 'Description is required'),
  metal_type: z.enum(['gold', 'silver', 'platinum']),
  purity: z.enum(['24k', '22k', '18k', '950']),
  weight_g: z.number().positive('Weight must be greater than 0'),
  labor_charge_per_g: z.number().min(0, 'Labor charges cannot be negative'),
  waste_pct: z.number().min(0, 'Wastage percentage cannot be negative'),
  gemstone_value: z.number().min(0, 'Gemstone value cannot be negative'),
  is_active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const MOCK_PRODUCTS = [
  {
    id: 'a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e',
    sku: 'GLD-NK-001',
    name: 'Heritage Kundan Bridal Necklace',
    description: 'An heirloom bridal masterpiece featuring hand-pressed Kundan settings and micro-filigree borders.',
    metal_type: 'gold' as const,
    purity: '22k' as const,
    weight_g: 48.500,
    labor_charge_per_g: 450.00,
    waste_pct: 12.00,
    gemstone_value: 25000.00,
    is_active: true,
  },
  {
    id: 'a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e',
    sku: 'GLD-RG-002',
    name: 'Imperial Royal Filigree Ruby Ring',
    description: 'Temple architecture details accenting a central hand-carved natural ruby gemstone.',
    metal_type: 'gold' as const,
    purity: '22k' as const,
    weight_g: 12.200,
    labor_charge_per_g: 380.00,
    waste_pct: 8.50,
    gemstone_value: 15000.00,
    is_active: true,
  },
  {
    id: 'a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e',
    sku: 'GLD-BG-003',
    name: 'Modern Minimalist Geometric Bangles',
    description: 'Sleek modular gold cuffs stackable to form modern geometric outlines.',
    metal_type: 'gold' as const,
    purity: '18k' as const,
    weight_g: 24.800,
    labor_charge_per_g: 290.00,
    waste_pct: 5.00,
    gemstone_value: 8500.00,
    is_active: true,
  },
];

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  const [activeTab, setActiveTab] = useState<'basic' | 'metal' | 'gemstone'>('basic');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      metal_type: 'gold',
      purity: '22k',
      weight_g: 10,
      labor_charge_per_g: 350,
      waste_pct: 8.5,
      gemstone_value: 0,
      is_active: true,
    },
  });

  // Fetch product data in edit mode
  const { data: dbProduct, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      if (!isEditMode) return null;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Offline dev mode: Populating sandbox mock record.");
        return MOCK_PRODUCTS.find(p => p.id === id) || null;
      }
    },
    enabled: isEditMode,
  });

  // Populate form with fetched data
  useEffect(() => {
    if (dbProduct) {
      reset({
        sku: dbProduct.sku,
        name: dbProduct.name,
        description: dbProduct.description,
        metal_type: dbProduct.metal_type,
        purity: dbProduct.purity,
        weight_g: Number(dbProduct.weight_g),
        labor_charge_per_g: Number(dbProduct.labor_charge_per_g),
        waste_pct: Number(dbProduct.waste_pct),
        gemstone_value: Number(dbProduct.gemstone_value),
        is_active: dbProduct.is_active,
      });
    }
  }, [dbProduct, reset]);

  // Watch form fields to drive live price preview calculations
  const watchMetalType = watch('metal_type');
  const watchPurity = watch('purity');
  const watchWeight = watch('weight_g');
  const watchLabor = watch('labor_charge_per_g');
  const watchWastage = watch('waste_pct');
  const watchGemstone = watch('gemstone_value');

  const { breakdown } = useProductPrice({
    metal_type: watchMetalType,
    purity: watchPurity,
    weight_g: Number(watchWeight) || 0,
    labor_charge_per_g: Number(watchLabor) || 0,
    waste_pct: Number(watchWastage) || 0,
    gemstone_value: Number(watchGemstone) || 0,
  });

  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (isEditMode) {
        const { error } = await supabase
          .from('products')
          .update(values)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([values]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    },
    onError: (err: any) => {
      setServerError(err.message || 'Failed to save product information.');
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    // Sandbox dev override
    if (!dbProduct && isEditMode) {
      alert("Sandbox Mode: Simulated product edit save success.");
      navigate('/admin/products');
      return;
    }
    if (!supabase.auth.getUser() && !isEditMode) {
      alert("Sandbox Mode: Simulated product creation success.");
      navigate('/admin/products');
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
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/admin/products')} 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-primary hover:text-gold-light transition-colors font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>

        {/* Form Title */}
        <div>
          <h1 className="font-serif text-3xl font-light">
            {isEditMode ? `Edit Product: ${dbProduct?.name || 'Item'}` : 'Configure New Jewelry SKU'}
          </h1>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 font-sans mt-1.5">
            Configure dynamic weight, waste ratios, gemstone valuations, and metadata descriptions.
          </p>
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Dynamic Form Layout */}
          <div className="lg:col-span-8">
            <GlassCard className="p-6 border-gold-primary/20" hoverEffect={false}>
              
              {/* Form Tabs selectors */}
              <div className="flex border-b border-gold-primary/10 mb-8 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === 'basic'
                      ? 'border-gold-primary text-gold-primary font-semibold'
                      : 'border-transparent text-obsidian/50 dark:text-pearl/50 hover:text-gold-primary'
                  }`}
                >
                  Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('metal')}
                  className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === 'metal'
                      ? 'border-gold-primary text-gold-primary font-semibold'
                      : 'border-transparent text-obsidian/50 dark:text-pearl/50 hover:text-gold-primary'
                  }`}
                >
                  Metal Settings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('gemstone')}
                  className={`py-3 px-4 text-xs font-medium uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === 'gemstone'
                      ? 'border-gold-primary text-gold-primary font-semibold'
                      : 'border-transparent text-obsidian/50 dark:text-pearl/50 hover:text-gold-primary'
                  }`}
                >
                  Gemstones
                </button>
              </div>

              {serverError && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-luxury-sm">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                
                {/* 1. Basic Details Tab */}
                {activeTab === 'basic' && (
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <LuxuryInput
                        {...register('sku')}
                        label="Inventory SKU Code"
                        error={errors.sku?.message}
                        disabled={isSubmitting}
                      />
                      <LuxuryInput
                        {...register('name')}
                        label="Product Title"
                        error={errors.name?.message}
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-6">
                      <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold mb-1">
                        Product Description
                      </label>
                      <textarea
                        {...register('description')}
                        rows={4}
                        disabled={isSubmitting}
                        className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian w-full"
                        placeholder="Write a luxurious, editorial description of this piece's craftsmanship..."
                      />
                      {errors.description?.message && (
                        <p className="text-[10px] text-rose-500 uppercase mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-sans text-obsidian/60 dark:text-pearl/50 mt-2">
                      <input
                        type="checkbox"
                        {...register('is_active')}
                        disabled={isSubmitting}
                        className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4 cursor-pointer"
                      />
                      Active (visible in public catalog listings)
                    </div>
                  </div>
                )}

                {/* 2. Metal Configurations Tab */}
                {activeTab === 'metal' && (
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Metal Type Select */}
                      <div className="flex flex-col gap-2 mb-6">
                        <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">
                          Metal Category
                        </label>
                        <select
                          {...register('metal_type')}
                          onChange={(e) => {
                            setValue('metal_type', e.target.value as any);
                            // Adjust default purity based on selection
                            if (e.target.value === 'silver') setValue('purity', 'fine_silver' as any);
                            else if (e.target.value === 'platinum') setValue('purity', '950' as any);
                            else setValue('purity', '22k' as any);
                          }}
                          disabled={isSubmitting}
                          className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian"
                        >
                          <option value="gold">Gold</option>
                          <option value="silver">Silver</option>
                          <option value="platinum">Platinum</option>
                        </select>
                      </div>

                      {/* Purity Select */}
                      <div className="flex flex-col gap-2 mb-6">
                        <label className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 font-semibold">
                          Purity Index
                        </label>
                        <select
                          {...register('purity')}
                          disabled={isSubmitting}
                          className="bg-transparent border border-gold-primary/20 rounded-luxury-sm p-3 text-sm focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl dark:bg-obsidian"
                        >
                          {watchMetalType === 'gold' && (
                            <>
                              <option value="24k">24K (Pure Gold)</option>
                              <option value="22k">22K (916 Standard)</option>
                              <option value="18k">18K (Decorations)</option>
                            </>
                          )}
                          {watchMetalType === 'silver' && (
                            <option value="fine_silver">Fine Silver (999)</option>
                          )}
                          {watchMetalType === 'platinum' && (
                            <option value="950">950 Platinum</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <LuxuryInput
                        {...register('weight_g', { valueAsNumber: true })}
                        label="Base Weight (grams)"
                        type="number"
                        step="0.001"
                        error={errors.weight_g?.message}
                        disabled={isSubmitting}
                      />
                      <LuxuryInput
                        {...register('labor_charge_per_g', { valueAsNumber: true })}
                        label="Labor (per gram)"
                        type="number"
                        error={errors.labor_charge_per_g?.message}
                        disabled={isSubmitting}
                      />
                      <LuxuryInput
                        {...register('waste_pct', { valueAsNumber: true })}
                        label="Wastage Percentage (%)"
                        type="number"
                        step="0.1"
                        error={errors.waste_pct?.message}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {/* 3. Gemstones Configurations Tab */}
                {activeTab === 'gemstone' && (
                  <div className="flex flex-col gap-2">
                    <LuxuryInput
                      {...register('gemstone_value', { valueAsNumber: true })}
                      label="Itemized Gemstone Valuation (flat rate)"
                      type="number"
                      error={errors.gemstone_value?.message}
                      disabled={isSubmitting}
                    />
                    
                    <div className="bg-white/5 border border-gold-primary/10 rounded p-4 flex gap-3 text-xs text-obsidian/60 dark:text-pearl/60 font-sans leading-relaxed">
                      <Info className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
                      <p>
                        Configure a flat lump-sum cost mapping gemstone valuation additions. Future versions will support multi-gemstone lists integrations (with weights and diamond cut parameters).
                      </p>
                    </div>
                  </div>
                )}

                {/* Form Navigation Action Buttons */}
                <div className="flex justify-end gap-3 border-t border-gold-primary/10 pt-6 mt-6">
                  {activeTab !== 'basic' && (
                    <LuxuryButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (activeTab === 'gemstone') setActiveTab('metal');
                        else if (activeTab === 'metal') setActiveTab('basic');
                      }}
                    >
                      Previous Tab
                    </LuxuryButton>
                  )}
                  
                  {activeTab !== 'gemstone' ? (
                    <LuxuryButton
                      type="button"
                      variant="gold"
                      size="sm"
                      onClick={() => {
                        if (activeTab === 'basic') setActiveTab('metal');
                        else if (activeTab === 'metal') setActiveTab('gemstone');
                      }}
                    >
                      Next Tab
                    </LuxuryButton>
                  ) : (
                    <LuxuryButton
                      type="submit"
                      variant="gold"
                      size="sm"
                      icon={Save}
                      loading={isSubmitting}
                    >
                      Save Configuration
                    </LuxuryButton>
                  )}
                </div>
              </form>
            </GlassCard>
          </div>

          {/* Right Side: Pricing Engine Breakout View */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <GlassCard className="p-6 border-gold-primary/15" hoverEffect={false}>
              <h3 className="font-serif text-base text-gold-primary mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" /> Live Price Calculation
              </h3>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40">Total Estimated Price (incl. 3% GST)</p>
                  <p className="text-3xl font-serif font-light text-gold-primary tracking-wide mt-1">
                    ₹{breakdown.totalPrice.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs border-t border-gold-primary/10 pt-4 font-sans text-obsidian/70 dark:text-pearl/70">
                  <div className="flex justify-between">
                    <span>Base Weight:</span>
                    <span>{(Number(watchWeight) || 0).toFixed(3)}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Rate/g:</span>
                    <span>₹{breakdown.metalRatePerG.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metal Value:</span>
                    <span>₹{breakdown.metalBaseValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wastage Surcharge:</span>
                    <span>₹{breakdown.wastageCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor Cost:</span>
                    <span>₹{breakdown.laborCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gemstone Val:</span>
                    <span>₹{breakdown.gemstoneValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t border-gold-primary/5 pt-2">
                    <span>GST Tax (3%):</span>
                    <span>₹{breakdown.gstTax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </div>
  );
};
