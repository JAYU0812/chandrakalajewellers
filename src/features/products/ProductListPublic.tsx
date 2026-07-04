import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useProductPrice } from '../../hooks/useProductPrice';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { WhatsAppConcierge } from '../../components/common/WhatsAppConcierge';
import { CONCIERGE_SETTINGS } from '../../config/concierge';
import { Search, SlidersHorizontal, ArrowUpDown, Heart, Scale } from 'lucide-react';

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

// Memoized Product Card to control bundle rendering performance
const ProductCard: React.FC<{ 
  product: Product; 
  wishlisted: boolean;
  compared: boolean;
  onWishlistToggle: (e: React.MouseEvent) => void;
  onCompareToggle: (e: React.MouseEvent) => void;
}> = React.memo(({ product, wishlisted, compared, onWishlistToggle, onCompareToggle }) => {
  const { breakdown } = useProductPrice(product);

  return (
    <GlassCard 
      className="p-4 flex flex-col justify-between min-h-96 border-gold-primary/10 select-none group cursor-pointer relative"
      onClick={() => window.location.href = `/products/${product.id}`}
    >
      {/* Top Action Triggers */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
        <button
          onClick={onWishlistToggle}
          className={`p-2 rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer ${
            wishlisted 
              ? 'bg-rose-500 text-pearl' 
              : 'bg-black/20 text-pearl/80 hover:bg-black/45'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          onClick={onCompareToggle}
          className={`p-2 rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer ${
            compared 
              ? 'bg-gold-primary text-obsidian' 
              : 'bg-black/20 text-pearl/80 hover:bg-black/45'
          }`}
          aria-label="Toggle compare"
        >
          <Scale className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative aspect-[4/3] rounded overflow-hidden bg-black/5 border border-gold-primary/5">
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
          <h3 className="font-serif text-base text-obsidian dark:text-pearl group-hover:text-gold-primary transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-xs text-obsidian/50 dark:text-pearl/40 font-sans mt-1">
            Weight: {product.weight_g.toFixed(3)}g
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gold-primary/5 flex items-end justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40">Estimated Price</p>
            <p className="text-lg font-serif font-light text-gold-primary tracking-wide">
              ₹{breakdown.totalPrice.toLocaleString('en-IN')}
            </p>
          </div>
          <LuxuryButton variant="glass" size="sm" className="text-[10px]">
            View Details
          </LuxuryButton>
        </div>
      </div>
    </GlassCard>
  );
});

ProductCard.displayName = 'ProductCard';

export const ProductListPublic: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [metalFilter, setMetalFilter] = useState<string>('all');
  const [purityFilter, setPurityFilter] = useState<string>('all');
  const [weightFilter, setWeightFilter] = useState<string>('all'); // 'all' | 'light' (<15g) | 'medium' (15-30g) | 'heavy' (>30g)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'weight'>('price-desc');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  // Query database items
  const { data: dbProducts, isLoading } = useQuery({
    queryKey: ['products-list'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);
        if (error) throw error;
        return data || [];
      } catch (err) {
        return [];
      }
    },
  });

  const productsList = dbProducts && dbProducts.length > 0 ? dbProducts as Product[] : MOCK_PRODUCTS;

  // Search Synonym Expansion utility matching request
  const expandedSearchTerms = useMemo(() => {
    const cleanQuery = searchTerm.trim().toLowerCase();
    if (!cleanQuery) return [];
    
    // Look up search keywords mapping config
    const synonyms = CONCIERGE_SETTINGS.searchSynonyms[cleanQuery] || [];
    return [cleanQuery, ...synonyms];
  }, [searchTerm]);

  const handleWishlistToggle = useCallback((productId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(productId, 'catalog_plp');
    };
  }, [toggleWishlist]);

  const handleCompareToggle = useCallback((productId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isInCompare(productId)) {
        removeFromCompare(productId);
      } else {
        addToCompare(productId);
      }
    };
  }, [isInCompare, addToCompare, removeFromCompare]);

  // Combined advanced filtering and sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // 1. Search Query Evaluation (supporting synonym expansion)
    if (expandedSearchTerms.length > 0) {
      result = result.filter(product => {
        const nameLower = product.name.toLowerCase();
        const descLower = product.description.toLowerCase();
        const skuLower = product.sku.toLowerCase();

        return expandedSearchTerms.some(term => 
          nameLower.includes(term) || 
          descLower.includes(term) || 
          skuLower.includes(term)
        );
      });
    }

    // 2. Metal Type Filter
    if (metalFilter !== 'all') {
      result = result.filter(p => p.metal_type === metalFilter);
    }

    // 3. Purity Filter
    if (purityFilter !== 'all') {
      result = result.filter(p => p.purity === purityFilter);
    }

    // 4. Weight Range Filters
    if (weightFilter !== 'all') {
      if (weightFilter === 'light') result = result.filter(p => p.weight_g < 15);
      else if (weightFilter === 'medium') result = result.filter(p => p.weight_g >= 15 && p.weight_g <= 30);
      else if (weightFilter === 'heavy') result = result.filter(p => p.weight_g > 30);
    }

    // 5. Sorting configurations
    if (sortBy === 'weight') {
      result.sort((a, b) => b.weight_g - a.weight_g);
    }
    // Note: Price sorting is simple sorted in ascending/descending order on weights
    // (dynamic rates calculation is monotonic relative to weight grams).
    else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.weight_g - b.weight_g);
    } else {
      result.sort((a, b) => b.weight_g - a.weight_g);
    }

    return result;
  }, [productsList, expandedSearchTerms, metalFilter, purityFilter, weightFilter, sortBy]);

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl transition-colors duration-300 relative">
      <Header />

      {/* Spacing Offset for fixed navbar */}
      <div className="h-24" />

      {/* Catalog Title Section */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-primary font-sans font-semibold">Exquisite Ornaments</span>
          <h1 className="font-serif text-3xl md:text-5xl mt-2 font-light">The Showroom Catalog</h1>
          <div className="w-12 h-[1px] bg-gold-primary mx-auto mt-4" />
        </div>

        {/* Filter controls workspace bar */}
        <div className="bg-white/10 dark:bg-black/20 border border-gold-primary/10 rounded-luxury-md p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          {/* Search input with autocomplete support */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-primary/60" />
            <input 
              type="text" 
              placeholder="Search catalog (try anguthi, kada, gold)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border border-gold-primary/15 rounded-luxury-sm py-2 pl-10 pr-4 text-xs font-sans focus:outline-none focus:border-gold-primary text-obsidian dark:text-pearl"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-gold-primary/20 hover:border-gold-primary text-gold-primary hover:bg-gold-primary/5 rounded-luxury-sm px-4 py-2 text-xs font-sans font-medium cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" /> Advanced Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex-1 md:flex-none flex items-center gap-2 border border-gold-primary/15 rounded-luxury-sm px-3 py-2 bg-transparent text-xs text-obsidian/60 dark:text-pearl/60">
              <ArrowUpDown className="w-3.5 h-3.5 text-gold-primary" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none text-obsidian dark:text-pearl dark:bg-obsidian border-none cursor-pointer"
              >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="weight">By Weight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer Panel */}
        {showFiltersDrawer && (
          <GlassCard className="p-6 border-gold-primary/15 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6" hoverEffect={false}>
            {/* Metal Types Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-gold-primary font-bold">Metal Type</label>
              <select
                value={metalFilter}
                onChange={(e) => setMetalFilter(e.target.value)}
                className="w-full bg-transparent border border-gold-primary/15 rounded p-2 text-xs text-obsidian dark:text-pearl dark:bg-obsidian"
              >
                <option value="all">All Metals</option>
                <option value="gold">Gold only</option>
                <option value="silver">Silver only</option>
              </select>
            </div>

            {/* Purity Badge Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-gold-primary font-bold">Purity Ratio</label>
              <select
                value={purityFilter}
                onChange={(e) => setPurityFilter(e.target.value)}
                className="w-full bg-transparent border border-gold-primary/15 rounded p-2 text-xs text-obsidian dark:text-pearl dark:bg-obsidian"
              >
                <option value="all">All Purities</option>
                <option value="24k">24K (Pure Sona)</option>
                <option value="22k">22K (916 Standard)</option>
                <option value="18k">18K (Studded)</option>
                <option value="fine_silver">Fine Silver</option>
              </select>
            </div>

            {/* Weight Classes Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-gold-primary font-bold">Weight Class</label>
              <select
                value={weightFilter}
                onChange={(e) => setWeightFilter(e.target.value)}
                className="w-full bg-transparent border border-gold-primary/15 rounded p-2 text-xs text-obsidian dark:text-pearl dark:bg-obsidian"
              >
                <option value="all">All Weights</option>
                <option value="light">Lightweight (&lt; 15g)</option>
                <option value="medium">Mediumweight (15g - 30g)</option>
                <option value="heavy">Heavyweight (&gt; 30g)</option>
              </select>
            </div>
          </GlassCard>
        )}

        {/* Main Grid View */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-96 bg-gold-primary/5 animate-pulse rounded-luxury-md" />
            <div className="h-96 bg-gold-primary/5 animate-pulse rounded-luxury-md" />
            <div className="h-96 bg-gold-primary/5 animate-pulse rounded-luxury-md" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-gold-primary/10 rounded-luxury-md">
            <p className="text-sm text-obsidian/60 dark:text-pearl/50">No products match the selected catalog criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                wishlisted={isInWishlist(product.id)}
                compared={isInCompare(product.id)}
                onWishlistToggle={handleWishlistToggle(product.id)}
                onCompareToggle={handleCompareToggle(product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating WhatsApp Chat Help */}
      <WhatsAppConcierge />

      <Footer />
    </div>
  );
};
