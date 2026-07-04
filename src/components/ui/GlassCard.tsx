import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blurDepth?: 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurDepth = 'md',
  hoverEffect = true,
  className = '',
  ...props
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-[8px]',
    md: 'backdrop-blur-[16px]',
    lg: 'backdrop-blur-[24px]',
  };

  const hoverClasses = hoverEffect 
    ? 'hover:border-gold-primary/30 hover:shadow-luxury hover:-translate-y-1 hover:bg-white/15 dark:hover:bg-black/50' 
    : '';

  return (
    <div
      className={`
        relative overflow-hidden 
        bg-white/10 dark:bg-black/40 
        border border-gold-primary/15 
        rounded-luxury-md 
        shadow-sm 
        transition-all duration-500 ease-out
        ${blurClasses[blurDepth]}
        ${hoverClasses}
        ${className}
      `}
      {...props}
    >
      {/* Subtle internal gold shine gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gold-primary/2 to-transparent pointer-events-none opacity-50" />
      
      {/* Glass continuous shimmer line */}
      <div className="absolute inset-0 glass-shimmer pointer-events-none opacity-30" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
