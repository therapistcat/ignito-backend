/**
 * Protected Route Component
 * Restricts access to admin-only routes
 */

import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, canEdit } = useAuth();
  const location = useLocation();

  // If admin access is required but user is not admin, redirect to login
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If edit access is required but user cannot edit, redirect to login
  if (!canEdit() && requireAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access
  return children;
};

export default ProtectedRoute;
