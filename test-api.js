/**
 * Simple API Test Script
 * This script tests the basic functionality of our bookstore API
 * 
 * Run this after starting the server to verify everything works
 */

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test the API
async function testAPI() {
  console.log('🧪 Testing Bookstore API...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthCheck = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET'
    });
    
    if (healthCheck.status === 200) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server health check failed');
      return;
    }

    // Test 2: Create an author
    console.log('\n2. Creating an author...');
    const authorData = {
      name: 'J.K. Rowling',
      nationality: 'British',
      biography: 'British author, best known for the Harry Potter series',
      birthDate: '1965-07-31'
    };

    const createAuthor = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/authors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, authorData);

    if (createAuthor.status === 201) {
      console.log('✅ Author created successfully');
      console.log(`   Author ID: ${createAuthor.data.data._id}`);
      
      const authorId = createAuthor.data.data._id;

      // Test 3: Create a book
      console.log('\n3. Creating a book...');
      const bookData = {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: authorId,
        isbn: '9780747532699',
        genre: 'Fantasy',
        price: 19.99,
        stock: 100,
        description: 'The first book in the Harry Potter series',
        publishedDate: '1997-06-26',
        pages: 223
      };

      const createBook = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/books',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, bookData);

      if (createBook.status === 201) {
        console.log('✅ Book created successfully');
        console.log(`   Book ID: ${createBook.data.data._id}`);
        
        const bookId = createBook.data.data._id;

        // Test 4: Get all books
        console.log('\n4. Fetching all books...');
        const getBooks = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: '/api/books',
          method: 'GET'
        });

        if (getBooks.status === 200) {
          console.log('✅ Books fetched successfully');
          console.log(`   Found ${getBooks.data.data.length} book(s)`);
        } else {
          console.log('❌ Failed to fetch books');
        }

        // Test 5: Create an order
        console.log('\n5. Creating an order...');
        const orderData = {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+1234567890',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          items: [
            {
              book: bookId,
              quantity: 2
            }
          ],
          paymentMethod: 'credit_card',
          notes: 'Test order'
        };

        const createOrder = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: '/api/orders',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }, orderData);

        if (createOrder.status === 201) {
          console.log('✅ Order created successfully');
          console.log(`   Order ID: ${createOrder.data.data._id}`);
          console.log(`   Total: $${createOrder.data.data.total}`);
        } else {
          console.log('❌ Failed to create order');
          console.log('   Error:', createOrder.data.message);
        }

      } else {
        console.log('❌ Failed to create book');
        console.log('   Error:', createBook.data.message);
      }

    } else {
      console.log('❌ Failed to create author');
      console.log('   Error:', createAuthor.data.message);
    }

    console.log('\n🎉 API testing completed!');
    console.log('\n📖 You can now test the API manually using:');
    console.log('   - Browser: http://localhost:3000');
    console.log('   - Postman or similar tools');
    console.log('   - cURL commands (see README.md)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. MongoDB is running');
    console.log('   2. Server is started with "npm start" or "npm run dev"');
    console.log('   3. Port 3000 is not blocked');
  }
}

// Run the test
testAPI();
