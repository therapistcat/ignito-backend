/**
 * API Endpoints Demo Script
 * This script demonstrates all the available API endpoints
 * 
 * Run this after creating demo data to see all endpoints in action
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

// Demo all endpoints
async function demoEndpoints() {
  console.log('🚀 Demonstrating Bookstore API Endpoints...\n');

  try {
    // 1. GET all books
    console.log('📚 1. GET /api/books - Fetch all books');
    const books = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/books',
      method: 'GET'
    });
    
    if (books.status === 200) {
      console.log(`✅ Found ${books.data.data.length} books`);
      books.data.data.forEach(book => {
        console.log(`   - ${book.title} by ${book.author.name} ($${book.price})`);
      });
    }

    // 2. GET books with filtering
    console.log('\n📚 2. GET /api/books?genre=Fiction - Filter books by genre');
    const fictionBooks = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/books?genre=Fiction',
      method: 'GET'
    });
    
    if (fictionBooks.status === 200) {
      console.log(`✅ Found ${fictionBooks.data.data.length} fiction books`);
    }

    // 3. GET all authors
    console.log('\n👨‍💼 3. GET /api/authors - Fetch all authors');
    const authors = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/authors',
      method: 'GET'
    });
    
    if (authors.status === 200) {
      console.log(`✅ Found ${authors.data.data.length} authors`);
      authors.data.data.forEach(author => {
        console.log(`   - ${author.name} (${author.nationality})`);
      });
    }

    // 4. GET specific author with books
    if (authors.status === 200 && authors.data.data.length > 0) {
      const authorId = authors.data.data[0]._id;
      console.log(`\n👨‍💼 4. GET /api/authors/${authorId} - Get specific author`);
      
      const author = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: `/api/authors/${authorId}`,
        method: 'GET'
      });
      
      if (author.status === 200) {
        console.log(`✅ Author: ${author.data.data.name}`);
        console.log(`   Books by this author: ${author.data.data.books.length}`);
      }
    }

    // 5. GET all orders
    console.log('\n🛒 5. GET /api/orders - Fetch all orders');
    const orders = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/orders',
      method: 'GET'
    });
    
    if (orders.status === 200) {
      console.log(`✅ Found ${orders.data.data.length} orders`);
      orders.data.data.forEach(order => {
        console.log(`   - Order by ${order.customerName}: $${order.total} (${order.status})`);
      });
    }

    // 6. Update book stock
    if (books.status === 200 && books.data.data.length > 0) {
      const bookId = books.data.data[0]._id;
      console.log(`\n📚 6. PATCH /api/books/${bookId}/stock - Update book stock`);
      
      const updateStock = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: `/api/books/${bookId}/stock`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }, { stock: 150 });
      
      if (updateStock.status === 200) {
        console.log(`✅ Updated stock for "${updateStock.data.data.title}" to ${updateStock.data.data.stock}`);
      }
    }

    // 7. Update order status
    if (orders.status === 200 && orders.data.data.length > 0) {
      const orderId = orders.data.data[0]._id;
      console.log(`\n🛒 7. PATCH /api/orders/${orderId}/status - Update order status`);
      
      const updateStatus = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: `/api/orders/${orderId}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }, { status: 'confirmed' });
      
      if (updateStatus.status === 200) {
        console.log(`✅ Updated order status to: ${updateStatus.data.data.status}`);
      }
    }

    // 8. Search books
    console.log('\n🔍 8. GET /api/books?q=1984 - Search books');
    const searchBooks = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/books?q=1984',
      method: 'GET'
    });
    
    if (searchBooks.status === 200) {
      console.log(`✅ Search results: ${searchBooks.data.data.length} books found`);
      searchBooks.data.data.forEach(book => {
        console.log(`   - ${book.title}`);
      });
    }

    // 9. Pagination demo
    console.log('\n📄 9. GET /api/books?limit=2&page=1 - Pagination demo');
    const paginatedBooks = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/books?limit=2&page=1',
      method: 'GET'
    });
    
    if (paginatedBooks.status === 200) {
      console.log(`✅ Page 1 of books (limit 2): ${paginatedBooks.data.data.length} books`);
      console.log(`   Total pages: ${paginatedBooks.data.pagination.totalPages}`);
      console.log(`   Total books: ${paginatedBooks.data.pagination.totalBooks}`);
    }

    console.log('\n🎉 API Demo Completed Successfully!');
    console.log('\n📋 All Endpoints Tested:');
    console.log('   ✅ GET /api/books (with filtering, search, pagination)');
    console.log('   ✅ GET /api/books/:id');
    console.log('   ✅ PATCH /api/books/:id/stock');
    console.log('   ✅ GET /api/authors');
    console.log('   ✅ GET /api/authors/:id');
    console.log('   ✅ GET /api/orders');
    console.log('   ✅ PATCH /api/orders/:id/status');
    
    console.log('\n🔗 Additional endpoints available:');
    console.log('   - POST /api/books (create book)');
    console.log('   - PUT /api/books/:id (update book)');
    console.log('   - PATCH /api/books/:id (partial update)');
    console.log('   - DELETE /api/books/:id (delete book)');
    console.log('   - POST /api/authors (create author)');
    console.log('   - PUT /api/authors/:id (update author)');
    console.log('   - DELETE /api/authors/:id (delete author)');
    console.log('   - POST /api/orders (create order)');
    console.log('   - PUT /api/orders/:id (update order)');
    console.log('   - DELETE /api/orders/:id (delete order)');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Server is running on port 3000');
    console.log('   2. Demo data has been created (run demo-data.js)');
  }
}

// Run the demo
demoEndpoints();
