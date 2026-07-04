import React, { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import { CONCIERGE_SETTINGS } from '../../config/concierge';

interface WhatsAppConciergeProps {
  product?: {
    name: string;
    sku: string;
  };
}

export const WhatsAppConcierge: React.FC<WhatsAppConciergeProps> = memo(({ product }) => {
  const getWhatsAppLink = () => {
    const number = CONCIERGE_SETTINGS.whatsappNumber.replace(/[^0-9]/g, '');
    let messageText = CONCIERGE_SETTINGS.templates.generalInquiry;

    if (product) {
      const currentUrl = window.location.href;
      messageText = CONCIERGE_SETTINGS.templates.productInquiry(
        product.name,
        product.sku,
        currentUrl
      );
    }

    return `https://wa.me/${number}?text=${encodeURIComponent(messageText)}`;
  };

  return (
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      aria-label="Contact customer concierge on WhatsApp"
      id="whatsapp-concierge-trigger"
    >
      <MessageSquare className="w-6 h-6 animate-pulse" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-out text-xs uppercase tracking-widest font-semibold font-sans select-none shrink-0">
        Concierge Help
      </span>
    </a>
  );
});

WhatsAppConcierge.displayName = 'WhatsAppConcierge';
