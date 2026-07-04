import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useCompare } from '../../context/CompareContext';
import { useProductPrice } from '../../hooks/useProductPrice';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { X, Scale } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  metal_type: 'gold' | 'silver' | 'platinum';
  purity: '24k' | '22k' | '18k' | '950';
  weight_g: number;
  labor_charge_per_g: number;
  waste_pct: number;
  gemstone_value: number;
  is_active: boolean;
  image_url?: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'a1003f2e-1c5c-4c5d-a6e7-9f8a9b0c1d4e',
    sku: 'GLD-NK-001',
    name: 'Heritage Kundan Bridal Necklace',
    description: 'An heirloom bridal masterpiece featuring hand-pressed Kundan settings and micro-filigree borders.',
    metal_type: 'gold',
    purity: '22k',
    weight_g: 48.500,
    labor_charge_per_g: 450.00,
    waste_pct: 12.00,
    gemstone_value: 25000.00,
    is_active: true,
    image_url: '/assets/images/bridal_heritage.jpg',
  },
  {
    id: 'a2003f2e-2c5c-4c5d-a6e7-9f8a9b0c2d4e',
    sku: 'GLD-RG-002',
    name: 'Imperial Royal Filigree Ruby Ring',
    description: 'Temple architecture details accenting a central hand-carved natural ruby gemstone.',
    metal_type: 'gold',
    purity: '22k',
    weight_g: 12.200,
    labor_charge_per_g: 380.00,
    waste_pct: 8.50,
    gemstone_value: 15000.00,
    is_active: true,
    image_url: '/assets/images/royal_antique.jpg',
  },
  {
    id: 'a3003f2e-3c5c-4c5d-a6e7-9f8a9b0c3d4e',
    sku: 'GLD-BG-003',
    name: 'Modern Minimalist Geometric Bangles',
    description: 'Sleek modular gold cuffs stackable to form modern geometric outlines.',
    metal_type: 'gold',
    purity: '18k',
    weight_g: 24.800,
    labor_charge_per_g: 290.00,
    waste_pct: 5.00,
    gemstone_value: 8500.00,
    is_active: true,
    image_url: '/assets/images/minimalist_line.jpg',
  },
];

// Sub-component to fetch pricing breakout per column row
const PriceRowCell: React.FC<{ product: Product }> = ({ product }) => {
  const { breakdown } = useProductPrice(product);
  return <span>₹{breakdown.totalPrice.toLocaleString('en-IN')}</span>;
};

const LaborRowCell: React.FC<{ product: Product }> = ({ product }) => {
  const { breakdown } = useProductPrice(product);
  return <span>₹{breakdown.laborCharge.toLocaleString('en-IN')}</span>;
};

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const { data: dbProducts } = useQuery({
    queryKey: ['compare-products-fetch'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', compareList);
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_PRODUCTS.filter(p => compareList.includes(p.id));
      }
    },
    enabled: compareList.length > 0,
  });

  const products = (dbProducts && dbProducts.length > 0
    ? dbProducts
    : MOCK_PRODUCTS.filter(p => compareList.includes(p.id))) as Product[];

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl transition-colors duration-300">
      <Header />
      <div className="h-24" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gold-primary font-mono font-bold">Jewellery Side-by-Side</span>
            <h1 className="font-serif text-3xl md:text-4xl mt-1.5 font-light">Product Comparison</h1>
          </div>
          {products.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs uppercase tracking-widest text-rose-400 hover:text-rose-500 font-semibold cursor-pointer border-b border-rose-500/10 hover:border-rose-500 pb-0.5"
            >
              Clear Comparison
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-gold-primary/10 rounded-luxury-md">
            <Scale className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
            <p className="text-sm text-obsidian/60 dark:text-pearl/50">Your comparison deck is currently empty.</p>
            <p className="text-xs text-obsidian/40 dark:text-pearl/40 mt-1 mb-6">Select up to four products in the showroom catalog.</p>
            <LuxuryButton variant="gold" size="sm" onClick={() => window.location.href = '/products'}>
              Browse Showroom
            </LuxuryButton>
          </div>
        ) : (
          <div className="overflow-x-auto w-full -mx-6 px-6 md:mx-0 md:px-0">
            <div className="min-w-[800px] border border-gold-primary/10 rounded-luxury-md bg-white/5 dark:bg-black/10 overflow-hidden">
              <table className="w-full border-collapse font-sans text-left">
                <thead>
                  <tr className="border-b border-gold-primary/15">
                    {/* Header Columns: Labels and Product Cards */}
                    <th className="py-6 px-6 w-1/5 bg-black/10 font-serif text-base text-gold-primary">Product Details</th>
                    {products.map((product) => (
                      <th key={product.id} className="py-6 px-6 relative w-1/5 border-l border-gold-primary/10 group">
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute top-2 right-2 p-1 text-obsidian/40 dark:text-pearl/40 hover:text-rose-500 bg-black/10 hover:bg-black/20 rounded-full transition-colors cursor-pointer"
                          aria-label="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="aspect-video rounded overflow-hidden bg-black/5 border border-gold-primary/5 mb-3">
                          <img 
                            src={product.image_url || '/assets/images/bridal_heritage.jpg'} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <h4 className="font-serif text-sm font-semibold truncate group-hover:text-gold-primary transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-[9px] font-mono tracking-widest text-gold-primary/75 mt-1 block uppercase">
                          {product.sku}
                        </span>
                      </th>
                    ))}
                    {/* Empty Slots */}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <th key={i} className="py-6 px-6 w-1/5 border-l border-gold-primary/5 bg-black/5 text-center align-middle">
                        <div className="flex flex-col items-center gap-1.5 text-obsidian/30 dark:text-pearl/30">
                          <Scale className="w-6 h-6" />
                          <span className="text-[10px] uppercase tracking-wider">Empty comparison slot</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs text-obsidian/85 dark:text-pearl/80">
                  <tr className="border-b border-gold-primary/5">
                    <td className="py-4 px-6 font-semibold bg-black/10">Base Metal Category</td>
                    {products.map(p => (
                      <td key={p.id} className="py-4 px-6 border-l border-gold-primary/5 capitalize">{p.metal_type}</td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={i} className="py-4 px-6 border-l border-gold-primary/5 bg-black/5" />
                    ))}
                  </tr>
                  <tr className="border-b border-gold-primary/5">
                    <td className="py-4 px-6 font-semibold bg-black/10">Purity Index</td>
                    {products.map(p => (
                      <td key={p.id} className="py-4 px-6 border-l border-gold-primary/5 uppercase">{p.purity}</td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={i} className="py-4 px-6 border-l border-gold-primary/5 bg-black/5" />
                    ))}
                  </tr>
                  <tr className="border-b border-gold-primary/5">
                    <td className="py-4 px-6 font-semibold bg-black/10">Weight (grams)</td>
                    {products.map(p => (
                      <td key={p.id} className="py-4 px-6 border-l border-gold-primary/5 font-mono">{p.weight_g.toFixed(3)}g</td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={i} className="py-4 px-6 border-l border-gold-primary/5 bg-black/5" />
                    ))}
                  </tr>
                  <tr className="border-b border-gold-primary/5">
                    <td className="py-4 px-6 font-semibold bg-black/10">Labor Craft charges</td>
                    {products.map(p => (
                      <td key={p.id} className="py-4 px-6 border-l border-gold-primary/5 font-mono">
                        <LaborRowCell product={p} />
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={i} className="py-4 px-6 border-l border-gold-primary/5 bg-black/5" />
                    ))}
                  </tr>
                  <tr className="border-b border-gold-primary/5">
                    <td className="py-4 px-6 font-semibold bg-black/10">Gemstones flat value</td>
                    {products.map(p => (
                      <td key={p.id} className="py-4 px-6 border-l border-gold-primary/5 font-mono">
                        ₹{p.gemstone_value.toLocaleString('en-IN')}
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={i} className="py-4 px-6 border-l border-gold-primary/5 bg-black/5" />
                    ))}
                  </tr>
                  <tr className="border-b border-gold-primary/10">
                    <td className="py-4 px-6 font-semibold bg-black/10">Total Valuation (estimation)</td>
                    {products.map(p => (
                      <td key={p.id} className="py-4 px-6 border-l border-gold-primary/5 font-mono font-bold text-gold-primary text-sm">
                        <PriceRowCell product={p} />
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={i} className="py-4 px-6 border-l border-gold-primary/5 bg-black/5" />
                    ))}
                  </tr>
                  <tr>
                    <td className="py-6 px-6 font-semibold bg-black/10">Action triggers</td>
                    {products.map(p => (
                      <td key={p.id} className="py-6 px-6 border-l border-gold-primary/5 text-center">
                        <LuxuryButton
                          variant="gold"
                          size="sm"
                          className="w-full text-[10px]"
                          onClick={() => window.location.href = `/products/${p.id}`}
                        >
                          Showroom PDP
                        </LuxuryButton>
                      </td>
                    ))}
                    {Array.from({ length: 4 - products.length }).map((_, i) => (
                      <td key={i} className="py-6 px-6 border-l border-gold-primary/5 bg-black/5" />
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
