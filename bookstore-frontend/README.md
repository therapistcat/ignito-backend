# 📚 Bookstore Management Frontend

A React frontend application for the Bookstore Management System built with Vite. This provides a user-friendly interface for managing books, authors, and orders.

**Author:** University Student  
**Course:** Frontend Development  
**Project Type:** University Assignment

## 🚀 Features

- **Modern React UI** with functional components and hooks
- **Responsive Design** that works on desktop and mobile
- **Real-time Data** integration with the backend API
- **Interactive Dashboard** with statistics and quick actions
- **Complete CRUD Operations** for all resources
- **Search and Filtering** capabilities
- **Form Validation** and error handling
- **Clean, Student-friendly Code** with extensive comments

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with responsive design

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Backend API** running on http://localhost:3000
- **Modern web browser**

## 🔧 Installation & Setup

### 1. Navigate to Frontend Directory
```bash
cd bookstore-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:3001`

### 4. Build for Production
```bash
npm run build
```

## 🌐 Application Structure

### Pages
- **Dashboard** (`/`) - Overview with statistics and quick actions
- **Books** (`/books`) - View, search, and manage books
- **Book Form** (`/books/new`, `/books/edit/:id`) - Add/edit books
- **Authors** (`/authors`) - View and manage authors
- **Author Form** (`/authors/new`, `/authors/edit/:id`) - Add/edit authors
- **Orders** (`/orders`) - View and manage orders

### Components
- **Navbar** - Navigation bar with active link highlighting
- **API Service** - Centralized API communication layer

## 📱 Features Overview

### Dashboard
- **Statistics Cards** showing total books, authors, orders
- **Warning Indicators** for low stock and pending orders
- **Quick Actions** for common tasks
- **Recent Activity** showing latest books and orders

### Books Management
- **Grid View** of all books with cover-like cards
- **Search Functionality** by title and description
- **Genre Filtering** with dropdown selection
- **Pagination** for large datasets
- **Stock Management** with low stock warnings
- **CRUD Operations** - Create, Read, Update, Delete

### Authors Management
- **Card Layout** showing author information
- **Nationality Filtering** 
- **Awards Display** for accomplished authors
- **Book Count** per author
- **Relationship Management** with books

### Orders Management
- **Detailed Order Cards** with all information
- **Status Management** with dropdown updates
- **Customer Information** display
- **Order Items** breakdown with totals
- **Status-based Actions** (delete only pending/cancelled)

## 🎨 Design Features

### Responsive Design
- **Mobile-first** approach
- **Flexible Grid** layouts
- **Collapsible Navigation** on small screens
- **Touch-friendly** buttons and controls

### User Experience
- **Loading States** with friendly messages
- **Error Handling** with retry options
- **Success Feedback** with alerts
- **Intuitive Navigation** with breadcrumbs
- **Accessibility** features with proper focus management

### Visual Design
- **Modern Card-based** layout
- **Consistent Color Scheme** with blue/purple gradients
- **Status Badges** with color coding
- **Hover Effects** and smooth transitions
- **Clean Typography** with good contrast

## 🔌 API Integration

The frontend communicates with the backend API through:

- **Axios HTTP Client** with interceptors
- **Centralized API Service** (`src/services/api.js`)
- **Error Handling** with user-friendly messages
- **Loading States** during API calls
- **Automatic Retries** for failed requests

### API Endpoints Used
- `GET /api/books` - Fetch books with filtering
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `PATCH /api/books/:id/stock` - Update stock
- `DELETE /api/books/:id` - Delete book
- Similar endpoints for authors and orders

## 📁 Project Structure

```
bookstore-frontend/
├── public/
│   ├── vite.svg              # App icon
│   └── index.html            # HTML template
├── src/
│   ├── components/
│   │   └── Navbar.jsx        # Navigation component
│   ├── pages/
│   │   ├── Dashboard.jsx     # Dashboard page
│   │   ├── Books.jsx         # Books listing
│   │   ├── BookForm.jsx      # Book create/edit form
│   │   ├── Authors.jsx       # Authors listing
│   │   ├── AuthorForm.jsx    # Author create/edit form
│   │   └── Orders.jsx        # Orders listing
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── App.jsx               # Main app component
│   ├── App.css               # App-specific styles
│   ├── index.css             # Global styles
│   └── main.jsx              # App entry point
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## 🎓 Learning Objectives

This project demonstrates:

1. **React Fundamentals** - Components, hooks, state management
2. **Modern JavaScript** - ES6+, async/await, destructuring
3. **API Integration** - HTTP requests, error handling, loading states
4. **Responsive Design** - CSS Grid, Flexbox, media queries
5. **User Experience** - Form validation, feedback, accessibility
6. **Code Organization** - Component structure, service layers
7. **Development Tools** - Vite, hot reloading, build optimization

## 🚨 Common Issues & Solutions

### Backend Connection Issues
- Ensure backend is running on `http://localhost:3000`
- Check CORS configuration in backend
- Verify API endpoints are accessible

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Ensure all dependencies are properly installed

### Styling Issues
- Check CSS import statements
- Verify responsive breakpoints
- Test on different screen sizes

## 🔮 Future Enhancements

Potential improvements:
- **State Management** with Redux or Context API
- **Form Libraries** like Formik or React Hook Form
- **UI Component Library** like Material-UI or Chakra UI
- **Testing** with Jest and React Testing Library
- **TypeScript** for better type safety
- **PWA Features** for offline functionality
- **Dark Mode** theme switching
- **Internationalization** for multiple languages

## 📞 Development Notes

### Student-Friendly Features
- **Extensive Comments** explaining React concepts
- **Clear Component Structure** following best practices
- **Error Boundaries** for graceful error handling
- **Console Logging** for debugging assistance
- **Readable Code** with descriptive variable names

### Performance Considerations
- **Lazy Loading** for route components
- **Memoization** for expensive calculations
- **Optimized Re-renders** with proper dependency arrays
- **Image Optimization** for better loading times

---

**Happy Coding! 🎉**

This frontend provides a complete, production-ready interface for the bookstore management system while serving as an excellent learning resource for React development.
