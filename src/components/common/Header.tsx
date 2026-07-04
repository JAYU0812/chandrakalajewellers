import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Heart, Scale } from 'lucide-react';
import { LuxuryButton } from '../ui/LuxuryButton';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { wishlist } = useWishlist();
  const { compareList } = useCompare();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Collections', href: '/#collections' },
    { name: 'Catalog', href: '/products' },
    { name: 'Store Locator', href: '/#locator' },
    { name: 'Live Rates', href: '/#rates-section' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 font-sans border-b
        ${isScrolled 
          ? 'bg-obsidian/90 dark:bg-black/95 backdrop-blur-md py-3 shadow-lg border-gold-primary/20' 
          : 'bg-obsidian/45 dark:bg-black/20 backdrop-blur-xs py-5 border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Hamburger Menu (Mobile viewports) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gold-primary hover:text-gold-light focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo - Chandrakala Jewellers */}
        <div className="flex flex-col items-center">
          <a href="/" className="flex flex-col items-center select-none group">
            <span className="font-serif text-xl md:text-2xl tracking-[0.25em] text-gold-primary group-hover:text-gold-light transition-colors">
              CHANDRAKALA
            </span>
            <span className="text-[9px] md:text-[10px] tracking-[0.45em] text-pearl/70 dark:text-pearl/60 uppercase font-sans mt-0.5">
              JEWELLERS
            </span>
          </a>
        </div>

        {/* Navigation Menu Links */}
        <nav role="navigation" aria-label="Main Showroom Menu" className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-xs uppercase tracking-widest text-pearl hover:text-gold-primary transition-colors font-sans py-2 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gold-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </a>
          ))}
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center gap-4">
          
          {/* Wishlist Link icon with indicator count */}
          <a
            href="/wishlist"
            className="text-gold-primary hover:text-gold-light transition-colors p-2 rounded-full hover:bg-white/5 relative"
            aria-label="View showroom wishlist"
          >
            <Heart className="w-4.5 h-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white font-sans text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-obsidian scale-90 animate-bounce">
                {wishlist.length}
              </span>
            )}
          </a>

          {/* Product Compare Link icon with indicator count */}
          <a
            href="/compare"
            className="text-gold-primary hover:text-gold-light transition-colors p-2 rounded-full hover:bg-white/5 relative"
            aria-label="View product compare sheet"
          >
            <Scale className="w-4.5 h-4.5" />
            {compareList.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-gold-primary text-obsidian font-sans text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-obsidian scale-90">
                {compareList.length}
              </span>
            )}
          </a>

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-gold-primary hover:text-gold-light transition-colors p-2 rounded-full hover:bg-white/5 cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Book Appointment CTA */}
          <LuxuryButton
            variant="glass"
            size="sm"
            className="hidden md:inline-flex text-[11px]"
            onClick={() => window.location.href = '/#booking'}
          >
            Book Viewing
          </LuxuryButton>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`md:hidden fixed top-[69px] left-0 w-full h-[calc(100vh-69px)] bg-obsidian/95 dark:bg-black/98 backdrop-blur-lg border-t border-gold-primary/10 transition-all duration-500 ease-out transform ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pb-20">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg uppercase tracking-widest text-pearl hover:text-gold-primary transition-colors font-sans"
            >
              {link.name}
            </a>
          ))}
          <div className="flex gap-4">
            <a href="/wishlist" onClick={() => setIsOpen(false)} className="text-pearl flex items-center gap-2 border border-gold-primary/20 rounded-luxury-sm px-4 py-2.5 text-xs uppercase tracking-wider font-semibold">
              <Heart className="w-4 h-4 text-gold-primary" /> Wishlist ({wishlist.length})
            </a>
            <a href="/compare" onClick={() => setIsOpen(false)} className="text-pearl flex items-center gap-2 border border-gold-primary/20 rounded-luxury-sm px-4 py-2.5 text-xs uppercase tracking-wider font-semibold">
              <Scale className="w-4 h-4 text-gold-primary" /> Compare ({compareList.length})
            </a>
          </div>
          <LuxuryButton
            variant="gold"
            size="md"
            className="mt-4 text-xs"
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/#booking';
            }}
          >
            Book Viewing
          </LuxuryButton>
        </div>
      </div>
    </header>
  );
};
export default Header;
