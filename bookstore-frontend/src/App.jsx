/**
 * Main App Component
 * Handles routing and overall layout for the Bookstore Management System
 */

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Authors from './pages/Authors'
import Orders from './pages/Orders'
import BookForm from './pages/BookForm'
import AuthorForm from './pages/AuthorForm'
import './App.css'

function App() {
  return (
    <div className="App">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          {/* Dashboard - Home page */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Books Management */}
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/edit/:id" element={<BookForm />} />
          
          {/* Authors Management */}
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/new" element={<AuthorForm />} />
          <Route path="/authors/edit/:id" element={<AuthorForm />} />
          
          {/* Orders Management */}
          <Route path="/orders" element={<Orders />} />
          
          {/* 404 Page */}
          <Route path="*" element={
            <div className="not-found">
              <h2>📚 Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
