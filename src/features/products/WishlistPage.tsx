import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useWishlist } from '../../context/WishlistContext';
import { useProductPrice } from '../../hooks/useProductPrice';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Heart, Trash2, Calendar } from 'lucide-react';

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
];

const WishlistCard: React.FC<{ 
  product: Product; 
  addedAt: string; 
  syncState: string; 
  onRemove: () => void 
}> = ({ product, addedAt, syncState, onRemove }) => {
  const { breakdown } = useProductPrice(product);

  return (
    <GlassCard className="p-4 flex flex-col justify-between min-h-96 border-gold-primary/10 select-none group relative">
      <button
        onClick={onRemove}
        className="absolute top-6 right-6 z-10 p-2 text-obsidian/50 dark:text-pearl/50 hover:text-rose-500 bg-black/10 hover:bg-black/25 rounded-full transition-colors cursor-pointer"
        aria-label="Remove from wishlist"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div 
        className="relative aspect-[4/3] rounded overflow-hidden bg-black/5 border border-gold-primary/5 cursor-pointer"
        onClick={() => window.location.href = `/products/${product.id}`}
      >
        <img 
          src={product.image_url || '/assets/images/bridal_heritage.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-obsidian/75 text-gold-primary text-[8px] font-mono tracking-widest px-2 py-0.5 rounded uppercase">
          {product.purity} {product.metal_type}
        </div>
      </div>

      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            className="font-serif text-base text-obsidian dark:text-pearl group-hover:text-gold-primary transition-colors truncate cursor-pointer"
            onClick={() => window.location.href = `/products/${product.id}`}
          >
            {product.name}
          </h3>
          <p className="text-[9px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-wider mt-1.5">
            Added: {new Date(addedAt).toLocaleDateString()} • {syncState}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gold-primary/5">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40">Estimated Price</p>
              <p className="text-base font-serif font-light text-gold-primary tracking-wide">
                ₹{breakdown.totalPrice.toLocaleString('en-IN')}
              </p>
            </div>
            <span className="text-[10px] text-obsidian/50 dark:text-pearl/50 font-mono">{product.weight_g.toFixed(3)}g</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <LuxuryButton 
              variant="outline" 
              size="sm" 
              className="text-[9px] flex items-center justify-center gap-1"
              onClick={() => window.location.href = `/products/${product.id}`}
            >
              Details
            </LuxuryButton>
            <LuxuryButton 
              variant="gold" 
              size="sm" 
              className="text-[9px] flex items-center justify-center gap-1"
              onClick={() => window.location.href = '/#booking'}
            >
              <Calendar className="w-3 h-3" /> Book View
            </LuxuryButton>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();

  const productIds = wishlist.map(w => w.productId);

  const { data: dbProducts, isLoading } = useQuery({
    queryKey: ['wishlist-products-fetch'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_PRODUCTS.filter(p => productIds.includes(p.id));
      }
    },
    enabled: productIds.length > 0,
  });

  const products = (dbProducts && dbProducts.length > 0
    ? dbProducts
    : MOCK_PRODUCTS.filter(p => productIds.includes(p.id))) as Product[];

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl transition-colors duration-300">
      <Header />
      <div className="h-24" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-sans font-semibold">Your Curated Collection</span>
          <h1 className="font-serif text-3xl md:text-5xl mt-2 font-light">The Showroom Wishlist</h1>
          <div className="w-12 h-[1px] bg-gold-primary mx-auto mt-4" />
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <span className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin inline-block" />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-gold-primary/10 rounded-luxury-md">
            <Heart className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
            <p className="text-sm text-obsidian/60 dark:text-pearl/50">Your luxury wishlist is currently empty.</p>
            <p className="text-xs text-obsidian/40 dark:text-pearl/40 mt-1 mb-6">Click the heart icons on products you admire in our catalog showroom.</p>
            <LuxuryButton variant="gold" size="sm" onClick={() => window.location.href = '/products'}>
              Browse Showroom
            </LuxuryButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const meta = wishlist.find(w => w.productId === product.id);
              return (
                <WishlistCard
                  key={product.id}
                  product={product}
                  addedAt={meta?.addedAt || new Date().toISOString()}
                  syncState={meta?.syncState || 'local'}
                  onRemove={() => toggleWishlist(product.id)}
                />
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
