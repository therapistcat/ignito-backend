# 📚 Bookstore Management System

A comprehensive full-stack web application for managing a bookstore, built as a university project. This system includes a RESTful backend API and a modern React frontend, providing complete CRUD operations for books, authors, and orders with advanced features like filtering, pagination, search capabilities, and cloud database integration.

**Author:** University Student (Jivanshu)  
**Course:** Full-Stack Web Development  
**Project Type:** University Assignment  
**Database:** MongoDB Atlas (Cloud)  
**Deployment:** Ready for Render.com  

## 🎯 Project Overview

This project demonstrates a complete understanding of modern web development technologies by implementing a real-world bookstore management system. The application features:

- **Backend API** built with Node.js and Express.js
- **Frontend UI** built with React 18 and Vite
- **Cloud Database** using MongoDB Atlas
- **Indian Context** with rupee currency and Indian authors/books
- **Modern Design** with responsive UI and smooth animations
- **Professional Features** like search, filtering, pagination, and real-time updates

## 🚀 Features

### 🔧 Backend API Features
- **Complete CRUD Operations** for Books, Authors, and Orders
- **Advanced Filtering & Pagination** for all resources
- **Search Functionality** with text-based queries
- **Data Validation** with comprehensive error handling
- **Database Relationships** between Books, Authors, and Orders
- **Stock Management** with automatic inventory updates
- **Order Processing** with stock validation and total calculations
- **RESTful API Design** following industry best practices
- **MongoDB Atlas Integration** for cloud database storage

### 🎨 Frontend Application Features
- **Modern React UI** with responsive design and animations
- **Interactive Dashboard** with real-time statistics and quick actions
- **Complete Management Interface** for all resources (Books, Authors, Orders)
- **Advanced Search** with debounced input for better performance
- **Filtering and Sorting** capabilities across all data
- **Form Validation** with user-friendly error messages
- **Mobile-responsive** design that works on all devices
- **Indian Context** with rupee currency (₹) and Indian literature focus

### 📊 Business Features
- **Inventory Management** with low stock warnings
- **Order Processing** with multiple status tracking
- **Author Management** with biographical information and awards
- **Financial Tracking** with order totals and tax calculations
- **Customer Management** with shipping address handling

## 🛠️ Technology Stack

### Backend Technologies
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose
- **Environment:** dotenv for configuration
- **CORS:** Cross-origin resource sharing
- **Validation:** Built-in Mongoose validation

### Frontend Technologies
- **Framework:** React 18 with Hooks
- **Build Tool:** Vite (Fast development and building)
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios for API communication
- **Styling:** Custom CSS with modern design patterns
- **Icons:** SVG icons for professional appearance
- **Fonts:** Google Fonts (Inter & Poppins)

### Development Tools
- **Package Manager:** npm
- **Version Control:** Git
- **Code Editor:** VS Code (recommended)
- **API Testing:** Built-in test scripts
- **Database GUI:** MongoDB Compass (optional)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up here](https://cloud.mongodb.com/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd bookstore-management-system
```

### 2. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
1. Create a `.env` file in the root directory:
```bash
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://chulbuleMishraJi:Jivanshu@chulbulemishraji.8mcwh5g.mongodb.net/bookstore_db?retryWrites=true&w=majority&appName=chulbuleMishraJi

# Server Configuration
PORT=3000
NODE_ENV=development
```

2. **Important:** Replace the MongoDB URI with your own Atlas connection string

#### Test MongoDB Connection
```bash
npm run test-connection
```

#### Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd bookstore-frontend
```

#### Install Frontend Dependencies
```bash
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

### 4. Populate Database with Demo Data

```bash
# Go back to root directory
cd ..

# Create sample data
npm run demo-data

# Test API endpoints
npm run test-api
```

## 📁 Project Structure

```
bookstore-management-system/
├── 📁 Backend (Root Directory)
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── database.js          # MongoDB Atlas connection
│   │   ├── 📁 controllers/
│   │   │   ├── bookController.js    # Book business logic
│   │   │   ├── authorController.js  # Author business logic
│   │   │   └── orderController.js   # Order business logic
│   │   ├── 📁 models/
│   │   │   ├── Book.js             # Book schema & validation
│   │   │   ├── Author.js           # Author schema & validation
│   │   │   └── Order.js            # Order schema & validation
│   │   └── 📁 routes/
│   │       ├── bookRoutes.js       # Book API endpoints
│   │       ├── authorRoutes.js     # Author API endpoints
│   │       └── orderRoutes.js      # Order API endpoints
│   ├── server.js                   # Main server file
│   ├── demo-data.js               # Sample data creation
│   ├── test-api.js                # API testing script
│   ├── test-connection.js         # MongoDB connection test
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables
├── 📁 bookstore-frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   └── Navbar.jsx          # Navigation component
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Books.jsx          # Books management
│   │   │   ├── BookForm.jsx       # Book create/edit form
│   │   │   ├── Authors.jsx        # Authors management
│   │   │   ├── AuthorForm.jsx     # Author create/edit form
│   │   │   └── Orders.jsx         # Orders management
│   │   ├── 📁 services/
│   │   │   └── api.js             # API communication layer
│   │   ├── App.jsx                # Main React component
│   │   ├── App.css               # App-specific styles
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # React entry point
│   ├── 📁 public/
│   │   └── index.html            # HTML template
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
├── README.md                     # This file
├── DEPLOYMENT.md                 # Deployment guide
└── CHANGELOG.md                  # Development history
```

## 🌐 API Endpoints

### 📚 Books API
| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/api/books` | Get all books with filtering & pagination | `GET /api/books?page=1&limit=10&genre=Fiction` |
| GET | `/api/books/:id` | Get book by ID | `GET /api/books/64f1a2b3c4d5e6f7g8h9i0j1` |
| POST | `/api/books` | Create new book | `POST /api/books` |
| PUT | `/api/books/:id` | Update book completely | `PUT /api/books/64f1a2b3c4d5e6f7g8h9i0j1` |
| PATCH | `/api/books/:id` | Update book partially | `PATCH /api/books/64f1a2b3c4d5e6f7g8h9i0j1` |
| PATCH | `/api/books/:id/stock` | Update book stock only | `PATCH /api/books/64f1a2b3c4d5e6f7g8h9i0j1/stock` |
| DELETE | `/api/books/:id` | Delete book | `DELETE /api/books/64f1a2b3c4d5e6f7g8h9i0j1` |

### 👨‍💼 Authors API
| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/api/authors` | Get all authors with filtering & pagination | `GET /api/authors?page=1&limit=10` |
| GET | `/api/authors/:id` | Get author by ID (includes books) | `GET /api/authors/64f1a2b3c4d5e6f7g8h9i0j1` |
| POST | `/api/authors` | Create new author | `POST /api/authors` |
| PUT | `/api/authors/:id` | Update author | `PUT /api/authors/64f1a2b3c4d5e6f7g8h9i0j1` |
| DELETE | `/api/authors/:id` | Delete author | `DELETE /api/authors/64f1a2b3c4d5e6f7g8h9i0j1` |

### 🛒 Orders API
| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/api/orders` | Get all orders with filtering & pagination | `GET /api/orders?page=1&limit=10&status=pending` |
| GET | `/api/orders/:id` | Get order by ID | `GET /api/orders/64f1a2b3c4d5e6f7g8h9i0j1` |
| POST | `/api/orders` | Create new order | `POST /api/orders` |
| PUT | `/api/orders/:id` | Update order | `PUT /api/orders/64f1a2b3c4d5e6f7g8h9i0j1` |
| PATCH | `/api/orders/:id/status` | Update order status only | `PATCH /api/orders/64f1a2b3c4d5e6f7g8h9i0j1/status` |
| DELETE | `/api/orders/:id` | Delete order | `DELETE /api/orders/64f1a2b3c4d5e6f7g8h9i0j1` |

### 📝 Example API Requests

#### Create a New Book
```bash
POST /api/books
Content-Type: application/json

{
  "title": "The God of Small Things",
  "author": "64f1a2b3c4d5e6f7g8h9i0j1",
  "isbn": "9780006550686",
  "genre": "Fiction",
  "price": 450,
  "stock": 25,
  "description": "A family saga set in Kerala, winner of the Booker Prize",
  "publishedDate": "1997-04-01",
  "pages": 340
}
```

#### Search Books
```bash
GET /api/books?q=god&genre=Fiction&page=1&limit=5
```

#### Update Book Stock
```bash
PATCH /api/books/64f1a2b3c4d5e6f7g8h9i0j1/stock
Content-Type: application/json

{
  "stock": 30
}
```

## 🎨 Frontend Features

### 📊 Dashboard
- **Statistics Cards**: Total books, authors, orders
- **Low Stock Warnings**: Books with inventory < 10
- **Pending Orders**: Orders awaiting processing
- **Quick Actions**: Add new books, authors, view orders
- **Recent Activity**: Latest books and orders

### 📚 Books Management
- **Grid View**: Modern card-based layout
- **Search**: Real-time search with debouncing (500ms delay)
- **Filtering**: By genre with dropdown selection
- **Pagination**: Navigate through large datasets
- **CRUD Operations**: Create, read, update, delete books
- **Stock Management**: Update inventory with warnings

### 👨‍💼 Authors Management
- **Author Profiles**: Complete biographical information
- **Awards Display**: List of achievements and recognition
- **Book Relationships**: View books by each author
- **Nationality Filtering**: Filter by author's country
- **CRUD Operations**: Full author management

### 🛒 Orders Management
- **Order Details**: Complete order information
- **Status Tracking**: Update order status (pending → delivered)
- **Customer Information**: Name, email, phone, address
- **Order Items**: Detailed breakdown with quantities and prices
- **Financial Summary**: Subtotal, tax, shipping, total

## 🌍 Indian Context Features

### 💰 Currency
- All prices displayed in **Indian Rupees (₹)**
- Realistic Indian book pricing
- Tax and shipping calculations in INR

### 📖 Content
- **Indian Authors**: R.K. Narayan, Arundhati Roy, Vikram Seth, Chetan Bhagat, Amitav Ghosh, Ruskin Bond
- **Indian Literature**: Focus on Indian novels and stories
- **Local Context**: Indian customer names, addresses, and phone numbers

### 🎯 Educational Value
- **University Project**: Designed for academic learning
- **Code Comments**: Extensive documentation for learning
- **Best Practices**: Demonstrates modern web development patterns
- **Real-world Application**: Practical bookstore management scenario

## 🧪 Testing

### Backend Testing
```bash
# Test MongoDB Atlas connection
npm run test-connection

# Test all API endpoints
npm run test-api

# Create sample data
npm run demo-data

# Run comprehensive endpoint demo
npm run demo
```

### Frontend Testing
1. **Manual Testing**: Use the web interface at `http://localhost:3001`
2. **Search Testing**: Try searching for books with different terms
3. **CRUD Testing**: Create, edit, and delete books/authors/orders
4. **Responsive Testing**: Test on different screen sizes

## 🚀 Available Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm run test-connection  # Test MongoDB Atlas connection
npm run test-api   # Test all API endpoints
npm run demo-data  # Create sample data
npm run demo       # Run comprehensive demo
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🎓 Learning Objectives

This project demonstrates understanding of:

### Backend Development
- **RESTful API Design**: Proper HTTP methods, status codes, resource naming
- **Database Design**: MongoDB schemas, relationships, validation
- **Node.js/Express**: Middleware, routing, error handling
- **Cloud Databases**: MongoDB Atlas integration
- **Environment Configuration**: Secure credential management

### Frontend Development
- **React Fundamentals**: Components, hooks, state management
- **Modern JavaScript**: ES6+, async/await, destructuring
- **API Integration**: HTTP requests, error handling, loading states
- **Responsive Design**: CSS Grid, Flexbox, media queries
- **User Experience**: Form validation, feedback, accessibility

### Full-Stack Integration
- **API Communication**: Frontend-backend data flow
- **State Management**: Client-side data handling
- **Error Handling**: Graceful error management across stack
- **Performance**: Debounced search, pagination, optimization

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```bash
# Test your connection
npm run test-connection

# Check your .env file
# Verify MongoDB Atlas credentials
# Ensure IP whitelist includes your address
```

#### Port Already in Use
```bash
# Kill existing Node processes
taskkill /f /im node.exe  # Windows
killall node             # macOS/Linux

# Or use different port in .env
PORT=3001
```

#### Frontend Not Loading
```bash
# Check if backend is running on port 3000
# Verify API calls in browser console
# Check network tab for failed requests
```

## 📚 Additional Resources

- **MongoDB Atlas Documentation**: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- **React Documentation**: [https://react.dev/](https://react.dev/)
- **Express.js Guide**: [https://expressjs.com/](https://expressjs.com/)
- **Vite Documentation**: [https://vitejs.dev/](https://vitejs.dev/)

## 📄 License

This project is created for educational purposes as part of a university assignment.

## 👨‍💻 Author

**Jivanshu** - University Student
*Full-Stack Web Development Course*

---

**Project Status**: ✅ Complete and Ready for Deployment
**Last Updated**: 2024
**Version**: 1.0.0
