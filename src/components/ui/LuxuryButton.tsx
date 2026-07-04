import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'obsidian' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Styles mapping
  const baseStyles = 'relative overflow-hidden font-sans font-medium uppercase tracking-wider transition-all duration-300 rounded-luxury-sm cursor-pointer inline-flex items-center justify-center gap-2 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantStyles = {
    gold: 'bg-gold-primary text-obsidian hover:bg-gold-dark hover:text-pearl shadow-luxury hover:shadow-none border border-gold-primary',
    obsidian: 'bg-obsidian text-pearl hover:bg-pearl hover:text-obsidian border border-obsidian dark:bg-pearl dark:text-obsidian dark:hover:bg-obsidian dark:hover:text-pearl dark:border-pearl',
    outline: 'bg-transparent text-gold-primary border border-gold-primary hover:bg-gold-primary hover:text-obsidian',
    glass: 'bg-white/10 dark:bg-black/40 text-pearl border border-gold-primary/20 backdrop-blur-luxury hover:border-gold-primary/60 hover:bg-white/20',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Dynamic shimmer reflection line on hover (simulated by hover:before rule) */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      
      {children}
    </button>
  );
};
