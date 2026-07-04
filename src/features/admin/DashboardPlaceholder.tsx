import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { ShieldCheck, LogOut, Mail, User, ShieldAlert } from 'lucide-react';

export const DashboardPlaceholder: React.FC = () => {
  const { user, role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <span className="font-serif text-xl tracking-[0.25em] text-gold-primary uppercase">
            CHANDRAKALA
          </span>
          <span className="text-[9px] tracking-[0.45em] text-obsidian/60 dark:text-pearl/60 uppercase mt-0.5 font-sans">
            JEWELLERS
          </span>
          <p className="text-[10px] text-gold-primary/70 uppercase tracking-widest mt-2 font-mono">
            Executive Control Center
          </p>
        </div>

        <GlassCard className="p-8 border-gold-primary/20 dark:bg-black/30 shadow-luxury" hoverEffect={false}>
          <div className="flex items-center gap-4 mb-6 border-b border-gold-primary/10 pb-6">
            <div className="w-14 h-14 bg-gold-primary/10 border border-gold-primary/30 text-gold-primary rounded-full flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-light text-obsidian dark:text-pearl">Admin Session Confirmed</h1>
              <p className="text-xs text-emerald dark:text-emerald-400 font-sans uppercase tracking-widest flex items-center gap-1.5 mt-1 font-medium">
                Authentication Verification Success
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-[10px] uppercase tracking-widest text-gold-primary font-bold">Active Profile Credentials</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 border border-gold-primary/5 rounded-luxury-sm flex items-center gap-3">
                <User className="w-4 h-4 text-gold-primary" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-obsidian/40 dark:text-pearl/40">Full Name</p>
                  <p className="text-xs font-semibold">{user?.user_metadata?.name || 'Administrator'}</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-gold-primary/5 rounded-luxury-sm flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-primary" />
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase tracking-wider text-obsidian/40 dark:text-pearl/40">Email Address</p>
                  <p className="text-xs font-semibold truncate">{user?.email}</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-gold-primary/5 rounded-luxury-sm flex items-center gap-3 sm:col-span-2">
                <ShieldAlert className="w-4 h-4 text-gold-primary" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-obsidian/40 dark:text-pearl/40">Assigned Access Profile (Role)</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-primary">{role || 'No mapping'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Modules Quick Links */}
          <div className="mb-8 pt-4 border-t border-gold-primary/10">
            <h3 className="text-[10px] uppercase tracking-widest text-gold-primary font-bold mb-3">Module Navigation</h3>
            <div className="flex gap-3">
              <LuxuryButton 
                variant="gold" 
                size="sm"
                onClick={() => window.location.href = '/admin/media'}
              >
                Media Library
              </LuxuryButton>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-obsidian/40 dark:text-pearl/40 uppercase tracking-widest">
              Session state: active
            </span>
            <LuxuryButton 
              variant="outline" 
              size="sm" 
              icon={LogOut}
              onClick={logout}
            >
              Secure Sign Out
            </LuxuryButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
