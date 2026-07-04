import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { GlassCard } from '../../components/ui/GlassCard';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setLoading(true);
    
    try {
      const response = await login(data.email, data.password, data.remember);
      if (!response.success && response.error) {
        setServerError(response.error);
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center p-6 transition-colors duration-300">
      {/* Dynamic Background Light Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <span className="font-serif text-xl tracking-[0.25em] text-gold-primary uppercase">
            CHANDRAKALA
          </span>
          <span className="text-[9px] tracking-[0.45em] text-obsidian/60 dark:text-pearl/60 uppercase mt-0.5 font-sans">
            JEWELLERS
          </span>
          <p className="text-[10px] text-gold-primary/70 uppercase tracking-widest mt-2 font-mono">
            Project AURUM Portal
          </p>
        </div>

        <GlassCard className="p-8 border-gold-primary/20 dark:bg-black/30 shadow-luxury" hoverEffect={false}>
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-light text-obsidian dark:text-pearl mb-1">Administrative Gateway</h1>
            <p className="text-xs text-obsidian/50 dark:text-pearl/40 font-sans leading-relaxed">
              Verify your system authorization keys to log into the executive dashboard.
            </p>
          </div>

          {/* Test Hint Alert Banner */}
          <div className="mb-6 bg-gold-light/40 dark:bg-gold-light/5 border border-gold-primary/20 rounded-luxury-sm p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-gold-primary shrink-0 mt-0.5 animate-pulse" />
            <div className="text-[11px] text-gold-primary/90 font-sans leading-normal">
              <strong>Dev Review Credentials:</strong><br />
              User: <span className="underline select-all">admin@chandrakalajewellers.com</span><br />
              Pass: <span className="underline select-all">Password123</span>
            </div>
          </div>

          {/* Global Alert Banner for errors */}
          {serverError && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-luxury-sm p-3.5 flex items-start gap-2.5 text-rose-500 animate-fade-in">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <p className="text-xs leading-normal font-sans">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {/* Email Address */}
            <LuxuryInput
              {...register('email')}
              label="Email Address"
              type="email"
              icon={Mail}
              error={errors.email?.message}
              disabled={loading}
              autoComplete="email"
            />

            {/* Password */}
            <LuxuryInput
              {...register('password')}
              label="Authorization Key"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              error={errors.password?.message}
              disabled={loading}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-obsidian/40 dark:text-pearl/40 hover:text-gold-primary transition-colors cursor-pointer p-1.5 focus:outline-none focus:text-gold-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              }
            />

            {/* Remember session checkbox */}
            <div className="flex items-center justify-between mt-2 mb-8 text-xs font-sans text-obsidian/60 dark:text-pearl/50">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('remember')}
                  disabled={loading}
                  className="rounded border-gold-primary/20 text-gold-primary focus:ring-gold-primary/30 w-4 h-4 bg-transparent cursor-pointer dark:bg-obsidian"
                />
                Remember Session
              </label>
              
              <a href="#" className="hover:text-gold-primary transition-colors hover:underline">
                Lost Keys?
              </a>
            </div>

            {/* Submit Action Button */}
            <LuxuryButton 
              type="submit" 
              variant="gold" 
              size="lg" 
              loading={loading}
            >
              Sign In
            </LuxuryButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
