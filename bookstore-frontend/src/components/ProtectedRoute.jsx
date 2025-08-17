/**
 * Protected Route Component
 * Restricts access to admin-only routes
 */

import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, canEdit } = useAuth();

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>Access Restricted</h2>
          <p>This section requires administrator privileges.</p>
          <p>Please log in as an admin to access this feature.</p>
          <div className="access-info">
            <h3>Current Access Level:</h3>
            <p>{user ? `Logged in as: ${user.username} (${user.role})` : 'Guest User (Read-only access)'}</p>
          </div>
        </div>
      </div>
    );
  }

  // If edit access is required but user cannot edit
  if (!canEdit() && requireAdmin) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>Edit Access Required</h2>
          <p>You need administrator privileges to edit content.</p>
          <p>You can browse and view all content as a guest.</p>
        </div>
      </div>
    );
  }

  // Allow access
  return children;
};

export default ProtectedRoute;
