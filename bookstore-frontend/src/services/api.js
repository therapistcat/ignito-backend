/**
 * API Service Layer
 * This file handles all the API calls to our backend server
 *
 * Student: University Student
 * Project: Bookstore Management System
 *
 * This file contains functions to:
 * - Get books from server
 * - Create new books
 * - Update books
 * - Delete books
 * - Same for authors and orders
 */

import axios from 'axios'; // Library for making HTTP requests

// Base API URL - this is where our backend server is running
const API_BASE_URL = 'http://localhost:3000/api';
console.log('API Base URL:', API_BASE_URL); // Debug log

// Create axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL, // Base URL for all requests
  headers: {
    'Content-Type': 'application/json', // Tell server we're sending JSON
  },
  timeout: 10000, // Wait max 10 seconds for response
});

console.log('API instance created'); // Debug log

// Request interceptor for logging - helps us debug API calls
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making API call: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.params) {
      console.log('📋 With parameters:', config.params); // Log query parameters
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =============================================================================
// BOOKS API FUNCTIONS
// =============================================================================

export const booksAPI = {
  // Function to get all books from the server
  // params can include: page, limit, q (search), genre
  getAll: async (params = {}) => {
    console.log('📚 Getting books with params:', params); // Debug log
    const response = await api.get('/books', { params });
    console.log('📚 Got books response:', response.data); // Debug log
    return response.data;
  },

  // Get a single book by ID
  getById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Create a new book
  create: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Update a book completely
  update: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Update a book partially
  patch: async (id, bookData) => {
    const response = await api.patch(`/books/${id}`, bookData);
    return response.data;
  },

  // Update book stock only
  updateStock: async (id, stock) => {
    const response = await api.patch(`/books/${id}/stock`, { stock });
    return response.data;
  },

  // Delete a book
  delete: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

// =============================================================================
// AUTHORS API FUNCTIONS
// =============================================================================

export const authorsAPI = {
  // Get all authors with optional filtering and pagination
  getAll: async (params = {}) => {
    const response = await api.get('/authors', { params });
    return response.data;
  },

  // Get a single author by ID
  getById: async (id) => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  // Create a new author
  create: async (authorData) => {
    const response = await api.post('/authors', authorData);
    return response.data;
  },

  // Update an author
  update: async (id, authorData) => {
    const response = await api.put(`/authors/${id}`, authorData);
    return response.data;
  },

  // Delete an author
  delete: async (id) => {
    const response = await api.delete(`/authors/${id}`);
    return response.data;
  },
};

// =============================================================================
// ORDERS API FUNCTIONS
// =============================================================================

export const ordersAPI = {
  // Get all orders with optional filtering and pagination
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get a single order by ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create a new order
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Update an order
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  // Update order status only
  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Delete an order
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Helper function to handle API errors consistently
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'An error occurred';
    return { success: false, message, status: error.response.status };
  } else if (error.request) {
    // Request was made but no response received
    return { success: false, message: 'Unable to connect to server', status: 0 };
  } else {
    // Something else happened
    return { success: false, message: error.message, status: 0 };
  }
};

// Helper function to format API responses consistently
export const formatAPIResponse = (response) => {
  return {
    success: true,
    data: response.data,
    message: response.message,
    pagination: response.pagination,
  };
};

export default api;
