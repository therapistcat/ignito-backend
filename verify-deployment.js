/**
 * Deployment Verification Script
 * Comprehensive check of both frontend and backend deployments
 */

const https = require('https');
const http = require('http');

const FRONTEND_URL = 'https://bookstore-management-xz4a.onrender.com';
const BACKEND_URL = 'https://ignito-backend.onrender.com';

// Helper function to make requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      ...options,
      headers: {
        'Origin': FRONTEND_URL,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers
      }
    };

    const req = client.request(url, requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ 
          status: res.statusCode, 
          headers: res.headers,
          body: body,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      reject({ error: error.message, url: url });
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      reject({ error: 'Request timeout', url: url });
    });
    
    req.end();
  });
}

// Test functions
async function testFrontendDeployment() {
  console.log('🌐 Testing Frontend Deployment...');
  console.log('   URL:', FRONTEND_URL);
  
  try {
    const response = await makeRequest(FRONTEND_URL);
    
    if (response.status === 200) {
      console.log('   ✅ Frontend is accessible');
      console.log('   📄 Content-Type:', response.headers['content-type']);
      
      // Check if it's a React app
      if (response.body.includes('react') || response.body.includes('vite') || response.body.includes('Bookstore')) {
        console.log('   ✅ Frontend appears to be the correct React application');
        return true;
      } else {
        console.log('   ⚠️  Frontend content may not be the expected React app');
        return false;
      }
    } else {
      console.log('   ❌ Frontend not accessible:', response.status);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Frontend error:', error.error);
    return false;
  }
}

async function testBackendDeployment() {
  console.log('\n🔧 Testing Backend Deployment...');
  console.log('   URL:', BACKEND_URL);
  
  try {
    // Test health endpoint
    const healthResponse = await makeRequest(`${BACKEND_URL}/health`);
    
    if (healthResponse.status === 200) {
      const healthData = JSON.parse(healthResponse.body);
      console.log('   ✅ Backend health check passed');
      console.log('   🌍 Environment:', healthData.environment);
      console.log('   ⏱️  Uptime:', Math.round(healthData.uptime), 'seconds');
      
      // Test API endpoint
      const apiResponse = await makeRequest(`${BACKEND_URL}/api/books`);
      
      if (apiResponse.status === 200) {
        const apiData = JSON.parse(apiResponse.body);
        console.log('   ✅ API endpoints working');
        console.log('   📚 Books found:', apiData.data ? apiData.data.length : 0);
        return true;
      } else {
        console.log('   ❌ API endpoints not working:', apiResponse.status);
        return false;
      }
    } else {
      console.log('   ❌ Backend health check failed:', healthResponse.status);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Backend error:', error.error);
    return false;
  }
}

async function testCORSConfiguration() {
  console.log('\n🔒 Testing CORS Configuration...');
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/books`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    
    console.log('   📡 Response Status:', response.status);
    console.log('   🔐 CORS Headers:');
    console.log('      Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
    console.log('      Access-Control-Allow-Credentials:', response.headers['access-control-allow-credentials']);
    
    if (response.status === 200) {
      const allowedOrigin = response.headers['access-control-allow-origin'];
      
      if (allowedOrigin === FRONTEND_URL || allowedOrigin === '*') {
        console.log('   ✅ CORS properly configured for frontend domain');
        return true;
      } else {
        console.log('   ❌ CORS not configured for frontend domain');
        console.log('      Expected:', FRONTEND_URL);
        console.log('      Got:', allowedOrigin);
        return false;
      }
    } else {
      console.log('   ❌ CORS test failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('   ❌ CORS test error:', error.error);
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('\n📋 Testing API Endpoints...');
  
  const endpoints = [
    { path: '/api/books', name: 'Books' },
    { path: '/api/authors', name: 'Authors' },
    { path: '/api/orders', name: 'Orders' }
  ];
  
  let allWorking = true;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BACKEND_URL}${endpoint.path}`);
      
      if (response.status === 200) {
        const data = JSON.parse(response.body);
        const count = data.data ? data.data.length : 0;
        console.log(`   ✅ ${endpoint.name}: ${count} items`);
      } else {
        console.log(`   ❌ ${endpoint.name}: Failed (${response.status})`);
        allWorking = false;
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: Error (${error.error})`);
      allWorking = false;
    }
  }
  
  return allWorking;
}

// Main verification function
async function verifyDeployment() {
  console.log('🚀 DEPLOYMENT VERIFICATION');
  console.log('='.repeat(50));
  console.log('Frontend:', FRONTEND_URL);
  console.log('Backend:', BACKEND_URL);
  console.log('='.repeat(50));
  
  const results = {
    frontend: await testFrontendDeployment(),
    backend: await testBackendDeployment(),
    cors: await testCORSConfiguration(),
    endpoints: await testAPIEndpoints()
  };
  
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('='.repeat(30));
  console.log('Frontend Deployment:', results.frontend ? '✅ WORKING' : '❌ FAILED');
  console.log('Backend Deployment:', results.backend ? '✅ WORKING' : '❌ FAILED');
  console.log('CORS Configuration:', results.cors ? '✅ WORKING' : '❌ FAILED');
  console.log('API Endpoints:', results.endpoints ? '✅ WORKING' : '❌ FAILED');
  
  const allWorking = Object.values(results).every(result => result);
  
  console.log('\n🎯 OVERALL STATUS');
  console.log('='.repeat(20));
  
  if (allWorking) {
    console.log('🎉 SUCCESS! Both applications are deployed and working correctly.');
    console.log('✅ Frontend and backend are properly connected.');
    console.log('✅ Users can now access the full application functionality.');
  } else {
    console.log('⚠️  ISSUES DETECTED! Some components are not working properly.');
    console.log('🔧 Please check the failed tests above and redeploy if necessary.');
  }
  
  console.log('\n🔗 Quick Links:');
  console.log('   Frontend App:', FRONTEND_URL);
  console.log('   Backend API:', BACKEND_URL + '/api/books');
  console.log('   Backend Health:', BACKEND_URL + '/health');
  
  return allWorking;
}

// Run verification
if (require.main === module) {
  verifyDeployment().catch(console.error);
}

module.exports = { verifyDeployment };
