/**
 * Authentication Context
 * Manages user authentication state and provides auth functions
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

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

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('bookstore_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('bookstore_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple authentication logic (replace with real API call)
      if (email && password) {
        const userData = {
          id: Date.now(),
          email: email,
          name: email.split('@')[0],
          role: 'manager',
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('bookstore_user', JSON.stringify(userData));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Login failed' };
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple registration logic (replace with real API call)
      if (userData.email && userData.password && userData.name) {
        const newUser = {
          id: Date.now(),
          email: userData.email,
          name: userData.name,
          role: 'manager',
          loginTime: new Date().toISOString()
        };
        
        setUser(newUser);
        localStorage.setItem('bookstore_user', JSON.stringify(newUser));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'All fields are required' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookstore_user');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
