/**
 * Test Multiple MongoDB Atlas Connection Strings
 * This script tries different username/password combinations
 * 
 * Student: Jivanshu
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Base connection string template
const baseConnection = 'mongodb+srv://{username}:{password}@chulbulemishraji.8mcwh5g.mongodb.net/bookstore_db?retryWrites=true&w=majority&appName=chulbuleMishraJi';

// Different username/password combinations to try
const credentials = [
  { username: 'Jivanshu', password: 'Jivanshu', description: 'Current attempt' },
  { username: 'jivanshu', password: 'Jivanshu', description: 'Lowercase username' },
  { username: 'Jivanshu', password: 'jivanshu', description: 'Lowercase password' },
  { username: 'jivanshu', password: 'jivanshu', description: 'Both lowercase' },
  { username: 'Jivanshu', password: 'JIvanshu1', description: 'Original password from your message' },
];

async function testConnection(username, password, description) {
  const connectionString = baseConnection
    .replace('{username}', username)
    .replace('{password}', password);
  
  const maskedConnection = connectionString.replace(/\/\/.*@/, '//***:***@');
  
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log(`   URI: ${maskedConnection}`);
  
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    console.log('✅ SUCCESS! This combination works!');
    console.log(`📊 Connected to database: ${mongoose.connection.db.databaseName}`);
    
    // Close connection
    await mongoose.connection.close();
    
    console.log('\n🎉 WORKING CREDENTIALS FOUND:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\n📝 Update your .env file with:');
    console.log(`MONGODB_URI=${connectionString}`);
    
    return true;
    
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
    
    // Close any open connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    return false;
  }
}

async function testAllCombinations() {
  console.log('🔍 Testing Multiple Username/Password Combinations...\n');
  console.log('This will help us find the correct credentials for your MongoDB Atlas database.\n');
  
  let foundWorking = false;
  
  for (const cred of credentials) {
    const success = await testConnection(cred.username, cred.password, cred.description);
    
    if (success) {
      foundWorking = true;
      break;
    }
    
    // Wait a bit between attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (!foundWorking) {
    console.log('\n❌ None of the combinations worked.');
    console.log('\n🔧 Next steps:');
    console.log('1. Go to MongoDB Atlas → Database Access');
    console.log('2. Check what username actually exists');
    console.log('3. Verify the password for that user');
    console.log('4. Or create a new user with known credentials');
    console.log('\n💡 Common issues:');
    console.log('   - Username might be your email address');
    console.log('   - Password might be different than expected');
    console.log('   - User might not exist in Database Access');
    console.log('   - User might not have proper permissions');
  }
  
  process.exit(0);
}

// Run the test
testAllCombinations().catch(console.error);
