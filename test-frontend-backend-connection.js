/**
 * Frontend-Backend Connection Test
 * This script tests the connection between frontend and backend
 * by simulating API calls from different origins
 */

const http = require('http');
const https = require('https');

// Test configuration
const BACKEND_URL = 'https://ignito-backend.onrender.com';
const FRONTEND_URL = 'https://bookstore-management-xz4a.onrender.com';
const LOCAL_BACKEND = 'http://localhost:3000';

// Helper function to make HTTP/HTTPS requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      ...options,
      headers: {
        'Origin': FRONTEND_URL,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(url, requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ 
            status: res.statusCode, 
            headers: res.headers,
            data: response 
          });
        } catch (error) {
          resolve({ 
            status: res.statusCode, 
            headers: res.headers,
            data: body 
          });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Test functions
async function testBackendHealth() {
  console.log('🏥 Testing backend health...');
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`);
    if (response.status === 200) {
      console.log('✅ Backend health check passed');
      console.log('   Status:', response.data.status);
      console.log('   Environment:', response.data.environment);
      return true;
    } else {
      console.log('❌ Backend health check failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend health check error:', error.message);
    return false;
  }
}

async function testCORS() {
  console.log('🌐 Testing CORS configuration...');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/books`, {
      method: 'GET'
    });
    
    console.log('   Response status:', response.status);
    console.log('   CORS headers:');
    console.log('     Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
    console.log('     Access-Control-Allow-Credentials:', response.headers['access-control-allow-credentials']);
    
    if (response.status === 200) {
      console.log('✅ CORS test passed - API accessible from frontend domain');
      return true;
    } else {
      console.log('❌ CORS test failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ CORS test error:', error.message);
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('📚 Testing API endpoints...');
  
  const endpoints = [
    { path: '/api/books', name: 'Books' },
    { path: '/api/authors', name: 'Authors' },
    { path: '/api/orders', name: 'Orders' }
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BACKEND_URL}${endpoint.path}`);
      if (response.status === 200) {
        console.log(`   ✅ ${endpoint.name} endpoint working`);
        if (response.data.data) {
          console.log(`      Found ${response.data.data.length} items`);
        }
      } else {
        console.log(`   ❌ ${endpoint.name} endpoint failed:`, response.status);
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name} endpoint error:`, error.message);
      allPassed = false;
    }
  }
  
  return allPassed;
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Frontend-Backend Connection Tests');
  console.log('='.repeat(50));
  console.log('Backend URL:', BACKEND_URL);
  console.log('Frontend URL:', FRONTEND_URL);
  console.log('='.repeat(50));
  
  const results = {
    health: await testBackendHealth(),
    cors: await testCORS(),
    endpoints: await testAPIEndpoints()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(30));
  console.log('Health Check:', results.health ? '✅ PASS' : '❌ FAIL');
  console.log('CORS Config:', results.cors ? '✅ PASS' : '❌ FAIL');
  console.log('API Endpoints:', results.endpoints ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Frontend and backend are properly connected.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the configuration.');
  }
  
  return allPassed;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testBackendHealth, testCORS, testAPIEndpoints };
