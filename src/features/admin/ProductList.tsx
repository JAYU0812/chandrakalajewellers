import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useProductPrice } from '../../hooks/useProductPrice';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Plus, Edit3, Trash2, FolderGit, ShieldCheck } from 'lucide-react';
import { ENV } from '../../lib/env';

interface Product {
  id: string;
  sku: string;
  name: string;
  metal_type: 'gold' | 'silver' | 'platinum';
  purity: '24k' | '22k' | '18k' | '950';
  weight_g: number;
  labor_charge_per_g: number;
  waste_pct: number;
  gemstone_value: number;
  is_active: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e',
    sku: 'GLD-NK-001',
    name: 'Heritage Kundan Bridal Necklace',
    metal_type: 'gold',
    purity: '22k',
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
    metal_type: 'gold',
    purity: '22k',
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
    metal_type: 'gold',
    purity: '18k',
    weight_g: 24.800,
    labor_charge_per_g: 290.00,
    waste_pct: 5.00,
    gemstone_value: 8500.00,
    is_active: true,
  },
];

// Table Row Subcomponent to safely call hooks for each product
const ProductRow: React.FC<{ 
  product: Product; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void 
}> = ({ product, onEdit, onDelete }) => {
  const { breakdown } = useProductPrice(product);

  return (
    <tr className="border-b border-gold-primary/5 hover:bg-white/5 transition-colors">
      <td className="py-4 px-4 font-mono text-xs text-gold-primary">{product.sku}</td>
      <td className="py-4 px-4 font-serif text-sm font-medium">{product.name}</td>
      <td className="py-4 px-4 text-xs capitalize">{product.purity} {product.metal_type}</td>
      <td className="py-4 px-4 text-xs font-mono">{product.weight_g.toFixed(3)}g</td>
      <td className="py-4 px-4 text-xs font-mono font-semibold text-gold-primary">
        ₹{breakdown.totalPrice.toLocaleString('en-IN')}
      </td>
      <td className="py-4 px-4">
        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-semibold border ${
          product.is_active 
            ? 'bg-emerald/10 text-emerald-400 border-emerald/20' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {product.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-4 px-4 flex gap-2 justify-end">
        <button
          onClick={() => onEdit(product.id)}
          className="p-1.5 text-gold-primary hover:text-gold-light border border-gold-primary/20 hover:border-gold-primary rounded transition-all cursor-pointer"
          aria-label="Edit product"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="p-1.5 text-obsidian/40 dark:text-pearl/40 hover:text-rose-500 border border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 rounded transition-all cursor-pointer"
          aria-label="Delete product"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};

export const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dbProducts, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('sku', { ascending: true });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn("Supabase integration offline. Loading sandbox datasets:");
        return MOCK_PRODUCTS;
      }
    },
  });

  const isSandbox = ENV.VITE_SUPABASE_URL.includes('placeholder-project');
  const products = (isSandbox ? MOCK_PRODUCTS : (dbProducts || [])) as Product[];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action is immutable.")) return;
    
    if (isSandbox) {
      alert("Sandbox Mode: Simulated record deletion success.");
      return;
    }
    
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-6 md:p-12 w-full font-sans">
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-primary/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-light text-obsidian dark:text-pearl flex items-center gap-3">
              <FolderGit className="w-8 h-8 text-gold-primary" /> Product Inventory Catalog
            </h1>
            <p className="text-xs text-obsidian/50 dark:text-pearl/40 leading-relaxed mt-1.5">
              Maintain active jewelry items, configure weights and wastage metrics, and review computed price estimates.
            </p>
          </div>
          <div>
            <LuxuryButton 
              variant="gold" 
              size="md" 
              icon={Plus}
              onClick={() => navigate('/admin/products/new')}
            >
              Add New Product
            </LuxuryButton>
          </div>
        </div>

        {/* Sandbox alert */}
        {isSandbox && (
          <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-luxury-sm p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gold-primary font-bold">Local Sandbox Environment</h4>
              <p className="text-xs text-obsidian/70 dark:text-pearl/60 mt-1">
                You are reviewing cached local datasets. Dynamic calculations and form resolutions operate in local memory for demo verification.
              </p>
            </div>
          </div>
        )}

        {/* Catalog Table */}
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
                    <th className="py-4 px-4">SKU</th>
                    <th className="py-4 px-4">Product Title</th>
                    <th className="py-4 px-4">Metal / Purity</th>
                    <th className="py-4 px-4">Base Weight</th>
                    <th className="py-4 px-4">Calculated Valuation</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <ProductRow 
                      key={product.id} 
                      product={product} 
                      onEdit={(id) => navigate(`/admin/products/${id}/edit`)}
                      onDelete={handleDelete}
                    />
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
