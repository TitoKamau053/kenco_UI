import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'landlord' | 'tenant';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role check if specified
  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on actual role
    if (user?.role === 'landlord') {
      return <Navigate to="/landlord/dashboard" replace />;
    } else if (user?.role === 'tenant') {
      return <Navigate to="/tenant/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Authenticated and role matches (or no role required) - render children
  return <>{children}</>;
};

export default ProtectedRoute;