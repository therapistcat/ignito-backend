# 📚 Bookstore Management API

A RESTful backend API for managing a bookstore system built with Node.js, Express, and MongoDB. This project demonstrates clean API design, proper database relationships, and comprehensive CRUD operations.

**Author:** University Student  
**Course:** Backend Development  
**Project Type:** University Assignment

## 🚀 Features

### Backend API
- **Complete CRUD Operations** for Books, Authors, and Orders
- **Advanced Filtering & Pagination** for all resources
- **Data Validation** with proper error handling
- **Database Relationships** between Books, Authors, and Orders
- **Stock Management** with automatic inventory updates
- **Order Processing** with stock validation and total calculations
- **RESTful API Design** following industry best practices

### Frontend Application
- **Modern React UI** with responsive design
- **Interactive Dashboard** with real-time statistics
- **Complete Management Interface** for all resources
- **Search and Filtering** capabilities
- **Form Validation** and user-friendly error handling
- **Mobile-responsive** design for all devices

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Additional:** CORS for cross-origin requests

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** Custom CSS with responsive design

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd bookstore-management-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

### 5. Test the API (Optional)
```bash
# Run basic API tests
npm run test-api

# Create sample data for testing
npm run demo-data

# Run comprehensive endpoint demo
npm run demo
```

## 🖥️ Frontend Setup (React Application)

### 1. Navigate to Frontend Directory
```bash
cd bookstore-frontend
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

**Note:** Make sure the backend is running on `http://localhost:3000` before starting the frontend.

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Description of the operation",
  "data": {}, // Response data (if applicable)
  "pagination": {} // Pagination info (for list endpoints)
}
```

## 📚 Books API

### Create a Book
```http
POST /api/books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "author_id_here",
  "isbn": "9780743273565",
  "genre": "Fiction",
  "price": 12.99,
  "stock": 50,
  "description": "A classic American novel",
  "publishedDate": "1925-04-10",
  "pages": 180
}
```

### Get All Books
```http
GET /api/books?limit=10&page=1&genre=Fiction&q=gatsby
```

**Query Parameters:**
- `limit` (optional): Number of books per page (default: 10)
- `page` (optional): Page number (default: 1)
- `genre` (optional): Filter by genre
- `q` (optional): Search in title and description

### Get Book by ID
```http
GET /api/books/:id
```

### Update Book (Complete)
```http
PUT /api/books/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "author": "author_id_here",
  "isbn": "9780743273565",
  "genre": "Fiction",
  "price": 15.99,
  "stock": 30
}
```

### Update Book (Partial)
```http
PATCH /api/books/:id
Content-Type: application/json

{
  "price": 14.99,
  "stock": 25
}
```

### Update Book Stock Only
```http
PATCH /api/books/:id/stock
Content-Type: application/json

{
  "stock": 100
}
```

### Delete Book
```http
DELETE /api/books/:id
```

## 👨‍💼 Authors API

### Create an Author
```http
POST /api/authors
Content-Type: application/json

{
  "name": "F. Scott Fitzgerald",
  "email": "fitzgerald@example.com",
  "nationality": "American",
  "birthDate": "1896-09-24",
  "biography": "American novelist and short story writer",
  "website": "https://example.com",
  "awards": [
    {
      "name": "Pulitzer Prize",
      "year": 1925
    }
  ]
}
```

### Get All Authors
```http
GET /api/authors?limit=10&page=1&nationality=American
```

### Get Author by ID
```http
GET /api/authors/:id
```

### Update Author
```http
PUT /api/authors/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "nationality": "British",
  "biography": "Updated biography"
}
```

### Delete Author
```http
DELETE /api/authors/:id
```

## 🛒 Orders API

### Create an Order
```http
POST /api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "items": [
    {
      "book": "book_id_here",
      "quantity": 2
    }
  ],
  "paymentMethod": "credit_card",
  "notes": "Please handle with care"
}
```

### Get All Orders
```http
GET /api/orders?limit=10&page=1&status=pending
```

### Get Order by ID
```http
GET /api/orders/:id
```

### Update Order
```http
PUT /api/orders/:id
```

### Update Order Status
```http
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "shipped"
}
```

### Delete Order
```http
DELETE /api/orders/:id
```

## 🧪 Testing the API

### Using cURL

**Create an Author:**
```bash
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J.K. Rowling",
    "nationality": "British",
    "biography": "British author, best known for the Harry Potter series"
  }'
```

**Create a Book:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Harry Potter and the Philosophers Stone",
    "author": "AUTHOR_ID_FROM_PREVIOUS_RESPONSE",
    "isbn": "9780747532699",
    "genre": "Fantasy",
    "price": 19.99,
    "stock": 100
  }'
```

**Get All Books:**
```bash
curl http://localhost:3000/api/books
```

### Using Postman

1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:3000/api`
3. Test each endpoint with sample data

## 📁 Complete Project Structure

```
bookstore-management-system/
├── backend/ (API Server)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database connection
│   │   ├── controllers/
│   │   │   ├── bookController.js    # Book business logic
│   │   │   ├── authorController.js  # Author business logic
│   │   │   └── orderController.js   # Order business logic
│   │   ├── models/
│   │   │   ├── Book.js             # Book schema
│   │   │   ├── Author.js           # Author schema
│   │   │   └── Order.js            # Order schema
│   │   └── routes/
│   │       ├── bookRoutes.js       # Book API routes
│   │       ├── authorRoutes.js     # Author API routes
│   │       └── orderRoutes.js      # Order API routes
│   ├── server.js                   # Main server file
│   ├── package.json               # Backend dependencies
│   ├── demo-data.js               # Sample data script
│   └── test-api.js                # API testing script
├── bookstore-frontend/ (React App)
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Navigation component
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Dashboard page
│   │   │   ├── Books.jsx          # Books management
│   │   │   ├── BookForm.jsx       # Book create/edit
│   │   │   ├── Authors.jsx        # Authors management
│   │   │   ├── AuthorForm.jsx     # Author create/edit
│   │   │   └── Orders.jsx         # Orders management
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── App.jsx                # Main app component
│   │   ├── App.css               # App styles
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # App entry point
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
└── README.md                     # This file
```

## 🔍 Key Learning Points

This project demonstrates several important backend development concepts:

1. **RESTful API Design** - Proper HTTP methods and status codes
2. **Database Modeling** - Relationships between entities
3. **Data Validation** - Input validation and error handling
4. **Pagination** - Efficient handling of large datasets
5. **Business Logic** - Stock management and order processing
6. **Code Organization** - Separation of concerns with MVC pattern

## 🚨 Error Handling

The API includes comprehensive error handling for:
- Validation errors (400 Bad Request)
- Not found errors (404 Not Found)
- Duplicate entries (400 Bad Request)
- Server errors (500 Internal Server Error)

## 🔮 Future Enhancements

Potential improvements for this project:
- User authentication and authorization
- Payment processing integration
- Email notifications for orders
- Advanced search with Elasticsearch
- API rate limiting
- Unit and integration tests
- Docker containerization

## 📞 Support

If you encounter any issues or have questions about this project:
1. Check the console logs for error messages
2. Ensure MongoDB is running
3. Verify all dependencies are installed
4. Check the API endpoint URLs and request formats

---

**Happy Coding! 🎉**
