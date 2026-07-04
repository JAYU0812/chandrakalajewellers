/**
 * Configurable parameters for Customer Experience concierge operations.
 */
export const CONCIERGE_SETTINGS = {
  whatsappNumber: '+919999999999', // Public brand helpline number
  
  // WhatsApp Message Templates
  templates: {
    productInquiry: (productName: string, sku: string, url: string) => 
      `Hello Chandrakala Jewellers, I would like to inquire about the piece "${productName}" (SKU: ${sku}). View Showroom Link: ${url}`,
    generalInquiry: 'Hello Chandrakala Jewellers, I would like to schedule a private showroom consultation.',
  },

  // Future fuzzy search synonym expansion mapping
  searchSynonyms: {
    'har': ['necklace', 'choker', 'neckpiece', 'pendant'],
    'anguthi': ['ring', 'band', 'wedding ring'],
    'kada': ['bangle', 'bracelet', 'cuff'],
    'gold': ['sona', 'aurum', 'yellow gold'],
    'silver': ['chandi', 'argentum', 'silverware'],
  } as Record<string, string[]>,
};
