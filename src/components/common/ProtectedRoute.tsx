import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { ShieldAlert } from 'lucide-react';
import { LuxuryButton } from '../ui/LuxuryButton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center p-12">
        <div className="w-full max-w-xl flex flex-col gap-6">
          <LoadingSkeleton variant="text" lines={2} className="h-6" />
          <LoadingSkeleton variant="card" className="h-48" />
        </div>
      </div>
    );
  }

  // Redirect to admin login if no session is active
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If role authorization check is required
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return (
      <div className="min-h-screen bg-pearl dark:bg-obsidian flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/10 dark:bg-black/40 border border-gold-primary/20 backdrop-blur-luxury rounded-luxury-md p-8 text-center shadow-luxury">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl text-gold-primary mb-3">Access Restricted</h2>
          <p className="text-xs uppercase tracking-widest text-obsidian/40 dark:text-pearl/40 mb-2">
            Your role: <span className="text-gold-primary">{role || 'none'}</span>
          </p>
          <p className="text-sm text-obsidian/70 dark:text-pearl/60 mb-8 leading-relaxed">
            Your credentials lack the necessary administrative privilege mappings to access this module. Please coordinate with the head system supervisor.
          </p>
          <div className="flex gap-4 justify-center">
            <LuxuryButton variant="gold" size="sm" onClick={() => window.history.back()}>
              Go Back
            </LuxuryButton>
            <LuxuryButton variant="outline" size="sm" onClick={logout}>
              Sign Out
            </LuxuryButton>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
