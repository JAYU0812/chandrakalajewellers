import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-obsidian text-pearl border-t border-gold-primary/20 pt-16 pb-8 px-6 md:px-12 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Column 1: Brand Intro */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-[0.25em] text-gold-primary uppercase">
              CHANDRAKALA
            </span>
            <span className="text-[8px] tracking-[0.45em] text-pearl/50 uppercase mt-0.5">
              JEWELLERS
            </span>
          </div>
          <p className="text-xs text-pearl/60 leading-relaxed font-sans mt-2">
            Crafting luxury bridal wear and premium heirloom gold ornaments since 1984. A testament to pure craftsmanship and timeless design.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-gold-primary hover:text-gold-light transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="#" className="text-gold-primary hover:text-gold-light transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h3v-9h2.72l.4-3H12V6.65c0-.9.24-1.3 1.17-1.3H15V2h-2.54C10.15 2 9 3.5 9 5.88V8z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h4 className="font-serif text-sm tracking-wider uppercase text-gold-primary mb-6">Collections</h4>
          <div className="flex flex-col gap-3">
            <a href="#collections" className="text-xs text-pearl/60 hover:text-gold-primary transition-colors">The Bridal Heritage</a>
            <a href="#collections" className="text-xs text-pearl/60 hover:text-gold-primary transition-colors">Royal Antique Collection</a>
            <a href="#collections" className="text-xs text-pearl/60 hover:text-gold-primary transition-colors">Modern Minimalist Line</a>
            <a href="#collections" className="text-xs text-pearl/60 hover:text-gold-primary transition-colors">Exclusive Diamond Sets</a>
          </div>
        </div>

        {/* Column 3: Customer Care */}
        <div>
          <h4 className="font-serif text-sm tracking-wider uppercase text-gold-primary mb-6">Customer Care</h4>
          <div className="flex flex-col gap-3">
            <a href="#booking" className="text-xs text-pearl/60 hover:text-gold-primary transition-colors">Book Private Viewing</a>
            <a href="#about" className="text-xs text-pearl/60 hover:text-gold-primary transition-colors">Heritage & Craftsmanship</a>
            <a href="#locator" className="text-xs text-pearl/60 hover:text-gold-primary transition-colors">Find a Showroom</a>
            <a href="#" className="text-xs text-pearl/60 hover:text-gold-primary transition-colors">Frequently Asked Questions</a>
          </div>
        </div>

        {/* Column 4: Location Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-serif text-sm tracking-wider uppercase text-gold-primary mb-6">Flagship Store</h4>
          <div className="flex items-start gap-3 text-xs text-pearl/60">
            <MapPin className="w-4 h-4 text-gold-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">101 Cathedral Road, Alwarpet, Chennai, Tamil Nadu - 600086</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-pearl/60">
            <Phone className="w-4 h-4 text-gold-primary shrink-0" />
            <p>+91 44 2811 4040</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-pearl/60">
            <Mail className="w-4 h-4 text-gold-primary shrink-0" />
            <p>concierge@chandrakalajewellers.com</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-pearl/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-pearl/40 uppercase tracking-widest">
          &copy; {currentYear} Chandrakala Jewellers. All Rights Reserved. Codename: Project AURUM.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[10px] text-pearl/40 hover:text-gold-primary transition-colors uppercase tracking-widest">Privacy Policy</a>
          <a href="#" className="text-[10px] text-pearl/40 hover:text-gold-primary transition-colors uppercase tracking-widest">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
