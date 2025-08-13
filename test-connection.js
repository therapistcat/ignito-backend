/**
 * MongoDB Atlas Connection Test
 * Simple script to test if MongoDB Atlas connection is working
 * 
 * Student: Jivanshu
 * Run this with: node test-connection.js
 */

// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🧪 Testing MongoDB Atlas Connection...\n');

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env file');
  console.log('💡 Make sure you have a .env file with your MongoDB Atlas connection string');
  process.exit(1);
}

// Hide credentials in log
const maskedURI = MONGODB_URI.replace(/\/\/.*@/, '//***:***@');
console.log('🔧 Connection URI:', maskedURI);

// Test connection
async function testConnection() {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Connection details:');
    console.log(`   - Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   - Host: ${mongoose.connection.host}`);
    console.log(`   - Ready State: ${mongoose.connection.readyState}`);
    
    // Test a simple operation
    console.log('\n🧪 Testing database operations...');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections in database`);
    
    if (collections.length > 0) {
      console.log('📋 Collections:');
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    } else {
      console.log('📝 No collections found (this is normal for a new database)');
    }
    
    console.log('\n🎉 MongoDB Atlas connection test completed successfully!');
    console.log('✅ Your application should now be able to connect to MongoDB Atlas');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error details:', error.message);
    
    // Common error solutions
    console.log('\n🔧 Troubleshooting tips:');
    
    if (error.message.includes('authentication failed')) {
      console.log('   - Check your username and password in the connection string');
      console.log('   - Verify user exists in MongoDB Atlas Database Access');
    }
    
    if (error.message.includes('network') || error.message.includes('timeout')) {
      console.log('   - Check your internet connection');
      console.log('   - Verify your IP is whitelisted in MongoDB Atlas Network Access');
      console.log('   - Try adding 0.0.0.0/0 to Network Access (for development)');
    }
    
    if (error.message.includes('URI')) {
      console.log('   - Check your connection string format');
      console.log('   - Make sure you replaced <your-cluster-url> with actual cluster URL');
    }
    
    console.log('\n📖 See MONGODB_ATLAS_SETUP.md for detailed setup instructions');
    
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

// Run the test
testConnection();
