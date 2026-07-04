import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useProductPrice } from '../../hooks/useProductPrice';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';
import { useWishlist } from '../../context/WishlistContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { WhatsAppConcierge } from '../../components/common/WhatsAppConcierge';
import { ChevronRight, Heart, Share2, Compass, Award, Clock } from 'lucide-react';

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

// Mini Simple Card for reels
const ReelCard: React.FC<{ product: Product }> = ({ product }) => {
  const { breakdown } = useProductPrice(product);

  return (
    <GlassCard 
      className="p-3 w-64 shrink-0 border-gold-primary/10 select-none group cursor-pointer hover:border-gold-primary/30 transition-all duration-300"
      onClick={() => window.location.href = `/products/${product.id}`}
    >
      <div className="aspect-[4/3] rounded overflow-hidden bg-black/5 border border-gold-primary/5">
        <img src={product.image_url || '/assets/images/bridal_heritage.jpg'} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="mt-3">
        <h4 className="font-serif text-sm font-medium truncate group-hover:text-gold-primary transition-colors">{product.name}</h4>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gold-primary/5">
          <span className="text-[10px] font-mono text-gold-primary font-semibold">₹{breakdown.totalPrice.toLocaleString('en-IN')}</span>
          <span className="text-[8px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-widest">{product.weight_g.toFixed(2)}g</span>
        </div>
      </div>
    </GlassCard>
  );
};

export const ProductDetailPublic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [priceBreakoutOpen, setPriceBreakoutOpen] = useState(true);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { recentlyViewedIds, addRecentlyViewed } = useRecentlyViewed();

  // Fetch product from Supabase
  const { data: dbProduct, isLoading } = useQuery({
    queryKey: ['product-details', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data as Product;
      } catch (err) {
        return MOCK_PRODUCTS.find(p => p.id === id) || null;
      }
    },
  });

  // Fetch all active products to calculate relations/history objects
  const { data: allProductsData } = useQuery({
    queryKey: ['showroom-all-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('is_active', true);
        if (error) throw error;
        return data || [];
      } catch (err) {
        return MOCK_PRODUCTS;
      }
    },
  });

  const productsList = allProductsData && allProductsData.length > 0 ? allProductsData as Product[] : MOCK_PRODUCTS;
  const product = dbProduct || MOCK_PRODUCTS.find(p => p.id === id);

  // Track browsed history matching request
  useEffect(() => {
    if (product?.id) {
      addRecentlyViewed(product.id);
    }
  }, [product?.id, addRecentlyViewed]);

  // Pricing calculations
  const { breakdown } = useProductPrice(
    product || {
      metal_type: 'gold',
      purity: '22k',
      weight_g: 10,
      labor_charge_per_g: 350,
      waste_pct: 8.5,
      gemstone_value: 0,
    }
  );

  // Related products prioritized by similarity metrics matching request
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return productsList
      .filter(p => p.id !== product.id)
      .map(p => {
        let score = 0;
        if (p.metal_type === product.metal_type) score += 3;
        if (p.purity === product.purity) score += 1;
        
        const weightDiff = Math.abs(p.weight_g - product.weight_g);
        if (weightDiff < 15) score += 2;

        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.product)
      .slice(0, 4);
  }, [product, productsList]);

  // Load recently viewed objects from cached IDs
  const recentlyViewedProducts = useMemo(() => {
    if (!product) return [];
    return recentlyViewedIds
      .filter(viewedId => viewedId !== product.id)
      .map(viewedId => productsList.find(p => p.id === viewedId))
      .filter((p): p is Product => !!p);
  }, [recentlyViewedIds, product, productsList]);

  const handleShareClick = async () => {
    if (!product) return;
    const shareDetails = {
      title: product.name,
      text: `Review the heirloom "${product.name}" in the digital showroom.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareDetails);
      } catch (err) {
        console.warn('Native sharing dismissed');
      }
    } else {
      // Fallback copy-to-clipboard URL
      navigator.clipboard.writeText(window.location.href);
      alert("Showroom sharing URL copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center">
        <span className="w-8 h-8 border-3 border-gold-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-obsidian flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-3xl mb-4">Product Not Found</h1>
        <LuxuryButton variant="gold" size="sm" onClick={() => navigate('/products')}>
          Return to Catalog
        </LuxuryButton>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl transition-colors duration-300 relative">
      <Header />
      <div className="h-24" />

      {/* Breadcrumb Menu */}
      <nav className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian/40 dark:text-pearl/40">
        <a href="/" className="hover:text-gold-primary transition-colors">Showroom</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <a href="/products" className="hover:text-gold-primary transition-colors">Catalog</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gold-primary truncate">{product.name}</span>
      </nav>

      {/* Main product display workspace */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Deck */}
        <div className="lg:col-span-6 relative aspect-square rounded-luxury-md overflow-hidden bg-black/5 border border-gold-primary/10">
          <img 
            src={product.image_url || '/assets/images/bridal_heritage.jpg'} 
            alt={product.name} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 cursor-zoom-in"
          />
          <div className="absolute top-4 left-4 bg-obsidian/85 text-gold-primary text-[10px] font-mono tracking-widest px-3 py-1 rounded uppercase">
            BIS Hallmarked {product.purity.toUpperCase()} {product.metal_type.toUpperCase()}
          </div>
        </div>

        {/* Right Column: Descriptions & Valuations */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] uppercase tracking-widest text-gold-primary font-mono">{product.sku}</span>
              
              <div className="flex gap-2">
                {/* Share Button Trigger */}
                <button
                  onClick={handleShareClick}
                  className="p-2 text-gold-primary hover:text-gold-light border border-gold-primary/20 hover:border-gold-primary rounded-full transition-colors cursor-pointer"
                  aria-label="Share catalog link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-light mt-1.5 leading-tight">{product.name}</h1>
            <p className="text-sm font-serif italic text-gold-primary mt-2">Certified Heirloom Jewellery Group</p>
          </div>

          <div className="border-t border-b border-gold-primary/10 py-6">
            <p className="text-sm text-obsidian/70 dark:text-pearl/70 leading-relaxed font-sans font-light">
              {product.description}
            </p>
          </div>

          {/* Pricing breakout details accordion wrapper */}
          <GlassCard className="border-gold-primary/20" hoverEffect={false}>
            <button
              onClick={() => setPriceBreakoutOpen(!priceBreakoutOpen)}
              className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest text-obsidian/40 dark:text-pearl/40">Dynamic Estimation Valuation</p>
                <p className="text-3xl font-serif font-light text-gold-primary tracking-wide mt-1">
                  ₹{breakdown.totalPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-gold-primary text-xs uppercase tracking-widest underline font-semibold">
                {priceBreakoutOpen ? 'Hide Math' : 'Breakdown'}
              </span>
            </button>

            {priceBreakoutOpen && (
              <div className="px-5 pb-5 border-t border-gold-primary/5 pt-4 space-y-3.5 text-xs font-sans font-light text-obsidian/70 dark:text-pearl/70">
                <div className="flex justify-between">
                  <span>Metal Weight (grams)</span>
                  <span className="font-semibold">{product.weight_g.toFixed(3)}g</span>
                </div>
                <div className="flex justify-between">
                  <span>Metal Rate (per gram)</span>
                  <span className="font-semibold">₹{breakdown.metalRatePerG.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-b border-gold-primary/5 pb-2">
                  <span>Metal Base Value</span>
                  <span className="font-semibold text-obsidian dark:text-pearl">₹{breakdown.metalBaseValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wastage/Making Surcharge ({product.waste_pct}%)</span>
                  <span className="font-semibold">₹{breakdown.wastageCharge.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor/Craftsmanship Charge</span>
                  <span className="font-semibold">₹{breakdown.laborCharge.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gemstone Valuation</span>
                  <span className="font-semibold">₹{breakdown.gemstoneValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gold-primary/10">
                  <span>GST Tax (3%)</span>
                  <span className="font-semibold">₹{breakdown.gstTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-double border-gold-primary/20 text-sm font-serif font-medium text-gold-primary">
                  <span>Total Estimated Price</span>
                  <span className="tracking-wide">₹{breakdown.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <LuxuryButton 
              variant="gold" 
              size="lg" 
              className="flex-1 text-xs"
              onClick={() => window.location.href = '/#booking'}
            >
              Book Showroom Viewing
            </LuxuryButton>
            <LuxuryButton 
              variant={wishlisted ? 'gold' : 'glass'} 
              size="lg"
              className="text-xs shrink-0 flex items-center justify-center"
              onClick={() => toggleWishlist(product.id, 'product_pdp')}
            >
              <Heart className={`w-4 h-4 mr-2 ${wishlisted ? 'fill-current' : ''}`} /> 
              {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </LuxuryButton>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold-primary/10 mt-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Award className="w-5 h-5 text-gold-primary" />
              <span className="text-[9px] uppercase tracking-wider text-obsidian/50 dark:text-pearl/40">Hallmarked Purity</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Compass className="w-5 h-5 text-gold-primary" />
              <span className="text-[9px] uppercase tracking-wider text-obsidian/50 dark:text-pearl/40">Ethical Diamonds</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Share2 className="w-5 h-5 text-gold-primary" />
              <span className="text-[9px] uppercase tracking-wider text-obsidian/50 dark:text-pearl/40">Secure Shipping</span>
            </div>
          </div>

        </div>

      </section>

      {/* 2. RELATED PRODUCTS REEL matching prioritizations */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-gold-primary/5">
          <div className="mb-8">
            <span className="text-[9px] uppercase tracking-widest text-gold-primary font-mono font-bold">Matching Inspirations</span>
            <h3 className="font-serif text-2xl font-light mt-1 text-obsidian dark:text-pearl">Related Ornaments</h3>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
            {relatedProducts.map(p => (
              <ReelCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 3. RECENTLY VIEWED REEL */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-t border-gold-primary/5">
          <div className="mb-8 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-primary" />
            <div>
              <span className="text-[9px] uppercase tracking-widest text-gold-primary font-mono font-bold">Your Browsing History</span>
              <h3 className="font-serif text-2xl font-light mt-0.5 text-obsidian dark:text-pearl">Recently Viewed</h3>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
            {recentlyViewedProducts.map(p => (
              <ReelCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp Concierge floating button (passing product details for template prefill) */}
      <WhatsAppConcierge product={{ name: product.name, sku: product.sku }} />

      <Footer />
    </div>
  );
};
