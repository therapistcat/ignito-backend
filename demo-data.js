/**
 * Demo Data Script
 * This script populates the database with sample data for demonstration
 * 
 * Run this script to add sample authors, books, and orders to test the API
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

// Sample data with Indian authors
const authors = [
  {
    name: 'R.K. Narayan',
    nationality: 'Indian',
    biography: 'Indian writer known for his works set in the fictional South Indian town of Malgudi',
    birthDate: '1906-10-10',
    awards: [
      { name: 'Sahitya Akademi Award', year: 1958 },
      { name: 'Padma Bhushan', year: 1964 }
    ]
  },
  {
    name: 'Arundhati Roy',
    nationality: 'Indian',
    biography: 'Indian author best known for her novel "The God of Small Things"',
    birthDate: '1961-11-24',
    awards: [
      { name: 'Booker Prize', year: 1997 },
      { name: 'Sydney Peace Prize', year: 2004 }
    ]
  },
  {
    name: 'Vikram Seth',
    nationality: 'Indian',
    biography: 'Indian novelist and poet, author of "A Suitable Boy"',
    birthDate: '1952-06-20',
    website: 'https://www.vikramseth.co.uk'
  },
  {
    name: 'Chetan Bhagat',
    nationality: 'Indian',
    biography: 'Indian author and columnist, known for his English-language novels about young urban middle-class Indians',
    birthDate: '1974-04-22',
    website: 'https://www.chetanbhagat.com'
  },
  {
    name: 'Amitav Ghosh',
    nationality: 'Indian',
    biography: 'Indian writer best known for his work in the English language',
    birthDate: '1956-07-11',
    awards: [
      { name: 'Sahitya Akademi Award', year: 2018 },
      { name: 'Jnanpith Award', year: 2018 }
    ]
  },
  {
    name: 'Ruskin Bond',
    nationality: 'Indian',
    biography: 'Indian author of British descent, known for his contributions to children\'s literature',
    birthDate: '1934-05-19',
    awards: [
      { name: 'Sahitya Akademi Award', year: 1992 },
      { name: 'Padma Shri', year: 1999 }
    ]
  }
];

const books = [
  {
    title: 'Malgudi Days',
    isbn: '9788185986180',
    genre: 'Fiction',
    price: 299,
    stock: 75,
    description: 'A collection of short stories set in the fictional town of Malgudi',
    publishedDate: '1943-01-01',
    pages: 244
  },
  {
    title: 'The God of Small Things',
    isbn: '9780006550686',
    genre: 'Fiction',
    price: 450,
    stock: 60,
    description: 'A family saga set in Kerala, winner of the Booker Prize',
    publishedDate: '1997-04-01',
    pages: 340
  },
  {
    title: 'A Suitable Boy',
    isbn: '9780060926052',
    genre: 'Fiction',
    price: 799,
    stock: 45,
    description: 'An epic novel set in post-independence India',
    publishedDate: '1993-05-01',
    pages: 1349
  },
  {
    title: 'Five Point Someone',
    isbn: '9788129135728',
    genre: 'Fiction',
    price: 195,
    stock: 80,
    description: 'A story about three friends at IIT Delhi',
    publishedDate: '2004-01-01',
    pages: 267
  },
  {
    title: 'The Mahabharata: A Modern Rendering',
    isbn: '9788129137241',
    genre: 'History',
    price: 599,
    stock: 30,
    description: 'A modern retelling of the ancient Indian epic',
    publishedDate: '2006-01-01',
    pages: 894
  },
  {
    title: 'The Blue Umbrella',
    isbn: '9788129115348',
    genre: 'Fiction',
    price: 150,
    stock: 90,
    description: 'A heartwarming story set in the hills of Garhwal',
    publishedDate: '1980-01-01',
    pages: 118
  },
  {
    title: 'Train to Pakistan',
    isbn: '9780802132215',
    genre: 'Historical Fiction',
    price: 350,
    stock: 55,
    description: 'A novel about the partition of India',
    publishedDate: '1956-01-01',
    pages: 181
  },
  {
    title: 'The White Tiger',
    isbn: '9781416562603',
    genre: 'Fiction',
    price: 399,
    stock: 65,
    description: 'A darkly comic novel about class and corruption in India',
    publishedDate: '2008-01-01',
    pages: 276
  }
];

// Create demo data
async function createDemoData() {
  console.log('📚 Creating demo data for Bookstore API...\n');

  try {
    const createdAuthors = [];
    
    // Create authors
    console.log('👨‍💼 Creating authors...');
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];
      const response = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/authors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, author);

      if (response.status === 201) {
        createdAuthors.push(response.data.data);
        console.log(`✅ Created author: ${author.name}`);
      } else {
        console.log(`❌ Failed to create author: ${author.name}`);
      }
    }

    // Create books
    console.log('\n📖 Creating books...');
    const bookAuthorMapping = [0, 1, 2, 3, 4, 5, 0, 1]; // Maps books to author indices
    
    for (let i = 0; i < books.length; i++) {
      const book = { ...books[i] };
      book.author = createdAuthors[bookAuthorMapping[i]]._id;
      
      const response = await makeRequest({
        hostname: 'localhost',
        port: 3000,
        path: '/api/books',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, book);

      if (response.status === 201) {
        console.log(`✅ Created book: ${book.title}`);
      } else {
        console.log(`❌ Failed to create book: ${book.title}`);
      }
    }

    // Get all books for order creation
    const booksResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/books',
      method: 'GET'
    });

    if (booksResponse.status === 200 && booksResponse.data.data.length > 0) {
      // Create sample orders
      console.log('\n🛒 Creating sample orders...');
      
      const sampleOrders = [
        {
          customerName: 'Priya Sharma',
          customerEmail: 'priya.sharma@gmail.com',
          customerPhone: '+91-9876543210',
          shippingAddress: {
            street: '123 MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            country: 'India'
          },
          items: [
            { book: booksResponse.data.data[0]._id, quantity: 1 },
            { book: booksResponse.data.data[2]._id, quantity: 1 }
          ],
          paymentMethod: 'credit_card',
          notes: 'Please deliver during business hours'
        },
        {
          customerName: 'Rahul Gupta',
          customerEmail: 'rahul.gupta@yahoo.com',
          customerPhone: '+91-8765432109',
          shippingAddress: {
            street: '45 Connaught Place',
            city: 'New Delhi',
            state: 'Delhi',
            zipCode: '110001',
            country: 'India'
          },
          items: [
            { book: booksResponse.data.data[1]._id, quantity: 2 }
          ],
          paymentMethod: 'cash_on_delivery'
        }
      ];

      for (const order of sampleOrders) {
        const response = await makeRequest({
          hostname: 'localhost',
          port: 3000,
          path: '/api/orders',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, order);

        if (response.status === 201) {
          console.log(`✅ Created order for: ${order.customerName}`);
        } else {
          console.log(`❌ Failed to create order for: ${order.customerName}`);
        }
      }
    }

    console.log('\n🎉 Demo data creation completed!');
    console.log('\n📊 Summary:');
    console.log(`   - Authors: ${authors.length}`);
    console.log(`   - Books: ${books.length}`);
    console.log(`   - Orders: 2`);
    
    console.log('\n🔗 Test the API:');
    console.log('   - GET http://localhost:3000/api/authors');
    console.log('   - GET http://localhost:3000/api/books');
    console.log('   - GET http://localhost:3000/api/orders');

  } catch (error) {
    console.error('❌ Failed to create demo data:', error.message);
    console.log('\n💡 Make sure the server is running on port 3000');
  }
}

// Run the script
createDemoData();
