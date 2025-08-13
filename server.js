/**
 * Bookstore Management API Server
 * A RESTful API for managing a bookstore - University Project
 *
 * Author: University Student (Jivanshu)
 * Course: Backend Development
 *
 * This server provides endpoints for managing books, authors, and orders
 * in a bookstore management system.
 *
 * Updated to support MongoDB Atlas connection
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Import route modules
const bookRoutes = require('./src/routes/bookRoutes');
const authorRoutes = require('./src/routes/authorRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

// Create Express application
const app = express();

// Set port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Middleware Setup
 * These middlewares run for every request to our API
 */

// Enable CORS for all routes (allows frontend to connect)
app.use(cors());

// Parse JSON request bodies (allows us to receive JSON data)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Log all requests (simple logging middleware)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * API Routes
 * All our API endpoints are organized by resource type
 */

// Welcome route - shows API information
app.get('/', (req, res) => {
  res.json({
    message: '📚 Welcome to Bookstore Management API',
    version: '1.0.0',
    author: 'University Student',
    description: 'A RESTful API for managing books, authors, and orders',
    endpoints: {
      books: '/api/books',
      authors: '/api/authors',
      orders: '/api/orders'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// API health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount API routes with /api prefix
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/orders', orderRoutes);

/**
 * Error Handling Middleware
 * These handle errors that occur in our API
 */

// Handle 404 errors (route not found)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'Not Found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Error occurred:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      error: 'Duplicate Entry'
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: 'Cast Error'
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.stack : 'Something went wrong'
  });
});

/**
 * Start Server
 * Connect to database and start listening for requests
 */
const startServer = async () => {
  try {
    // Connect to MongoDB database
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log('🚀 ================================');
      console.log(`📚 Bookstore API Server Started`);
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`📍 Local URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log('🚀 ================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export app for testing purposes
module.exports = app;
