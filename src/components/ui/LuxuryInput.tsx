import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';

interface LuxuryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
}

export const LuxuryInput = forwardRef<HTMLInputElement, LuxuryInputProps>(
  ({ label, error, icon: Icon, rightElement, type = 'text', className = '', ...props }, ref) => {
    return (
      <div className="relative w-full mb-6 font-sans">
        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {Icon && (
            <Icon className="absolute left-3 w-4.5 h-4.5 text-gold-primary/70 pointer-events-none" />
          )}
          
          <input
            ref={ref}
            type={type}
            placeholder=" " // Blank space is required for peer-placeholder-shown selector in CSS
            className={`
              w-full bg-transparent text-sm pb-2 pt-6 
              ${Icon ? 'pl-10' : 'pl-3'} 
              ${rightElement ? 'pr-10' : 'pr-3'} 
              border-b border-obsidian/20 dark:border-pearl/20 
              focus:outline-none focus:border-gold-primary 
              text-obsidian dark:text-pearl 
              peer transition-all duration-300
              ${error ? 'border-rose-500 focus:border-rose-500' : ''}
              ${className}
            `}
            {...props}
          />
          
          <label
            className={`
              absolute left-3 top-4.5 text-[10px] tracking-widest uppercase text-obsidian/40 dark:text-pearl/40
              transition-all duration-300 pointer-events-none origin-[0_0]
              
              peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0
              peer-placeholder-shown:translate-x-0
              ${Icon ? 'peer-placeholder-shown:translate-x-7' : ''}
              
              peer-focus:scale-90
              peer-focus:-translate-y-3.5
              peer-focus:translate-x-0
              ${Icon ? 'peer-focus:-translate-x-7' : ''}
              peer-focus:text-gold-primary
              
              peer-[:not(:placeholder-shown)]:-translate-y-3.5
              peer-[:not(:placeholder-shown)]:scale-90
              peer-[:not(:placeholder-shown)]:translate-x-0
              ${Icon ? 'peer-[:not(:placeholder-shown)]:-translate-x-7' : ''}
              peer-[:not(:placeholder-shown)]:text-gold-primary
            `}
          >
            {label}
          </label>

          {rightElement && (
            <div className="absolute right-3 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {/* Gold focus border transition animating outwards from the center */}
        <span className={`
          absolute bottom-0 left-1/2 w-0 h-[1.5px] 
          transition-all duration-500 ease-out 
          peer-focus:w-full peer-focus:left-0 
          pointer-events-none
          ${error ? 'bg-rose-500' : 'bg-gold-primary'}
        `} />

        {/* Error notification label */}
        {error && (
          <p className="absolute text-[9px] text-rose-500 uppercase tracking-wider mt-1 pl-1 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

LuxuryInput.displayName = 'LuxuryInput';
