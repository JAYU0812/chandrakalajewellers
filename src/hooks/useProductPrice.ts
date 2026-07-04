import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface ProductPriceBreakdown {
  metalRatePerG: number;
  metalBaseValue: number;
  wastageCharge: number;
  laborCharge: number;
  gemstoneValue: number;
  gstTax: number;
  totalPrice: number;
}

// Default fallback mock rates if Supabase is offline or in sandbox mode
const MOCK_METAL_RATES = {
  gold_24k: 7450.00,
  gold_22k: 6830.00,
  gold_18k: 5588.00,
  silver_fine_silver: 92.50,
};

/**
 * Custom hook to dynamically calculate price breakouts for any product.
 * Integrates TanStack Query to fetch current metal rates from Supabase.
 */
export const useProductPrice = (product: {
  metal_type: string;
  purity: string;
  weight_g: number;
  labor_charge_per_g: number;
  waste_pct: number;
  gemstone_value: number;
}): { breakdown: ProductPriceBreakdown; isLoading: boolean } => {
  
  // Fetch current active metal rates
  const { data: rates, isLoading } = useQuery({
    queryKey: ['metal-rates'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('metal_rates')
          .select('metal_type, purity, rate_per_g')
          .order('rate_date', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn("Using local fallback metal rates for local review:");
        return [];
      }
    },
    staleTime: 300000, // Cache for 5 minutes
  });

  // Calculate price breakdown
  const getBreakdown = (): ProductPriceBreakdown => {
    const metalType = product.metal_type;
    const purity = product.purity;
    const weight = product.weight_g;
    const laborPerG = product.labor_charge_per_g;
    const wastePct = product.waste_pct;
    const gemstoneVal = Number(product.gemstone_value) || 0;

    // Resolve rate per gram
    let ratePerG = 0;
    if (rates && rates.length > 0) {
      const match = rates.find(
        (r) => r.metal_type === metalType && r.purity === purity
      );
      if (match) {
        ratePerG = Number(match.rate_per_g);
      }
    }

    // Fallback to mock rates if rate wasn't found in DB
    if (ratePerG === 0) {
      const key = `${metalType}_${purity}` as keyof typeof MOCK_METAL_RATES;
      ratePerG = MOCK_METAL_RATES[key] || 0;
    }

    // Mathematical formula allocations
    const metalBaseValue = weight * ratePerG;
    const wastageCharge = metalBaseValue * (wastePct / 100);
    const laborCharge = weight * laborPerG;
    const baseSum = metalBaseValue + wastageCharge + laborCharge + gemstoneVal;
    
    // Standard Indian Gold Jewellry GST (3%)
    const gstTax = baseSum * 0.03;
    const totalPrice = baseSum + gstTax;

    return {
      metalRatePerG: ratePerG,
      metalBaseValue: Math.round(metalBaseValue * 100) / 100,
      wastageCharge: Math.round(wastageCharge * 100) / 100,
      laborCharge: Math.round(laborCharge * 100) / 100,
      gemstoneValue: gemstoneVal,
      gstTax: Math.round(gstTax * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
    };
  };

  return {
    breakdown: getBreakdown(),
    isLoading,
  };
};
