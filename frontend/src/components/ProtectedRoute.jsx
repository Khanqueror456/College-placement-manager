import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and specific roles
 * 
 * @param {Array} allowedRoles - Array of role strings that are allowed to access this route
 * @param {ReactNode} children - The component to render if authorized
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, hasRole, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const userRole = user?.role?.toUpperCase();
      
      // Redirect to their own dashboard
      if (userRole === 'STUDENT') {
        return <Navigate to="/student-dashboard" replace />;
      } else if (userRole === 'TPO') {
        return <Navigate to="/tpo-dashboard" replace />;
      } else if (userRole === 'HOD') {
        return <Navigate to="/hod-dashboard" replace />;
      }
      
      // Fallback to login if role is unknown
      return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and has correct role
  return children;
};

export default ProtectedRoute;
