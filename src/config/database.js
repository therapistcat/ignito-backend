const mongoose = require('mongoose');

/**
 * Database connection configuration
 * This file handles the MongoDB connection setup
 *
 * Student: Jivanshu
 * Note: Updated to support both local MongoDB and MongoDB Atlas
 */

// Load environment variables from .env file
require('dotenv').config();

// MongoDB connection URI - can be local or Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore_db';

console.log('🔧 Database URI configured:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

/**
 * Connect to MongoDB database
 * @returns {Promise} MongoDB connection promise
 */
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB with recommended options
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Exit process with failure if we can't connect to database
    process.exit(1);
  }
};

/**
 * Handle MongoDB connection events
 */
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;
