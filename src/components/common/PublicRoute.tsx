import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

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

  // Redirect logged-in admin users straight to their dashboard
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
