/**
 * Authentication Context
 * Manages user authentication state and role-based access control
 * 
 * User Types:
 * - Admin: Full CRUD access (username: Jivanshu, password: Jivanshu123)
 * - Guest: Read-only access (no login required)
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'Jivanshu',
  password: 'Jivanshu123'
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('bookstore_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('bookstore_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      // Validate credentials
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const userData = {
          username: username,
          role: 'admin',
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('bookstore_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookstore_user');
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Check if user can edit (admin only)
  const canEdit = () => {
    return isAdmin();
  };

  // Check if user can view (everyone can view)
  const canView = () => {
    return true; // Both admin and guest can view
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    canEdit,
    canView
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
