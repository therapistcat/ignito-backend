/**
 * API Configuration
 * This file handles environment-specific API base URLs
 * 
 * Student: University Student
 * Project: Bookstore Management System
 */

// API configuration for different environments
const API_CONFIG = {
  // Production environment (when deployed)
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ignito-backend.onrender.com/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000, // Longer timeout for production
  },

  // Development environment (local development)
  development: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  }
};

// Determine current environment
const isProduction = import.meta.env.PROD;
const environment = isProduction ? 'production' : 'development';

// Get configuration for current environment
const currentConfig = API_CONFIG[environment];

// Export the configuration
export const API_BASE_URL = currentConfig.baseURL;
export const API_TIMEOUT = currentConfig.timeout;
export const ENVIRONMENT = environment;

// Default export for backward compatibility
export default API_BASE_URL;

// Log configuration for debugging
console.log('🔧 API Configuration:');
console.log('  Environment:', environment);
console.log('  Base URL:', API_BASE_URL);
console.log('  Timeout:', API_TIMEOUT + 'ms');
